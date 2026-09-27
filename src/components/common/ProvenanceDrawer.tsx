import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Drawer } from './Drawer';
import { useInvestigation } from '../../context/InvestigationContext';
import { entityService } from '../../services/entityService';
import { evidenceService } from '../../services/evidenceService';
import { relationshipService } from '../../services/relationshipService';
import { LeadPriorityBadge, EntityTypeBadge } from './Badge';
import { ArrowDown, ExternalLink, ShieldCheck, Database, GitCommit, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

export const ProvenanceDrawer: React.FC = () => {
  const { selectedLeadForProvenance, setSelectedLeadForProvenance } = useInvestigation();
  const navigate = useNavigate();

  if (!selectedLeadForProvenance) return null;

  const lead = selectedLeadForProvenance;
  const relatedEntities = lead.relatedEntityIds.map(id => entityService.getById(id)).filter(Boolean);
  const supportingEvidence = lead.supportingEvidenceIds.map(id => evidenceService.getById(id)).filter(Boolean);
  const relatedRelationships = lead.relatedRelationshipIds.map(id => relationshipService.getById(id)).filter(Boolean);

  const handleNavigateEntity = (id: string) => {
    setSelectedLeadForProvenance(null);
    navigate(`/entities/${id}`);
  };

  const handleNavigateEvidence = (id: string) => {
    setSelectedLeadForProvenance(null);
    navigate(`/evidence/${id}`);
  };

  return (
    <Drawer
      isOpen={!!selectedLeadForProvenance}
      onClose={() => setSelectedLeadForProvenance(null)}
      title="Evidence Provenance & Explainability Trace"
      subtitle={`Traceable audit trail for ${lead.id} (${lead.type})`}
      width="2xl"
    >
      <div className="space-y-6 text-xs font-mono">
        {/* Responsible use note banner */}
        <div className="rounded border border-cyan-900/60 bg-cyan-950/30 p-3 flex items-start gap-2.5">
          <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-300 leading-relaxed">
            <span className="font-semibold text-cyan-300">Explainable Intelligence Model:</span> Every signal in this lead is deterministically verified and linked to forensic chain-of-custody evidence. It does not establish legal guilt; it surfaces objective analytical indicators for human investigator evaluation.
          </p>
        </div>

        {/* STEP 1: LEAD IDENTITY */}
        <div className="rounded border border-slate-800 bg-[#0d162d] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold">{lead.id}</span>
              <LeadPriorityBadge priority={lead.priority} />
            </div>
            <span className="text-[11px] text-slate-400">Confidence: {lead.confidence}%</span>
          </div>

          <h3 className="text-sm font-semibold text-slate-100">{lead.title}</h3>
          <p className="text-slate-300 leading-relaxed font-sans text-xs">{lead.explanation}</p>
        </div>

        {/* FLOW ARROW */}
        <div className="flex items-center justify-center text-cyan-500/70">
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </div>

        {/* STEP 2: KEY SIGNALS DETECTED */}
        <div className="rounded border border-slate-800 bg-[#0d162d] p-4 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold uppercase text-[11px]">
            <CheckCircle className="h-3.5 w-3.5" />
            Stage 1: Algorithmic Key Signals
          </div>
          <ul className="space-y-1.5 pt-1">
            {lead.keySignals.map((signal, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-300">
                <span className="text-cyan-500 font-bold">›</span>
                <span>{signal}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* FLOW ARROW */}
        <div className="flex items-center justify-center text-cyan-500/70">
          <ArrowDown className="h-4 w-4" />
        </div>

        {/* STEP 3: RELATIONSHIPS DERIVED */}
        <div className="rounded border border-slate-800 bg-[#0d162d] p-4 space-y-2">
          <div className="flex items-center gap-2 text-purple-400 font-semibold uppercase text-[11px]">
            <GitCommit className="h-3.5 w-3.5" />
            Stage 2: Supporting Graph Relationships ({relatedRelationships.length})
          </div>
          <div className="space-y-2 pt-1">
            {relatedRelationships.map(rel => rel && (
              <div
                key={rel.id}
                className="p-2.5 rounded border border-slate-800 bg-slate-900/60 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-400 font-bold">{rel.id}</span>
                    <span className="text-slate-200 font-medium">{rel.type}: {rel.label}</span>
                  </div>
                  {rel.details && <p className="text-[11px] text-slate-400 mt-1">{rel.details}</p>}
                </div>
                <span className="text-[11px] text-slate-500 font-mono">Weight: {rel.weight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FLOW ARROW */}
        <div className="flex items-center justify-center text-cyan-500/70">
          <ArrowDown className="h-4 w-4" />
        </div>

        {/* STEP 4: CORRELATED ENTITIES */}
        <div className="rounded border border-slate-800 bg-[#0d162d] p-4 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold uppercase text-[11px]">
            <Database className="h-3.5 w-3.5" />
            Stage 3: Entities Involved ({relatedEntities.length})
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {relatedEntities.map(ent => ent && (
              <div
                key={ent.id}
                onClick={() => handleNavigateEntity(ent.id)}
                className="p-2.5 rounded border border-slate-800 bg-slate-900/60 hover:border-emerald-800 cursor-pointer transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">{ent.id}</span>
                    <span className="text-slate-200 font-semibold group-hover:text-emerald-300">{ent.name}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <EntityTypeBadge type={ent.type} />
                    {ent.isBridge && (
                      <span className="text-[9px] bg-rose-950 text-rose-300 border border-rose-800 px-1 py-0.2 rounded font-mono">
                        BRIDGE
                      </span>
                    )}
                  </div>
                </div>
                <ExternalLink className="h-3 w-3 text-slate-500 group-hover:text-emerald-400" />
              </div>
            ))}
          </div>
        </div>

        {/* FLOW ARROW */}
        <div className="flex items-center justify-center text-cyan-500/70">
          <ArrowDown className="h-4 w-4" />
        </div>

        {/* STEP 5: ORIGINAL CHAIN OF CUSTODY EVIDENCE */}
        <div className="rounded border border-slate-800 bg-[#0d162d] p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-semibold uppercase text-[11px]">
            <FileText className="h-3.5 w-3.5" />
            Stage 4: Ground Truth Synthetic Evidence Records ({supportingEvidence.length})
          </div>
          <div className="space-y-2 pt-1">
            {supportingEvidence.map(ev => ev && (
              <div
                key={ev.id}
                onClick={() => handleNavigateEvidence(ev.id)}
                className="p-3 rounded border border-slate-800 bg-slate-900/60 hover:border-amber-700/80 cursor-pointer transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">{ev.id}</span>
                    <span className="text-slate-200 font-medium group-hover:text-amber-300">{ev.title}</span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-amber-400" />
                </div>
                <div className="mt-2 text-[11px] text-slate-400 space-y-1">
                  <p><span className="text-slate-500">Source Agency:</span> {ev.provenance.sourceAgency} ({ev.provenance.intakeChannel})</p>
                  <p><span className="text-slate-500">Chain of Custody ID:</span> {ev.provenance.chainOfCustodyId} · Verified by {ev.provenance.verifiedBy}</p>
                  <p className="text-slate-300 bg-slate-950/70 p-1.5 rounded border border-slate-800/80 mt-1.5 font-sans italic">
                    "{ev.extractedSnippet || ev.rawContent.slice(0, 140) + '...'}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => setSelectedLeadForProvenance(null)}
            className="rounded border border-slate-700 bg-slate-800 px-4 py-2 text-slate-200 hover:bg-slate-700 font-mono text-xs"
          >
            Close Provenance Trace
          </button>
        </div>
      </div>
    </Drawer>
  );
};
