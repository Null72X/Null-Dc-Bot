import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, TextChannel } from 'discord.js';
import { Command } from '../../types.js';
import { createErrorEmbed, createSuccessEmbed, parseDuration } from '@null-bot/shared';
import { LoggingService } from '../../services/LoggingService.js';

export const lockCommand: Command = {
  name: 'lock',
  description: 'Lock a text channel from sending messages',
  category: 'Moderation',
  userPermissions: [PermissionFlagsBits.ManageChannels],
  botPermissions: [PermissionFlagsBits.ManageChannels],
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Lock a channel')
    .addStringOption((opt) => opt.setName('reason').setDescription('Reason for locking').setRequired(false)),

  async execute(interaction: ChatInputCommandInteraction) {
    const channel = interaction.channel as TextChannel;
    const reason = interaction.options.getString('reason') || 'No reason provided.';

    await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
      SendMessages: false,
    });

    await interaction.reply({
      embeds: [createSuccessEmbed(`🔒 Channel **#${channel.name}** has been locked.\n**Reason:** ${reason}`)],
    });

    await LoggingService.logEvent(
      interaction.guild!,
      'channel',
      `🔒 Channel Locked`,
      `**Channel:** #${channel.name}\n**Moderator:** ${interaction.user.tag}\n**Reason:** ${reason}`
    );
  },
};

export const unlockCommand: Command = {
  name: 'unlock',
  description: 'Unlock a text channel',
  category: 'Moderation',
  userPermissions: [PermissionFlagsBits.ManageChannels],
  botPermissions: [PermissionFlagsBits.ManageChannels],
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Unlock a channel')
    .addStringOption((opt) => opt.setName('reason').setDescription('Reason for unlocking').setRequired(false)),

  async execute(interaction: ChatInputCommandInteraction) {
    const channel = interaction.channel as TextChannel;
    const reason = interaction.options.getString('reason') || 'No reason provided.';

    await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
      SendMessages: null,
    });

    await interaction.reply({
      embeds: [createSuccessEmbed(`🔓 Channel **#${channel.name}** has been unlocked.\n**Reason:** ${reason}`)],
    });

    await LoggingService.logEvent(
      interaction.guild!,
      'channel',
      `🔓 Channel Unlocked`,
      `**Channel:** #${channel.name}\n**Moderator:** ${interaction.user.tag}\n**Reason:** ${reason}`
    );
  },
};

export const slowmodeCommand: Command = {
  name: 'slowmode',
  description: 'Set channel slowmode cooldown',
  category: 'Moderation',
  userPermissions: [PermissionFlagsBits.ManageChannels],
  botPermissions: [PermissionFlagsBits.ManageChannels],
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Set channel slowmode')
    .addIntegerOption((opt) => opt.setName('seconds').setDescription('Slowmode duration in seconds (0 to disable)').setMinValue(0).setMaxValue(21600).setRequired(true)),

  async execute(interaction: ChatInputCommandInteraction) {
    const seconds = interaction.options.getInteger('seconds', true);
    const channel = interaction.channel as TextChannel;

    await channel.setRateLimitPerUser(seconds);

    await interaction.reply({
      embeds: [createSuccessEmbed(seconds > 0 ? `🐢 Slowmode set to **${seconds} seconds** in #${channel.name}.` : `🚀 Slowmode disabled in #${channel.name}.`)],
    });
  },
};
