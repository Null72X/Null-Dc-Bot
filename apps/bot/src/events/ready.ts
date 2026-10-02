import { Client, ActivityType } from 'discord.js';
import { createScopedLogger } from '@null-bot/logger';
import { botIdentity } from '@null-bot/config';
import { GiveawayService } from '../services/GiveawayService.js';
import { ReminderService } from '../services/ReminderService.js';

const logger = createScopedLogger('ReadyEvent');

export function handleReady(client: Client): void {
  logger.info(`🤖 Bot is online as ${client.user?.tag}! Initializing services...`);

  client.user?.setPresence({
    activities: [{ name: botIdentity.activityName, type: ActivityType.Playing }],
    status: botIdentity.status,
  });

  // Start background periodic services
  GiveawayService.initGiveawayManager(client);
  ReminderService.initReminderLoop(client);
}
