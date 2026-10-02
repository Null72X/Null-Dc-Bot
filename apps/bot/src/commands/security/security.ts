import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types.js';
import { SecurityConfigModel, SecurityIncidentModel, guildCache } from '@null-bot/database';
import { createEmbed, createSuccessEmbed } from '@null-bot/shared';

export const securityCommand: Command = {
  name: 'security',
  description: 'View security status and recent incidents',
  category: 'Security',
  userPermissions: [PermissionFlagsBits.Administrator],
  botPermissions: [],
  data: new SlashCommandBuilder()
    .setName('security')
    .setDescription('Server Anti-Raid & Anti-Nuke security')
    .addSubcommand((sub) => sub.setName('status').setDescription('View security settings status'))
    .addSubcommand((sub) => sub.setName('incidents').setDescription('View recent security incidents')),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    const guild = interaction.guild!;

    if (subcommand === 'status') {
      const config = await guildCache.getSecurityConfig(guild.id);
      const embed = createEmbed({
        title: '🛡️ Security Engine Status',
        fields: [
          { name: 'Global Security', value: config.enabled ? '✅ Active' : '❌ Disabled', inline: true },
          { name: 'Anti-Raid', value: config.antiRaid?.enabled ? `✅ Enabled (${config.antiRaid.joinThreshold} joins / ${config.antiRaid.intervalMs / 1000}s)` : '❌ Disabled', inline: true },
          { name: 'Anti-Nuke', value: config.antiNuke?.enabled ? `✅ Enabled (Action: ${config.antiNuke.action})` : '❌ Disabled', inline: true },
        ],
      });
      await interaction.reply({ embeds: [embed] });
      return;
    }

    if (subcommand === 'incidents') {
      const incidents = await SecurityIncidentModel.find({ guildId: guild.id }).sort({ createdAt: -1 }).limit(5);
      if (incidents.length === 0) {
        await interaction.reply({ embeds: [createSuccessEmbed('No security incidents recorded.')] });
        return;
      }

      const fields = incidents.map((inc) => ({
        name: `🚨 ${inc.incidentId} — ${inc.type}`,
        value: `**Executor:** ${inc.executorTag}\n**Action Taken:** ${inc.actionTaken}\n**Details:** ${inc.details}\n**Date:** ${new Date(inc.createdAt).toLocaleString()}`,
      }));

      await interaction.reply({
        embeds: [createEmbed({ title: '🚨 Recent Security Incidents', fields, color: '#ED4245' })],
      });
    }
  },
};
