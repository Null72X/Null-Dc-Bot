'use client';

import { useEffect, useState } from 'react';
import { StatCard } from '@/components/StatCard';
import { ShieldAlert, Ticket, Lock, CheckCircle, Radio } from 'lucide-react';
import { botIdentity } from '@null-bot/config';

export default function OverviewPage({ params }: { params: { guildId: string } }) {
  const [stats, setStats] = useState({ modCount: 0, openTickets: 0, incidentCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/guilds/${params.guildId}/overview`)
      .then((res) => res.json())
      .then((data) => {
        if (data.stats) setStats(data.stats);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.guildId]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Guild Overview</h1>
        <p className="text-slate-400 text-sm mt-1">System status and activity metrics for {botIdentity.name}.</p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Infractions" value={stats.modCount} icon={ShieldAlert} color="text-amber-400" />
        <StatCard title="Open Support Tickets" value={stats.openTickets} icon={Ticket} color="text-indigo-400" />
        <StatCard title="Security Incidents" value={stats.incidentCount} icon={Lock} color="text-rose-400" />
      </div>

      {/* Status Card */}
      <div className="p-6 rounded-2xl bg-dark-card border border-dark-border flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-white">Bot Gateway Connected</h3>
            <p className="text-xs text-slate-400">Database connected and listening to real-time Discord events.</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
          Online
        </span>
      </div>
    </div>
  );
}
