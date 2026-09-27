import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { evidenceService } from '../../services/evidenceService';
import { entityService } from '../../services/entityService';
import { relationshipService } from '../../services/relationshipService';
import { analysisService } from '../../services/analysisService';
import { EvidenceTypeBadge, EntityTypeBadge, LeadPriorityBadge } from '../../components/common/Badge';
import {
  FileText,
  ShieldCheck,
  Users,
  Network,
  AlertTriangle,
  ChevronLeft,
  ExternalLink,
  CheckCircle2,
  Lock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';

export const EvidenceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setSelectedLeadForProvenance } = useInvestigation();

  const evidence = (id ? evidenceService.getById(id) : null) || evidenceService.getAll()[0];
  const allLeads = analysisService.getAllLeads();

  // Find entities, relationships, and leads supported by this evidence
  const extractedEntities = evidence.entityIds.map(eid => entityService.getById(eid)).filter(Boolean);
  const extractedRelationships = evidence.relationshipIds.map(rid => relationshipService.getById(rid)).filter(Boolean);
  const supportedLeads = allLeads.filter(l => l.supportingEvidenceIds.includes(evidence.id));

  return (
    <div className="space-y-6 font-mono text-xs text-slate-200">
      {/* Back button & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <button
            onClick={() => navigate('/evidence')}
            className="flex items-center gap-1.5 text-cyan-400 hover:underline mb-1 text-[11px]"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Back to Evidence Repository</span>
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xl sm:text-2xl font-bold uppercase text-slate-100 font-sans">
              {evidence.id} · {evidence.title}
            </span>
            <EvidenceTypeBadge type={evidence.type} />
          </div>
          <p className="text-slate-400 text-xs font-sans">
            Source Agency: <strong className="text-slate-200">{evidence.provenance.sourceAgency}</strong> · Intake Date: {evidence.date}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded border border-emerald-800 bg-emerald-950/60 px-3 py-1.5 text-emerald-300 font-bold">
            {evidence.confidence}% Confidence
          </span>
        </div>
      </div>

      {/* Main Dual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Raw Content & Highlighted Snippet (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Highlighted Snippet Card */}
          {evidence.extractedSnippet && (
            <div className="rounded border border-cyan-800/80 bg-cyan-950/30 p-4 space-y-2">
              <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Forensic Extracted Snippet</span>
              </div>
              <p className="text-slate-200 font-sans text-xs italic leading-relaxed bg-[#091124] p-3 rounded border border-cyan-900/60">
                "{evidence.extractedSnippet}"
              </p>
            </div>
          )}

          {/* Raw Content Viewer */}
          <div className="rounded border border-slate-800 bg-[#0a1224] p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-200">
                <FileText className="h-4 w-4 text-cyan-400" />
                Original Document Payload / Intercept Stream
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {evidence.fileName || 'RAW_INTAKE_STREAM.txt'} ({evidence.fileSize || '1.8 MB'})
              </span>
            </div>

            <div className="bg-[#060b17] p-4 rounded border border-slate-850 text-slate-300 font-mono text-[11px] leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
              {evidence.rawContent}
            </div>

            <div className="text-[10px] text-slate-500 pt-1">
              Cryptographic SHA-256 Digest: <span className="text-slate-400">e82a93c7198bb4f016d9a4f91bb847e2c9f53e6b79c</span>
            </div>
          </div>

          {/* Chain of Custody Card */}
          <div className="rounded border border-slate-800 bg-[#0a1224] p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-200 border-b border-slate-800 pb-2">
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
              Verified Chain of Custody & Forensic Verification
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
              <div>
                <span className="text-slate-500 text-[10px] block">Custody ID</span>
                <span className="text-cyan-300 font-bold">{evidence.provenance.chainOfCustodyId}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Source Agency</span>
                <span className="text-slate-200">{evidence.provenance.sourceAgency}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Intake Channel</span>
                <span className="text-slate-200">{evidence.provenance.intakeChannel}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Verifying Analyst</span>
                <span className="text-slate-200">{evidence.provenance.verifiedBy}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Extracted Entities, Relationships & Analytical Impact (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Analytical Impact (Leads supported) */}
          <div className="rounded border border-amber-900/60 bg-amber-950/20 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-300 font-bold uppercase text-xs">
                <AlertTriangle className="h-4 w-4" />
                Analytical Impact ({supportedLeads.length} Leads Supported)
              </div>
            </div>

            {supportedLeads.length > 0 ? (
              <div className="space-y-2">
                {supportedLeads.map(lead => (
                  <div
                    key={lead.id}
                    className="p-3 rounded border border-amber-900/40 bg-slate-900/80 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-amber-400 font-bold">{lead.id}</span>
                      <LeadPriorityBadge priority={lead.priority} />
                    </div>
                    <h4 className="text-xs font-semibold text-slate-200">{lead.title}</h4>
                    <button
                      onClick={() => setSelectedLeadForProvenance(lead)}
                      className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 font-semibold pt-1"
                    >
                      <span>Inspect Provenance Trace</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-[11px]">
                This evidence record contributes baseline corroboration to the background network graph.
              </p>
            )}
          </div>

          {/* Extracted Entities */}
          <div className="rounded border border-slate-800 bg-[#0a1224] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-200">
                <Users className="h-4 w-4 text-cyan-400" />
                Extracted Entities ({extractedEntities.length})
              </div>
              <span className="text-[10px] text-slate-500">NER Engine V2.4</span>
            </div>

            <div className="space-y-2">
              {extractedEntities.map(ent => ent && (
                <div
                  key={ent.id}
                  onClick={() => navigate(`/entities/${ent.id}`)}
                  className="p-2.5 rounded border border-slate-800/80 bg-slate-900/50 hover:border-cyan-800 cursor-pointer transition-colors flex items-center justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 font-bold">{ent.id}</span>
                      <span className="text-slate-200 font-semibold group-hover:text-cyan-300">{ent.name}</span>
                    </div>
                    <div className="mt-1">
                      <EntityTypeBadge type={ent.type} />
                    </div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-cyan-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Extracted Relationships */}
          <div className="rounded border border-slate-800 bg-[#0a1224] p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-200 border-b border-slate-800 pb-2">
              <Network className="h-4 w-4 text-purple-400" />
              Extracted Relational Edges ({extractedRelationships.length})
            </div>

            <div className="space-y-2">
              {extractedRelationships.map(rel => rel && (
                <div
                  key={rel.id}
                  className="p-2.5 rounded border border-slate-800/80 bg-slate-900/50 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-purple-400 font-bold">{rel.id}</span>
                    <span className="text-emerald-400 font-semibold">{rel.confidence}% Conf</span>
                  </div>
                  <div className="font-semibold text-slate-200 mt-1">
                    {rel.type}: {rel.label}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Source: {rel.sourceId} → Target: {rel.targetId}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
