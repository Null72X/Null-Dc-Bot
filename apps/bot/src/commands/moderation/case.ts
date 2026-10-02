import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types.js';
import { ModerationCaseModel } from '@null-bot/database';
import { createEmbed, createErrorEmbed } from '@null-bot/shared';

export const caseCommand: Command = {
  name: 'case',
  description: 'View details of a moderation case',
  category: 'Moderation',
  userPermissions: [PermissionFlagsBits.ModerateMembers],
  botPermissions: [],
  data: new SlashCommandBuilder()
    .setName('case')
    .setDescription('View moderation case details')
    .addIntegerOption((opt) => opt.setName('number').setDescription('Case number').setRequired(true)),

  async execute(interaction: ChatInputCommandInteraction) {
    const caseId = interaction.options.getInteger('number', true);
    const guild = interaction.guild!;

    const modCase = await ModerationCaseModel.findOne({ guildId: guild.id, caseId });
    if (!modCase) {
      await interaction.reply({ embeds: [createErrorEmbed(`Case #${caseId} not found in this server.`)], ephemeral: true });
      return;
    }

    await interaction.reply({
      embeds: [
        createEmbed({
          title: `📋 Moderation Case #${modCase.caseId}`,
          fields: [
            { name: 'Target User', value: `${modCase.targetTag} (${modCase.targetId})`, inline: true },
            { name: 'Moderator', value: `${modCase.moderatorTag} (${modCase.moderatorId})`, inline: true },
            { name: 'Type', value: modCase.type, inline: true },
            { name: 'Reason', value: modCase.reason },
            { name: 'Date', value: new Date(modCase.createdAt).toLocaleString(), inline: true },
            { name: 'Active', value: modCase.active ? 'Yes' : 'No', inline: true },
          ],
        }),
      ],
    });
  },
};

export const historyCommand: Command = {
  name: 'history',
  description: 'View full infraction history for a user',
  category: 'Moderation',
  userPermissions: [PermissionFlagsBits.ModerateMembers],
  botPermissions: [],
  data: new SlashCommandBuilder()
    .setName('history')
    .setDescription('View full infraction history for a user')
    .addUserOption((opt) => opt.setName('target').setDescription('User to view history for').setRequired(true)),

  async execute(interaction: ChatInputCommandInteraction) {
    const targetUser = interaction.options.getUser('target', true);
    const guild = interaction.guild!;

    const cases = await ModerationCaseModel.find({ guildId: guild.id, targetId: targetUser.id }).sort({ caseId: -1 });

    if (cases.length === 0) {
      await interaction.reply({
        embeds: [createEmbed({ title: `📜 History for ${targetUser.tag}`, description: 'Clean record! No moderation cases found.' })],
      });
      return;
    }

    const fields = cases.slice(0, 10).map((c) => ({
      name: `Case #${c.caseId} [${c.type}] — ${new Date(c.createdAt).toLocaleDateString()}`,
      value: `**Reason:** ${c.reason}\n**Moderator:** ${c.moderatorTag}`,
    }));

    await interaction.reply({
      embeds: [
        createEmbed({
          title: `📜 History for ${targetUser.tag} (${cases.length} Total Cases)`,
          fields,
        }),
      ],
    });
  },
};
