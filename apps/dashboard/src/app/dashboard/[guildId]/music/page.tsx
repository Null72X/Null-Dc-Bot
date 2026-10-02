'use client';
import { Music } from 'lucide-react';

export default function MusicDashboardPage({ params }: { params: { guildId: string } }) {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <Music className="w-8 h-8 text-indigo-400" /> Music Player
        </h1>
        <p className="text-slate-400 text-sm mt-1">High fidelity audio queue management.</p>
      </div>
      <div className="p-6 rounded-2xl bg-dark-card border border-dark-border text-slate-300">
        <p>Use slash command <code className="text-indigo-400">/music play &lt;song&gt;</code> inside a voice channel to start playing music.</p>
      </div>
    </div>
  );
}
