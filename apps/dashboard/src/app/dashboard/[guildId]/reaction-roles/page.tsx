'use client';
import { Smile } from 'lucide-react';

export default function ReactionRolesDashboardPage({ params }: { params: { guildId: string } }) {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <Smile className="w-8 h-8 text-indigo-400" /> Reaction Roles Panels
        </h1>
        <p className="text-slate-400 text-sm mt-1">Self-assignable role panels using buttons or select menus.</p>
      </div>
      <div className="p-6 rounded-2xl bg-dark-card border border-dark-border text-slate-300">
        <p>Use slash command <code className="text-indigo-400">/reactionrole</code> to create custom role panels.</p>
      </div>
    </div>
  );
}
