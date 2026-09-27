import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, FileText, Network, AlertTriangle, ArrowRight, ExternalLink } from 'lucide-react';
import { entityService } from '../../services/entityService';
import { evidenceService } from '../../services/evidenceService';
import { analysisService } from '../../services/analysisService';
import { EntityTypeBadge, LeadPriorityBadge } from '../../components/common/Badge';

export const GlobalSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'ALL' | 'ENTITIES' | 'EVIDENCE' | 'LEADS'>('ALL');

  const allEntities = entityService.getAll();
  const allEvidence = evidenceService.getAll();
  const allLeads = analysisService.getAllLeads();

  const q = query.trim().toLowerCase();

  const matchedEntities = q
    ? allEntities.filter(e =>
        e.id.toLowerCase().includes(q) ||
        e.name.toLowerCase().includes(q) ||
        e.aliases.some(a => a.toLowerCase().includes(q)) ||
        e.summary.toLowerCase().includes(q)
      )
    : [];

  const matchedEvidence = q
    ? allEvidence.filter(ev =>
        ev.id.toLowerCase().includes(q) ||
        ev.title.toLowerCase().includes(q) ||
        ev.rawContent.toLowerCase().includes(q) ||
        ev.source.toLowerCase().includes(q)
      )
    : [];

  const matchedLeads = q
    ? allLeads.filter(l =>
        l.id.toLowerCase().includes(q) ||
        l.title.toLowerCase().includes(q) ||
        l.explanation.toLowerCase().includes(q)
      )
    : [];

  return (
    <div className="space-y-6 font-mono text-xs text-slate-200">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-[11px] text-cyan-400 uppercase tracking-wider font-semibold">
          <Search className="h-4 w-4" />
          Cross-Repository Investigative Search
        </div>
        <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-100 font-sans mt-1">
          Global Knowledge Base Search
        </h1>
        <p className="text-slate-400 text-xs font-sans mt-0.5">
          Unified semantic and exact index across entities, evidence documents, phone numbers, vehicle registrations, and leads.
        </p>
      </div>

      {/* Main Search Bar */}
      <div className="rounded border border-slate-800 bg-[#0a1224] p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Search className="h-5 w-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type suspect name, vehicle plate, phone number, account ID, or lead keyword..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-hidden"
          />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/80 text-[11px]">
          {['ALL', 'ENTITIES', 'EVIDENCE', 'LEADS'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat as any)}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                category === cat
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {q ? (
        <div className="space-y-6">
          {/* Matched Entities */}
          {(category === 'ALL' || category === 'ENTITIES') && matchedEntities.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-xs">
                <Users className="h-4 w-4" />
                <span>Entities Matching "{query}" ({matchedEntities.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {matchedEntities.map(ent => (
                  <div
                    key={ent.id}
                    onClick={() => navigate(`/entities/${ent.id}`)}
                    className="p-3.5 rounded border border-slate-800 bg-[#0a1224] hover:border-cyan-800 cursor-pointer transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-400 font-bold">{ent.id}</span>
                      <EntityTypeBadge type={ent.type} />
                    </div>
                    <div className="font-semibold text-slate-100">{ent.name}</div>
                    <p className="text-[11px] text-slate-400 font-sans line-clamp-2">{ent.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Evidence */}
          {(category === 'ALL' || category === 'EVIDENCE') && matchedEvidence.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold uppercase text-xs">
                <FileText className="h-4 w-4" />
                <span>Evidence Records Matching "{query}" ({matchedEvidence.length})</span>
              </div>
              <div className="space-y-2">
                {matchedEvidence.map(ev => (
                  <div
                    key={ev.id}
                    onClick={() => navigate(`/evidence/${ev.id}`)}
                    className="p-3 rounded border border-slate-800 bg-[#0a1224] hover:border-amber-800 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold">{ev.id}</span>
                        <span className="font-semibold text-slate-200">{ev.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans line-clamp-1 mt-0.5">{ev.rawContent}</p>
                    </div>
                    <span className="text-emerald-400 font-bold text-xs">{ev.confidence}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Leads */}
          {(category === 'ALL' || category === 'LEADS') && matchedLeads.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold uppercase text-xs">
                <AlertTriangle className="h-4 w-4" />
                <span>Analytical Leads Matching "{query}" ({matchedLeads.length})</span>
              </div>
              <div className="space-y-2">
                {matchedLeads.map(l => (
                  <div
                    key={l.id}
                    onClick={() => navigate('/leads')}
                    className="p-3 rounded border border-slate-800 bg-[#0a1224] hover:border-rose-800 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-rose-400 font-bold">{l.id}</span>
                        <span className="font-semibold text-slate-200">{l.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans line-clamp-1 mt-0.5">{l.explanation}</p>
                    </div>
                    <LeadPriorityBadge priority={l.priority} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchedEntities.length === 0 && matchedEvidence.length === 0 && matchedLeads.length === 0 && (
            <div className="py-12 text-center text-slate-500">
              No direct records matched query "{query}". Try a broader term such as "Vikram", "Scorpio", "Kundli", or "ICICI".
            </div>
          )}
        </div>
      ) : (
        <div className="rounded border border-slate-800 bg-[#0a1224] p-8 text-center text-slate-500 space-y-2">
          <p>Enter search keywords above or explore predefined forensic queries:</p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {['Vikram', 'Scorpio', 'Kundli NH44', 'Pass-Through', 'Devraj Anand', 'Apex Global'].map(tag => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="rounded border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-cyan-300 hover:border-cyan-700"
              >
                "{tag}"
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
