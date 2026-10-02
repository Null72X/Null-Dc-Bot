import { Guild, GuildMember, GuildAuditLogsEntry, AuditLogEvent, PermissionFlagsBits, TextChannel } from 'discord.js';
import { guildCache, SecurityIncidentModel } from '@null-bot/database';
import { createScopedLogger } from '@null-bot/logger';
import { createEmbed } from '@null-bot/shared';
import crypto from 'crypto';

const logger = createScopedLogger('AntiRaidService');

// Tracker for member join bursts
const joinTrackers = new Map<string, number[]>();
// Tracker for anti-nuke audit actions: guildId:executorId:actionType -> timestamps[]
const nukeTrackers = new Map<string, number[]>();

export class AntiRaidService {
  /**
   * Evaluates member joins for Anti-Raid bursts
   */
  public static async handleMemberJoin(member: GuildMember): Promise<void> {
    const guild = member.guild;
    const secConfig = await guildCache.getSecurityConfig(guild.id);
    if (!secConfig || !secConfig.enabled || !secConfig.antiRaid?.enabled) return;

    const userKey = guild.id;
    const now = Date.now();
    const joins = joinTrackers.get(userKey) || [];
    const windowStart = now - secConfig.antiRaid.intervalMs;
    const validJoins = joins.filter((t) => t > windowStart);
    validJoins.push(now);
    joinTrackers.set(userKey, validJoins);

    if (validJoins.length >= secConfig.antiRaid.joinThreshold) {
      joinTrackers.delete(userKey);
      await this.triggerSecurityAction(guild, 'Anti-Raid Burst Triggered', `Detected ${validJoins.length} joins within ${secConfig.antiRaid.intervalMs / 1000} seconds.`, member.user?.tag || member.id, member.id, secConfig.antiRaid.action);
    }
  }

  /**
   * Evaluates Audit Log actions for Anti-Nuke (Channel/Role deletion, Mass Bans, Webhooks)
   */
  public static async handleAuditLogEntry(entry: GuildAuditLogsEntry, guild: Guild): Promise<void> {
    const secConfig = await guildCache.getSecurityConfig(guild.id);
    if (!secConfig || !secConfig.enabled || !secConfig.antiNuke?.enabled) return;

    if (!entry.executor || entry.executor.bot) return;
    if (secConfig.exemptUsers?.includes(entry.executor.id)) return;

    const executorId = entry.executor.id;
    const executorTag = entry.executor.tag || entry.executor.username || 'Unknown';
    let actionType = '';
    let threshold = 0;

    switch (entry.action) {
      case AuditLogEvent.ChannelDelete:
        actionType = 'CHANNEL_DELETE';
        threshold = secConfig.antiNuke.maxChannelDelete;
        break;
      case AuditLogEvent.ChannelCreate:
        actionType = 'CHANNEL_CREATE';
        threshold = secConfig.antiNuke.maxChannelCreate;
        break;
      case AuditLogEvent.RoleDelete:
        actionType = 'ROLE_DELETE';
        threshold = secConfig.antiNuke.maxRoleDelete;
        break;
      case AuditLogEvent.RoleCreate:
        actionType = 'ROLE_CREATE';
        threshold = secConfig.antiNuke.maxRoleCreate;
        break;
      case AuditLogEvent.MemberBanAdd:
        actionType = 'MEMBER_BAN';
        threshold = secConfig.antiNuke.maxBanCount;
        break;
      case AuditLogEvent.WebhookCreate:
        actionType = 'WEBHOOK_CREATE';
        threshold = secConfig.antiNuke.maxWebhookCreate;
        break;
      default:
        return;
    }

    const trackerKey = `${guild.id}:${executorId}:${actionType}`;
    const now = Date.now();
    const timestamps = nukeTrackers.get(trackerKey) || [];
    const windowStart = now - secConfig.antiNuke.timeWindowMs;
    const validEvents = timestamps.filter((t) => t > windowStart);
    validEvents.push(now);
    nukeTrackers.set(trackerKey, validEvents);

    if (validEvents.length >= threshold) {
      nukeTrackers.delete(trackerKey);
      await this.triggerSecurityAction(
        guild,
        `Anti-Nuke Triggered (${actionType})`,
        `User ${executorTag} executed ${validEvents.length} ${actionType} actions in ${secConfig.antiNuke.timeWindowMs / 1000}s.`,
        executorTag,
        executorId,
        secConfig.antiNuke.action || 'BAN_OFFENDER'
      );
    }
  }

  private static async triggerSecurityAction(
    guild: Guild,
    title: string,
    details: string,
    executorTag: string,
    executorId: string,
    action: string
  ): Promise<void> {
    const incidentId = `INC-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    logger.warn(`🚨 SECURITY INCIDENT: ${title}`, { guildId: guild.id, executorId, action });

    // Save incident to MongoDB
    await SecurityIncidentModel.create({
      guildId: guild.id,
      incidentId,
      type: title,
      executorId,
      executorTag,
      actionTaken: action,
      details,
    });

    // Execute security punishment
    const offenderMember = executorId ? await guild.members.fetch(executorId).catch(() => null) : null;
    const botMember = guild.members.me;

    if (offenderMember && botMember) {
      if (action === 'BAN_OFFENDER' && offenderMember.bannable) {
        await offenderMember.ban({ reason: `SECURITY LOCK: ${title}` }).catch(() => {});
      } else if (action === 'REMOVE_ROLES' && offenderMember.manageable) {
        await offenderMember.roles.set([], `SECURITY LOCK: ${title}`).catch(() => {});
      }
    }

    // Lock server if action is LOCKDOWN
    if (action === 'LOCKDOWN') {
      const defaultRole = guild.roles.everyone;
      await defaultRole.setPermissions(defaultRole.permissions.remove(PermissionFlagsBits.SendMessages)).catch(() => {});
    }

    // Log to Security Channel if configured
    const secConfig = await guildCache.getSecurityConfig(guild.id);
    if (secConfig?.logChannelId) {
      const channel = (await guild.channels.fetch(secConfig.logChannelId).catch(() => null)) as TextChannel | null;
      if (channel) {
        await channel.send({
          embeds: [
            createEmbed({
              title: `🚨 ${title}`,
              description: `**Incident ID:** \`${incidentId}\`\n**Executor:** ${executorTag} (${executorId})\n**Details:** ${details}\n**Action Taken:** \`${action}\``,
              color: '#ED4245',
            }),
          ],
        }).catch(() => {});
      }
    }
  }
}
