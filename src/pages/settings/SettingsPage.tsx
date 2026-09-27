import React, { useState } from 'react';
import { Settings, Sliders, Shield, Database, RotateCcw, CheckCircle2 } from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';

export const SettingsPage: React.FC = () => {
  const { showToast } = useInvestigation();
  const [minConfidence, setMinConfidence] = useState(70);
  const [physicsEnabled, setPhysicsEnabled] = useState(true);
  const [explainableLevel, setExplainableLevel] = useState<'DEEP' | 'STANDARD'>('DEEP');
  const [autoDisambiguate, setAutoDisambiguate] = useState(false);

  const handleSave = () => {
    showToast('Investigator settings and model thresholds updated.');
  };

  const handleResetData = () => {
    localStorage.clear();
    showToast('Local state purged. Reloading defaults...');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div className="space-y-6 font-mono text-xs text-slate-200">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-[11px] text-cyan-400 uppercase tracking-wider font-semibold">
          <Settings className="h-4 w-4" />
          System Preferences & Algorithmic Parameters
        </div>
        <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-100 font-sans mt-1">
          Investigator Settings & Engine Tuning
        </h1>
        <p className="text-slate-400 text-xs font-sans mt-0.5">
          Confidence threshold gates, graph layout simulation dynamics, and evidence intake automation parameters.
        </p>
      </div>

      <div className="max-w-2xl space-y-5">
        {/* Param 1: Confidence Threshold */}
        <div className="rounded border border-slate-800 bg-[#0a1224] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-100 text-sm font-sans">Minimum Evidentiary Confidence Threshold</h3>
              <p className="text-slate-400 text-[11px] font-sans mt-0.5">
                Relationships and inferred triples below this score are withheld from tactical graph renders.
              </p>
            </div>
            <span className="text-cyan-400 font-bold text-base">{minConfidence}%</span>
          </div>
          <input
            type="range"
            min={40}
            max={95}
            value={minConfidence}
            onChange={e => setMinConfidence(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        {/* Param 2: Explainable AI Depth */}
        <div className="rounded border border-slate-800 bg-[#0a1224] p-5 space-y-3">
          <h3 className="font-bold text-slate-100 text-sm font-sans">Explainability Trace Granularity</h3>
          <p className="text-slate-400 text-[11px] font-sans">
            Level of step-by-step mathematical attribution displayed in the Provenance Drawer for analytical leads.
          </p>
          <div className="flex gap-3 pt-1">
            <button
              onClick={() => setExplainableLevel('DEEP')}
              className={`flex-1 p-3 rounded border text-left transition-colors ${
                explainableLevel === 'DEEP'
                  ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400'
              }`}
            >
              <div className="font-bold text-xs">Deep Forensic (Recommended)</div>
              <div className="text-[10px] mt-1 text-slate-400">Shows formula, weights, signal citations, and corroborating timestamps.</div>
            </button>
            <button
              onClick={() => setExplainableLevel('STANDARD')}
              className={`flex-1 p-3 rounded border text-left transition-colors ${
                explainableLevel === 'STANDARD'
                  ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400'
              }`}
            >
              <div className="font-bold text-xs">Standard Summary</div>
              <div className="text-[10px] mt-1 text-slate-400">Condensed overview of primary supporting evidence documents.</div>
            </button>
          </div>
        </div>

        {/* Param 3: Disambiguation Automation */}
        <div className="rounded border border-slate-800 bg-[#0a1224] p-5 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-100 text-sm font-sans">Enforce Human Review on Entity Resolution</h3>
              <p className="text-slate-400 text-[11px] font-sans mt-0.5">
                Require investigator signoff before merging suspect profiles (zero automated autonomous merges).
              </p>
            </div>
            <input
              type="checkbox"
              checked={!autoDisambiguate}
              onChange={e => setAutoDisambiguate(!e.target.checked)}
              className="accent-cyan-500 h-4 w-4"
            />
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleSave}
            className="rounded bg-cyan-600 px-5 py-2 font-semibold text-white hover:bg-cyan-500 shadow-xs"
          >
            Save Parameters
          </button>

          <button
            onClick={handleResetData}
            className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Demo Data to Default</span>
          </button>
        </div>
      </div>
    </div>
  );
};
