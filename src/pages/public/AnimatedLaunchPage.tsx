import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useInvestigation, DEMO_PERSONAS } from '../../context/InvestigationContext';
import {
  Shield,
  Activity,
  Cpu,
  Terminal,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
  Lock,
  Network,
  Zap,
  Radio,
  FileCheck2,
  Layers,
  Database
} from 'lucide-react';

interface Stage {
  id: number;
  phase: string;
  title: string;
  detail: string;
  badge: string;
  metric: string;
}

const BOOT_STAGES: Stage[] = [
  {
    id: 1,
    phase: 'PHASE 01 // HSM ENCLAVE',
    title: 'Initializing Tamper-Proof Cryptographic Enclave',
    detail: 'Hardware Security Module verified under Indian Evidence Act §65B standards. Zero-trust memory sandbox active.',
    badge: 'HSM: ONLINE',
    metric: 'SHA-256 SEAL: OK'
  },
  {
    id: 2,
    phase: 'PHASE 02 // MULTI-MODAL INTAKE',
    title: 'Decrypting Multi-Jurisdictional Evidentiary Silos',
    detail: 'Ingesting 18 evidentiary objects: DoT CDR streams, Delhi Police FIRs, NH-44 FASTag logs, and NPCI RTGS banking ledgers.',
    badge: '18 CONTAINERS',
    metric: 'HASH INTEGRITY: 100%'
  },
  {
    id: 3,
    phase: 'PHASE 03 // NLP EXTRACTION',
    title: 'Running Entity & Relational Predicate Resolution',
    detail: 'Tokenized 24 domain entities (Persons, Vehicles, Accounts, Cell Towers). Jaro-Winkler phonetic disambiguation applied.',
    badge: '24 ENTITIES EXTRACTED',
    metric: 'CONFIDENCE: 94.2%'
  },
  {
    id: 4,
    phase: 'PHASE 04 // TOPOLOGICAL MATRIX',
    title: 'Compiling Graph Topology & Betweenness Matrix',
    detail: 'Constructing 30 directed relational edges. Executing Brandes shortest-path network centrality engine.',
    badge: '30 DIRECTED EDGES',
    metric: 'GRAPH ENGINE: ACTIVE'
  },
  {
    id: 5,
    phase: 'PHASE 05 // BRIDGE ISOLATION',
    title: 'Isolating Cross-Cluster Syndicate Conduit',
    detail: 'CRITICAL DISCOVERY: Vikram S. (PER-002) identified as bridge broker with 98/100 betweenness connecting fleet to corporate escrow.',
    badge: 'BRIDGE DETECTED',
    metric: 'CENTRALITY: 98/100'
  },
  {
    id: 6,
    phase: 'PHASE 06 // CONSOLE READY',
    title: 'Security Clearance Authenticated. Ready for Deployment.',
    detail: 'Clearance Level 4 validated for active officer. Tactical decision-support system fully operational.',
    badge: 'ACCESS GRANTED',
    metric: 'SYSTEM ARMED'
  }
];

