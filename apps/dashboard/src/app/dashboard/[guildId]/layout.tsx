import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function GuildLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { guildId: string };
}) {
  const session = await getSession();
  if (!session.user) {
    redirect('/api/auth/login');
  }

  return (
    <div className="flex min-h-screen bg-dark-bg">
      <Sidebar guildId={params.guildId} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar user={session.user} />
        <main className="p-8 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
