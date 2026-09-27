import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analysisService } from '../../services/analysisService';
import { entityService } from '../../services/entityService';
import {
  Calendar,
  Search,
  Filter,
  ExternalLink,
  Car,
  PhoneCall,
  Coins,
  MapPin,
  Clock,
  ArrowRight
} from 'lucide-react';

export const TimelinePage: React.FC = () => {
  const navigate = useNavigate();
  const allEvents = analysisService.getTimelineEvents();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = allEvents.filter(ev => {
    if (selectedCategory !== 'ALL' && ev.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ev.title.toLowerCase().includes(q) ||
        ev.description.toLowerCase().includes(q) ||
        ev.location?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'COMMUNICATION': return <PhoneCall className="h-4 w-4 text-cyan-400" />;
      case 'FINANCIAL': return <Coins className="h-4 w-4 text-rose-400" />;
      case 'TRANSIT': return <Car className="h-4 w-4 text-amber-400" />;
      case 'MEETING': return <MapPin className="h-4 w-4 text-purple-400" />;
      default: return <Clock className="h-4 w-4 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-6 font-mono text-xs text-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-cyan-400 uppercase tracking-wider font-semibold">
            <Calendar className="h-4 w-4" />
            Chronological Intelligence Corroboration
          </div>
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-100 font-sans mt-1">
            Chronology & Sighting Timeline
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Temporal alignment of CDR bursts, highway FASTag toll timestamps, bank wire settlements, and physical surveillance logs.
          </p>
        </div>

        <button
          onClick={() => navigate('/communications')}
          className="flex items-center gap-2 rounded bg-cyan-600 px-4 py-2 font-semibold text-white hover:bg-cyan-500 shadow-xs shrink-0"
        >
          <span>Telecom Burst Inspector</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-slate-800 bg-[#0a1224] p-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="h-4 w-4 text-cyan-400 shrink-0" />
          <input
            type="text"
            placeholder="Search chronological event, location, or actor..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-slate-200 placeholder-slate-500 focus:outline-hidden text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          {['ALL', 'TRANSIT', 'COMMUNICATION', 'FINANCIAL', 'MEETING', 'OPERATIONAL'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                selectedCategory === cat
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Chronological Stream */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-slate-800">
        {filteredEvents.map((ev, idx) => {
          const entities = ev.relatedEntityIds.map(id => entityService.getById(id)).filter(Boolean);

          return (
            <div key={ev.id} className="relative group">
              {/* Dot */}
              <div className="absolute -left-[19px] sm:-left-[27px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-[#080e1d] bg-cyan-500 group-hover:scale-125 transition-transform" />

              <div className="rounded border border-slate-800 bg-[#0a1224] p-4 hover:border-slate-700 transition-colors space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold">
                    {getCategoryIcon(ev.category)}
                    <span>{ev.date} · {ev.time}</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-slate-300 font-semibold">{ev.category}</span>
                  </div>

                  <button
                    onClick={() => navigate(`/evidence/${ev.evidenceId}`)}
                    className="text-amber-400 hover:underline flex items-center gap-1 text-[10px]"
                  >
                    <span>Citing: {ev.evidenceId}</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-100 font-sans">{ev.title}</h3>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">{ev.description}</p>

                {ev.location && (
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <MapPin className="h-3 w-3 text-emerald-400" />
                    <span>Location: {ev.location}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-[10px]">
                  <span className="text-slate-500">Correlated Entities:</span>
                  {entities.map(ent => ent && (
                    <button
                      key={ent.id}
                      onClick={() => navigate(`/entities/${ent.id}`)}
                      className="rounded border border-slate-800 bg-slate-900 px-1.5 py-0.2 text-cyan-300 hover:border-cyan-700"
                    >
                      {ent.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
