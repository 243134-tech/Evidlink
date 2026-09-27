import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneCall, AlertTriangle, Search, Filter, Clock, MapPin, ArrowRight, Activity } from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';

interface CallRecord {
  id: string;
  timestamp: string;
  caller: string;
  callerId: string;
  receiver: string;
  receiverId: string;
  duration: string;
  cellTower: string;
  callType: 'VOICE' | 'SMS' | 'VOIP_PACKET';
  isBurst: boolean;
}

const SAMPLE_CDRS: CallRecord[] = [
  { id: 'CDR-8801', timestamp: '2026-01-14 22:04', caller: 'Vikram S. (+91-98102-99812)', callerId: 'P002', receiver: 'Rahul Sharma (+91-98111-44321)', receiverId: 'P003', duration: '4m 12s', cellTower: 'NH44 Kundli Sector 38', callType: 'VOICE', isBurst: true },
  { id: 'CDR-8802', timestamp: '2026-01-14 22:11', caller: 'Vikram S. (+91-98102-99812)', callerId: 'P002', receiver: 'Devraj Anand (+91-98200-11223)', receiverId: 'P001', duration: '2m 30s', cellTower: 'NH44 Kundli Sector 38', callType: 'VOICE', isBurst: true },
  { id: 'CDR-8803', timestamp: '2026-01-14 22:19', caller: 'Rahul Sharma (+91-98111-44321)', callerId: 'P003', receiver: 'Tariq Mansoor (+91-98111-99882)', receiverId: 'P004', duration: '1m 15s', cellTower: 'Murthal Toll Sector 12', callType: 'VOICE', isBurst: true },
  { id: 'CDR-8804', timestamp: '2026-01-14 22:28', caller: 'Vikram S. (+91-98102-99812)', callerId: 'P002', receiver: 'Rahul Sharma (+91-98111-44321)', receiverId: 'P003', duration: '0m 45s', cellTower: 'Kundli Highway Substation', callType: 'SMS', isBurst: true },
  { id: 'CDR-8805', timestamp: '2026-01-14 22:36', caller: 'Devraj Anand (+91-98200-11223)', receiver: 'Vikram S. (+91-98102-99812)', callerId: 'P001', receiverId: 'P002', duration: '3m 10s', cellTower: 'Barakhamba Road Delhi', callType: 'VOICE', isBurst: true },
  { id: 'CDR-8806', timestamp: '2026-01-14 22:45', caller: 'Vikram S. (+91-98102-99812)', callerId: 'P002', receiver: 'Rahul Sharma (+91-98111-44321)', receiverId: 'P003', duration: '1m 02s', cellTower: 'NH44 Kundli Sector 38', callType: 'VOICE', isBurst: true },
  { id: 'CDR-8807', timestamp: '2026-01-14 22:52', caller: 'Rahul Sharma (+91-98111-44321)', callerId: 'P003', receiver: 'Vikram S. (+91-98102-99812)', receiverId: 'P002', duration: '0m 38s', cellTower: 'Murthal Toll North Gate', callType: 'VOICE', isBurst: true },
  { id: 'CDR-8808', timestamp: '2026-01-14 22:58', caller: 'Vikram S. (+91-98102-99812)', callerId: 'P002', receiver: 'Devraj Anand (+91-98200-11223)', receiverId: 'P001', duration: '0m 55s', cellTower: 'NH44 Kundli Sector 38', callType: 'VOICE', isBurst: true },
  { id: 'CDR-8809', timestamp: '2026-01-14 14:15', caller: 'Devraj Anand (+91-98200-11223)', callerId: 'P001', receiver: 'Sunil Mehta (+91-98222-33441)', receiverId: 'P005', duration: '5m 40s', cellTower: 'Connaught Place Central', callType: 'VOICE', isBurst: false },
  { id: 'CDR-8810', timestamp: '2026-01-13 18:30', caller: 'Vikram S. (+91-98102-99812)', callerId: 'P002', receiver: 'Sunil Mehta (+91-98222-33441)', receiverId: 'P005', duration: '2m 15s', cellTower: 'Aerocity Sector 2', callType: 'VOICE', isBurst: false }
];

