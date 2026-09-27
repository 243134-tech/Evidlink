import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Entity, Relationship, EntityType, RelationshipType } from '../../types';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  Filter,
  Eye,
  Layers,
  Search,
  Sliders,
  Shield,
  X,
  ExternalLink
} from 'lucide-react';
import { EntityTypeBadge } from '../common/Badge';

interface InvestigationGraphProps {
  entities: Entity[];
  relationships: Relationship[];
  onSelectEntity?: (entity: Entity) => void;
  onSelectRelationship?: (rel: Relationship) => void;
  selectedEntityId?: string | null;
  height?: number | string;
  showFiltersDefault?: boolean;
}

interface NodePosition {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export const InvestigationGraph: React.FC<InvestigationGraphProps> = ({
  entities,
  relationships,
  onSelectEntity,
  onSelectRelationship,
  selectedEntityId,
  height = 600,
  showFiltersDefault = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredEntityId, setHoveredEntityId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [selectedEdgeData, setSelectedEdgeData] = useState<Relationship | null>(null);
  const [filterType, setFilterType] = useState<EntityType | 'ALL'>('ALL');
  const [filterBridgeOnly, setFilterBridgeOnly] = useState(false);
  const [minConfidence, setMinConfidence] = useState(70);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterDrawer, setShowFilterDrawer] = useState(showFiltersDefault);

  // Position nodes strategically into Cluster Alpha (Left), Bridge (Center), Cluster Beta (Right)
  const nodePositions = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    const alphaNodes: Entity[] = [];
    const betaNodes: Entity[] = [];
    const bridgeNodes: Entity[] = [];

    entities.forEach(ent => {
      if (ent.communityId === 'BRIDGE_NODE' || ent.isBridge) {
        bridgeNodes.push(ent);
      } else if (ent.communityId === 'CLUSTER_ALPHA') {
        alphaNodes.push(ent);
      } else {
        betaNodes.push(ent);
      }
    });

    const centerX = 500;
    const centerY = 320;

    // Bridge nodes in the vertical corridor
    bridgeNodes.forEach((node, i) => {
      const step = 80;
      const startY = centerY - ((bridgeNodes.length - 1) * step) / 2;
      map.set(node.id, {
        x: centerX + (i % 2 === 0 ? -15 : 15),
        y: startY + i * step
      });
    });

    // Cluster Alpha on the Left
    alphaNodes.forEach((node, i) => {
      const angle = (i / Math.max(1, alphaNodes.length)) * Math.PI * 1.8 - Math.PI * 0.9;
      const radius = 170 + (i % 3) * 35;
      map.set(node.id, {
        x: centerX - 240 + Math.cos(angle) * radius * 0.9,
        y: centerY + Math.sin(angle) * radius * 0.8
      });
    });

    // Cluster Beta on the Right
    betaNodes.forEach((node, i) => {
      const angle = (i / Math.max(1, betaNodes.length)) * Math.PI * 1.8 - Math.PI * 0.9;
      const radius = 170 + (i % 3) * 35;
      map.set(node.id, {
        x: centerX + 240 - Math.cos(angle) * radius * 0.9,
        y: centerY + Math.sin(angle) * radius * 0.8
      });
    });

    return map;
  }, [entities]);

  // Filtering
  const filteredEntities = useMemo(() => {
    return entities.filter(ent => {
      if (filterType !== 'ALL' && ent.type !== filterType) return false;
      if (filterBridgeOnly && !ent.isBridge) return false;
      if (ent.confidence < minConfidence) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = ent.name.toLowerCase().includes(q);
        const matchId = ent.id.toLowerCase().includes(q);
        const matchAlias = ent.aliases.some(a => a.toLowerCase().includes(q));
        if (!matchName && !matchId && !matchAlias) return false;
      }
      return true;
    });
  }, [entities, filterType, filterBridgeOnly, minConfidence, searchQuery]);

  const visibleEntityIds = useMemo(() => new Set(filteredEntities.map(e => e.id)), [filteredEntities]);

  const filteredRelationships = useMemo(() => {
    return relationships.filter(rel => {
      if (!visibleEntityIds.has(rel.sourceId) || !visibleEntityIds.has(rel.targetId)) {
        return false;
      }
      return rel.confidence >= minConfidence;
    });
  }, [relationships, visibleEntityIds, minConfidence]);

  // Node Colors based on Entity Type
  const getNodeColor = (type: EntityType) => {
    switch (type) {
      case 'PERSON': return '#06b6d4'; // Cyan
      case 'VEHICLE': return '#f59e0b'; // Amber
      case 'LOCATION': return '#10b981'; // Emerald
      case 'ACCOUNT': return '#f43f5e'; // Rose
      case 'ORGANIZATION': return '#a855f7'; // Purple
      case 'PHONE': return '#eab308'; // Yellow
      case 'DOCUMENT': return '#94a3b8'; // Slate
      default: return '#38bdf8';
    }
  };

  // Pan and Zoom Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => setZoom(z => Math.min(2.5, z + 0.15));
  const handleZoomOut = () => setZoom(z => Math.max(0.4, z - 0.15));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedEdgeId(null);
    setSelectedEdgeData(null);
  };

  const handleNodeClick = (entity: Entity, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelectEntity) {
      onSelectEntity(entity);
    }
  };

  const handleEdgeClick = (rel: Relationship, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEdgeId(rel.id);
    setSelectedEdgeData(rel);
    if (onSelectRelationship) {
      onSelectRelationship(rel);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded border border-slate-800 bg-[#070d1c] overflow-hidden select-none"
      style={{ height }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Tactical Canvas Background Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #0ea5e9 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Cluster Region Watermarks */}
      <div className="absolute top-4 left-6 pointer-events-none text-slate-700/60 font-mono text-[11px] uppercase tracking-widest">
        CLUSTER ALPHA · LOGISTICS & FLEET
      </div>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none text-cyan-600/50 font-mono text-[11px] uppercase tracking-widest">
        BRIDGE CORRIDOR
      </div>
      <div className="absolute top-4 right-6 pointer-events-none text-slate-700/60 font-mono text-[11px] uppercase tracking-widest text-right">
        CLUSTER BETA · FINANCIERS & SHELLS
      </div>

      {/* Controls Overlay Top Right */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded border border-slate-800 bg-[#0d162d]/90 p-1 backdrop-blur-xs font-mono text-xs">
        <button
          onClick={handleZoomIn}
          className="rounded p-1.5 text-slate-300 hover:bg-slate-800 hover:text-cyan-400"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="rounded p-1.5 text-slate-300 hover:bg-slate-800 hover:text-cyan-400"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          onClick={handleReset}
          className="rounded p-1.5 text-slate-300 hover:bg-slate-800 hover:text-cyan-400"
          title="Reset View"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
        <button
          onClick={() => setShowFilterDrawer(prev => !prev)}
          className={`rounded p-1.5 transition-colors ${
            showFilterDrawer
              ? 'bg-cyan-900/60 text-cyan-300'
              : 'text-slate-300 hover:bg-slate-800 hover:text-cyan-400'
          }`}
          title="Toggle Graph Filters"
        >
          <Sliders className="h-4 w-4" />
        </button>
      </div>

      {/* Quick Search & Summary Top Left */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <div className="flex items-center gap-2 rounded border border-slate-800 bg-[#0d162d]/90 px-3 py-1.5 backdrop-blur-xs text-xs font-mono text-slate-300">
          <Search className="h-3.5 w-3.5 text-cyan-400" />
          <input
            type="text"
            placeholder="Filter nodes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-32 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-hidden text-xs"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-slate-500 hover:text-slate-300">
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-2 rounded border border-slate-800 bg-[#0d162d]/90 px-3 py-1.5 text-[11px] font-mono text-slate-400 backdrop-blur-xs">
          <span>{filteredEntities.length} of {entities.length} Nodes</span>
          <span>·</span>
          <span>{filteredRelationships.length} Edges</span>
        </div>
      </div>

      {/* Legend Bottom Left */}
      <div className="absolute bottom-4 left-4 z-20 hidden md:flex flex-wrap items-center gap-3 rounded border border-slate-800/80 bg-[#0d162d]/90 px-3.5 py-2 text-[10px] font-mono text-slate-300 backdrop-blur-xs">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
          <span>Person</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-400"></span>
          <span>Vehicle</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
          <span>Location</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-rose-400"></span>
          <span>Account</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-purple-400"></span>
          <span>Organization</span>
        </div>
        <div className="flex items-center gap-1.5 border-l border-slate-700 pl-2">
          <span className="h-2.5 w-2.5 rounded-full border-2 border-rose-500 bg-rose-950"></span>
          <span className="text-rose-400 font-semibold">Bridge Node</span>
        </div>
      </div>

      {/* Edge Details Callout Bottom Right */}
      {selectedEdgeData && (
        <div className="absolute bottom-4 right-4 z-20 max-w-sm rounded border border-slate-700 bg-[#0b1429] p-3 text-xs font-mono shadow-2xl animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
            <span className="text-cyan-400 font-bold">{selectedEdgeData.id} ({selectedEdgeData.type})</span>
            <button onClick={() => setSelectedEdgeData(null)} className="text-slate-400 hover:text-slate-200">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-2 text-slate-200 font-semibold">{selectedEdgeData.label}</div>
          {selectedEdgeData.details && (
            <p className="mt-1 text-[11px] text-slate-400 font-sans">{selectedEdgeData.details}</p>
          )}
          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <span>Confidence: {selectedEdgeData.confidence}%</span>
            <span>Evidence IDs: {selectedEdgeData.evidenceIds.join(', ')}</span>
          </div>
        </div>
      )}

      {/* FILTER DRAWER OVERLAY */}
      {showFilterDrawer && (
        <div className="absolute top-16 right-4 z-20 w-64 rounded border border-slate-700 bg-[#0a1224] p-4 text-xs font-mono shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-slate-200 font-bold uppercase tracking-wider text-[11px]">
              <Filter className="h-3.5 w-3.5 text-cyan-400" />
              Graph Filters
            </div>
            <button onClick={() => setShowFilterDrawer(false)} className="text-slate-400 hover:text-slate-200">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1.5">
              Entity Type
            </label>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value as any)}
              className="w-full rounded border border-slate-800 bg-[#0e1933] px-2 py-1.5 text-slate-200 text-xs focus:outline-hidden"
            >
              <option value="ALL">All Entity Types</option>
              <option value="PERSON">Persons</option>
              <option value="VEHICLE">Vehicles</option>
              <option value="LOCATION">Locations</option>
              <option value="ACCOUNT">Accounts</option>
              <option value="ORGANIZATION">Organizations</option>
              <option value="PHONE">Hardware/Phones</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">
              <span>Min Confidence</span>
              <span className="text-cyan-400">{minConfidence}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="99"
              value={minConfidence}
              onChange={e => setMinConfidence(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="pt-1">
            <label className="flex items-center gap-2 text-slate-300 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={filterBridgeOnly}
                onChange={e => setFilterBridgeOnly(e.target.checked)}
                className="rounded accent-cyan-500"
              />
              <span>Isolate Bridge Nodes Only</span>
            </label>
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-end">
            <button
              onClick={() => {
                setFilterType('ALL');
                setFilterBridgeOnly(false);
                setMinConfidence(70);
                setSearchQuery('');
              }}
              className="text-[10px] text-cyan-400 hover:underline"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}

      {/* SVG Canvas */}
      <svg
        className="w-full h-full cursor-grab active:cursor-grabbing"
        viewBox="0 0 1000 640"
        preserveAspectRatio="xMidYMid meet"
      >
        <g
          transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
          className="transition-transform duration-75"
        >
          {/* Defs for arrow markers & glowing filters */}
          <defs>
            <marker
              id="arrow-default"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#334155" />
            </marker>
            <marker
              id="arrow-cross"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#38bdf8" />
            </marker>
            <filter id="glow-bridge" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Relationships (Edges) */}
          <g className="edges">
            {filteredRelationships.map(rel => {
              const src = nodePositions.get(rel.sourceId);
              const tgt = nodePositions.get(rel.targetId);
              if (!src || !tgt) return null;

              const isHighlighted =
                selectedEntityId === rel.sourceId ||
                selectedEntityId === rel.targetId ||
                hoveredEntityId === rel.sourceId ||
                hoveredEntityId === rel.targetId ||
                selectedEdgeId === rel.id;

              const isCross = rel.isCrossCluster;

              return (
                <g key={rel.id} className="cursor-pointer group" onClick={e => handleEdgeClick(rel, e)}>
                  {/* Invisible thicker line for easier clicking */}
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke="transparent"
                    strokeWidth="14"
                  />
                  {/* Visual line */}
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke={
                      isHighlighted
                        ? '#38bdf8'
                        : isCross
                        ? '#0284c7'
                        : '#1e293b'
                    }
                    strokeWidth={isHighlighted ? 2.5 : isCross ? 1.8 : 1}
                    strokeDasharray={rel.type === 'TRANSFERRED' ? '4 2' : undefined}
                    opacity={isHighlighted ? 1 : isCross ? 0.85 : 0.55}
                    markerEnd={isCross ? 'url(#arrow-cross)' : 'url(#arrow-default)'}
                  />

                  {/* Edge label for cross-cluster or selected */}
                  {(isHighlighted || isCross) && (
                    <text
                      x={(src.x + tgt.x) / 2}
                      y={(src.y + tgt.y) / 2 - 4}
                      fill={isHighlighted ? '#e0f2fe' : '#7dd3fc'}
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="pointer-events-none select-none"
                    >
                      {rel.type}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* Entities (Nodes) */}
          <g className="nodes">
            {filteredEntities.map(ent => {
              const pos = nodePositions.get(ent.id);
              if (!pos) return null;

              const isSelected = selectedEntityId === ent.id;
              const isHovered = hoveredEntityId === ent.id;
              const isBridge = ent.isBridge;
              const color = getNodeColor(ent.type);

              return (
                <g
                  key={ent.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer group"
                  onClick={e => handleNodeClick(ent, e)}
                  onMouseEnter={() => setHoveredEntityId(ent.id)}
                  onMouseLeave={() => setHoveredEntityId(null)}
                >
                  {/* Bridge Node Radiant Ring */}
                  {isBridge && (
                    <circle
                      r="22"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                      opacity="0.8"
                      className="animate-spin origin-center"
                      style={{ transformOrigin: '0 0' }}
                    />
                  )}

                  {/* Selection Ring */}
                  {(isSelected || isHovered) && (
                    <circle
                      r="19"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2"
                      opacity="0.9"
                    />
                  )}

                  {/* Main Node Circle */}
                  <circle
                    r={isBridge ? 14 : isSelected ? 12 : 9}
                    fill={isBridge ? '#881337' : '#0c162f'}
                    stroke={isBridge ? '#f43f5e' : color}
                    strokeWidth={isBridge ? 3 : 2}
                    filter={isBridge ? 'url(#glow-bridge)' : undefined}
                    className="transition-all duration-150"
                  />

                  {/* Inner center dot */}
                  <circle
                    r={isBridge ? 5 : 3.5}
                    fill={color}
                  />

                  {/* Node Label */}
                  <text
                    y={isBridge ? 26 : 21}
                    fill={isSelected ? '#38bdf8' : isBridge ? '#fda4af' : '#cbd5e1'}
                    fontSize={isBridge ? '11' : '10'}
                    fontWeight={isBridge || isSelected ? '600' : '400'}
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="select-none pointer-events-none drop-shadow-xs"
                  >
                    {ent.name.length > 18 ? ent.name.slice(0, 16) + '..' : ent.name}
                  </text>

                  {/* Node ID Subtext */}
                  <text
                    y={isBridge ? 36 : 30}
                    fill="#64748b"
                    fontSize="8"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="select-none pointer-events-none"
                  >
                    {ent.id}
                  </text>
                </g>
              );
            })}
          </g>
        </g>
      </svg>
    </div>
  );
};
