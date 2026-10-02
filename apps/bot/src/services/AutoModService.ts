import { Message, GuildMember, PermissionFlagsBits } from 'discord.js';
import { guildCache, ModerationCaseModel } from '@null-bot/database';
import { createScopedLogger } from '@null-bot/logger';
import { createEmbed, canModerate } from '@null-bot/shared';

const logger = createScopedLogger('AutoModService');

// Map for tracking message bursts per user: userId -> timestamps array
const messageTimestamps = new Map<string, number[]>();
// Map for tracking duplicate messages: userId -> { content: string, count: number }
const duplicateTracker = new Map<string, { content: string; count: number }>();

export class AutoModService {
  public static async processMessage(message: Message): Promise<boolean> {
    if (!message.guild || message.author.bot || !message.member) return false;

    // Skip if administrator or exempted permissions
    if (message.member.permissions.has(PermissionFlagsBits.Administrator) || message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return false;
    }

    const guildId = message.guild.id;
    const rule = await guildCache.getAutoModRule(guildId);
    if (!rule) return false;

    const content = message.content;
    const member = message.member;

    // Check exempt channels/roles
    const isExempt = (exemptChannels?: string[], exemptRoles?: string[]) => {
      if (exemptChannels?.includes(message.channel.id)) return true;
      if (exemptRoles?.some((roleId) => member.roles.cache.has(roleId))) return true;
      return false;
    };

    // 1. Bad Words Filter
    if (rule.badWords?.enabled && !isExempt(rule.badWords.exemptChannels, rule.badWords.exemptRoles)) {
      const lower = content.toLowerCase();
      const matchedWord = rule.badWords.words.find((w) => lower.includes(w.toLowerCase()));
      if (matchedWord) {
        await this.handlePunishment(message, 'Bad Words Filter', `Contained prohibited phrase: "${matchedWord}"`, rule.badWords.action, rule.badWords.actionDuration);
        return true;
      }
    }

    // 2. Invites Filter
    if (rule.invites?.enabled && !isExempt(rule.invites.exemptChannels, rule.invites.exemptRoles)) {
      const inviteRegex = /(discord\.(gg|io|me|li)|discordapp\.com\/invite|discord\.com\/invite)\/[a-zA-Z0-9]+/i;
      if (inviteRegex.test(content)) {
        await this.handlePunishment(message, 'Discord Invite Filter', 'Posted unauthorized Discord invite link.', rule.invites.action, rule.invites.actionDuration);
        return true;
      }
    }

    // 3. External Links Filter
    if (rule.links?.enabled && !isExempt(rule.links.exemptChannels, rule.links.exemptRoles)) {
      const urlRegex = /https?:\/\/[^\s]+/gi;
      const matches = content.match(urlRegex);
      if (matches) {
        const isWhitelisted = matches.every((url) => {
          return rule.links.whitelist?.some((domain) => url.includes(domain));
        });
        if (!isWhitelisted) {
          await this.handlePunishment(message, 'External Links Filter', 'Posted unauthorized external URL.', rule.links.action, rule.links.actionDuration);
          return true;
        }
      }
    }

    // 4. Excessive Mentions / Mass Mentions
    if (rule.mentions?.enabled && !isExempt(rule.mentions.exemptChannels, rule.mentions.exemptRoles)) {
      const mentionCount = message.mentions.users.size + message.mentions.roles.size;
      if (mentionCount >= rule.mentions.maxMentions) {
        await this.handlePunishment(message, 'Mass Mentions Filter', `Exceeded maximum mentions limit (${mentionCount}/${rule.mentions.maxMentions}).`, rule.mentions.action, rule.mentions.actionDuration);
        return true;
      }
    }

    // 5. Caps Filter
    if (rule.caps?.enabled && content.length >= rule.caps.minLength && !isExempt(rule.caps.exemptChannels, rule.caps.exemptRoles)) {
      const capsCount = content.replace(/[^A-Z]/g, '').length;
      const percentage = (capsCount / content.length) * 100;
      if (percentage >= rule.caps.percentage) {
        await this.handlePunishment(message, 'Excessive Caps Filter', `Excessive capital letters (${percentage.toFixed(0)}%).`, rule.caps.action, rule.caps.actionDuration);
        return true;
      }
    }

    // 6. Fast Message Spam / Bursts
    if (rule.spam?.enabled && !isExempt(rule.spam.exemptChannels, rule.spam.exemptRoles)) {
      const userKey = `${guildId}:${message.author.id}`;
      const now = Date.now();
      const timestamps = messageTimestamps.get(userKey) || [];
      const windowStart = now - rule.spam.intervalMs;
      const validTimestamps = timestamps.filter((t) => t > windowStart);
      validTimestamps.push(now);
      messageTimestamps.set(userKey, validTimestamps);

      if (validTimestamps.length > rule.spam.maxMessages) {
        messageTimestamps.delete(userKey);
        await this.handlePunishment(message, 'Spam Burst Filter', `Sent ${validTimestamps.length} messages in ${rule.spam.intervalMs / 1000}s.`, rule.spam.action, rule.spam.actionDuration);
        return true;
      }
    }

    // 7. Duplicate Messages
    if (rule.repeatedMessages?.enabled && !isExempt(rule.repeatedMessages.exemptChannels, rule.repeatedMessages.exemptRoles)) {
      const userKey = `${guildId}:${message.author.id}`;
      const tracked = duplicateTracker.get(userKey);
      if (tracked && tracked.content === content) {
        tracked.count += 1;
        if (tracked.count >= rule.repeatedMessages.maxDuplicates) {
          duplicateTracker.delete(userKey);
          await this.handlePunishment(message, 'Duplicate Message Filter', `Repeated same message ${tracked.count} times.`, rule.repeatedMessages.action, rule.repeatedMessages.actionDuration);
          return true;
        }
      } else {
        duplicateTracker.set(userKey, { content, count: 1 });
      }
    }

    return false;
  }

