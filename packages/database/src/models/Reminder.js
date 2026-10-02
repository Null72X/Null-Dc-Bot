"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReminderModel = void 0;
const mongoose_1 = require("mongoose");
const ReminderSchema = new mongoose_1.Schema({
    reminderId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    guildId: { type: String },
    channelId: { type: String, required: true },
    message: { type: String, required: true },
    remindAt: { type: Date, required: true, index: true },
}, { timestamps: true });
exports.ReminderModel = (0, mongoose_1.model)('Reminder', ReminderSchema);
//# sourceMappingURL=Reminder.js.map