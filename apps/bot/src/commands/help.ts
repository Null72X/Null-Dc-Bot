import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} from 'discord.js';
import { Command } from '../types.js';
import { createEmbed } from '@null-bot/shared';
import { botIdentity } from '@null-bot/config';

export const helpCommand: Command = {
  name: 'help',
  description: 'View commands menu by category',
  category: 'Utility',
  userPermissions: [],
  botPermissions: [],
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Explore bot commands by category')
    .addStringOption((opt) => opt.setName('command').setDescription('Specific command info').setRequired(false)),

  async execute(interaction: ChatInputCommandInteraction) {
    const client = interaction.client as any;
    const commandsCollection = client.commands as Map<string, Command>;

    const categories = Array.from(new Set(Array.from(commandsCollection.values()).map((c) => c.category)));

    const embed = createEmbed({
      title: `🤖 ${botIdentity.name} Command Directory`,
      description: `Welcome to **${botIdentity.name}**!\nSelect a category below or use \`/help command:<name>\` to view specific command details.\n\n**Total Commands:** \`${commandsCollection.size}\` across \`${categories.length}\` Categories.`,
      color: '#5865F2',
    });

    const menu = new StringSelectMenuBuilder()
      .setCustomId('help_category_select')
      .setPlaceholder('Browse Command Category...')
      .addOptions(
        categories.map((cat) => ({
          label: cat,
          value: cat,
          description: `View ${cat} category commands`,
        }))
      );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
