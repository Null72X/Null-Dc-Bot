import { Schema, model } from 'mongoose';
import { IWelcomeConfig } from '@null-bot/types';

const WelcomeConfigSchema = new Schema<IWelcomeConfig>(
  {
    guildId: { type: String, required: true, unique: true, index: true },
    welcomeEnabled: { type: Boolean, default: false },
    welcomeChannelId: { type: String },
    welcomeMessage: { type: String, default: 'Welcome {mention} to **{server}**! You are member #{memberCount}.' },
    welcomeEmbedEnabled: { type: Boolean, default: true },
    goodbyeEnabled: { type: Boolean, default: false },
    goodbyeChannelId: { type: String },
    goodbyeMessage: { type: String, default: '{username} has left **{server}**.' },
    goodbyeEmbedEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const WelcomeConfigModel = model<IWelcomeConfig>('WelcomeConfig', WelcomeConfigSchema);
