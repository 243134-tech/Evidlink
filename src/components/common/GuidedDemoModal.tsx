import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvestigation } from '../../context/InvestigationContext';
import {
  Layers,
  UploadCloud,
  Cpu,
  GitMerge,
  Network,
  Activity,
  AlertCircle,
  FileCheck2,
  FileText,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Sparkles,
  CheckCircle,
  Play
} from 'lucide-react';

interface Scene {
  number: number;
  title: string;
  tagline: string;
  route: string;
  icon: React.ReactNode;
  narrative: string[];
  keyHighlight: string;
  ctaText: string;
}

const SCENES: Scene[] = [
  {
    number: 1,
    title: '1. Fragmented Evidence Silos',
    tagline: 'Multi-jurisdictional police, telecom, toll, and banking records isolated from each other',
    route: '/sources',
    icon: <Layers className="h-6 w-6 text-amber-400" />,
    narrative: [
      'In high-profile inter-state crime, critical records are fragmented: Police FIR filings in Delhi and Haryana, highway FASTag toll pings on NH-44, commercial banking statements from HDFC/ICICI, and Department of Telecommunications CDR dumps.',
      'Siloed systems conceal patterns because no individual officer has the complete topological picture.',
      'EVIDLINK unifies heterogeneous data streams into a single evidence catalog.'
    ],
    keyHighlight: 'Problem: Disconnected data silos conceal criminal operating bridges.',
    ctaText: 'Inspect Ingested Data Sources'
  },
  {
    number: 2,
    title: '2. Multi-Modal Evidence Intake & Chain of Custody',
    tagline: 'Legal admissibility with cryptographic SHA-256 validation',
    route: '/evidence',
    icon: <UploadCloud className="h-6 w-6 text-cyan-400" />,
    narrative: [
      'Every file uploaded to EVIDLINK receives an SHA-256 hash stamp, timestamped agency intake log, and chain-of-custody tracking.',
      'Supports CSV call records, PDF witness statements, optical ANPR snapshots, and banking RTGS statements.',
      'Maintains Section 65B Indian Evidence Act standards for courtroom admissibility.'
    ],
    keyHighlight: '18 Evidence records ingested with verified chain-of-custody.',
    ctaText: 'Open Evidence Repository'
  },
  {
    number: 3,
    title: '3. NLP Entity Extraction',
    tagline: 'Converting unstructured investigative narratives into typed domain entities',
    route: '/pipeline',
    icon: <Cpu className="h-6 w-6 text-purple-400" />,
    narrative: [
      'The deterministic NLP pipeline tokenizes raw police prose, identifying persons, vehicle registration plates, locations, bank accounts, and mobile phone IMEI/IMSI numbers.',
      'Extracted entities are assigned confidence ratings and preliminary cluster affinities.',
      'Investigators can review, verify, or correct tokens prior to graph ingestion.'
    ],
    keyHighlight: '24 Entities and 46 Graph Edges automatically extracted.',
    ctaText: 'View NLP Extraction Pipeline'
  },
  {
    number: 4,
    title: '4. Relationship Extraction & Taxonomy',
    tagline: 'Establishing typed, directional connections with frequency and financial volumes',
    route: '/pipeline',
    icon: <GitMerge className="h-6 w-6 text-indigo-400" />,
    narrative: [
      'Relationships are extracted using a strict taxonomy: CALLED, TRANSFERRED, MET, OPERATES, ASSOCIATED, OWNS.',
      'Each edge preserves temporal bounds, frequency counts (e.g. 42 calls), duration, and financial sums (₹1.45 Cr).',
      'Eliminates generic unweighted links in favor of forensically defensible connections.'
    ],
    keyHighlight: '30 Typed forensic edges populated with exact event telemetry.',
    ctaText: 'Inspect Relationship Taxonomy'
  },
  {
    number: 5,
    title: '5. Entity Resolution & Deduplication',
    tagline: 'Phonetic and identifier matching resolving aliases and syntactic variations',
    route: '/resolution',
    icon: <GitMerge className="h-6 w-6 text-emerald-400" />,
    narrative: [
      'Criminal actors intentionally obscure identity through spelling variations ("Devraj Anand" vs "D. Anand", "Vikram S." vs "Vicky").',
      'The resolution engine evaluates Jaro-Winkler phonetic similarity, shared phone prefixes, and co-location pings.',
      'Candidates are surfaced to human investigators for transparent 1-click merge or rejection.'
    ],
    keyHighlight: 'Resolved duplicate candidate with 88% confidence and full provenance.',
    ctaText: 'Review Entity Disambiguation'
  },
  {
    number: 6,
    title: '6. Unified Topological Graph Construction',
    tagline: 'High-performance interactive tactical graph canvas with real-time physics',
    route: '/graph',
    icon: <Network className="h-6 w-6 text-cyan-400" />,
    narrative: [
      'All verified entities and relationships assemble into an interactive tactical graph.',
      'Investigators can zoom, pan, filter by relationship type or minimum confidence, and click any node or edge.',
      'Visually separates the investigation into Cluster Alpha (Ground Logistics) and Cluster Beta (Corporate Shells).'
    ],
    keyHighlight: 'Interactive canvas maps entire syndicate across 2 distinct sub-networks.',
    ctaText: 'Launch Tactical Graph'
  },
  {
    number: 7,
    title: '7. Network Analytics & Centrality Metrics',
    tagline: 'Betweenness, Degree, and Closeness Centrality mathematical ranking',
    route: '/network-analysis',
    icon: <Activity className="h-6 w-6 text-rose-400" />,
    narrative: [
      'Traditional investigations focus on nodes with high degree (most phone calls), often targeting low-level drivers.',
      'EVIDLINK computes Betweenness Centrality—measuring which node falls on the shortest path between disparate criminal factions.',
      'Ranks nodes mathematically without subjective bias.'
    ],
    keyHighlight: 'Betweenness algorithm isolates hidden coordinators rather than foot soldiers.',
    ctaText: 'View Network Centrality Table'
  },
  {
    number: 8,
    title: '8. Hidden Bridge Broker Detection',
    tagline: 'Isolating Vikram S. (PER-002) as the critical operational conduit',
    route: '/entities/P002',
    icon: <Sparkles className="h-6 w-6 text-amber-400" />,
    narrative: [
      'Vikram S. has a low direct degree count (only 4 primary contacts) but an extreme betweenness score of 98/100.',
      'Removing Vikram S. from the graph completely severs communication between transport logistics and corporate financiers.',
      'He operates as the bridge broker orchestrating highway dispatches with financial settlements.'
    ],
    keyHighlight: 'Bridge Broker isolated: Vikram S. holds 98/100 betweenness centrality.',
    ctaText: 'Open Vikram S. Dossier'
  },
  {
    number: 9,
    title: '9. Prioritized Analytical Leads',
    tagline: 'Explainable, actionable leads with strict non-guilt safeguards',
    route: '/leads',
    icon: <AlertCircle className="h-6 w-6 text-amber-400" />,
    narrative: [
      'Rather than unexplainable black-box scores, EVIDLINK surfaces prioritized investigative leads categorized by pattern.',
      'Key leads include: Structural Bridge Node, Pre-Transit CDR Burst, and 3-Hop Rapid Financial Funneling.',
      'All leads emphasize analytical decision-support and explicitly disclaim automated determinations of guilt.'
    ],
    keyHighlight: '6 High-priority leads prioritized for human review.',
    ctaText: 'Explore Analytical Leads'
  },
  {
    number: 10,
    title: '10. "WHY THIS?" Signal Attribution & Provenance',
    tagline: '1-Click drill-down from high-level lead to the exact underlying signals',
    route: '/leads',
    icon: <FileCheck2 className="h-6 w-6 text-emerald-400" />,
    narrative: [
      'Every lead provides a 1-click "Why This Lead?" provenance breakdown.',
      'Inspectors see the exact causal chain: Analytical Lead -> Observed Signals -> Specific Graph Edges -> Underlying Case Evidence.',
      'Guarantees courtroom defensibility and procedural transparency.'
    ],
    keyHighlight: 'Complete end-to-end auditability down to agency case numbers.',
    ctaText: 'Open Leads Provenance'
  },
  {
    number: 11,
    title: '11. Supporting Evidence Cross-Referencing',
    tagline: 'Instant lookup of optical ANPR snapshots, CDR call logs, and banking vouchers',
    route: '/evidence',
    icon: <FileText className="h-6 w-6 text-cyan-400" />,
    narrative: [
      'Cross-referencing corroborates optical sightings (Toll camera DL-04-TC-8812) with telecommunications cell tower pings.',
      'Investigators can view excerpt snippets, verification attestation, and custodial officers.',
      'Ensures no analytical finding is accepted without concrete evidentiary backing.'
    ],
    keyHighlight: 'Every link references at least 2 independent evidentiary records.',
    ctaText: 'Inspect Evidence Vault'
  },
  {
    number: 12,
    title: '12. Unified Activity Timeline',
    tagline: 'Multi-jurisdictional chronological reconstruction of coordinated events',
    route: '/timeline',
    icon: <Calendar className="h-6 w-6 text-indigo-400" />,
    narrative: [
      'Plots phone calls, bank wires, highway crossings, and executive lounge meetings on a unified interactive time axis.',
      'Reveals tight temporal synchronization: CDR burst at 19:42 -> ANPR toll crossing at 21:04 -> RTGS transfer next morning at 09:30.',
      'Confirms intentional coordination rather than coincidental behavior.'
    ],
    keyHighlight: 'Chronological timeline proves operational synchrony across 4 agencies.',
    ctaText: 'View Unified Case Timeline'
  },
  {
    number: 13,
    title: '13. Court-Ready Dossier & Audit Trail',
    tagline: 'Automated executive compilation with immutable investigator modification logs',
    route: '/reports',
    icon: <ShieldCheck className="h-6 w-6 text-emerald-400" />,
    narrative: [
      'Generates a comprehensive courtroom-admissible dossier including executive summary, bridge node analysis, evidence citations, and ethical use clauses.',
      'Maintains an immutable audit log of all investigator attribute changes, status verifications, and notes.',
      'Ready for immediate supervisory briefing or formal judicial presentation.'
    ],
    keyHighlight: 'Instant courtroom-ready dossier export with cryptographic provenance.',
    ctaText: 'Generate Court-Ready Dossier'
  }
];

