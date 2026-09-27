import React, { useState } from 'react';
import { Database, ShieldCheck, RefreshCw, CheckCircle2, Clock, Lock, Server } from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';

interface DataSource {
  id: string;
  name: string;
  category: string;
  endpoint: string;
  status: 'ONLINE' | 'SYNCED' | 'STANDBY';
  recordsCount: string;
  lastSync: string;
  encryption: string;
}

const SOURCES: DataSource[] = [
  { id: 'SRC-01', name: 'DoT Telecom Regulatory CDR Gateway', category: 'Telecommunications', endpoint: 'secure.dot.gov.in/v2/cdr-ingest', status: 'ONLINE', recordsCount: '1,420,890 CDRs', lastSync: '10 mins ago', encryption: 'TLS 1.3 / AES-256-GCM' },
  { id: 'SRC-02', name: 'FIU-IND Suspicious Transaction Feed', category: 'Financial Banking', endpoint: 'api.fiuindia.gov.in/str-stream', status: 'ONLINE', recordsCount: '84,200 Wire Records', lastSync: '25 mins ago', encryption: 'mTLS + HSM Signed' },
  { id: 'SRC-03', name: 'NHAI FASTag & ANPR Optical Highway Grid', category: 'Transit & Tolls', endpoint: 'nhai.fastag.org/toll-anpr-feed', status: 'ONLINE', recordsCount: '920,400 Transponder Logs', lastSync: '2 mins ago', encryption: 'IPSec VPN Tunnel' },
  { id: 'SRC-04', name: 'State CCTNS Criminal Case Repository', category: 'Police FIR Database', endpoint: 'cctns.nic.in/sync/fir-registry', status: 'ONLINE', recordsCount: '312,000 FIR Records', lastSync: '1 hour ago', encryption: 'NIC GovNet Encrypted' },
  { id: 'SRC-05', name: 'MCA-21 Corporate Registrar Directory', category: 'Corporate Registry', endpoint: 'mca.gov.in/din-cin-stream', status: 'SYNCED', recordsCount: '58,000 Director Records', lastSync: '3 hours ago', encryption: 'TLS 1.3' }
];

export const DataSourcesPage: React.FC = () => {
  const { showToast } = useInvestigation();
  const [sources, setSources] = useState(SOURCES);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncAll = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast('All 5 official law enforcement telemetry gateways synchronized.');
    }, 1200);
  };

  return (
    <div className="space-y-6 font-mono text-xs text-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-cyan-400 uppercase tracking-wider font-semibold">
            <Database className="h-4 w-4" />
            Law Enforcement Data Feed Integration Gateways
          </div>
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-100 font-sans mt-1">
            Data Sources & Ingestion Gateways
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Cryptographically sealed connectors to DoT CDR archives, FIU banking feeds, NHAI toll transponders, and CCTNS police records.
          </p>
        </div>

        <button
          onClick={handleSyncAll}
          disabled={isSyncing}
          className="flex items-center gap-2 rounded bg-cyan-600 px-4 py-2 font-semibold text-white hover:bg-cyan-500 disabled:opacity-50 transition-colors shadow-xs shrink-0"
        >
          <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>Sync All Gateways</span>
        </button>
      </div>

      {/* Sources Grid */}
      <div className="space-y-4">
        {sources.map(src => (
          <div key={src.id} className="p-5 rounded border border-slate-800 bg-[#0a1224] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-3">
                <Server className="h-5 w-5 text-cyan-400" />
                <div>
                  <h3 className="font-bold text-slate-100 text-sm font-sans">{src.name}</h3>
                  <div className="text-[10px] text-slate-400 font-mono">{src.id} · {src.category}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 rounded border border-emerald-800 bg-emerald-950/60 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {src.status}
                </span>
                <span className="text-slate-400 text-[10px]">Synced {src.lastSync}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
              <div>
                <span className="text-slate-500 text-[10px] block">Endpoint / Protocol</span>
                <span className="text-slate-300 font-mono">{src.endpoint}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Indexed Volume</span>
                <span className="text-cyan-300 font-bold">{src.recordsCount}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Security & Encryption</span>
                <span className="text-slate-300 flex items-center gap-1">
                  <Lock className="h-3 w-3 text-emerald-400" />
                  <span>{src.encryption}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
