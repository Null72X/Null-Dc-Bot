import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, ChannelType } from 'discord.js';
import { Command } from '../../types.js';
import { WelcomeConfigModel, guildCache } from '@null-bot/database';
import { createEmbed, createSuccessEmbed, formatPlaceholders } from '@null-bot/shared';

export const welcomeCommand: Command = {
  name: 'welcome',
  description: 'Configure Welcome and Goodbye greetings',
  category: 'Welcome',
  userPermissions: [PermissionFlagsBits.Administrator],
  botPermissions: [],
  data: new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('Configure Welcome & Goodbye greetings')
    .addSubcommand((sub) => sub.setName('test').setDescription('Test welcome message preview'))
    .addSubcommand((sub) =>
      sub
        .setName('setchannel')
        .setDescription('Set welcome channel')
        .addChannelOption((opt) => opt.setName('channel').setDescription('Welcome channel').addChannelTypes(ChannelType.GuildText).setRequired(true))
    )
    .addSubcommand((sub) =>
      sub
        .setName('setmessage')
        .setDescription('Set welcome message text')
        .addStringOption((opt) => opt.setName('message').setDescription('Message template ({mention}, {user}, {server}, {memberCount})').setRequired(true))
    )
    .addSubcommand((sub) =>
      sub
        .setName('toggle')
        .setDescription('Enable or disable welcome system')
        .addBooleanOption((opt) => opt.setName('enabled').setDescription('Enable welcome greetings').setRequired(true))
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    const guild = interaction.guild!;

    if (subcommand === 'test') {
      const config = await guildCache.getWelcomeConfig(guild.id);
      const text = formatPlaceholders(config.welcomeMessage, {
        user: interaction.user,
        guild: { name: guild.name, memberCount: guild.memberCount },
      });

      const embed = createEmbed({
        title: '👋 Welcome Message Preview',
        description: text,
        color: '#57F287',
      });

      await interaction.reply({ embeds: [embed] });
      return;
    }

    if (subcommand === 'setchannel') {
      const channel = interaction.options.getChannel('channel', true);
      await WelcomeConfigModel.updateOne(
        { guildId: guild.id },
        { $set: { welcomeChannelId: channel.id, welcomeEnabled: true } },
        { upsert: true }
      );
      guildCache.invalidate(guild.id, 'welcome');
      await interaction.reply({ embeds: [createSuccessEmbed(`Set welcome channel to <#${channel.id}>.`)] });
      return;
    }

    if (subcommand === 'setmessage') {
      const message = interaction.options.getString('message', true);
      await WelcomeConfigModel.updateOne(
        { guildId: guild.id },
        { $set: { welcomeMessage: message, welcomeEnabled: true } },
        { upsert: true }
      );
      guildCache.invalidate(guild.id, 'welcome');
      await interaction.reply({ embeds: [createSuccessEmbed('Updated welcome message template.')] });
      return;
    }

    if (subcommand === 'toggle') {
      const enabled = interaction.options.getBoolean('enabled', true);
      await WelcomeConfigModel.updateOne(
        { guildId: guild.id },
        { $set: { welcomeEnabled: enabled } },
        { upsert: true }
      );
      guildCache.invalidate(guild.id, 'welcome');
      await interaction.reply({ embeds: [createSuccessEmbed(`Welcome system **${enabled ? 'Enabled' : 'Disabled'}**.`)] });
    }
  },
};
