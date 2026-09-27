import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Users, Network, AlertCircle, Calendar, ArrowRight, X } from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { searchService, SearchResults } from '../../services/searchService';
import { EntityTypeBadge, LeadPriorityBadge } from './Badge';

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setIsCommandPaletteOpen, setSelectedLeadForProvenance } = useInvestigation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({
    entities: [],
    evidence: [],
    leads: [],
    investigations: [],
    timeline: [],
    totalMatches: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim()) {
      setResults(searchService.search(query));
    } else {
      setResults({
        entities: [],
        evidence: [],
        leads: [],
        investigations: [],
        timeline: [],
        totalMatches: 0
      });
    }
  }, [query]);

  if (!isCommandPaletteOpen) return null;

  const handleSelect = (path: string) => {
    setIsCommandPaletteOpen(false);
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs"
        onClick={() => setIsCommandPaletteOpen(false)}
      />

      <div className="relative w-full max-w-2xl rounded border border-slate-700 bg-[#091122] shadow-2xl overflow-hidden z-10">
        {/* Search input bar */}
        <div className="flex items-center gap-3 border-b border-slate-800 bg-[#0d162d] px-4 py-3.5">
          <Search className="h-5 w-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search entities, vehicles, evidence IDs, leads, phone numbers..."
            className="w-full bg-transparent text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-hidden"
          />
          <kbd className="hidden sm:inline-block rounded border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-400">
            ESC
          </kbd>
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="text-slate-400 hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4 font-mono text-xs">
          {!query.trim() ? (
            <div className="py-8 text-center text-slate-500">
              <p>Type to search across the entire investigative evidence graph.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setQuery('Vikram')}
                  className="rounded border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-slate-400 hover:text-cyan-300 hover:border-cyan-800"
                >
                  "Vikram" (Bridge)
                </button>
                <button
                  onClick={() => setQuery('DL-04-TC-8812')}
                  className="rounded border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-slate-400 hover:text-amber-300 hover:border-amber-800"
                >
                  "DL-04-TC-8812" (Scorpio)
                </button>
                <button
                  onClick={() => setQuery('E003')}
                  className="rounded border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-slate-400 hover:text-emerald-300 hover:border-emerald-800"
                >
                  "E003" (STR Wire)
                </button>
                <button
                  onClick={() => setQuery('Kundli')}
                  className="rounded border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-slate-400 hover:text-purple-300 hover:border-purple-800"
                >
                  "Kundli Toll"
                </button>
              </div>
            </div>
          ) : results.totalMatches === 0 ? (
            <div className="py-8 text-center text-slate-400">
              No investigative records matched <span className="text-cyan-300">"{query}"</span>.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Entities */}
              {results.entities.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-slate-400 uppercase text-[10px] tracking-wider mb-2 font-semibold">
                    <Users className="h-3 w-3 text-cyan-400" />
                    Entities Identified ({results.entities.length})
                  </div>
                  <div className="space-y-1">
                    {results.entities.slice(0, 4).map(e => (
                      <div
                        key={e.id}
                        onClick={() => handleSelect(`/entities/${e.id}`)}
                        className="flex items-center justify-between p-2 rounded border border-slate-800/80 bg-slate-900/50 hover:bg-[#121f3d] hover:border-cyan-800 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-400 font-semibold">{e.id}</span>
                          <span className="text-slate-200">{e.name}</span>
                          <EntityTypeBadge type={e.type} />
                          {e.isBridge && (
                            <span className="text-[10px] bg-rose-950/80 text-rose-300 border border-rose-800 px-1.5 py-0.2 rounded font-mono">
                              BRIDGE NODE
                            </span>
                          )}
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Leads */}
              {results.leads.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-slate-400 uppercase text-[10px] tracking-wider mb-2 font-semibold">
                    <AlertCircle className="h-3 w-3 text-amber-400" />
                    Analytical Leads ({results.leads.length})
                  </div>
                  <div className="space-y-1">
                    {results.leads.slice(0, 3).map(l => (
                      <div
                        key={l.id}
                        onClick={() => {
                          setSelectedLeadForProvenance(l);
                          handleSelect('/leads');
                        }}
                        className="flex items-center justify-between p-2 rounded border border-slate-800/80 bg-slate-900/50 hover:bg-[#121f3d] hover:border-amber-800 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-amber-400 font-semibold">{l.id}</span>
                          <span className="text-slate-200 truncate max-w-sm">{l.title}</span>
                          <LeadPriorityBadge priority={l.priority} />
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Evidence */}
              {results.evidence.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-slate-400 uppercase text-[10px] tracking-wider mb-2 font-semibold">
                    <FileText className="h-3 w-3 text-emerald-400" />
                    Evidence Records ({results.evidence.length})
                  </div>
                  <div className="space-y-1">
                    {results.evidence.slice(0, 3).map(ev => (
                      <div
                        key={ev.id}
                        onClick={() => handleSelect(`/evidence/${ev.id}`)}
                        className="flex items-center justify-between p-2 rounded border border-slate-800/80 bg-slate-900/50 hover:bg-[#121f3d] hover:border-emerald-800 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400 font-semibold">{ev.id}</span>
                          <span className="text-slate-200">{ev.title}</span>
                          <span className="text-[10px] text-slate-400">· {ev.source}</span>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline */}
              {results.timeline.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-slate-400 uppercase text-[10px] tracking-wider mb-2 font-semibold">
                    <Calendar className="h-3 w-3 text-purple-400" />
                    Timeline Sightings ({results.timeline.length})
                  </div>
                  <div className="space-y-1">
                    {results.timeline.slice(0, 2).map(t => (
                      <div
                        key={t.id}
                        onClick={() => handleSelect('/timeline')}
                        className="flex items-center justify-between p-2 rounded border border-slate-800/80 bg-slate-900/50 hover:bg-[#121f3d] cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-purple-400 font-semibold">{t.date}</span>
                          <span className="text-slate-200">{t.title}</span>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 bg-[#080e1c] px-4 py-2.5 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Search index contains 24 entities, 18 evidence logs, 46 relationships</span>
          <span className="text-cyan-400">Press ENTER or click to navigate</span>
        </div>
      </div>
    </div>
  );
};
