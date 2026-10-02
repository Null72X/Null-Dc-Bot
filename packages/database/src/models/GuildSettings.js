"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildSettingsModel = void 0;
const mongoose_1 = require("mongoose");
const GuildSettingsSchema = new mongoose_1.Schema({
    guildId: { type: String, required: true, unique: true, index: true },
    prefix: { type: String, default: '!' },
    embedColor: { type: String, default: '#5865F2' },
    disabledCommands: { type: [String], default: [] },
    adminRoles: { type: [String], default: [] },
    modRoles: { type: [String], default: [] },
}, { timestamps: true });
exports.GuildSettingsModel = (0, mongoose_1.model)('GuildSettings', GuildSettingsSchema);
//# sourceMappingURL=GuildSettings.js.map