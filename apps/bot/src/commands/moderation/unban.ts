import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types.js';
import { ModerationCaseModel } from '@null-bot/database';
import { createErrorEmbed, createSuccessEmbed } from '@null-bot/shared';
import { LoggingService } from '../../services/LoggingService.js';

export const unbanCommand: Command = {
  name: 'unban',
  description: 'Unban a user by ID',
  category: 'Moderation',
  userPermissions: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user by User ID')
    .addStringOption((opt) => opt.setName('user_id').setDescription('Discord User ID to unban').setRequired(true))
    .addStringOption((opt) => opt.setName('reason').setDescription('Reason for unbanning').setRequired(false)),

  async execute(interaction: ChatInputCommandInteraction) {
    const userId = interaction.options.getString('user_id', true);
    const reason = interaction.options.getString('reason') || 'No reason provided.';

    const guild = interaction.guild!;

    try {
      await guild.members.unban(userId, `${reason} | Moderator: ${interaction.user.tag}`);

      await ModerationCaseModel.updateMany(
        { guildId: guild.id, targetId: userId, type: 'BAN', active: true },
        { active: false }
      );

      await interaction.reply({
        embeds: [createSuccessEmbed(`Unbanned user ID **${userId}**.\n**Reason:** ${reason}`)],
      });

      await LoggingService.logEvent(
        guild,
        'mod',
        `🔓 User Unbanned`,
        `**User ID:** ${userId}\n**Moderator:** ${interaction.user.tag}\n**Reason:** ${reason}`
      );
    } catch (e) {
      await interaction.reply({ embeds: [createErrorEmbed(`Failed to unban user ID **${userId}**. Verify the ID and ban status.`)], ephemeral: true });
    }
  },
};
