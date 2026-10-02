import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  TextChannel,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';
import { Command } from '../../types.js';
import { GiveawayModel } from '@null-bot/database';
import { GiveawayService } from '../../services/GiveawayService.js';
import { createEmbed, createErrorEmbed, createSuccessEmbed, parseDuration, secureRandomInt } from '@null-bot/shared';

export const giveawayCommand: Command = {
  name: 'giveaway',
  description: 'Manage giveaways (start, end, reroll, cancel)',
  category: 'Giveaways',
  userPermissions: [PermissionFlagsBits.ManageGuild],
  botPermissions: [],
  data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Giveaway management commands')
    .addSubcommand((sub) =>
      sub
        .setName('start')
        .setDescription('Start a new giveaway')
        .addStringOption((opt) => opt.setName('duration').setDescription('Duration (e.g. 1h, 1d)').setRequired(true))
        .addIntegerOption((opt) => opt.setName('winners').setDescription('Winner count').setMinValue(1).setMaxValue(20).setRequired(true))
        .addStringOption((opt) => opt.setName('prize').setDescription('Giveaway prize title').setRequired(true))
        .addRoleOption((opt) => opt.setName('required_role').setDescription('Role required to enter').setRequired(false))
    )
    .addSubcommand((sub) =>
      sub
        .setName('end')
        .setDescription('End an active giveaway immediately')
        .addStringOption((opt) => opt.setName('message_id').setDescription('Giveaway message ID').setRequired(true))
    )
    .addSubcommand((sub) =>
      sub
        .setName('reroll')
        .setDescription('Reroll new winner(s) for an ended giveaway')
        .addStringOption((opt) => opt.setName('message_id').setDescription('Giveaway message ID').setRequired(true))
    )
    .addSubcommand((sub) =>
      sub
        .setName('cancel')
        .setDescription('Cancel an active giveaway')
        .addStringOption((opt) => opt.setName('message_id').setDescription('Giveaway message ID').setRequired(true))
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    const guild = interaction.guild!;

    if (subcommand === 'start') {
      const durationStr = interaction.options.getString('duration', true);
      const winnerCount = interaction.options.getInteger('winners', true);
      const prize = interaction.options.getString('prize', true);
      const reqRole = interaction.options.getRole('required_role');

      const durationMs = parseDuration(durationStr);
      if (!durationMs) {
        await interaction.reply({ embeds: [createErrorEmbed('Invalid duration format. Use e.g. 10m, 2h, 1d.')], ephemeral: true });
        return;
      }

      const endsAt = new Date(Date.now() + durationMs);
      const channel = interaction.channel as TextChannel;

      const embed = createEmbed({
        title: `🎉 Giveaway: ${prize}`,
        description: `Click **Enter Giveaway** below to enter!\n\n**Winners:** ${winnerCount}\n**Ends:** <t:${Math.floor(endsAt.getTime() / 1000)}:R>\n**Hosted By:** <@${interaction.user.id}>${reqRole ? `\n**Required Role:** <@&${reqRole.id}>` : ''}`,
        color: '#FEE75C',
      });

      const enterButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId('giveaway_enter')
          .setLabel('Enter Giveaway (0)')
          .setStyle(ButtonStyle.Primary)
          .setEmoji('🎉')
      );

      const msg = await channel.send({ embeds: [embed], components: [enterButton] });

      await GiveawayModel.create({
        guildId: guild.id,
        channelId: channel.id,
        messageId: msg.id,
        prize,
        winnerCount,
        endsAt,
        hostedBy: interaction.user.id,
        requiredRoles: reqRole ? [reqRole.id] : [],
        entries: [],
        winners: [],
        ended: false,
      });

      await interaction.reply({ content: 'Giveaway started successfully!', ephemeral: true });
      return;
    }

    if (subcommand === 'end') {
      const messageId = interaction.options.getString('message_id', true);
      const winners = await GiveawayService.endGiveaway(interaction.client, messageId);
      await interaction.reply({ embeds: [createSuccessEmbed(`Ended giveaway. Winners: ${winners.length > 0 ? winners.map((w) => `<@${w}>`).join(', ') : 'None'}`)] });
      return;
    }

    if (subcommand === 'reroll') {
      const messageId = interaction.options.getString('message_id', true);
      const giveaway = await GiveawayModel.findOne({ messageId, guildId: guild.id });
      if (!giveaway || !giveaway.ended) {
        await interaction.reply({ embeds: [createErrorEmbed('Giveaway not found or is still active.')], ephemeral: true });
        return;
      }

      const entries = [...new Set(giveaway.entries)];
      if (entries.length === 0) {
        await interaction.reply({ embeds: [createErrorEmbed('No entries found for this giveaway.')], ephemeral: true });
        return;
      }

      const randomIndex = secureRandomInt(entries.length);
      const newWinner = entries[randomIndex];

      await interaction.reply({
        embeds: [createSuccessEmbed(`🎉 New Winner Rerolled: <@${newWinner}>! Congratulations!`)],
      });
      return;
    }

    if (subcommand === 'cancel') {
      const messageId = interaction.options.getString('message_id', true);
      await GiveawayModel.deleteOne({ messageId, guildId: guild.id });
      await interaction.reply({ embeds: [createSuccessEmbed('Cancelled giveaway and deleted record.')] });
    }
  },
};
