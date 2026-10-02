import { SessionOptions, getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { env } from '@null-bot/config';
import { connectDatabase } from '@null-bot/database';

export interface SessionData {
  user?: {
    id: string;
    username: string;
    discriminator: string;
    avatar?: string;
  };
  accessToken?: string;
}

export const sessionOptions: SessionOptions = {
  password: env.SESSION_SECRET || 'super_secret_session_key_must_be_long_and_secure',
  cookieName: 'nullbot_dashboard_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
  },
};

export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  return session;
}

export function getDiscordOAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: env.DISCORD_CLIENT_ID,
    redirect_uri: env.DISCORD_REDIRECT_URI,
    response_type: 'code',
    scope: 'identify guilds',
  });
  return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string): Promise<{ access_token: string; token_type: string }> {
  const params = new URLSearchParams({
    client_id: env.DISCORD_CLIENT_ID,
    client_secret: env.DISCORD_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code,
    redirect_uri: env.DISCORD_REDIRECT_URI,
  });

  const res = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to exchange code: ${errText}`);
  }

  return res.json();
}

export async function fetchDiscordUser(accessToken: string) {
  const res = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error('Failed to fetch Discord user');
  return res.json();
}

export async function fetchUserGuilds(accessToken: string) {
  const res = await fetch('https://discord.com/api/users/@me/guilds', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error('Failed to fetch user guilds');
  return res.json();
}

/**
 * STRICT SECURITY AUTHORIZATION CHECK:
 * Verifies that the logged in user has MANAGE_GUILD (0x20) or ADMINISTRATOR (0x8) permission on target guild.
 */
export async function authorizeGuildAccess(guildId: string): Promise<{ authorized: boolean; session?: SessionData }> {
  await connectDatabase();
  const session = await getSession();

  if (!session.user || !session.accessToken) {
    return { authorized: false };
  }

  try {
    const userGuilds = await fetchUserGuilds(session.accessToken);
    const guild = userGuilds.find((g: any) => g.id === guildId);

    if (!guild) {
      return { authorized: false, session };
    }

    const permissions = BigInt(guild.permissions);
    const MANAGE_GUILD = 0x20n;
    const ADMINISTRATOR = 0x8n;

    const isAuthorized = (permissions & MANAGE_GUILD) === MANAGE_GUILD || (permissions & ADMINISTRATOR) === ADMINISTRATOR || guild.owner;

    return { authorized: isAuthorized, session };
  } catch (err) {
    return { authorized: false, session };
  }
}
