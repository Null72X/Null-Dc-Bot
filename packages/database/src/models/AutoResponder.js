"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoResponderModel = void 0;
const mongoose_1 = require("mongoose");
const AutoResponderSchema = new mongoose_1.Schema({
    guildId: { type: String, required: true, index: true },
    triggerId: { type: String, required: true, unique: true },
    trigger: { type: String, required: true },
    response: { type: String, required: true },
    matchType: { type: String, enum: ['EXACT', 'CONTAINS', 'REGEX'], default: 'EXACT' },
    caseSensitive: { type: Boolean, default: false },
    isEmbed: { type: Boolean, default: false },
    allowedChannels: { type: [String], default: [] },
    allowedRoles: { type: [String], default: [] },
    cooldownSeconds: { type: Number, default: 5 },
    enabled: { type: Boolean, default: true },
}, { timestamps: true });
exports.AutoResponderModel = (0, mongoose_1.model)('AutoResponder', AutoResponderSchema);
//# sourceMappingURL=AutoResponder.js.map