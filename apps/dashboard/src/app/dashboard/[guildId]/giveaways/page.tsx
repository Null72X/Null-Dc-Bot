'use client';

import { Gift, Plus, Sparkles } from 'lucide-react';

export default function GiveawaysDashboardPage({ params }: { params: { guildId: string } }) {
  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Gift className="w-8 h-8 text-amber-400" /> Giveaways Manager
          </h1>
          <p className="text-slate-400 text-sm mt-1">Host giveaways with cryptographically secure winner selection.</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
          <Sparkles className="w-5 h-5 flex-shrink-0" />
          <span>Start giveaways directly in Discord channels using <code className="text-white font-mono">/giveaway start</code> with custom prizes, required roles, and durations.</span>
        </div>
      </div>
    </div>
  );
}