  private static async handlePunishment(
    message: Message,
    filterName: string,
    reason: string,
    action: string,
    durationMs?: number
  ): Promise<void> {
    try {
      if (message.deletable) {
        await message.delete().catch(() => {});
      }

      const guild = message.guild!;
      const member = message.member!;
      const botMember = guild.members.me;

      // Notify user in channel briefly
      const warningMsg = (message.channel && 'send' in message.channel)
        ? await (message.channel as any).send({
            embeds: [
              createEmbed({
                title: `🛡️ AutoMod Action: ${filterName}`,
                description: `<@${message.author.id}>, your message was flagged: ${reason}`,
                color: '#ED4245',
              }),
            ],
          }).catch(() => null)
        : null;

      if (warningMsg) {
        setTimeout(() => warningMsg.delete().catch(() => {}), 5000);
      }

      // Execute punishment if higher action configured
      if (action === 'DELETE') return;

      if (!botMember || !canModerate(botMember as any, member as any).canAction) return;

      const caseCount = await ModerationCaseModel.countDocuments({ guildId: guild.id });
      const caseId = caseCount + 1;

      if (action === 'WARN') {
        await ModerationCaseModel.create({
          guildId: guild.id,
          caseId,
          targetId: member.id,
          targetTag: member.user.tag,
          moderatorId: botMember.id,
          moderatorTag: botMember.user.tag,
          type: 'WARN',
          reason: `AutoMod: ${filterName} — ${reason}`,
          active: true,
        });
      } else if (action === 'TIMEOUT' && durationMs) {
        await member.timeout(durationMs, `AutoMod: ${filterName} — ${reason}`).catch(() => {});
        await ModerationCaseModel.create({
          guildId: guild.id,
          caseId,
          targetId: member.id,
          targetTag: member.user.tag,
          moderatorId: botMember.id,
          moderatorTag: botMember.user.tag,
          type: 'TIMEOUT',
          reason: `AutoMod: ${filterName} — ${reason}`,
          duration: durationMs,
          expiresAt: new Date(Date.now() + durationMs),
          active: true,
        });
      } else if (action === 'KICK') {
        await member.kick(`AutoMod: ${filterName} — ${reason}`).catch(() => {});
        await ModerationCaseModel.create({
          guildId: guild.id,
          caseId,
          targetId: member.id,
          targetTag: member.user.tag,
          moderatorId: botMember.id,
          moderatorTag: botMember.user.tag,
          type: 'KICK',
          reason: `AutoMod: ${filterName} — ${reason}`,
          active: true,
        });
      } else if (action === 'BAN') {
        await member.ban({ reason: `AutoMod: ${filterName} — ${reason}` }).catch(() => {});
        await ModerationCaseModel.create({
          guildId: guild.id,
          caseId,
          targetId: member.id,
          targetTag: member.user.tag,
          moderatorId: botMember.id,
          moderatorTag: botMember.user.tag,
          type: 'BAN',
          reason: `AutoMod: ${filterName} — ${reason}`,
          active: true,
        });
      }
    } catch (err) {
      logger.error('Error enforcing AutoMod punishment:', { error: err });
    }
  }
}
