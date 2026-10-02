import { EmbedBuilder, GuildMember, ColorResolvable } from 'discord.js';
/**
 * Standard Embed Builder adhering to NULL Bot identity
 */
export declare function createEmbed(options?: {
    title?: string;
    description?: string;
    color?: ColorResolvable;
    fields?: Array<{
        name: string;
        value: string;
        inline?: boolean;
    }>;
    footerText?: string;
    thumbnailUrl?: string;
    imageUrl?: string;
}): EmbedBuilder;
export declare function createErrorEmbed(message: string): EmbedBuilder;
export declare function createSuccessEmbed(message: string): EmbedBuilder;
/**
 * Validates role hierarchy for Discord moderation actions
 */
export declare function canModerate(moderator: GuildMember, target: GuildMember): {
    canAction: boolean;
    reason?: string;
};
/**
 * Converts natural duration string (e.g. "10m", "2h", "1d", "30s") to milliseconds
 */
export declare function parseDuration(input: string): number | null;
/**
 * Format milliseconds to human readable duration string
 */
export declare function formatDuration(ms: number): string;
/**
 * Format placeholder string for welcome / goodbye messages
 */
export declare function formatPlaceholders(template: string, data: {
    user: {
        id: string;
        username: string;
        tag: string;
        createdAt?: Date;
    };
    guild: {
        name: string;
        memberCount: number;
    };
}): string;
/**
 * Cryptographically secure random integer between 0 and max (exclusive)
 */
export declare function secureRandomInt(max: number): number;
//# sourceMappingURL=index.d.ts.map