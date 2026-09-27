import React, { useState } from 'react';
import { Entity, EntityType } from '../../types';
import { entityService } from '../../services/entityService';
import { useInvestigation } from '../../context/InvestigationContext';
import { X, UserPlus, ShieldAlert, Sparkles } from 'lucide-react';

interface CreateEntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (entity: Entity) => void;
  defaultType?: EntityType;
}

export const CreateEntityModal: React.FC<CreateEntityModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultType = 'PERSON'
}) => {
  const { showToast } = useInvestigation();
  const [type, setType] = useState<EntityType>(defaultType);
  const [name, setName] = useState('');
  const [aliases, setAliases] = useState('');
  const [summary, setSummary] = useState('');
  const [confidence, setConfidence] = useState(85);
  const [primaryIdentifierKey, setPrimaryIdentifierKey] = useState('PAN');
  const [primaryIdentifierVal, setPrimaryIdentifierVal] = useState('');
  const [communityId, setCommunityId] = useState('CLUSTER_ALPHA');
  const [investigatorNote, setInvestigatorNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !summary.trim()) {
      showToast('Please provide both the entity name and an analytical summary.');
      return;
    }

    const aliasList = aliases
      .split(',')
      .map(a => a.trim())
      .filter(Boolean);

    const identifiers: Record<string, string> = {};
    if (primaryIdentifierVal.trim()) {
      identifiers[primaryIdentifierKey] = primaryIdentifierVal.trim();
    }

    const created = entityService.createEntity({
      name: name.trim(),
      type,
      summary: summary.trim(),
      confidence,
      aliases: aliasList,
      identifiers,
      communityId,
      source: 'Manual Investigator Intake',
      notes: investigatorNote.trim() || undefined
    });

    showToast(`Entity ${created.name} (${created.id}) registered successfully.`);
    if (onSuccess) onSuccess(created);
    onClose();

    // Reset form
    setName('');
    setAliases('');
    setSummary('');
    setPrimaryIdentifierVal('');
    setInvestigatorNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-xl rounded border border-slate-700 bg-[#091124] p-6 text-slate-200 shadow-2xl z-10 font-mono text-xs max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 font-sans">
                Register New Forensic Entity
              </h3>
              <p className="text-[10px] text-slate-400">
                Manual intake into Operation Meridian investigation workspace
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:text-slate-200">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Entity Type Selector */}
          <div>
            <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1.5 font-bold">
              Entity Classification *
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {(['PERSON', 'VEHICLE', 'PHONE', 'ACCOUNT', 'LOCATION', 'ORGANIZATION'] as EntityType[]).map(t => (
                <button
                  type="button"
                  key={t}
                  onClick={() => {
                    setType(t);
                    if (t === 'PERSON') setPrimaryIdentifierKey('PAN');
                    else if (t === 'VEHICLE') setPrimaryIdentifierKey('REG_NO');
                    else if (t === 'PHONE') setPrimaryIdentifierKey('MSISDN');
                    else if (t === 'ACCOUNT') setPrimaryIdentifierKey('ACC_NUM');
                    else if (t === 'LOCATION') setPrimaryIdentifierKey('JURISDICTION');
                    else if (t === 'ORGANIZATION') setPrimaryIdentifierKey('CIN_LLPIN');
                  }}
                  className={`rounded py-2 text-center text-[10px] font-bold border transition-colors ${
                    type === t
                      ? 'border-cyan-400 bg-cyan-950/80 text-cyan-300 shadow-sm'
                      : 'border-slate-800 bg-[#0e1730] text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Name & Aliases */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1 font-bold text-cyan-300">
                Entity Name / Title *
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={
                  type === 'PERSON' ? 'e.g. Harpreet S. Dhillon' :
                  type === 'VEHICLE' ? 'e.g. Innova Crysta (HR-55-AB-1290)' :
                  type === 'PHONE' ? 'e.g. Burner SIM 98110 33401' :
                  type === 'ACCOUNT' ? 'e.g. Axis Current A/C #1102' :
                  type === 'LOCATION' ? 'e.g. Panipat Border Toll Barrier' :
                  'e.g. Apex Logistical Clearing LLP'
                }
                className="w-full rounded border border-slate-700 bg-[#0e1730] px-3 py-2 text-slate-100 font-bold focus:border-cyan-400 focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                Known Aliases (Comma-separated)
              </label>
              <input
                type="text"
                value={aliases}
                onChange={e => setAliases(e.target.value)}
                placeholder="e.g. Happy, HP Carrier, Harry"
                className="w-full rounded border border-slate-700 bg-[#0e1730] px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Primary Identifier */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                Identifier Type
              </label>
              <input
                type="text"
                value={primaryIdentifierKey}
                onChange={e => setPrimaryIdentifierKey(e.target.value.toUpperCase())}
                className="w-full rounded border border-slate-700 bg-[#0e1730] px-2.5 py-1.5 text-slate-200 focus:outline-hidden"
              />
            </div>

            <div className="col-span-2">
              <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                Identifier Value
              </label>
              <input
                type="text"
                value={primaryIdentifierVal}
                onChange={e => setPrimaryIdentifierVal(e.target.value)}
                placeholder="e.g. ABCDE1234F or +91 98110 33401"
                className="w-full rounded border border-slate-700 bg-[#0e1730] px-2.5 py-1.5 text-slate-200 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Cluster & Initial Confidence */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                Initial Cluster Affinity
              </label>
              <select
                value={communityId}
                onChange={e => setCommunityId(e.target.value)}
                className="w-full rounded border border-slate-700 bg-[#0e1730] px-2.5 py-1.5 text-slate-200 focus:outline-hidden"
              >
                <option value="CLUSTER_ALPHA">Cluster Alpha (Logistics & Fleet)</option>
                <option value="CLUSTER_BETA">Cluster Beta (Financiers & Corporate)</option>
                <option value="BRIDGE_NODE">Bridge Node Corridor</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                <span>Confidence Assessment</span>
                <span className="text-cyan-400 font-bold">{confidence}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={confidence}
                onChange={e => setConfidence(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer mt-1"
              />
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1 font-bold text-cyan-300">
              Investigative Summary & Role Description *
            </label>
            <textarea
              value={summary}
              onChange={e => setSummary(e.target.value)}
              placeholder="Describe why this entity was ingested and their observed functional role..."
              rows={2}
              className="w-full rounded border border-slate-700 bg-[#0e1730] p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-hidden"
              required
            />
          </div>

          {/* Initial Note */}
          <div>
            <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
              Case Opening Rationale / Intake Note
            </label>
            <input
              type="text"
              value={investigatorNote}
              onChange={e => setInvestigatorNote(e.target.value)}
              placeholder="e.g. Identified via toll CCTV surveillance correlation on GT Road"
              className="w-full rounded border border-slate-700 bg-[#0e1730] px-2.5 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-hidden"
            />
          </div>

          {/* Responsible Use Disclaimer */}
          <div className="rounded border border-amber-900/40 bg-amber-950/20 p-2.5 text-[10px] text-amber-300/80 leading-relaxed flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Ethical Investigative Standard:</strong> Entity registration designates an analytical subject for formal inquiry. It does not constitute a legal determination of guilt or criminal liability.
            </span>
          </div>

          {/* Buttons */}
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
              <UserPlus className="h-3.5 w-3.5" />
              <span>Create Entity</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
