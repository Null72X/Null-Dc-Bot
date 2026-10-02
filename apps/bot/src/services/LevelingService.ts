import { Message, GuildMember, TextChannel } from 'discord.js';
import { LevelModel, LevelConfigModel, guildCache } from '@null-bot/database';
import { createScopedLogger } from '@null-bot/logger';
import { createEmbed, formatPlaceholders } from '@null-bot/shared';

const logger = createScopedLogger('LevelingService');

// Tracker for XP cooldown per user: userId -> lastTimestamp
const cooldownTracker = new Map<string, number>();

export class LevelingService {
  /**
   * Calculates level from XP
   */
  public static calculateLevel(xp: number): number {
    return Math.floor(0.1 * Math.sqrt(xp));
  }

  /**
   * Calculates required total XP for a given level
   */
  public static calculateXpForLevel(level: number): number {
    return Math.pow(level / 0.1, 2);
  }

  /**
   * Processes XP for a message
   */
  public static async handleMessageXp(message: Message): Promise<void> {
    if (!message.guild || message.author.bot || !message.member) return;

    const guildId = message.guild.id;
    const config = await guildCache.getLevelConfig(guildId);
    if (!config || !config.enabled) return;

    const member = message.member;

    // Check excluded channels or roles
    if (config.excludedChannels?.includes(message.channel.id)) return;
    if (config.excludedRoles?.some((r) => member.roles.cache.has(r))) return;

    const cooldownKey = `${guildId}:${message.author.id}`;
    const now = Date.now();
    const lastXp = cooldownTracker.get(cooldownKey) || 0;
    if (now - lastXp < config.cooldownSeconds * 1000) return;

    cooldownTracker.set(cooldownKey, now);

    const xpGained = Math.floor(Math.random() * 10) + config.xpRate;

    let userLevel = await LevelModel.findOne({ guildId, userId: message.author.id });
    if (!userLevel) {
      userLevel = new LevelModel({
        guildId,
        userId: message.author.id,
        xp: 0,
        level: 0,
        messagesCount: 0,
      });
    }

    const oldLevel = userLevel.level;
    userLevel.xp += xpGained;
    userLevel.messagesCount += 1;
    const newLevel = this.calculateLevel(userLevel.xp);
    userLevel.level = newLevel;

    await userLevel.save();

    // Check Level Up
    if (newLevel > oldLevel) {
      await this.handleLevelUp(message.guild, member, newLevel, config, message.channel as TextChannel);
    }
  }

  private static async handleLevelUp(
    guild: any,
    member: GuildMember,
    newLevel: number,
    config: any,
    currentChannel: TextChannel
  ): Promise<void> {
    // 1. Role Rewards
    if (config.rewards && config.rewards.length > 0) {
      const reward = config.rewards.find((r: any) => r.level === newLevel);
      if (reward && reward.roleId) {
        const role = await guild.roles.fetch(reward.roleId).catch(() => null);
        if (role) {
          await member.roles.add(role).catch(() => {});
        }
      }
    }

    // 2. Level Up Announcement
    const levelMsgTemplate = config.levelUpMessage || '🎉 Congratulations {mention}! You have reached **Level {level}**!';
    const formattedMsg = formatPlaceholders(levelMsgTemplate, {
      user: member.user,
      guild: { name: guild.name, memberCount: guild.memberCount },
    }).replace(/{level}/g, newLevel.toString());

    let targetChannel: TextChannel | null = currentChannel;
    if (config.levelUpChannelId) {
      const configuredChan = await guild.channels.fetch(config.levelUpChannelId).catch(() => null);
      if (configuredChan && configuredChan.isTextBased()) {
        targetChannel = configuredChan as TextChannel;
      }
    }

    if (targetChannel) {
      await targetChannel.send({
        embeds: [
          createEmbed({
            title: '⭐ Level Up!',
            description: formattedMsg,
            color: '#FEE75C',
          }),
        ],
      }).catch(() => {});
    }
  }
}
