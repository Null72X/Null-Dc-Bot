import { Schema, model } from 'mongoose';
import { ILoggingConfig } from '@null-bot/types';

const LoggingConfigSchema = new Schema<ILoggingConfig>(
  {
    guildId: { type: String, required: true, unique: true, index: true },
    enabled: { type: Boolean, default: true },
    messageLogChannelId: { type: String },
    memberLogChannelId: { type: String },
    voiceLogChannelId: { type: String },
    roleLogChannelId: { type: String },
    channelLogChannelId: { type: String },
    serverLogChannelId: { type: String },
    modLogChannelId: { type: String },
  },
  { timestamps: true }
);

export const LoggingConfigModel = model<ILoggingConfig>('LoggingConfig', LoggingConfigSchema);
