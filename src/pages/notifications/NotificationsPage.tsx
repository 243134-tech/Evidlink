import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ShieldCheck, AlertTriangle, CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, markAllNotificationsRead } = useInvestigation();

  return (
    <div className="space-y-6 font-mono text-xs text-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-cyan-400 uppercase tracking-wider font-semibold">
            <Bell className="h-4 w-4" />
            Investigator Activity & Pipeline Notifications
          </div>
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-100 font-sans mt-1">
            Notifications & System Activity
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Audit logs of entity resolutions, pipeline ingests, new lead generation events, and access logs.
          </p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="rounded border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs text-slate-300 hover:bg-slate-700"
        >
          Mark All Read
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map(n => (
          <div
            key={n.id}
            onClick={() => n.link && navigate(n.link)}
            className={`p-4 rounded border transition-colors flex items-start justify-between gap-4 cursor-pointer ${
              n.read ? 'border-slate-800 bg-[#0a1224] opacity-80' : 'border-cyan-800/80 bg-[#0c1630]'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded bg-cyan-950 border border-cyan-800 text-cyan-400 shrink-0 mt-0.5">
                <Bell className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-100 text-sm font-sans">{n.title}</span>
                  {!n.read && (
                    <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                  )}
                </div>
                <p className="text-xs text-slate-300 font-sans">{n.message}</p>
                <span className="text-[10px] text-slate-500">{n.timestamp}</span>
              </div>
            </div>

            {n.link && (
              <ExternalLink className="h-4 w-4 text-slate-500 shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
