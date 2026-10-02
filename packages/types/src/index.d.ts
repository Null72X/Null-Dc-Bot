export type PunishmentType = 'WARN' | 'TIMEOUT' | 'KICK' | 'BAN' | 'SOFTBAN' | 'MUTE';
export interface IGuildSettings {
    guildId: string;
    prefix: string;
    embedColor: string;
    disabledCommands: string[];
    adminRoles: string[];
    modRoles: string[];
    createdAt: Date;
    updatedAt: Date;
}
export interface IModerationCase {
    guildId: string;
    caseId: number;
    targetId: string;
    targetTag: string;
    moderatorId: string;
    moderatorTag: string;
    type: PunishmentType | 'UNBAN' | 'UNTIMEOUT' | 'UNMUTE';
    reason: string;
    duration?: number | null;
    expiresAt?: Date | null;
    active: boolean;
    createdAt: Date;
}
export interface IAutoModFilterConfig {
    enabled: boolean;
    threshold?: number;
    action: PunishmentType | 'DELETE';
    actionDuration?: number;
    exemptRoles: string[];
    exemptChannels: string[];
    whitelist?: string[];
}
export interface IAutoModRule {
    guildId: string;
    badWords: IAutoModFilterConfig & {
        words: string[];
    };
    spam: IAutoModFilterConfig & {
        maxMessages: number;
        intervalMs: number;
    };
    repeatedMessages: IAutoModFilterConfig & {
        maxDuplicates: number;
    };
    mentions: IAutoModFilterConfig & {
        maxMentions: number;
    };
    caps: IAutoModFilterConfig & {
        percentage: number;
        minLength: number;
    };
    invites: IAutoModFilterConfig;
    links: IAutoModFilterConfig;
    massMentions: IAutoModFilterConfig & {
        maxMentions: number;
    };
    emojiSpam: IAutoModFilterConfig & {
        maxEmojis: number;
    };
    attachmentSpam: IAutoModFilterConfig & {
        maxAttachments: number;
    };
    nicknameFilter: IAutoModFilterConfig & {
        forbiddenWords: string[];
    };
    createdAt: Date;
    updatedAt: Date;
}
export interface ISecurityConfig {
    guildId: string;
    enabled: boolean;
    logChannelId?: string;
    antiRaid: {
        enabled: boolean;
        joinThreshold: number;
        intervalMs: number;
        action: 'LOCKDOWN' | 'KICK' | 'BAN';
    };
    antiNuke: {
        enabled: boolean;
        maxChannelDelete: number;
        maxChannelCreate: number;
        maxRoleDelete: number;
        maxRoleCreate: number;
        maxBanCount: number;
        maxKickCount: number;
        maxWebhookCreate: number;
        timeWindowMs: number;
        action: 'REMOVE_ROLES' | 'BAN_OFFENDER' | 'LOCKDOWN';
    };
    exemptUsers: string[];
    exemptRoles: string[];
    createdAt: Date;
    updatedAt: Date;
}
export interface ISecurityIncident {
    guildId: string;
    incidentId: string;
    type: string;
    executorId: string;
    executorTag: string;
    actionTaken: string;
    details: string;
    createdAt: Date;
}
export interface ITicketCategory {
    id: string;
    name: string;
    description: string;
    emoji?: string;
    staffRoleIds: string[];
    channelCategoryId?: string;
}
export interface ITicketConfig {
    guildId: string;
    enabled: boolean;
    panelTitle: string;
    panelDescription: string;
    buttonLabel: string;
    buttonColor: 'PRIMARY' | 'SECONDARY' | 'SUCCESS' | 'DANGER';
    categories: ITicketCategory[];
    transcriptChannelId?: string;
    ticketCategoryId?: string;
    maxTicketsPerUser: number;
    autoCloseHours: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface ITicket {
    guildId: string;
    channelId: string;
    ticketId: number;
    userId: string;
    userTag: string;
    categoryId: string;
    status: 'OPEN' | 'CLOSED';
    claimedBy?: string;
    claimedByTag?: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    reason?: string;
    notes: Array<{
        authorId: string;
        text: string;
        createdAt: Date;
    }>;
    createdAt: Date;
    closedAt?: Date;
}
export interface IGiveaway {
    guildId: string;
    channelId: string;
    messageId: string;
    prize: string;
    winnerCount: number;
    endsAt: Date;
    hostedBy: string;
    requiredRoles: string[];
    minAccountAgeDays: number;
    minServerDays: number;
    entries: string[];
    winners: string[];
    ended: boolean;
    createdAt: Date;
}
export interface ILevel {
    guildId: string;
    userId: string;
    xp: number;
    level: number;
    messagesCount: number;
    voiceMinutes: number;
    updatedAt: Date;
}
export interface ILevelReward {
    guildId: string;
    level: number;
    roleId: string;
}
export interface ILevelConfig {
    guildId: string;
    enabled: boolean;
    xpRate: number;
    cooldownSeconds: number;
    voiceXpEnabled: boolean;
    voiceXpPerMinute: number;
    levelUpChannelId?: string;
    levelUpMessage: string;
    excludedChannels: string[];
    excludedRoles: string[];
    decayEnabled: boolean;
    decayPercentage: number;
    rewards: ILevelReward[];
    createdAt: Date;
    updatedAt: Date;
}
export interface IReactionRoleOption {
    label: string;
    roleId: string;
    emoji?: string;
    description?: string;
}
export interface IReactionRolePanel {
    guildId: string;
    panelId: string;
    channelId: string;
    messageId: string;
    title: string;
    description: string;
    mode: 'SINGLE' | 'MULTI';
    style: 'BUTTONS' | 'SELECT';
    options: IReactionRoleOption[];
    createdAt: Date;
}
export interface IWelcomeConfig {
    guildId: string;
    welcomeEnabled: boolean;
    welcomeChannelId?: string;
    welcomeMessage: string;
    welcomeEmbedEnabled: boolean;
    goodbyeEnabled: boolean;
    goodbyeChannelId?: string;
    goodbyeMessage: string;
    goodbyeEmbedEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface ILoggingConfig {
    guildId: string;
    enabled: boolean;
    messageLogChannelId?: string;
    memberLogChannelId?: string;
    voiceLogChannelId?: string;
    roleLogChannelId?: string;
    channelLogChannelId?: string;
    serverLogChannelId?: string;
    modLogChannelId?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface IAutoResponder {
    guildId: string;
    triggerId: string;
    trigger: string;
    response: string;
    matchType: 'EXACT' | 'CONTAINS' | 'REGEX';
    caseSensitive: boolean;
    isEmbed: boolean;
    allowedChannels: string[];
    allowedRoles: string[];
    cooldownSeconds: number;
    enabled: boolean;
    createdAt: Date;
}
export interface IReminder {
    reminderId: string;
    userId: string;
    guildId?: string;
    channelId: string;
    message: string;
    remindAt: Date;
    createdAt: Date;
}
export interface IPoll {
    guildId: string;
    channelId: string;
    messageId: string;
    question: string;
    options: Array<{
        text: string;
        votes: string[];
    }>;
    allowMultiple: boolean;
    anonymous: boolean;
    expiresAt: Date;
    closed: boolean;
    createdAt: Date;
}
export interface ITempVoiceConfig {
    guildId: string;
    enabled: boolean;
    joinChannelId?: string;
    targetCategoryId?: string;
    channelNameTemplate: string;
    userLimit: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface IServerBackup {
    backupId: string;
    guildId: string;
    createdById: string;
    name: string;
    data: {
        roles: Array<{
            name: string;
            color: number;
            hoist: boolean;
            permissions: string;
        }>;
        channels: Array<{
            name: string;
            type: number;
            topic?: string;
            parentName?: string;
        }>;
        guildName: string;
    };
    createdAt: Date;
}
export interface IUserGuildPermissions {
    id: string;
    name: string;
    icon?: string;
    owner: boolean;
    permissions: string;
    features: string[];
    hasBotAccess: boolean;
}
export interface IDashboardUser {
    id: string;
    username: string;
    discriminator: string;
    avatar?: string;
}
//# sourceMappingURL=index.d.ts.map