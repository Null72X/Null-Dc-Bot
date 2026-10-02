import { IGuildSettings, IAutoModRule, ISecurityConfig, ITicketConfig, ILevelConfig, IWelcomeConfig, ILoggingConfig, ITempVoiceConfig } from '@null-bot/types';
declare class GuildCacheManager {
    private cache;
    private ttlMs;
    private get;
    private set;
    invalidate(guildId: string, category?: string): void;
    getGuildSettings(guildId: string): Promise<IGuildSettings>;
    getAutoModRule(guildId: string): Promise<IAutoModRule>;
    getSecurityConfig(guildId: string): Promise<ISecurityConfig>;
    getTicketConfig(guildId: string): Promise<ITicketConfig>;
    getLevelConfig(guildId: string): Promise<ILevelConfig>;
    getWelcomeConfig(guildId: string): Promise<IWelcomeConfig>;
    getLoggingConfig(guildId: string): Promise<ILoggingConfig>;
    getTempVoiceConfig(guildId: string): Promise<ITempVoiceConfig>;
}
export declare const guildCache: GuildCacheManager;
export {};
//# sourceMappingURL=cache.d.ts.map