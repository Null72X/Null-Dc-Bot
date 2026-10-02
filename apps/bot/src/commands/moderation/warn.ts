import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types.js';
import { ModerationCaseModel } from '@null-bot/database';
import { createEmbed, createErrorEmbed, createSuccessEmbed } from '@null-bot/shared';
import { LoggingService } from '../../services/LoggingService.js';

export const warnCommand: Command = {
  name: 'warn',
  description: 'Issue a formal warning to a member',
  category: 'Moderation',
  userPermissions: [PermissionFlagsBits.ModerateMembers],
  botPermissions: [],
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Issue a formal warning to a member')
    .addUserOption((opt) => opt.setName('target').setDescription('Member to warn').setRequired(true))
    .addStringOption((opt) => opt.setName('reason').setDescription('Reason for warning').setRequired(true)),

  async execute(interaction: ChatInputCommandInteraction) {
    const targetUser = interaction.options.getUser('target', true);
    const reason = interaction.options.getString('reason', true);

    const guild = interaction.guild!;
    const caseCount = await ModerationCaseModel.countDocuments({ guildId: guild.id });
    const caseId = caseCount + 1;

    await ModerationCaseModel.create({
      guildId: guild.id,
      caseId,
      targetId: targetUser.id,
      targetTag: targetUser.tag,
      moderatorId: interaction.user.id,
      moderatorTag: interaction.user.tag,
      type: 'WARN',
      reason,
      active: true,
    });

    await interaction.reply({
      embeds: [createSuccessEmbed(`Warned **${targetUser.tag}** (Case #${caseId}).\n**Reason:** ${reason}`)],
    });

    await LoggingService.logEvent(
      guild,
      'mod',
      `⚠️ Member Warned (Case #${caseId})`,
      `**Target:** ${targetUser.tag} (${targetUser.id})\n**Moderator:** ${interaction.user.tag}\n**Reason:** ${reason}`
    );
  },
};

export const warningsCommand: Command = {
  name: 'warnings',
  description: 'View warning history of a member',
  category: 'Moderation',
  userPermissions: [PermissionFlagsBits.ModerateMembers],
  botPermissions: [],
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('View warning history of a member')
    .addUserOption((opt) => opt.setName('target').setDescription('Member to view warnings for').setRequired(true)),

  async execute(interaction: ChatInputCommandInteraction) {
    const targetUser = interaction.options.getUser('target', true);
    const guild = interaction.guild!;

    const warnings = await ModerationCaseModel.find({
      guildId: guild.id,
      targetId: targetUser.id,
      type: 'WARN',
    }).sort({ caseId: -1 });

    if (warnings.length === 0) {
      await interaction.reply({
        embeds: [createSuccessEmbed(`**${targetUser.tag}** has 0 warnings on record.`)],
      });
      return;
    }

    const fields = warnings.slice(0, 10).map((w) => ({
      name: `Case #${w.caseId} | ${new Date(w.createdAt).toLocaleDateString()}`,
      value: `**Reason:** ${w.reason}\n**Moderator:** ${w.moderatorTag}`,
    }));

    await interaction.reply({
      embeds: [
        createEmbed({
          title: `⚠️ Warnings for ${targetUser.tag} (${warnings.length} Total)`,
          fields,
          color: '#FEE75C',
        }),
      ],
    });
  },
};
