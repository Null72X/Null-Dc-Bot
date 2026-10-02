import { Guild, TextChannel, ColorResolvable } from 'discord.js';
import { guildCache } from '@null-bot/database';
import { createEmbed } from '@null-bot/shared';
import { createScopedLogger } from '@null-bot/logger';

const logger = createScopedLogger('LoggingService');

export type LogCategory =
  | 'message'
  | 'member'
  | 'voice'
  | 'role'
  | 'channel'
  | 'server'
  | 'mod';

export class LoggingService {
  public static async logEvent(
    guild: Guild,
    category: LogCategory,
    title: string,
    description: string,
    fields?: Array<{ name: string; value: string; inline?: boolean }>,
    color: ColorResolvable = '#5865F2'
  ): Promise<void> {
    try {
      const config = await guildCache.getLoggingConfig(guild.id);
      if (!config || !config.enabled) return;

      let channelId: string | undefined;

      switch (category) {
        case 'message': channelId = config.messageLogChannelId; break;
        case 'member': channelId = config.memberLogChannelId; break;
        case 'voice': channelId = config.voiceLogChannelId; break;
        case 'role': channelId = config.roleLogChannelId; break;
        case 'channel': channelId = config.channelLogChannelId; break;
        case 'server': channelId = config.serverLogChannelId; break;
        case 'mod': channelId = config.modLogChannelId; break;
      }

      if (!channelId) return;

      const channel = (await guild.channels.fetch(channelId).catch(() => null)) as TextChannel | null;
      if (!channel) return;

      const embed = createEmbed({
        title,
        description,
        fields,
        color,
      });

      await channel.send({ embeds: [embed] }).catch(() => {});
    } catch (err) {
      logger.error(`Error sending ${category} log:`, { error: err });
    }
  }
}
