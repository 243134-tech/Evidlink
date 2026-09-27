import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coins, AlertTriangle, ArrowRight, ArrowDownRight, ShieldCheck, Clock, Building, ExternalLink } from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';

interface Transaction {
  id: string;
  timestamp: string;
  sourceAccount: string;
  sourceBank: string;
  sourceHolder: string;
  targetAccount: string;
  targetBank: string;
  targetHolder: string;
  amount: string;
  amountRaw: number;
  dwellMinutes: number;
  narration: string;
  isRapidPassThrough: boolean;
}

const SAMPLE_TXS: Transaction[] = [
  {
    id: 'TXN-RTGS-9901',
    timestamp: '2026-01-13 14:10',
    sourceAccount: 'AC-HDFC-9921',
    sourceBank: 'HDFC Bank Fort Branch',
    sourceHolder: 'Apex Global Trading (P006)',
    targetAccount: 'AC-ICICI-3340',
    targetBank: 'ICICI Bank Barakhamba',
    targetHolder: 'V. S. Advisory Escrow (P002)',
    amount: '₹ 1,45,00,000',
    amountRaw: 14500000,
    dwellMinutes: 23,
    narration: 'Commercial Consultancy Advance Retainer CF-99',
    isRapidPassThrough: true
  },
  {
    id: 'TXN-RTGS-9902',
    timestamp: '2026-01-13 14:33',
    sourceAccount: 'AC-ICICI-3340',
    sourceBank: 'ICICI Bank Barakhamba',
    sourceHolder: 'V. S. Advisory Escrow (P002)',
    targetAccount: 'AC-AXIS-5512',
    targetBank: 'Axis Bank Karol Bagh',
    targetHolder: 'Golden Horizon Logistics (P008)',
    amount: '₹ 85,00,000',
    amountRaw: 8500000,
    dwellMinutes: 0,
    narration: 'Interstate Fleet Mobilization Tranche 1',
    isRapidPassThrough: true
  },
  {
    id: 'TXN-RTGS-9903',
    timestamp: '2026-01-13 14:38',
    sourceAccount: 'AC-ICICI-3340',
    sourceBank: 'ICICI Bank Barakhamba',
    sourceHolder: 'V. S. Advisory Escrow (P002)',
    targetAccount: 'AC-SBI-7788',
    targetBank: 'SBI Commercial Hub',
    targetHolder: 'Northern Freight Liners (P009)',
    amount: '₹ 60,00,000',
    amountRaw: 6000000,
    dwellMinutes: 0,
    narration: 'Heavy Vehicle Escrow Consignment Security',
    isRapidPassThrough: true
  },
  {
    id: 'TXN-RTGS-9904',
    timestamp: '2026-01-12 11:20',
    sourceAccount: 'AC-HDFC-1120',
    sourceBank: 'HDFC Corporate Mumbai',
    sourceHolder: 'Devraj Anand Private Trust (P001)',
    targetAccount: 'AC-HDFC-9921',
    targetBank: 'HDFC Bank Fort Branch',
    targetHolder: 'Apex Global Trading (P006)',
    amount: '₹ 2,00,00,000',
    amountRaw: 20000000,
    dwellMinutes: 1440,
    narration: 'Capital Infusion Equity Holding Lot A',
    isRapidPassThrough: false
  }
];

