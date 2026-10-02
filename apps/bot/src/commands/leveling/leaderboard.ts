import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types.js';
import { LevelModel } from '@null-bot/database';
import { createEmbed, createErrorEmbed } from '@null-bot/shared';

export const leaderboardCommand: Command = {
  name: 'leaderboard',
  description: 'View top XP leaderboard for the server',
  category: 'Leveling',
  userPermissions: [],
  botPermissions: [],
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('View server top XP leaderboard'),

  async execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild!;
    const topLevels = await LevelModel.find({ guildId: guild.id }).sort({ xp: -1 }).limit(10);

    if (topLevels.length === 0) {
      await interaction.reply({ embeds: [createErrorEmbed('No leveling data found for this server yet.')], ephemeral: true });
      return;
    }

    const fields = await Promise.all(
      topLevels.map(async (lvl, idx) => {
        const user = await interaction.client.users.fetch(lvl.userId).catch(() => null);
        const name = user ? user.tag : `User (${lvl.userId})`;
        return {
          name: `#${idx + 1} — ${name}`,
          value: `**Level ${lvl.level}** | ${lvl.xp.toLocaleString()} XP | ${lvl.messagesCount} Msgs`,
          inline: false,
        };
      })
    );

    const embed = createEmbed({
      title: `🏆 Server XP Leaderboard — ${guild.name}`,
      fields,
      color: '#FEE75C',
    });

    await interaction.reply({ embeds: [embed] });
  },
};
