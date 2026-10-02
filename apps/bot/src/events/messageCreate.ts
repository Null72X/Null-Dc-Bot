import { Message } from 'discord.js';
import { AutoModService } from '../services/AutoModService.js';
import { LevelingService } from '../services/LevelingService.js';
import { AutoResponderModel } from '@null-bot/database';

export async function handleMessageCreate(message: Message): Promise<void> {
  if (!message.guild || message.author.bot) return;

  // 1. Process AutoMod
  const flagged = await AutoModService.processMessage(message);
  if (flagged) return; // Stop processing if message was deleted/punished

  // 2. Process AutoResponder
  const content = message.content;
  const responders = await AutoResponderModel.find({ guildId: message.guild.id, enabled: true });

  for (const resp of responders) {
    let match = false;
    if (resp.matchType === 'EXACT') {
      match = resp.caseSensitive ? content === resp.trigger : content.toLowerCase() === resp.trigger.toLowerCase();
    } else if (resp.matchType === 'CONTAINS') {
      match = resp.caseSensitive ? content.includes(resp.trigger) : content.toLowerCase().includes(resp.trigger.toLowerCase());
    } else if (resp.matchType === 'REGEX') {
      try {
        const reg = new RegExp(resp.trigger, resp.caseSensitive ? '' : 'i');
        match = reg.test(content);
      } catch (e) {}
    }

    if (match && message.channel && 'send' in message.channel) {
      await (message.channel as any).send({ content: resp.response }).catch(() => {});
      break;
    }
  }

  // 3. Process Leveling XP
  await LevelingService.handleMessageXp(message);
}
