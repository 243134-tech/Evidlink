import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellRing, AlertTriangle, ShieldCheck, CheckCircle2, XCircle, ArrowRight, Network } from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';

interface AlertItem {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  timestamp: string;
  title: string;
  explanation: string;
  recommendedAction: string;
  status: 'PENDING' | 'ACKNOWLEDGED' | 'ASSIGNED';
  relatedEntityId?: string;
}

const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'ALT-2026-01',
    severity: 'CRITICAL',
    timestamp: '10 mins ago',
    title: 'High Betweenness Broker Newly Identified (Vikram S. / P002)',
    explanation: 'Algorithmic centrality analysis flagged Entity P002 as the primary bridge linking Cluster Alpha and Cluster Beta with betweenness score 98/100.',
    recommendedAction: 'Issue targeted surveillance notice and cross-reference with DoT CDR registry.',
    status: 'PENDING',
    relatedEntityId: 'P002'
  },
  {
    id: 'ALT-2026-02',
    severity: 'CRITICAL',
    timestamp: '42 mins ago',
    title: 'Rapid-Dwell Pass-Through Funnel (AC-ICICI-3340)',
    explanation: '₹1.45 Cr transferred into V. S. Advisory Escrow and completely drained in two tranches within 23 minutes into commercial freight accounts.',
    recommendedAction: 'Subpoena account KYC and freeze linked secondary current accounts under PMLA provisions.',
    status: 'PENDING'
  },
  {
    id: 'ALT-2026-03',
    severity: 'HIGH',
    timestamp: '2 hours ago',
    title: 'Sudden 8-Call Pre-Transit CDR Burst Detected',
    explanation: 'Eight consecutive voice calls recorded between P002, P003, and P001 within 54 minutes preceding highway convoy dispatch.',
    recommendedAction: 'Correlate with Kundli NH44 toll optical timestamps and request live BTS monitoring.',
    status: 'PENDING'
  },
  {
    id: 'ALT-2026-04',
    severity: 'MEDIUM',
    timestamp: '5 hours ago',
    title: 'Convoy Escort Pattern Flagged (Scorpio DL-04-TC-8812)',
    explanation: 'Scorpio escort SUV crossed Kundli and Murthal toll plazas 4 minutes ahead of Tata Container freight truck.',
    recommendedAction: 'Alert state border transit checkpoints along NH44 Northbound corridor.',
    status: 'ACKNOWLEDGED'
  }
];

export const AlertsQueuePage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useInvestigation();
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);

  const handleAcknowledge = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, status: 'ACKNOWLEDGED' } : a));
    showToast(`Alert ${id} acknowledged by investigator.`);
  };

  const handleAssign = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, status: 'ASSIGNED' } : a));
    showToast(`Alert ${id} assigned to Special Investigation Task Force.`);
  };

  const handleDismiss = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
    showToast(`Alert ${id} dismissed from active queue.`);
  };

  return (
    <div className="space-y-6 font-mono text-xs text-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-cyan-400 uppercase tracking-wider font-semibold">
            <BellRing className="h-4 w-4" />
            Tactical Action Queue ({alerts.length} Pending Tasks)
          </div>
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-100 font-sans mt-1">
            Investigative Alerts Queue
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Prioritized tactical notifications with automated investigative recommendations for human analyst assignment.
          </p>
        </div>

        <button
          onClick={() => navigate('/graph')}
          className="flex items-center gap-2 rounded bg-cyan-600 px-4 py-2 font-semibold text-white hover:bg-cyan-500 shadow-xs shrink-0"
        >
          <Network className="h-4 w-4" />
          <span>Tactical Graph View</span>
        </button>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {alerts.map(alert => (
          <div
            key={alert.id}
            className={`p-5 rounded border transition-colors space-y-4 ${
              alert.severity === 'CRITICAL'
                ? 'border-rose-900/80 bg-rose-950/20'
                : alert.severity === 'HIGH'
                ? 'border-amber-900/80 bg-amber-950/20'
                : 'border-slate-800 bg-[#0a1224]'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  alert.severity === 'CRITICAL'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : alert.severity === 'HIGH'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-slate-850 text-slate-300 border border-slate-700'
                }`}>
                  {alert.severity}
                </span>
                <span className="font-bold text-slate-400">{alert.id}</span>
                <span className="text-slate-500">· {alert.timestamp}</span>
              </div>

              <span className="text-[10px] uppercase text-slate-400 font-semibold">
                Status: <strong className="text-cyan-300">{alert.status}</strong>
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-slate-100 font-sans">{alert.title}</h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">{alert.explanation}</p>
            </div>

            {/* Recommended Investigative Action Box */}
            <div className="rounded border border-cyan-900/60 bg-cyan-950/30 p-3 space-y-1">
              <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Recommended Action</span>
              </span>
              <p className="text-slate-200 font-sans text-xs italic">
                "{alert.recommendedAction}"
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                {alert.status === 'PENDING' && (
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className="rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-700"
                  >
                    Acknowledge
                  </button>
                )}
                {alert.status !== 'ASSIGNED' && (
                  <button
                    onClick={() => handleAssign(alert.id)}
                    className="rounded bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-cyan-500"
                  >
                    Assign to Investigator
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {alert.relatedEntityId && (
                  <button
                    onClick={() => navigate(`/entities/${alert.relatedEntityId}`)}
                    className="text-cyan-400 hover:underline text-xs"
                  >
                    View Entity Profile →
                  </button>
                )}
                <button
                  onClick={() => handleDismiss(alert.id)}
                  className="rounded border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
