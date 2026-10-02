import { Client, GatewayIntentBits, Partials, Collection } from 'discord.js';
import { Command } from './types.js';
import { allCommands } from './commands/index.js';
import { handleReady } from './events/ready.js';
import { handleInteractionCreate } from './events/interactionCreate.js';
import { handleMessageCreate } from './events/messageCreate.js';
import { handleGuildMemberAdd, handleGuildMemberRemove } from './events/guildMemberAdd.js';
import { handleVoiceStateUpdate, handleAuditLogEntryCreate } from './events/voiceStateUpdate.js';
import { createScopedLogger } from '@null-bot/logger';

const logger = createScopedLogger('NullClient');

export class NullClient extends Client {
  public commands: Collection<string, Command> = new Collection();

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
      ],
      partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User, Partials.GuildMember],
    });

    this.registerCommands();
    this.registerEvents();
  }

  private registerCommands(): void {
    logger.info(`Loading ${allCommands.length} commands...`);
    for (const cmd of allCommands) {
      this.commands.set(cmd.name, cmd);
    }
    logger.info(`Successfully registered ${this.commands.size} commands in memory.`);
  }

  private registerEvents(): void {
    this.once('ready', () => handleReady(this));

    this.on('interactionCreate', (interaction) => {
      handleInteractionCreate(interaction, this.commands);
    });

    this.on('messageCreate', (message) => {
      handleMessageCreate(message);
    });

    this.on('guildMemberAdd', (member: any) => {
      handleGuildMemberAdd(member);
    });

    this.on('guildMemberRemove', (member: any) => {
      handleGuildMemberRemove(member);
    });

    this.on('voiceStateUpdate', (oldState, newState) => {
      handleVoiceStateUpdate(oldState, newState);
    });

    this.on('guildAuditLogEntryCreate', (entry, guild) => {
      handleAuditLogEntryCreate(entry, guild);
    });
  }
}
