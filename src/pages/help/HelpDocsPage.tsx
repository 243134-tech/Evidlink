import React from 'react';
import { HelpCircle, BookOpen, ShieldCheck, Play, ArrowRight, Activity, GitMerge } from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';

export const HelpDocsPage: React.FC = () => {
  const { setIsGuidedDemoOpen } = useInvestigation();

  return (
    <div className="space-y-6 font-mono text-xs text-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-cyan-400 uppercase tracking-wider font-semibold">
            <HelpCircle className="h-4 w-4" />
            Investigator Manual & Evaluation Guide
          </div>
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-100 font-sans mt-1">
            Documentation & System Architecture
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Operational guide to topological betweenness analysis, entity disambiguation, and explainable AI lead verification.
          </p>
        </div>

        <button
          onClick={() => setIsGuidedDemoOpen(true)}
          className="flex items-center gap-2 rounded bg-cyan-600 px-4 py-2 font-semibold text-white hover:bg-cyan-500 shadow-xs shrink-0"
        >
          <Play className="h-4 w-4 fill-white" />
          <span>Launch 13-Scene Evaluation Tour</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Betweenness Centrality */}
        <div className="rounded border border-slate-800 bg-[#0a1224] p-5 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold uppercase text-xs border-b border-slate-800 pb-2">
            <Activity className="h-4 w-4" />
            <span>Why Betweenness Centrality Identifies Hidden Kingpins</span>
          </div>
          <p className="text-slate-300 font-sans leading-relaxed text-xs">
            In covert criminal syndicates, coordinators avoid high degree centrality (direct call volume) to evade threshold alerts. However, because they must mediate between field operatives (truck drivers, smugglers) and financial sponsors (shell companies), they sit on the shortest topological communication paths between clusters.
          </p>
          <div className="text-[11px] text-slate-400 font-mono bg-slate-900/80 p-2.5 rounded border border-slate-800">
            Formula: C_B(v) = Σ (σ_st(v) / σ_st) across all pairs (s, t)
          </div>
        </div>

        {/* Section 2: Entity Resolution */}
        <div className="rounded border border-slate-800 bg-[#0a1224] p-5 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-xs border-b border-slate-800 pb-2">
            <GitMerge className="h-4 w-4" />
            <span>Entity Disambiguation Methodology</span>
          </div>
          <p className="text-slate-300 font-sans leading-relaxed text-xs">
            EVIDLINK calculates a multi-signal identity overlap score combining: (1) Deterministic hardware and MSISDN matches (100% weight on exact match); (2) Phonetic name distance (Double Metaphone + Jaro-Winkler); and (3) Co-location temporal overlap.
          </p>
          <div className="text-[11px] text-slate-400 font-mono bg-slate-900/80 p-2.5 rounded border border-slate-800">
            Composite Score = (w_phone · S_phone) + (w_name · S_name) + (w_geo · S_geo)
          </div>
        </div>

        {/* Section 3: Responsible Use Principles */}
        <div className="rounded border border-slate-800 bg-[#0a1224] p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-xs border-b border-slate-800 pb-2">
            <ShieldCheck className="h-4 w-4" />
            <span>Explainable AI & Human-in-the-Loop Safeguards</span>
          </div>
          <p className="text-slate-300 font-sans leading-relaxed text-xs">
            No algorithmic finding in EVIDLINK is autonomous. Every lead requires manual review, carries an explicit provenance audit trail citing the source documents, and features non-guilt caveats reminding investigators that statistical correlation is not proof of culpability.
          </p>
        </div>

        {/* Section 4: Quick Navigation Guide */}
        <div className="rounded border border-slate-800 bg-[#0a1224] p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase text-xs border-b border-slate-800 pb-2">
            <BookOpen className="h-4 w-4" />
            <span>Core Workspace Shortcuts</span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between p-1.5 rounded bg-slate-900/60">
              <span className="text-slate-300">Global Command Palette</span>
              <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-mono">⌘K / Ctrl+K</kbd>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded bg-slate-900/60">
              <span className="text-slate-300">Launch Guided Evaluation</span>
              <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-mono">Top Bar Button</kbd>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded bg-slate-900/60">
              <span className="text-slate-300">Simulate Evidence Ingest</span>
              <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-mono">Upload Button</kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
