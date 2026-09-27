import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useInvestigation, DEMO_PERSONAS } from '../../context/InvestigationContext';
import {
  Shield,
  Lock,
  User,
  KeyRound,
  Mail,
  Building2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Sparkles,
  Zap,
  HelpCircle,
  Fingerprint
} from 'lucide-react';

const AGENCIES = [
  { id: 'CBI', name: 'Central Bureau of Investigation (CBI Special Wing)' },
  { id: 'NIA', name: 'National Investigation Agency (NIA Cyber & Counter-Terror)' },
  { id: 'ED', name: 'Enforcement Directorate (FIU-IND Anti-Money Laundering)' },
  { id: 'DELHI_POLICE', name: 'Delhi Police Special Cell (Organized Crime Range)' },
  { id: 'STATE_CID', name: 'State Criminal Investigation Department (CID Intelligence)' },
  { id: 'DOT_CYBER', name: 'Department of Telecommunications (Cyber Security Wing)' }
];

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginUser, showToast, triggerBootloader } = useInvestigation();

  const [fullName, setFullName] = useState('');
  const [badgeNumber, setBadgeNumber] = useState('');
  const [agency, setAgency] = useState(AGENCIES[0].name);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [clearanceLevel, setClearanceLevel] = useState<'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4'>('LEVEL_3');
  const [department, setDepartment] = useState('Special Crime & Syndicate Analytics');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [launchBootAfterSignup, setLaunchBootAfterSignup] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate badge number when agency or name changes if empty
  const handleAgencyChange = (newAgency: string) => {
    setAgency(newAgency);
    const prefix = newAgency.includes('CBI')
      ? 'CBI'
      : newAgency.includes('NIA')
      ? 'NIA'
      : newAgency.includes('Enforcement')
      ? 'ED'
      : 'POL';
    if (!badgeNumber || badgeNumber.startsWith('CBI') || badgeNumber.startsWith('NIA') || badgeNumber.startsWith('ED') || badgeNumber.startsWith('POL')) {
      setBadgeNumber(`${prefix}-INV-${Math.floor(1000 + Math.random() * 9000)}`);
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Officer full name is required for custody accreditation.');
      return;
    }
    if (!badgeNumber.trim()) {
      setError('Service / Badge identification number is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('A valid authorized government or departmental email is required.');
      return;
    }
    if (password.length < 6) {
      setError('Authentication token/password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Verify token confirmation.');
      return;
    }
    if (!agreeTerms) {
      setError('You must acknowledge the Official Secrets Act & Section 65B compliance.');
      return;
    }

    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Register officer into active session
      loginUser({
        name: fullName,
        badgeNumber: badgeNumber.toUpperCase(),
        agency,
        email,
        role: clearanceLevel === 'LEVEL_4'
          ? 'Special Director General / Lead Forensic Analyst'
          : clearanceLevel === 'LEVEL_3'
          ? 'Senior Cyber Forensic & Network Analyst'
          : clearanceLevel === 'LEVEL_2'
          ? 'Lead Intercept & Case Officer'
          : 'Field Intelligence Officer',
        clearanceLevel,
        department,
        jurisdiction: 'National Capital Region & Multi-State Corridor'
      });

      showToast(`Accredited: Welcome Officer ${fullName} (${badgeNumber})`);

      if (launchBootAfterSignup) {
        navigate('/launch');
      } else {
        navigate('/dashboard');
      }
    }, 600);
  };

  const handleQuickRegisterPersona = (personaIdx: number) => {
    const p = DEMO_PERSONAS[personaIdx];
    setFullName(p.name);
    setBadgeNumber(p.badgeNumber);
    setAgency(p.agency);
    setEmail(p.email);
    setClearanceLevel(p.clearanceLevel);
    setDepartment(p.department);
    setPassword('GovPass2026!');
    setConfirmPassword('GovPass2026!');
    setError(null);
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
            INVESTIGATOR ACCREDITATION PORTAL
          </span>
        </Link>

        <div className="flex items-center gap-3 text-[11px]">
          <Link
            to="/launch"
            className="flex items-center gap-1.5 rounded border border-cyan-700 bg-cyan-950/70 px-2.5 py-1 text-cyan-300 hover:bg-cyan-900 transition-colors"
          >
            <Zap className="h-3 w-3 text-cyan-400" />
            <span>Tactical Bootloader</span>
          </Link>
          <Link
            to="/login"
            className="text-slate-400 hover:text-slate-200"
          >
            Already Registered? <span className="text-cyan-400 font-bold underline">Sign In</span>
          </Link>
        </div>
      </header>

      {/* Main Registration Card */}
      <div className="w-full max-w-2xl mx-auto my-8">
        <div className="rounded-xl border border-slate-800 bg-[#081124] p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Header Tabs: Sign In / Register */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-1 rounded bg-[#040814] p-1 border border-slate-800">
              <button
                onClick={() => navigate('/login')}
                className="rounded px-4 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors font-sans font-medium"
              >
                Sign In
              </button>
              <button
                className="rounded bg-cyan-950 px-4 py-1.5 text-xs text-cyan-300 border border-cyan-800 font-sans font-bold shadow-xs"
              >
                Register Officer
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-2 py-1 rounded font-bold">
              <Fingerprint className="h-3.5 w-3.5" />
              <span>AIR-GAPPED ACCREDITATION</span>
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-lg font-bold uppercase tracking-tight text-slate-100 font-sans">
              Investigator Accreditation & Key Issuance
            </h1>
            <p className="text-[11px] text-slate-400 font-sans">
              Register an official law enforcement profile to access the cryptographic evidence ledger and topological graph analyzer.
            </p>
          </div>

          {/* 1-Click Fill With Persona Presets */}
          <div className="rounded border border-cyan-900/60 bg-[#060c1d] p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-cyan-400" />
                Quick-Prefill Official Persona Template:
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DEMO_PERSONAS.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleQuickRegisterPersona(idx)}
                  className="rounded border border-slate-800 bg-slate-900/80 p-2 text-left hover:border-cyan-700 hover:bg-cyan-950/30 transition-colors"
                >
                  <div className="font-bold text-slate-200 text-[10px] truncate">{p.name.split(' ')[0]} {p.name.split(' ')[1]}</div>
                  <div className="text-[9px] text-cyan-400 truncate">{p.agency.split(' ')[0]}</div>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded border border-rose-800 bg-rose-950/40 p-3 text-rose-300 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1 font-semibold">
                  Officer Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Inspector Raman Kumar"
                    className="w-full rounded border border-slate-800 bg-[#040814] pl-9 pr-3 py-2 text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:outline-hidden text-xs"
                    required
                  />
                </div>
              </div>

              {/* Service / Badge Number */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1 font-semibold">
                  Service / Badge ID *
                </label>
                <input
                  type="text"
                  value={badgeNumber}
                  onChange={e => setBadgeNumber(e.target.value)}
                  placeholder="e.g. CBI-DEL-7704"
                  className="w-full rounded border border-slate-800 bg-[#040814] px-3 py-2 text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:outline-hidden text-xs uppercase"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Agency Select */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1 font-semibold">
                  Law Enforcement Agency *
                </label>
                <select
                  value={agency}
                  onChange={e => handleAgencyChange(e.target.value)}
                  className="w-full rounded border border-slate-800 bg-[#040814] px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-hidden text-xs"
                >
                  {AGENCIES.map(a => (
                    <option key={a.id} value={a.name}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clearance Level */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1 font-semibold">
                  Security Clearance Level *
                </label>
                <select
                  value={clearanceLevel}
                  onChange={e => setClearanceLevel(e.target.value as unknown as 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4')}
                  className="w-full rounded border border-slate-800 bg-[#040814] px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-hidden text-xs"
                >
                  <option value="LEVEL_1">Level 1 - Field Reconnaissance (Restricted)</option>
                  <option value="LEVEL_2">Level 2 - Case Officer / Intercepts</option>
                  <option value="LEVEL_3">Level 3 - Senior Cyber Forensics Analyst</option>
                  <option value="LEVEL_4">Level 4 - Special Director General / Top Secret</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Gov Email */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1 font-semibold">
                  Official Gov / Departmental Email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. officer@cbi.gov.in"
                    className="w-full rounded border border-slate-800 bg-[#040814] pl-9 pr-3 py-2 text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:outline-hidden text-xs"
                    required
                  />
                </div>
              </div>

              {/* Department / Division */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1 font-semibold">
                  Specialized Division
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  placeholder="e.g. Special Crime & Syndicate Analytics"
                  className="w-full rounded border border-slate-800 bg-[#040814] px-3 py-2 text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:outline-hidden text-xs"
                />
              </div>
            </div>

            {/* Password and Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1 font-semibold">
                  Passcode / Token *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <KeyRound className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded border border-slate-800 bg-[#040814] pl-9 pr-3 py-2 text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:outline-hidden text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1 font-semibold">
                  Confirm Passcode *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded border border-slate-800 bg-[#040814] pl-9 pr-3 py-2 text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:outline-hidden text-xs"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-2 pt-1 text-[11px]">
              <label className="flex items-start gap-2 text-slate-300 cursor-pointer font-sans">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-900 accent-cyan-500 mt-0.5"
                />
                <span>
                  I certify authorization under the <strong>Official Secrets Act 1923</strong> & affirm that extracted evidentiary graphs conform to <strong>Section 65B Indian Evidence Act</strong>.
                </span>
              </label>

              <label className="flex items-center gap-2 text-cyan-300 cursor-pointer font-sans font-semibold">
                <input
                  type="checkbox"
                  checked={launchBootAfterSignup}
                  onChange={e => setLaunchBootAfterSignup(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-900 accent-cyan-500"
                />
                <span>Launch Animated Tactical Bootloader sequence immediately upon accreditation</span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-500 py-3 font-bold text-white text-xs hover:from-cyan-500 hover:to-cyan-400 transition-colors shadow-lg shadow-cyan-600/20 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Issuing Cryptographic Signing Keys...</span>
                  </>
                ) : (
                  <>
                    <span>REGISTER & ISSUE INVESTIGATOR CREDENTIALS</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-[10px] text-slate-600 border-t border-slate-900 pt-3">
        EVIDLINK Decision Support System · Smart India Hackathon Working Model · Synthetic Data Only
      </footer>
    </div>
  );
};
