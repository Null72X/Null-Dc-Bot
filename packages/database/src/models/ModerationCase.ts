import { Schema, model } from 'mongoose';
import { IModerationCase } from '@null-bot/types';

const ModerationCaseSchema = new Schema<IModerationCase>(
  {
    guildId: { type: String, required: true, index: true },
    caseId: { type: Number, required: true },
    targetId: { type: String, required: true, index: true },
    targetTag: { type: String, required: true },
    moderatorId: { type: String, required: true },
    moderatorTag: { type: String, required: true },
    type: { type: String, required: true },
    reason: { type: String, default: 'No reason provided.' },
    duration: { type: Number, default: null },
    expiresAt: { type: Date, default: null, index: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ModerationCaseSchema.index({ guildId: 1, caseId: 1 }, { unique: true });

export const ModerationCaseModel = model<IModerationCase>('ModerationCase', ModerationCaseSchema);
