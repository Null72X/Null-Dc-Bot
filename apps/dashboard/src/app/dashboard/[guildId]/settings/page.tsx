'use client';

import { useEffect, useState } from 'react';
import { Save, Settings } from 'lucide-react';
import { botIdentity } from '@null-bot/config';

export default function SettingsPage({ params }: { params: { guildId: string } }) {
  const [settings, setSettings] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/guilds/${params.guildId}/settings`)
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      });
  }, [params.guildId]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/guilds/${params.guildId}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) setMessage('Guild settings saved successfully!');
    } catch (err) {
      setMessage('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return <div className="p-8 text-slate-400">Loading guild settings...</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Settings className="w-8 h-8 text-indigo-400" /> Guild General Settings
          </h1>
          <p className="text-slate-400 text-sm mt-1">Configure bot prefix and default embed color.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
          {message}
        </div>
      )}

      <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">Bot Command Prefix</label>
          <input
            type="text"
            value={settings.prefix || '!'}
            onChange={(e) => setSettings({ ...settings, prefix: e.target.value })}
            className="w-full max-w-xs p-3 rounded-xl bg-slate-800 border border-dark-border text-white focus:outline-none focus:border-indigo-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">Default Embed Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={settings.embedColor || '#5865F2'}
              onChange={(e) => setSettings({ ...settings, embedColor: e.target.value })}
              className="w-12 h-10 rounded bg-slate-800 border border-dark-border cursor-pointer"
            />
            <input
              type="text"
              value={settings.embedColor || '#5865F2'}
              onChange={(e) => setSettings({ ...settings, embedColor: e.target.value })}
              className="w-32 p-3 rounded-xl bg-slate-800 border border-dark-border text-white focus:outline-none focus:border-indigo-500 text-sm font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
