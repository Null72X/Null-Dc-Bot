'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { botIdentity } from '@null-bot/config';
import {
  LayoutDashboard,
  ShieldAlert,
  Bot,
  Lock,
  Ticket,
  Music,
  Award,
  Gift,
  Smile,
  MessageSquare,
  FileText,
  Zap,
  Server,
  Mic,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  guildId: string;
}

export function Sidebar({ guildId }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', href: `/dashboard/${guildId}/overview`, icon: LayoutDashboard },
    { name: 'Moderation', href: `/dashboard/${guildId}/moderation`, icon: ShieldAlert },
    { name: 'AutoMod', href: `/dashboard/${guildId}/automod`, icon: Bot },
    { name: 'Security', href: `/dashboard/${guildId}/security`, icon: Lock },
    { name: 'Tickets', href: `/dashboard/${guildId}/tickets`, icon: Ticket },
    { name: 'Music', href: `/dashboard/${guildId}/music`, icon: Music },
    { name: 'Leveling', href: `/dashboard/${guildId}/leveling`, icon: Award },
    { name: 'Giveaways', href: `/dashboard/${guildId}/giveaways`, icon: Gift },
    { name: 'Reaction Roles', href: `/dashboard/${guildId}/reaction-roles`, icon: Smile },
    { name: 'Welcome', href: `/dashboard/${guildId}/welcome`, icon: MessageSquare },
    { name: 'Logging', href: `/dashboard/${guildId}/logging`, icon: FileText },
    { name: 'Auto Responder', href: `/dashboard/${guildId}/auto-responder`, icon: Zap },
    { name: 'Server Management', href: `/dashboard/${guildId}/server-management`, icon: Server },
    { name: 'Temporary Voice', href: `/dashboard/${guildId}/temp-voice`, icon: Mic },
    { name: 'Settings', href: `/dashboard/${guildId}/settings`, icon: Settings },
  ];

  return (
    <aside className="w-64 bg-dark-sidebar border-r border-dark-border flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-dark-border flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-lg text-white shadow-lg shadow-indigo-600/30">
          N
        </div>
        <div>
          <h1 className="font-bold text-lg text-white leading-none">{botIdentity.name}</h1>
          <span className="text-xs text-slate-400">Dashboard</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Server selector back link */}
      <div className="p-4 border-t border-dark-border">
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
        >
          ← Change Server
        </Link>
      </div>
    </aside>
  );
}