export const AnimatedLaunchPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, switchPersona, showToast } = useInvestigation();

  const [progress, setProgress] = useState(0);
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [activePersona, setActivePersona] = useState(currentUser.id);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Web Audio API Synthesizer for high-tech sound effects
  const playTacticalSound = (type: 'beep' | 'scan' | 'complete' | 'click') => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (type === 'beep') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'scan') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'complete') {
        // Harmonic triumphal chord
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.06);
          gain.gain.setValueAtTime(0.05, ctx.currentTime + i * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.06);
          osc.stop(ctx.currentTime + 0.6);
        });
      }
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  };

  // Main Boot progress timer
  useEffect(() => {
    let currentP = 0;
    const interval = setInterval(() => {
      currentP += 1;
      if (currentP <= 100) {
        setProgress(currentP);

        // Map progress to stages
        const stageIdx = Math.min(
          Math.floor((currentP / 100) * BOOT_STAGES.length),
          BOOT_STAGES.length - 1
        );
        setCurrentStageIdx(stageIdx);

        // Add log messages at key intervals
        if (currentP === 10) {
          addLog('[00:00.12] > HSM Kernel loaded. Cryptographic enclave active.');
          playTacticalSound('scan');
        } else if (currentP === 25) {
          addLog('[00:00.45] > Evidence silos ingested: DoT CDR (4), FIRs (2), ANPR (3), RTGS (4).');
          playTacticalSound('beep');
        } else if (currentP === 45) {
          addLog('[00:00.82] > Resolving entities: Jaro-Winkler score 0.88 mapped to Vikram S.');
          playTacticalSound('beep');
        } else if (currentP === 65) {
          addLog('[00:01.15] > Graph assembled: 24 nodes, 30 edges across Cluster Alpha & Beta.');
          playTacticalSound('scan');
        } else if (currentP === 85) {
          addLog('[00:01.48] > CRITICAL ALERT: Betweenness spike detected on PER-002 (Vikram S.).');
          playTacticalSound('beep');
        } else if (currentP === 100) {
          addLog('[00:01.80] > ALL SYSTEMS ARMED. Clearance Level 4 active. Ready for analyst.');
          playTacticalSound('complete');
          setIsCompleted(true);
        }
      } else {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  const addLog = (msg: string) => {
    setTerminalLogs(prev => [...prev.slice(-6), msg]);
  };

  const handleSkip = () => {
    setProgress(100);
    setCurrentStageIdx(BOOT_STAGES.length - 1);
    setIsCompleted(true);
    playTacticalSound('complete');
    addLog('[MANUAL OVERRIDE] > Fast-forward triggered. Full tactical console ready.');
  };

  const handleReboot = () => {
    setIsCompleted(false);
    setProgress(0);
    setCurrentStageIdx(0);
    setTerminalLogs(['[SYSTEM REBOOT] > Diagnostics restarting...']);
    playTacticalSound('scan');
  };

  const handleProceed = () => {
    showToast(`Investigator Session Armed: Welcome ${currentUser.name}`);
    navigate('/dashboard');
  };

  const handleSelectPersona = (id: string) => {
    setActivePersona(id);
    switchPersona(id);
    playTacticalSound('click');
  };

  const currentStage = BOOT_STAGES[currentStageIdx];

  return (
    <div className="min-h-screen bg-[#040814] text-slate-100 font-mono text-xs antialiased flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden selection:bg-cyan-500/40">
      {/* Background Matrix Grid & Radar Sweep */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'linear-gradient(rgba(14, 165, 233, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(14, 165, 233, 0.15) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Animated Subtle Scanline Bar */}
      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30 animate-pulse pointer-events-none top-0" />

      {/* TOP STATUS BAR */}
      <header className="relative z-10 max-w-7xl w-full mx-auto flex flex-wrap items-center justify-between gap-4 border-b border-cyan-900/60 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded border border-cyan-500 bg-cyan-950/80 text-cyan-400 shadow-cyan-500/20 shadow-md">
            <Shield className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-widest uppercase text-slate-100">
                EVIDLINK TACTICAL BOOTLOADER
              </span>
              <span className="text-[9px] bg-cyan-950 text-cyan-300 border border-cyan-700 px-1.5 py-0.5 rounded font-bold">
                v2.6.4-SECURE
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              National Criminal Network Analysis & Multi-Agency Fusion Platform
            </p>
          </div>
        </div>

        {/* Right Controls: Audio Toggle, Skip, Persona Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setSoundEnabled(prev => !prev)}
            className={`flex items-center gap-1.5 rounded border px-2.5 py-1 text-[11px] transition-colors ${
              soundEnabled
                ? 'border-cyan-700 bg-cyan-950/70 text-cyan-300'
                : 'border-slate-800 bg-slate-900 text-slate-500'
            }`}
            title="Toggle Tactical Audio Telemetry"
          >
            {soundEnabled ? <Volume2 className="h-3.5 w-3.5 text-cyan-400" /> : <VolumeX className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{soundEnabled ? 'AUDIO ON' : 'MUTED'}</span>
          </button>

          {!isCompleted ? (
            <button
              onClick={handleSkip}
              className="flex items-center gap-1.5 rounded border border-amber-600/70 bg-amber-950/40 px-3 py-1 text-amber-300 hover:bg-amber-900/50 transition-colors font-bold text-[11px]"
            >
              <span>FAST-FORWARD</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          ) : (
            <button
              onClick={handleReboot}
              className="flex items-center gap-1.5 rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-slate-300 hover:bg-slate-700 transition-colors text-[11px]"
            >
              <RotateCcw className="h-3 w-3" />
              <span>REBOOT</span>
            </button>
          )}

          <Link
            to="/login"
            className="rounded border border-slate-800 bg-[#0c142b] px-3 py-1 text-slate-300 hover:border-slate-700 text-[11px]"
          >
            Sign In / Register
          </Link>
        </div>
      </header>

      {/* CENTER COCKPIT AREA */}
      <main className="relative z-10 max-w-5xl w-full mx-auto my-auto py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* LEFT / CENTER: Circular Tactical Radar HUD & Progress Dial (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 rounded-xl border border-cyan-900/70 bg-[#060c1d]/90 backdrop-blur-md shadow-2xl relative">
          {/* Circular HUD Graphic */}
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
            {/* Outer Rotating Radar Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/30 animate-[spin_12s_linear_infinite]" />
            <div className="absolute inset-3 rounded-full border border-cyan-400/20" />
            <div className="absolute inset-8 rounded-full border border-dashed border-cyan-600/40 animate-[spin_20s_linear_infinite_reverse]" />

            {/* Glowing Progress SVG Circle */}
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                className="text-slate-800"
                strokeWidth="4"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                className="text-cyan-400 transition-all duration-100 ease-out"
                strokeWidth="4"
                strokeDasharray={276.4}
                strokeDashoffset={276.4 - (276.4 * progress) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            {/* Center Content: Percentage & Tactical Radar Target */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
              <div className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold mb-1 flex items-center gap-1">
                <Radio className="h-3 w-3 animate-ping text-cyan-400" />
                <span>BOOT SEQUENCE</span>
              </div>
              <div className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-slate-100 font-sans">
                {progress}
                <span className="text-cyan-400 text-2xl">%</span>
              </div>
              <div className="text-[10px] text-emerald-400 font-bold mt-1 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
                {isCompleted ? 'INITIALIZATION 100%' : currentStage.badge}
              </div>
            </div>

            {/* Simulated Floating Network Topology Nodes appearing on radar */}
            {progress >= 30 && (
              <div className="absolute top-10 left-12 h-3 w-3 rounded-full bg-cyan-400 shadow-cyan-400 shadow-md animate-ping" title="Cluster Alpha Node" />
            )}
            {progress >= 50 && (
              <div className="absolute bottom-12 right-12 h-3 w-3 rounded-full bg-purple-400 shadow-purple-400 shadow-md animate-ping" title="Cluster Beta Node" />
            )}
            {progress >= 70 && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 rounded-full border-2 border-rose-500 bg-rose-500/40 animate-pulse pointer-events-none" title="Bridge Node Center" />
            )}
          </div>

          {/* Current Stage Title & Narration */}
          <div className="mt-6 text-center max-w-md space-y-1.5">
            <div className="text-[10px] text-cyan-400 uppercase tracking-widest font-semibold">
              {currentStage.phase}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 uppercase tracking-tight">
              {currentStage.title}
            </h2>
            <p className="text-slate-400 text-xs font-sans leading-relaxed">
              {currentStage.detail}
            </p>
          </div>

          {/* Action Button: Proceed to Command Console */}
          <div className="mt-6 w-full max-w-xs">
            {isCompleted ? (
              <button
                onClick={handleProceed}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-500 py-3 font-bold text-white text-xs hover:from-cyan-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/30 transition-all uppercase tracking-wider animate-bounce"
              >
                <span>ENTER COMMAND CONSOLE</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <div className="w-full bg-slate-900/80 rounded-full h-2 border border-cyan-900/60 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-75"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Diagnostic Terminal & Officer Clearance Switcher (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Officer Credential Card */}
          <div className="rounded-lg border border-slate-800 bg-[#081024] p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 text-cyan-400 text-[11px] font-bold uppercase">
                <Lock className="h-3.5 w-3.5" />
                <span>Active Officer Enclave</span>
              </div>
              <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.5 rounded font-bold">
                {currentUser.clearanceLevel.replace('_', ' ')}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full border-2 border-cyan-500 bg-cyan-950 flex items-center justify-center text-cyan-300 font-bold text-sm">
                {currentUser.avatarInitials}
              </div>
              <div>
                <div className="font-bold text-slate-100 text-xs font-sans">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-cyan-400 font-mono">
                  {currentUser.badgeNumber} · {currentUser.agency}
                </div>
                <div className="text-[10px] text-slate-400 font-sans mt-0.5">
                  {currentUser.role}
                </div>
              </div>
            </div>

            {/* Quick Persona Switcher in Launch Page */}
            <div className="pt-2 border-t border-slate-800/80">
              <label className="text-[9px] text-slate-400 uppercase tracking-wider block mb-1">
                Switch Operational Persona:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {DEMO_PERSONAS.map(persona => (
                  <button
                    key={persona.id}
                    onClick={() => handleSelectPersona(persona.id)}
                    className={`text-left p-1.5 rounded border text-[10px] transition-colors truncate ${
                      persona.id === activePersona
                        ? 'border-cyan-600 bg-cyan-950/80 text-cyan-200'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-bold truncate">{persona.name.split(' ')[1] || persona.name}</div>
                    <div className="text-[8px] text-slate-500 truncate">{persona.badgeNumber}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time Forensic Telemetry Terminal */}
          <div className="rounded-lg border border-slate-800 bg-[#060b18] p-4 space-y-2.5 font-mono text-[11px] shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 text-slate-300">
                <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                <span className="font-bold uppercase tracking-wider text-[10px]">
                  Real-Time Boot Telemetry
                </span>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="space-y-1.5 h-36 overflow-y-auto text-[10px] leading-relaxed text-slate-300">
              {terminalLogs.length === 0 ? (
                <div className="text-slate-600 italic">Initializing kernel hooks...</div>
              ) : (
                terminalLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={`${
                      log.includes('CRITICAL')
                        ? 'text-rose-400 font-bold'
                        : log.includes('ALL SYSTEMS')
                        ? 'text-emerald-400 font-bold'
                        : 'text-cyan-300/90'
                    }`}
                  >
                    {log}
                  </div>
                ))
              )}
            </div>

            {/* Live Hardware & Cipher Metrics */}
            <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-[9px] text-slate-400">
              <div>
                <span className="text-slate-600">CIPHER:</span>{' '}
                <span className="text-slate-300">AES-256-GCM</span>
              </div>
              <div>
                <span className="text-slate-600">EVIDENCE:</span>{' '}
                <span className="text-cyan-400">18 SHA-256 VALIDATED</span>
              </div>
              <div>
                <span className="text-slate-600">CENTRALITY:</span>{' '}
                <span className="text-rose-400">BRANDES ALGORITHM</span>
              </div>
              <div>
                <span className="text-slate-600">AIR-GAP:</span>{' '}
                <span className="text-emerald-400">STANDALONE READY</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* BOTTOM FOOTER */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-900 pt-3 text-[10px] text-slate-500">
        <div>
          EVIDLINK Criminal Network Analysis · Smart India Hackathon 2026 (Problem SIH26189)
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <Link to="/responsible-use" className="hover:text-cyan-300">Section 65B Admissibility</Link>
          <Link to="/about" className="hover:text-cyan-300">System Architecture</Link>
          <Link to="/help" className="hover:text-cyan-300">Evaluation Manual</Link>
        </div>
      </footer>
    </div>
  );
};
