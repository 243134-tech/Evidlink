import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useInvestigation } from '../../context/InvestigationContext';
import { evidenceService } from '../../services/evidenceService';
import { entityService } from '../../services/entityService';
import { relationshipService } from '../../services/relationshipService';
import { analysisService } from '../../services/analysisService';
import { notificationService } from '../../services/notificationService';
import { CheckCircle2, Loader2, ArrowRight, FileText, Cpu, Network, ShieldCheck, Database } from 'lucide-react';

interface Stage {
  key: string;
  name: string;
  desc: string;
}

const STAGES: Stage[] = [
  { key: 'UPLOAD', name: 'Document Ingestion', desc: 'Validating cryptographic hash and parsing raw byte stream...' },
  { key: 'PARSING', name: 'Document Tokenization & OCR', desc: 'Extracting structured paragraphs, timestamps, and headers...' },
  { key: 'EXTRACTION', name: 'Named Entity Recognition (NER)', desc: 'Identifying Persons, Vehicles, Locations, and Bank Accounts...' },
  { key: 'RELATIONSHIPS', name: 'Relationship Extraction', desc: 'Inferring co-location, calls, fund transfers, and associations...' },
  { key: 'RESOLUTION', name: 'Entity Resolution & Disambiguation', desc: 'Evaluating phonetic similarity and identifier overlap against existing registry...' },
  { key: 'GRAPH_UPDATE', name: 'Investigation Graph Sync', desc: 'Injecting verified nodes and edges into community graph...' },
  { key: 'LEAD_GEN', name: 'Analytical Lead Generation', desc: 'Running centrality and burst anomaly detection algorithms...' }
];

