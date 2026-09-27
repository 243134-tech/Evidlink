import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, ShieldCheck, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export const ResponsibleUsePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#060a17] text-slate-100 font-mono text-xs antialiased">
      {/* Header */}
      <header className="border-b border-slate-800 bg-[#070d1e] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-cyan-400" />
            <span className="text-base font-bold text-slate-100 uppercase">EVIDLINK</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-slate-400 hover:text-slate-200">Home</Link>
            <Link to="/how-it-works" className="text-slate-400 hover:text-slate-200">How It Works</Link>
            <button
              onClick={() => navigate('/dashboard')}
              className="rounded bg-cyan-600 px-3 py-1.5 text-white font-semibold hover:bg-cyan-500"
            >
              Enter Console
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold mb-1">
            Ethical Governance & Due Process Safeguards
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase text-slate-100">
            Responsible Use & Legal Integrity Charter
          </h1>
          <p className="mt-3 text-sm font-sans text-slate-300 leading-relaxed">
            EVIDLINK is built under strict constitutional and procedural safeguards to support authorized investigators while explicitly preventing automated accusation, bias amplification, or unverified legal decisions.
          </p>
        </div>

        {/* COMPARISON TABLE: WHAT EVIDLINK DOES VS DOES NOT DO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* WHAT IT DOES */}
          <div className="rounded border border-emerald-900/60 bg-emerald-950/20 p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-sm">
              <CheckCircle className="h-5 w-5" />
              What EVIDLINK Does
            </div>
            <ul className="space-y-2.5 font-sans text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold font-mono">✓</span>
                <span>Connects fragmented evidence records across disparate government silos.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold font-mono">✓</span>
                <span>Computes mathematical graph metrics (degree, betweenness, clustering).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold font-mono">✓</span>
                <span>Surfaces explainable analytical leads for authorized human review.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold font-mono">✓</span>
                <span>Preserves end-to-end evidence provenance down to source FIRs and CDRs.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold font-mono">✓</span>
                <span>Maintains complete audit trails and investigator action logs.</span>
              </li>
            </ul>
          </div>

          {/* WHAT IT DOES NOT DO */}
          <div className="rounded border border-rose-900/60 bg-rose-950/20 p-5 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-bold uppercase text-sm">
              <XCircle className="h-5 w-5" />
              What EVIDLINK NEVER Does
            </div>
            <ul className="space-y-2.5 font-sans text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold font-mono">✕</span>
                <span>Never determines legal guilt or issues automated verdicts.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold font-mono">✕</span>
                <span>Never labels any individual as a "criminal" or generates arrest warrants.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold font-mono">✕</span>
                <span>Never replaces the judgment, oversight, and verification of human investigators.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold font-mono">✕</span>
                <span>Never computes unexplainable "black-box" guilt scores.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold font-mono">✕</span>
                <span>Never accesses live real-world civilian communications without judicial warrant.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* DEMO DATA DISCLAIMER */}
        <div className="rounded border border-cyan-800/80 bg-cyan-950/30 p-5 space-y-3">
          <div className="flex items-center gap-2 text-cyan-300 font-bold uppercase text-xs">
            <ShieldCheck className="h-4 w-4" />
            Synthetic Demonstration Data Policy
          </div>
          <p className="text-xs font-sans text-slate-300 leading-relaxed">
            All records in this demonstration deployment—including person names ("Vikram S.", "Devraj Anand"), corporate titles, bank account numbers, vehicle registrations, and cellular metadata—are entirely synthetic, anonymized, and generated solely for hackathon prototyping and evaluation. Any resemblance to real persons, living or deceased, or actual ongoing criminal cases is entirely coincidental.
          </p>
        </div>

        <div className="pt-4 flex justify-between items-center border-t border-slate-800">
          <Link to="/" className="text-slate-400 hover:text-slate-200">
            ← Home
          </Link>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 rounded bg-cyan-600 px-4 py-2 text-white font-semibold hover:bg-cyan-500"
          >
            <span>Proceed to Investigation Console</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
