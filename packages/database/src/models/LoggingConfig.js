"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingConfigModel = void 0;
const mongoose_1 = require("mongoose");
const LoggingConfigSchema = new mongoose_1.Schema({
    guildId: { type: String, required: true, unique: true, index: true },
    enabled: { type: Boolean, default: true },
    messageLogChannelId: { type: String },
    memberLogChannelId: { type: String },
    voiceLogChannelId: { type: String },
    roleLogChannelId: { type: String },
    channelLogChannelId: { type: String },
    serverLogChannelId: { type: String },
    modLogChannelId: { type: String },
}, { timestamps: true });
exports.LoggingConfigModel = (0, mongoose_1.model)('LoggingConfig', LoggingConfigSchema);
//# sourceMappingURL=LoggingConfig.js.map