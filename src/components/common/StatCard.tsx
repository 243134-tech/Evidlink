import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral' | 'critical';
  icon: React.ReactNode;
  trend?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  change,
  changeType = 'neutral',
  icon,
  trend,
  onClick
}) => {
  const changeColors = {
    positive: 'text-emerald-400',
    negative: 'text-slate-400',
    neutral: 'text-cyan-400',
    critical: 'text-rose-400 font-semibold'
  };

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded border border-slate-800/90 bg-[#0c1427]/80 p-4 transition-all duration-200 hover:border-cyan-800/50 hover:bg-[#0f1932] ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-mono tracking-wider text-slate-400 uppercase">{label}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-slate-100 font-mono">
              {value}
            </span>
            {subValue && (
              <span className="text-xs text-slate-400 font-mono">
                / {subValue}
              </span>
            )}
          </div>
        </div>
        <div className="rounded border border-slate-800 bg-slate-900/80 p-2 text-cyan-400">
          {icon}
        </div>
      </div>

      {(change || trend) && (
        <div className="mt-3 flex items-center gap-2 border-t border-slate-800/60 pt-2 text-[11px] font-mono">
          {change && (
            <span className={changeColors[changeType]}>
              {change}
            </span>
          )}
          {trend && (
            <span className="text-slate-400 truncate">
              · {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
