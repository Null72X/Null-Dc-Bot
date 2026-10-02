import { GuildMember, TextChannel } from 'discord.js';
import { AntiRaidService } from '../services/AntiRaidService.js';
import { LoggingService } from '../services/LoggingService.js';
import { guildCache } from '@null-bot/database';
import { createEmbed, formatPlaceholders } from '@null-bot/shared';

export async function handleGuildMemberAdd(member: any): Promise<void> {
  // 1. Anti-Raid check
  await AntiRaidService.handleMemberJoin(member);

  // 2. Logging
  await LoggingService.logEvent(
    member.guild,
    'member',
    '📥 Member Joined',
    `**User:** ${member.user.tag} (${member.id})\n**Account Created:** <t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`,
    undefined,
    '#57F287'
  );

  // 3. Welcome Message
  const config = await guildCache.getWelcomeConfig(member.guild.id);
  if (config && config.welcomeEnabled && config.welcomeChannelId) {
    const channel = (await member.guild.channels.fetch(config.welcomeChannelId).catch(() => null)) as TextChannel | null;
    if (channel) {
      const text = formatPlaceholders(config.welcomeMessage, {
        user: member.user,
        guild: { name: member.guild.name, memberCount: member.guild.memberCount },
      });

      if (config.welcomeEmbedEnabled) {
        const embed = createEmbed({
          title: `👋 Welcome to ${member.guild.name}!`,
          description: text,
          thumbnailUrl: member.user.displayAvatarURL(),
          color: '#57F287',
        });
        await channel.send({ embeds: [embed] }).catch(() => {});
      } else {
        await channel.send({ content: text }).catch(() => {});
      }
    }
  }
}

export async function handleGuildMemberRemove(member: any): Promise<void> {
  // 1. Logging
  await LoggingService.logEvent(
    member.guild,
    'member',
    '📤 Member Left',
    `**User:** ${member.user.tag} (${member.id})`,
    undefined,
    '#ED4245'
  );

  // 2. Goodbye Message
  const config = await guildCache.getWelcomeConfig(member.guild.id);
  if (config && config.goodbyeEnabled && config.goodbyeChannelId) {
    const channel = (await member.guild.channels.fetch(config.goodbyeChannelId).catch(() => null)) as TextChannel | null;
    if (channel) {
      const text = formatPlaceholders(config.goodbyeMessage, {
        user: member.user,
        guild: { name: member.guild.name, memberCount: member.guild.memberCount },
      });

      if (config.goodbyeEmbedEnabled) {
        const embed = createEmbed({
          title: `👋 Goodbye from ${member.guild.name}`,
          description: text,
          color: '#ED4245',
        });
        await channel.send({ embeds: [embed] }).catch(() => {});
      } else {
        await channel.send({ content: text }).catch(() => {});
      }
    }
  }
}
