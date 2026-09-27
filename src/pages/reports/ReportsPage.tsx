import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileCheck, Printer, Download, ShieldCheck, ArrowRight, ExternalLink, Calendar } from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';

export const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentInvestigation, showToast } = useInvestigation();

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-mono text-xs text-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-cyan-400 uppercase tracking-wider font-semibold">
            <FileCheck className="h-4 w-4" />
            Official Intelligence & Evidentiary Briefs
          </div>
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-100 font-sans mt-1">
            Case Reports & Executive Dossiers
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Court-ready investigative briefs, topology summaries, evidentiary cross-references, and chain of custody indexes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 rounded border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Dossier</span>
          </button>
          <button
            onClick={() => navigate('/reports/view')}
            className="flex items-center gap-1.5 rounded bg-cyan-600 px-4 py-2 text-xs font-semibold text-white hover:bg-cyan-500 shadow-xs"
          >
            <span>Open Interactive Brief</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Available Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Report 1: Comprehensive Network Brief */}
        <div className="rounded border border-cyan-800/80 bg-[#0a1224] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-cyan-400 font-bold text-sm">DOC-INV-BRIEF-2026-001</span>
              <h3 className="font-bold text-slate-100 text-base mt-0.5">
                Executive Case Brief: Interstate Transport & Financial Conduits
              </h3>
            </div>
            <span className="rounded border border-cyan-800 bg-cyan-950/60 px-2 py-0.5 text-[10px] text-cyan-300 font-bold">
              FINAL v1.4
            </span>
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Consolidated 6-page investigative summary detailing the bridge coordination role of Vikram S. (P002), 8-call pre-transit CDR burst, ₹1.45 Cr rapid pass-through escrow conduit, and dual-toll ANPR convoy sightings.
          </p>

          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
            <div>Case Code: <strong className="text-slate-200 font-mono">INV-2026-0881</strong></div>
            <div>Classification: <strong className="text-amber-400 font-mono">CONFIDENTIAL // LAW ENFORCEMENT</strong></div>
            <div>Generated: <strong className="text-slate-200">15 Jan 2026 09:30 IST</strong></div>
            <div>Signoff: <strong className="text-slate-200">Inspector R. K. Raman</strong></div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => navigate('/reports/view')}
              className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>View Court-Ready Brief</span>
              <ExternalLink className="h-3 w-3" />
            </button>
            <span className="text-[10px] text-slate-500">6 Pages · 7 Figures</span>
          </div>
        </div>

        {/* Report 2: Financial Layering Special Addendum */}
        <div className="rounded border border-slate-800 bg-[#0a1224] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-rose-400 font-bold text-sm">DOC-FIN-ADDENDUM-99</span>
              <h3 className="font-bold text-slate-100 text-base mt-0.5">
                Special Addendum: 23-Minute Pass-Through Wire Flow
              </h3>
            </div>
            <span className="rounded border border-rose-800 bg-rose-950/60 px-2 py-0.5 text-[10px] text-rose-300 font-bold">
              ADDENDUM
            </span>
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Forensic transaction breakdown documenting RTGS settlements through ICICI Bank Barakhamba account into transport logistics dispersal accounts.
          </p>

          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
            <div>Case Code: <strong className="text-slate-200 font-mono">INV-2026-0881</strong></div>
            <div>Classification: <strong className="text-rose-400 font-mono">RESTRICTED // FIU-IND</strong></div>
            <div>Generated: <strong className="text-slate-200">15 Jan 2026 11:15 IST</strong></div>
            <div>Signoff: <strong className="text-slate-200">Special Auditor S. Sen</strong></div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => navigate('/reports/view')}
              className="text-rose-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>View Financial Addendum</span>
              <ExternalLink className="h-3 w-3" />
            </button>
            <span className="text-[10px] text-slate-500">3 Pages · Flow Charts</span>
          </div>
        </div>
      </div>
    </div>
  );
};
