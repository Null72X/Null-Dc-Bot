'use client';

import { Smile, Sliders } from 'lucide-react';

export default function ReactionRolesDashboardPage({ params }: { params: { guildId: string } }) {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <Smile className="w-8 h-8 text-indigo-400" /> Reaction & Interactive Role Panels
        </h1>
        <p className="text-slate-400 text-sm mt-1">Create self-assignable role panels using Discord buttons or dropdown menus.</p>
      </div>

      <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm">
          <Sliders className="w-5 h-5 flex-shrink-0" />
          <span>Use slash command <code className="text-white font-mono">/reactionrole</code> in any text channel to deploy interactive button or dropdown role panels.</span>
        </div>
      </div>
    </div>
  );
}
