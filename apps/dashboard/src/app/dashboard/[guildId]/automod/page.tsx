'use client';

import { useEffect, useState } from 'react';
import { ToggleSwitch } from '@/components/ToggleSwitch';
import { Save, Bot } from 'lucide-react';

export default function AutoModPage({ params }: { params: { guildId: string } }) {
  const [automod, setAutomod] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/guilds/${params.guildId}/automod`)
      .then((res) => res.json())
      .then((data) => {
        if (data.automod) setAutomod(data.automod);
      });
  }, [params.guildId]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/guilds/${params.guildId}/automod`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(automod),
      });
      const data = await res.json();
      if (res.ok) setMessage('AutoMod settings saved successfully!');
    } catch (err) {
      setMessage('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (!automod) return <div className="p-8 text-slate-400">Loading AutoMod configuration...</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Bot className="w-8 h-8 text-indigo-400" /> AutoModeration Filters
          </h1>
          <p className="text-slate-400 text-sm mt-1">Configure automated filters and punishments.</p>
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

      <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4">
        <h3 className="text-lg font-bold text-white mb-4">Content & Spam Filters</h3>

        <ToggleSwitch
          label="Bad Words Filter"
          description="Automatically flag and remove messages containing prohibited phrases."
          enabled={automod.badWords?.enabled || false}
          onChange={(val) => setAutomod({ ...automod, badWords: { ...automod.badWords, enabled: val } })}
        />

        <ToggleSwitch
          label="Discord Invites Filter"
          description="Block unauthorized Discord server invite links."
          enabled={automod.invites?.enabled || false}
          onChange={(val) => setAutomod({ ...automod, invites: { ...automod.invites, enabled: val } })}
        />

        <ToggleSwitch
          label="External Links Filter"
          description="Block external URLs not on the domain whitelist."
          enabled={automod.links?.enabled || false}
          onChange={(val) => setAutomod({ ...automod, links: { ...automod.links, enabled: val } })}
        />

        <ToggleSwitch
          label="Fast Message Bursts / Spam"
          description="Detect rapid message spam from single users."
          enabled={automod.spam?.enabled || false}
          onChange={(val) => setAutomod({ ...automod, spam: { ...automod.spam, enabled: val } })}
        />

        <ToggleSwitch
          label="Excessive Caps Filter"
          description="Flag messages with over 70% capital letters."
          enabled={automod.caps?.enabled || false}
          onChange={(val) => setAutomod({ ...automod, caps: { ...automod.caps, enabled: val } })}
        />

        <ToggleSwitch
          label="Mass Mentions Filter"
          description="Prevent mass user and role mention spam."
          enabled={automod.mentions?.enabled || false}
          onChange={(val) => setAutomod({ ...automod, mentions: { ...automod.mentions, enabled: val } })}
        />
      </div>
    </div>
  );
}
