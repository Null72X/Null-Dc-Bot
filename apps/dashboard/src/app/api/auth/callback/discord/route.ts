import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken, fetchDiscordUser, getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) {
    return NextResponse.redirect(new URL('/?error=missing_code', req.url));
  }

  try {
    const tokenData = await exchangeCodeForToken(code);
    const user = await fetchDiscordUser(tokenData.access_token);

    const session = await getSession();
    session.accessToken = tokenData.access_token;
    session.user = {
      id: user.id,
      username: user.username,
      discriminator: user.discriminator,
      avatar: user.avatar,
    };
    await session.save();

    return NextResponse.redirect(new URL('/dashboard', req.url));
  } catch (err) {
    console.error('OAuth callback error:', err);
    return NextResponse.redirect(new URL('/?error=oauth_failed', req.url));
  }
}
