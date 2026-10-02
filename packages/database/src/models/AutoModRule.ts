import { Schema, model } from 'mongoose';
import { IAutoModRule } from '@null-bot/types';

const FilterSubSchema = new Schema(
  {
    enabled: { type: Boolean, default: false },
    threshold: { type: Number, default: 3 },
    action: { type: String, default: 'DELETE' },
    actionDuration: { type: Number, default: 300000 },
    exemptRoles: { type: [String], default: [] },
    exemptChannels: { type: [String], default: [] },
    whitelist: { type: [String], default: [] },
  },
  { _id: false }
);

const AutoModRuleSchema = new Schema<IAutoModRule>(
  {
    guildId: { type: String, required: true, unique: true, index: true },
    badWords: { type: FilterSubSchema, default: () => ({ words: [] }) },
    spam: { type: FilterSubSchema, default: () => ({ maxMessages: 5, intervalMs: 5000 }) },
    repeatedMessages: { type: FilterSubSchema, default: () => ({ maxDuplicates: 3 }) },
    mentions: { type: FilterSubSchema, default: () => ({ maxMentions: 5 }) },
    caps: { type: FilterSubSchema, default: () => ({ percentage: 70, minLength: 10 }) },
    invites: { type: FilterSubSchema, default: () => ({}) },
    links: { type: FilterSubSchema, default: () => ({}) },
    massMentions: { type: FilterSubSchema, default: () => ({ maxMentions: 10 }) },
    emojiSpam: { type: FilterSubSchema, default: () => ({ maxEmojis: 10 }) },
    attachmentSpam: { type: FilterSubSchema, default: () => ({ maxAttachments: 5 }) },
    nicknameFilter: { type: FilterSubSchema, default: () => ({ forbiddenWords: [] }) },
  },
  { timestamps: true }
);

export const AutoModRuleModel = model<IAutoModRule>('AutoModRule', AutoModRuleSchema);
