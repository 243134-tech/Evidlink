import React, { useState } from 'react';
import { Entity, VerificationStatus } from '../../types';
import { entityService } from '../../services/entityService';
import { useInvestigation } from '../../context/InvestigationContext';
import { X, Save, Shield } from 'lucide-react';

interface EditEntityModalProps {
  entity: Entity;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updated: Entity) => void;
}

export const EditEntityModal: React.FC<EditEntityModalProps> = ({
  entity,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { showToast } = useInvestigation();
  const [name, setName] = useState(entity.name);
  const [aliases, setAliases] = useState(entity.aliases.join(', '));
  const [summary, setSummary] = useState(entity.summary);
  const [confidence, setConfidence] = useState(entity.confidence);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(
    entity.verificationStatus || 'NEEDS_VERIFICATION'
  );
  const [status, setStatus] = useState<Entity['status']>(entity.status || 'ACTIVE');
  const [rationale, setRationale] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !summary.trim()) {
      showToast('Name and summary cannot be blank.');
      return;
    }

    const aliasList = aliases
      .split(',')
      .map(a => a.trim())
      .filter(Boolean);

    const updated = entityService.updateEntity(entity.id, {
      name: name.trim(),
      aliases: aliasList,
      summary: summary.trim(),
      confidence,
      verificationStatus,
      status
    }, rationale.trim() || 'Entity profile metadata updated by investigator.');

    if (updated) {
      showToast(`Entity profile ${updated.name} updated.`);
      onSuccess(updated);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded border border-slate-700 bg-[#091124] p-6 text-slate-200 shadow-2xl z-10 font-mono text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="text-[10px] text-cyan-400 uppercase tracking-wider font-bold">
              Edit Entity Dossier
            </div>
            <h3 className="text-sm font-bold text-slate-100 mt-0.5">
              {entity.name} ({entity.id})
            </h3>
          </div>
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:text-slate-200">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 mt-4">
          <div>
            <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
              Entity Name / Formal Designation *
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full rounded border border-slate-700 bg-[#0e1730] px-3 py-2 text-slate-100 font-bold focus:border-cyan-400 focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
              Operational Aliases (Comma-separated)
            </label>
            <input
              type="text"
              value={aliases}
              onChange={e => setAliases(e.target.value)}
              className="w-full rounded border border-slate-700 bg-[#0e1730] px-3 py-2 text-slate-200 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                Verification Status
              </label>
              <select
                value={verificationStatus}
                onChange={e => setVerificationStatus(e.target.value as any)}
                className="w-full rounded border border-slate-700 bg-[#0e1730] px-2.5 py-1.5 text-slate-200 focus:outline-hidden text-xs"
              >
                <option value="VERIFIED">VERIFIED</option>
                <option value="NEEDS_VERIFICATION">NEEDS_VERIFICATION</option>
                <option value="UNCERTAIN">UNCERTAIN</option>
                <option value="UNVERIFIED">UNVERIFIED</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                Operational Status
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full rounded border border-slate-700 bg-[#0e1730] px-2.5 py-1.5 text-slate-200 focus:outline-hidden text-xs"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="ARCHIVED">ARCHIVED</option>
                <option value="NEEDS_VERIFICATION">NEEDS_VERIFICATION</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-wider mb-1">
              <span>Confidence Score</span>
              <span className="text-cyan-400 font-bold">{confidence}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              value={confidence}
              onChange={e => setConfidence(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
              Analytical Summary *
            </label>
            <textarea
              value={summary}
              onChange={e => setSummary(e.target.value)}
              rows={3}
              className="w-full rounded border border-slate-700 bg-[#0e1730] p-2.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
              Audit Rationale / Reason for Update
            </label>
            <input
              type="text"
              value={rationale}
              onChange={e => setRationale(e.target.value)}
              placeholder="e.g. Identity corroborated after review of interstate toll footage"
              className="w-full rounded border border-slate-700 bg-[#0e1730] px-2.5 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-hidden"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-slate-700 px-3 py-1.5 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-cyan-600 px-4 py-1.5 font-bold text-white hover:bg-cyan-500 transition-colors flex items-center gap-1.5"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
