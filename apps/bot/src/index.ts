import { connectDatabase } from '@null-bot/database';
import { env } from '@null-bot/config';
import { createScopedLogger } from '@null-bot/logger';
import { NullClient } from './client.js';
import { deployCommands } from './deploy-commands.js';

const logger = createScopedLogger('BotMain');

async function main() {
  logger.info('🚀 Starting NULL Bot system...');

  // 1. Connect MongoDB
  try {
    await connectDatabase();
  } catch (err) {
    logger.fatal('Failed to connect to database on startup:', { error: err });
  }

  // 2. Instantiate Discord Client
  const client = new NullClient();

  // 3. Register Slash Commands
  await deployCommands();

  // 4. Log in to Discord Gateway
  if (!env.DISCORD_TOKEN || env.DISCORD_TOKEN === 'placeholder_token') {
    logger.warn('⚠️ DISCORD_TOKEN is set to placeholder value. Set your token in .env to connect to Discord.');
  } else {
    try {
      await client.login(env.DISCORD_TOKEN);
    } catch (err) {
      logger.error('Discord Gateway login failed:', { error: err });
    }
  }

  // Global Process Error Handlers
  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Promise Rejection:', { reason });
  });

  process.on('uncaughtException', (error) => {
    logger.fatal('Uncaught Exception:', { error });
  });
}

main();
