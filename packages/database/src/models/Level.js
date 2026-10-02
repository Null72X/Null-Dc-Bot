"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelModel = exports.LevelConfigModel = void 0;
const mongoose_1 = require("mongoose");
const LevelRewardSchema = new mongoose_1.Schema({
    guildId: { type: String, required: true },
    level: { type: Number, required: true },
    roleId: { type: String, required: true },
});
const LevelConfigSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
const LevelSchema = new mongoose_1.Schema({
    guildId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
    messagesCount: { type: Number, default: 0 },
    voiceMinutes: { type: Number, default: 0 },
}, { timestamps: true });
LevelSchema.index({ guildId: 1, userId: 1 }, { unique: true });
LevelSchema.index({ guildId: 1, xp: -1 });
exports.LevelConfigModel = (0, mongoose_1.model)('LevelConfig', LevelConfigSchema);
exports.LevelModel = (0, mongoose_1.model)('Level', LevelSchema);
//# sourceMappingURL=Level.js.map