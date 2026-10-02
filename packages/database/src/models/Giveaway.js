"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiveawayModel = void 0;
const mongoose_1 = require("mongoose");
const GiveawaySchema = new mongoose_1.Schema({
    guildId: { type: String, required: true, index: true },
    channelId: { type: String, required: true },
    messageId: { type: String, required: true, unique: true, index: true },
    prize: { type: String, required: true },
    winnerCount: { type: Number, default: 1 },
    endsAt: { type: Date, required: true, index: true },
    hostedBy: { type: String, required: true },
    requiredRoles: { type: [String], default: [] },
    minAccountAgeDays: { type: Number, default: 0 },
    minServerDays: { type: Number, default: 0 },
    entries: { type: [String], default: [] },
    winners: { type: [String], default: [] },
    ended: { type: Boolean, default: false },
}, { timestamps: true });
exports.GiveawayModel = (0, mongoose_1.model)('Giveaway', GiveawaySchema);
//# sourceMappingURL=Giveaway.js.map