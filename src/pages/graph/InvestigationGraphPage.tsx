import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { entityService } from '../../services/entityService';
import { relationshipService } from '../../services/relationshipService';
import { InvestigationGraph } from '../../components/graph/InvestigationGraph';
import { EntityTypeBadge } from '../../components/common/Badge';
import { Entity, Relationship } from '../../types';
import {
  Network,
  Maximize2,
  ExternalLink,
  Shield,
  Activity,
  Layers,
  HelpCircle,
  ChevronRight,
  Filter,
  Plus,
  GitCommit,
  ArrowRight,
  Info
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';

export const InvestigationGraphPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentInvestigation,
    setIsCreateEntityModalOpen,
    setIsCreateRelationshipModalOpen,
    setSelectedRelationshipForDrawer
  } = useInvestigation();

  const allEntities = entityService.getAll();
  const allRelationships = relationshipService.getAll();

  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [selectedRelationship, setSelectedRelationship] = useState<Relationship | null>(null);

  const handleQuickJump = (entId: string) => {
    const ent = entityService.getById(entId);
    if (ent) {
      setSelectedEntity(ent);
      setSelectedRelationship(null);
    }
  };

  return (
    <div className="space-y-4 font-mono text-xs text-slate-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-cyan-400 uppercase tracking-wider font-semibold">
            <Network className="h-4 w-4" />
            Topological Graph Workspace · {currentInvestigation?.code}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-100 font-sans mt-0.5">
            Interactive Investigation Graph
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Full-canvas interactive network topology. Drag to pan, scroll to zoom, click nodes or edges to inspect intelligence parameters.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Jump Selector */}
          <select
            onChange={e => {
              if (e.target.value) handleQuickJump(e.target.value);
            }}
            defaultValue=""
            className="rounded border border-slate-700 bg-[#0e1730] px-2.5 py-1.5 text-slate-200 text-xs focus:outline-hidden"
          >
            <option value="" disabled>Quick Focus Node...</option>
            <option value="PER-002">⭐ Vikram S. (Bridge Broker)</option>
            <option value="PER-001">Devraj Anand (Logistics MD)</option>
            <option value="PER-005">Sanjay Singhania (Financier)</option>
            <option value="VEH-001">Mahindra Scorpio (DL-04-TC-8812)</option>
            <option value="ACC-001">Singhania Escrow (HDFC #4910)</option>
            <option value="ACC-002">V.K. Intermediate (ICICI #3340)</option>
            <option value="LOC-002">Hotel Aerocity Meridian</option>
          </select>

          <button
            onClick={() => setIsCreateEntityModalOpen(true)}
            className="flex items-center gap-1.5 rounded bg-cyan-600 px-3 py-1.5 font-bold text-white hover:bg-cyan-500 transition-colors shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Entity</span>
          </button>

          <button
            onClick={() => setIsCreateRelationshipModalOpen(true)}
            className="flex items-center gap-1.5 rounded border border-cyan-700 bg-cyan-950/60 px-3 py-1.5 font-bold text-cyan-300 hover:bg-cyan-900/60 transition-colors shadow-xs"
          >
            <GitCommit className="h-3.5 w-3.5" />
            <span>+ Relationship</span>
          </button>

          <button
            onClick={() => navigate('/network-analysis')}
            className="flex items-center gap-1.5 rounded border border-rose-900/80 bg-rose-950/40 px-3 py-1.5 text-rose-300 hover:bg-rose-900/60 font-semibold"
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Centrality</span>
          </button>
        </div>
      </div>

      {/* Main Full-Size Graph Canvas */}
      <div className="relative">
        <InvestigationGraph
          entities={allEntities}
          relationships={allRelationships}
          selectedEntityId={selectedEntity?.id}
          onSelectEntity={ent => {
            setSelectedEntity(ent);
            setSelectedRelationship(null);
          }}
          onSelectRelationship={rel => {
            setSelectedRelationship(rel);
            setSelectedRelationshipForDrawer(rel);
          }}
          height={640}
          showFiltersDefault={false}
        />
      </div>

      {/* Contextual Bottom Inspector Bar for Entity */}
      {selectedEntity && !selectedRelationship && (
        <div className="rounded border border-cyan-800/80 bg-[#0a1224] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded border border-cyan-700 bg-cyan-950 flex items-center justify-center text-cyan-300 font-bold text-xs shrink-0 font-mono">
              {selectedEntity.id}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-100 font-sans">{selectedEntity.name}</span>
                <EntityTypeBadge type={selectedEntity.type} />
                {selectedEntity.isBridge && (
                  <span className="text-[9px] bg-rose-950 text-rose-300 border border-rose-800 px-1.5 py-0.2 rounded font-mono font-bold">
                    STRUCTURAL BRIDGE (BETWEENNESS 98)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 font-sans">{selectedEntity.summary}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setSelectedEntity(null)}
              className="rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700"
            >
              Deselect
            </button>
            <button
              onClick={() => setIsCreateRelationshipModalOpen(true)}
              className="rounded border border-cyan-700 bg-cyan-950/70 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-900"
            >
              + Link Edge
            </button>
            <button
              onClick={() => navigate(`/entities/${selectedEntity.id}`)}
              className="flex items-center gap-1.5 rounded bg-cyan-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-cyan-500"
            >
              <span>Open Entity Profile</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* Contextual Bottom Inspector Bar for Relationship */}
      {selectedRelationship && (
        <div className="rounded border border-purple-800/80 bg-[#0c1328] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded border border-purple-700 bg-purple-950 flex items-center justify-center text-purple-300 font-bold text-xs shrink-0 font-mono">
              {selectedRelationship.id}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-100 font-mono">{selectedRelationship.type}</span>
                <span className="text-[10px] text-slate-400">({selectedRelationship.direction || 'DIRECTED'})</span>
                <span className="text-xs text-cyan-400 font-bold">{selectedRelationship.confidence}% Confidence</span>
                {selectedRelationship.isCrossCluster && (
                  <span className="text-[9px] bg-rose-950 text-rose-300 border border-rose-800 px-1.5 py-0.2 rounded font-mono font-bold">
                    CROSS-CLUSTER CONNECTION
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1 font-sans">
                {selectedRelationship.details || selectedRelationship.label}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setSelectedRelationship(null)}
              className="rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700"
            >
              Deselect
            </button>
            <button
              onClick={() => setSelectedRelationshipForDrawer(selectedRelationship)}
              className="flex items-center gap-1.5 rounded bg-purple-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-purple-500"
            >
              <span>Inspect Full Relationship Drawer</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
