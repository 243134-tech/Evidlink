import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, User, KeyRound, AlertCircle, Loader2, ArrowRight, Zap, Sparkles, Fingerprint, CheckCircle2 } from 'lucide-react';
import { useInvestigation, DEMO_PERSONAS } from '../../context/InvestigationContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginUser, showToast, switchPersona, triggerBootloader } = useInvestigation();

  const [investigatorId, setInvestigatorId] = useState('CBI-DEL-7704');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('USR-001');
  const [rememberSession, setRememberSession] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!investigatorId.trim() || !password.trim()) {
      setError('Investigator badge ID and authentication token are required.');
      return;
    }
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Find selected persona or use generic
      const matched = DEMO_PERSONAS.find(p => p.badgeNumber === investigatorId.toUpperCase()) || DEMO_PERSONAS[0];
      loginUser(matched);
      showToast(`Authenticated: Welcome back, ${matched.name} (${matched.agency})`);
      navigate('/dashboard');
    }, 500);
  };

  const handleSelectPersona = (personaId: string) => {
    setSelectedPersonaId(personaId);
    const p = DEMO_PERSONAS.find(item => item.id === personaId);
    if (p) {
      setInvestigatorId(p.badgeNumber);
      setPassword('••••••••••••');
      setError(null);
    }
  };

  const handleDirectLaunchBoot = () => {
    const matched = DEMO_PERSONAS.find(p => p.id === selectedPersonaId) || DEMO_PERSONAS[0];
    loginUser(matched);
    navigate('/launch');
  };

  const handle1ClickDemoAccess = () => {
    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      switchPersona('USR-001');
      showToast('Evaluation Access Granted: Air-Gapped Intelligence Sandbox Initialized');
      navigate('/dashboard');
    }, 350);
  };

  return (
    <div className="min-h-screen bg-[#050917] text-slate-100 font-mono text-xs antialiased flex flex-col justify-between p-4 sm:p-6 selection:bg-cyan-500/30">
      {/* Top Brand Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between border-b border-slate-800 pb-3">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-7 w-7 items-center justify-center rounded border border-cyan-500/40 bg-cyan-950/80 text-cyan-400 group-hover:border-cyan-400 transition-colors">
            <Shield className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold tracking-wider uppercase text-slate-100 group-hover:text-cyan-300 transition-colors">
            EVIDLINK
          </span>
          <span className="text-[10px] text-cyan-400 ml-2 hidden sm:inline border-l border-slate-700 pl-2">
            CRIMINAL NETWORK ANALYSIS PLATFORM
          </span>
        </Link>

        <div className="flex items-center gap-3 text-[11px]">
          <Link
            to="/launch"
            className="flex items-center gap-1.5 rounded border border-cyan-700 bg-cyan-950/70 px-2.5 py-1 text-cyan-300 hover:bg-cyan-900 transition-colors"
          >
            <Zap className="h-3 w-3 text-cyan-400" />
            <span>Launch Bootloader</span>
          </Link>
          <div className="flex items-center gap-1 text-slate-400 text-[10px] bg-slate-900 px-2 py-1 rounded border border-slate-800">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>AIR-GAPPED NODE</span>
          </div>
        </div>
      </header>

      {/* Main Login Card */}
      <div className="w-full max-w-xl mx-auto my-6 sm:my-10">
        <div className="rounded-xl border border-slate-800 bg-[#081124] p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Header Tabs: Sign In / Register */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-1 rounded bg-[#040814] p-1 border border-slate-800">
              <button
                className="rounded bg-cyan-950 px-4 py-1.5 text-xs text-cyan-300 border border-cyan-800 font-sans font-bold shadow-xs"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="rounded px-4 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors font-sans font-medium"
              >
                Register Officer
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-cyan-400 bg-cyan-950/50 border border-cyan-800/60 px-2 py-1 rounded font-bold">
              <Fingerprint className="h-3.5 w-3.5" />
              <span>OFFICIAL SECRETS ACT READY</span>
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-lg font-bold uppercase tracking-wider text-slate-100 font-sans">
              Investigator Authentication
            </h1>
            <p className="text-[11px] text-slate-400 font-sans">
              Enter official badge number and cryptographic session token to open the topological intelligence workspace.
            </p>
          </div>

          {/* Quick Persona Selector Preset Cards */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-wider">
              <span className="font-semibold flex items-center gap-1 text-cyan-400">
                <Sparkles className="h-3 w-3" />
                Select Investigator Persona (1-Click Test):
              </span>
              <span className="text-slate-500">SIH 2026 Evaluation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DEMO_PERSONAS.map(p => {
                const isSelected = p.id === selectedPersonaId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPersona(p.id)}
                    className={`p-2.5 rounded-lg border text-left transition-all relative ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-950/60 text-cyan-100 shadow-md shadow-cyan-950'
                        : 'border-slate-800 bg-[#050b18] text-slate-400 hover:border-slate-700 hover:bg-[#070f22]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200 text-xs font-sans">{p.name}</span>
                      <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded border ${
                        p.clearanceLevel === 'LEVEL_4'
                          ? 'bg-rose-950 text-rose-300 border-rose-800'
                          : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      }`}>
                        {p.clearanceLevel.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{p.badgeNumber}</div>
                    <div className="text-[10px] text-slate-400 font-sans truncate mt-0.5">{p.role}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded border border-rose-800 bg-rose-950/40 p-3 text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1 font-semibold">
                Investigator Service / Badge ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={investigatorId}
                  onChange={e => setInvestigatorId(e.target.value)}
                  className="w-full rounded border border-slate-800 bg-[#040814] pl-9 pr-3 py-2 text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:outline-hidden text-xs uppercase"
                  placeholder="e.g. CBI-DEL-7704"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Access Passcode / Security Token
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[10px] text-cyan-400 hover:underline"
                >
                  Forgot Passcode?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full rounded border border-slate-800 bg-[#040814] pl-9 pr-3 py-2 text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:outline-hidden text-xs"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberSession}
                  onChange={e => setRememberSession(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-900 accent-cyan-500"
                />
                <span>Remember Session (8h Air-Gapped Cache)</span>
              </label>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-500 py-3 font-bold text-white text-xs hover:from-cyan-500 hover:to-cyan-400 transition-colors shadow-lg shadow-cyan-600/20 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Validating Cryptographic Enclave...</span>
                  </>
                ) : (
                  <>
                    <span>SIGN IN TO CONSOLE</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDirectLaunchBoot}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-cyan-700 bg-cyan-950/60 py-2.5 font-bold text-cyan-300 hover:bg-cyan-900/60 transition-colors shadow-xs"
              >
                <Zap className="h-3.5 w-3.5 text-cyan-400" />
                <span>SIGN IN & LAUNCH ANIMATED BOOT SEQUENCE</span>
              </button>

              <button
                type="button"
                onClick={handle1ClickDemoAccess}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded border border-amber-500/50 bg-amber-950/40 py-2 font-semibold text-amber-300 hover:bg-amber-900/50 transition-colors text-xs"
              >
                <span>DEMO ACCESS (1-CLICK EVALUATION SANDBOX)</span>
              </button>
            </div>
          </form>

          <div className="border-t border-slate-800/80 pt-3 text-center text-[10px] text-slate-500 space-y-0.5">
            <p>Access restricted to authorized investigative intelligence analysts.</p>
            <p>All terminal actions are cryptographically signed with Section 65B hash stamps.</p>
          </div>
        </div>
      </div>

      {/* Forgot Token Dialog */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={() => setShowForgotModal(false)} />
          <div className="relative w-full max-w-sm rounded border border-slate-700 bg-[#0b1429] p-6 shadow-2xl z-10 space-y-4">
            <h3 className="text-sm font-bold uppercase text-slate-100 font-sans">Credential Recovery</h3>
            <p className="text-slate-300 font-sans text-xs leading-relaxed">
              In this evaluation sandbox environment, standard investigator credentials are pre-configured. Simply select any of the persona cards or click <strong>"DEMO ACCESS"</strong> to enter instantly.
            </p>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowForgotModal(false)}
                className="rounded bg-cyan-600 px-4 py-1.5 text-xs text-white hover:bg-cyan-500 font-semibold"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Footer */}
      <footer className="text-center text-[10px] text-slate-600 border-t border-slate-900 pt-3">
        EVIDLINK Decision Support System · Smart India Hackathon Working Model · Synthetic Data Only
      </footer>
    </div>
  );
};
