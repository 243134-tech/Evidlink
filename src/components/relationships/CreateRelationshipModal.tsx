import React, { useState } from 'react';
import { Entity, Relationship, RelationshipType, DirectionType, RELATIONSHIP_TAXONOMY } from '../../types';
import { entityService } from '../../services/entityService';
import { relationshipService } from '../../services/relationshipService';
import { evidenceService } from '../../services/evidenceService';
import { useInvestigation } from '../../context/InvestigationContext';
import { X, GitCommit, Link as LinkIcon, ArrowRight, ShieldCheck, Check } from 'lucide-react';

interface CreateRelationshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (rel: Relationship) => void;
  defaultSourceId?: string;
  defaultTargetId?: string;
}

export const CreateRelationshipModal: React.FC<CreateRelationshipModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultSourceId,
  defaultTargetId
}) => {
  const { showToast } = useInvestigation();
  const entities = entityService.getAll();
  const evidenceList = evidenceService.getAll();

  const [sourceId, setSourceId] = useState(defaultSourceId || (entities[0]?.id ?? ''));
  const [targetId, setTargetId] = useState(defaultTargetId || (entities[1]?.id ?? ''));
  const [type, setType] = useState<RelationshipType>('CALLED');
  const [direction, setDirection] = useState<DirectionType>('DIRECTED');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [frequency, setFrequency] = useState(1);
  const [duration, setDuration] = useState('');
  const [totalAmount, setTotalAmount] = useState<number | ''>('');
  const [confidence, setConfidence] = useState(88);
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<string[]>(['EVD-001']);
  const [extractionMethod, setExtractionMethod] = useState<Relationship['extractionMethod']>('MANUAL_INVESTIGATOR');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const currentTaxonomyDef = RELATIONSHIP_TAXONOMY.find(t => t.type === type) || RELATIONSHIP_TAXONOMY[0];
  const sourceEntity = entities.find(e => e.id === sourceId);
  const targetEntity = entities.find(e => e.id === targetId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceId || !targetId) {
      showToast('Please select both source and target entities.');
      return;
    }
    if (sourceId === targetId) {
      showToast('Source and Target entity cannot be identical.');
      return;
    }

    const created = relationshipService.createRelationship({
      type,
      sourceId,
      targetId,
      direction,
      date,
      frequency: Number(frequency) || 1,
      duration: duration.trim() || undefined,
      totalAmount: totalAmount ? Number(totalAmount) : undefined,
      confidence,
      evidenceIds: selectedEvidenceIds.length > 0 ? selectedEvidenceIds : ['EVD-001'],
      extractionMethod,
      notes: notes.trim() || undefined,
      label: `${type} Link`
    });

    showToast(`Relationship ${created.id} (${created.type}) created and added to graph.`);
    if (onSuccess) onSuccess(created);
    onClose();
  };

  const toggleEvidence = (evId: string) => {
    setSelectedEvidenceIds(prev => 
      prev.includes(evId) ? prev.filter(id => id !== evId) : [...prev, evId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-2xl rounded border border-slate-700 bg-[#091124] p-6 text-slate-200 shadow-2xl z-10 font-mono text-xs max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 font-sans">
                Create First-Class Relationship
              </h3>
              <p className="text-[10px] text-slate-400">
                Establish an evidence-backed connection between investigation nodes
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:text-slate-200">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Step 1: Select Source & Target */}
          <div className="rounded border border-slate-800 bg-[#0c162f] p-3.5 space-y-3">
            <div className="text-[10px] text-cyan-400 uppercase tracking-wider font-bold">
              Step 1: Endpoints & Topology
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                  Source Entity *
                </label>
                <select
                  value={sourceId}
                  onChange={e => setSourceId(e.target.value)}
                  className="w-full rounded border border-slate-700 bg-[#0e1730] px-2.5 py-2 text-slate-200 focus:outline-hidden text-xs"
                  required
                >
                  {entities.map(ent => (
                    <option key={ent.id} value={ent.id}>
                      {ent.name} ({ent.id} · {ent.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                  Target Entity *
                </label>
                <select
                  value={targetId}
                  onChange={e => setTargetId(e.target.value)}
                  className="w-full rounded border border-slate-700 bg-[#0e1730] px-2.5 py-2 text-slate-200 focus:outline-hidden text-xs"
                  required
                >
                  {entities.map(ent => (
                    <option key={ent.id} value={ent.id}>
                      {ent.name} ({ent.id} · {ent.type})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Preview Banner */}
            {sourceEntity && targetEntity && (
              <div className="rounded bg-[#080f20] px-3 py-2 text-xs flex items-center justify-between border border-slate-800">
                <span className="font-bold text-slate-200 truncate">{sourceEntity.name}</span>
                <div className="flex items-center gap-1.5 text-cyan-400 shrink-0 px-2">
                  <span className="text-[10px] font-bold">{type}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
                <span className="font-bold text-slate-200 truncate">{targetEntity.name}</span>
              </div>
            )}
          </div>

          {/* Step 2: Relationship Taxonomy */}
          <div className="rounded border border-slate-800 bg-[#0c162f] p-3.5 space-y-3">
            <div className="text-[10px] text-cyan-400 uppercase tracking-wider font-bold">
              Step 2: Controlled Relationship Taxonomy
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                  Relationship Type *
                </label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  className="w-full rounded border border-cyan-800 bg-[#0e1730] px-2.5 py-2 text-slate-100 font-bold focus:outline-hidden text-xs"
                >
                  {RELATIONSHIP_TAXONOMY.map(tax => (
                    <option key={tax.type} value={tax.type}>
                      {tax.type} — {tax.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                  Directionality
                </label>
                <select
                  value={direction}
                  onChange={e => setDirection(e.target.value as any)}
                  className="w-full rounded border border-slate-700 bg-[#0e1730] px-2.5 py-2 text-slate-200 focus:outline-hidden text-xs"
                >
                  <option value="DIRECTED">DIRECTED (Source → Target)</option>
                  <option value="UNDIRECTED">UNDIRECTED (Mutual / Bilateral)</option>
                  <option value="BIDIRECTIONAL">BIDIRECTIONAL (Reciprocal Exchanges)</option>
                </select>
              </div>
            </div>

            {/* Taxonomy Description */}
            <div className="rounded bg-[#080f20] p-2 text-[11px] text-slate-300 font-sans border-l-2 border-cyan-500">
              <strong className="text-cyan-400 font-mono">{currentTaxonomyDef.label}:</strong> {currentTaxonomyDef.description}
              <div className="mt-1 text-[10px] text-slate-400 font-mono">
                Mandated standard: {currentTaxonomyDef.evidenceRequirements}
              </div>
            </div>
          </div>

          {/* Step 3: Metrics & Confidence */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                Event Date
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full rounded border border-slate-700 bg-[#0e1730] px-2.5 py-1.5 text-slate-200 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                Event Frequency
              </label>
              <input
                type="number"
                min="1"
                value={frequency}
                onChange={e => setFrequency(Number(e.target.value))}
                className="w-full rounded border border-slate-700 bg-[#0e1730] px-2.5 py-1.5 text-slate-200 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                Duration (e.g. 42m)
              </label>
              <input
                type="text"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                placeholder="e.g. 45 min"
                className="w-full rounded border border-slate-700 bg-[#0e1730] px-2.5 py-1.5 text-slate-200 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                Total Amount (₹)
              </label>
              <input
                type="number"
                value={totalAmount}
                onChange={e => setTotalAmount(e.target.value ? Number(e.target.value) : '')}
                placeholder="Optional"
                className="w-full rounded border border-slate-700 bg-[#0e1730] px-2.5 py-1.5 text-slate-200 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Step 4: Extraction Method & Confidence Slider */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                Extraction Methodology
              </label>
              <select
                value={extractionMethod}
                onChange={e => setExtractionMethod(e.target.value as any)}
                className="w-full rounded border border-slate-700 bg-[#0e1730] px-2.5 py-1.5 text-slate-200 focus:outline-hidden text-xs"
              >
                <option value="MANUAL_INVESTIGATOR">MANUAL INVESTIGATOR ATTESTATION</option>
                <option value="CDR_ANALYSIS">CDR CELLULAR LOG PARSER</option>
                <option value="FINANCIAL_INGEST">FINANCIAL RTGS/NEFT INGEST</option>
                <option value="ANPR_CORRELATION">ANPR HIGHWAY OPTICAL SIGHTING</option>
                <option value="NLP_EXTRACTION">NLP DOCUMENTARY EXTRACTION</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                <span>Confidence Assessment</span>
                <span className="text-cyan-400 font-bold">{confidence}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={confidence}
                onChange={e => setConfidence(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer mt-1.5"
              />
            </div>
          </div>

          {/* Step 5: Evidence Attachment */}
          <div>
            <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1 font-bold">
              Attached Evidentiary Filings ({selectedEvidenceIds.length} Selected)
            </label>
            <div className="max-h-28 overflow-y-auto space-y-1 rounded border border-slate-800 bg-[#080e1e] p-2">
              {evidenceList.map(ev => {
                const isSelected = selectedEvidenceIds.includes(ev.id);
                return (
                  <button
                    type="button"
                    key={ev.id}
                    onClick={() => toggleEvidence(ev.id)}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-left text-[11px] transition-colors ${
                      isSelected
                        ? 'bg-cyan-950/70 border border-cyan-700 text-cyan-200'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate">
                      <strong className="text-cyan-400 font-mono">{ev.id}:</strong> {ev.title}
                    </span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
              Investigator Rationale & Forensic Context
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Verified cross-border transit matching vehicle speed calculation"
              className="w-full rounded border border-slate-700 bg-[#0e1730] px-2.5 py-1.5 text-slate-200 focus:outline-hidden"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-slate-700 px-3 py-1.5 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-cyan-600 px-4 py-1.5 font-bold text-white hover:bg-cyan-500 transition-colors flex items-center gap-1.5"
            >
              <GitCommit className="h-3.5 w-3.5" />
              <span>Establish Relationship</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
