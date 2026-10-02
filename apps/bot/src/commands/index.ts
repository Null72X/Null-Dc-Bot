import { Command } from '../types.js';
import { banCommand } from './moderation/ban.js';
import { kickCommand } from './moderation/kick.js';
import { timeoutCommand, untimeoutCommand } from './moderation/timeout.js';
import { warnCommand, warningsCommand } from './moderation/warn.js';
import { purgeCommand } from './moderation/purge.js';
import { lockCommand, unlockCommand, slowmodeCommand } from './moderation/lock.js';
import { unbanCommand } from './moderation/unban.js';
import { caseCommand, historyCommand } from './moderation/case.js';
import { nickCommand, sayCommand, embedCommand, softbanCommand } from './moderation/utility_mod.js';
import { autoModCommand } from './automod/automod.js';
import { securityCommand } from './security/security.js';
import { loggingCommand } from './logging/logging.js';
import { ticketCommand } from './tickets/ticket.js';
import { musicCommand } from './music/music.js';
import { rankCommand } from './leveling/rank.js';
import { leaderboardCommand } from './leveling/leaderboard.js';
import { giveawayCommand } from './giveaways/giveaway.js';
import { reactionRoleCommand } from './reactionroles/reactionrole.js';
import { welcomeCommand } from './welcome/welcome.js';
import { autoResponderCommand } from './autoresponder/autoresponder.js';
import { serverinfoCommand, userinfoCommand, avatarCommand, pingCommand, botinfoCommand, privacyCommand } from './utility/info.js';
import { serverMgmtCommand } from './servermgmt/servermgmt.js';
import { tempVoiceCommand } from './tempvoice/tempvoice.js';
import { pollCommand } from './polls/poll.js';
import { remindCommand } from './reminders/remind.js';
import { funCommand } from './fun/fun.js';
import { helpCommand } from './help.js';

export const allCommands: Command[] = [
  banCommand,
  kickCommand,
  timeoutCommand,
  untimeoutCommand,
  warnCommand,
  warningsCommand,
  purgeCommand,
  lockCommand,
  unlockCommand,
  slowmodeCommand,
  unbanCommand,
  caseCommand,
  historyCommand,
  nickCommand,
  sayCommand,
  embedCommand,
  softbanCommand,
  autoModCommand,
  securityCommand,
  loggingCommand,
  ticketCommand,
  musicCommand,
  rankCommand,
  leaderboardCommand,
  giveawayCommand,
  reactionRoleCommand,
  welcomeCommand,
  autoResponderCommand,
  serverinfoCommand,
  userinfoCommand,
  avatarCommand,
  pingCommand,
  botinfoCommand,
  privacyCommand,
  serverMgmtCommand,
  tempVoiceCommand,
  pollCommand,
  remindCommand,
  funCommand,
  helpCommand,
];
