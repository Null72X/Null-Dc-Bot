'use client';
import { ShieldAlert } from 'lucide-react';

export default function ModerationDashboardPage({ params }: { params: { guildId: string } }) {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-indigo-400" /> Moderation & Infractions
        </h1>
        <p className="text-slate-400 text-sm mt-1">Manage server infraction cases, warnings, and punishments.</p>
      </div>
      <div className="p-6 rounded-2xl bg-dark-card border border-dark-border text-slate-300">
        <p>Use slash commands like <code className="text-indigo-400">/ban</code>, <code className="text-indigo-400">/kick</code>, <code className="text-indigo-400">/timeout</code>, <code className="text-indigo-400">/warn</code>, and <code className="text-indigo-400">/cases</code> inside Discord to manage infractions live.</p>
      </div>
    </div>
  );
}
