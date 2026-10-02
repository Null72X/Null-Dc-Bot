import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types.js';
import { createEmbed } from '@null-bot/shared';
import { botIdentity } from '@null-bot/config';
import os from 'os';

export const serverinfoCommand: Command = {
  name: 'serverinfo',
  description: 'View detailed server information',
  category: 'Utility',
  data: new SlashCommandBuilder().setName('serverinfo').setDescription('View detailed server information'),

  async execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild!;
    const owner = await guild.fetchOwner().catch(() => null);

    const embed = createEmbed({
      title: `📊 Server Information — ${guild.name}`,
      thumbnailUrl: guild.iconURL() || undefined,
      fields: [
        { name: 'Server ID', value: guild.id, inline: true },
        { name: 'Owner', value: owner ? `${owner.user.tag}` : 'Unknown', inline: true },
        { name: 'Created At', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true },
        { name: 'Total Members', value: `${guild.memberCount}`, inline: true },
        { name: 'Channels', value: `${guild.channels.cache.size}`, inline: true },
        { name: 'Roles', value: `${guild.roles.cache.size}`, inline: true },
        { name: 'Boost Level', value: `Level ${guild.premiumTier}`, inline: true },
        { name: 'Boost Count', value: `${guild.premiumSubscriptionCount || 0}`, inline: true },
      ],
    });

    await interaction.reply({ embeds: [embed] });
  },
};

export const userinfoCommand: Command = {
  name: 'userinfo',
  description: 'View user profile information',
  category: 'Utility',
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('View user information')
    .addUserOption((opt) => opt.setName('user').setDescription('User to inspect').setRequired(false)),

  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const member = await interaction.guild?.members.fetch(user.id).catch(() => null);

    const embed = createEmbed({
      title: `👤 User Profile — ${user.tag}`,
      thumbnailUrl: user.displayAvatarURL(),
      fields: [
        { name: 'User ID', value: user.id, inline: true },
        { name: 'Account Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'Joined Server', value: member?.joinedTimestamp ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'N/A', inline: true },
        { name: 'Roles', value: member ? member.roles.cache.map((r) => `<@&${r.id}>`).slice(0, 5).join(', ') : 'None', inline: false },
      ],
    });

    await interaction.reply({ embeds: [embed] });
  },
};

export const avatarCommand: Command = {
  name: 'avatar',
  description: 'View user avatar in full resolution',
  category: 'Utility',
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('View avatar')
    .addUserOption((opt) => opt.setName('user').setDescription('User').setRequired(false)),

  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const avatarUrl = user.displayAvatarURL({ size: 1024 });

    const embed = createEmbed({
      title: `🖼️ Avatar of ${user.tag}`,
      imageUrl: avatarUrl,
    });

    await interaction.reply({ embeds: [embed] });
  },
};

export const pingCommand: Command = {
  name: 'ping',
  description: 'View bot latency and Gateway WebSocket ping',
  category: 'Utility',
  data: new SlashCommandBuilder().setName('ping').setDescription('View bot latency'),

  async execute(interaction: ChatInputCommandInteraction) {
    const wsPing = interaction.client.ws.ping;
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
    const roundtrip = sent.createdTimestamp - interaction.createdTimestamp;

    const embed = createEmbed({
      title: '🏓 Pong!',
      fields: [
        { name: 'WebSocket Latency', value: `${wsPing}ms`, inline: true },
        { name: 'API Roundtrip', value: `${roundtrip}ms`, inline: true },
      ],
    });

    await interaction.editReply({ content: null, embeds: [embed] });
  },
};

export const botinfoCommand: Command = {
  name: 'botinfo',
  description: 'View system, node, and memory stats of NULL bot',
  category: 'Utility',
  data: new SlashCommandBuilder().setName('botinfo').setDescription('View NULL bot system stats'),

  async execute(interaction: ChatInputCommandInteraction) {
    const memory = process.memoryUsage();
    const uptimeSec = Math.floor(process.uptime());

    const embed = createEmbed({
      title: `🤖 ${botIdentity.name} System Information`,
      fields: [
        { name: 'Node.js Version', value: process.version, inline: true },
        { name: 'Discord.js Version', value: 'v14.15.3', inline: true },
        { name: 'Memory Usage', value: `${(memory.heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true },
        { name: 'System Platform', value: `${os.platform()} (${os.arch()})`, inline: true },
        { name: 'Guild Count', value: `${interaction.client.guilds.cache.size}`, inline: true },
        { name: 'Uptime', value: `${Math.floor(uptimeSec / 3600)}h ${Math.floor((uptimeSec % 3600) / 60)}m`, inline: true },
      ],
    });

    await interaction.reply({ embeds: [embed] });
  },
};

export const privacyCommand: Command = {
  name: 'privacy',
  description: 'View data privacy information and policies',
  category: 'Utility',
  data: new SlashCommandBuilder().setName('privacy').setDescription('View data privacy policy'),

  async execute(interaction: ChatInputCommandInteraction) {
    const embed = createEmbed({
      title: '🔒 Data Privacy Policy',
      description: `**${botIdentity.name} Data Handling:**\n• We collect minimal operational data necessary for moderation logs, ticket management, leveling XP, and guild configuration.\n• Guild data is strictly isolated by Guild ID.\n• Server administrators can request server data purging by removing the bot or configuring dashboard settings.\n• We NEVER store or share token credentials, secrets, or sensitive DM content.`,
    });

    await interaction.reply({ embeds: [embed] });
  },
};
