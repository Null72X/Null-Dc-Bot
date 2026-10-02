"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModerationCaseModel = void 0;
const mongoose_1 = require("mongoose");
const ModerationCaseSchema = new mongoose_1.Schema({
    guildId: { type: String, required: true, index: true },
    caseId: { type: Number, required: true },
    targetId: { type: String, required: true, index: true },
    targetTag: { type: String, required: true },
    moderatorId: { type: String, required: true },
    moderatorTag: { type: String, required: true },
    type: { type: String, required: true },
    reason: { type: String, default: 'No reason provided.' },
    duration: { type: Number, default: null },
    expiresAt: { type: Date, default: null, index: true },
    active: { type: Boolean, default: true },
}, { timestamps: true });
ModerationCaseSchema.index({ guildId: 1, caseId: 1 }, { unique: true });
exports.ModerationCaseModel = (0, mongoose_1.model)('ModerationCase', ModerationCaseSchema);
//# sourceMappingURL=ModerationCase.js.map