export const CommunicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedLeadForProvenance } = useInvestigation();
  const [filterBurstOnly, setFilterBurstOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCDRs = SAMPLE_CDRS.filter(cdr => {
    if (filterBurstOnly && !cdr.isBurst) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        cdr.id.toLowerCase().includes(q) ||
        cdr.caller.toLowerCase().includes(q) ||
        cdr.receiver.toLowerCase().includes(q) ||
        cdr.cellTower.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 font-mono text-xs text-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-cyan-400 uppercase tracking-wider font-semibold">
            <PhoneCall className="h-4 w-4" />
            Telecommunications Intelligence (DoT CDR Batch 01 & 02)
          </div>
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-100 font-sans mt-1">
            Communications & CDR Burst Analysis
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Temporal call density analysis, cell tower telemetry, and algorithmic burst detection preceding convoy transit.
          </p>
        </div>

        <button
          onClick={() => navigate('/leads')}
          className="flex items-center gap-2 rounded bg-cyan-600 px-4 py-2 font-semibold text-white hover:bg-cyan-500 shadow-xs shrink-0"
        >
          <span>Correlated Analytical Leads</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* DETECTED BURST ALERT BANNER */}
      <div className="rounded border border-amber-900/80 bg-amber-950/20 p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-900/50 pb-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping"></span>
            <span className="font-bold text-amber-300 uppercase text-xs">
              Algorithmic Burst Detected: 8 Calls Between 22:04 and 22:58 (14 Jan 2026)
            </span>
          </div>
          <span className="text-[10px] text-slate-400">Preceding Highway Dispatch by 32 minutes</span>
        </div>

        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          Anomalous telecommunications surge identified between broker <strong className="text-cyan-300 font-mono">Vikram S. (P002)</strong>, fleet escort <strong className="text-cyan-300 font-mono">Rahul Sharma (P003)</strong>, and financier <strong className="text-cyan-300 font-mono">Devraj Anand (P001)</strong>. Cell tower telemetry places P002 and P003 within 4.2 km of the Kundli NH44 expressway staging depot.
        </p>

        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={() => setFilterBurstOnly(true)}
            className="rounded bg-amber-900/60 border border-amber-700/80 px-3 py-1.5 text-xs text-amber-200 hover:bg-amber-800"
          >
            Filter Burst Telemetry Only ({SAMPLE_CDRS.filter(c => c.isBurst).length} Records)
          </button>
        </div>
      </div>

      {/* Calls Over Time SVG Histogram */}
      <div className="rounded border border-slate-800 bg-[#0a1224] p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-bold uppercase text-slate-200">
            Temporal Call Volume Density (Hourly Distribution · 14 Jan 2026)
          </span>
          <span className="text-[10px] text-rose-400 font-bold">Surge Peak: 22:00 - 23:00</span>
        </div>

        <div className="pt-2 h-40 flex items-end justify-between gap-2 px-4">
          {[
            { hour: '18:00', calls: 1, burst: false },
            { hour: '19:00', calls: 0, burst: false },
            { hour: '20:00', calls: 2, burst: false },
            { hour: '21:00', calls: 1, burst: false },
            { hour: '22:00', calls: 8, burst: true },
            { hour: '23:00', calls: 3, burst: false },
            { hour: '00:00', calls: 1, burst: false },
            { hour: '01:00', calls: 0, burst: false }
          ].map(bar => (
            <div key={bar.hour} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
              <span className={`text-[10px] font-bold ${bar.burst ? 'text-amber-400' : 'text-slate-500'}`}>
                {bar.calls > 0 ? `${bar.calls}` : ''}
              </span>
              <div
                className={`w-full rounded-t transition-all ${
                  bar.burst
                    ? 'bg-amber-500 hover:bg-amber-400'
                    : bar.calls > 0
                    ? 'bg-cyan-700 hover:bg-cyan-600'
                    : 'bg-slate-800/40'
                }`}
                style={{ height: `${Math.max(4, bar.calls * 12)}%` }}
              />
              <span className="text-[9px] text-slate-400">{bar.hour}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CDR Table */}
      <div className="rounded border border-slate-800 bg-[#091122] overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-[#0d162d] text-[10px] uppercase tracking-wider text-slate-400">
              <th className="py-3 px-4">CDR ID</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Caller (Origin)</th>
              <th className="py-3 px-4">Receiver (Target)</th>
              <th className="py-3 px-4">Duration</th>
              <th className="py-3 px-4">Cell Tower Azimuth</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4 text-right">Flag</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredCDRs.map(cdr => (
              <tr
                key={cdr.id}
                className={`hover:bg-[#0e1933] ${cdr.isBurst ? 'bg-amber-950/15' : ''}`}
              >
                <td className="py-3 px-4 font-bold text-cyan-400">{cdr.id}</td>
                <td className="py-3 px-4 text-slate-300 whitespace-nowrap">{cdr.timestamp}</td>
                <td className="py-3 px-4 font-semibold text-slate-200">{cdr.caller}</td>
                <td className="py-3 px-4 font-semibold text-slate-200">{cdr.receiver}</td>
                <td className="py-3 px-4 text-slate-400">{cdr.duration}</td>
                <td className="py-3 px-4 text-slate-300 text-[11px]">{cdr.cellTower}</td>
                <td className="py-3 px-4">
                  <span className="rounded border border-slate-700 bg-slate-850 px-1.5 py-0.2 text-[10px] text-slate-300">
                    {cdr.callType}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  {cdr.isBurst ? (
                    <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-1.5 py-0.2 rounded font-bold">
                      BURST EVENT
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-600">ROUTINE</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
