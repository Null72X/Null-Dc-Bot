import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types.js';
import { AutoModRuleModel, guildCache } from '@null-bot/database';
import { createEmbed, createSuccessEmbed } from '@null-bot/shared';

export const autoModCommand: Command = {
  name: 'automod',
  description: 'View or configure AutoModeration settings',
  category: 'AutoModeration',
  userPermissions: [PermissionFlagsBits.Administrator],
  botPermissions: [],
  data: new SlashCommandBuilder()
    .setName('automod')
    .setDescription('Configure AutoModeration filters')
    .addSubcommand((sub) =>
      sub.setName('status').setDescription('View current AutoMod configuration')
    )
    .addSubcommand((sub) =>
      sub
        .setName('toggle')
        .setDescription('Toggle an AutoMod filter')
        .addStringOption((opt) =>
          opt
            .setName('filter')
            .setDescription('Filter type')
            .setRequired(true)
            .addChoices(
              { name: 'Bad Words', value: 'badWords' },
              { name: 'Invites', value: 'invites' },
              { name: 'External Links', value: 'links' },
              { name: 'Spam Bursts', value: 'spam' },
              { name: 'Caps', value: 'caps' },
              { name: 'Mentions', value: 'mentions' }
            )
        )
        .addBooleanOption((opt) => opt.setName('enabled').setDescription('Enable or disable filter').setRequired(true))
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guild!.id;

    if (subcommand === 'status') {
      const rule = await guildCache.getAutoModRule(guildId);
      const embed = createEmbed({
        title: '🛡️ AutoModeration Status',
        fields: [
          { name: 'Bad Words Filter', value: rule.badWords?.enabled ? '✅ Enabled' : '❌ Disabled', inline: true },
          { name: 'Invites Filter', value: rule.invites?.enabled ? '✅ Enabled' : '❌ Disabled', inline: true },
          { name: 'Links Filter', value: rule.links?.enabled ? '✅ Enabled' : '❌ Disabled', inline: true },
          { name: 'Spam Filter', value: rule.spam?.enabled ? '✅ Enabled' : '❌ Disabled', inline: true },
          { name: 'Caps Filter', value: rule.caps?.enabled ? '✅ Enabled' : '❌ Disabled', inline: true },
          { name: 'Mentions Filter', value: rule.mentions?.enabled ? '✅ Enabled' : '❌ Disabled', inline: true },
        ],
      });
      await interaction.reply({ embeds: [embed] });
      return;
    }

    if (subcommand === 'toggle') {
      const filter = interaction.options.getString('filter', true);
      const enabled = interaction.options.getBoolean('enabled', true);

      await AutoModRuleModel.updateOne(
        { guildId },
        { $set: { [`${filter}.enabled`]: enabled } },
        { upsert: true }
      );

      guildCache.invalidate(guildId, 'automod');

      await interaction.reply({
        embeds: [createSuccessEmbed(`Updated AutoMod **${filter}** filter to **${enabled ? 'Enabled' : 'Disabled'}**.`)]
      });
    }
  },
};
