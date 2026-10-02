import {
  Guild,
  User,
  GuildMember,
  ChannelType,
  PermissionFlagsBits,
  TextChannel,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  EmbedBuilder,
} from 'discord.js';
import { TicketConfigModel, TicketModel, guildCache } from '@null-bot/database';
import { createScopedLogger } from '@null-bot/logger';
import { createEmbed } from '@null-bot/shared';

const logger = createScopedLogger('TicketService');

export class TicketService {
  /**
   * Spawns Ticket Panel in specified channel
   */
  public static async createPanel(guild: Guild, channel: TextChannel): Promise<void> {
    const config = await guildCache.getTicketConfig(guild.id);
    if (!config || !config.enabled) throw new Error('Ticket system is disabled in this server.');

    const embed = createEmbed({
      title: config.panelTitle || '🎫 Support Tickets',
      description: config.panelDescription || 'Select a category below or click to open a private support ticket.',
      color: '#5865F2',
    });

    const components: ActionRowBuilder<ButtonBuilder | StringSelectMenuBuilder>[] = [];

    if (config.categories && config.categories.length > 0) {
      const menu = new StringSelectMenuBuilder()
        .setCustomId('ticket_create_select')
        .setPlaceholder('Select Ticket Category...')
        .addOptions(
          config.categories.map((cat) => ({
            label: cat.name,
            value: cat.id,
            description: cat.description || `Open a ${cat.name} ticket`,
            emoji: cat.emoji || '🎫',
          }))
        );
      components.push(new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu));
    } else {
      const button = new ButtonBuilder()
        .setCustomId('ticket_create_default')
        .setLabel(config.buttonLabel || 'Open Ticket')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('🎫');
      components.push(new ActionRowBuilder<ButtonBuilder>().addComponents(button));
    }

    await channel.send({ embeds: [embed], components });
  }

  /**
   * Opens a new ticket channel for a user
   */
  public static async openTicket(guild: Guild, user: User, categoryId?: string): Promise<TextChannel> {
    const config = await guildCache.getTicketConfig(guild.id);
    if (!config || !config.enabled) throw new Error('Ticket system is disabled.');

    // Check ticket limit
    const existingCount = await TicketModel.countDocuments({
      guildId: guild.id,
      userId: user.id,
      status: 'OPEN',
    });
    if (existingCount >= config.maxTicketsPerUser) {
      throw new Error(`You have reached the maximum open ticket limit (${config.maxTicketsPerUser}).`);
    }

    const ticketCount = await TicketModel.countDocuments({ guildId: guild.id });
    const ticketId = ticketCount + 1;
    const category = config.categories?.find((c) => c.id === categoryId);

    const channelName = `ticket-${ticketId.toString().padStart(4, '0')}`;
    const targetParentId = category?.channelCategoryId || config.ticketCategoryId;

    // Overwrites setup
    const permissionOverwrites: any[] = [
      {
        id: guild.roles.everyone.id,
        deny: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: user.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
          PermissionFlagsBits.AttachFiles,
        ],
      },
      {
        id: guild.members.me!.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ManageChannels,
          PermissionFlagsBits.ManageMessages,
        ],
      },
    ];

    // Staff roles overwrite
    const staffRoles = category?.staffRoleIds || [];
    staffRoles.forEach((roleId) => {
      permissionOverwrites.push({
        id: roleId,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
        ],
      });
    });

    const channel = await guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      parent: targetParentId || undefined,
      permissionOverwrites,
    });

    // Save ticket to DB
    await TicketModel.create({
      guildId: guild.id,
      channelId: channel.id,
      ticketId,
      userId: user.id,
      userTag: user.tag,
      categoryId: categoryId || 'default',
      status: 'OPEN',
      priority: 'MEDIUM',
    });

    // Send ticket welcome message with control buttons
    const welcomeEmbed = createEmbed({
      title: `🎫 Ticket #${ticketId} — ${category ? category.name : 'Support'}`,
      description: `Welcome <@${user.id}>!\nSupport staff will be with you shortly.\nPlease describe your issue in detail.`,
      fields: [
        { name: 'Category', value: category ? category.name : 'General Support', inline: true },
        { name: 'Opened By', value: `<@${user.id}>`, inline: true },
        { name: 'Priority', value: 'MEDIUM', inline: true },
      ],
      color: '#5865F2',
    });

    const controlsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId('ticket_claim').setLabel('Claim Ticket').setStyle(ButtonStyle.Success).setEmoji('✋'),
      new ButtonBuilder().setCustomId('ticket_close').setLabel('Close Ticket').setStyle(ButtonStyle.Danger).setEmoji('🔒'),
      new ButtonBuilder().setCustomId('ticket_transcript').setLabel('Transcript').setStyle(ButtonStyle.Secondary).setEmoji('📜')
    );

    await channel.send({ content: `<@${user.id}>`, embeds: [welcomeEmbed], components: [controlsRow] });

    return channel;
  }

  /**
   * Generates HTML transcript string for a ticket channel
   */
  public static async generateHtmlTranscript(channel: TextChannel): Promise<string> {
    const fetchedMessages = await channel.messages.fetch({ limit: 100 });
    const messages = Array.from(fetchedMessages.values()).reverse();

    let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Transcript - ${channel.name}</title>
  <style>
    body { background-color: #36393f; color: #dcddde; font-family: sans-serif; padding: 20px; }
    .msg { margin-bottom: 15px; border-bottom: 1px solid #4f545c; padding-bottom: 8px; }
    .author { font-weight: bold; color: #5865F2; }
    .time { font-size: 0.8em; color: #72767d; margin-left: 10px; }
    .content { margin-top: 5px; }
  </style>
</head>
<body>
  <h2>Ticket Transcript: #${channel.name}</h2>
  <hr/>`;

    messages.forEach((m) => {
      html += `
  <div class="msg">
    <span class="author">${m.author.tag}</span>
    <span class="time">${m.createdAt.toLocaleString()}</span>
    <div class="content">${m.content ? m.content.replace(/</g, '&lt;').replace(/>/g, '&gt;') : '[No text content]'}</div>
  </div>`;
    });

    html += `\n</body>\n</html>`;
    return html;
  }
}
