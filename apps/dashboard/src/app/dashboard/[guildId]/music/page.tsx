'use client';

import { useState } from 'react';
import { Music, Volume2, Repeat, Shuffle } from 'lucide-react';

export default function MusicDashboardPage({ params }: { params: { guildId: string } }) {
  const [volume, setVolume] = useState(100);
  const [loopMode, setLoopMode] = useState('OFF');

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <Music className="w-8 h-8 text-indigo-400" /> Music Player Settings
        </h1>
        <p className="text-slate-400 text-sm mt-1">Configure default volume, loop settings, and queue behavior.</p>
      </div>

      <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-indigo-400" /> Default Playback Volume ({volume}%)
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
            <Repeat className="w-4 h-4 text-indigo-400" /> Default Loop Mode
          </label>
          <select
            value={loopMode}
            onChange={(e) => setLoopMode(e.target.value)}
            className="w-full max-w-xs p-3 rounded-xl bg-slate-800 border border-dark-border text-white focus:outline-none focus:border-indigo-500 text-sm"
          >
            <option value="OFF">Off (Play in order)</option>
            <option value="TRACK">Loop Current Track</option>
            <option value="QUEUE">Loop Entire Queue</option>
          </select>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-dark-border text-xs text-slate-400">
          💡 Control music live in Discord voice channels using <code className="text-indigo-400">/music play</code>, <code className="text-indigo-400">/music skip</code>, <code className="text-indigo-400">/music queue</code>, and <code className="text-indigo-400">/music stop</code>.
        </div>
      </div>
    </div>
  );
}
