import { NextRequest, NextResponse } from 'next/server';
import { authorizeGuildAccess } from '@/lib/auth';
import {
  guildCache,
  GuildSettingsModel,
  AutoModRuleModel,
  SecurityConfigModel,
  TicketConfigModel,
  LevelConfigModel,
  WelcomeConfigModel,
  LoggingConfigModel,
  TempVoiceConfigModel,
  ModerationCaseModel,
  TicketModel,
  SecurityIncidentModel,
} from '@null-bot/database';

export async function GET(
  req: NextRequest,
  { params }: { params: { guildId: string; setting: string } }
) {
  const { guildId, setting } = params;
  const auth = await authorizeGuildAccess(guildId);
  if (!auth.authorized) {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions for this server.' }, { status: 403 });
  }

  try {
    switch (setting) {
      case 'overview': {
        const modCount = await ModerationCaseModel.countDocuments({ guildId });
        const openTickets = await TicketModel.countDocuments({ guildId, status: 'OPEN' });
        const incidentCount = await SecurityIncidentModel.countDocuments({ guildId });
        return NextResponse.json({
          stats: { modCount, openTickets, incidentCount },
        });
      }

      case 'settings':
        return NextResponse.json({ settings: await guildCache.getGuildSettings(guildId) });

      case 'automod':
        return NextResponse.json({ automod: await guildCache.getAutoModRule(guildId) });

      case 'security': {
        const config = await guildCache.getSecurityConfig(guildId);
        const incidents = await SecurityIncidentModel.find({ guildId }).sort({ createdAt: -1 }).limit(10);
        return NextResponse.json({ security: config, incidents });
      }

      case 'tickets': {
        const config = await guildCache.getTicketConfig(guildId);
        const tickets = await TicketModel.find({ guildId }).sort({ createdAt: -1 }).limit(10);
        return NextResponse.json({ config, tickets });
      }

      case 'leveling':
        return NextResponse.json({ leveling: await guildCache.getLevelConfig(guildId) });

      case 'welcome':
        return NextResponse.json({ welcome: await guildCache.getWelcomeConfig(guildId) });

      case 'logging':
        return NextResponse.json({ logging: await guildCache.getLoggingConfig(guildId) });

      case 'tempvoice':
        return NextResponse.json({ tempvoice: await guildCache.getTempVoiceConfig(guildId) });

      default:
        return NextResponse.json({ error: 'Invalid settings module' }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { guildId: string; setting: string } }
) {
  const { guildId, setting } = params;
  const auth = await authorizeGuildAccess(guildId);
  if (!auth.authorized) {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions for this server.' }, { status: 403 });
  }

  const body = await req.json();

  try {
    switch (setting) {
      case 'settings':
        await GuildSettingsModel.updateOne({ guildId }, { $set: body }, { upsert: true });
        guildCache.invalidate(guildId, 'settings');
        break;

      case 'automod':
        await AutoModRuleModel.updateOne({ guildId }, { $set: body }, { upsert: true });
        guildCache.invalidate(guildId, 'automod');
        break;

      case 'security':
        await SecurityConfigModel.updateOne({ guildId }, { $set: body }, { upsert: true });
        guildCache.invalidate(guildId, 'security');
        break;

      case 'tickets':
        await TicketConfigModel.updateOne({ guildId }, { $set: body }, { upsert: true });
        guildCache.invalidate(guildId, 'ticket');
        break;

      case 'leveling':
        await LevelConfigModel.updateOne({ guildId }, { $set: body }, { upsert: true });
        guildCache.invalidate(guildId, 'level');
        break;

      case 'welcome':
        await WelcomeConfigModel.updateOne({ guildId }, { $set: body }, { upsert: true });
        guildCache.invalidate(guildId, 'welcome');
        break;

      case 'logging':
        await LoggingConfigModel.updateOne({ guildId }, { $set: body }, { upsert: true });
        guildCache.invalidate(guildId, 'logging');
        break;

      case 'tempvoice':
        await TempVoiceConfigModel.updateOne({ guildId }, { $set: body }, { upsert: true });
        guildCache.invalidate(guildId, 'tempvoice');
        break;

      default:
        return NextResponse.json({ error: 'Invalid settings module' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Settings saved successfully!' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
