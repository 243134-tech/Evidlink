import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvestigation } from '../../context/InvestigationContext';
import { investigationService } from '../../services/investigationService';
import { Investigation } from '../../types';
import { Modal } from '../../components/common/Modal';
import { LeadPriorityBadge } from '../../components/common/Badge';
import {
  FolderOpen,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Archive,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';

export const InvestigationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentInvestigation, showToast } = useInvestigation();
  const [investigations, setInvestigations] = useState(() => investigationService.getAll());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Multi-step modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createStep, setCreateStep] = useState(1);
  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM'>('HIGH');
  const [selectedSources, setSelectedSources] = useState<string[]>(['FIR', 'CDR']);
  const [uploadedFileName, setUploadedFileName] = useState('FIR_NCR_INTAKE_01.pdf');

  const filtered = investigations.filter(inv => {
    if (filterPriority !== 'ALL' && inv.priority !== filterPriority) return false;
    if (filterStatus !== 'ALL' && inv.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        inv.title.toLowerCase().includes(q) ||
        inv.code.toLowerCase().includes(q) ||
        inv.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenWorkspace = (inv: Investigation) => {
    setCurrentInvestigation(inv);
    navigate(`/investigations/${inv.id}`);
  };

  const handleCreateSubmit = () => {
    if (!newTitle.trim()) {
      alert('Please enter an investigation title');
      return;
    }

    const created = investigationService.create({
      code: newCode.trim() || `CASE-${Math.floor(100 + Math.random() * 900)}`,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Multi-source forensic investigation initialized into network graph.',
      status: 'ACTIVE',
      priority: newPriority,
      leadInvestigator: 'Inspector K. Raman (Lead Analyst)',
      tags: selectedSources,
      summaryAnalysis: 'Graph initialized with imported seed evidence. Topological analysis pending review.'
    });

    setInvestigations(investigationService.getAll());
    setIsCreateModalOpen(false);
    setCreateStep(1);
    setCurrentInvestigation(created);
    showToast(`Created & Activated Case: ${created.title} (${created.code})`);
    navigate(`/investigations/${created.id}`);
  };

  return (
    <div className="space-y-6 font-mono text-xs text-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-cyan-400 uppercase tracking-wider font-semibold">
            <FolderOpen className="h-4 w-4" />
            Active Investigation Registry
          </div>
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-100 font-sans mt-1">
            Investigations & Operations
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Manage multi-jurisdictional case files, evidentiary graphs, and analytical lead queues.
          </p>
        </div>

        <button
          onClick={() => {
            setCreateStep(1);
            setNewTitle('');
            setNewCode('');
            setNewDesc('');
            setIsCreateModalOpen(true);
          }}
          className="flex items-center gap-2 rounded bg-cyan-600 px-4 py-2 font-semibold text-white hover:bg-cyan-500 transition-colors shadow-xs shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>New Investigation</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-slate-800 bg-[#0a1224] p-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="h-4 w-4 text-cyan-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by case code, title, or narrative keywords..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-slate-200 placeholder-slate-500 focus:outline-hidden text-xs"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="text-[10px] uppercase">Priority:</span>
            <select
              value={filterPriority}
              onChange={e => setFilterPriority(e.target.value)}
              className="rounded border border-slate-800 bg-[#0e1832] px-2 py-1 text-slate-200 text-xs"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="text-[10px] uppercase">Status:</span>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="rounded border border-slate-800 bg-[#0e1832] px-2 py-1 text-slate-200 text-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING_REVIEW">Pending Review</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Investigations Table */}
      <div className="rounded border border-slate-800 bg-[#091122] overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-[#0d162d] text-[10px] uppercase tracking-wider text-slate-400">
              <th className="py-3 px-4">Case ID / Code</th>
              <th className="py-3 px-4">Title & Scope</th>
              <th className="py-3 px-4">Evidence</th>
              <th className="py-3 px-4">Entities</th>
              <th className="py-3 px-4">Leads</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Last Updated</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filtered.map(inv => (
              <tr
                key={inv.id}
                className="hover:bg-[#0e1933] transition-colors cursor-pointer group"
                onClick={() => handleOpenWorkspace(inv)}
              >
                <td className="py-3.5 px-4 font-bold text-cyan-400 whitespace-nowrap">
                  <div>{inv.code}</div>
                  <div className="text-[10px] text-slate-500 font-normal">{inv.id}</div>
                </td>
                <td className="py-3.5 px-4 max-w-xs">
                  <div className="font-semibold text-slate-100 group-hover:text-cyan-300">
                    {inv.title}
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans line-clamp-1 mt-0.5">
                    {inv.description}
                  </p>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-300">
                  {inv.evidenceCount} items
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-300">
                  {inv.entityCount} nodes
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap font-mono text-amber-300 font-semibold">
                  {inv.leadsCount} leads
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <LeadPriorityBadge priority={inv.priority} />
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="rounded border border-slate-700 bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-300">
                    {inv.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 text-[11px]">
                  {inv.lastUpdated}
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => handleOpenWorkspace(inv)}
                    className="flex items-center gap-1 ml-auto rounded bg-cyan-950/70 border border-cyan-800/80 px-2.5 py-1 text-cyan-300 hover:bg-cyan-900/60"
                  >
                    <span>Open</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Multi-Step Create Investigation Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Initialize New Investigation Case File"
        subtitle={`Step ${createStep} of 5 · Forensic Investigation Initialization`}
        maxWidth="lg"
      >
        <div className="space-y-5 font-mono text-xs">
          {/* Step Progress Dots */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            {[1, 2, 3, 4, 5].map(stepNum => (
              <div key={stepNum} className="flex items-center gap-2">
                <span
                  className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    stepNum === createStep
                      ? 'bg-cyan-500 text-slate-950'
                      : stepNum < createStep
                      ? 'bg-emerald-800 text-emerald-200'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {stepNum}
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">
                  {stepNum === 1 ? 'Info' : stepNum === 2 ? 'Sources' : stepNum === 3 ? 'Upload' : stepNum === 4 ? 'Config' : 'Review'}
                </span>
              </div>
            ))}
          </div>

          {/* STEP 1: Case Details */}
          {createStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase text-slate-400 block mb-1">
                  Investigation Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Operation Northern Corridor"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full rounded border border-slate-800 bg-[#0d162d] px-3 py-2 text-slate-100 text-xs focus:border-cyan-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase text-slate-400 block mb-1">
                  Case File Code / Identifier
                </label>
                <input
                  type="text"
                  placeholder="e.g. OP-NORTH-04"
                  value={newCode}
                  onChange={e => setNewCode(e.target.value)}
                  className="w-full rounded border border-slate-800 bg-[#0d162d] px-3 py-2 text-slate-100 text-xs focus:border-cyan-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase text-slate-400 block mb-1">
                  Scope & Narrative Summary
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the initial intake information and jurisdictional scope..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="w-full rounded border border-slate-800 bg-[#0d162d] px-3 py-2 text-slate-100 text-xs focus:border-cyan-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase text-slate-400 block mb-1">
                  Operational Priority
                </label>
                <select
                  value={newPriority}
                  onChange={e => setNewPriority(e.target.value as any)}
                  className="w-full rounded border border-slate-800 bg-[#0d162d] px-3 py-2 text-slate-100 text-xs focus:border-cyan-500 focus:outline-hidden"
                >
                  <option value="CRITICAL">Critical (Immediate Task Force Intervention)</option>
                  <option value="HIGH">High Priority</option>
                  <option value="MEDIUM">Medium / Routine</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: Data Sources */}
          {createStep === 2 && (
            <div className="space-y-4">
              <p className="text-slate-300 font-sans text-xs">
                Select evidentiary data feeds to bind to this investigation workspace:
              </p>
              <div className="space-y-2">
                {[
                  { id: 'FIR', name: 'Crime Branch FIR / CCTNS Station Diary Feeds' },
                  { id: 'CDR', name: 'Department of Telecommunications CDR Registry' },
                  { id: 'FIN', name: 'Financial Intelligence Unit STR Bank Wires' },
                  { id: 'ANPR', name: 'NHAI FASTag & High-Speed Toll Camera Network' }
                ].map(src => (
                  <label
                    key={src.id}
                    className="flex items-center gap-3 p-2.5 rounded border border-slate-800 bg-slate-900/50 hover:border-cyan-800 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSources.includes(src.id)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedSources([...selectedSources, src.id]);
                        } else {
                          setSelectedSources(selectedSources.filter(s => s !== src.id));
                        }
                      }}
                      className="rounded accent-cyan-500"
                    />
                    <span className="text-slate-200">{src.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Initial Seed Evidence Upload */}
          {createStep === 3 && (
            <div className="space-y-4">
              <div className="rounded border-2 border-dashed border-slate-700 bg-slate-900/50 p-6 text-center space-y-2">
                <FolderOpen className="h-8 w-8 text-cyan-400 mx-auto" />
                <div className="text-slate-200 font-semibold">Drop Initial Seed Report or Evidence File</div>
                <p className="text-[11px] text-slate-400">Accepts PDF, CSV, JSON, TXT (Demonstration Parser)</p>
                <div className="pt-2">
                  <span className="text-xs text-cyan-300 bg-slate-800 px-3 py-1 rounded border border-slate-700">
                    Target Seed: {uploadedFileName}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Analysis Configuration */}
          {createStep === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-slate-400 block">
                  Bridge Detection Sensitivity Threshold
                </label>
                <div className="p-3 rounded border border-slate-800 bg-slate-900/60 text-slate-300 flex items-center justify-between">
                  <span>Betweenness Centrality Cutoff</span>
                  <span className="text-cyan-400 font-bold">85 / 100</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase text-slate-400 block">
                  Pre-Movement CDR Burst Window
                </label>
                <div className="p-3 rounded border border-slate-800 bg-slate-900/60 text-slate-300 flex items-center justify-between">
                  <span>Temporal Delta Window</span>
                  <span className="text-cyan-400 font-bold">60 Minutes</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Final Review */}
          {createStep === 5 && (
            <div className="rounded border border-cyan-900/60 bg-cyan-950/20 p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-cyan-300 font-bold uppercase text-xs">
                <CheckCircle2 className="h-4 w-4" />
                Case Initializer Ready
              </div>
              <div className="text-slate-300 text-xs space-y-1 pt-1">
                <p><strong>Title:</strong> {newTitle || 'Untitled Case'}</p>
                <p><strong>Code:</strong> {newCode || 'AUTO-GENERATED'}</p>
                <p><strong>Priority:</strong> {newPriority}</p>
                <p><strong>Sources:</strong> {selectedSources.join(', ')}</p>
                <p><strong>Seed Evidence:</strong> {uploadedFileName}</p>
              </div>
            </div>
          )}

          {/* Modal Action Buttons */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            {createStep > 1 ? (
              <button
                type="button"
                onClick={() => setCreateStep(s => s - 1)}
                className="rounded border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs text-slate-300 hover:bg-slate-700"
              >
                Back
              </button>
            ) : <div />}

            {createStep < 5 ? (
              <button
                type="button"
                onClick={() => {
                  if (createStep === 1 && !newTitle.trim()) {
                    alert('Please enter an investigation title');
                    return;
                  }
                  setCreateStep(s => s + 1);
                }}
                className="flex items-center gap-1.5 rounded bg-cyan-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-cyan-500"
              >
                <span>Continue</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCreateSubmit}
                className="flex items-center gap-1.5 rounded bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Create & Launch Workspace</span>
              </button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
