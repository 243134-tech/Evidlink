import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvestigation } from '../../context/InvestigationContext';
import {
  Shield,
  X,
  Volume2,
  VolumeX,
  RotateCcw,
  ArrowRight,
  Terminal,
  Radio,
  Lock,
  ExternalLink
} from 'lucide-react';

interface Stage {
  phase: string;
  title: string;
  detail: string;
  badge: string;
}

const BOOT_STAGES: Stage[] = [
  {
    phase: 'PHASE 01 // HSM ENCLAVE',
    title: 'Initializing Tamper-Proof Cryptographic Enclave',
    detail: 'Hardware Security Module verified under Indian Evidence Act §65B standards.',
    badge: 'HSM: ONLINE'
  },
  {
    phase: 'PHASE 02 // MULTI-MODAL INTAKE',
    title: 'Decrypting Multi-Jurisdictional Evidentiary Silos',
    detail: 'Ingesting 18 evidentiary objects: DoT CDR streams, FIRs, FASTag logs, and banking wires.',
    badge: '18 CONTAINERS'
  },
  {
    phase: 'PHASE 03 // NLP RESOLUTION',
    title: 'Running Entity & Relational Predicate Resolution',
    detail: 'Tokenized 24 domain entities. Jaro-Winkler phonetic disambiguation applied.',
    badge: '24 ENTITIES'
  },
  {
    phase: 'PHASE 04 // TOPOLOGICAL MATRIX',
    title: 'Compiling Graph Topology & Betweenness Matrix',
    detail: 'Constructing 30 directed relational edges. Executing Brandes betweenness algorithm.',
    badge: '30 EDGES'
  },
  {
    phase: 'PHASE 05 // BRIDGE ISOLATION',
    title: 'Isolating Cross-Cluster Syndicate Conduit',
    detail: 'Vikram S. (PER-002) identified as bridge broker with 98/100 betweenness centrality.',
    badge: 'BRIDGE DETECTED'
  },
  {
    phase: 'PHASE 06 // CONSOLE ARMED',
    title: 'Security Clearance Validated. Command Center Active.',
    detail: 'Clearance Level 4 validated for active officer. Ready for full deployment.',
    badge: 'ACCESS GRANTED'
  }
];

