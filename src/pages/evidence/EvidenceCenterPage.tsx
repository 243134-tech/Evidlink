import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvestigation } from '../../context/InvestigationContext';
import { evidenceService } from '../../services/evidenceService';
import { EvidenceType } from '../../types';
import { EvidenceTypeBadge } from '../../components/common/Badge';
import {
  FileText,
  UploadCloud,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const EvidenceCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setIsUploadPipelineOpen } = useInvestigation();
  const [evidenceList, setEvidenceList] = useState(() => evidenceService.getAll());
  const [selectedType, setSelectedType] = useState<EvidenceType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvidence = evidenceList.filter(ev => {
    if (selectedType !== 'ALL' && ev.type !== selectedType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ev.id.toLowerCase().includes(q) ||
        ev.title.toLowerCase().includes(q) ||
        ev.source.toLowerCase().includes(q) ||
        ev.rawContent.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 font-mono text-xs text-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-cyan-400 uppercase tracking-wider font-semibold">
            <FileText className="h-4 w-4" />
            Evidentiary Repository & Chain of Custody
          </div>
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-100 font-sans mt-1">
            Evidence Center
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Cryptographically fingerprinted forensic records, call detail batches, bank statements, and ANPR optical feeds.
          </p>
        </div>

        <button
          onClick={() => setIsUploadPipelineOpen(true)}
          className="flex items-center gap-2 rounded bg-cyan-600 px-4 py-2 font-semibold text-white hover:bg-cyan-500 transition-colors shadow-xs shrink-0"
        >
          <UploadCloud className="h-4 w-4" />
          <span>Upload & Ingest Evidence</span>
        </button>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded border border-slate-800 bg-[#0a1224] p-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="h-4 w-4 text-cyan-400 shrink-0" />
          <input
            type="text"
            placeholder="Search evidence ID, agency source, extracted content..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-slate-200 placeholder-slate-500 focus:outline-hidden text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          {[
            { key: 'ALL', label: 'All Records' },
            { key: 'FIR_REPORT', label: 'FIRs' },
            { key: 'CDR', label: 'CDRs' },
            { key: 'FINANCIAL', label: 'Financial' },
            { key: 'VEHICLE_LOG', label: 'Vehicles' },
            { key: 'LOCATION_RECORD', label: 'Locations' }
          ].map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedType(cat.key as any)}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                selectedType === cat.key
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Evidence Table */}
      <div className="rounded border border-slate-800 bg-[#091122] overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-[#0d162d] text-[10px] uppercase tracking-wider text-slate-400">
              <th className="py-3 px-4">Evidence ID</th>
              <th className="py-3 px-4">Title & Description</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Agency Source</th>
              <th className="py-3 px-4">Entities Extracted</th>
              <th className="py-3 px-4">Confidence</th>
              <th className="py-3 px-4">Date Ingested</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredEvidence.map(ev => (
              <tr
                key={ev.id}
                onClick={() => navigate(`/evidence/${ev.id}`)}
                className="hover:bg-[#0e1933] transition-colors cursor-pointer group"
              >
                <td className="py-3 px-4 font-bold text-cyan-400 whitespace-nowrap">
                  {ev.id}
                </td>
                <td className="py-3 px-4 max-w-sm">
                  <div className="font-semibold text-slate-200 group-hover:text-cyan-300">
                    {ev.title}
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans line-clamp-1 mt-0.5">
                    {ev.extractedSnippet || ev.rawContent}
                  </p>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <EvidenceTypeBadge type={ev.type} />
                </td>
                <td className="py-3 px-4 whitespace-nowrap text-slate-300 text-[11px]">
                  {ev.source}
                </td>
                <td className="py-3 px-4 whitespace-nowrap font-mono text-cyan-400">
                  {ev.entityIds.length} entities
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="text-emerald-400 font-bold">{ev.confidence}%</span>
                </td>
                <td className="py-3 px-4 whitespace-nowrap text-slate-400 text-[11px]">
                  {ev.date}
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => navigate(`/evidence/${ev.id}`)}
                    className="flex items-center gap-1 ml-auto rounded bg-cyan-950/70 border border-cyan-800/80 px-2.5 py-1 text-cyan-300 hover:bg-cyan-900/60"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
