import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types.js';
import { AutoResponderModel } from '@null-bot/database';
import { createEmbed, createErrorEmbed, createSuccessEmbed } from '@null-bot/shared';
import crypto from 'crypto';

export const autoResponderCommand: Command = {
  name: 'autoresponder',
  description: 'Manage automatic triggers and responses',
  category: 'AutoResponder',
  userPermissions: [PermissionFlagsBits.ManageGuild],
  botPermissions: [],
  data: new SlashCommandBuilder()
    .setName('autoresponder')
    .setDescription('AutoResponder management')
    .addSubcommand((sub) =>
      sub
        .setName('add')
        .setDescription('Add a new trigger response')
        .addStringOption((opt) => opt.setName('trigger').setDescription('Trigger phrase').setRequired(true))
        .addStringOption((opt) => opt.setName('response').setDescription('Response message').setRequired(true))
        .addStringOption((opt) =>
          opt
            .setName('match_type')
            .setDescription('Match rule')
            .setRequired(false)
            .addChoices(
              { name: 'Exact Match', value: 'EXACT' },
              { name: 'Contains', value: 'CONTAINS' },
              { name: 'Regex Pattern', value: 'REGEX' }
            )
        )
    )
    .addSubcommand((sub) => sub.setName('list').setDescription('List all auto responders'))
    .addSubcommand((sub) =>
      sub
        .setName('delete')
        .setDescription('Delete an auto responder trigger')
        .addStringOption((opt) => opt.setName('trigger_id').setDescription('Trigger ID to delete').setRequired(true))
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guild!.id;

    if (subcommand === 'add') {
      const trigger = interaction.options.getString('trigger', true);
      const response = interaction.options.getString('response', true);
      const matchType = (interaction.options.getString('match_type') || 'EXACT') as 'EXACT' | 'CONTAINS' | 'REGEX';

      const triggerId = `trig_${crypto.randomBytes(3).toString('hex')}`;

      await AutoResponderModel.create({
        guildId,
        triggerId,
        trigger,
        response,
        matchType,
        caseSensitive: false,
        isEmbed: false,
        enabled: true,
      });

      await interaction.reply({
        embeds: [createSuccessEmbed(`Added AutoResponder trigger \`${trigger}\` (ID: \`${triggerId}\`).`)],
      });
      return;
    }

    if (subcommand === 'list') {
      const triggers = await AutoResponderModel.find({ guildId });
      if (triggers.length === 0) {
        await interaction.reply({ embeds: [createSuccessEmbed('No auto responders configured.')] });
        return;
      }

      const fields = triggers.map((t) => ({
        name: `ID: ${t.triggerId} | Trigger: "${t.trigger}" (${t.matchType})`,
        value: `**Response:** ${t.response}`,
      }));

      await interaction.reply({ embeds: [createEmbed({ title: '🤖 Configured Auto Responders', fields })] });
      return;
    }

    if (subcommand === 'delete') {
      const triggerId = interaction.options.getString('trigger_id', true);
      const res = await AutoResponderModel.deleteOne({ guildId, triggerId });

      if (res.deletedCount === 0) {
        await interaction.reply({ embeds: [createErrorEmbed(`AutoResponder ID \`${triggerId}\` not found.`)], ephemeral: true });
        return;
      }

      await interaction.reply({ embeds: [createSuccessEmbed(`Deleted AutoResponder trigger \`${triggerId}\`.`)] });
    }
  },
};
