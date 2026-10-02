import { Schema, model } from 'mongoose';
import { ILevel, ILevelConfig } from '@null-bot/types';

const LevelRewardSchema = new Schema({
  guildId: { type: String, required: true },
  level: { type: Number, required: true },
  roleId: { type: String, required: true },
});

const LevelConfigSchema = new Schema<ILevelConfig>(
  {
    guildId: { type: String, required: true, unique: true, index: true },
    enabled: { type: Boolean, default: true },
    xpRate: { type: Number, default: 20 },
    cooldownSeconds: { type: Number, default: 60 },
    voiceXpEnabled: { type: Boolean, default: true },
    voiceXpPerMinute: { type: Number, default: 10 },
    levelUpChannelId: { type: String },
    levelUpMessage: { type: String, default: '🎉 Congratulations {mention}! You have leveled up to **Level {level}**!' },
    excludedChannels: { type: [String], default: [] },
    excludedRoles: { type: [String], default: [] },
    decayEnabled: { type: Boolean, default: false },
    decayPercentage: { type: Number, default: 5 },
    rewards: [LevelRewardSchema],
  },
  { timestamps: true }
);

const LevelSchema = new Schema<ILevel>(
  {
    guildId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
    messagesCount: { type: Number, default: 0 },
    voiceMinutes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

LevelSchema.index({ guildId: 1, userId: 1 }, { unique: true });
LevelSchema.index({ guildId: 1, xp: -1 });

export const LevelConfigModel = model<ILevelConfig>('LevelConfig', LevelConfigSchema);
export const LevelModel = model<ILevel>('Level', LevelSchema);
