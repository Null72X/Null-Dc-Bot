"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerBackupModel = exports.TempVoiceConfigModel = void 0;
const mongoose_1 = require("mongoose");
const TempVoiceConfigSchema = new mongoose_1.Schema({
    guildId: { type: String, required: true, unique: true, index: true },
    enabled: { type: Boolean, default: false },
    joinChannelId: { type: String },
    targetCategoryId: { type: String },
    channelNameTemplate: { type: String, default: "🔊 {user}'s Room" },
    userLimit: { type: Number, default: 0 },
}, { timestamps: true });
const ServerBackupSchema = new mongoose_1.Schema({
    backupId: { type: String, required: true, unique: true, index: true },
    guildId: { type: String, required: true, index: true },
    createdById: { type: String, required: true },
    name: { type: String, required: true },
    data: {
        roles: [{ name: String, color: Number, hoist: Boolean, permissions: String }],
        channels: [{ name: String, type: Number, topic: String, parentName: String }],
        guildName: String,
    },
}, { timestamps: true });
exports.TempVoiceConfigModel = (0, mongoose_1.model)('TempVoiceConfig', TempVoiceConfigSchema);
exports.ServerBackupModel = (0, mongoose_1.model)('ServerBackup', ServerBackupSchema);
//# sourceMappingURL=TempVoiceConfig.js.map