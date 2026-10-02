'use client';

import { useEffect, useState } from 'react';
import { ToggleSwitch } from '@/components/ToggleSwitch';
import { Save, Lock } from 'lucide-react';

export default function SecurityPage({ params }: { params: { guildId: string } }) {
  const [security, setSecurity] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/guilds/${params.guildId}/security`)
      .then((res) => res.json())
      .then((data) => {
        if (data.security) setSecurity(data.security);
      });
  }, [params.guildId]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/guilds/${params.guildId}/security`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(security),
      });
      if (res.ok) setMessage('Security settings saved successfully!');
    } catch (err) {
      setMessage('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (!security) return <div className="p-8 text-slate-400">Loading Security configuration...</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Lock className="w-8 h-8 text-indigo-400" /> Security Engine Controls
          </h1>
          <p className="text-slate-400 text-sm mt-1">Configure Anti-Raid join threshold and Anti-Nuke actions.</p>
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
          label="Enable Security Engine"
          description="Master switch for Anti-Raid and Anti-Nuke modules."
          enabled={security.enabled || false}
          onChange={(val) => setSecurity({ ...security, enabled: val })}
        />

        <ToggleSwitch
          label="Anti-Raid Burst Detection"
          description="Detect abnormal member join bursts within a short timeframe."
          enabled={security.antiRaid?.enabled || false}
          onChange={(val) => setSecurity({ ...security, antiRaid: { ...security.antiRaid, enabled: val } })}
        />

        <ToggleSwitch
          label="Anti-Nuke Protection"
          description="Detect mass channel/role deletion, mass bans, and webhook spam."
          enabled={security.antiNuke?.enabled || false}
          onChange={(val) => setSecurity({ ...security, antiNuke: { ...security.antiNuke, enabled: val } })}
        />
      </div>
    </div>
  );
}
