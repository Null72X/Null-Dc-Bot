import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, TextChannel } from 'discord.js';
import { Command } from '../../types.js';
import { createErrorEmbed, createSuccessEmbed } from '@null-bot/shared';
import { LoggingService } from '../../services/LoggingService.js';

export const purgeCommand: Command = {
  name: 'purge',
  description: 'Bulk delete messages from channel',
  category: 'Moderation',
  userPermissions: [PermissionFlagsBits.ManageMessages],
  botPermissions: [PermissionFlagsBits.ManageMessages],
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Bulk delete messages from channel')
    .addIntegerOption((opt) => opt.setName('amount').setDescription('Number of messages to delete (1-100)').setMinValue(1).setMaxValue(100).setRequired(true))
    .addUserOption((opt) => opt.setName('target').setDescription('Only delete messages from this specific user').setRequired(false)),

  async execute(interaction: ChatInputCommandInteraction) {
    const amount = interaction.options.getInteger('amount', true);
    const targetUser = interaction.options.getUser('target');
    const channel = interaction.channel as TextChannel;

    if (!channel || !channel.isTextBased()) {
      await interaction.reply({ embeds: [createErrorEmbed('This command can only be used in text channels.')], ephemeral: true });
      return;
    }

    const messages = await channel.messages.fetch({ limit: amount });
    let toDelete = Array.from(messages.values());

    if (targetUser) {
      toDelete = toDelete.filter((m) => m.author.id === targetUser.id);
    }

    const deleted = await channel.bulkDelete(toDelete, true).catch(() => null);
    const count = deleted ? deleted.size : 0;

    await interaction.reply({
      embeds: [createSuccessEmbed(`Deleted **${count}** messages from ${channel.name}${targetUser ? ` (by ${targetUser.tag})` : ''}.`)],
      ephemeral: true,
    });

    await LoggingService.logEvent(
      interaction.guild!,
      'message',
      `🧹 Bulk Message Purge`,
      `**Channel:** ${channel.name} (${channel.id})\n**Amount Requested:** ${amount}\n**Amount Deleted:** ${count}\n**Moderator:** ${interaction.user.tag}`
    );
  },
};
