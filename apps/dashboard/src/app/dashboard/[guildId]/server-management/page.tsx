'use client';

import { Server, Database } from 'lucide-react';

export default function ServerManagementDashboardPage({ params }: { params: { guildId: string } }) {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <Server className="w-8 h-8 text-indigo-400" /> Server Backups & Structure Export
        </h1>
        <p className="text-slate-400 text-sm mt-1">Export, backup, and restore server channel and role configurations safely.</p>
      </div>

      <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900 border border-dark-border text-xs text-slate-400">
          <Database className="w-5 h-5 text-indigo-400 flex-shrink-0" />
          <span>To back up or restore roles & channels, use <code className="text-indigo-400 font-mono">/servermgmt backup</code> or <code className="text-indigo-400 font-mono">/servermgmt restore</code> inside Discord.</span>
        </div>
      </div>
    </div>
  );
}
