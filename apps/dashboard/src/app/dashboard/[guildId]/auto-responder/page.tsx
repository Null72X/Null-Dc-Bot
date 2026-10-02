'use client';
import { Zap } from 'lucide-react';

export default function AutoResponderDashboardPage({ params }: { params: { guildId: string } }) {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <Zap className="w-8 h-8 text-indigo-400" /> AutoResponder Triggers
        </h1>
        <p className="text-slate-400 text-sm mt-1">Automatic phrase triggers and custom responses.</p>
      </div>
      <div className="p-6 rounded-2xl bg-dark-card border border-dark-border text-slate-300">
        <p>Use slash commands <code className="text-indigo-400">/autoresponder add</code> and <code className="text-indigo-400">/autoresponder list</code> inside Discord.</p>
      </div>
    </div>
  );
}
