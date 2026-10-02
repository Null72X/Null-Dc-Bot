import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types.js';
import { ModerationCaseModel } from '@null-bot/database';
import { canModerate, createErrorEmbed, createSuccessEmbed, parseDuration } from '@null-bot/shared';
import { LoggingService } from '../../services/LoggingService.js';

export const timeoutCommand: Command = {
  name: 'timeout',
  description: 'Timeout or untimeout a member',
  category: 'Moderation',
  userPermissions: [PermissionFlagsBits.ModerateMembers],
  botPermissions: [PermissionFlagsBits.ModerateMembers],
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a member')
    .addUserOption((opt) => opt.setName('target').setDescription('Member to timeout').setRequired(true))
    .addStringOption((opt) => opt.setName('duration').setDescription('Duration (e.g. 10m, 2h, 1d)').setRequired(true))
    .addStringOption((opt) => opt.setName('reason').setDescription('Reason for timeout').setRequired(false)),

  async execute(interaction: ChatInputCommandInteraction) {
    const targetUser = interaction.options.getUser('target', true);
    const durationStr = interaction.options.getString('duration', true);
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

    const durationMs = parseDuration(durationStr);
    if (!durationMs) {
      await interaction.reply({ embeds: [createErrorEmbed('Invalid duration format. Use e.g. 10m, 2h, 1d.')], ephemeral: true });
      return;
    }

    await targetMember.timeout(durationMs, `${reason} | Moderator: ${interaction.user.tag}`);

    const caseCount = await ModerationCaseModel.countDocuments({ guildId: guild.id });
    const caseId = caseCount + 1;

    await ModerationCaseModel.create({
      guildId: guild.id,
      caseId,
      targetId: targetUser.id,
      targetTag: targetUser.tag,
      moderatorId: interaction.user.id,
      moderatorTag: interaction.user.tag,
      type: 'TIMEOUT',
      reason,
      duration: durationMs,
      expiresAt: new Date(Date.now() + durationMs),
      active: true,
    });

    await interaction.reply({
      embeds: [createSuccessEmbed(`Timed out **${targetUser.tag}** for ${durationStr} (Case #${caseId}).\n**Reason:** ${reason}`)],
    });

    await LoggingService.logEvent(
      guild,
      'mod',
      `⏳ Member Timed Out (Case #${caseId})`,
      `**Target:** ${targetUser.tag} (${targetUser.id})\n**Duration:** ${durationStr}\n**Moderator:** ${interaction.user.tag}\n**Reason:** ${reason}`
    );
  },
};

export const untimeoutCommand: Command = {
  name: 'untimeout',
  description: 'Remove timeout from a member',
  category: 'Moderation',
  userPermissions: [PermissionFlagsBits.ModerateMembers],
  botPermissions: [PermissionFlagsBits.ModerateMembers],
  data: new SlashCommandBuilder()
    .setName('untimeout')
    .setDescription('Remove timeout from a member')
    .addUserOption((opt) => opt.setName('target').setDescription('Member to untimeout').setRequired(true))
    .addStringOption((opt) => opt.setName('reason').setDescription('Reason for removing timeout').setRequired(false)),

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

    await targetMember.timeout(null, `${reason} | Moderator: ${interaction.user.tag}`);

    await interaction.reply({
      embeds: [createSuccessEmbed(`Removed timeout from **${targetUser.tag}**.\n**Reason:** ${reason}`)],
    });

    await LoggingService.logEvent(
      guild,
      'mod',
      `⌛ Timeout Removed`,
      `**Target:** ${targetUser.tag} (${targetUser.id})\n**Moderator:** ${interaction.user.tag}\n**Reason:** ${reason}`
    );
  },
};
