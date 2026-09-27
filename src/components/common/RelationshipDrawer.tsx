import React, { useState } from 'react';
import { Relationship, InvestigationNote, Evidence } from '../../types';
import { Drawer } from './Drawer';
import { entityService } from '../../services/entityService';
import { relationshipService } from '../../services/relationshipService';
import { evidenceService } from '../../services/evidenceService';
import { auditService } from '../../services/auditService';
import { useInvestigation } from '../../context/InvestigationContext';
import { useNavigate } from 'react-router-dom';
import {
  GitCommit,
  Clock,
  Calendar,
  FileText,
  Activity,
  Shield,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  History,
  TrendingUp,
  CreditCard,
  PhoneCall
} from 'lucide-react';

interface RelationshipDrawerProps {
  relationship: Relationship | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (updated: Relationship) => void;
}

export const RelationshipDrawer: React.FC<RelationshipDrawerProps> = ({
  relationship,
  isOpen,
  onClose,
  onUpdate
}) => {
  const navigate = useNavigate();
  const { showToast } = useInvestigation();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'EVIDENCE' | 'NOTES' | 'AUDIT'>('OVERVIEW');
  const [newNote, setNewNote] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  if (!relationship) return null;

  const sourceEntity = entityService.getById(relationship.sourceId);
  const targetEntity = entityService.getById(relationship.targetId);
  const citingEvidence = relationship.evidenceIds
    .map(eid => evidenceService.getById(eid))
    .filter((ev): ev is Evidence => Boolean(ev));
  const auditLogs = auditService.getByTarget(relationship.id);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setIsSubmittingNote(true);

    const noteText = newNote.trim();
    const currentNotes = relationship.notes ? `${relationship.notes}\n${noteText}` : noteText;
    const updated = relationshipService.updateRelationship(relationship.id, {
      notes: currentNotes
    }, `Investigator note added to relationship.`);

    if (updated) {
      if (onUpdate) onUpdate(updated);
      showToast('Investigator note added to relationship specification.');
    }
    setNewNote('');
    setIsSubmittingNote(false);
  };

  const handleStatusChange = (newStatus: Relationship['status']) => {
    const updated = relationshipService.updateRelationship(relationship.id, {
      status: newStatus
    }, `Status updated to ${newStatus}`);
    if (updated) {
      if (onUpdate) onUpdate(updated);
      showToast(`Relationship status set to ${newStatus}`);
    }
  };

  const handleConfidenceChange = (newConf: number) => {
    const updated = relationshipService.updateRelationship(relationship.id, {
      confidence: newConf
    }, `Confidence adjusted to ${newConf}%`);
    if (updated) {
      if (onUpdate) onUpdate(updated);
      showToast(`Relationship confidence adjusted to ${newConf}%`);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to remove relationship ${relationship.id} from the investigation graph?`)) {
      relationshipService.deleteRelationship(relationship.id, 'Removed by investigator from relationship drawer.');
      showToast(`Relationship ${relationship.id} removed from graph.`);
      onClose();
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Relationship Detail · ${relationship.id}`}
      subtitle={`${relationship.type} Connection Specification`}
      width="xl"
    >
      <div className="space-y-5 font-mono text-xs text-slate-200">
        {/* Top Badges and Connection Summary */}
        <div className="rounded border border-slate-800 bg-[#0c162f] p-4">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="rounded bg-cyan-950 px-2 py-0.5 text-[11px] font-bold text-cyan-400 border border-cyan-800">
                {relationship.type}
              </span>
              <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                {relationship.direction || 'DIRECTED'}
              </span>
              {relationship.isCrossCluster && (
                <span className="rounded bg-rose-950 px-2 py-0.5 text-[10px] text-rose-400 border border-rose-800 font-bold">
                  CROSS-CLUSTER BRIDGE
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-slate-400">Confidence:</span>
              <span className="font-bold text-cyan-400">{relationship.confidence}%</span>
            </div>
          </div>

          {/* Connected Entities Cards */}
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Source */}
            <div className="rounded border border-slate-800/90 bg-[#080e1e] p-3">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Source Entity</span>
                <span className="text-cyan-500">{sourceEntity?.type || 'ENTITY'}</span>
              </div>
              <div className="font-bold text-slate-100 text-sm truncate">
                {sourceEntity?.name || relationship.sourceName || relationship.sourceId}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">ID: {relationship.sourceId}</div>
              {sourceEntity && (
                <button
                  onClick={() => {
                    onClose();
                    navigate(`/entities/${sourceEntity.id}`);
                  }}
                  className="mt-2.5 flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 underline"
                >
                  <span>Open Source Profile</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Target */}
            <div className="rounded border border-slate-800/90 bg-[#080e1e] p-3">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Target Entity</span>
                <span className="text-cyan-500">{targetEntity?.type || 'ENTITY'}</span>
              </div>
              <div className="font-bold text-slate-100 text-sm truncate">
                {targetEntity?.name || relationship.targetName || relationship.targetId}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">ID: {relationship.targetId}</div>
              {targetEntity && (
                <button
                  onClick={() => {
                    onClose();
                    navigate(`/entities/${targetEntity.id}`);
                  }}
                  className="mt-2.5 flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 underline"
                >
                  <span>Open Target Profile</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 text-xs">
          {[
            { id: 'OVERVIEW', label: 'Specification & Metrics' },
            { id: 'EVIDENCE', label: `Supporting Evidence (${citingEvidence.length})` },
            { id: 'NOTES', label: 'Case Notes' },
            { id: 'AUDIT', label: `Audit Trail (${auditLogs.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 -mb-px font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-cyan-400 text-cyan-400 bg-cyan-950/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-4">
            {/* Operational Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="rounded border border-slate-800 bg-[#080e1e] p-2.5">
                <div className="text-[10px] text-slate-400 uppercase">Frequency</div>
                <div className="text-base font-bold text-slate-100 mt-0.5">
                  {relationship.frequency ? `${relationship.frequency} events` : 'Recorded'}
                </div>
              </div>

              <div className="rounded border border-slate-800 bg-[#080e1e] p-2.5">
                <div className="text-[10px] text-slate-400 uppercase">Duration / Vol</div>
                <div className="text-base font-bold text-slate-100 mt-0.5">
                  {relationship.duration || (relationship.totalAmount ? `₹${(relationship.totalAmount / 10000000).toFixed(2)} Cr` : 'N/A')}
                </div>
              </div>

              <div className="rounded border border-slate-800 bg-[#080e1e] p-2.5">
                <div className="text-[10px] text-slate-400 uppercase">First Observed</div>
                <div className="text-xs font-bold text-slate-100 mt-1">
                  {relationship.firstDate || relationship.date || '2026-08-10'}
                </div>
              </div>

              <div className="rounded border border-slate-800 bg-[#080e1e] p-2.5">
                <div className="text-[10px] text-slate-400 uppercase">Last Observed</div>
                <div className="text-xs font-bold text-slate-100 mt-1">
                  {relationship.lastDate || relationship.date || '2026-09-21'}
                </div>
              </div>
            </div>

            {/* Forensic Extraction Information */}
            <div className="rounded border border-slate-800 bg-[#080e1e] p-3.5 space-y-2.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                Extraction & Provenance Metadata
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">EXTRACTION METHOD</span>
                  <span className="font-semibold text-slate-200">
                    {relationship.extractionMethod || 'CDR_ANALYSIS & ANPR MATCH'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">RECORDED BY</span>
                  <span className="font-semibold text-slate-200">
                    {relationship.createdBy || 'Inspector Raman Kumar'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">VERIFICATION STATUS</span>
                  <select
                    value={relationship.status || 'VERIFIED'}
                    onChange={e => handleStatusChange(e.target.value as any)}
                    className="mt-1 rounded border border-slate-700 bg-[#0e1730] px-2 py-1 text-slate-200 text-xs focus:outline-hidden"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="VERIFIED">VERIFIED</option>
                    <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                    <option value="DISPUTED">DISPUTED</option>
                  </select>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">ADJUST CONFIDENCE</span>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={relationship.confidence}
                      onChange={e => handleConfidenceChange(Number(e.target.value))}
                      className="accent-cyan-400 w-24 cursor-pointer"
                    />
                    <span className="text-cyan-400 font-bold">{relationship.confidence}%</span>
                  </div>
                </div>
              </div>

              {relationship.details && (
                <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-300 font-sans leading-relaxed">
                  <strong className="text-slate-400 font-mono">Forensic Summary:</strong> {relationship.details}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove from Graph</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  navigate('/graph');
                }}
                className="rounded border border-cyan-700 bg-cyan-950/60 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-900/60 transition-colors"
              >
                Focus in Investigation Graph
              </button>
            </div>
          </div>
        )}

        {activeTab === 'EVIDENCE' && (
          <div className="space-y-3">
            <div className="text-[11px] text-slate-400">
              This relationship was extracted and corroborated from the following evidence filings:
            </div>

            {citingEvidence.length === 0 ? (
              <div className="rounded border border-dashed border-slate-800 p-6 text-center text-slate-400">
                No specific evidence files currently linked to this relationship.
              </div>
            ) : (
              citingEvidence.map(ev => (
                <div
                  key={ev.id}
                  className="rounded border border-slate-800 bg-[#080e1e] p-3.5 hover:border-cyan-800 transition-colors"
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-cyan-400">{ev.id}</span>
                      <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[10px] text-slate-300">
                        {ev.type}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">{ev.date}</span>
                  </div>

                  <div className="mt-2 font-semibold text-slate-200 text-xs font-sans">
                    {ev.title}
                  </div>

                  {ev.extractedSnippet && (
                    <div className="mt-1.5 rounded bg-[#050a16] p-2 text-[11px] text-slate-300 italic font-mono border-l-2 border-cyan-500">
                      "{ev.extractedSnippet}"
                    </div>
                  )}

                  <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                    <span>Agency: {ev.provenance?.sourceAgency || 'Delhi Crime Branch'}</span>
                    <button
                      onClick={() => {
                        onClose();
                        navigate(`/evidence/${ev.id}`);
                      }}
                      className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 underline font-mono"
                    >
                      <span>Inspect Raw Evidence Record</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'NOTES' && (
          <div className="space-y-4">
            {/* Add note form */}
            <form onSubmit={handleAddNote} className="space-y-2 rounded border border-slate-800 bg-[#080e1e] p-3">
              <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                Add Investigative Finding
              </label>
              <textarea
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="Document corroboration, surveillance observation, or wire analysis note..."
                rows={3}
                className="w-full rounded border border-slate-700 bg-[#0e1730] p-2 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-hidden"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newNote.trim() || isSubmittingNote}
                  className="rounded bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-cyan-500 disabled:opacity-50 transition-colors"
                >
                  Save Case Note
                </button>
              </div>
            </form>

            {/* Existing notes */}
            <div className="space-y-2">
              {relationship.notes ? (
                relationship.notes.split('\n').map((note, idx) => (
                  <div key={idx} className="rounded border border-slate-800 bg-[#080e1e] p-3">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1 border-b border-slate-800">
                      <span>Investigator Note #{idx + 1}</span>
                      <span>Recorded on Case File</span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-200 font-sans leading-relaxed">{note}</p>
                  </div>
                ))
              ) : (
                <div className="rounded border border-dashed border-slate-800 p-6 text-center text-slate-400">
                  No notes recorded yet for this relationship.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'AUDIT' && (
          <div className="space-y-2.5">
            <div className="text-[11px] text-slate-400">
              Immutable chain of modifications, verifications, and notes recorded for this relationship:
            </div>

            {auditLogs.length === 0 ? (
              <div className="rounded border border-dashed border-slate-800 p-6 text-center text-slate-400">
                Created during initial ingestion. No subsequent modifications recorded.
              </div>
            ) : (
              auditLogs.map(log => (
                <div key={log.id} className="rounded border border-slate-800 bg-[#080e1e] p-3">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1 border-b border-slate-800">
                    <span className="text-cyan-400 font-bold">{log.action}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-200 font-sans">{log.details}</p>
                  <div className="mt-1 text-[10px] text-slate-400">
                    Investigator: {log.userName} ({log.userRole})
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Drawer>
  );
};
