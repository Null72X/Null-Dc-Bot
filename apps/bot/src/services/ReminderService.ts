import { Client, TextChannel } from 'discord.js';
import { ReminderModel } from '@null-bot/database';
import { createScopedLogger } from '@null-bot/logger';
import { createEmbed } from '@null-bot/shared';

const logger = createScopedLogger('ReminderService');

export class ReminderService {
  public static initReminderLoop(client: Client): void {
    setInterval(async () => {
      try {
        const now = new Date();
        const dueReminders = await ReminderModel.find({ remindAt: { $lte: now } });

        for (const reminder of dueReminders) {
          try {
            const user = await client.users.fetch(reminder.userId).catch(() => null);
            if (user) {
              const embed = createEmbed({
                title: '⏰ Reminder Alert',
                description: `**Reminder:** ${reminder.message}`,
                color: '#FEE75C',
              });

              // Try channel send first if guild context exists, fallback to DM
              let sent = false;
              if (reminder.guildId && reminder.channelId) {
                const guild = await client.guilds.fetch(reminder.guildId).catch(() => null);
                if (guild) {
                  const chan = (await guild.channels.fetch(reminder.channelId).catch(() => null)) as TextChannel | null;
                  if (chan) {
                    await chan.send({ content: `<@${reminder.userId}>`, embeds: [embed] }).catch(() => {});
                    sent = true;
                  }
                }
              }

              if (!sent) {
                await user.send({ embeds: [embed] }).catch(() => {});
              }
            }
          } catch (e) {
            logger.error('Error delivering reminder:', { error: e });
          } finally {
            await ReminderModel.deleteOne({ reminderId: reminder.reminderId });
          }
        }
      } catch (err) {
        logger.error('Error in reminder loop:', { error: err });
      }
    }, 5000); // Check every 5s
  }
}
