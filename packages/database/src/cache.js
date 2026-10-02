"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guildCache = void 0;
const GuildSettings_js_1 = require("./models/GuildSettings.js");
const AutoModRule_js_1 = require("./models/AutoModRule.js");
const SecurityConfig_js_1 = require("./models/SecurityConfig.js");
const TicketConfig_js_1 = require("./models/TicketConfig.js");
const Level_js_1 = require("./models/Level.js");
const WelcomeConfig_js_1 = require("./models/WelcomeConfig.js");
const LoggingConfig_js_1 = require("./models/LoggingConfig.js");
const TempVoiceConfig_js_1 = require("./models/TempVoiceConfig.js");
class GuildCacheManager {
    cache = new Map();
    ttlMs = 5 * 60 * 1000; // 5 minutes cache TTL
    get(key) {
        const entry = this.cache.get(key);
        if (!entry)
            return null;
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return null;
        }
        return entry.data;
    }
    set(key, data) {
        this.cache.set(key, {
            data,
            expiresAt: Date.now() + this.ttlMs,
        });
    }
    invalidate(guildId, category) {
        if (category) {
            this.cache.delete(`${guildId}:${category}`);
        }
        else {
            // Invalidate all for guild
            for (const key of this.cache.keys()) {
                if (key.startsWith(`${guildId}:`)) {
                    this.cache.delete(key);
                }
            }
        }
    }
    async getGuildSettings(guildId) {
        const key = `${guildId}:settings`;
        const cached = this.get(key);
        if (cached)
            return cached;
        let settings = await GuildSettings_js_1.GuildSettingsModel.findOne({ guildId }).lean();
        if (!settings) {
            settings = (await GuildSettings_js_1.GuildSettingsModel.create({ guildId })).toObject();
        }
        this.set(key, settings);
        return settings;
    }
    async getAutoModRule(guildId) {
        const key = `${guildId}:automod`;
        const cached = this.get(key);
        if (cached)
            return cached;
        let rule = await AutoModRule_js_1.AutoModRuleModel.findOne({ guildId }).lean();
        if (!rule) {
            rule = (await AutoModRule_js_1.AutoModRuleModel.create({ guildId })).toObject();
        }
        this.set(key, rule);
        return rule;
    }
    async getSecurityConfig(guildId) {
        const key = `${guildId}:security`;
        const cached = this.get(key);
        if (cached)
            return cached;
        let config = await SecurityConfig_js_1.SecurityConfigModel.findOne({ guildId }).lean();
        if (!config) {
            config = (await SecurityConfig_js_1.SecurityConfigModel.create({ guildId })).toObject();
        }
        this.set(key, config);
        return config;
    }
    async getTicketConfig(guildId) {
        const key = `${guildId}:ticket`;
        const cached = this.get(key);
        if (cached)
            return cached;
        let config = await TicketConfig_js_1.TicketConfigModel.findOne({ guildId }).lean();
        if (!config) {
            config = (await TicketConfig_js_1.TicketConfigModel.create({ guildId })).toObject();
        }
        this.set(key, config);
        return config;
    }
    async getLevelConfig(guildId) {
        const key = `${guildId}:level`;
        const cached = this.get(key);
        if (cached)
            return cached;
        let config = await Level_js_1.LevelConfigModel.findOne({ guildId }).lean();
        if (!config) {
            config = (await Level_js_1.LevelConfigModel.create({ guildId })).toObject();
        }
        this.set(key, config);
        return config;
    }
    async getWelcomeConfig(guildId) {
        const key = `${guildId}:welcome`;
        const cached = this.get(key);
        if (cached)
            return cached;
        let config = await WelcomeConfig_js_1.WelcomeConfigModel.findOne({ guildId }).lean();
        if (!config) {
            config = (await WelcomeConfig_js_1.WelcomeConfigModel.create({ guildId })).toObject();
        }
        this.set(key, config);
        return config;
    }
    async getLoggingConfig(guildId) {
        const key = `${guildId}:logging`;
        const cached = this.get(key);
        if (cached)
            return cached;
        let config = await LoggingConfig_js_1.LoggingConfigModel.findOne({ guildId }).lean();
        if (!config) {
            config = (await LoggingConfig_js_1.LoggingConfigModel.create({ guildId })).toObject();
        }
        this.set(key, config);
        return config;
    }
    async getTempVoiceConfig(guildId) {
        const key = `${guildId}:tempvoice`;
        const cached = this.get(key);
        if (cached)
            return cached;
        let config = await TempVoiceConfig_js_1.TempVoiceConfigModel.findOne({ guildId }).lean();
        if (!config) {
            config = (await TempVoiceConfig_js_1.TempVoiceConfigModel.create({ guildId })).toObject();
        }
        this.set(key, config);
        return config;
    }
}
exports.guildCache = new GuildCacheManager();
//# sourceMappingURL=cache.js.map