import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: string;
}

export function StatCard({ title, value, subtitle, icon: Icon, color = 'text-indigo-400' }: StatCardProps) {
  return (
    <div className="p-6 rounded-2xl bg-dark-card border border-dark-border shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      <div className={`p-3.5 rounded-xl bg-slate-800/80 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}

interface ToggleSwitchProps {
  label: string;
  description?: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function ToggleSwitch({ label, description, enabled, onChange }: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-dark-border/40 last:border-0">
      <div>
        <h4 className="text-sm font-semibold text-slate-200">{label}</h4>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
          enabled ? 'bg-indigo-600' : 'bg-slate-700'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
