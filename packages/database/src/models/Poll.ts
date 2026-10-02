import { Schema, model } from 'mongoose';
import { IPoll } from '@null-bot/types';

const PollOptionSchema = new Schema({
  text: { type: String, required: true },
  votes: { type: [String], default: [] },
});

const PollSchema = new Schema<IPoll>(
  {
    guildId: { type: String, required: true, index: true },
    channelId: { type: String, required: true },
    messageId: { type: String, required: true, unique: true, index: true },
    question: { type: String, required: true },
    options: [PollOptionSchema],
    allowMultiple: { type: Boolean, default: false },
    anonymous: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true, index: true },
    closed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const PollModel = model<IPoll>('Poll', PollSchema);
