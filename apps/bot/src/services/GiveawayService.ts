import { Client, TextChannel, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { GiveawayModel } from '@null-bot/database';
import { createScopedLogger } from '@null-bot/logger';
import { createEmbed, secureRandomInt } from '@null-bot/shared';

const logger = createScopedLogger('GiveawayService');

export class GiveawayService {
  /**
   * Initializes background timer loop to check ended giveaways and draw winners securely
   */
  public static initGiveawayManager(client: Client): void {
    setInterval(async () => {
      try {
        const now = new Date();
        const activeGiveaways = await GiveawayModel.find({ ended: false, endsAt: { $lte: now } });

        for (const giveaway of activeGiveaways) {
          await this.endGiveaway(client, giveaway.messageId);
        }
      } catch (err) {
        logger.error('Error in giveaway manager loop:', { error: err });
      }
    }, 10000); // Check every 10 seconds
  }

  /**
   * Ends a giveaway and picks winners using cryptographically secure randomness
   */
  public static async endGiveaway(client: Client, messageId: string): Promise<string[]> {
    const giveaway = await GiveawayModel.findOne({ messageId });
    if (!giveaway || giveaway.ended) return [];

    giveaway.ended = true;

    const winners: string[] = [];
    const entries = [...new Set(giveaway.entries)]; // Deduplicate

    if (entries.length > 0) {
      const winnerCount = Math.min(giveaway.winnerCount, entries.length);
      const tempEntries = [...entries];

      for (let i = 0; i < winnerCount; i++) {
        const randomIndex = secureRandomInt(tempEntries.length);
        const winnerId = tempEntries.splice(randomIndex, 1)[0];
        winners.push(winnerId);
      }
    }

    giveaway.winners = winners;
    await giveaway.save();

    // Update Discord message
    try {
      const guild = await client.guilds.fetch(giveaway.guildId).catch(() => null);
      if (guild) {
        const channel = (await guild.channels.fetch(giveaway.channelId).catch(() => null)) as TextChannel | null;
        if (channel) {
          const message = await channel.messages.fetch(giveaway.messageId).catch(() => null);
          if (message) {
            const winnerText = winners.length > 0 ? winners.map((w: string) => `<@${w}>`).join(', ') : 'No valid entries.';
            
            const endedEmbed = createEmbed({
              title: `🎉 Giveaway Ended: ${giveaway.prize}`,
              description: `**Winners:** ${winnerText}\n**Hosted By:** <@${giveaway.hostedBy}>\n**Total Entries:** ${entries.length}`,
              color: '#43B581',
            });

            const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
              new ButtonBuilder()
                .setCustomId('giveaway_enter')
                .setLabel(`Ended (${entries.length})`)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true)
            );

            await message.edit({ embeds: [endedEmbed], components: [disabledRow] }).catch(() => {});

            if (winners.length > 0) {
              await channel.send({
                content: `🎉 Congratulations ${winnerText}! You won **${giveaway.prize}**!`,
              }).catch(() => {});
            }
          }
        }
      }
    } catch (err) {
      logger.error('Error updating giveaway end message:', { error: err });
    }

    return winners;
  }
}
