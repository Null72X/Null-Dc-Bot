import { Schema, model } from 'mongoose';
import { IAutoResponder } from '@null-bot/types';

const AutoResponderSchema = new Schema<IAutoResponder>(
  {
    guildId: { type: String, required: true, index: true },
    triggerId: { type: String, required: true, unique: true },
    trigger: { type: String, required: true },
    response: { type: String, required: true },
    matchType: { type: String, enum: ['EXACT', 'CONTAINS', 'REGEX'], default: 'EXACT' },
    caseSensitive: { type: Boolean, default: false },
    isEmbed: { type: Boolean, default: false },
    allowedChannels: { type: [String], default: [] },
    allowedRoles: { type: [String], default: [] },
    cooldownSeconds: { type: Number, default: 5 },
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const AutoResponderModel = model<IAutoResponder>('AutoResponder', AutoResponderSchema);
