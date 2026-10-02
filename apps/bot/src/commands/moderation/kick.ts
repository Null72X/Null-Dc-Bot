import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types.js';
import { ModerationCaseModel } from '@null-bot/database';
import { canModerate, createErrorEmbed, createSuccessEmbed } from '@null-bot/shared';
import { LoggingService } from '../../services/LoggingService.js';

export const kickCommand: Command = {
  name: 'kick',
  description: 'Kick a member from the server',
  category: 'Moderation',
  userPermissions: [PermissionFlagsBits.KickMembers],
  botPermissions: [PermissionFlagsBits.KickMembers],
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the server')
    .addUserOption((opt) => opt.setName('target').setDescription('Member to kick').setRequired(true))
    .addStringOption((opt) => opt.setName('reason').setDescription('Reason for kicking').setRequired(false)),

  async execute(interaction: ChatInputCommandInteraction) {
    const targetUser = interaction.options.getUser('target', true);
    const reason = interaction.options.getString('reason') || 'No reason provided.';

    const guild = interaction.guild!;
    const moderator = interaction.member as any;
    const targetMember = await guild.members.fetch(targetUser.id).catch(() => null);

    if (!targetMember) {
      await interaction.reply({ embeds: [createErrorEmbed('Target member is not in this server.')], ephemeral: true });
      return;
    }

    const check = canModerate(moderator, targetMember);
    if (!check.canAction) {
      await interaction.reply({ embeds: [createErrorEmbed(check.reason!)], ephemeral: true });
      return;
    }

    await targetMember.kick(`${reason} | Moderator: ${interaction.user.tag}`);

    const caseCount = await ModerationCaseModel.countDocuments({ guildId: guild.id });
    const caseId = caseCount + 1;

    await ModerationCaseModel.create({
      guildId: guild.id,
      caseId,
      targetId: targetUser.id,
      targetTag: targetUser.tag,
      moderatorId: interaction.user.id,
      moderatorTag: interaction.user.tag,
      type: 'KICK',
      reason,
      active: true,
    });

    await interaction.reply({
      embeds: [createSuccessEmbed(`Kicked **${targetUser.tag}** (Case #${caseId}).\n**Reason:** ${reason}`)],
    });

    await LoggingService.logEvent(
      guild,
      'mod',
      `👢 Member Kicked (Case #${caseId})`,
      `**Target:** ${targetUser.tag} (${targetUser.id})\n**Moderator:** ${interaction.user.tag}\n**Reason:** ${reason}`
    );
  },
};
