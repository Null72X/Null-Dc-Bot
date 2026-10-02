"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketModel = exports.TicketConfigModel = void 0;
const mongoose_1 = require("mongoose");
const TicketCategorySchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    emoji: { type: String },
    staffRoleIds: { type: [String], default: [] },
    channelCategoryId: { type: String },
});
const TicketConfigSchema = new mongoose_1.Schema({
    guildId: { type: String, required: true, unique: true, index: true },
    enabled: { type: Boolean, default: true },
    panelTitle: { type: String, default: 'Support Tickets' },
    panelDescription: { type: String, default: 'Click a button below or select a category to open a support ticket.' },
    buttonLabel: { type: String, default: 'Open Ticket' },
    buttonColor: { type: String, default: 'PRIMARY' },
    categories: [TicketCategorySchema],
    transcriptChannelId: { type: String },
    ticketCategoryId: { type: String },
    maxTicketsPerUser: { type: Number, default: 3 },
    autoCloseHours: { type: Number, default: 48 },
}, { timestamps: true });
const TicketNoteSchema = new mongoose_1.Schema({
    authorId: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
const TicketSchema = new mongoose_1.Schema({
    guildId: { type: String, required: true, index: true },
    channelId: { type: String, required: true, unique: true },
    ticketId: { type: Number, required: true },
    userId: { type: String, required: true, index: true },
    userTag: { type: String, required: true },
    categoryId: { type: String, required: true },
    status: { type: String, enum: ['OPEN', 'CLOSED'], default: 'OPEN' },
    claimedBy: { type: String },
    claimedByTag: { type: String },
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], default: 'MEDIUM' },
    reason: { type: String },
    notes: [TicketNoteSchema],
    closedAt: { type: Date },
}, { timestamps: true });
TicketSchema.index({ guildId: 1, ticketId: 1 }, { unique: true });
exports.TicketConfigModel = (0, mongoose_1.model)('TicketConfig', TicketConfigSchema);
exports.TicketModel = (0, mongoose_1.model)('Ticket', TicketSchema);
//# sourceMappingURL=TicketConfig.js.map