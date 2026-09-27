import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { entityService } from '../../services/entityService';
import { relationshipService } from '../../services/relationshipService';
import { EntityTypeBadge } from '../../components/common/Badge';
import {
  Activity,
  Network,
  Users,
  GitCommit,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  HelpCircle,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';

export const NetworkAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentInvestigation, setSelectedLeadForProvenance } = useInvestigation();
  const allEntities = entityService.getAll();
  const allRelationships = relationshipService.getAll();

  const [activeTab, setActiveTab] = useState<'BETWEENNESS' | 'DEGREE' | 'COMMUNITIES' | 'CROSS_EDGES'>('BETWEENNESS');

  // Degree calculations
  const entityDegrees = allEntities.map(ent => {
    const degree = allRelationships.filter(r => r.sourceId === ent.id || r.targetId === ent.id).length;
    return {
      entity: ent,
      degree,
      betweenness: ent.betweennessScore || 20
    };
  });

  // Sort by betweenness
  const sortedByBetweenness = [...entityDegrees].sort((a, b) => b.betweenness - a.betweenness);
  // Sort by degree
  const sortedByDegree = [...entityDegrees].sort((a, b) => b.degree - a.degree);

  // Clusters
  const clusterAlpha = allEntities.filter(e => e.communityId === 'CLUSTER_ALPHA');
  const clusterBeta = allEntities.filter(e => e.communityId === 'CLUSTER_BETA');
  const bridgeEntities = allEntities.filter(e => e.isBridge || e.communityId === 'BRIDGE_NODE');

  // Cross cluster edges
  const crossClusterEdges = allRelationships.filter(r => r.isCrossCluster);

  return (
    <div className="space-y-6 font-mono text-xs text-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-cyan-400 uppercase tracking-wider font-semibold">
            <Activity className="h-4 w-4" />
            Graph Topology & Centrality Analytics Engine
          </div>
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-100 font-sans mt-1">
            Network Centrality & Bridge Detection
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Mathematical graph theory indicators identifying structural coordinators, information brokers, and cross-cluster conduits.
          </p>
        </div>

        <button
          onClick={() => navigate('/leads')}
          className="flex items-center gap-2 rounded bg-cyan-600 px-4 py-2 font-semibold text-white hover:bg-cyan-500 shadow-xs shrink-0"
        >
          <span>Correlated Leads Queue</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* 5 Top High-Level Graph Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3 rounded border border-slate-800 bg-[#0a1224]">
          <span className="text-slate-500 text-[10px] block uppercase">Total Nodes</span>
          <span className="text-lg font-bold text-slate-100">{allEntities.length} Entities</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">7 Typed Classes</span>
        </div>
        <div className="p-3 rounded border border-slate-800 bg-[#0a1224]">
          <span className="text-slate-500 text-[10px] block uppercase">Total Edges</span>
          <span className="text-lg font-bold text-slate-100">{allRelationships.length} Edges</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Multi-source verified</span>
        </div>
        <div className="p-3 rounded border border-slate-800 bg-[#0a1224]">
          <span className="text-slate-500 text-[10px] block uppercase">Network Density</span>
          <span className="text-lg font-bold text-cyan-400">0.167</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Dispersed syndication</span>
        </div>
        <div className="p-3 rounded border border-slate-800 bg-[#0a1224]">
          <span className="text-slate-500 text-[10px] block uppercase">Network Diameter</span>
          <span className="text-lg font-bold text-purple-400">4 Hops</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Max shortest path</span>
        </div>
        <div className="p-3 rounded border border-slate-800 bg-[#0a1224]">
          <span className="text-slate-500 text-[10px] block uppercase">Average Degree</span>
          <span className="text-lg font-bold text-emerald-400">3.83</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Connections per node</span>
        </div>
      </div>

      {/* CRITICAL BRIDGE HIGHLIGHT HERO CARD */}
      <div className="rounded border border-rose-900/80 bg-rose-950/20 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-900/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping"></span>
            <span className="text-rose-300 font-bold uppercase text-xs tracking-wider">
              Critical Structural Bridge Detected: Vikram S. (P002)
            </span>
          </div>
          <span className="rounded border border-rose-800 bg-rose-950 px-2.5 py-0.5 text-rose-200 font-bold text-xs">
            Betweenness Score: 98 / 100
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-2 text-xs font-sans text-slate-200 leading-relaxed">
            <p>
              In topological graph theory, <strong className="text-rose-300 font-mono">Betweenness Centrality</strong> quantifies the frequency with which a node sits on the shortest communication path between all other entity pairs.
            </p>
            <p className="text-slate-300">
              Cluster Alpha (Logistics, Drivers, Trucks) and Cluster Beta (Corporate Accounts, Shell Directors, Financiers) share <strong className="text-rose-400 font-mono">zero direct edges</strong>. Vikram S. (P002) is the sole mathematical bottleneck connecting these two operational branches.
            </p>
            <div className="text-[11px] text-rose-300/90 font-mono pt-1">
              Corroborated by: 8-Call Pre-Transit CDR burst + ₹1.45 Cr Escrow conduit pass-through + Meridian Lounge meeting.
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-2">
            <button
              onClick={() => navigate('/entities/P002')}
              className="flex items-center justify-center gap-2 rounded bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-rose-500 transition-colors"
            >
              <span>Inspect Bridge Entity Dossier</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => navigate('/graph')}
              className="flex items-center justify-center gap-2 rounded border border-rose-800 bg-rose-950/60 px-4 py-2 text-xs text-rose-200 hover:bg-rose-900/50"
            >
              <span>View On Tactical Canvas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-1 border-b border-slate-800 pb-px overflow-x-auto text-[11px]">
        {[
          { key: 'BETWEENNESS', label: 'Betweenness Centrality (Bridge Capacity)' },
          { key: 'DEGREE', label: 'Degree Centrality (Total Connectivity)' },
          { key: 'COMMUNITIES', label: 'Community Clustering (Alpha vs Beta)' },
          { key: 'CROSS_EDGES', label: `Cross-Cluster Edges (${crossClusterEdges.length})` }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-3 py-2 border-b-2 font-semibold transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: BETWEENNESS TABLE */}
      {activeTab === 'BETWEENNESS' && (
        <div className="space-y-4">
          <div className="rounded border border-slate-800 bg-[#091122] overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0d162d] text-[10px] uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Entity ID</th>
                  <th className="py-3 px-4">Name & Role</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Cluster</th>
                  <th className="py-3 px-4">Betweenness Centrality</th>
                  <th className="py-3 px-4">Degree</th>
                  <th className="py-3 px-4 text-right">Dossier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {sortedByBetweenness.map((item, idx) => (
                  <tr
                    key={item.entity.id}
                    onClick={() => navigate(`/entities/${item.entity.id}`)}
                    className={`hover:bg-[#0e1933] cursor-pointer transition-colors ${
                      item.entity.isBridge ? 'bg-rose-950/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-cyan-400">{item.entity.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-100 flex items-center gap-2">
                        <span>{item.entity.name}</span>
                        {item.entity.isBridge && (
                          <span className="text-[9px] bg-rose-950 text-rose-300 border border-rose-800 px-1 py-0.2 rounded font-bold">
                            BRIDGE
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">{item.entity.aliases.join(', ') || 'No aliases'}</div>
                    </td>
                    <td className="py-3 px-4"><EntityTypeBadge type={item.entity.type} /></td>
                    <td className="py-3 px-4 text-slate-300">{item.entity.communityId}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.betweenness > 80 ? 'bg-rose-500' : 'bg-cyan-500'}`}
                            style={{ width: `${item.betweenness}%` }}
                          />
                        </div>
                        <span className={`font-bold ${item.betweenness > 80 ? 'text-rose-400' : 'text-slate-300'}`}>
                          {item.betweenness}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{item.degree}</td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-cyan-400 hover:underline">Inspect</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: DEGREE CENTRALITY */}
      {activeTab === 'DEGREE' && (
        <div className="space-y-4">
          <div className="rounded border border-slate-800 bg-[#091122] overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0d162d] text-[10px] uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Entity ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Incident Degree (Edges)</th>
                  <th className="py-3 px-4">Betweenness</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {sortedByDegree.map((item, idx) => (
                  <tr
                    key={item.entity.id}
                    onClick={() => navigate(`/entities/${item.entity.id}`)}
                    className="hover:bg-[#0e1933] cursor-pointer"
                  >
                    <td className="py-3 px-4 font-bold text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-cyan-400">{item.entity.id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-100">{item.entity.name}</td>
                    <td className="py-3 px-4"><EntityTypeBadge type={item.entity.type} /></td>
                    <td className="py-3 px-4 font-bold text-emerald-400">{item.degree} incident connections</td>
                    <td className="py-3 px-4 text-slate-300">{item.betweenness}/100</td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-cyan-400 hover:underline">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: COMMUNITIES (ALPHA VS BETA) */}
      {activeTab === 'COMMUNITIES' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cluster Alpha */}
          <div className="rounded border border-cyan-900/60 bg-[#0a1224] p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-cyan-900/40 pb-2">
              <span className="font-bold text-cyan-300 uppercase text-xs">
                Cluster Alpha · Logistics & Physical Fleet ({clusterAlpha.length} Entities)
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              Consists of transport companies, truck drivers, escort SUVs, highway warehouse waypoints, and interstate corridor checkpoints.
            </p>
            <div className="space-y-1.5 pt-1">
              {clusterAlpha.map(e => (
                <div
                  key={e.id}
                  onClick={() => navigate(`/entities/${e.id}`)}
                  className="p-2 rounded bg-slate-900/60 border border-slate-800 flex items-center justify-between hover:border-cyan-800 cursor-pointer"
                >
                  <span className="text-slate-200">{e.name}</span>
                  <EntityTypeBadge type={e.type} />
                </div>
              ))}
            </div>
          </div>

          {/* Cluster Beta */}
          <div className="rounded border border-purple-900/60 bg-[#0a1224] p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-2">
              <span className="font-bold text-purple-300 uppercase text-xs">
                Cluster Beta · Financiers & Shell Fronts ({clusterBeta.length} Entities)
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              Consists of paper trading corporations, nominee directors, current escrow accounts, and rapid fund conduit pass-throughs.
            </p>
            <div className="space-y-1.5 pt-1">
              {clusterBeta.map(e => (
                <div
                  key={e.id}
                  onClick={() => navigate(`/entities/${e.id}`)}
                  className="p-2 rounded bg-slate-900/60 border border-slate-800 flex items-center justify-between hover:border-purple-800 cursor-pointer"
                >
                  <span className="text-slate-200">{e.name}</span>
                  <EntityTypeBadge type={e.type} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CROSS-CLUSTER CONNECTIONS */}
      {activeTab === 'CROSS_EDGES' && (
        <div className="space-y-3">
          <div className="p-3 rounded border border-rose-900/60 bg-rose-950/20 text-xs text-rose-200">
            These {crossClusterEdges.length} edges span between Cluster Alpha and Cluster Beta via intermediary conduits.
          </div>
          <div className="rounded border border-slate-800 bg-[#091122] overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0d162d] text-[10px] uppercase text-slate-400">
                  <th className="py-2.5 px-4">Edge ID</th>
                  <th className="py-2.5 px-4">Source Entity</th>
                  <th className="py-2.5 px-4">Relationship</th>
                  <th className="py-2.5 px-4">Target Entity</th>
                  <th className="py-2.5 px-4">Details</th>
                  <th className="py-2.5 px-4">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {crossClusterEdges.map(rel => (
                  <tr key={rel.id} className="hover:bg-slate-900/60">
                    <td className="py-2.5 px-4 font-bold text-rose-400">{rel.id}</td>
                    <td className="py-2.5 px-4 font-bold text-cyan-300">{rel.sourceId}</td>
                    <td className="py-2.5 px-4 text-slate-200 font-semibold">{rel.type}: {rel.label}</td>
                    <td className="py-2.5 px-4 font-bold text-purple-300">{rel.targetId}</td>
                    <td className="py-2.5 px-4 text-slate-400 text-[11px]">{rel.details}</td>
                    <td className="py-2.5 px-4 text-emerald-400 font-bold">{rel.confidence}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Explainable Centrality Guide Card */}
      <div className="rounded border border-slate-800 bg-[#0a1224] p-5 space-y-3 font-sans text-xs text-slate-300">
        <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold uppercase text-[11px]">
          <ShieldCheck className="h-4 w-4" />
          Investigative Guidance: Why Betweenness Trumps Simple Volume
        </div>
        <p className="leading-relaxed">
          In hierarchical organized crime networks, masterminds and key brokers intentionally minimize their degree centrality (total calls or transactions) to avoid triggering basic volume-based monitoring. However, because they must coordinate between logistics managers and financial sponsors, their <strong>betweenness centrality</strong> remains mathematically extreme.
        </p>
      </div>
    </div>
  );
};
