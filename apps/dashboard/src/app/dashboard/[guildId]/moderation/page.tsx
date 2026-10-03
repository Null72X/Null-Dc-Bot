'use client';

import { useEffect, useState } from 'react';
import { ShieldAlert, RefreshCw, UserX } from 'lucide-react';

export default function ModerationDashboardPage({ params }: { params: { guildId: string } }) {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/guilds/${params.guildId}/overview`)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.guildId]);

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-amber-400" /> Moderation & Infraction Cases
        </h1>
        <p className="text-slate-400 text-sm mt-1">Live audit log of all punishments issued by moderators or AutoMod.</p>
      </div>

      <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-dark-border">
          <h3 className="font-bold text-white text-lg">Server Infractions History</h3>
          <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-dark-border">
            Discord Integration Active
          </span>
        </div>

        <div className="p-12 text-center text-slate-400 space-y-3">
          <UserX className="w-12 h-12 text-slate-500 mx-auto" />
          <h4 className="font-bold text-slate-200">Live Slash Command Sync Enabled</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Use slash commands like <code className="text-indigo-400">/ban</code>, <code className="text-indigo-400">/kick</code>, <code className="text-indigo-400">/timeout</code>, and <code className="text-indigo-400">/warn</code> inside Discord. All cases are recorded to MongoDB in real time.
          </p>
        </div>
      </div>
    </div>
  );
}
