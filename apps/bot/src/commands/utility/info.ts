import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types.js';
import { createEmbed, createErrorEmbed } from '@null-bot/shared';
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

export const roleinfoCommand: Command = {
  name: 'roleinfo',
  description: 'View detailed role information',
  category: 'Utility',
  data: new SlashCommandBuilder()
    .setName('roleinfo')
    .setDescription('View role information')
    .addRoleOption((opt) => opt.setName('role').setDescription('Role to inspect').setRequired(true)),

  async execute(interaction: ChatInputCommandInteraction) {
    const role = interaction.options.getRole('role', true);
    const embed = createEmbed({
      title: `🎭 Role Information — ${role.name}`,
      color: role.color || '#5865F2',
      fields: [
        { name: 'Role ID', value: role.id, inline: true },
        { name: 'Position', value: `${role.position}`, inline: true },
        { name: 'Hoisted', value: role.hoist ? 'Yes' : 'No', inline: true },
        { name: 'Mentionable', value: role.mentionable ? 'Yes' : 'No', inline: true },
        { name: 'Color Hex', value: (role as any).hexColor || '#5865F2', inline: true },
        { name: 'Created At', value: (role as any).createdTimestamp ? `<t:${Math.floor((role as any).createdTimestamp / 1000)}:D>` : 'N/A', inline: true },
      ],
    });
    await interaction.reply({ embeds: [embed] });
  },
};

export const channelinfoCommand: Command = {
  name: 'channelinfo',
  description: 'View detailed channel information',
  category: 'Utility',
  data: new SlashCommandBuilder()
    .setName('channelinfo')
    .setDescription('View channel information')
    .addChannelOption((opt) => opt.setName('channel').setDescription('Channel to inspect').setRequired(false)),

  async execute(interaction: ChatInputCommandInteraction) {
    const channel: any = interaction.options.getChannel('channel') || interaction.channel;
    const embed = createEmbed({
      title: `📁 Channel Information — #${channel?.name || 'Channel'}`,
      fields: [
        { name: 'Channel ID', value: channel?.id || 'N/A', inline: true },
        { name: 'Type', value: `${channel?.type}`, inline: true },
        { name: 'Created At', value: channel?.createdTimestamp ? `<t:${Math.floor(channel.createdTimestamp / 1000)}:D>` : 'N/A', inline: true },
      ],
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

export const calculatorCommand: Command = {
  name: 'calculator',
  description: 'Calculate mathematical expressions safely',
  category: 'Utility',
  data: new SlashCommandBuilder()
    .setName('calculator')
    .setDescription('Calculate math expression')
    .addStringOption((opt) => opt.setName('expression').setDescription('Math expression (e.g. 5 * 12 + 100)').setRequired(true)),

  async execute(interaction: ChatInputCommandInteraction) {
    const expr = interaction.options.getString('expression', true);
    try {
      // Safe math evaluation regex
      if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
        await interaction.reply({ embeds: [createErrorEmbed('Invalid characters in math expression.')], ephemeral: true });
        return;
      }
      const result = Function(`"use strict"; return (${expr})`)();
      await interaction.reply({
        embeds: [
          createEmbed({
            title: '🧮 Calculator',
            fields: [
              { name: 'Expression', value: `\`${expr}\`` },
              { name: 'Result', value: `\`${result}\`` },
            ],
          }),
        ],
      });
    } catch (e) {
      await interaction.reply({ embeds: [createErrorEmbed('Failed to compute expression.')], ephemeral: true });
    }
  },
};

export const timestampCommand: Command = {
  name: 'timestamp',
  description: 'Generate Discord formatted dynamic timestamp',
  category: 'Utility',
  data: new SlashCommandBuilder()
    .setName('timestamp')
    .setDescription('Generate Discord timestamp')
    .addIntegerOption((opt) => opt.setName('minutes_from_now').setDescription('Minutes from current time').setRequired(true)),

  async execute(interaction: ChatInputCommandInteraction) {
    const mins = interaction.options.getInteger('minutes_from_now', true);
    const time = Math.floor((Date.now() + mins * 60 * 1000) / 1000);

    const embed = createEmbed({
      title: '⏰ Discord Timestamp Generator',
      fields: [
        { name: 'Relative Format (<t:TIME:R>)', value: `\`<t:${time}:R>\` → <t:${time}:R>` },
        { name: 'Full Format (<t:TIME:F>)', value: `\`<t:${time}:F>\` → <t:${time}:F>` },
      ],
    });
    await interaction.reply({ embeds: [embed] });
  },
};

export const membercountCommand: Command = {
  name: 'membercount',
  description: 'View server member count statistics',
  category: 'Utility',
  data: new SlashCommandBuilder().setName('membercount').setDescription('View server member count'),

  async execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild!;
    const embed = createEmbed({
      title: `👥 Member Count — ${guild.name}`,
      description: `**Total Members:** \`${guild.memberCount}\``,
      color: '#5865F2',
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
