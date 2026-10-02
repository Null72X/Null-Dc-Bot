import { Schema, model } from 'mongoose';
import { ISecurityConfig, ISecurityIncident } from '@null-bot/types';

const SecurityConfigSchema = new Schema<ISecurityConfig>(
  {
    guildId: { type: String, required: true, unique: true, index: true },
    enabled: { type: Boolean, default: true },
    logChannelId: { type: String },
    antiRaid: {
      enabled: { type: Boolean, default: true },
      joinThreshold: { type: Number, default: 10 },
      intervalMs: { type: Number, default: 10000 },
      action: { type: String, default: 'LOCKDOWN' },
    },
    antiNuke: {
      enabled: { type: Boolean, default: true },
      maxChannelDelete: { type: Number, default: 3 },
      maxChannelCreate: { type: Number, default: 5 },
      maxRoleDelete: { type: Number, default: 3 },
      maxRoleCreate: { type: Number, default: 5 },
      maxBanCount: { type: Number, default: 5 },
      maxKickCount: { type: Number, default: 5 },
      maxWebhookCreate: { type: Number, default: 3 },
      timeWindowMs: { type: Number, default: 60000 },
      action: { type: String, default: 'BAN_OFFENDER' },
    },
    exemptUsers: { type: [String], default: [] },
    exemptRoles: { type: [String], default: [] },
  },
  { timestamps: true }
);

const SecurityIncidentSchema = new Schema<ISecurityIncident>(
  {
    guildId: { type: String, required: true, index: true },
    incidentId: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    executorId: { type: String, required: true },
    executorTag: { type: String, required: true },
    actionTaken: { type: String, required: true },
    details: { type: String, required: true },
  },
  { timestamps: true }
);

export const SecurityConfigModel = model<ISecurityConfig>('SecurityConfig', SecurityConfigSchema);
export const SecurityIncidentModel = model<ISecurityIncident>('SecurityIncident', SecurityIncidentSchema);
