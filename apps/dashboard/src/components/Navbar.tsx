'use client';

import { LogOut, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  user?: {
    username: string;
    avatar?: string;
  };
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/me', { method: 'POST' });
    router.push('/');
  };

  return (
    <header className="h-16 border-b border-dark-border bg-dark-card/50 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <span className="font-semibold text-slate-200">Guild Control Panel</span>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-200 overflow-hidden">
              {user.avatar ? (
                <img src={`https://cdn.discordapp.com/avatars/${user.username}/${user.avatar}.png`} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-4 h-4" />
              )}
            </div>
            <span className="text-sm font-medium text-slate-200">{user.username}</span>
          </div>
        ) : null}

        <button
          onClick={handleLogout}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
