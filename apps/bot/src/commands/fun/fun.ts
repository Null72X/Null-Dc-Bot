import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types.js';
import { createEmbed, secureRandomInt } from '@null-bot/shared';

export const funCommand: Command = {
  name: 'fun',
  description: 'Community and fun commands',
  category: 'Fun',
  userPermissions: [],
  botPermissions: [],
  data: new SlashCommandBuilder()
    .setName('fun')
    .setDescription('Fun commands suite')
    .addSubcommand((sub) =>
      sub
        .setName('8ball')
        .setDescription('Ask the magic 8ball a question')
        .addStringOption((opt) => opt.setName('question').setDescription('Your question').setRequired(true))
    )
    .addSubcommand((sub) => sub.setName('coinflip').setDescription('Flip a coin (Heads or Tails)'))
    .addSubcommand((sub) => sub.setName('dice').setDescription('Roll a 6-sided dice'))
    .addSubcommand((sub) =>
      sub
        .setName('ship')
        .setDescription('Calculate compatibility percentage between two users')
        .addUserOption((opt) => opt.setName('user1').setDescription('First user').setRequired(true))
        .addUserOption((opt) => opt.setName('user2').setDescription('Second user').setRequired(true))
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === '8ball') {
      const question = interaction.options.getString('question', true);
      const answers = [
        'It is certain.', 'It is decidedly so.', 'Without a doubt.', 'Yes definitely.',
        'Reply hazy, try again.', 'Ask again later.', 'Better not tell you now.',
        'Don\'t count on it.', 'My reply is no.', 'My sources say no.', 'Very doubtful.'
      ];
      const answer = answers[secureRandomInt(answers.length)];

      await interaction.reply({
        embeds: [createEmbed({ title: '🎱 Magic 8-Ball', fields: [{ name: 'Question', value: question }, { name: 'Answer', value: answer }] })],
      });
      return;
    }

    if (subcommand === 'coinflip') {
      const result = secureRandomInt(2) === 0 ? 'Heads' : 'Tails';
      await interaction.reply({ embeds: [createEmbed({ title: '🪙 Coinflip', description: `Result: **${result}**!` })] });
      return;
    }

    if (subcommand === 'dice') {
      const roll = secureRandomInt(6) + 1;
      await interaction.reply({ embeds: [createEmbed({ title: '🎲 Dice Roll', description: `You rolled a **${roll}**!` })] });
      return;
    }

    if (subcommand === 'ship') {
      const user1 = interaction.options.getUser('user1', true);
      const user2 = interaction.options.getUser('user2', true);

      // Deterministic ship percent based on IDs
      const combined = (BigInt(user1.id) + BigInt(user2.id)).toString();
      const percent = Number(BigInt(combined) % 101n);

      let status = '💔 Disastrous match...';
      if (percent > 40) status = '💛 Friendly connection!';
      if (percent > 75) status = '💖 Soulmates!';

      await interaction.reply({
        embeds: [createEmbed({ title: '💘 Love Meter', description: `**${user1.username}** x **${user2.username}**\n\nCompatibility: **${percent}%**\n${status}` })],
      });
    }
  },
};
