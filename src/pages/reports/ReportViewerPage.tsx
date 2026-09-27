import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Printer, ChevronLeft, ShieldCheck, Download, ExternalLink } from 'lucide-react';
import { entityService } from '../../services/entityService';
import { evidenceService } from '../../services/evidenceService';
import { analysisService } from '../../services/analysisService';

export const ReportViewerPage: React.FC = () => {
  const navigate = useNavigate();
  const allEntities = entityService.getAll();
  const allEvidence = evidenceService.getAll();
  const allLeads = analysisService.getAllLeads();

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-mono text-xs text-slate-200">
      {/* Top action bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 no-print">
        <button
          onClick={() => navigate('/reports')}
          className="flex items-center gap-1.5 text-cyan-400 hover:underline text-[11px]"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>Back to Case Reports</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded bg-cyan-600 px-4 py-2 font-semibold text-white hover:bg-cyan-500 shadow-xs"
          >
            <Printer className="h-4 w-4" />
            <span>Print Official Brief</span>
          </button>
        </div>
      </div>

      {/* Official Intelligence Brief Document Canvas */}
      <div className="rounded border border-slate-700 bg-[#070d1a] p-8 sm:p-12 space-y-8 shadow-2xl text-slate-200 print:border-none print:p-0 print:bg-white print:text-black">
        {/* Classification Header Banner */}
        <div className="border-b-2 border-red-800 pb-4 text-center space-y-1">
          <div className="text-red-500 font-bold uppercase tracking-widest text-xs">
            CONFIDENTIAL // LAW ENFORCEMENT INTELLIGENCE USE ONLY
          </div>
          <div className="text-[10px] text-slate-400">
            HANDLING RESTRICTIONS: DO NOT DISSEMINATE OUTSIDE AUTHORIZED TASK FORCE CHANNELS
          </div>
        </div>

        {/* Document Title & Meta */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="text-[11px] text-cyan-400 uppercase tracking-wider font-bold">
              SPECIAL INVESTIGATION INTELLIGENCE DOSSIER · BRIEF-2026-001
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-slate-100 font-sans mt-1">
              Operation Iron Highway: Interstate Network & Financial Funnels
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Subject: Topological Analysis of Transporter Fleet and Shell Holding Escrows
            </p>
          </div>

          <div className="text-right space-y-1 text-[11px] shrink-0 font-mono">
            <div>Case ID: <strong className="text-slate-100">INV-2026-0881</strong></div>
            <div>Date of Dispatch: <strong className="text-slate-100">15 January 2026</strong></div>
            <div>Authorizing Officer: <strong className="text-slate-100">Inspector R. K. Raman</strong></div>
            <div>Agency: <strong className="text-cyan-300">Special Crime Wing (CID)</strong></div>
          </div>
        </div>

        {/* 1. Executive Summary */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 border-b border-slate-800 pb-1">
            1. Executive Summary
          </h2>
          <p className="text-xs font-sans leading-relaxed text-slate-300">
            Automated graph network analysis has resolved an organized interstate syndicate operating across physical logistics and shell corporate holdings. While the transport fleet (Cluster Alpha) and the corporate financiers (Cluster Beta) maintain strict operational compartmentalization with zero direct linkages, graph theory algorithms identified <strong>Vikram S. / V. Sharma (Entity P002)</strong> as the critical topological bridge with a betweenness centrality score of 98/100.
          </p>
          <p className="text-xs font-sans leading-relaxed text-slate-300">
            Corroborating evidentiary streams include: (a) an 8-call telecom burst 32 minutes prior to transit; (b) a ₹1.45 Crore RTGS wire transfer completely funneled within 23 minutes through an escrow conduit; and (c) synchronized dual-toll ANPR highway camera crossings confirming Scorpio escort behavior.
          </p>
        </div>

        {/* 2. Key Identified Entities & Structural Roles */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 border-b border-slate-800 pb-1">
            2. Identified Key Entities & Roles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {allEntities.slice(0, 6).map(ent => (
              <div key={ent.id} className="p-3 rounded border border-slate-800 bg-[#091122] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100">{ent.name}</span>
                  <span className="text-[10px] text-cyan-400 font-mono">{ent.id}</span>
                </div>
                <div className="text-[10px] text-slate-400">Type: {ent.type} · Cluster: {ent.communityId}</div>
                <p className="text-[11px] text-slate-300 font-sans leading-relaxed">{ent.summary}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. High-Confidence Analytical Leads */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 border-b border-slate-800 pb-1">
            3. Algorithmic Lead Findings & Key Signals
          </h2>
          <div className="space-y-3">
            {allLeads.slice(0, 3).map(lead => (
              <div key={lead.id} className="p-3.5 rounded border border-slate-800 bg-[#091122] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 text-xs">{lead.id}: {lead.title}</span>
                  <span className="text-emerald-400 font-bold text-xs">{lead.confidence}% Confidence</span>
                </div>
                <p className="text-xs text-slate-300 font-sans">{lead.explanation}</p>
                <div className="text-[10px] text-slate-400">
                  Signals: {lead.keySignals.join(' · ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Evidentiary Chain of Custody Index */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 border-b border-slate-800 pb-1">
            4. Evidentiary Index & Custodial Authentication
          </h2>
          <div className="rounded border border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-[10px] uppercase text-slate-400">
                  <th className="py-2 px-3">Evidence ID</th>
                  <th className="py-2 px-3">Description</th>
                  <th className="py-2 px-3">Agency Source</th>
                  <th className="py-2 px-3">Custody ID</th>
                  <th className="py-2 px-3 text-right">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {allEvidence.map(ev => (
                  <tr key={ev.id}>
                    <td className="py-2 px-3 font-bold text-cyan-400">{ev.id}</td>
                    <td className="py-2 px-3 text-slate-200">{ev.title}</td>
                    <td className="py-2 px-3 text-slate-400">{ev.provenance.sourceAgency}</td>
                    <td className="py-2 px-3 text-slate-400 font-mono text-[10px]">{ev.provenance.chainOfCustodyId}</td>
                    <td className="py-2 px-3 text-right text-emerald-400 font-bold">{ev.confidence}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Legal Safeguard & Non-Guilt Notice */}
        <div className="p-4 rounded border border-amber-900/60 bg-amber-950/20 text-[11px] font-sans text-slate-300 space-y-1">
          <div className="font-bold text-amber-300 font-mono uppercase text-xs flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" />
            <span>Evidentiary & Procedural Caveat</span>
          </div>
          <p className="leading-relaxed">
            This dossier contains analytical decision-support intelligence derived from multi-source algorithmic pattern detection. In accordance with judicial evidence procedures, all analytical inferences must be independently corroborated through certified Section 65B Indian Evidence Act certificates for telecommunications, judicial bank mandates, and forensic seizure protocols prior to submission in court proceedings.
          </p>
        </div>

        {/* Signature & Authentication Stamp */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-end gap-6 text-[11px]">
          <div>
            <div className="text-slate-500">DIGITAL AUDIT DIGEST</div>
            <div className="text-cyan-400 font-mono text-[10px]">
              SHA256: 4c9a810bfa9321ef9a40e1189c4501ba7b2c019d8804e1
            </div>
          </div>

          <div className="text-right space-y-1">
            <div className="text-slate-300 font-bold">Inspector R. K. Raman</div>
            <div className="text-slate-500">Superintendent / Special Investigations</div>
            <div className="text-[10px] text-emerald-400 font-mono font-bold">VERIFIED AND SEALED</div>
          </div>
        </div>
      </div>
    </div>
  );
};
