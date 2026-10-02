import { Guild, ChannelType } from 'discord.js';
import { ServerBackupModel } from '@null-bot/database';
import { createScopedLogger } from '@null-bot/logger';
import crypto from 'crypto';

const logger = createScopedLogger('BackupService');

export class BackupService {
  public static async createBackup(guild: Guild, userId: string, name: string): Promise<string> {
    const backupId = `BAK-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const rolesData = guild.roles.cache
      .filter((r) => !r.managed && r.id !== guild.roles.everyone.id)
      .map((r) => ({
        name: r.name,
        color: r.color,
        hoist: r.hoist,
        permissions: r.permissions.bitfield.toString(),
      }));

    const channelsData = guild.channels.cache
      .filter((c) => c.type === ChannelType.GuildText || c.type === ChannelType.GuildVoice || c.type === ChannelType.GuildCategory)
      .map((c) => ({
        name: c.name,
        type: c.type,
        topic: 'topic' in c ? (c.topic || undefined) : undefined,
        parentName: c.parent ? c.parent.name : undefined,
      }));

    await ServerBackupModel.create({
      backupId,
      guildId: guild.id,
      createdById: userId,
      name,
      data: {
        roles: rolesData,
        channels: channelsData,
        guildName: guild.name,
      },
    });

    return backupId;
  }

  public static async restoreBackup(guild: Guild, backupId: string): Promise<void> {
    const backup = await ServerBackupModel.findOne({ backupId, guildId: guild.id });
    if (!backup) throw new Error('Backup not found or does not belong to this server.');

    // 1. Create missing roles safely
    for (const r of backup.data.roles) {
      const exists = guild.roles.cache.some((existing) => existing.name === r.name);
      if (!exists) {
        await guild.roles.create({
          name: r.name,
          color: r.color,
          hoist: r.hoist,
          reason: `Restored from backup ${backupId}`,
        }).catch(() => {});
      }
    }

    // 2. Create missing channels safely
    for (const c of backup.data.channels) {
      const exists = guild.channels.cache.some((existing) => existing.name === c.name);
      if (!exists) {
        await guild.channels.create({
          name: c.name,
          type: c.type,
          topic: c.topic,
          reason: `Restored from backup ${backupId}`,
        }).catch(() => {});
      }
    }
  }
}
