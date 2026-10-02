import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, ChannelType } from 'discord.js';
import { Command } from '../../types.js';
import { LoggingConfigModel, guildCache } from '@null-bot/database';
import { createEmbed, createSuccessEmbed } from '@null-bot/shared';

export const loggingCommand: Command = {
  name: 'logging',
  description: 'Configure event log channels',
  category: 'Logging',
  userPermissions: [PermissionFlagsBits.Administrator],
  botPermissions: [],
  data: new SlashCommandBuilder()
    .setName('logging')
    .setDescription('Configure event logging channels')
    .addSubcommand((sub) => sub.setName('status').setDescription('View current log channels'))
    .addSubcommand((sub) =>
      sub
        .setName('set')
        .setDescription('Set channel for a log category')
        .addStringOption((opt) =>
          opt
            .setName('category')
            .setDescription('Log type')
            .setRequired(true)
            .addChoices(
              { name: 'Messages', value: 'messageLogChannelId' },
              { name: 'Members', value: 'memberLogChannelId' },
              { name: 'Voice', value: 'voiceLogChannelId' },
              { name: 'Roles', value: 'roleLogChannelId' },
              { name: 'Channels', value: 'channelLogChannelId' },
              { name: 'Server', value: 'serverLogChannelId' },
              { name: 'Moderation', value: 'modLogChannelId' }
            )
        )
        .addChannelOption((opt) => opt.setName('channel').setDescription('Channel to send logs to').addChannelTypes(ChannelType.GuildText).setRequired(true))
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guild!.id;

    if (subcommand === 'status') {
      const config = await guildCache.getLoggingConfig(guildId);
      const getChan = (id?: string) => (id ? `<#${id}>` : 'Not Set');

      const embed = createEmbed({
        title: '📜 Logging Channels Configuration',
        fields: [
          { name: 'Message Logs', value: getChan(config.messageLogChannelId), inline: true },
          { name: 'Member Logs', value: getChan(config.memberLogChannelId), inline: true },
          { name: 'Voice Logs', value: getChan(config.voiceLogChannelId), inline: true },
          { name: 'Role Logs', value: getChan(config.roleLogChannelId), inline: true },
          { name: 'Channel Logs', value: getChan(config.channelLogChannelId), inline: true },
          { name: 'Server Logs', value: getChan(config.serverLogChannelId), inline: true },
          { name: 'Moderation Logs', value: getChan(config.modLogChannelId), inline: true },
        ],
      });
      await interaction.reply({ embeds: [embed] });
      return;
    }

    if (subcommand === 'set') {
      const category = interaction.options.getString('category', true);
      const channel = interaction.options.getChannel('channel', true);

      await LoggingConfigModel.updateOne(
        { guildId },
        { $set: { [category]: channel.id, enabled: true } },
        { upsert: true }
      );

      guildCache.invalidate(guildId, 'logging');

      await interaction.reply({
        embeds: [createSuccessEmbed(`Set **${category}** log channel to <#${channel.id}>.`)],
      });
    }
  },
};
