import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvestigation, DEMO_PERSONAS } from '../../context/InvestigationContext';
import { entityService } from '../../services/entityService';
import { evidenceService } from '../../services/evidenceService';
import { relationshipService } from '../../services/relationshipService';
import { analysisService } from '../../services/analysisService';
import { investigationService } from '../../services/investigationService';
import { StatCard } from '../../components/common/StatCard';
import { InvestigationGraph } from '../../components/graph/InvestigationGraph';
import { EntityTypeBadge, LeadPriorityBadge } from '../../components/common/Badge';
import {
  FolderOpen,
  FileText,
  Users,
  Network,
  AlertTriangle,
  Flame,
  ArrowRight,
  HelpCircle,
  ExternalLink,
  Calendar,
  Clock,
  Layers,
  ChevronRight,
  ShieldCheck,
  Activity,
  Play,
  Zap,
  Radio,
  Lock,
  Compass,
  CheckCircle2,
  FileCheck2,
  GitMerge,
  Cpu,
  Sparkles,
  Download
} from 'lucide-react';
import { Entity, AnalyticalLead } from '../../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentInvestigation,
    currentUser,
    switchPersona,
    setSelectedLeadForProvenance,
    setIsUploadPipelineOpen,
    triggerDemoMode,
    triggerBootloader,
    liveInterceptLogs,
    showToast
  } = useInvestigation();

  const entities = entityService.getAll();
  const relationships = relationshipService.getAll();
  const evidence = evidenceService.getAll();
  const leads = analysisService.getAllLeads();
  const timeline = analysisService.getTimelineEvents();
  const investigations = investigationService.getAll();

  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live real-time clock ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const criticalLeads = leads.filter(l => l.priority === 'CRITICAL');
  const bridgeEntities = entities.filter(e => e.isBridge);

  // Group evidence by source type
  const evidenceByType = evidence.reduce((acc, ev) => {
    acc[ev.type] = (acc[ev.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleFocusBridge = () => {
    const bridge = entities.find(e => e.id === 'PER-002' || e.id === 'P002');
    if (bridge) {
      setSelectedEntity(bridge);
      showToast('Bridge Node Focused: Vikram S. (PER-002) - Betweenness 98/100');
    }
  };

  return (
    <div className="space-y-5 font-mono text-xs text-slate-200">
      {/* TOP TACTICAL TELEMETRY STRIP */}
      <div className="rounded-lg border border-cyan-900/60 bg-[#060c1d] p-3 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        {/* Left: Officer Identification & Clearance */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full border border-cyan-500 bg-cyan-950 flex items-center justify-center text-cyan-300 font-bold text-xs shrink-0 shadow-inner">
            {currentUser.avatarInitials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 font-sans text-xs">{currentUser.name}</span>
              <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded font-bold">
                {currentUser.clearanceLevel.replace('_', ' ')}
              </span>
              <span className="text-[9px] text-cyan-400 font-mono hidden sm:inline">
                [{currentUser.badgeNumber}]
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-sans">
              {currentUser.agency}
            </div>
          </div>
        </div>

        {/* Center: Real-Time Live Clock & Cryptographic Status */}
        <div className="hidden md:flex items-center gap-4 text-[11px] border-l border-r border-slate-800 px-4">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Clock className="h-3.5 w-3.5 text-cyan-400" />
            <span>IST: {currentTime.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false })}</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>§65B HSM: VERIFIED</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Radio className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <span>AIR-GAPPED NODE</span>
          </div>
        </div>

        {/* Right: Quick Persona Switcher & Bootloader Trigger */}
        <div className="flex items-center gap-2">
          {/* Persona Switcher Dropdown */}
          <select
            value={currentUser.id}
            onChange={e => switchPersona(e.target.value)}
            className="rounded border border-slate-700 bg-[#091226] px-2 py-1 text-[11px] text-slate-200 focus:outline-hidden"
            title="Switch Investigator Persona for Evaluation"
          >
            {DEMO_PERSONAS.map(p => (
              <option key={p.id} value={p.id}>
                👤 {p.name.split(' ')[0]} {p.name.split(' ')[1]} ({p.agency.split(' ')[0]})
              </option>
            ))}
          </select>

          {/* Animated Bootloader Trigger */}
          <button
            onClick={() => navigate('/launch')}
            className="flex items-center gap-1.5 rounded border border-cyan-600 bg-cyan-950/80 px-2.5 py-1 text-cyan-300 hover:bg-cyan-900 transition-colors font-bold shadow-xs text-[11px]"
            title="Run Full Animated Tactical Boot Sequence with Audio & Radar"
          >
            <Zap className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <span>Launch Bootloader</span>
          </button>
        </div>
      </div>

      {/* WELCOME BANNER & ACTION LAUNCHPAD */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-cyan-400 uppercase tracking-wider font-semibold">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>Investigative Command Console · Active Workspace</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-100 font-sans mt-0.5">
            {currentInvestigation?.title || 'Operation Meridian'}
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Case Code: <strong className="text-slate-200">{currentInvestigation?.code}</strong> · Cross-Correlating Multi-Jurisdictional Police, Telecom, Toll & Hawala Ledgers
          </p>
        </div>

        {/* Action Launchpad Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={triggerDemoMode}
            className="flex items-center gap-1.5 rounded border border-amber-500/50 bg-amber-950/40 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-900/50 transition-colors shadow-xs"
          >
            <Play className="h-3.5 w-3.5 text-amber-400" />
            <span>13-Scene Tour</span>
          </button>

          <button
            onClick={handleFocusBridge}
            className="flex items-center gap-1.5 rounded border border-rose-800 bg-rose-950/50 px-3 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-900/60 transition-colors shadow-xs"
          >
            <Radio className="h-3.5 w-3.5 text-rose-400 animate-pulse" />
            <span>Isolate Bridge (Vikram S.)</span>
          </button>

          <button
            onClick={() => setIsUploadPipelineOpen(true)}
            className="flex items-center gap-1.5 rounded bg-cyan-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-cyan-500 transition-colors shadow-xs"
          >
            <span>Ingest Evidence</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* SYNDICATE TOPOLOGY SUMMARY CARPET */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-lg border border-slate-800 bg-[#070e20] p-3 text-xs">
        {/* Cluster Alpha Card */}
        <div className="rounded border border-blue-900/60 bg-blue-950/20 p-2.5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-blue-400 uppercase font-bold tracking-wider">
              Cluster Alpha: Ground Logistics
            </span>
            <span className="text-[9px] bg-blue-950 border border-blue-800 text-blue-300 px-1.5 rounded font-mono">
              11 NODES
            </span>
          </div>
          <div className="text-slate-300 font-sans text-[11px]">
            Devraj Anand Fleet (DL-04-TC-8812) · Kundli Toll & Alipur Depot Corridors
          </div>
          <div className="text-[10px] text-slate-400 flex justify-between pt-1 border-t border-blue-900/40">
            <span>42 CDR Calls</span>
            <span className="text-blue-300 font-bold">Physical Transit</span>
          </div>
        </div>

        {/* Structural Bridge Card */}
        <div className="rounded border border-amber-500/70 bg-amber-950/20 p-2.5 space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider flex items-center gap-1">
              <Zap className="h-3 w-3 text-amber-400" />
              Structural Bridge Conduit
            </span>
            <span className="text-[9px] bg-rose-950 border border-rose-800 text-rose-300 px-1.5 rounded font-mono font-bold animate-pulse">
              BETWEENNESS: 98
            </span>
          </div>
          <div className="text-slate-200 font-sans text-[11px] font-semibold">
            Vikram S. (PER-002) · Sole Operational Bridge
          </div>
          <div className="text-[10px] text-slate-400 flex justify-between pt-1 border-t border-amber-900/40">
            <span className="text-amber-300">Links Fleet to Hawala</span>
            <button onClick={handleFocusBridge} className="text-cyan-400 underline font-bold">
              Focus Node →
            </button>
          </div>
        </div>

        {/* Cluster Beta Card */}
        <div className="rounded border border-purple-900/60 bg-purple-950/20 p-2.5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-purple-400 uppercase font-bold tracking-wider">
              Cluster Beta: Corporate Shells
            </span>
            <span className="text-[9px] bg-purple-950 border border-purple-800 text-purple-300 px-1.5 rounded font-mono">
              12 NODES
            </span>
          </div>
          <div className="text-slate-300 font-sans text-[11px]">
            Sanjay Singhania Escrow · HDFC #4910 & ICICI #3340 Hawala Passthroughs
          </div>
          <div className="text-[10px] text-slate-400 flex justify-between pt-1 border-t border-purple-900/40">
            <span className="text-purple-300 font-bold">₹1.45 Cr Escrow</span>
            <span>23-Min Funneling</span>
          </div>
        </div>
      </div>

      {/* LIVE INTERCEPT TELEMETRY MONITOR (Real-World Streaming Feed) */}
      <div className="rounded-lg border border-cyan-900/70 bg-[#050c1e] p-3 space-y-2 shadow-lg">
        <div className="flex items-center justify-between pb-1.5 border-b border-cyan-950">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 font-mono">
              Live Intercept & SIGINT Telemetry Stream
            </span>
            <span className="text-[9px] bg-cyan-950 border border-cyan-800 text-cyan-300 px-1.5 py-0.2 rounded font-mono">
              FEED ACTIVE
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <span>Sensors: 4 Intercepts · 6 Toll Cameras · 12 BTS Arrays</span>
            <button
              onClick={() => navigate('/communications')}
              className="text-cyan-400 hover:underline font-bold"
            >
              Open Signals Hub →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {liveInterceptLogs.slice(0, 4).map(log => (
            <div
              key={log.id}
              className={`p-2 rounded border text-[11px] font-mono transition-all flex flex-col justify-between ${
                log.severity === 'CRITICAL'
                  ? 'border-rose-800/80 bg-rose-950/20 text-rose-200 shadow-[0_0_8px_rgba(244,63,94,0.15)]'
                  : log.severity === 'HIGH'
                  ? 'border-amber-800/80 bg-amber-950/20 text-amber-200'
                  : 'border-slate-800 bg-slate-900/50 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-[9px] text-slate-400 pb-1 mb-1 border-b border-slate-800/60">
                <span className="font-bold text-cyan-400">[{log.category}]</span>
                <span>{log.timestamp}</span>
              </div>
              <p className="line-clamp-2 text-[10px] leading-tight font-sans text-slate-200">
                {log.message}
              </p>
              <div className="pt-1.5 mt-1 flex items-center justify-between text-[9px] text-slate-400">
                <span className="truncate max-w-[120px]">{log.source}</span>
                <span className={`px-1 rounded text-[8px] font-bold ${
                  log.severity === 'CRITICAL' ? 'bg-rose-900 text-rose-100' : 'bg-slate-800 text-slate-300'
                }`}>
                  {log.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6 TOP STAT CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          label="Active Cases"
          value={investigations.length}
          subValue="3 Total"
          icon={<FolderOpen className="h-4 w-4" />}
          change="3 In Progress"
          changeType="neutral"
          onClick={() => navigate('/investigations')}
        />
        <StatCard
          label="Evidence Items"
          value={evidence.length}
          icon={<FileText className="h-4 w-4" />}
          change="+18 Validated"
          changeType="positive"
          onClick={() => navigate('/evidence')}
        />
        <StatCard
          label="Entities Identified"
          value={entities.length}
          icon={<Users className="h-4 w-4" />}
          change="2 Clusters"
          changeType="neutral"
          onClick={() => navigate('/entities')}
        />
        <StatCard
          label="Relationships"
          value={relationships.length}
          icon={<Network className="h-4 w-4" />}
          change="8 Cross-Cluster"
          changeType="positive"
          onClick={() => navigate('/graph')}
        />
        <StatCard
          label="Analytical Leads"
          value={leads.length}
          icon={<AlertTriangle className="h-4 w-4 text-amber-400" />}
          change="100% Provenance"
          changeType="neutral"
          onClick={() => navigate('/leads')}
        />
        <StatCard
          label="High-Priority Leads"
          value={criticalLeads.length}
          icon={<Flame className="h-4 w-4 text-rose-400" />}
          change="Critical Bridge"
          changeType="critical"
          onClick={() => navigate('/leads')}
        />
      </div>

      {/* MAIN DUAL GRID: Investigation Graph (Left 8 cols) + Priority Leads (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Tactical Graph Canvas */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-xs bg-cyan-400"></span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-100 font-mono">
                Topological Investigation Graph · {currentInvestigation?.code}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Drag to pan · Scroll to zoom · Click nodes to inspect
              </span>
              <button
                onClick={() => navigate('/graph')}
                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:underline font-bold"
              >
                <span>Full Graph Canvas</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Graph Component */}
          <InvestigationGraph
            entities={entities}
            relationships={relationships}
            selectedEntityId={selectedEntity?.id}
            onSelectEntity={ent => setSelectedEntity(ent)}
            height={520}
          />

          {/* Selected Entity Micro Dossier Bar */}
          {selectedEntity ? (
            <div className="rounded border border-cyan-800/80 bg-[#0c162e] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-150">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded border border-cyan-700 bg-cyan-950 flex items-center justify-center text-cyan-300 font-bold text-sm font-mono">
                  {selectedEntity.id}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-100 font-sans">{selectedEntity.name}</span>
                    <EntityTypeBadge type={selectedEntity.type} />
                    {selectedEntity.isBridge && (
                      <span className="text-[9px] bg-rose-950 text-rose-300 border border-rose-800 px-1.5 py-0.2 rounded font-mono font-bold">
                        BRIDGE NODE (BETWEENNESS 98)
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 font-sans">
                    {selectedEntity.summary}
                  </p>
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
                  onClick={() => navigate(`/entities/${selectedEntity.id}`)}
                  className="flex items-center gap-1.5 rounded bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-cyan-500"
                >
                  <span>Open Dossier</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded border border-slate-800/80 bg-[#091122] p-3 text-[11px] text-slate-400 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400">💡 Tactical Insight:</span>
                <span>Click the central amber/rose node <strong className="text-slate-200">Vikram S. (PER-002)</strong> to inspect the detected structural bridge.</span>
              </div>
              <button
                onClick={handleFocusBridge}
                className="text-cyan-400 hover:underline font-bold"
              >
                Focus Bridge
              </button>
            </div>
          )}
        </div>

        {/* Right Column: High-Priority Leads & Bridge Spotlight (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-xs bg-amber-400"></span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-100 font-mono">
                Priority Analytical Leads ({leads.length})
              </h2>
            </div>
            <button
              onClick={() => navigate('/leads')}
              className="text-[11px] text-cyan-400 hover:underline flex items-center gap-0.5 font-semibold"
            >
              <span>View All</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-3">
            {leads.slice(0, 3).map(lead => (
              <div
                key={lead.id}
                className="p-3.5 rounded border border-slate-800 bg-[#0a1224] hover:border-slate-700 transition-colors space-y-2.5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-amber-400 font-bold">{lead.id}</span>
                  <LeadPriorityBadge priority={lead.priority} />
                </div>

                <h3 className="text-xs font-bold text-slate-200 leading-snug font-sans">
                  {lead.title}
                </h3>

                <p className="text-[11px] text-slate-400 font-sans line-clamp-2 leading-relaxed">
                  {lead.explanation}
                </p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Confidence: {lead.confidence}%</span>
                  <button
                    onClick={() => setSelectedLeadForProvenance(lead)}
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold"
                  >
                    <span>Why This Lead?</span>
                    <HelpCircle className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Bridge Spotlight Card */}
          <div className="rounded border border-rose-900/60 bg-rose-950/20 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">
                Critical Bridge Discovery
              </span>
              <Activity className="h-3.5 w-3.5 text-rose-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              Entity <strong className="text-rose-300 font-mono">Vikram S. (PER-002)</strong> links Cluster Alpha (fleet logistics) to Cluster Beta (corporate accounts). Without this intermediary, both clusters are mathematically isolated.
            </p>
            <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
              <span>Betweenness: 98/100</span>
              <button
                onClick={() => navigate('/network-analysis')}
                className="text-cyan-400 hover:underline font-semibold"
              >
                Inspect Centrality Engine →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: Multi-Source Evidence Breakdown & Chronology Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        {/* Evidence Source Distribution (4 cols) */}
        <div className="lg:col-span-4 rounded border border-slate-800 bg-[#0a1224] p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-200">
              <Layers className="h-4 w-4 text-cyan-400" />
              Multi-Jurisdictional Intake
            </div>
            <button onClick={() => navigate('/evidence')} className="text-[11px] text-cyan-400 hover:underline">
              Manage Vault
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
              <span className="text-slate-300">FIR & Police Complaints</span>
              <span className="text-cyan-400 font-bold">{evidenceByType['FIR_REPORT'] || 2} records</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
              <span className="text-slate-300">Call Detail Records (DoT CDR)</span>
              <span className="text-amber-400 font-bold">{evidenceByType['CDR'] || 4} records</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
              <span className="text-slate-300">Financial STRs & Bank Audits</span>
              <span className="text-rose-400 font-bold">{evidenceByType['FINANCIAL'] || 4} records</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
              <span className="text-slate-300">FASTag & ANPR Toll Logs</span>
              <span className="text-emerald-400 font-bold">{evidenceByType['VEHICLE_LOG'] || 3} records</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
              <span className="text-slate-300">BTS Cellular Tower Recordings</span>
              <span className="text-purple-400 font-bold">{evidenceByType['LOCATION_RECORD'] || 3} records</span>
            </div>
          </div>
        </div>

        {/* Activity Timeline Stream (8 cols) */}
        <div className="lg:col-span-8 rounded border border-slate-800 bg-[#0a1224] p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-200">
              <Calendar className="h-4 w-4 text-cyan-400" />
              Corroborated Activity Chronology (Cross-Correlated)
            </div>
            <button onClick={() => navigate('/timeline')} className="text-[11px] text-cyan-400 hover:underline">
              View Full Timeline →
            </button>
          </div>

          <div className="space-y-2">
            {timeline.slice(0, 4).map(event => (
              <div
                key={event.id}
                className="p-2.5 rounded border border-slate-800/80 bg-slate-900/40 hover:bg-[#0f1936] transition-colors flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="text-[11px] font-mono text-cyan-400 shrink-0">
                    {event.date} {event.time}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-200">{event.title}</span>
                    <p className="text-[11px] text-slate-400 font-sans line-clamp-1">{event.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-slate-500 uppercase">{event.category}</span>
                  <button
                    onClick={() => navigate(`/evidence/${event.evidenceId}`)}
                    className="text-cyan-400 hover:text-cyan-300 text-[10px] underline"
                  >
                    {event.evidenceId}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
