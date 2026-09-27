import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight, CheckCircle2, FileText, Database, Network } from 'lucide-react';

export const AboutPage: React.FC = () => {
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
            <Link to="/how-it-works" className="text-slate-400 hover:text-slate-200">How It Works</Link>
            <Link to="/login" className="rounded bg-cyan-600 px-3 py-1.5 text-white font-semibold hover:bg-cyan-500">
              Console
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-cyan-400 font-semibold mb-1">
            System Overview & Mission
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase text-slate-100">
            About EVIDLINK Investigative Intelligence
          </h1>
          <p className="mt-3 text-sm font-sans text-slate-300 leading-relaxed">
            EVIDLINK is an AI-powered criminal network analysis and investigative decision-support platform engineered specifically for law enforcement analysts, anti-narcotics task forces, economic offences wings, and intelligence bureaus.
          </p>
        </div>

        <div className="rounded border border-slate-800 bg-[#0b1329] p-6 space-y-4 font-sans text-sm text-slate-300 leading-relaxed">
          <h2 className="text-base font-bold font-mono uppercase text-slate-100">The Problem EVIDLINK Solves</h2>
          <p>
            Modern organized crime and multi-jurisdictional financial fraud operate across distinct domains. Transporters rarely hold direct banking linkages to the financiers; instead, transactions and logistics are handled through layered shell entities, rapid-dwell intermediate accounts, and clandestine phone lines.
          </p>
          <p>
            Traditional investigative techniques struggle because each department holds only an isolated piece of the puzzle:
          </p>
          <ul className="space-y-2 pt-1 font-mono text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <span className="text-cyan-400">›</span>
              <strong>Police Stations:</strong> Local First Information Reports (FIRs) and physical driver statements.
            </li>
            <li className="flex items-center gap-2">
              <span className="text-cyan-400">›</span>
              <strong>Telecom Units:</strong> Bulk Call Detail Records (CDRs), tower IDs, and IMEI hardware tags.
            </li>
            <li className="flex items-center gap-2">
              <span className="text-cyan-400">›</span>
              <strong>Financial Units:</strong> Bank account statements, RTGS logs, and suspicious transaction reports.
            </li>
            <li className="flex items-center gap-2">
              <span className="text-cyan-400">›</span>
              <strong>Transport Desks:</strong> Automated Number Plate Recognition (ANPR) and FASTag highway toll receipts.
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded border border-slate-800 bg-[#091122] p-4 space-y-2">
            <div className="text-cyan-400 font-bold uppercase text-xs">Deterministic Traceability</div>
            <p className="text-xs font-sans text-slate-300 leading-relaxed">
              Every connection in the graph is backed by a cryptographic chain-of-custody reference to ensure courtroom admissibility.
            </p>
          </div>
          <div className="rounded border border-slate-800 bg-[#091122] p-4 space-y-2">
            <div className="text-amber-400 font-bold uppercase text-xs">Graph Topology Math</div>
            <p className="text-xs font-sans text-slate-300 leading-relaxed">
              Betweenness centrality and community modularity expose the covert bridge brokers that human analysis misses.
            </p>
          </div>
          <div className="rounded border border-slate-800 bg-[#091122] p-4 space-y-2">
            <div className="text-emerald-400 font-bold uppercase text-xs">Human-in-the-Loop</div>
            <p className="text-xs font-sans text-slate-300 leading-relaxed">
              Analytical results strictly serve as leads for investigator validation. The system never automates accusations or verdicts.
            </p>
          </div>
        </div>

        <div className="pt-4 flex justify-between items-center border-t border-slate-800">
          <Link to="/" className="text-slate-400 hover:text-slate-200">
            ← Back to Overview
          </Link>
          <Link
            to="/how-it-works"
            className="flex items-center gap-2 rounded bg-cyan-600 px-4 py-2 text-white font-semibold hover:bg-cyan-500"
          >
            <span>Explore Technical Architecture</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
