import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvestigation } from '../../context/InvestigationContext';
import { entityService } from '../../services/entityService';
import { relationshipService } from '../../services/relationshipService';
import { EntityType, Entity } from '../../types';
import { EntityTypeBadge } from '../../components/common/Badge';
import {
  Users,
  Search,
  Filter,
  LayoutGrid,
  List,
  ArrowRight,
  ExternalLink,
  Shield,
  Activity
} from 'lucide-react';

export const EntityExplorerPage: React.FC = () => {
  const navigate = useNavigate();
  const { setIsCreateEntityModalOpen } = useInvestigation();
  const allEntities = entityService.getAll();
  const allRelationships = relationshipService.getAll();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<EntityType | 'ALL'>('ALL');
  const [selectedCommunity, setSelectedCommunity] = useState<string>('ALL');
  const [bridgeOnly, setBridgeOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('GRID');

  const filteredEntities = allEntities.filter(ent => {
    if (selectedType !== 'ALL' && ent.type !== selectedType) return false;
    if (selectedCommunity !== 'ALL' && ent.communityId !== selectedCommunity) return false;
    if (bridgeOnly && !ent.isBridge) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = ent.name.toLowerCase().includes(q);
      const matchId = ent.id.toLowerCase().includes(q);
      const matchAlias = ent.aliases.some(a => a.toLowerCase().includes(q));
      const matchSum = ent.summary.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchAlias && !matchSum) return false;
    }
    return true;
  });

  const getEdgeCount = (entityId: string) => {
    return allRelationships.filter(r => r.sourceId === entityId || r.targetId === entityId).length;
  };

  return (
    <div className="space-y-6 font-mono text-xs text-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-cyan-400 uppercase tracking-wider font-semibold">
            <Users className="h-4 w-4" />
            Registry of Identified Entities ({allEntities.length})
          </div>
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-100 font-sans mt-1">
            Entities Explorer
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Cross-case index of persons, corporate vehicles, shell entities, bank conduits, and mobile hardware.
          </p>
        </div>

        {/* Action and View toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateEntityModalOpen(true)}
            className="flex items-center gap-1.5 rounded bg-cyan-600 px-3 py-1.5 font-bold text-white hover:bg-cyan-500 transition-colors shadow-xs"
          >
            <Users className="h-3.5 w-3.5" />
            <span>+ Register Entity</span>
          </button>

          <div className="flex items-center gap-1 rounded border border-slate-800 bg-[#0d162d] p-1">
            <button
              onClick={() => setViewMode('GRID')}
              className={`rounded p-1.5 transition-colors ${
                viewMode === 'GRID' ? 'bg-cyan-900 text-cyan-200' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              className={`rounded p-1.5 transition-colors ${
                viewMode === 'TABLE' ? 'bg-cyan-900 text-cyan-200' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Table View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-slate-800 bg-[#0a1224] p-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="h-4 w-4 text-cyan-400 shrink-0" />
          <input
            type="text"
            placeholder="Search entity name, ID, alias, or vehicle plate..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-slate-200 placeholder-slate-500 focus:outline-hidden text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="text-[10px] uppercase">Type:</span>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value as any)}
              className="rounded border border-slate-800 bg-[#0e1832] px-2 py-1 text-slate-200 text-xs"
            >
              <option value="ALL">All Types</option>
              <option value="PERSON">Person</option>
              <option value="VEHICLE">Vehicle</option>
              <option value="LOCATION">Location</option>
              <option value="ACCOUNT">Account</option>
              <option value="ORGANIZATION">Organization</option>
              <option value="PHONE">Phone</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="text-[10px] uppercase">Cluster:</span>
            <select
              value={selectedCommunity}
              onChange={e => setSelectedCommunity(e.target.value)}
              className="rounded border border-slate-800 bg-[#0e1832] px-2 py-1 text-slate-200 text-xs"
            >
              <option value="ALL">All Clusters</option>
              <option value="CLUSTER_ALPHA">Cluster Alpha (Transport)</option>
              <option value="CLUSTER_BETA">Cluster Beta (Financiers)</option>
              <option value="BRIDGE_NODE">Bridge Node</option>
            </select>
          </div>

          <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer pl-1">
            <input
              type="checkbox"
              checked={bridgeOnly}
              onChange={e => setBridgeOnly(e.target.checked)}
              className="rounded accent-cyan-500"
            />
            <span>Bridge Only</span>
          </label>
        </div>
      </div>

      {/* Results View */}
      {viewMode === 'GRID' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredEntities.map(ent => {
            const edgeCount = getEdgeCount(ent.id);
            return (
              <div
                key={ent.id}
                onClick={() => navigate(`/entities/${ent.id}`)}
                className="p-4 rounded border border-slate-800 bg-[#0a1224] hover:border-cyan-800 cursor-pointer transition-colors space-y-3 flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400 font-bold">{ent.id}</span>
                    <EntityTypeBadge type={ent.type} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-100 group-hover:text-cyan-300 text-sm">
                      {ent.name}
                    </h3>
                    {ent.aliases.length > 0 && (
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        aka "{ent.aliases[0]}"
                      </span>
                    )}
                  </div>

                  {ent.isBridge && (
                    <div className="rounded border border-rose-800 bg-rose-950/70 p-1.5 text-[10px] text-rose-300 font-semibold flex items-center justify-between">
                      <span>CRITICAL BRIDGE NODE</span>
                      <span className="text-rose-200">Betweenness 98</span>
                    </div>
                  )}

                  <p className="text-[11px] text-slate-400 font-sans line-clamp-2 leading-relaxed">
                    {ent.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{edgeCount} connections</span>
                  <span className="text-cyan-400 group-hover:underline flex items-center gap-1 font-semibold">
                    <span>Dossier</span>
                    <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded border border-slate-800 bg-[#091122] overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0d162d] text-[10px] uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Entity ID</th>
                <th className="py-3 px-4">Name & Aliases</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Cluster</th>
                <th className="py-3 px-4">Betweenness</th>
                <th className="py-3 px-4">Degree</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredEntities.map(ent => (
                <tr
                  key={ent.id}
                  onClick={() => navigate(`/entities/${ent.id}`)}
                  className="hover:bg-[#0e1933] transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4 font-bold text-cyan-400">{ent.id}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-100 group-hover:text-cyan-300">{ent.name}</span>
                    {ent.aliases.length > 0 && (
                      <span className="text-slate-500 text-[10px] ml-2">({ent.aliases.join(', ')})</span>
                    )}
                  </td>
                  <td className="py-3 px-4"><EntityTypeBadge type={ent.type} /></td>
                  <td className="py-3 px-4 text-slate-300 text-[11px]">{ent.communityId}</td>
                  <td className="py-3 px-4 font-bold text-cyan-400">{ent.betweennessScore || 20}/100</td>
                  <td className="py-3 px-4 text-slate-300">{getEdgeCount(ent.id)} edges</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => navigate(`/entities/${ent.id}`)}
                      className="text-cyan-400 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
