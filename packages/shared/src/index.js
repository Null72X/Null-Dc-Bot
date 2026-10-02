"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmbed = createEmbed;
exports.createErrorEmbed = createErrorEmbed;
exports.createSuccessEmbed = createSuccessEmbed;
exports.canModerate = canModerate;
exports.parseDuration = parseDuration;
exports.formatDuration = formatDuration;
exports.formatPlaceholders = formatPlaceholders;
exports.secureRandomInt = secureRandomInt;
const discord_js_1 = require("discord.js");
const config_1 = require("@null-bot/config");
const crypto_1 = __importDefault(require("crypto"));
/**
 * Standard Embed Builder adhering to NULL Bot identity
 */
function createEmbed(options) {
    const embed = new discord_js_1.EmbedBuilder()
        .setColor(options?.color || config_1.botIdentity.defaultEmbedColor)
        .setTimestamp();
    if (options?.title)
        embed.setTitle(options.title);
    if (options?.description)
        embed.setDescription(options.description);
    if (options?.fields)
        embed.addFields(options.fields);
    if (options?.thumbnailUrl)
        embed.setThumbnail(options.thumbnailUrl);
    if (options?.imageUrl)
        embed.setImage(options.imageUrl);
    embed.setFooter({
        text: options?.footerText || config_1.botIdentity.footerText,
        iconURL: config_1.botIdentity.avatarUrl,
    });
    return embed;
}
function createErrorEmbed(message) {
    return createEmbed({
        title: '❌ Error',
        description: message,
        color: '#ED4245',
    });
}
function createSuccessEmbed(message) {
    return createEmbed({
        title: '✅ Success',
        description: message,
        color: '#57F287',
    });
}
/**
 * Validates role hierarchy for Discord moderation actions
 */
function canModerate(moderator, target) {
    if (moderator.id === target.id) {
        return { canAction: false, reason: 'You cannot punish yourself.' };
    }
    if (target.id === moderator.guild.ownerId) {
        return { canAction: false, reason: 'You cannot punish the server owner.' };
    }
    if (moderator.id !== moderator.guild.ownerId && moderator.roles.highest.position <= target.roles.highest.position) {
        return { canAction: false, reason: 'Your highest role must be above the target member\'s highest role.' };
    }
    const me = moderator.guild.members.me;
    if (me && me.roles.highest.position <= target.roles.highest.position) {
        return { canAction: false, reason: 'The bot\'s highest role must be above the target member\'s highest role.' };
    }
    return { canAction: true };
}
/**
 * Converts natural duration string (e.g. "10m", "2h", "1d", "30s") to milliseconds
 */
function parseDuration(input) {
    const regex = /^(\d+)\s*([smdhw])$/i;
    const match = input.trim().match(regex);
    if (!match)
        return null;
    const value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();
    switch (unit) {
        case 's': return value * 1000;
        case 'm': return value * 60 * 1000;
        case 'h': return value * 60 * 60 * 1000;
        case 'd': return value * 24 * 60 * 60 * 1000;
        case 'w': return value * 7 * 24 * 60 * 60 * 1000;
        default: return null;
    }
}
/**
 * Format milliseconds to human readable duration string
 */
function formatDuration(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const parts = [];
    if (days > 0)
        parts.push(`${days}d`);
    if (hours > 0)
        parts.push(`${hours}h`);
    if (minutes > 0)
        parts.push(`${minutes}m`);
    if (seconds > 0 || parts.length === 0)
        parts.push(`${seconds}s`);
    return parts.join(' ');
}
/**
 * Format placeholder string for welcome / goodbye messages
 */
function formatPlaceholders(template, data) {
    return template
        .replace(/{user}/g, data.user.tag)
        .replace(/{username}/g, data.user.username)
        .replace(/{mention}/g, `<@${data.user.id}>`)
        .replace(/{userId}/g, data.user.id)
        .replace(/{server}/g, data.guild.name)
        .replace(/{memberCount}/g, data.guild.memberCount.toString())
        .replace(/{createdAt}/g, data.user.createdAt ? data.user.createdAt.toLocaleDateString() : 'N/A');
}
/**
 * Cryptographically secure random integer between 0 and max (exclusive)
 */
function secureRandomInt(max) {
    if (max <= 0)
        return 0;
    return crypto_1.default.randomInt(0, max);
}
//# sourceMappingURL=index.js.map