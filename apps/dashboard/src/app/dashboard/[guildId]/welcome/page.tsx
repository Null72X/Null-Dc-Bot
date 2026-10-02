'use client';

import { useEffect, useState } from 'react';
import { ToggleSwitch } from '@/components/ToggleSwitch';
import { Save, MessageSquare, Eye } from 'lucide-react';

export default function WelcomePage({ params }: { params: { guildId: string } }) {
  const [welcome, setWelcome] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/guilds/${params.guildId}/welcome`)
      .then((res) => res.json())
      .then((data) => {
        if (data.welcome) setWelcome(data.welcome);
      });
  }, [params.guildId]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/guilds/${params.guildId}/welcome`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(welcome),
      });
      if (res.ok) setMessage('Welcome settings saved successfully!');
    } catch (err) {
      setMessage('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (!welcome) return <div className="p-8 text-slate-400">Loading Welcome configuration...</div>;

  const previewText = (welcome.welcomeMessage || '')
    .replace(/{user}/g, 'UserTag#0001')
    .replace(/{mention}/g, '@UserTag')
    .replace(/{server}/g, 'My Awesome Server')
    .replace(/{memberCount}/g, '1,234');

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-indigo-400" /> Welcome & Goodbye Greetings
          </h1>
          <p className="text-slate-400 text-sm mt-1">Customize join and leave messages with live preview.</p>
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
          label="Enable Welcome Greetings"
          description="Send welcome messages when a new member joins."
          enabled={welcome.welcomeEnabled || false}
          onChange={(val) => setWelcome({ ...welcome, welcomeEnabled: val })}
        />

        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">Welcome Message Template</label>
          <textarea
            rows={3}
            value={welcome.welcomeMessage || ''}
            onChange={(e) => setWelcome({ ...welcome, welcomeMessage: e.target.value })}
            className="w-full p-3 rounded-xl bg-slate-800 border border-dark-border text-white focus:outline-none focus:border-indigo-500 text-sm"
            placeholder="Welcome {mention} to {server}! Member #{memberCount}."
          />
          <p className="text-xs text-slate-500 mt-1">Placeholders: &#123;user&#125;, &#123;username&#125;, &#123;mention&#125;, &#123;server&#125;, &#123;memberCount&#125;</p>
        </div>

        {/* Live Preview Box */}
        <div className="p-4 rounded-xl bg-slate-900 border border-dark-border">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            <Eye className="w-4 h-4 text-indigo-400" /> Live Embed Preview
          </div>
          <div className="p-4 rounded-lg bg-dark-card border-l-4 border-emerald-400 text-sm text-slate-200">
            <h4 className="font-bold text-white mb-1">👋 Welcome to My Awesome Server!</h4>
            <p className="whitespace-pre-wrap">{previewText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
