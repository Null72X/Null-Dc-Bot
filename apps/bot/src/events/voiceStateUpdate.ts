import { VoiceState, GuildAuditLogsEntry, Guild } from 'discord.js';
import { TempVoiceService } from '../services/TempVoiceService.js';
import { AntiRaidService } from '../services/AntiRaidService.js';
import { LoggingService } from '../services/LoggingService.js';

export async function handleVoiceStateUpdate(oldState: VoiceState, newState: VoiceState): Promise<void> {
  await TempVoiceService.handleVoiceStateUpdate(oldState, newState);

  const guild = newState.guild || oldState.guild;
  if (newState.channelId && !oldState.channelId) {
    await LoggingService.logEvent(
      guild,
      'voice',
      '🔊 Voice Join',
      `**User:** ${newState.member?.user.tag}\n**Channel:** <#${newState.channelId}>`
    );
  } else if (!newState.channelId && oldState.channelId) {
    await LoggingService.logEvent(
      guild,
      'voice',
      '🔇 Voice Leave',
      `**User:** ${oldState.member?.user.tag}\n**Channel:** <#${oldState.channelId}>`
    );
  }
}

export async function handleAuditLogEntryCreate(entry: GuildAuditLogsEntry, guild: Guild): Promise<void> {
  await AntiRaidService.handleAuditLogEntry(entry, guild);
}
