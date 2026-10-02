"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionRolePanelModel = void 0;
const mongoose_1 = require("mongoose");
const ReactionRoleOptionSchema = new mongoose_1.Schema({
    label: { type: String, required: true },
    roleId: { type: String, required: true },
    emoji: { type: String },
    description: { type: String },
});
const ReactionRolePanelSchema = new mongoose_1.Schema({
    guildId: { type: String, required: true, index: true },
    panelId: { type: String, required: true, unique: true },
    channelId: { type: String, required: true },
    messageId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    mode: { type: String, enum: ['SINGLE', 'MULTI'], default: 'MULTI' },
    style: { type: String, enum: ['BUTTONS', 'SELECT'], default: 'BUTTONS' },
    options: [ReactionRoleOptionSchema],
}, { timestamps: true });
exports.ReactionRolePanelModel = (0, mongoose_1.model)('ReactionRolePanel', ReactionRolePanelSchema);
//# sourceMappingURL=ReactionRolePanel.js.map