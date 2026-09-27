import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvestigation } from '../../context/InvestigationContext';
import { investigationService } from '../../services/investigationService';
import { entityService } from '../../services/entityService';
import { relationshipService } from '../../services/relationshipService';
import { evidenceService } from '../../services/evidenceService';
import { analysisService } from '../../services/analysisService';
import { InvestigationGraph } from '../../components/graph/InvestigationGraph';
import { EntityTypeBadge, LeadPriorityBadge } from '../../components/common/Badge';
import { Entity, Relationship, Evidence, AnalyticalLead } from '../../types';
import {
  FolderOpen,
  Network,
  FileText,
  Users,
  Activity,
  Calendar,
  AlertTriangle,
  FileCheck,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Layers,
  HelpCircle
} from 'lucide-react';

export const InvestigationWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setSelectedLeadForProvenance } = useInvestigation();

  const inv = (id ? investigationService.getById(id) : null) || investigationService.getAll()[0];
  const allEntities = entityService.getAll();
  const allRelationships = relationshipService.getAll();
  const allEvidence = evidenceService.getAll();
  const allLeads = analysisService.getAllLeads();
  const allTimeline = analysisService.getTimelineEvents();

  const [activeTab, setActiveTab] = useState<'WORKSPACE' | 'EVIDENCE' | 'ENTITIES' | 'RELATIONSHIPS' | 'TIMELINE' | 'ANALYSIS' | 'REPORTS'>('WORKSPACE');
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(() => allEntities.find(e => e.isBridge) || allEntities[0]);

  // Synchronized items related to selected entity
  const entityRelationships = selectedEntity
    ? allRelationships.filter(r => r.sourceId === selectedEntity.id || r.targetId === selectedEntity.id)
    : [];

  const entityEvidence = selectedEntity
    ? allEvidence.filter(ev => ev.entityIds.includes(selectedEntity.id))
    : [];

  const entityTimeline = selectedEntity
    ? allTimeline.filter(t => t.relatedEntityIds.includes(selectedEntity.id))
    : [];

  const entityLeads = selectedEntity
    ? allLeads.filter(l => l.relatedEntityIds.includes(selectedEntity.id))
    : [];

  return (
    <div className="space-y-6 font-mono text-xs text-slate-200">
      {/* Workspace Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-cyan-400 font-semibold uppercase">
            <FolderOpen className="h-4 w-4" />
            <span>Investigation Command Workspace · {inv.code}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-100 font-sans mt-0.5">
            {inv.title}
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-0.5 max-w-3xl line-clamp-1">
            {inv.description}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/reports')}
            className="flex items-center gap-1.5 rounded border border-slate-700 bg-slate-800/80 px-3 py-2 text-slate-200 hover:bg-slate-700"
          >
            <FileCheck className="h-3.5 w-3.5 text-cyan-400" />
            <span>Case Report</span>
          </button>
          <button
            onClick={() => navigate('/leads')}
            className="flex items-center gap-1.5 rounded bg-cyan-600 px-3.5 py-2 font-semibold text-white hover:bg-cyan-500 shadow-xs"
          >
            <span>Analytical Leads ({inv.leadsCount})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Workspace Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-800 pb-px overflow-x-auto text-[11px]">
        {[
          { key: 'WORKSPACE', label: 'Tactical Workspace (Tri-Pane)' },
          { key: 'EVIDENCE', label: `Evidence (${inv.evidenceCount})` },
          { key: 'ENTITIES', label: `Entities (${inv.entityCount})` },
          { key: 'RELATIONSHIPS', label: `Relationships (${inv.relationshipCount})` },
          { key: 'TIMELINE', label: 'Timeline Stream' },
          { key: 'ANALYSIS', label: 'Network Metrics' }
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

      {/* TAB 1: TRI-PANE TACTICAL WORKSPACE */}
      {activeTab === 'WORKSPACE' && (
        <div className="space-y-6">
          {/* Top Row: Left Info (3 cols) + Center Graph (6 cols) + Right Synchronized Dossier (3 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: Investigation Details */}
            <div className="lg:col-span-3 space-y-4">
              <div className="rounded border border-slate-800 bg-[#0a1224] p-4 space-y-3">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800 pb-2">
                  Case Metadata
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Lead Investigator</span>
                    <span className="text-slate-200 font-semibold">{inv.leadInvestigator}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Priority & Status</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <LeadPriorityBadge priority={inv.priority} />
                      <span className="text-slate-300 text-[10px] uppercase font-bold">{inv.status}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Active Tags</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {inv.tags.map(t => (
                        <span key={t} className="rounded border border-slate-800 bg-slate-900 px-1.5 py-0.2 text-[9px] text-slate-400">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cluster Summary Box */}
              <div className="rounded border border-slate-800 bg-[#0a1224] p-4 space-y-2">
                <div className="text-[10px] text-cyan-400 uppercase tracking-wider font-bold">
                  Topological Summary
                </div>
                <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                  {inv.summaryAnalysis}
                </p>
              </div>

              {/* Active Bridge Entity Spotlight */}
              <div className="rounded border border-rose-900/60 bg-rose-950/20 p-4 space-y-2">
                <div className="flex items-center justify-between text-rose-300 font-bold uppercase text-[10px]">
                  <span>Critical Intermediary</span>
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
                </div>
                <div className="text-slate-200 font-bold">Vikram S. / V. Sharma</div>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  Bridges Cluster Alpha (Transporters) to Cluster Beta (Financiers) with Betweenness Score 98/100.
                </p>
                <button
                  onClick={() => {
                    const bridge = allEntities.find(e => e.isBridge);
                    if (bridge) setSelectedEntity(bridge);
                  }}
                  className="w-full text-center rounded border border-rose-800 bg-rose-900/40 py-1.5 text-[10px] text-rose-200 hover:bg-rose-800/50"
                >
                  Focus Bridge on Graph
                </button>
              </div>
            </div>

            {/* Center: Graph Canvas */}
            <div className="lg:col-span-6 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>Interactive Topologic Graph (Pan & Zoom Enabled)</span>
                <span>Selected: <strong className="text-cyan-300">{selectedEntity?.name || 'None'}</strong></span>
              </div>
              <InvestigationGraph
                entities={allEntities}
                relationships={allRelationships}
                selectedEntityId={selectedEntity?.id}
                onSelectEntity={ent => setSelectedEntity(ent)}
                height={540}
              />
            </div>

            {/* Right: Selected Entity Synchronized Dossier */}
            <div className="lg:col-span-3 space-y-4">
              {selectedEntity ? (
                <div className="rounded border border-cyan-800/80 bg-[#0a1224] p-4 space-y-4 animate-in fade-in duration-150">
                  <div className="border-b border-slate-800 pb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-400 font-bold text-sm">{selectedEntity.id}</span>
                      <EntityTypeBadge type={selectedEntity.type} />
                    </div>
                    <h3 className="text-base font-bold text-slate-100 mt-1">{selectedEntity.name}</h3>
                    {selectedEntity.aliases.length > 0 && (
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Aliases: {selectedEntity.aliases.join(', ')}
                      </div>
                    )}
                  </div>

                  {/* Centrality Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-500 block">Betweenness</span>
                      <span className="text-cyan-400 font-bold text-sm">
                        {selectedEntity.betweennessScore || 50}/100
                      </span>
                    </div>
                    <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-500 block">Incident Edges</span>
                      <span className="text-slate-200 font-bold text-sm">
                        {entityRelationships.length} Edges
                      </span>
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                      Investigative Summary
                    </span>
                    <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                      {selectedEntity.summary}
                    </p>
                  </div>

                  {/* Direct Incident Relationships */}
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1.5">
                      Direct Graph Connections ({entityRelationships.length})
                    </span>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {entityRelationships.map(rel => (
                        <div
                          key={rel.id}
                          className="p-1.5 rounded border border-slate-800/80 bg-slate-900/40 text-[10px] flex items-center justify-between"
                        >
                          <span className="text-slate-300 truncate max-w-[150px]">
                            {rel.type}: {rel.label}
                          </span>
                          <span className="text-cyan-400">{rel.confidence}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Button to full profile */}
                  <button
                    onClick={() => navigate(`/entities/${selectedEntity.id}`)}
                    className="w-full flex items-center justify-center gap-1.5 rounded bg-cyan-600 py-2 text-xs font-semibold text-white hover:bg-cyan-500"
                  >
                    <span>Open Full Profile Dossier</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="rounded border border-slate-800 bg-[#0a1224] p-6 text-center text-slate-500 space-y-2">
                  <Users className="h-8 w-8 text-slate-600 mx-auto" />
                  <p>Click any node on the graph to synchronize the investigative dossier.</p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Synchronized Timeline Bar */}
          <div className="rounded border border-slate-800 bg-[#0a1224] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-200">
                <Calendar className="h-4 w-4 text-cyan-400" />
                Synchronized Chronology for {selectedEntity?.name || 'Selected Entity'} ({entityTimeline.length} Events)
              </div>
              <button onClick={() => navigate('/timeline')} className="text-cyan-400 hover:underline text-[11px]">
                Full Chronology Stream →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {(entityTimeline.length > 0 ? entityTimeline : allTimeline.slice(0, 3)).map(ev => (
                <div
                  key={ev.id}
                  className="p-3 rounded border border-slate-800/80 bg-slate-900/50 hover:bg-[#0f1936] transition-colors space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px] text-cyan-400">
                    <span>{ev.date} {ev.time}</span>
                    <span className="text-slate-500 uppercase">{ev.category}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200">{ev.title}</h4>
                  <p className="text-[11px] text-slate-400 font-sans line-clamp-2 leading-relaxed">
                    {ev.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EVIDENCE TAB */}
      {activeTab === 'EVIDENCE' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase text-slate-100">
              Evidentiary Records Bound to {inv.code}
            </h3>
            <button
              onClick={() => navigate('/evidence')}
              className="text-cyan-400 hover:underline"
            >
              Open Evidence Center →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {allEvidence.map(ev => (
              <div
                key={ev.id}
                onClick={() => navigate(`/evidence/${ev.id}`)}
                className="p-4 rounded border border-slate-800 bg-[#0a1224] hover:border-cyan-800 cursor-pointer transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-cyan-400 font-bold">{ev.id}</span>
                  <span className="text-[10px] text-slate-400">{ev.date}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-200">{ev.title}</h4>
                <p className="text-[11px] text-slate-400 font-sans line-clamp-2">{ev.rawContent}</p>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                  <span>{ev.provenance.sourceAgency}</span>
                  <span className="text-emerald-400 font-semibold">{ev.confidence}% Conf</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ENTITIES TAB */}
      {activeTab === 'ENTITIES' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase text-slate-100">
              Entities Identified in {inv.code}
            </h3>
            <button
              onClick={() => navigate('/entities')}
              className="text-cyan-400 hover:underline"
            >
              Open Entity Database →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {allEntities.map(ent => (
              <div
                key={ent.id}
                onClick={() => navigate(`/entities/${ent.id}`)}
                className="p-3.5 rounded border border-slate-800 bg-[#0a1224] hover:border-cyan-800 cursor-pointer transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-cyan-400 font-bold">{ent.id}</span>
                  <EntityTypeBadge type={ent.type} />
                </div>
                <div className="font-semibold text-slate-200">{ent.name}</div>
                {ent.isBridge && (
                  <span className="text-[9px] bg-rose-950 text-rose-300 border border-rose-800 px-1.5 py-0.2 rounded font-mono block">
                    CRITICAL BRIDGE (BETWEENNESS 98)
                  </span>
                )}
                <p className="text-[11px] text-slate-400 line-clamp-2">{ent.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: RELATIONSHIPS */}
      {activeTab === 'RELATIONSHIPS' && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase text-slate-100">
            Relational Graph Edges ({allRelationships.length})
          </h3>
          <div className="rounded border border-slate-800 bg-[#091122] overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0d162d] text-[10px] uppercase text-slate-400">
                  <th className="py-2.5 px-4">Edge ID</th>
                  <th className="py-2.5 px-4">Source</th>
                  <th className="py-2.5 px-4">Type</th>
                  <th className="py-2.5 px-4">Target</th>
                  <th className="py-2.5 px-4">Description</th>
                  <th className="py-2.5 px-4">Confidence</th>
                  <th className="py-2.5 px-4">Cross-Cluster</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {allRelationships.map(rel => (
                  <tr key={rel.id} className="hover:bg-slate-900/60">
                    <td className="py-2.5 px-4 font-bold text-purple-400">{rel.id}</td>
                    <td className="py-2.5 px-4 text-cyan-300">{rel.sourceId}</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-200">{rel.type}</td>
                    <td className="py-2.5 px-4 text-cyan-300">{rel.targetId}</td>
                    <td className="py-2.5 px-4 text-slate-300">{rel.label}</td>
                    <td className="py-2.5 px-4 text-emerald-400">{rel.confidence}%</td>
                    <td className="py-2.5 px-4">
                      {rel.isCrossCluster ? (
                        <span className="text-[10px] text-rose-400 font-bold">YES</span>
                      ) : (
                        <span className="text-[10px] text-slate-500">NO</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: TIMELINE */}
      {activeTab === 'TIMELINE' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase text-slate-100">
              Chronological Events Stream
            </h3>
            <button onClick={() => navigate('/timeline')} className="text-cyan-400 hover:underline">
              Advanced Filter View →
            </button>
          </div>
          <div className="space-y-2">
            {allTimeline.map(t => (
              <div key={t.id} className="p-3 rounded border border-slate-800 bg-[#0a1224] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-cyan-400 font-bold shrink-0">{t.date} {t.time}</div>
                  <div>
                    <span className="font-semibold text-slate-200">{t.title}</span>
                    <p className="text-[11px] text-slate-400 font-sans">{t.description}</p>
                  </div>
                </div>
                <div className="text-slate-500 text-[10px] uppercase shrink-0">{t.category}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: ANALYSIS */}
      {activeTab === 'ANALYSIS' && (
        <div className="space-y-4">
          <div className="rounded border border-slate-800 bg-[#0a1224] p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase text-slate-100">
              Graph Centrality & Algorithmic Lead Findings
            </h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Betweenness centrality measures the broker capacity of each node. Entity Vikram S. (P002) holds a betweenness score of 98/100, controlling communication between Cluster Alpha (Transport) and Cluster Beta (Corporate Accounts).
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/network-analysis')}
                className="rounded bg-cyan-600 px-4 py-2 font-semibold text-white hover:bg-cyan-500"
              >
                Launch Network Analysis Dashboard →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
