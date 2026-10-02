"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WelcomeConfigModel = void 0;
const mongoose_1 = require("mongoose");
const WelcomeConfigSchema = new mongoose_1.Schema({
    guildId: { type: String, required: true, unique: true, index: true },
    welcomeEnabled: { type: Boolean, default: false },
    welcomeChannelId: { type: String },
    welcomeMessage: { type: String, default: 'Welcome {mention} to **{server}**! You are member #{memberCount}.' },
    welcomeEmbedEnabled: { type: Boolean, default: true },
    goodbyeEnabled: { type: Boolean, default: false },
    goodbyeChannelId: { type: String },
    goodbyeMessage: { type: String, default: '{username} has left **{server}**.' },
    goodbyeEmbedEnabled: { type: Boolean, default: true },
}, { timestamps: true });
exports.WelcomeConfigModel = (0, mongoose_1.model)('WelcomeConfig', WelcomeConfigSchema);
//# sourceMappingURL=WelcomeConfig.js.map