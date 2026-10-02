"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollModel = void 0;
const mongoose_1 = require("mongoose");
const PollOptionSchema = new mongoose_1.Schema({
    text: { type: String, required: true },
    votes: { type: [String], default: [] },
});
const PollSchema = new mongoose_1.Schema({
    guildId: { type: String, required: true, index: true },
    channelId: { type: String, required: true },
    messageId: { type: String, required: true, unique: true, index: true },
    question: { type: String, required: true },
    options: [PollOptionSchema],
    allowMultiple: { type: Boolean, default: false },
    anonymous: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true, index: true },
    closed: { type: Boolean, default: false },
}, { timestamps: true });
exports.PollModel = (0, mongoose_1.model)('Poll', PollSchema);
//# sourceMappingURL=Poll.js.map