import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  ArrowRight,
  Database,
  Cpu,
  GitMerge,
  Network,
  Activity,
  FileCheck2,
  CheckCircle2,
  Play,
  Layers,
  Lock,
  Compass,
  FileText,
  PhoneCall,
  Coins,
  MapPin,
  Car,
  Zap
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { triggerDemoMode } = useInvestigation();
  const [activeStep, setActiveStep] = useState(0);

  const workflowSteps = [
    { name: '1. INGEST', desc: 'Standardize multi-jurisdictional FIRs, CDR batches, bank statements, and ANPR highway cameras into unified evidentiary objects.', icon: <Database className="h-5 w-5 text-cyan-400" /> },
    { name: '2. UNDERSTAND', desc: 'Extract structured entities, temporal timestamps, geolocation coordinates, and relational predicates using deterministic NLP.', icon: <Cpu className="h-5 w-5 text-purple-400" /> },
    { name: '3. RESOLVE', desc: 'Disambiguate aliases and syntactical variations (e.g., "Rahul Sharma" vs "R. Sharma") with multi-signal similarity scoring.', icon: <GitMerge className="h-5 w-5 text-emerald-400" /> },
    { name: '4. CONNECT', desc: 'Unify disparate data silos into a high-performance interactive topological graph spanning people, accounts, vehicles, and towers.', icon: <Network className="h-5 w-5 text-blue-400" /> },
    { name: '5. ANALYZE', desc: 'Compute betweenness centrality, community clusters, pre-movement call bursts, and rapid money-laundering funnel hops.', icon: <Activity className="h-5 w-5 text-rose-400" /> },
    { name: '6. EXPLAIN', desc: 'Trace every analytical lead down to its underlying forensic chain of custody with end-to-end provenance transparency.', icon: <FileCheck2 className="h-5 w-5 text-amber-400" /> }
  ];

  return (
    <div className="min-h-screen bg-[#060a17] text-slate-100 font-mono antialiased overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#070d1e]/90 px-6 py-4 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded border border-cyan-500/40 bg-cyan-950/80 text-cyan-400">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-wider text-slate-100 uppercase">
                EVIDLINK
              </span>
              <span className="hidden sm:inline text-[10px] text-cyan-400 ml-2 tracking-widest border-l border-slate-700 pl-2">
                CRIMINAL NETWORK ANALYSIS & INVESTIGATIVE INTELLIGENCE
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs text-slate-400">
            <Link to="/about" className="hover:text-cyan-300 transition-colors">About</Link>
            <Link to="/how-it-works" className="hover:text-cyan-300 transition-colors">Architecture</Link>
            <Link to="/responsible-use" className="hover:text-cyan-300 transition-colors">Responsible Use</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/launch"
              className="flex items-center gap-1.5 text-xs text-cyan-300 hover:text-white px-3 py-1.5 rounded border border-cyan-700/80 bg-cyan-950/60 hover:bg-cyan-900/60 transition-colors font-semibold"
            >
              <Zap className="h-3 w-3 text-cyan-400" />
              <span className="hidden sm:inline">Tactical Boot</span>
            </Link>
            <Link
              to="/login"
              className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded border border-slate-800 hover:border-slate-700"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="hidden sm:inline-block text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded border border-slate-800 hover:border-slate-700"
            >
              Register
            </Link>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 rounded bg-cyan-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-cyan-500 transition-colors shadow-xs"
            >
              <span>Console</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative px-6 pt-16 pb-24 overflow-hidden border-b border-slate-800/80">
        {/* Subtle Network Simulation in Background */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <line x1="15%" y1="25%" x2="50%" y2="45%" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="85%" y1="30%" x2="50%" y2="45%" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="25%" y1="75%" x2="50%" y2="45%" stroke="#38bdf8" strokeWidth="1.5" />
            <line x1="75%" y1="80%" x2="50%" y2="45%" stroke="#38bdf8" strokeWidth="1.5" />
            
            {/* Person node */}
            <circle cx="15%" cy="25%" r="6" fill="#06b6d4" />
            <text x="15%" y="22%" fill="#67e8f9" fontSize="10" textAnchor="middle">Person A</text>

            {/* Vehicle node */}
            <circle cx="25%" cy="75%" r="6" fill="#f59e0b" />
            <text x="25%" y="82%" fill="#fcd34d" fontSize="10" textAnchor="middle">Vehicle X</text>

            {/* Bridge Node (Vikram S.) */}
            <circle cx="50%" cy="45%" r="10" fill="#881337" stroke="#f43f5e" strokeWidth="2" />
            <circle cx="50%" cy="45%" r="16" fill="none" stroke="#f43f5e" strokeWidth="1" strokeDasharray="2 2" className="animate-spin" />
            <text x="50%" y="40%" fill="#fda4af" fontSize="11" fontWeight="bold" textAnchor="middle">Bridge Node</text>

            {/* Financial Account node */}
            <circle cx="85%" cy="30%" r="6" fill="#f43f5e" />
            <text x="85%" y="27%" fill="#fda4af" fontSize="10" textAnchor="middle">Account Z</text>

            {/* Location node */}
            <circle cx="75%" cy="80%" r="6" fill="#10b981" />
            <text x="75%" y="87%" fill="#6ee7b7" fontSize="10" textAnchor="middle">Location Y</text>
          </svg>
        </div>

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded border border-cyan-800/80 bg-cyan-950/40 px-3 py-1 text-xs text-cyan-300">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            SMART INDIA HACKATHON DEMONSTRATION MODEL
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-100 uppercase leading-tight font-sans">
            Connect Fragmented Evidence.<br />
            <span className="text-cyan-400">Discover Hidden Relationships.</span><br />
            Prioritize Explainable Leads.
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            EVIDLINK aggregates siloed police FIR reports, call detail records (CDR), layered banking transfers, and highway ANPR toll feeds into an interactive investigation graph. Identifies structural bridge brokers, coordinated communication bursts, and multi-hop fund funnels for authorized human review.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('/launch')}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-500 px-6 py-3 text-sm font-bold text-white hover:from-cyan-500 hover:to-cyan-400 transition-colors shadow-lg shadow-cyan-900/40 uppercase tracking-wide"
            >
              <Zap className="h-4 w-4 text-cyan-200 animate-pulse" />
              <span>LAUNCH ANIMATED BOOT SEQUENCE</span>
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/90 px-6 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-700 transition-colors shadow-md"
            >
              <span>ENTER CONSOLE</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => {
                navigate('/dashboard');
                setTimeout(() => triggerDemoMode(), 300);
              }}
              className="flex items-center gap-2 rounded-lg border border-amber-500/50 bg-amber-950/40 px-6 py-3 text-sm font-semibold text-amber-300 hover:bg-amber-900/50 transition-colors"
            >
              <Play className="h-4 w-4 text-amber-400" />
              <span>13-SCENE GUIDED TOUR</span>
            </button>
          </div>

          {/* Quick Metrics Banner */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-3.5 rounded border border-slate-800 bg-[#091122]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Target Investigation</span>
              <span className="text-base font-bold text-slate-100">Operation Meridian</span>
              <span className="text-[10px] text-cyan-400 block mt-0.5">INV-2026-001 (Cross-Cluster)</span>
            </div>
            <div className="p-3.5 rounded border border-slate-800 bg-[#091122]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Graph Dimensions</span>
              <span className="text-base font-bold text-slate-100">24 Nodes · 46 Edges</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">18 Corroborated Evidences</span>
            </div>
            <div className="p-3.5 rounded border border-slate-800 bg-[#091122]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Key Topology Discovery</span>
              <span className="text-base font-bold text-rose-400">Betweenness: 98/100</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Entity Vikram S. (Bridge)</span>
            </div>
            <div className="p-3.5 rounded border border-slate-800 bg-[#091122]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Explainability Model</span>
              <span className="text-base font-bold text-cyan-300">100% Provenance</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Deterministic Audit Trail</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: THE INVESTIGATIVE CHALLENGE */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-b border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-2">
            Section 01 · The Evidentiary Gap
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 uppercase">
            Investigative Intelligence is Fragmented Across Disparate Silos
          </h2>
          <p className="mt-3 text-sm text-slate-400 font-sans leading-relaxed">
            One individual police record or toll log may appear normal. Disparate jurisdictions fail to correlate cellular tower bursts with midnight vehicle movements and rapid intermediate wire transfers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-5 rounded border border-slate-800 bg-[#0b1329] space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase">
              <FileText className="h-4 w-4" />
              FIR & Police Reports
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Unstructured narratives detailing physical vehicle movements, warehouse dispatches, and informant debriefs stored in local station diaries.
            </p>
            <div className="text-[10px] text-slate-500 font-mono">Example: Special Cell FIR #742/2026</div>
          </div>

          <div className="p-5 rounded border border-slate-800 bg-[#0b1329] space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase">
              <PhoneCall className="h-4 w-4" />
              Call Detail Records (CDR)
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Millions of telecommunications rows containing timestamps, cell tower azimuths, and IMEI numbers disconnected from physical transport manifests.
            </p>
            <div className="text-[10px] text-slate-500 font-mono">Example: 8-Call Pre-Transit Burst at 22:14</div>
          </div>

          <div className="p-5 rounded border border-slate-800 bg-[#0b1329] space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase">
              <Coins className="h-4 w-4" />
              Financial RTGS & Pass-Throughs
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Suspicious transaction reports (STRs) showing multi-tier account hops where capital dwells for less than 25 minutes before onward dispersal.
            </p>
            <div className="text-[10px] text-slate-500 font-mono">Example: ₹1.45 Cr Escrow to Intermediate #3340</div>
          </div>

          <div className="p-5 rounded border border-slate-800 bg-[#0b1329] space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase">
              <Car className="h-4 w-4" />
              Highway FASTag & ANPR Logs
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Automated optical plate recognition cameras logging late-night expressway passages without real-time cross-referencing to suspect cellular signatures.
            </p>
            <div className="text-[10px] text-slate-500 font-mono">Example: Kundli NH44 Toll Plaza Camera #2</div>
          </div>

          <div className="p-5 rounded border border-slate-800 bg-[#0b1329] space-y-3">
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs uppercase">
              <GitMerge className="h-4 w-4" />
              Alias Variations & Disguise
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Subject identities misspelled or abbreviated ("Vikram S.", "V. Sharma", "Vikramaditya") creating deceptive database fragmentation.
            </p>
            <div className="text-[10px] text-slate-500 font-mono">Example: 88% Resolution Confidence Match</div>
          </div>

          <div className="p-5 rounded border border-slate-800 bg-[#0b1329] space-y-3">
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs uppercase">
              <Layers className="h-4 w-4" />
              Regulatory Commercial Waybills
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              GST National E-Way bills documenting consignment carrier relationships that bridge physical transport fleets with corporate bank accounts.
            </p>
            <div className="text-[10px] text-slate-500 font-mono">Example: E-Way Bill Manifest #CF-882</div>
          </div>
        </div>
      </section>

      {/* SECTION 2: HOW EVIDLINK CONNECTS THE DOTS */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-b border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-2">
            Section 02 · The 6-Stage Core Workflow
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 uppercase">
            Ingest → Understand → Resolve → Connect → Analyze → Explain
          </h2>
          <p className="mt-3 text-sm text-slate-400 font-sans leading-relaxed">
            Every step transforms raw fragmented records into explainable graph intelligence without proprietary black boxes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {workflowSteps.map((step, idx) => (
            <div
              key={step.name}
              className="p-5 rounded border border-slate-800 bg-[#0a1122] hover:border-cyan-800/80 transition-colors space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300">{step.name}</span>
                {step.icon}
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: EXPLAINABLE ANALYSIS & RESPONSIBLE AI */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-b border-slate-800/80">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-wider text-rose-400 font-semibold">
              Section 03 · Mathematical Graph Metrics
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 uppercase">
              Algorithmic Bridge Detection Over Generic Guesswork
            </h2>
            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              Betweenness centrality measures the number of shortest paths passing through a node. In criminal networks, high betweenness identifies the covert broker who coordinates logistics between financing clusters and execution fleets.
            </p>
            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                <span>Analytical Priority Score: 92/100 (Non-Guilt Metric)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                <span>Betweenness Centrality: 98/100 (Structural Conduit)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                <span>100% Traceability via 1-Click Provenance Drawer</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => navigate('/network-analysis')}
                className="flex items-center gap-2 rounded border border-slate-700 bg-slate-800/80 px-4 py-2 text-xs text-slate-200 hover:bg-slate-700"
              >
                <span>Inspect Network Centrality Engine</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Demonstration Lead Card Preview */}
          <div className="rounded border border-slate-800 bg-[#0d162d] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs text-amber-400 font-bold">LEAD-001 · CRITICAL LEAD</span>
              <span className="text-[10px] text-slate-400">Confidence: 96%</span>
            </div>
            <h3 className="text-sm font-bold text-slate-100">
              Critical Structural Bridge Detected: Entity Vikram S. (P002)
            </h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Algorithmic community analysis demonstrates that Cluster Alpha and Cluster Beta possess zero direct operational connectivity. Entity Vikram S. exhibits an exceptional betweenness centrality score of 98/100.
            </p>
            <div className="rounded bg-slate-950/70 p-3 text-[11px] text-slate-400 space-y-1">
              <div><span className="text-slate-500">Key Signals:</span> Betweenness 98 · Pass-through conduit dwell 23m</div>
              <div><span className="text-slate-500">Supporting Evidence:</span> E002 (CDR) · E003 (STR Wire) · E017 (E-Way Bill)</div>
            </div>
            <div className="text-[10px] text-cyan-400">
              Traceable back to 5 distinct forensic case records
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: RESPONSIBLE INTELLIGENCE CONSTITUTION */}
      <section className="py-16 px-6 max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 text-xs text-emerald-400 uppercase font-semibold">
          <Lock className="h-4 w-4" />
          Responsible AI Framework & Legal Admissibility
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-100 uppercase">
          EVIDLINK Surfaces Analytical Leads for Authorized Human Review. It Does Not Determine Guilt.
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed max-w-2xl mx-auto">
          The system strictly operates as an investigative decision-support tool. It never accuses individuals, generates automated arrest warrants, or replaces constitutional due process. All findings remain analytical hypotheses subject to independent investigator verification.
        </p>
        <div className="pt-4 flex justify-center gap-4">
          <Link
            to="/responsible-use"
            className="text-xs text-cyan-300 hover:underline flex items-center gap-1.5"
          >
            <span>Read Responsible Use Charter</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-20 px-6 text-center border-t border-slate-800 bg-[#050914]">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 uppercase">
            Ready to Investigate?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans">
            Launch the interactive command console to explore Operation Meridian, inspect the bridge node, and export the case dossier.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 rounded bg-cyan-600 px-6 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-cyan-500 transition-colors"
            >
              <span>ENTER EVIDLINK CONSOLE</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
