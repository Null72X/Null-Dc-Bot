import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, ChannelType } from 'discord.js';
import { Command } from '../../types.js';
import { TempVoiceConfigModel, guildCache } from '@null-bot/database';
import { createSuccessEmbed } from '@null-bot/shared';

export const tempVoiceCommand: Command = {
  name: 'tempvoice',
  description: 'Setup Join-to-Create temporary voice channel system',
  category: 'TempVoice',
  userPermissions: [PermissionFlagsBits.ManageChannels],
  botPermissions: [PermissionFlagsBits.ManageChannels],
  data: new SlashCommandBuilder()
    .setName('tempvoice')
    .setDescription('Setup Join-to-Create voice channels')
    .addChannelOption((opt) =>
      opt
        .setName('join_channel')
        .setDescription('Voice channel members join to create their room')
        .addChannelTypes(ChannelType.GuildVoice)
        .setRequired(true)
    )
    .addStringOption((opt) => opt.setName('template').setDescription('Channel name template (e.g. 🔊 {user}\'s Room)').setRequired(false)),

  async execute(interaction: ChatInputCommandInteraction) {
    const joinChannel = interaction.options.getChannel('join_channel', true);
    const template = interaction.options.getString('template') || "🔊 {user}'s Room";
    const guildId = interaction.guild!.id;

    await TempVoiceConfigModel.updateOne(
      { guildId },
      { $set: { joinChannelId: joinChannel.id, channelNameTemplate: template, enabled: true } },
      { upsert: true }
    );

    guildCache.invalidate(guildId, 'tempvoice');

    await interaction.reply({
      embeds: [createSuccessEmbed(`Configured Join-to-Create channel <#${joinChannel.id}> with template \`${template}\`.`)],
    });
  },
};
