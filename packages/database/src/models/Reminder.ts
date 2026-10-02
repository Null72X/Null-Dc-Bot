import { Schema, model } from 'mongoose';
import { IReminder } from '@null-bot/types';

const ReminderSchema = new Schema<IReminder>(
  {
    reminderId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    guildId: { type: String },
    channelId: { type: String, required: true },
    message: { type: String, required: true },
    remindAt: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

export const ReminderModel = model<IReminder>('Reminder', ReminderSchema);