export const TacticalBootloaderModal: React.FC = () => {
  const { isBootloaderOpen, setIsBootloaderOpen, currentUser, showToast } = useInvestigation();
  const navigate = useNavigate();

  const [progress, setProgress] = useState(0);
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const playTacticalSound = (type: 'beep' | 'scan' | 'complete') => {
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
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.05);
          gain.gain.setValueAtTime(0.05, ctx.currentTime + i * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.05);
          osc.stop(ctx.currentTime + 0.5);
        });
      }
    } catch (e) {
      // Audio context might be restricted
    }
  };

  useEffect(() => {
    if (!isBootloaderOpen) return;

    setProgress(0);
    setCurrentStageIdx(0);
    setIsCompleted(false);
    setTerminalLogs(['[00:00.01] > Initializing Tactical Bootloader...']);

    let currentP = 0;
    const interval = setInterval(() => {
      currentP += 2;
      if (currentP <= 100) {
        setProgress(currentP);
        const stageIdx = Math.min(
          Math.floor((currentP / 100) * BOOT_STAGES.length),
          BOOT_STAGES.length - 1
        );
        setCurrentStageIdx(stageIdx);

        if (currentP === 20) {
          setTerminalLogs(prev => [...prev.slice(-4), '[00:00.32] > Decrypting 18 evidence objects with SHA-256 validation.']);
          playTacticalSound('scan');
        } else if (currentP === 50) {
          setTerminalLogs(prev => [...prev.slice(-4), '[00:00.78] > Extracted 24 entities across Cluster Alpha and Cluster Beta.']);
          playTacticalSound('beep');
        } else if (currentP === 80) {
          setTerminalLogs(prev => [...prev.slice(-4), '[00:01.20] > Identified structural bridge: Vikram S. (PER-002) Betweenness 98.']);
          playTacticalSound('beep');
        } else if (currentP === 100) {
          setTerminalLogs(prev => [...prev.slice(-4), '[00:01.50] > Zero-Trust Enclave armed. Command center ready.']);
          playTacticalSound('complete');
          setIsCompleted(true);
        }
      } else {
        clearInterval(interval);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [isBootloaderOpen]);

  if (!isBootloaderOpen) return null;

  const currentStage = BOOT_STAGES[currentStageIdx];

  const handleClose = () => {
    setIsBootloaderOpen(false);
  };

  const handleEnterWorkspace = () => {
    setIsBootloaderOpen(false);
    showToast('Boot Complete: Tactical Workspace Synchronized');
    navigate('/dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/90 backdrop-blur-md" onClick={handleClose} />

      <div className="relative w-full max-w-2xl rounded-xl border border-cyan-700/80 bg-[#050b1a] text-slate-200 shadow-2xl z-10 overflow-hidden font-mono text-xs">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-cyan-900/60 bg-[#081226] px-5 py-3">
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 rounded border border-cyan-500 bg-cyan-950 flex items-center justify-center text-cyan-400">
              <Shield className="h-3.5 w-3.5 animate-pulse" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-100">
              EVIDLINK Tactical Boot Sequence · {currentUser.badgeNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(prev => !prev)}
              className="rounded p-1 text-slate-400 hover:text-slate-200"
              title="Toggle Audio"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4 text-cyan-400" /> : <VolumeX className="h-4 w-4" />}
            </button>
            <button
              onClick={handleClose}
              className="rounded p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Radar Dial & Progress */}
          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
            <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/30 animate-[spin_10s_linear_infinite]" />
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="text-slate-800"
                  strokeWidth="5"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="text-cyan-400 transition-all duration-75"
                  strokeWidth="5"
                  strokeDasharray={263.9}
                  strokeDashoffset={263.9 - (263.9 * progress) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className="text-3xl font-extrabold text-slate-100 font-sans tracking-tight">
                  {progress}<span className="text-cyan-400 text-lg">%</span>
                </div>
                <div className="text-[9px] text-emerald-400 font-bold uppercase mt-0.5">
                  {currentStage.badge}
                </div>
              </div>
            </div>

            {/* Stage Info */}
            <div className="space-y-2 text-center sm:text-left">
              <div className="text-[10px] text-cyan-400 uppercase tracking-wider font-bold">
                {currentStage.phase}
              </div>
              <h3 className="text-base font-bold text-slate-100 font-sans">
                {currentStage.title}
              </h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {currentStage.detail}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="text-[10px] bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-slate-300">
                  Officer: {currentUser.name}
                </span>
                <span className="text-[10px] bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded text-emerald-300 font-bold">
                  {currentUser.clearanceLevel.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Diagnostic Log */}
          <div className="rounded border border-slate-800 bg-[#030610] p-3 space-y-1 font-mono text-[10px] text-slate-300 h-24 overflow-y-auto">
            {terminalLogs.map((log, i) => (
              <div key={i} className={log.includes('bridge') || log.includes('Vikram') ? 'text-rose-400 font-bold' : 'text-cyan-300'}>
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-cyan-900/60 bg-[#081226] px-5 py-3">
          <button
            onClick={() => {
              setProgress(100);
              setCurrentStageIdx(BOOT_STAGES.length - 1);
              setIsCompleted(true);
            }}
            disabled={isCompleted}
            className="text-[11px] text-amber-400 hover:underline disabled:opacity-40"
          >
            Fast-Forward →
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              className="rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700"
            >
              Close
            </button>
            <button
              onClick={handleEnterWorkspace}
              className="flex items-center gap-1.5 rounded bg-cyan-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-cyan-500 shadow-xs"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
