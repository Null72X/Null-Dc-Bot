import { Schema, model } from 'mongoose';
import { IGuildSettings } from '@null-bot/types';

const GuildSettingsSchema = new Schema<IGuildSettings>(
  {
    guildId: { type: String, required: true, unique: true, index: true },
    prefix: { type: String, default: '!' },
    embedColor: { type: String, default: '#5865F2' },
    disabledCommands: { type: [String], default: [] },
    adminRoles: { type: [String], default: [] },
    modRoles: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const GuildSettingsModel = model<IGuildSettings>('GuildSettings', GuildSettingsSchema);
