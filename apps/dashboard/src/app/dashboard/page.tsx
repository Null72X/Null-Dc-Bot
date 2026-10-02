'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Server, ShieldCheck, ChevronRight } from 'lucide-react';
import { botIdentity } from '@null-bot/config';

interface Guild {
  id: string;
  name: string;
  icon?: string;
  owner: boolean;
}

export default function GuildSelectorPage() {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/guilds')
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized or failed to load servers');
        return res.json();
      })
      .then((data) => {
        setGuilds(data.guilds || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-dark-bg p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-dark-border">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Select a Server</h1>
          <p className="text-slate-400 text-sm mt-1">Manage configuration for servers where you have Manage Guild permissions.</p>
        </div>
        <Link href="/" className="text-xs font-semibold text-slate-400 hover:text-white">
          ← Back Home
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-dark-card border border-dark-border animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-center">
          <p className="font-semibold">{error}</p>
          <a href="/api/auth/login" className="mt-4 inline-block px-4 py-2 rounded-lg bg-red-600 text-white font-medium text-xs">
            Re-authenticate with Discord
          </a>
        </div>
      ) : guilds.length === 0 ? (
        <div className="p-12 rounded-2xl bg-dark-card border border-dark-border text-center">
          <Server className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-1">No Manageable Servers Found</h3>
          <p className="text-sm text-slate-400">You must have Manage Server permissions to configure {botIdentity.name}.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guilds.map((g) => (
            <Link
              key={g.id}
              href={`/dashboard/${g.id}/overview`}
              className="p-5 rounded-2xl bg-dark-card border border-dark-border hover:border-indigo-500/60 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center font-bold text-indigo-400 text-lg overflow-hidden border border-dark-border">
                  {g.icon ? (
                    <img src={`https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`} alt={g.name} className="w-full h-full object-cover" />
                  ) : (
                    g.name.charAt(0)
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors">{g.name}</h3>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Authorized
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