export const ProcessingPipelineModal: React.FC = () => {
  const { isUploadPipelineOpen, setIsUploadPipelineOpen, showToast, refreshUnreadCount } = useInvestigation();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<'FIR' | 'CDR' | 'STR'>('FIR');
  const [sampleFileName, setSampleFileName] = useState('FIR_NCR_INTERCEPT_ADDENDUM.pdf');

  useEffect(() => {
    if (isUploadPipelineOpen) {
      setCurrentStepIndex(0);
      setIsRunning(false);
      setIsCompleted(false);
    }
  }, [isUploadPipelineOpen]);

  const handleStartPipeline = () => {
    setIsRunning(true);
    setIsCompleted(false);
    let step = 0;

    const interval = setInterval(() => {
      step++;
      if (step < STAGES.length) {
        setCurrentStepIndex(step);
      } else {
        clearInterval(interval);
        setIsRunning(false);
        setIsCompleted(true);

        // Add simulated evidence into database
        const newEv = evidenceService.add({
          title: `Forensic Ingest: ${sampleFileName}`,
          type: selectedPreset === 'FIR' ? 'FIR_REPORT' : selectedPreset === 'CDR' ? 'CDR' : 'FINANCIAL',
          source: 'Special Crime Branch Digital Forensics',
          date: new Date().toISOString().slice(0, 10),
          status: 'COMPLETED',
          confidence: 97,
          entityIds: ['P001', 'P002', 'L002'],
          relationshipIds: ['R001', 'R003'],
          rawContent: `Interception addendum logged on ${sampleFileName}. Confirmed additional communication link between Vikram S. and Devraj Anand preceding highway convoy dispatch.`,
          extractedSnippet: 'Telemetry corroborates Vikram S. (P002) coordinating transport asset movement.',
          fileSize: '3.4 MB',
          uploadedBy: 'Forensics Specialist (STF)',
          fileName: sampleFileName,
          provenance: {
            sourceAgency: 'Special Cell Forensics Hub',
            intakeChannel: 'Secure Automated Gateway',
            chainOfCustodyId: `CC-STF-ING-${Date.now().toString().slice(-4)}`,
            verifiedBy: 'Inspector K. Raman'
          }
        });

        notificationService.add({
          title: `Evidence ${newEv.id} Ingested & Analyzed`,
          message: `${sampleFileName} added 3 entity links and generated 1 updated analytical alert.`,
          type: 'EVIDENCE',
          targetRoute: `/evidence/${newEv.id}`,
          priority: 'NORMAL'
        });

        refreshUnreadCount();
        showToast(`Processing complete: Evidence ${newEv.id} ingested into active investigation graph.`);
      }
    }, 750);
  };

  return (
    <Modal
      isOpen={isUploadPipelineOpen}
      onClose={() => setIsUploadPipelineOpen(false)}
      title="Automated Evidence Ingestion & Graph Extraction Pipeline"
      subtitle="7-stage deterministic NLP & graph intelligence engine"
      maxWidth="2xl"
    >
      <div className="space-y-6 font-mono text-xs">
        {/* Preset selection */}
        {!isRunning && !isCompleted && (
          <div className="rounded border border-slate-800 bg-[#0d172e] p-4 space-y-3">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Select Demonstration Ingestion Payload
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedPreset('FIR');
                  setSampleFileName('FIR_ADDENDUM_INTERSTATE_CARGO.pdf');
                }}
                className={`p-3 rounded border text-left transition-colors ${
                  selectedPreset === 'FIR'
                    ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-slate-200">FIR / Report Extract</div>
                <div className="text-[10px] text-slate-400 mt-1">Interstate transit intelligence log</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedPreset('CDR');
                  setSampleFileName('CDR_TELEMETRY_BURST_BATCH_04.csv');
                }}
                className={`p-3 rounded border text-left transition-colors ${
                  selectedPreset === 'CDR'
                    ? 'border-amber-500 bg-amber-950/40 text-amber-200'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-slate-200">CDR Batch (Cellular)</div>
                <div className="text-[10px] text-slate-400 mt-1">Telephony burst & tower correlation</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedPreset('STR');
                  setSampleFileName('STR_SUSPICIOUS_LEDGER_ICICI.json');
                }}
                className={`p-3 rounded border text-left transition-colors ${
                  selectedPreset === 'STR'
                    ? 'border-rose-500 bg-rose-950/40 text-rose-200'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-slate-200">Financial Ledger</div>
                <div className="text-[10px] text-slate-400 mt-1">Multi-tier RTGS conduit wire flow</div>
              </button>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>Target File: <strong className="text-slate-200">{sampleFileName}</strong></span>
              <span className="text-cyan-400">Ready for automated extraction</span>
            </div>
          </div>
        )}

        {/* Pipeline Progress Stages */}
        <div className="space-y-2">
          {STAGES.map((st, idx) => {
            const isPast = idx < currentStepIndex || isCompleted;
            const isCurrent = idx === currentStepIndex && isRunning;

            return (
              <div
                key={st.key}
                className={`flex items-start gap-3 p-3 rounded border transition-colors ${
                  isCurrent
                    ? 'border-cyan-600 bg-cyan-950/40 text-cyan-200'
                    : isPast
                    ? 'border-slate-800 bg-slate-900/80 text-slate-300'
                    : 'border-slate-900 bg-slate-950/40 text-slate-600'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isPast ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <Loader2 className="h-4 w-4 text-cyan-400 animate-spin" />
                  ) : (
                    <div className="h-4 w-4 rounded-xs border border-slate-700 flex items-center justify-center text-[10px] text-slate-500 font-bold">
                      {idx + 1}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold uppercase tracking-wider text-slate-200">
                      {st.name}
                    </span>
                    {isCurrent && <span className="text-[10px] text-cyan-400 font-mono">PROCESSING...</span>}
                    {isPast && <span className="text-[10px] text-emerald-400 font-mono">DONE</span>}
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-400">{st.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Completed Summary Box */}
        {isCompleted && (
          <div className="rounded border border-emerald-900/80 bg-emerald-950/30 p-4 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-emerald-300 font-semibold uppercase text-[11px]">
              <CheckCircle2 className="h-4 w-4" />
              Graph Pipeline Ingestion Complete
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300 pt-2 border-t border-emerald-900/50">
              <div>
                <span className="text-slate-500 block">Entities Found</span>
                <span className="text-emerald-400 font-bold text-sm">3 Entities</span>
              </div>
              <div>
                <span className="text-slate-500 block">Relationships</span>
                <span className="text-emerald-400 font-bold text-sm">2 Edges</span>
              </div>
              <div>
                <span className="text-slate-500 block">Duplicate Check</span>
                <span className="text-emerald-400 font-bold text-sm">0 Conflicts</span>
              </div>
              <div>
                <span className="text-slate-500 block">Leads Updated</span>
                <span className="text-emerald-400 font-bold text-sm">1 Verified</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-800">
          <span className="text-[11px] text-slate-500">
            Demonstration mode: Uses deterministic local pipeline simulator.
          </span>
          <div className="flex gap-2">
            {!isRunning && !isCompleted ? (
              <button
                type="button"
                onClick={handleStartPipeline}
                className="flex items-center gap-2 rounded bg-cyan-600 px-4 py-2 text-xs font-semibold text-white hover:bg-cyan-500 transition-colors"
              >
                <span>Run Ingestion Pipeline</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : isCompleted ? (
              <button
                type="button"
                onClick={() => setIsUploadPipelineOpen(false)}
                className="rounded bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors"
              >
                View Ingested Results
              </button>
            ) : (
              <button
                disabled
                className="flex items-center gap-2 rounded bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-400 cursor-not-allowed"
              >
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Processing Stream...</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
