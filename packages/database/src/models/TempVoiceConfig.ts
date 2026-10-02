import { Schema, model } from 'mongoose';
import { ITempVoiceConfig, IServerBackup } from '@null-bot/types';

const TempVoiceConfigSchema = new Schema<ITempVoiceConfig>(
  {
    guildId: { type: String, required: true, unique: true, index: true },
    enabled: { type: Boolean, default: false },
    joinChannelId: { type: String },
    targetCategoryId: { type: String },
    channelNameTemplate: { type: String, default: "🔊 {user}'s Room" },
    userLimit: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ServerBackupSchema = new Schema<IServerBackup>(
  {
    backupId: { type: String, required: true, unique: true, index: true },
    guildId: { type: String, required: true, index: true },
    createdById: { type: String, required: true },
    name: { type: String, required: true },
    data: {
      roles: [{ name: String, color: Number, hoist: Boolean, permissions: String }],
      channels: [{ name: String, type: Number, topic: String, parentName: String }],
      guildName: String,
    },
  },
  { timestamps: true }
);

export const TempVoiceConfigModel = model<ITempVoiceConfig>('TempVoiceConfig', TempVoiceConfigSchema);
export const ServerBackupModel = model<IServerBackup>('ServerBackup', ServerBackupSchema);
