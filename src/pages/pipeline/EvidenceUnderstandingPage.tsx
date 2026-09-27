import React, { useState } from 'react';
import { evidenceService } from '../../services/evidenceService';
import { entityService } from '../../services/entityService';
import { relationshipService } from '../../services/relationshipService';
import { EntityTypeBadge } from '../../components/common/Badge';
import {
  Cpu,
  Play,
  CheckCircle2,
  Loader2,
  FileText,
  Users,
  Network,
  ArrowRight,
  Database,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';

export const EvidenceUnderstandingPage: React.FC = () => {
  const { showToast } = useInvestigation();
  const allEvidence = evidenceService.getAll();
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>('E001');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(true);

  const selectedEvidence = evidenceService.getById(selectedEvidenceId) || allEvidence[0];
  const extractedEntities = selectedEvidence.entityIds.map(id => entityService.getById(id)).filter(Boolean);
  const extractedRelationships = selectedEvidence.relationshipIds.map(id => relationshipService.getById(id)).filter(Boolean);

  const handleRunExtraction = () => {
    setIsProcessing(true);
    setHasCompleted(false);

    setTimeout(() => {
      setIsProcessing(false);
      setHasCompleted(true);
      showToast(`Extraction pipeline executed successfully for ${selectedEvidence.id}`);
    }, 1200);
  };

  return (
    <div className="space-y-6 font-mono text-xs text-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-cyan-400 uppercase tracking-wider font-semibold">
            <Cpu className="h-4 w-4" />
            AI & NLP Evidence Extraction Engine
          </div>
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-100 font-sans mt-1">
            Evidence Understanding Pipeline
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Deterministic Natural Language Processing, Named Entity Recognition (NER), and Relational Triple Extraction.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedEvidenceId}
            onChange={e => setSelectedEvidenceId(e.target.value)}
            className="rounded border border-slate-800 bg-[#0d162d] px-3 py-2 text-slate-200 text-xs"
          >
            {allEvidence.map(ev => (
              <option key={ev.id} value={ev.id}>
                {ev.id} - {ev.title}
              </option>
            ))}
          </select>

          <button
            onClick={handleRunExtraction}
            disabled={isProcessing}
            className="flex items-center gap-2 rounded bg-cyan-600 px-4 py-2 font-semibold text-white hover:bg-cyan-500 disabled:opacity-50 transition-colors shadow-xs shrink-0"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Running Pipeline...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>Run Extraction</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4-Step Pipeline Flow Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded border border-slate-800 bg-[#0a1224] flex items-center gap-3">
          <div className="h-7 w-7 rounded bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 font-bold">1</div>
          <div>
            <div className="font-semibold text-slate-200">Raw Ingestion</div>
            <div className="text-[10px] text-slate-500">Tokenize & Hash</div>
          </div>
        </div>
        <div className="p-3 rounded border border-slate-800 bg-[#0a1224] flex items-center gap-3">
          <div className="h-7 w-7 rounded bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400 font-bold">2</div>
          <div>
            <div className="font-semibold text-slate-200">Named Entity NER</div>
            <div className="text-[10px] text-slate-500">Persons, Vehicles, Places</div>
          </div>
        </div>
        <div className="p-3 rounded border border-slate-800 bg-[#0a1224] flex items-center gap-3">
          <div className="h-7 w-7 rounded bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 font-bold">3</div>
          <div>
            <div className="font-semibold text-slate-200">Edge Inference</div>
            <div className="text-[10px] text-slate-500">Relational Triples</div>
          </div>
        </div>
        <div className="p-3 rounded border border-slate-800 bg-[#0a1224] flex items-center gap-3">
          <div className="h-7 w-7 rounded bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-400 font-bold">4</div>
          <div>
            <div className="font-semibold text-slate-200">Graph Ingestion</div>
            <div className="text-[10px] text-slate-500">Synchronize Topology</div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Transformation: Left Raw Text vs Right Structured Graph Objects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Unstructured Raw Report */}
        <div className="lg:col-span-6 rounded border border-slate-800 bg-[#0a1224] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-200">
              <FileText className="h-4 w-4 text-cyan-400" />
              Source Input: {selectedEvidence.id} ({selectedEvidence.type})
            </div>
            <span className="text-[10px] text-slate-500">Agency: {selectedEvidence.provenance.sourceAgency}</span>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-100">{selectedEvidence.title}</h3>
            <div className="p-4 rounded border border-slate-800 bg-[#060b17] text-slate-300 font-mono text-[11px] leading-relaxed whitespace-pre-wrap max-h-[460px] overflow-y-auto">
              {selectedEvidence.rawContent}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500">
            <span>Verified by {selectedEvidence.provenance.verifiedBy}</span>
            <span>Intake Channel: {selectedEvidence.provenance.intakeChannel}</span>
          </div>
        </div>

        {/* Right Column: Structured Extracted Triples */}
        <div className="lg:col-span-6 rounded border border-slate-800 bg-[#0a1224] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-200">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              Structured Graph Output ({extractedEntities.length} Entities · {extractedRelationships.length} Edges)
            </div>
            <span className="text-emerald-400 font-bold">{selectedEvidence.confidence}% Confidence</span>
          </div>

          {isProcessing ? (
            <div className="py-24 text-center space-y-3">
              <Loader2 className="h-8 w-8 text-cyan-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Parsing syntax tree and resolving entity identifiers...</p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Entities Extracted */}
              <div className="space-y-2">
                <span className="text-[10px] text-cyan-400 uppercase tracking-wider font-bold block">
                  Identified Named Entities ({extractedEntities.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {extractedEntities.map(ent => ent && (
                    <div
                      key={ent.id}
                      className="p-2.5 rounded border border-slate-800/80 bg-slate-900/60 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-cyan-400 font-bold">{ent.id}</span>
                        <EntityTypeBadge type={ent.type} />
                      </div>
                      <div className="font-semibold text-slate-200">{ent.name}</div>
                      <div className="text-[10px] text-slate-400 line-clamp-1">{ent.summary}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Relationships Extracted */}
              <div className="space-y-2">
                <span className="text-[10px] text-purple-400 uppercase tracking-wider font-bold block">
                  Inferred Relational Triples ({extractedRelationships.length})
                </span>
                <div className="space-y-2">
                  {extractedRelationships.map(rel => rel && (
                    <div
                      key={rel.id}
                      className="p-3 rounded border border-slate-800/80 bg-slate-900/60 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-purple-400 font-bold">{rel.id}</span>
                          <span className="font-semibold text-slate-200">{rel.type}: {rel.label}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          Source: <strong className="text-cyan-300">{rel.sourceId}</strong> → Target: <strong className="text-cyan-300">{rel.targetId}</strong>
                        </div>
                      </div>
                      <span className="text-emerald-400 font-bold">{rel.confidence}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded border border-emerald-900/60 bg-emerald-950/20 flex items-center gap-2 text-[11px] text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>All triples verified against schema and synchronized into active case topology.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
