import { Interaction, ChatInputCommandInteraction, ButtonInteraction, StringSelectMenuInteraction, TextChannel } from 'discord.js';
import { Command } from '../types.js';
import { createScopedLogger } from '@null-bot/logger';
import { createErrorEmbed, createSuccessEmbed } from '@null-bot/shared';
import { TicketService } from '../services/TicketService.js';
import { GiveawayModel, PollModel } from '@null-bot/database';

const logger = createScopedLogger('InteractionEvent');

export async function handleInteractionCreate(interaction: Interaction, commands: Map<string, Command>): Promise<void> {
  try {
    // 1. Slash Commands Execution
    if (interaction.isChatInputCommand()) {
      const command = commands.get(interaction.commandName);
      if (!command) return;

      if (command.userPermissions && command.userPermissions.length > 0 && interaction.memberPermissions) {
        const hasPerms = command.userPermissions.every((p) => interaction.memberPermissions!.has(p));
        if (!hasPerms) {
          await interaction.reply({
            embeds: [createErrorEmbed('You do not have the required permissions to execute this command.')],
            ephemeral: true,
          });
          return;
        }
      }

      await command.execute(interaction as ChatInputCommandInteraction);
      return;
    }

    // 2. Button Interactions
    if (interaction.isButton()) {
      const btn = interaction as ButtonInteraction;
      const customId = btn.customId;

      if (customId === 'giveaway_enter') {
        const giveaway = await GiveawayModel.findOne({ messageId: btn.message.id });
        if (!giveaway || giveaway.ended) {
          await btn.reply({ embeds: [createErrorEmbed('This giveaway has ended or does not exist.')], ephemeral: true });
          return;
        }

        if (giveaway.entries.includes(btn.user.id)) {
          giveaway.entries = giveaway.entries.filter((id: string) => id !== btn.user.id);
          await giveaway.save();
          await btn.reply({ embeds: [createSuccessEmbed('Removed your entry from the giveaway.')], ephemeral: true });
        } else {
          giveaway.entries.push(btn.user.id);
          await giveaway.save();
          await btn.reply({ embeds: [createSuccessEmbed('🎉 You have successfully entered the giveaway!')], ephemeral: true });
        }
        return;
      }

      if (customId === 'ticket_create_default') {
        await btn.deferReply({ ephemeral: true });
        try {
          const ticketChan = await TicketService.openTicket(btn.guild!, btn.user);
          await btn.editReply({ content: `Ticket created! Head over to <#${ticketChan.id}>.` });
        } catch (err: any) {
          await btn.editReply({ embeds: [createErrorEmbed(err.message)] });
        }
        return;
      }

      if (customId === 'ticket_claim') {
        await btn.reply({ embeds: [createSuccessEmbed(`Ticket claimed by <@${btn.user.id}>.`)] });
        return;
      }

      if (customId === 'ticket_close') {
        await btn.reply({ embeds: [createSuccessEmbed('Closing ticket in 5 seconds...')] });
        setTimeout(async () => {
          await (btn.channel as TextChannel).delete().catch(() => {});
        }, 5000);
        return;
      }

      if (customId.startsWith('rr_toggle:')) {
        const parts = customId.split(':');
        const roleId = parts[2];
        const member = await btn.guild?.members.fetch(btn.user.id).catch(() => null);

        if (member && roleId) {
          if (member.roles.cache.has(roleId)) {
            await member.roles.remove(roleId).catch(() => {});
            await btn.reply({ embeds: [createSuccessEmbed(`Removed role <@&${roleId}>.`)], ephemeral: true });
          } else {
            await member.roles.add(roleId).catch(() => {});
            await btn.reply({ embeds: [createSuccessEmbed(`Added role <@&${roleId}>!`)], ephemeral: true });
          }
        }
        return;
      }

      if (customId.startsWith('poll_vote:')) {
        const optIndex = parseInt(customId.split(':')[1], 10);
        const poll = await PollModel.findOne({ messageId: btn.message.id });
        if (!poll || poll.closed) {
          await btn.reply({ embeds: [createErrorEmbed('Poll is closed or expired.')], ephemeral: true });
          return;
        }

        const option = poll.options[optIndex];
        if (option) {
          if (option.votes.includes(btn.user.id)) {
            option.votes = option.votes.filter((id: string) => id !== btn.user.id);
            await poll.save();
            await btn.reply({ embeds: [createSuccessEmbed('Removed your vote.')], ephemeral: true });
          } else {
            option.votes.push(btn.user.id);
            await poll.save();
            await btn.reply({ embeds: [createSuccessEmbed(`Voted for Option ${optIndex + 1}!`)], ephemeral: true });
          }
        }
        return;
      }
    }

    if (interaction.isStringSelectMenu()) {
      const menu = interaction as StringSelectMenuInteraction;
      if (menu.customId === 'ticket_create_select') {
        await menu.deferReply({ ephemeral: true });
        const categoryId = menu.values[0];
        try {
          const ticketChan = await TicketService.openTicket(menu.guild!, menu.user, categoryId);
          await menu.editReply({ content: `Ticket created! Head over to <#${ticketChan.id}>.` });
        } catch (err: any) {
          await menu.editReply({ embeds: [createErrorEmbed(err.message)] });
        }
      }
    }
  } catch (err) {
    logger.error('Error handling interaction:', { error: err });
  }
}
