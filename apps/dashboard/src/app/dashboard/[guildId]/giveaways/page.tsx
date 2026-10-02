'use client';
import { Gift } from 'lucide-react';

export default function GiveawaysDashboardPage({ params }: { params: { guildId: string } }) {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <Gift className="w-8 h-8 text-indigo-400" /> Giveaways Manager
        </h1>
        <p className="text-slate-400 text-sm mt-1">Host and manage giveaways with cryptographically secure winner selection.</p>
      </div>
      <div className="p-6 rounded-2xl bg-dark-card border border-dark-border text-slate-300">
        <p>Use slash commands <code className="text-indigo-400">/giveaway start</code> and <code className="text-indigo-400">/giveaway end</code> inside Discord channels.</p>
      </div>
    </div>
  );
}
