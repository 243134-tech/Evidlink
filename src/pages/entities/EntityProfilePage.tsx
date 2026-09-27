import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { entityService } from '../../services/entityService';
import { relationshipService } from '../../services/relationshipService';
import { evidenceService } from '../../services/evidenceService';
import { analysisService } from '../../services/analysisService';
import { auditService } from '../../services/auditService';
import { EntityTypeBadge } from '../../components/common/Badge';
import { AddAttributeModal } from '../../components/entities/AddAttributeModal';
import { EditEntityModal } from '../../components/entities/EditEntityModal';
import { CreateRelationshipModal } from '../../components/relationships/CreateRelationshipModal';
import { EntityAttribute, Entity, Relationship } from '../../types';
import { useInvestigation } from '../../context/InvestigationContext';
import {
  Users,
  ChevronLeft,
  Activity,
  FileText,
  Network,
  Calendar,
  AlertTriangle,
  FileCheck,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Phone,
  Car,
  MapPin,
  Clock,
  Printer,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  HelpCircle,
  Shield,
  History,
  GitMerge,
  Link as LinkIcon,
  Tag
} from 'lucide-react';

export const EntityProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast, setSelectedRelationshipForDrawer } = useInvestigation();

  const [refreshKey, setRefreshKey] = useState(0);

  // Lookup entity with fallback
  const entity = (id ? entityService.getById(id) : null) || entityService.getAll()[0];

  const allRelationships = relationshipService.getAll();
  const allEvidence = evidenceService.getAll();
  const allTimeline = analysisService.getTimelineEvents();
  const auditLogs = auditService.getByTarget(entity?.id || '');

  const [activeTab, setActiveTab] = useState<
    'OVERVIEW' | 'ATTRIBUTES' | 'RELATIONSHIPS' | 'EVIDENCE' | 'TIMELINE' | 'NETWORK' | 'NOTES' | 'AUDIT'
  >('OVERVIEW');

  const [isAddAttrOpen, setIsAddAttrOpen] = useState(false);
  const [attrToEdit, setAttrToEdit] = useState<EntityAttribute | null>(null);
  const [isEditEntityOpen, setIsEditEntityOpen] = useState(false);
  const [isAddRelOpen, setIsAddRelOpen] = useState(false);

  const [newNote, setNewNote] = useState('');
  const [noteCategory, setNoteCategory] = useState<'OBSERVATION' | 'LEGAL' | 'DIRECTIVE' | 'VERIFICATION'>('OBSERVATION');

  if (!entity) {
    return (
      <div className="p-8 text-center font-mono text-slate-400">
        Entity record not found. <button onClick={() => navigate('/entities')} className="text-cyan-400 underline ml-2">Return to Entity Registry</button>
      </div>
    );
  }

  // Connected relationships
  const connectedRelationships = allRelationships.filter(
    r => r.sourceId === entity.id || r.targetId === entity.id ||
         (entity.legacyId && (r.sourceId === entity.legacyId || r.targetId === entity.legacyId))
  );

  // Connected entities
  const connectedEntityIds = new Set<string>();
  connectedRelationships.forEach(r => {
    if (r.sourceId !== entity.id && r.sourceId !== entity.legacyId) connectedEntityIds.add(r.sourceId);
    if (r.targetId !== entity.id && r.targetId !== entity.legacyId) connectedEntityIds.add(r.targetId);
  });
  const connectedEntities = Array.from(connectedEntityIds)
    .map(eid => entityService.getById(eid))
    .filter(Boolean) as Entity[];

  // Evidence records
  const relatedEvidence = allEvidence.filter(ev =>
    ev.entityIds.includes(entity.id) || (entity.legacyId && ev.entityIds.includes(entity.legacyId))
  );

  // Timeline events
  const relatedTimeline = allTimeline.filter(t =>
    t.relatedEntityIds.includes(entity.id) || (entity.legacyId && t.relatedEntityIds.includes(entity.legacyId))
  );

  // Group attributes by category
  const customAttributes = entity.customAttributes || [];
  const attributesByCategory = customAttributes.reduce((acc, attr) => {
    if (!acc[attr.category]) acc[attr.category] = [];
    acc[attr.category].push(attr);
    return acc;
  }, {} as Record<string, EntityAttribute[]>);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    entityService.addNoteToEntity(entity.id, newNote.trim(), noteCategory);
    setNewNote('');
    setRefreshKey(k => k + 1);
    showToast(`Investigator note logged on ${entity.id} profile.`);
  };

  const handleVerifyAttribute = (attrId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'VERIFIED' ? 'UNCERTAIN' : 'VERIFIED';
    entityService.updateAttribute(entity.id, attrId, {
      verificationStatus: nextStatus as any
    });
    setRefreshKey(k => k + 1);
    showToast(`Attribute verification state changed to ${nextStatus}.`);
  };

  const handleRemoveAttribute = (attrId: string, attrLabel: string) => {
    if (window.confirm(`Remove attribute '${attrLabel}' from ${entity.name}?`)) {
      entityService.removeAttribute(entity.id, attrId);
      setRefreshKey(k => k + 1);
      showToast(`Attribute '${attrLabel}' removed.`);
    }
  };

  const handleExportDossier = () => {
    window.print();
  };

  return (
    <div key={refreshKey} className="space-y-6 font-mono text-xs text-slate-200">
      {/* Back button & Primary Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <button
            onClick={() => navigate('/entities')}
            className="flex items-center gap-1.5 text-cyan-400 hover:underline mb-1 text-[11px]"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Back to Entity Registry</span>
          </button>

          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold uppercase text-slate-100 font-sans">
              {entity.name}
            </h1>
            <EntityTypeBadge type={entity.type} />
            <span className={`rounded px-2 py-0.5 text-[10px] font-bold border ${
              entity.verificationStatus === 'VERIFIED'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                : entity.verificationStatus === 'UNCERTAIN'
                ? 'bg-amber-950 text-amber-300 border-amber-800'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}>
              {entity.verificationStatus || 'NEEDS_VERIFICATION'}
            </span>

            {entity.isBridge && (
              <span className="rounded border border-rose-800 bg-rose-950 px-2 py-0.5 text-[10px] font-bold text-rose-300 animate-pulse">
                CRITICAL STRUCTURAL BRIDGE
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-slate-400 text-xs font-sans mt-1">
            <span>
              Stable ID: <strong className="text-cyan-300 font-mono">{entity.id}</strong>
              {entity.legacyId && entity.legacyId !== entity.id && (
                <span className="text-slate-500 font-mono ml-1">({entity.legacyId})</span>
              )}
            </span>
            <span>·</span>
            <span>Cluster: <strong className="text-slate-200">{entity.communityId || 'CLUSTER_ALPHA'}</strong></span>
            <span>·</span>
            <span>Confidence: <strong className="text-cyan-400 font-mono">{entity.confidence}%</strong></span>
            <span>·</span>
            <span>Last Updated: <strong className="text-slate-300 font-mono">{entity.updatedAt || entity.lastObserved}</strong></span>
          </div>
        </div>

        {/* Top Action Buttons Bar */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setIsEditEntityOpen(true)}
            className="flex items-center gap-1.5 rounded border border-slate-700 bg-[#0e1730] px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <Edit2 className="h-3.5 w-3.5 text-cyan-400" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={() => setIsAddAttrOpen(true)}
            className="flex items-center gap-1.5 rounded border border-cyan-800 bg-cyan-950/60 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-900/60 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Attribute</span>
          </button>

          <button
            onClick={() => setIsAddRelOpen(true)}
            className="flex items-center gap-1.5 rounded border border-cyan-800 bg-cyan-950/60 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-900/60 transition-colors"
          >
            <LinkIcon className="h-3.5 w-3.5" />
            <span>Add Relationship</span>
          </button>

          <button
            onClick={() => navigate('/resolution')}
            className="flex items-center gap-1.5 rounded border border-purple-900/60 bg-purple-950/40 px-3 py-1.5 text-xs font-semibold text-purple-300 hover:bg-purple-900/50 transition-colors"
          >
            <GitMerge className="h-3.5 w-3.5" />
            <span>Disambiguate</span>
          </button>

          <button
            onClick={handleExportDossier}
            className="flex items-center gap-1.5 rounded border border-slate-700 bg-[#0e1730] px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            title="Export or Print Dossier"
          >
            <Printer className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Print / Export</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-800 text-xs overflow-x-auto">
        {[
          { id: 'OVERVIEW', label: 'Dossier Overview' },
          { id: 'ATTRIBUTES', label: `Attributes (${customAttributes.length + Object.keys(entity.identifiers || {}).length})` },
          { id: 'RELATIONSHIPS', label: `Connected Relationships (${connectedRelationships.length})` },
          { id: 'EVIDENCE', label: `Supporting Evidence (${relatedEvidence.length})` },
          { id: 'TIMELINE', label: `Activity Timeline (${relatedTimeline.length})` },
          { id: 'NETWORK', label: `Ego Network (${connectedEntities.length})` },
          { id: 'NOTES', label: `Investigator Notes (${(entity.notesList || []).length + (entity.notes ? 1 : 0)})` },
          { id: 'AUDIT', label: `Audit Trail (${auditLogs.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2.5 -mb-px font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-cyan-400 text-cyan-400 bg-cyan-950/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded border border-slate-800 bg-[#0c162f] p-3.5">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Betweenness Centrality</div>
              <div className="text-xl font-bold text-cyan-400 mt-1">
                {entity.betweennessScore ?? (entity.isBridge ? 98 : 45)}/100
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {entity.isBridge ? 'Critical Inter-Cluster Broker' : 'Standard Cluster Node'}
              </div>
            </div>

            <div className="rounded border border-slate-800 bg-[#0c162f] p-3.5">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Direct Network Degree</div>
              <div className="text-xl font-bold text-slate-100 mt-1">
                {connectedRelationships.length} Links
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Across {connectedEntities.length} unique entities
              </div>
            </div>

            <div className="rounded border border-slate-800 bg-[#0c162f] p-3.5">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Corroborated Evidence</div>
              <div className="text-xl font-bold text-emerald-400 mt-1">
                {relatedEvidence.length} Records
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                FIR, CDR & ANPR Cross-Matched
              </div>
            </div>

            <div className="rounded border border-slate-800 bg-[#0c162f] p-3.5">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Operational Status</div>
              <div className="text-xl font-bold text-slate-100 mt-1 flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
                <span>{entity.status}</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Active in Operation Meridian
              </div>
            </div>
          </div>

          {/* Executive Summary & Aliases */}
          <div className="rounded border border-slate-800 bg-[#0c162f] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                Analytical Intelligence Summary
              </span>
              <button
                onClick={() => setIsEditEntityOpen(true)}
                className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
              >
                <Edit2 className="h-3 w-3" />
                <span>Modify Summary</span>
              </button>
            </div>
            <p className="text-xs text-slate-200 font-sans leading-relaxed">
              {entity.summary}
            </p>

            {/* Aliases */}
            {entity.aliases && entity.aliases.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Identified Aliases:</span>
                {entity.aliases.map((alias, i) => (
                  <span key={i} className="rounded border border-slate-700 bg-slate-800/90 px-2 py-0.5 text-[11px] text-slate-200">
                    {alias}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Quick Identifiers Grid */}
          <div className="rounded border border-slate-800 bg-[#0c162f] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-cyan-400" />
                Primary Regulatory & Forensic Identifiers
              </span>
              <button
                onClick={() => setIsAddAttrOpen(true)}
                className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                <span>Add Custom Field</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.entries(entity.identifiers || {}).map(([k, v]) => (
                <div key={k} className="rounded border border-slate-800/90 bg-[#080e1e] p-2.5">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">{k}</div>
                  <div className="font-bold text-slate-100 mt-1 font-mono text-xs">{v}</div>
                </div>
              ))}

              {customAttributes.slice(0, 3).map(attr => (
                <div key={attr.id} className="rounded border border-slate-800/90 bg-[#080e1e] p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">{attr.label}</span>
                    <span className={`text-[9px] font-bold ${attr.verificationStatus === 'VERIFIED' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {attr.verificationStatus}
                    </span>
                  </div>
                  <div className="font-bold text-slate-100 mt-1 font-mono text-xs truncate">{attr.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bridge Role Explanation if applicable */}
          {entity.isBridge && (
            <div className="rounded border border-rose-800/80 bg-rose-950/20 p-4 space-y-2">
              <div className="flex items-center gap-2 text-rose-300 font-bold uppercase tracking-wider text-xs">
                <AlertTriangle className="h-4 w-4 text-rose-400" />
                Topological Bridge Role Analysis (WHY THIS ENTITY?)
              </div>
              <p className="text-xs text-rose-200/90 font-sans leading-relaxed">
                Graph analysis isolates {entity.name} as the sole structural intermediary connecting Cluster Alpha (fleet logistics & transport trucks) to Cluster Beta (shell corporations & financial funnels). Communication records show late-night CDR calls immediately preceding 3 high-volume RTGS transfers.
              </p>
              <div className="pt-2 flex items-center gap-3 text-[11px]">
                <button
                  onClick={() => navigate('/graph')}
                  className="text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                >
                  <span>Focus in Tactical Graph</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
                <span className="text-slate-500">·</span>
                <button
                  onClick={() => navigate('/network-analysis')}
                  className="text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                >
                  <span>View Centrality Calculations</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ATTRIBUTES (FULL CRUD & VERIFICATION) */}
      {activeTab === 'ATTRIBUTES' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-400">
              Manage structured biometric, contact, and regulatory attributes. Every modification generates an immutable audit record.
            </div>
            <button
              onClick={() => setIsAddAttrOpen(true)}
              className="flex items-center gap-1.5 rounded bg-cyan-600 px-3 py-1.5 font-bold text-white hover:bg-cyan-500 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Attribute</span>
            </button>
          </div>

          {/* Built-in Identifiers Card */}
          <div className="rounded border border-slate-800 bg-[#0c162f] p-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              Core Ingestion Identifiers
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(entity.identifiers || {}).map(([key, val]) => (
                <div key={key} className="rounded border border-slate-800 bg-[#080e1e] p-3">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">{key}</div>
                  <div className="font-bold text-slate-100 text-sm mt-1">{val}</div>
                  <div className="mt-2 text-[10px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Verified via Agency Intake</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom & Managed Attributes Grouped by Category */}
          {Object.keys(attributesByCategory).length === 0 ? (
            <div className="rounded border border-dashed border-slate-800 p-8 text-center text-slate-400">
              <p>No custom attributes added yet.</p>
              <button
                onClick={() => setIsAddAttrOpen(true)}
                className="mt-2 text-cyan-400 underline font-bold"
              >
                + Add First Attribute
              </button>
            </div>
          ) : (
            Object.entries(attributesByCategory).map(([cat, attrs]) => (
              <div key={cat} className="rounded border border-slate-800 bg-[#0c162f] p-4 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  {cat} Attributes ({attrs.length})
                </div>

                <div className="space-y-2">
                  {attrs.map(attr => (
                    <div
                      key={attr.id}
                      className="rounded border border-slate-800 bg-[#080e1e] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">{attr.label}</span>
                          <span className="text-[10px] text-slate-500 font-mono">({attr.key})</span>
                          <span className={`rounded px-1.5 py-0.2 text-[9px] font-bold border ${
                            attr.verificationStatus === 'VERIFIED'
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                              : attr.verificationStatus === 'UNCERTAIN'
                              ? 'bg-amber-950 text-amber-300 border-amber-800'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}>
                            {attr.verificationStatus}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-slate-100 font-mono truncate">{attr.value}</div>
                        {attr.notes && (
                          <div className="text-[11px] text-slate-400 font-sans italic">
                            "{attr.notes}"
                          </div>
                        )}
                        {attr.sourceEvidenceId && (
                          <div className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                            <span>Evidence Source: {attr.sourceEvidenceId}</span>
                            {attr.verifiedBy && <span>· Verified by {attr.verifiedBy}</span>}
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => handleVerifyAttribute(attr.id, attr.verificationStatus)}
                          className={`rounded px-2.5 py-1 text-[11px] font-semibold transition-colors border ${
                            attr.verificationStatus === 'VERIFIED'
                              ? 'border-amber-700 bg-amber-950/50 text-amber-300 hover:bg-amber-900/50'
                              : 'border-emerald-700 bg-emerald-950/50 text-emerald-300 hover:bg-emerald-900/50'
                          }`}
                        >
                          {attr.verificationStatus === 'VERIFIED' ? 'Mark Uncertain' : 'Mark Verified'}
                        </button>

                        <button
                          onClick={() => {
                            setAttrToEdit(attr);
                            setIsAddAttrOpen(true);
                          }}
                          className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-cyan-400"
                          title="Edit Attribute"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => handleRemoveAttribute(attr.id, attr.label)}
                          className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-rose-400"
                          title="Remove Attribute"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: RELATIONSHIPS */}
      {activeTab === 'RELATIONSHIPS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-400">
              All direct first-class connections. Click any row to open the full relationship specification drawer.
            </div>
            <button
              onClick={() => setIsAddRelOpen(true)}
              className="flex items-center gap-1.5 rounded bg-cyan-600 px-3 py-1.5 font-bold text-white hover:bg-cyan-500 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Relationship</span>
            </button>
          </div>

          <div className="space-y-2">
            {connectedRelationships.length === 0 ? (
              <div className="rounded border border-dashed border-slate-800 p-8 text-center text-slate-400">
                No active relationships connected to this entity.
              </div>
            ) : (
              connectedRelationships.map(rel => {
                const otherEntityId = rel.sourceId === entity.id || rel.sourceId === entity.legacyId ? rel.targetId : rel.sourceId;
                const otherEntity = entityService.getById(otherEntityId);
                const isOutgoing = rel.sourceId === entity.id || rel.sourceId === entity.legacyId;

                return (
                  <div
                    key={rel.id}
                    onClick={() => setSelectedRelationshipForDrawer(rel)}
                    className="rounded border border-slate-800 bg-[#0c162f] p-3.5 hover:border-cyan-700 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-cyan-400 text-xs font-mono">{rel.id}</span>
                        <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[10px] text-slate-200 font-bold">
                          {rel.type}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {isOutgoing ? '→ Outgoing' : '← Incoming'}
                        </span>
                        {rel.isCrossCluster && (
                          <span className="rounded bg-rose-950 px-1.5 py-0.2 text-[9px] font-bold text-rose-300 border border-rose-800">
                            CROSS-CLUSTER
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
                        <span>Connected to:</span>
                        <span className="text-cyan-300 group-hover:underline">
                          {otherEntity?.name || otherEntityId}
                        </span>
                        {otherEntity && <EntityTypeBadge type={otherEntity.type} />}
                      </div>

                      <div className="text-[11px] text-slate-400 font-sans">
                        {rel.details || `${rel.label}`}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                      <div className="text-right">
                        <div className="text-slate-400 text-[10px]">CONFIDENCE</div>
                        <div className="font-bold text-cyan-400">{rel.confidence}%</div>
                      </div>
                      <div className="text-right">
                        <div className="text-slate-400 text-[10px]">EVIDENCE</div>
                        <div className="text-slate-200">{rel.evidenceIds.length} files</div>
                      </div>
                      <ChevronLeft className="h-4 w-4 text-slate-500 rotate-180 group-hover:text-cyan-400 transition-colors" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 4: EVIDENCE */}
      {activeTab === 'EVIDENCE' && (
        <div className="space-y-3">
          <div className="text-xs text-slate-400">
            Evidentiary filings and forensic extracts citing {entity.name}:
          </div>

          {relatedEvidence.length === 0 ? (
            <div className="rounded border border-dashed border-slate-800 p-8 text-center text-slate-400">
              No formal evidence files currently cite this entity.
            </div>
          ) : (
            relatedEvidence.map(ev => (
              <div
                key={ev.id}
                className="rounded border border-slate-800 bg-[#0c162f] p-4 hover:border-slate-700 transition-colors space-y-2.5"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cyan-400">{ev.id}</span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                      {ev.type}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">
                      SHA-256 Validated
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">{ev.date}</span>
                </div>

                <div className="font-bold text-slate-100 text-sm font-sans">{ev.title}</div>

                {ev.extractedSnippet && (
                  <div className="rounded bg-[#080e1e] p-2.5 text-xs text-slate-300 italic border-l-2 border-cyan-500 font-mono">
                    "{ev.extractedSnippet}"
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  <span>Source: {ev.provenance?.sourceAgency || 'Delhi Crime Branch'} (Chain ID: {ev.provenance?.chainOfCustodyId || 'CC-9912'})</span>
                  <button
                    onClick={() => navigate(`/evidence/${ev.id}`)}
                    className="text-cyan-400 hover:text-cyan-300 underline flex items-center gap-1 font-mono"
                  >
                    <span>Inspect Raw Record</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 5: TIMELINE */}
      {activeTab === 'TIMELINE' && (
        <div className="space-y-3">
          <div className="text-xs text-slate-400">
            Chronological observed activity involving {entity.name}:
          </div>

          <div className="space-y-2">
            {relatedTimeline.length === 0 ? (
              <div className="rounded border border-dashed border-slate-800 p-8 text-center text-slate-400">
                No activity timeline events recorded for this entity.
              </div>
            ) : (
              relatedTimeline.map(evt => (
                <div key={evt.id} className="rounded border border-slate-800 bg-[#0c162f] p-3 flex items-start gap-3">
                  <div className="shrink-0 text-center w-20 pt-1">
                    <div className="font-bold text-cyan-400 text-xs">{evt.time || '18:30'}</div>
                    <div className="text-[10px] text-slate-400">{evt.date}</div>
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100 text-xs font-sans">{evt.title}</span>
                      <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[9px] text-slate-300 font-mono">
                        {evt.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">{evt.description}</p>
                    {evt.locationName && (
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-cyan-400" />
                        <span>{evt.locationName}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 6: EGO NETWORK */}
      {activeTab === 'NETWORK' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-400">
              Immediate 1-hop topological neighbors ({connectedEntities.length} entities connected):
            </div>
            <button
              onClick={() => navigate('/graph')}
              className="rounded border border-cyan-700 bg-cyan-950 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-900 transition-colors"
            >
              Open Interactive Graph Canvas
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {connectedEntities.map(ent => (
              <div
                key={ent.id}
                onClick={() => navigate(`/entities/${ent.id}`)}
                className="rounded border border-slate-800 bg-[#0c162f] p-3.5 hover:border-cyan-700 cursor-pointer transition-colors space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <EntityTypeBadge type={ent.type} />
                  <span className="text-[10px] text-cyan-400 font-mono">{ent.id}</span>
                </div>
                <div className="font-bold text-slate-100 text-sm group-hover:underline truncate font-sans">
                  {ent.name}
                </div>
                <p className="text-[11px] text-slate-400 font-sans line-clamp-2 leading-relaxed">
                  {ent.summary}
                </p>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Cluster: {ent.communityId}</span>
                  <span className="text-cyan-400 group-hover:text-cyan-300">View Dossier →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: INVESTIGATOR NOTES */}
      {activeTab === 'NOTES' && (
        <div className="space-y-4">
          {/* Form */}
          <form onSubmit={handleAddNote} className="space-y-2 rounded border border-slate-800 bg-[#0c162f] p-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Log Formal Case Observation
              </label>
              <select
                value={noteCategory}
                onChange={e => setNoteCategory(e.target.value as any)}
                className="rounded border border-slate-700 bg-[#080e1e] px-2 py-1 text-slate-200 text-xs focus:outline-hidden"
              >
                <option value="OBSERVATION">OBSERVATION</option>
                <option value="DIRECTIVE">DIRECTIVE</option>
                <option value="LEGAL">LEGAL ATTESTATION</option>
                <option value="VERIFICATION">FIELD VERIFICATION</option>
              </select>
            </div>

            <textarea
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              placeholder="Record surveillance observations, telephone intercept findings, or supervisory directions..."
              rows={3}
              className="w-full rounded border border-slate-700 bg-[#080e1e] p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-hidden"
              required
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded bg-cyan-600 px-4 py-1.5 font-bold text-white hover:bg-cyan-500 transition-colors"
              >
                Record Note to Case File
              </button>
            </div>
          </form>

          {/* Notes list */}
          <div className="space-y-2.5">
            {(entity.notesList || []).map(n => (
              <div key={n.id} className="rounded border border-slate-800 bg-[#0c162f] p-3.5 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1.5 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">{n.author}</span>
                    <span className="text-slate-500">({n.authorRole})</span>
                    <span className="rounded bg-cyan-950 px-1.5 py-0.2 text-cyan-300 font-bold border border-cyan-800 text-[9px]">
                      {n.category}
                    </span>
                  </div>
                  <span>{n.timestamp}</span>
                </div>
                <p className="text-xs text-slate-200 font-sans leading-relaxed">{n.content}</p>
              </div>
            ))}

            {entity.notes && (
              <div className="rounded border border-slate-800 bg-[#0c162f] p-3.5 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1.5 border-b border-slate-800">
                  <span className="font-bold text-slate-200">Inspector Raman Kumar (Intake Note)</span>
                  <span>{entity.createdAt}</span>
                </div>
                <p className="text-xs text-slate-200 font-sans leading-relaxed">{entity.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 8: AUDIT HISTORY */}
      {activeTab === 'AUDIT' && (
        <div className="space-y-3">
          <div className="text-xs text-slate-400">
            Immutable chain of modifications, attribute additions, and verifications recorded on this entity:
          </div>

          <div className="space-y-2">
            {auditLogs.length === 0 ? (
              <div className="rounded border border-dashed border-slate-800 p-8 text-center text-slate-400">
                Entity registered during initial investigation intake. No modifications recorded.
              </div>
            ) : (
              auditLogs.map(log => (
                <div key={log.id} className="rounded border border-slate-800 bg-[#0c162f] p-3.5 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 font-bold font-mono">{log.id}</span>
                      <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[9px] text-slate-200 font-bold">
                        {log.action}
                      </span>
                    </div>
                    <span>{log.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-200 font-sans leading-relaxed mt-1">{log.details}</p>

                  <div className="text-[10px] text-slate-400 pt-1">
                    Officer: <strong className="text-slate-300">{log.userName}</strong> ({log.userRole})
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <AddAttributeModal
        entity={entity}
        attributeToEdit={attrToEdit}
        isOpen={isAddAttrOpen}
        onClose={() => {
          setIsAddAttrOpen(false);
          setAttrToEdit(null);
        }}
        onSuccess={() => setRefreshKey(k => k + 1)}
      />

      <EditEntityModal
        entity={entity}
        isOpen={isEditEntityOpen}
        onClose={() => setIsEditEntityOpen(false)}
        onSuccess={() => setRefreshKey(k => k + 1)}
      />

      <CreateRelationshipModal
        defaultSourceId={entity.id}
        isOpen={isAddRelOpen}
        onClose={() => setIsAddRelOpen(false)}
        onSuccess={() => setRefreshKey(k => k + 1)}
      />
    </div>
  );
};
