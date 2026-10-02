'use client';

import { useEffect, useState } from 'react';
import { ToggleSwitch } from '@/components/ToggleSwitch';
import { Save, Ticket } from 'lucide-react';

export default function TicketsPage({ params }: { params: { guildId: string } }) {
  const [config, setConfig] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/guilds/${params.guildId}/tickets`)
      .then((res) => res.json())
      .then((data) => {
        if (data.config) setConfig(data.config);
      });
  }, [params.guildId]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/guilds/${params.guildId}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (res.ok) setMessage('Ticket settings saved successfully!');
    } catch (err) {
      setMessage('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (!config) return <div className="p-8 text-slate-400">Loading Ticket configuration...</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Ticket className="w-8 h-8 text-indigo-400" /> Ticket System Configuration
          </h1>
          <p className="text-slate-400 text-sm mt-1">Configure ticket panel title, description, and limits.</p>
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
        <ToggleSwitch
          label="Enable Ticket System"
          description="Allow members to open private support channels."
          enabled={config.enabled || false}
          onChange={(val) => setConfig({ ...config, enabled: val })}
        />

        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">Panel Title</label>
          <input
            type="text"
            value={config.panelTitle || ''}
            onChange={(e) => setConfig({ ...config, panelTitle: e.target.value })}
            className="w-full p-3 rounded-xl bg-slate-800 border border-dark-border text-white focus:outline-none focus:border-indigo-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">Panel Description</label>
          <textarea
            rows={3}
            value={config.panelDescription || ''}
            onChange={(e) => setConfig({ ...config, panelDescription: e.target.value })}
            className="w-full p-3 rounded-xl bg-slate-800 border border-dark-border text-white focus:outline-none focus:border-indigo-500 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
