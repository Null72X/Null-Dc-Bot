import { NextResponse } from 'next/server';
import { getSession, fetchUserGuilds } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session.user || !session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userGuilds = await fetchUserGuilds(session.accessToken);

    // Filter guilds where user has MANAGE_GUILD (0x20) or ADMINISTRATOR (0x8) or is owner
    const authorizedGuilds = userGuilds.filter((g: any) => {
      const perms = BigInt(g.permissions);
      const MANAGE_GUILD = 0x20n;
      const ADMINISTRATOR = 0x8n;
      return (perms & MANAGE_GUILD) === MANAGE_GUILD || (perms & ADMINISTRATOR) === ADMINISTRATOR || g.owner;
    });

    return NextResponse.json({ guilds: authorizedGuilds });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
