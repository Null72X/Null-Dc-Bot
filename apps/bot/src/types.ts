import {
  ChatInputCommandInteraction,
  PermissionResolvable,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  SlashCommandOptionsOnlyBuilder
} from 'discord.js';

export type CommandCategory =
  | 'Moderation'
  | 'AutoModeration'
  | 'Security'
  | 'Logging'
  | 'Tickets'
  | 'Music'
  | 'Leveling'
  | 'Giveaways'
  | 'ReactionRoles'
  | 'Welcome'
  | 'AutoResponder'
  | 'Utility'
  | 'ServerManagement'
  | 'TempVoice'
  | 'Polls'
  | 'Reminders'
  | 'Fun';

export interface Command {
  name: string;
  description: string;
  category: CommandCategory;
  userPermissions?: PermissionResolvable[];
  botPermissions?: PermissionResolvable[];
  cooldown?: number; // seconds
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
  autocomplete?: (interaction: any) => Promise<void>;
}
