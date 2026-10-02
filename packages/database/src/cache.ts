import { GuildSettingsModel } from './models/GuildSettings.js';
import { AutoModRuleModel } from './models/AutoModRule.js';
import { SecurityConfigModel } from './models/SecurityConfig.js';
import { TicketConfigModel } from './models/TicketConfig.js';
import { LevelConfigModel } from './models/Level.js';
import { WelcomeConfigModel } from './models/WelcomeConfig.js';
import { LoggingConfigModel } from './models/LoggingConfig.js';
import { TempVoiceConfigModel } from './models/TempVoiceConfig.js';
import { IGuildSettings, IAutoModRule, ISecurityConfig, ITicketConfig, ILevelConfig, IWelcomeConfig, ILoggingConfig, ITempVoiceConfig } from '@null-bot/types';

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class GuildCacheManager {
  private cache = new Map<string, CacheEntry<unknown>>();
  private ttlMs = 5 * 60 * 1000; // 5 minutes cache TTL

  private get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  private set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + this.ttlMs,
    });
  }

  public invalidate(guildId: string, category?: string): void {
    if (category) {
      this.cache.delete(`${guildId}:${category}`);
    } else {
      // Invalidate all for guild
      for (const key of this.cache.keys()) {
        if (key.startsWith(`${guildId}:`)) {
          this.cache.delete(key);
        }
      }
    }
  }

  public async getGuildSettings(guildId: string): Promise<IGuildSettings> {
    const key = `${guildId}:settings`;
    const cached = this.get<IGuildSettings>(key);
    if (cached) return cached;

    let settings = await GuildSettingsModel.findOne({ guildId }).lean();
    if (!settings) {
      settings = (await GuildSettingsModel.create({ guildId })).toObject();
    }
    this.set(key, settings as IGuildSettings);
    return settings as IGuildSettings;
  }

  public async getAutoModRule(guildId: string): Promise<IAutoModRule> {
    const key = `${guildId}:automod`;
    const cached = this.get<IAutoModRule>(key);
    if (cached) return cached;

    let rule = await AutoModRuleModel.findOne({ guildId }).lean();
    if (!rule) {
      rule = (await AutoModRuleModel.create({ guildId })).toObject();
    }
    this.set(key, rule as IAutoModRule);
    return rule as IAutoModRule;
  }

  public async getSecurityConfig(guildId: string): Promise<ISecurityConfig> {
    const key = `${guildId}:security`;
    const cached = this.get<ISecurityConfig>(key);
    if (cached) return cached;

    let config = await SecurityConfigModel.findOne({ guildId }).lean();
    if (!config) {
      config = (await SecurityConfigModel.create({ guildId })).toObject();
    }
    this.set(key, config as ISecurityConfig);
    return config as ISecurityConfig;
  }

  public async getTicketConfig(guildId: string): Promise<ITicketConfig> {
    const key = `${guildId}:ticket`;
    const cached = this.get<ITicketConfig>(key);
    if (cached) return cached;

    let config = await TicketConfigModel.findOne({ guildId }).lean();
    if (!config) {
      config = (await TicketConfigModel.create({ guildId })).toObject();
    }
    this.set(key, config as ITicketConfig);
    return config as ITicketConfig;
  }

  public async getLevelConfig(guildId: string): Promise<ILevelConfig> {
    const key = `${guildId}:level`;
    const cached = this.get<ILevelConfig>(key);
    if (cached) return cached;

    let config = await LevelConfigModel.findOne({ guildId }).lean();
    if (!config) {
      config = (await LevelConfigModel.create({ guildId })).toObject();
    }
    this.set(key, config as ILevelConfig);
    return config as ILevelConfig;
  }

  public async getWelcomeConfig(guildId: string): Promise<IWelcomeConfig> {
    const key = `${guildId}:welcome`;
    const cached = this.get<IWelcomeConfig>(key);
    if (cached) return cached;

    let config = await WelcomeConfigModel.findOne({ guildId }).lean();
    if (!config) {
      config = (await WelcomeConfigModel.create({ guildId })).toObject();
    }
    this.set(key, config as IWelcomeConfig);
    return config as IWelcomeConfig;
  }

  public async getLoggingConfig(guildId: string): Promise<ILoggingConfig> {
    const key = `${guildId}:logging`;
    const cached = this.get<ILoggingConfig>(key);
    if (cached) return cached;

    let config = await LoggingConfigModel.findOne({ guildId }).lean();
    if (!config) {
      config = (await LoggingConfigModel.create({ guildId })).toObject();
    }
    this.set(key, config as ILoggingConfig);
    return config as ILoggingConfig;
  }

  public async getTempVoiceConfig(guildId: string): Promise<ITempVoiceConfig> {
    const key = `${guildId}:tempvoice`;
    const cached = this.get<ITempVoiceConfig>(key);
    if (cached) return cached;

    let config = await TempVoiceConfigModel.findOne({ guildId }).lean();
    if (!config) {
      config = (await TempVoiceConfigModel.create({ guildId })).toObject();
    }
    this.set(key, config as ITempVoiceConfig);
    return config as ITempVoiceConfig;
  }
}

export const guildCache = new GuildCacheManager();
