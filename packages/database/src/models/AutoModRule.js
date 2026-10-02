"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoModRuleModel = void 0;
const mongoose_1 = require("mongoose");
const FilterSubSchema = {
    enabled: { type: Boolean, default: false },
    threshold: { type: Number, default: 3 },
    action: { type: String, default: 'DELETE' },
    actionDuration: { type: Number, default: 300000 }, // 5 mins timeout
    exemptRoles: { type: [String], default: [] },
    exemptChannels: { type: [String], default: [] },
    whitelist: { type: [String], default: [] },
};
const AutoModRuleSchema = new mongoose_1.Schema({
    guildId: { type: String, required: true, unique: true, index: true },
    badWords: { ...FilterSubSchema, words: { type: [String], default: [] } },
    spam: { ...FilterSubSchema, maxMessages: { type: Number, default: 5 }, intervalMs: { type: Number, default: 5000 } },
    repeatedMessages: { ...FilterSubSchema, maxDuplicates: { type: Number, default: 3 } },
    mentions: { ...FilterSubSchema, maxMentions: { type: Number, default: 5 } },
    caps: { ...FilterSubSchema, percentage: { type: Number, default: 70 }, minLength: { type: Number, default: 10 } },
    invites: { ...FilterSubSchema },
    links: { ...FilterSubSchema },
    massMentions: { ...FilterSubSchema, maxMentions: { type: Number, default: 10 } },
    emojiSpam: { ...FilterSubSchema, maxEmojis: { type: Number, default: 10 } },
    attachmentSpam: { ...FilterSubSchema, maxAttachments: { type: Number, default: 5 } },
    nicknameFilter: { ...FilterSubSchema, forbiddenWords: { type: [String], default: [] } },
}, { timestamps: true });
exports.AutoModRuleModel = (0, mongoose_1.model)('AutoModRule', AutoModRuleSchema);
//# sourceMappingURL=AutoModRule.js.map