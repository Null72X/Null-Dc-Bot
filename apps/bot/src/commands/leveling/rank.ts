import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types.js';
import { LevelModel } from '@null-bot/database';
import { LevelingService } from '../../services/LevelingService.js';
import { createEmbed } from '@null-bot/shared';

export const rankCommand: Command = {
  name: 'rank',
  description: 'View your or another user rank and XP level',
  category: 'Leveling',
  userPermissions: [],
  botPermissions: [],
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('View rank and XP level card')
    .addUserOption((opt) => opt.setName('user').setDescription('User to view rank for').setRequired(false)),

  async execute(interaction: ChatInputCommandInteraction) {
    const targetUser = interaction.options.getUser('user') || interaction.user;
    const guild = interaction.guild!;

    const userLevel = await LevelModel.findOne({ guildId: guild.id, userId: targetUser.id });
    const xp = userLevel ? userLevel.xp : 0;
    const level = userLevel ? userLevel.level : 0;

    const reqXpCurrent = LevelingService.calculateXpForLevel(level);
    const reqXpNext = LevelingService.calculateXpForLevel(level + 1);

    // Get leaderboard rank position
    const totalAbove = await LevelModel.countDocuments({ guildId: guild.id, xp: { $gt: xp } });
    const rankPos = totalAbove + 1;

    const embed = createEmbed({
      title: `⭐ Rank Card — ${targetUser.username}`,
      fields: [
        { name: 'Rank Position', value: `#${rankPos}`, inline: true },
        { name: 'Current Level', value: `Level ${level}`, inline: true },
        { name: 'Total XP', value: `${xp.toLocaleString()} XP`, inline: true },
        { name: 'Next Level Progress', value: `${Math.floor(xp - reqXpCurrent)} / ${Math.floor(reqXpNext - reqXpCurrent)} XP`, inline: false },
        { name: 'Messages Sent', value: `${userLevel?.messagesCount || 0}`, inline: true },
      ],
      thumbnailUrl: targetUser.displayAvatarURL(),
      color: '#5865F2',
    });

    await interaction.reply({ embeds: [embed] });
  },
};
