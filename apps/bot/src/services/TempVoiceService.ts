import { VoiceState, ChannelType, PermissionFlagsBits, VoiceChannel } from 'discord.js';
import { guildCache } from '@null-bot/database';
import { createScopedLogger } from '@null-bot/logger';

const logger = createScopedLogger('TempVoiceService');

// Track temp channels: channelId -> ownerUserId
const activeTempChannels = new Map<string, string>();

export class TempVoiceService {
  public static async handleVoiceStateUpdate(oldState: VoiceState, newState: VoiceState): Promise<void> {
    const guild = newState.guild || oldState.guild;
    const config = await guildCache.getTempVoiceConfig(guild.id);
    if (!config || !config.enabled || !config.joinChannelId) return;

    // 1. Join-to-Create Channel Joined
    if (newState.channelId === config.joinChannelId && newState.member) {
      const template = config.channelNameTemplate || "🔊 {user}'s Room";
      const channelName = template.replace(/{user}/g, newState.member.user.username);

      const tempChannel = await guild.channels.create({
        name: channelName,
        type: ChannelType.GuildVoice,
        parent: config.targetCategoryId || newState.channel?.parentId || undefined,
        userLimit: config.userLimit || undefined,
        permissionOverwrites: [
          {
            id: newState.member.id,
            allow: [
              PermissionFlagsBits.ManageChannels,
              PermissionFlagsBits.Connect,
              PermissionFlagsBits.Speak,
              PermissionFlagsBits.MuteMembers,
              PermissionFlagsBits.DeafenMembers,
            ],
          },
        ],
      });

      activeTempChannels.set(tempChannel.id, newState.member.id);
      await newState.member.voice.setChannel(tempChannel).catch(() => {});
    }

    // 2. Empty Temp Channel Left -> Auto-Delete
    if (oldState.channelId && oldState.channelId !== config.joinChannelId) {
      const channel = oldState.channel;
      if (channel && activeTempChannels.has(channel.id) && channel.members.size === 0) {
        activeTempChannels.delete(channel.id);
        await channel.delete('Temp voice channel empty').catch(() => {});
      }
    }
  }

  public static isTempChannel(channelId: string): boolean {
    return activeTempChannels.has(channelId);
  }

  public static getChannelOwner(channelId: string): string | undefined {
    return activeTempChannels.get(channelId);
  }
}
