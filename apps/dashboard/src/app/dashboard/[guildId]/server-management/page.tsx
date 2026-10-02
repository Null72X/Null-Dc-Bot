'use client';
import { Server } from 'lucide-react';

export default function ServerManagementDashboardPage({ params }: { params: { guildId: string } }) {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <Server className="w-8 h-8 text-indigo-400" /> Server Management & Backups
        </h1>
        <p className="text-slate-400 text-sm mt-1">Export, backup, and restore server channel & role layouts.</p>
      </div>
      <div className="p-6 rounded-2xl bg-dark-card border border-dark-border text-slate-300">
        <p>Use slash commands <code className="text-indigo-400">/servermgmt backup</code> and <code className="text-indigo-400">/servermgmt restore</code> inside Discord.</p>
      </div>
    </div>
  );
}
