import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight, Database, Cpu, GitMerge, Network, Activity, FileCheck2 } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#060a17] text-slate-100 font-mono text-xs antialiased">
      {/* Header */}
      <header className="border-b border-slate-800 bg-[#070d1e] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-cyan-400" />
            <span className="text-base font-bold text-slate-100 uppercase">EVIDLINK</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-slate-400 hover:text-slate-200">Home</Link>
            <Link to="/about" className="text-slate-400 hover:text-slate-200">About</Link>
            <Link to="/login" className="rounded bg-cyan-600 px-3 py-1.5 text-white font-semibold hover:bg-cyan-500">
              Console
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-cyan-400 font-semibold mb-1">
            System Architecture
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase text-slate-100">
            How EVIDLINK Connects The Dots
          </h1>
          <p className="mt-3 text-sm font-sans text-slate-300 leading-relaxed">
            The platform executes a rigorous, traceable 6-stage data processing lifecycle that converts heterogeneous evidence inputs into an explainable investigation graph.
          </p>
        </div>

        {/* 6 STAGES DETAIL */}
        <div className="space-y-6">
          <div className="rounded border border-slate-800 bg-[#0b1329] p-5 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-sm">
              <Database className="h-4 w-4" />
              Stage 1: Multi-Modal Evidence Ingestion
            </div>
            <p className="text-xs font-sans text-slate-300 leading-relaxed">
              Files are accepted in standard investigative formats: PDF police reports, CSV telecommunications records, JSON bank statements, and ANPR images. Each document is cryptographically hashed (SHA-256) and stamped with intake agency chain-of-custody tags.
            </p>
          </div>

          <div className="rounded border border-slate-800 bg-[#0b1329] p-5 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-bold uppercase text-sm">
              <Cpu className="h-4 w-4" />
              Stage 2: Deterministic Entity & Relationship Extraction
            </div>
            <p className="text-xs font-sans text-slate-300 leading-relaxed">
              Natural Language Processing extracts typed entities: Persons, Vehicles, Locations, Bank Accounts, Organizations, and Phone Hardware. Relationships are inferred with confidence scores, weights, and temporal intervals.
            </p>
          </div>

          <div className="rounded border border-slate-800 bg-[#0b1329] p-5 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-sm">
              <GitMerge className="h-4 w-4" />
              Stage 3: Multi-Signal Entity Resolution
            </div>
            <p className="text-xs font-sans text-slate-300 leading-relaxed">
              When syntactic variations appear ("Rahul Sharma" vs "R. Sharma"), the engine cross-references phone prefixes, co-location logs, and employer associations to compute a match probability. High-probability candidates are surfaced for human analyst review.
            </p>
          </div>

          <div className="rounded border border-slate-800 bg-[#0b1329] p-5 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold uppercase text-sm">
              <Network className="h-4 w-4" />
              Stage 4: Unified Topological Graph Compilation
            </div>
            <p className="text-xs font-sans text-slate-300 leading-relaxed">
              Entities become graph nodes and relationships become weighted directed edges. Cross-cluster connections are flagged for immediate visual salience, laying out logistical networks on one flank and financial entities on the other.
            </p>
          </div>

          <div className="rounded border border-slate-800 bg-[#0b1329] p-5 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold uppercase text-sm">
              <Activity className="h-4 w-4" />
              Stage 5: Centrality & Pattern Analytics
            </div>
            <p className="text-xs font-sans text-slate-300 leading-relaxed">
              Betweenness centrality algorithms isolate hidden structural bridges. Temporal algorithms detect communication bursts immediately preceding highway vehicle movement. Financial algorithms isolate pass-through accounts with sub-30 minute dwell time.
            </p>
          </div>

          <div className="rounded border border-slate-800 bg-[#0b1329] p-5 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase text-sm">
              <FileCheck2 className="h-4 w-4" />
              Stage 6: Traceable Explainability & Dossier Generation
            </div>
            <p className="text-xs font-sans text-slate-300 leading-relaxed">
              Every lead includes a dedicated "Why This Lead?" drawer showing the exact decomposition: Lead → Key Signals → Relationships → Entities → Source Case Evidence. The entire case can be compiled into a courtroom-ready PDF/dossier.
            </p>
          </div>
        </div>

        <div className="pt-4 flex justify-between items-center border-t border-slate-800">
          <Link to="/about" className="text-slate-400 hover:text-slate-200">
            ← About Overview
          </Link>
          <Link
            to="/responsible-use"
            className="flex items-center gap-2 rounded bg-cyan-600 px-4 py-2 text-white font-semibold hover:bg-cyan-500"
          >
            <span>Responsible Use Principles</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
