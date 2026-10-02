import { REST, Routes } from 'discord.js';
import { env } from '@null-bot/config';
import { allCommands } from './commands/index.js';
import { createScopedLogger } from '@null-bot/logger';

const logger = createScopedLogger('DeployCommands');

export async function deployCommands(): Promise<void> {
  if (!env.DISCORD_TOKEN || !env.DISCORD_CLIENT_ID || env.DISCORD_TOKEN === 'placeholder_token') {
    logger.warn('⚠️ DISCORD_TOKEN or DISCORD_CLIENT_ID not configured. Skipping REST command registration.');
    return;
  }

  const commandsData = allCommands.map((cmd) => cmd.data.toJSON());

  const rest = new REST({ version: '10' }).setToken(env.DISCORD_TOKEN);

  try {
    logger.info(`Started refreshing ${commandsData.length} application (/) commands.`);

    const data: any = await rest.put(
      Routes.applicationCommands(env.DISCORD_CLIENT_ID),
      { body: commandsData }
    );

    logger.info(`Successfully reloaded ${data.length} application (/) commands globally.`);
  } catch (error) {
    logger.error('Error registering application commands via REST API:', { error });
  }
}

if (process.argv[1]?.endsWith('deploy-commands.js') || process.argv[1]?.endsWith('deploy-commands.ts')) {
  deployCommands();
}
