import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analysisService } from '../../services/analysisService';
import { entityService } from '../../services/entityService';
import { evidenceService } from '../../services/evidenceService';
import { AnalyticalLead } from '../../types';
import { LeadPriorityBadge } from '../../components/common/Badge';
import { useInvestigation } from '../../context/InvestigationContext';
import {
  AlertTriangle,
  HelpCircle,
  Network,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Flame,
  Activity
} from 'lucide-react';

export const AnalyticalLeadsPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedLeadForProvenance, showToast } = useInvestigation();
  const [leads, setLeads] = useState(() => analysisService.getAllLeads());
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLeads = leads.filter(l => {
    if (filterPriority !== 'ALL' && l.priority !== filterPriority) return false;
    if (filterType !== 'ALL' && l.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        l.id.toLowerCase().includes(q) ||
        l.title.toLowerCase().includes(q) ||
        l.explanation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleMarkReviewed = (id: string) => {
    analysisService.updateLeadStatus(id, 'REVIEWED');
    setLeads(analysisService.getAllLeads());
    showToast(`Lead ${id} marked as REVIEWED in investigator ledger.`);
  };

  const handleDismiss = (id: string) => {
    analysisService.updateLeadStatus(id, 'DISMISSED');
    setLeads(analysisService.getAllLeads());
    showToast(`Lead ${id} dismissed.`);
  };

  return (
    <div className="space-y-6 font-mono text-xs text-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-amber-400 uppercase tracking-wider font-semibold">
            <AlertTriangle className="h-4 w-4" />
            Decision-Support Intelligence Queue ({leads.length} Leads)
          </div>
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-100 font-sans mt-1">
            Prioritized Analytical Leads
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Algorithmic pattern detections: Structural bridges, pre-transit telecommunication bursts, and rapid financial laundering hops.
          </p>
        </div>

        <button
          onClick={() => navigate('/graph')}
          className="flex items-center gap-2 rounded border border-cyan-800 bg-cyan-950/60 px-4 py-2 font-semibold text-cyan-300 hover:bg-cyan-900/60 shadow-xs shrink-0"
        >
          <Network className="h-4 w-4" />
          <span>View on Tactical Graph</span>
        </button>
      </div>

      {/* Mandatory Non-Guilt Notice Banner */}
      <div className="rounded border border-amber-900/60 bg-amber-950/20 p-3.5 flex items-start gap-3">
        <ShieldCheck className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
          <strong className="text-amber-300 font-mono">Investigative Safeguard:</strong> Analytical leads represent potential investigative correlations generated from available records. They do not constitute legal conclusions, guilt determinations, or accusations. Authorized human review and independent verification are strictly required.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-slate-800 bg-[#0a1224] p-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="h-4 w-4 text-cyan-400 shrink-0" />
          <input
            type="text"
            placeholder="Search lead title, ID, or keywords..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-slate-200 placeholder-slate-500 focus:outline-hidden text-xs"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="text-[10px] uppercase">Priority:</span>
            <select
              value={filterPriority}
              onChange={e => setFilterPriority(e.target.value)}
              className="rounded border border-slate-800 bg-[#0e1832] px-2 py-1 text-slate-200 text-xs"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="text-[10px] uppercase">Type:</span>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="rounded border border-slate-800 bg-[#0e1832] px-2 py-1 text-slate-200 text-xs"
            >
              <option value="ALL">All Patterns</option>
              <option value="STRUCTURAL_BRIDGE">Structural Bridge</option>
              <option value="COMMUNICATION_BURST">Pre-Transit Burst</option>
              <option value="FINANCIAL_FUNNEL">Financial Funnel</option>
              <option value="CONVOY_CORRELATION">Convoy Correlation</option>
              <option value="IDENTITY_DISAMBIGUATION">Identity Match</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {filteredLeads.map(lead => {
          const relatedEntities = lead.relatedEntityIds.map(id => entityService.getById(id)).filter(Boolean);
          const supportingEvidence = lead.supportingEvidenceIds.map(id => evidenceService.getById(id)).filter(Boolean);

          return (
            <div
              key={lead.id}
              className={`p-5 rounded border transition-colors space-y-4 ${
                lead.priority === 'CRITICAL'
                  ? 'border-rose-900/80 bg-[#0d1326]'
                  : 'border-slate-800 bg-[#0a1224]'
              }`}
            >
              {/* Lead Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-amber-400 font-bold text-sm">{lead.id}</span>
                  <LeadPriorityBadge priority={lead.priority} />
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    Pattern: {lead.type}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <span className="text-slate-400">
                    Confidence: <strong className="text-emerald-400">{lead.confidence}%</strong>
                  </span>
                  <span className="text-slate-400">
                    Priority Score: <strong className="text-cyan-400">{lead.analyticalScore}/100</strong>
                  </span>
                  <span className="rounded border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                    {lead.status}
                  </span>
                </div>
              </div>

              {/* Title & Explanation */}
              <div className="space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-100 font-sans">
                  {lead.title}
                </h3>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {lead.explanation}
                </p>
              </div>

              {/* Key Algorithmic Signals */}
              <div className="rounded border border-slate-800/80 bg-slate-900/50 p-3 space-y-1.5">
                <span className="text-[10px] text-cyan-400 uppercase tracking-wider font-bold block">
                  Identified Key Signals
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-300 text-[11px]">
                  {lead.keySignals.map((sig, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">›</span>
                      <span>{sig}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Corroborating Evidence & Involved Entities */}
              <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-400 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-500">Entities Involved:</span>
                  {relatedEntities.map(e => e && (
                    <button
                      key={e.id}
                      onClick={() => navigate(`/entities/${e.id}`)}
                      className="rounded border border-slate-800 bg-slate-850 px-2 py-0.5 text-cyan-300 hover:border-cyan-700"
                    >
                      {e.name}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-500">Citing Evidence:</span>
                  {supportingEvidence.map(ev => ev && (
                    <button
                      key={ev.id}
                      onClick={() => navigate(`/evidence/${ev.id}`)}
                      className="rounded border border-slate-800 bg-slate-850 px-2 py-0.5 text-amber-300 hover:border-amber-700"
                    >
                      {ev.id}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => setSelectedLeadForProvenance(lead)}
                  className="flex items-center gap-1.5 rounded border border-cyan-800 bg-cyan-950/70 px-3 py-1.5 text-cyan-300 hover:bg-cyan-900/80 font-semibold"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>Why This Lead? (Inspect Provenance Trace)</span>
                </button>

                <div className="flex items-center gap-2">
                  {lead.status !== 'REVIEWED' && (
                    <button
                      onClick={() => handleMarkReviewed(lead.id)}
                      className="flex items-center gap-1 rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-slate-200 hover:bg-slate-700"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Mark Reviewed</span>
                    </button>
                  )}
                  {lead.status !== 'DISMISSED' && (
                    <button
                      onClick={() => handleDismiss(lead.id)}
                      className="flex items-center gap-1 rounded border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-slate-400 hover:text-slate-200"
                    >
                      <XCircle className="h-3.5 w-3.5 text-rose-400" />
                      <span>Dismiss</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
