import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types.js';
import { ModerationCaseModel } from '@null-bot/database';
import { canModerate, createErrorEmbed, createSuccessEmbed, parseDuration } from '@null-bot/shared';
import { LoggingService } from '../../services/LoggingService.js';

export const banCommand: Command = {
  name: 'ban',
  description: 'Ban a member from the server with optional duration & reason',
  category: 'Moderation',
  userPermissions: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server')
    .addUserOption((opt) => opt.setName('target').setDescription('Member to ban').setRequired(true))
    .addStringOption((opt) => opt.setName('reason').setDescription('Reason for the ban').setRequired(false))
    .addStringOption((opt) => opt.setName('duration').setDescription('Temporary duration (e.g. 1d, 7d)').setRequired(false))
    .addIntegerOption((opt) => opt.setName('delete_days').setDescription('Days of message history to delete (0-7)').setMinValue(0).setMaxValue(7).setRequired(false)),

  async execute(interaction: ChatInputCommandInteraction) {
    const targetUser = interaction.options.getUser('target', true);
    const reason = interaction.options.getString('reason') || 'No reason provided.';
    const durationStr = interaction.options.getString('duration');
    const deleteDays = interaction.options.getInteger('delete_days') || 0;

    const guild = interaction.guild!;
    const moderator = interaction.member as any;
    const targetMember = await guild.members.fetch(targetUser.id).catch(() => null);

    if (targetMember) {
      const check = canModerate(moderator, targetMember);
      if (!check.canAction) {
        await interaction.reply({ embeds: [createErrorEmbed(check.reason!)], ephemeral: true });
        return;
      }
    }

    const durationMs = durationStr ? parseDuration(durationStr) : null;
    const expiresAt = durationMs ? new Date(Date.now() + durationMs) : null;

    // Execute Discord Ban
    await guild.members.ban(targetUser.id, {
      reason: `${reason} | Moderator: ${interaction.user.tag}`,
      deleteMessageSeconds: deleteDays * 24 * 60 * 60,
    });

    // Record case in database
    const caseCount = await ModerationCaseModel.countDocuments({ guildId: guild.id });
    const caseId = caseCount + 1;

    await ModerationCaseModel.create({
      guildId: guild.id,
      caseId,
      targetId: targetUser.id,
      targetTag: targetUser.tag,
      moderatorId: interaction.user.id,
      moderatorTag: interaction.user.tag,
      type: 'BAN',
      reason,
      duration: durationMs,
      expiresAt,
      active: true,
    });

    await interaction.reply({
      embeds: [createSuccessEmbed(`Banned **${targetUser.tag}** (Case #${caseId}).\n**Reason:** ${reason}${durationStr ? `\n**Duration:** ${durationStr}` : ''}`)],
    });

    // Log to moderation channel
    await LoggingService.logEvent(
      guild,
      'mod',
      `🔨 Member Banned (Case #${caseId})`,
      `**Target:** ${targetUser.tag} (${targetUser.id})\n**Moderator:** ${interaction.user.tag}\n**Reason:** ${reason}`
    );
  },
};