export const GuidedDemoModal: React.FC = () => {
  const { isPresentationModeOpen, setIsPresentationModeOpen, isGuidedDemoOpen, setIsGuidedDemoOpen } = useInvestigation();
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const navigate = useNavigate();

  const isOpen = isPresentationModeOpen || isGuidedDemoOpen;

  if (!isOpen) return null;

  const scene = SCENES[currentSceneIndex];

  const handleClose = () => {
    setIsPresentationModeOpen(false);
    setIsGuidedDemoOpen(false);
  };

  const handleNext = () => {
    if (currentSceneIndex < SCENES.length - 1) {
      setCurrentSceneIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex(prev => prev - 1);
    }
  };

  const handleJumpToScene = (route: string) => {
    handleClose();
    navigate(route);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark backdrop */}
      <div className="fixed inset-0 bg-black/85 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative w-full max-w-3xl rounded border border-cyan-700/80 bg-[#091124] text-slate-200 shadow-2xl z-10 overflow-hidden font-mono text-xs">
        {/* Top bar with indicator */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-[#0d1732] px-6 py-3.5">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-xs uppercase tracking-wider text-cyan-300 font-bold">
              EVIDLINK Guided Demonstration · Step {scene.number} of {SCENES.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Step jump dropdown */}
            <select
              value={currentSceneIndex}
              onChange={e => setCurrentSceneIndex(Number(e.target.value))}
              className="rounded border border-slate-700 bg-[#080e1e] px-2 py-1 text-slate-200 text-xs focus:outline-hidden"
            >
              {SCENES.map((s, idx) => (
                <option key={s.number} value={idx}>
                  {s.title}
                </option>
              ))}
            </select>

            <button
              onClick={handleClose}
              className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Header section with Icon & Titles */}
          <div className="flex items-start gap-4">
            <div className="rounded-lg border border-slate-700 bg-[#0d1732] p-3 shrink-0">
              {scene.icon}
            </div>
            <div>
              <div className="text-[10px] text-cyan-400 uppercase tracking-wider font-bold">
                SIH 2026 Evaluation Flow · Problem Statement SIH26189
              </div>
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-slate-100 font-sans mt-0.5">
                {scene.title}
              </h2>
              <p className="text-slate-300 text-xs font-sans mt-1 font-medium">
                {scene.tagline}
              </p>
            </div>
          </div>

          {/* Narrative text */}
          <div className="rounded border border-slate-800 bg-[#070d1a] p-4 space-y-2 text-slate-300 text-xs font-sans leading-relaxed">
            {scene.narrative.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {/* Key Highlight Banner */}
          <div className="flex items-center gap-2.5 rounded border border-cyan-800/80 bg-cyan-950/40 p-3 text-cyan-200 text-xs">
            <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0" />
            <span className="font-semibold font-sans">{scene.keyHighlight}</span>
          </div>

          {/* Step Progress Dots */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            {SCENES.map((s, idx) => (
              <button
                key={s.number}
                onClick={() => setCurrentSceneIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSceneIndex
                    ? 'w-6 bg-cyan-400'
                    : idx < currentSceneIndex
                    ? 'w-2 bg-cyan-700'
                    : 'w-2 bg-slate-700'
                }`}
                title={s.title}
              />
            ))}
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-[#0a1226] px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentSceneIndex === 0}
              className="flex items-center gap-1 rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentSceneIndex === SCENES.length - 1}
              className="flex items-center gap-1 rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <span>Next Step</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Action to Jump Directly to that Page */}
          <button
            onClick={() => handleJumpToScene(scene.route)}
            className="flex items-center gap-2 rounded bg-cyan-600 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-500 transition-colors shadow-md"
          >
            <span>{scene.ctaText}</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
