import React, { useState } from 'react';
import { entityService } from '../../services/entityService';
import { useInvestigation } from '../../context/InvestigationContext';
import {
  GitMerge,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Phone,
  Car,
  FileText,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  RotateCcw
} from 'lucide-react';

export const EntityResolutionPage: React.FC = () => {
  const { showToast } = useInvestigation();
  const [isMerged, setIsMerged] = useState(false);
  const [resolutionStatus, setResolutionStatus] = useState<'PENDING' | 'MERGED' | 'SEPARATED'>('PENDING');

  const handleMerge = () => {
    setIsMerged(true);
    setResolutionStatus('MERGED');
    entityService.mergeEntities(
      'P003',
      'P003_DUP',
      'Unified under primary identity Rahul Sharma with combined CDR telemetry and toll sightings.'
    );
    showToast('Entities Merged: Graph topology updated with combined edges & aliases.');
  };

  const handleSeparate = () => {
    setIsMerged(false);
    setResolutionStatus('SEPARATED');
    showToast('Decision Recorded: Marked as distinct individuals in audit ledger.');
  };

  const handleReset = () => {
    setIsMerged(false);
    setResolutionStatus('PENDING');
    showToast('Disambiguation candidate reset to pending review state.');
  };

  return (
    <div className="space-y-6 font-mono text-xs text-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-cyan-400 uppercase tracking-wider font-semibold">
            <GitMerge className="h-4 w-4" />
            Entity Disambiguation & Identity Resolution
          </div>
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-100 font-sans mt-1">
            Entity Resolution Engine
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Phonetic name matching, identifier overlap, and co-location algorithms to merge aliases across siloed records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {resolutionStatus !== 'PENDING' && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Candidate</span>
            </button>
          )}
        </div>
      </div>

      {/* Match Confidence Alert Banner */}
      <div className={`p-4 rounded border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
        resolutionStatus === 'MERGED'
          ? 'border-emerald-800 bg-emerald-950/30'
          : resolutionStatus === 'SEPARATED'
          ? 'border-slate-700 bg-slate-900/60'
          : 'border-amber-800/80 bg-amber-950/30'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded border flex items-center justify-center font-bold text-sm shrink-0 ${
            resolutionStatus === 'MERGED'
              ? 'border-emerald-700 bg-emerald-900/50 text-emerald-300'
              : 'border-amber-700 bg-amber-900/50 text-amber-300'
          }`}>
            {resolutionStatus === 'MERGED' ? '✓' : '88%'}
          </div>
          <div>
            <div className="text-sm font-bold text-slate-100">
              {resolutionStatus === 'MERGED'
                ? 'Disambiguation Approved: Single Canonical Entity Active'
                : resolutionStatus === 'SEPARATED'
                ? 'Disambiguation Reviewed: Kept as Distinct Independent Persons'
                : 'High-Probability Identity Match Flagged (88% Match Confidence)'}
            </div>
            <p className="text-[11px] text-slate-300 font-sans mt-0.5">
              Candidate pair: <strong className="text-cyan-300 font-mono">Rahul Sharma (P003)</strong> vs <strong className="text-cyan-300 font-mono">R. Sharma (CDR-EXTRACT-09)</strong>
            </p>
          </div>
        </div>

        {resolutionStatus === 'PENDING' && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleSeparate}
              className="flex items-center gap-1.5 rounded border border-slate-700 bg-slate-800/90 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
            >
              <XCircle className="h-3.5 w-3.5" />
              <span>Keep Separate</span>
            </button>
            <button
              onClick={handleMerge}
              className="flex items-center gap-1.5 rounded bg-cyan-600 px-4 py-2 text-xs font-semibold text-white hover:bg-cyan-500 shadow-xs"
            >
              <GitMerge className="h-3.5 w-3.5" />
              <span>Merge Entities</span>
            </button>
          </div>
        )}
      </div>

      {/* Side-by-Side Candidate Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Record A */}
        <div className="rounded border border-slate-800 bg-[#0a1224] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <span className="text-cyan-400 font-bold text-sm">Entity Record A (P003)</span>
              <span className="text-[10px] text-slate-500 block">Source: FIR Report 742/2026</span>
            </div>
            <span className="rounded border border-cyan-800 bg-cyan-950/60 px-2 py-0.5 text-[10px] text-cyan-300">
              Primary Seed
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Name / Alias</span>
              <span className="text-sm font-bold text-slate-100">Rahul Sharma</span>
              <span className="text-[11px] text-slate-400 ml-2">(Alias: "RS")</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Phone MSISDN</span>
              <span className="text-emerald-400 font-mono font-semibold">+91 98111 44321</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Identified Role / Employment</span>
              <span className="text-slate-300">Driver & Logistics Coordinator</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Associated Hardware / Vehicle</span>
              <span className="text-amber-400 font-mono">Mahindra Scorpio (DL-04-TC-8812)</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Geographic Corroboration</span>
              <span className="text-slate-300">Kundli Border NH44 Toll Plaza</span>
            </div>
          </div>
        </div>

        {/* Record B */}
        <div className="rounded border border-slate-800 bg-[#0a1224] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <span className="text-amber-400 font-bold text-sm">Entity Record B (CDR-09)</span>
              <span className="text-[10px] text-slate-500 block">Source: DoT CDR Telecom Batch 01</span>
            </div>
            <span className="rounded border border-amber-800 bg-amber-950/60 px-2 py-0.5 text-[10px] text-amber-300">
              Discovered Intercept
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Name / Alias</span>
              <span className="text-sm font-bold text-slate-100">R. Sharma</span>
              <span className="text-[11px] text-slate-400 ml-2">(Alias: "Sharma Trans")</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Phone MSISDN</span>
              <span className="text-emerald-400 font-mono font-semibold">+91 98111 44321 (100% Match)</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Identified Role / Employment</span>
              <span className="text-slate-300">Fleet operator for Golden Horizon Cargo</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Associated Hardware / Vehicle</span>
              <span className="text-amber-400 font-mono">Scorpio Black (Telemetry Corroborated)</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Geographic Corroboration</span>
              <span className="text-slate-300">NH44 Highway Tower Sector 38</span>
            </div>
          </div>
        </div>
      </div>

      {/* Similarity Scoring Metrics */}
      <div className="rounded border border-slate-800 bg-[#0a1224] p-5 space-y-4">
        <div className="text-xs font-bold uppercase text-slate-200 border-b border-slate-800 pb-2 flex items-center justify-between">
          <span>Multi-Signal Similarity Score Decomposition</span>
          <span className="text-cyan-400">Composite: 88% Match Probability</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3 rounded border border-slate-800 bg-slate-900/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Phone Identifier Match</span>
              <span className="text-emerald-400 font-bold">100%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-full"></div>
            </div>
            <span className="text-[10px] text-slate-500 block mt-1">Exact MSISDN & IMEI tag match</span>
          </div>

          <div className="p-3 rounded border border-slate-800 bg-slate-900/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Phonetic Name Similarity</span>
              <span className="text-cyan-400 font-bold">82%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-500 h-full w-[82%]"></div>
            </div>
            <span className="text-[10px] text-slate-500 block mt-1">Double Metaphone & Jaro-Winkler</span>
          </div>

          <div className="p-3 rounded border border-slate-800 bg-slate-900/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Co-Location Overlap</span>
              <span className="text-cyan-400 font-bold">85%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-500 h-full w-[85%]"></div>
            </div>
            <span className="text-[10px] text-slate-500 block mt-1">NH44 Kundli Cell Tower 23:18</span>
          </div>
        </div>
      </div>

      {/* Merged Resolution Impact Output */}
      {isMerged && (
        <div className="rounded border border-emerald-900/80 bg-emerald-950/20 p-5 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-emerald-300 font-bold uppercase text-xs">
            <CheckCircle2 className="h-4 w-4" />
            Graph Topology Updated Successfully
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div className="p-2.5 rounded bg-slate-900/70 border border-emerald-900/40">
              <span className="text-slate-500 text-[10px] block">Canonical Identifier</span>
              <span className="text-slate-200 font-bold">P003 (Rahul Sharma)</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900/70 border border-emerald-900/40">
              <span className="text-slate-500 text-[10px] block">Combined Graph Edges</span>
              <span className="text-emerald-400 font-bold">+4 Relational Edges Unified</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900/70 border border-emerald-900/40">
              <span className="text-slate-500 text-[10px] block">Forensic Audit Stamp</span>
              <span className="text-slate-300 font-mono text-[10px]">AUTH-AUDIT-MERGE-881</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
