import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  TextChannel,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';
import { Command } from '../../types.js';
import { PollModel } from '@null-bot/database';
import { createEmbed, createSuccessEmbed, parseDuration } from '@null-bot/shared';

export const pollCommand: Command = {
  name: 'poll',
  description: 'Create an interactive voting poll',
  category: 'Polls',
  userPermissions: [],
  botPermissions: [],
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Create an interactive poll')
    .addStringOption((opt) => opt.setName('question').setDescription('Poll question').setRequired(true))
    .addStringOption((opt) => opt.setName('option1').setDescription('Option 1').setRequired(true))
    .addStringOption((opt) => opt.setName('option2').setDescription('Option 2').setRequired(true))
    .addStringOption((opt) => opt.setName('option3').setDescription('Option 3').setRequired(false))
    .addStringOption((opt) => opt.setName('duration').setDescription('Poll duration (e.g. 1h, 1d)').setRequired(false)),

  async execute(interaction: ChatInputCommandInteraction) {
    const question = interaction.options.getString('question', true);
    const opt1 = interaction.options.getString('option1', true);
    const opt2 = interaction.options.getString('option2', true);
    const opt3 = interaction.options.getString('option3');
    const durationStr = interaction.options.getString('duration') || '1d';

    const durationMs = parseDuration(durationStr) || 24 * 60 * 60 * 1000;
    const expiresAt = new Date(Date.now() + durationMs);
    const channel = interaction.channel as TextChannel;

    const optionsList = [opt1, opt2];
    if (opt3) optionsList.push(opt3);

    const embed = createEmbed({
      title: `📊 Poll: ${question}`,
      description: `${optionsList.map((o, idx) => `**${idx + 1}.** ${o} — **0 votes**`).join('\n')}\n\n**Ends:** <t:${Math.floor(expiresAt.getTime() / 1000)}:R>`,
      color: '#5865F2',
    });

    const row = new ActionRowBuilder<ButtonBuilder>();
    optionsList.forEach((o, idx) => {
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`poll_vote:${idx}`)
          .setLabel(`Vote ${idx + 1}`)
          .setStyle(ButtonStyle.Primary)
      );
    });

    const msg = await channel.send({ embeds: [embed], components: [row] });

    await PollModel.create({
      guildId: interaction.guild!.id,
      channelId: channel.id,
      messageId: msg.id,
      question,
      options: optionsList.map((text) => ({ text, votes: [] })),
      allowMultiple: false,
      anonymous: false,
      expiresAt,
      closed: false,
    });

    await interaction.reply({ content: 'Poll created!', ephemeral: true });
  },
};
