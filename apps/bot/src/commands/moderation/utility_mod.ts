import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, TextChannel } from 'discord.js';
import { Command } from '../../types.js';
import { ModerationCaseModel } from '@null-bot/database';
import { canModerate, createEmbed, createErrorEmbed, createSuccessEmbed } from '@null-bot/shared';

export const nickCommand: Command = {
  name: 'nick',
  description: 'Change nickname of a member',
  category: 'Moderation',
  userPermissions: [PermissionFlagsBits.ManageNicknames],
  botPermissions: [PermissionFlagsBits.ManageNicknames],
  data: new SlashCommandBuilder()
    .setName('nick')
    .setDescription('Change member nickname')
    .addUserOption((opt) => opt.setName('target').setDescription('Target member').setRequired(true))
    .addStringOption((opt) => opt.setName('nickname').setDescription('New nickname (leave empty to reset)').setRequired(false)),

  async execute(interaction: ChatInputCommandInteraction) {
    const targetUser = interaction.options.getUser('target', true);
    const newNick = interaction.options.getString('nickname');
    const guild = interaction.guild!;

    const member = await guild.members.fetch(targetUser.id).catch(() => null);
    if (!member) {
      await interaction.reply({ embeds: [createErrorEmbed('Target member not found.')], ephemeral: true });
      return;
    }

    const check = canModerate(interaction.member as any, member);
    if (!check.canAction) {
      await interaction.reply({ embeds: [createErrorEmbed(check.reason!)], ephemeral: true });
      return;
    }

    await member.setNickname(newNick || null);
    await interaction.reply({
      embeds: [createSuccessEmbed(newNick ? `Changed nickname of **${targetUser.tag}** to **${newNick}**.` : `Reset nickname of **${targetUser.tag}**.`)],
    });
  },
};

export const sayCommand: Command = {
  name: 'say',
  description: 'Make the bot say a message in channel',
  category: 'Moderation',
  userPermissions: [PermissionFlagsBits.ManageMessages],
  botPermissions: [],
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Make bot say a message')
    .addStringOption((opt) => opt.setName('message').setDescription('Message text').setRequired(true)),

  async execute(interaction: ChatInputCommandInteraction) {
    const message = interaction.options.getString('message', true);
    if (interaction.channel && 'send' in interaction.channel) {
      await (interaction.channel as any).send({ content: message });
    }
    await interaction.reply({ content: 'Message sent!', ephemeral: true });
  },
};

export const embedCommand: Command = {
  name: 'embed',
  description: 'Send a custom formatted embed',
  category: 'Moderation',
  userPermissions: [PermissionFlagsBits.ManageMessages],
  botPermissions: [],
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Send a custom embed')
    .addStringOption((opt) => opt.setName('title').setDescription('Embed title').setRequired(true))
    .addStringOption((opt) => opt.setName('description').setDescription('Embed description').setRequired(true))
    .addStringOption((opt) => opt.setName('color').setDescription('Hex color code (e.g. #FF0000)').setRequired(false)),

  async execute(interaction: ChatInputCommandInteraction) {
    const title = interaction.options.getString('title', true);
    const description = interaction.options.getString('description', true);
    const color = (interaction.options.getString('color') || '#5865F2') as any;

    const embed = createEmbed({ title, description, color });
    if (interaction.channel && 'send' in interaction.channel) {
      await (interaction.channel as any).send({ embeds: [embed] });
    }
    await interaction.reply({ content: 'Embed sent!', ephemeral: true });
  },
};

export const softbanCommand: Command = {
  name: 'softban',
  description: 'Ban and immediately unban a user to clear recent messages',
  category: 'Moderation',
  userPermissions: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],
  data: new SlashCommandBuilder()
    .setName('softban')
    .setDescription('Softban a member (ban and instant unban)')
    .addUserOption((opt) => opt.setName('target').setDescription('Member to softban').setRequired(true))
    .addStringOption((opt) => opt.setName('reason').setDescription('Reason').setRequired(false)),

  async execute(interaction: ChatInputCommandInteraction) {
    const targetUser = interaction.options.getUser('target', true);
    const reason = interaction.options.getString('reason') || 'Softban';
    const guild = interaction.guild!;

    await guild.members.ban(targetUser.id, { reason, deleteMessageSeconds: 7 * 24 * 60 * 60 });
    await guild.members.unban(targetUser.id, 'Softban complete');

    await interaction.reply({
      embeds: [createSuccessEmbed(`Softbanned **${targetUser.tag}** (Messages deleted, user unbanned).`)],
    });
  },
};
