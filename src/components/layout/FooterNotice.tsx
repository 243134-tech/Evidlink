import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export const FooterNotice: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#060a17] py-3 px-6 text-slate-400 text-[11px] font-mono">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
          <span>
            <strong className="text-slate-300">EVIDLINK</strong> is an investigative decision-support system for authorized users. Analytical leads are derived from available evidence and network patterns and require human review. The system does not determine guilt or make legal decisions.
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-slate-500">
          <span className="flex items-center gap-1">
            <Lock className="h-3 w-3 text-cyan-500" />
            <span>AIR-GAPPED DEMO ENVIRONMENT</span>
          </span>
          <span>·</span>
          <span>BUILD V2.4-SIH</span>
        </div>
      </div>
    </footer>
  );
};
