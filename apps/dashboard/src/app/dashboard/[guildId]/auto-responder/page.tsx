'use client';

import { Zap, Plus } from 'lucide-react';

export default function AutoResponderDashboardPage({ params }: { params: { guildId: string } }) {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <Zap className="w-8 h-8 text-amber-400" /> AutoResponder Triggers
        </h1>
        <p className="text-slate-400 text-sm mt-1">Configure automated text or embed trigger responses (Exact, Contains, or Regex).</p>
      </div>

      <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-dark-border text-xs text-slate-400">
          💡 Add new triggers in Discord using <code className="text-indigo-400">/autoresponder add</code> or list existing triggers with <code className="text-indigo-400">/autoresponder list</code>.
        </div>
      </div>
    </div>
  );
}