export const FinancialFlowsPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedLeadForProvenance } = useInvestigation();
  const [filterPassThroughOnly, setFilterPassThroughOnly] = useState(false);

  const filteredTx = SAMPLE_TXS.filter(t => !filterPassThroughOnly || t.isRapidPassThrough);

  return (
    <div className="space-y-6 font-mono text-xs text-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-rose-400 uppercase tracking-wider font-semibold">
            <Coins className="h-4 w-4" />
            Financial Intelligence & STR Wire Flow
          </div>
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-100 font-sans mt-1">
            Financial Flows & Layering Trail
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Detection of rapid-dwell pass-through accounts, split fund layering, and corporate escrow intermediaries.
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

      {/* DETECTED RAPID PASS-THROUGH ALERT */}
      <div className="rounded border border-rose-900/80 bg-rose-950/20 p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-900/50 pb-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
            <span className="font-bold text-rose-300 uppercase text-xs">
              Algorithmic Conduit Detected: 23-Minute Dwell Pass-Through (AC-ICICI-3340)
            </span>
          </div>
          <span className="text-rose-200 font-bold">Total Funneled: ₹ 1.45 Crore</span>
        </div>

        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          Account <strong className="text-rose-300 font-mono">AC-ICICI-3340 (V. S. Advisory Escrow / Vikram S.)</strong> received ₹1.45 Cr via RTGS at 14:10. Within <strong className="text-rose-400 font-mono">23 minutes</strong> (14:33 & 14:38), 100% of the funds were split and routed directly into two transport company accounts (Golden Horizon & Northern Freight).
        </p>

        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={() => setFilterPassThroughOnly(prev => !prev)}
            className="rounded bg-rose-900/60 border border-rose-700/80 px-3 py-1.5 text-xs text-rose-200 hover:bg-rose-800"
          >
            {filterPassThroughOnly ? 'Show All Transactions' : 'Isolate Rapid Pass-Throughs Only'}
          </button>
        </div>
      </div>

      {/* Visual Money Flow Diagram (Horizontal Multi-Hop Pipeline) */}
      <div className="rounded border border-slate-800 bg-[#0a1224] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-bold uppercase text-slate-200">
            Multi-Hop Flow Architecture (Source Sponsor → Conduit → Fleet Dispersal)
          </span>
          <span className="text-cyan-400 text-[10px]">3-Hop Rapid Funnel Chain</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Hop 1: Origin Sponsor */}
          <div className="p-4 rounded border border-slate-800 bg-slate-900/80 space-y-2">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Stage 1: Source Origin</span>
            <div className="font-bold text-slate-100 text-sm">Devraj Anand / Apex Global</div>
            <div className="text-[11px] text-slate-400">Account: AC-HDFC-9921</div>
            <div className="text-xs text-cyan-400 font-bold pt-1">Outflow: ₹ 1.45 Cr</div>
          </div>

          {/* Hop 2: Rapid Pass-Through Intermediary */}
          <div className="p-4 rounded border border-rose-800 bg-rose-950/40 space-y-2 relative">
            <div className="absolute -top-2.5 right-3 bg-rose-600 text-white text-[9px] font-bold px-2 py-0.5 rounded">
              23 MIN DWELL
            </div>
            <span className="text-[10px] text-rose-300 uppercase tracking-wider block">Stage 2: Conduit Intermediary</span>
            <div className="font-bold text-rose-200 text-sm">V. S. Advisory Escrow (Vikram S.)</div>
            <div className="text-[11px] text-slate-400">Account: AC-ICICI-3340</div>
            <div className="text-xs text-rose-300 font-bold pt-1">In: ₹1.45 Cr → Out: ₹1.45 Cr</div>
          </div>

          {/* Hop 3: Transport Fleet Recipients */}
          <div className="p-4 rounded border border-emerald-900 bg-slate-900/80 space-y-2">
            <span className="text-[10px] text-emerald-400 uppercase tracking-wider block">Stage 3: Fleet Logistics</span>
            <div className="font-bold text-slate-100 text-sm">Golden Horizon & Northern Freight</div>
            <div className="text-[11px] text-slate-400">AC-AXIS-5512 & AC-SBI-7788</div>
            <div className="text-xs text-emerald-400 font-bold pt-1">Split: ₹85 Lakh + ₹60 Lakh</div>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="rounded border border-slate-800 bg-[#091122] overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-[#0d162d] text-[10px] uppercase tracking-wider text-slate-400">
              <th className="py-3 px-4">Transaction ID</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Origin Account & Holder</th>
              <th className="py-3 px-4">Beneficiary Account</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Dwell Time</th>
              <th className="py-3 px-4">Narration</th>
              <th className="py-3 px-4 text-right">Flag</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredTx.map(tx => (
              <tr
                key={tx.id}
                className={`hover:bg-[#0e1933] ${tx.isRapidPassThrough ? 'bg-rose-950/15' : ''}`}
              >
                <td className="py-3 px-4 font-bold text-cyan-400">{tx.id}</td>
                <td className="py-3 px-4 text-slate-300 whitespace-nowrap">{tx.timestamp}</td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-200">{tx.sourceHolder}</div>
                  <div className="text-[10px] text-slate-400">{tx.sourceAccount} · {tx.sourceBank}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-200">{tx.targetHolder}</div>
                  <div className="text-[10px] text-slate-400">{tx.targetAccount} · {tx.targetBank}</div>
                </td>
                <td className="py-3 px-4 font-bold text-slate-100 whitespace-nowrap">{tx.amount}</td>
                <td className="py-3 px-4">
                  {tx.isRapidPassThrough ? (
                    <span className="text-rose-400 font-bold">{tx.dwellMinutes} mins</span>
                  ) : (
                    <span className="text-slate-400">&gt;24 hrs</span>
                  )}
                </td>
                <td className="py-3 px-4 text-slate-400 text-[11px] max-w-xs truncate">{tx.narration}</td>
                <td className="py-3 px-4 text-right">
                  {tx.isRapidPassThrough ? (
                    <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800 px-1.5 py-0.2 rounded font-bold">
                      RAPID CONDUIT
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-600">STANDARD</span>
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
