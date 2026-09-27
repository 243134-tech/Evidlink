import React from 'react';
import { User, Shield, Key, BadgeCheck, FileText, Activity } from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';

export const UserProfilePage: React.FC = () => {
  const { currentUser } = useInvestigation();

  return (
    <div className="space-y-6 font-mono text-xs text-slate-200">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-[11px] text-cyan-400 uppercase tracking-wider font-semibold">
          <User className="h-4 w-4" />
          Investigator Credential & Role Dossier
        </div>
        <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-100 font-sans mt-1">
          Investigator Profile & Clearance
        </h1>
        <p className="text-slate-400 text-xs font-sans mt-0.5">
          Authenticated forensic analyst profile with cryptographic audit signing certificates and role-based clearance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1 rounded border border-slate-800 bg-[#0a1224] p-5 space-y-4 text-center">
          <div className="h-20 w-20 rounded-full border-2 border-cyan-500 bg-cyan-950 flex items-center justify-center text-cyan-300 font-bold text-2xl mx-auto shadow-inner">
            {currentUser?.name.slice(0, 2).toUpperCase() || 'RR'}
          </div>

          <div>
            <h3 className="font-bold text-slate-100 text-base font-sans">{currentUser?.name}</h3>
            <p className="text-xs text-cyan-400 font-mono mt-0.5">{currentUser?.badgeNumber}</p>
            <p className="text-slate-400 text-xs font-sans mt-1">{currentUser?.role}</p>
            <p className="text-slate-500 text-[10px] mt-0.5">{currentUser?.agency}</p>
          </div>

          <div className="pt-2 border-t border-slate-800/80">
            <span className="rounded border border-emerald-800 bg-emerald-950/70 px-2.5 py-1 text-[10px] text-emerald-300 font-bold">
              SECURITY CLEARANCE: LEVEL 4 (TOP SECRET)
            </span>
          </div>
        </div>

        {/* Audit Credentials & Active Assignments */}
        <div className="md:col-span-2 space-y-4">
          <div className="rounded border border-slate-800 bg-[#0a1224] p-5 space-y-3">
            <h3 className="text-sm font-bold uppercase text-slate-100 border-b border-slate-800 pb-2">
              Cryptographic Audit Signoff Credentials
            </h3>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] block">Public PGP Key Fingerprint</span>
                <span className="text-cyan-400 font-mono text-[10px]">
                  9F82 BA33 410C 8821 770E 4031 F6B2 119A
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Session Security Token</span>
                <span className="text-slate-300 font-mono text-[10px]">
                  sess_token_auth_882991_verified_active
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Law Enforcement Jurisdiction</span>
                <span className="text-slate-200">National Capital Region / Inter-State Transit Corridors</span>
              </div>
            </div>
          </div>

          <div className="rounded border border-slate-800 bg-[#0a1224] p-5 space-y-3">
            <h3 className="text-sm font-bold uppercase text-slate-100 border-b border-slate-800 pb-2">
              Active Case Assignments (3 Cases)
            </h3>
            <div className="space-y-2">
              <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-cyan-400 font-bold">INV-2026-0881</span>
                  <div className="font-semibold text-slate-200">Operation Iron Highway (Active Lead)</div>
                </div>
                <span className="text-rose-400 font-bold text-[10px]">CRITICAL</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-cyan-400 font-bold">INV-2026-0412</span>
                  <div className="font-semibold text-slate-200">Phantom Shell Invoicing (Co-Analyst)</div>
                </div>
                <span className="text-amber-400 font-bold text-[10px]">HIGH</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
