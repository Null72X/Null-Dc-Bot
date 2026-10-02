import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types.js';
import { ReminderModel } from '@null-bot/database';
import { createErrorEmbed, createSuccessEmbed, parseDuration } from '@null-bot/shared';
import crypto from 'crypto';

export const remindCommand: Command = {
  name: 'remind',
  description: 'Set a personal or channel reminder',
  category: 'Reminders',
  userPermissions: [],
  botPermissions: [],
  data: new SlashCommandBuilder()
    .setName('remind')
    .setDescription('Set a reminder')
    .addStringOption((opt) => opt.setName('duration').setDescription('Duration (e.g. 10m, 2h, 1d)').setRequired(true))
    .addStringOption((opt) => opt.setName('message').setDescription('Reminder message').setRequired(true)),

  async execute(interaction: ChatInputCommandInteraction) {
    const durationStr = interaction.options.getString('duration', true);
    const message = interaction.options.getString('message', true);

    const durationMs = parseDuration(durationStr);
    if (!durationMs) {
      await interaction.reply({ embeds: [createErrorEmbed('Invalid duration. Use e.g. 10m, 2h, 1d.')], ephemeral: true });
      return;
    }

    const remindAt = new Date(Date.now() + durationMs);
    const reminderId = `rem_${crypto.randomBytes(4).toString('hex')}`;

    await ReminderModel.create({
      reminderId,
      userId: interaction.user.id,
      guildId: interaction.guild?.id,
      channelId: interaction.channelId,
      message,
      remindAt,
    });

    await interaction.reply({
      embeds: [createSuccessEmbed(`⏰ Reminder set for <t:${Math.floor(remindAt.getTime() / 1000)}:R>!\n**Message:** ${message}`)],
    });
  },
};
