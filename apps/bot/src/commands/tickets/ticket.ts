import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, TextChannel } from 'discord.js';
import { Command } from '../../types.js';
import { TicketService } from '../../services/TicketService.js';
import { createErrorEmbed, createSuccessEmbed } from '@null-bot/shared';

export const ticketCommand: Command = {
  name: 'ticket',
  description: 'Manage support ticket system and panels',
  category: 'Tickets',
  userPermissions: [PermissionFlagsBits.ManageChannels],
  botPermissions: [PermissionFlagsBits.ManageChannels],
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Ticket management commands')
    .addSubcommand((sub) =>
      sub.setName('panel').setDescription('Spawn ticket creation panel in current channel')
    )
    .addSubcommand((sub) =>
      sub.setName('close').setDescription('Close current ticket channel')
    )
    .addSubcommand((sub) =>
      sub
        .setName('add')
        .setDescription('Add a member to ticket')
        .addUserOption((opt) => opt.setName('user').setDescription('User to add').setRequired(true))
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    const guild = interaction.guild!;

    if (subcommand === 'panel') {
      try {
        await TicketService.createPanel(guild, interaction.channel as TextChannel);
        await interaction.reply({ content: 'Ticket panel spawned successfully!', ephemeral: true });
      } catch (err: any) {
        await interaction.reply({ embeds: [createErrorEmbed(err.message)], ephemeral: true });
      }
      return;
    }

    if (subcommand === 'close') {
      const channel = interaction.channel as TextChannel;
      if (!channel.name.startsWith('ticket-')) {
        await interaction.reply({ embeds: [createErrorEmbed('This command can only be used inside ticket channels.')], ephemeral: true });
        return;
      }

      await interaction.reply({ embeds: [createSuccessEmbed('Ticket closing in 5 seconds...')] });
      setTimeout(async () => {
        await channel.delete().catch(() => {});
      }, 5000);
      return;
    }

    if (subcommand === 'add') {
      const targetUser = interaction.options.getUser('user', true);
      const channel = interaction.channel as TextChannel;
      if (!channel.name.startsWith('ticket-')) {
        await interaction.reply({ embeds: [createErrorEmbed('This command can only be used inside ticket channels.')], ephemeral: true });
        return;
      }

      await channel.permissionOverwrites.edit(targetUser.id, {
        ViewChannel: true,
        SendMessages: true,
        ReadMessageHistory: true,
      });

      await interaction.reply({ embeds: [createSuccessEmbed(`Added <@${targetUser.id}> to the ticket.`)] });
    }
  },
};
