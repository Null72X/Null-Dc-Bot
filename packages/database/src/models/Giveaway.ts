import { Schema, model } from 'mongoose';
import { IGiveaway } from '@null-bot/types';

const GiveawaySchema = new Schema<IGiveaway>(
  {
    guildId: { type: String, required: true, index: true },
    channelId: { type: String, required: true },
    messageId: { type: String, required: true, unique: true, index: true },
    prize: { type: String, required: true },
    winnerCount: { type: Number, default: 1 },
    endsAt: { type: Date, required: true, index: true },
    hostedBy: { type: String, required: true },
    requiredRoles: { type: [String], default: [] },
    minAccountAgeDays: { type: Number, default: 0 },
    minServerDays: { type: Number, default: 0 },
    entries: { type: [String], default: [] },
    winners: { type: [String], default: [] },
    ended: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const GiveawayModel = model<IGiveaway>('Giveaway', GiveawaySchema);
