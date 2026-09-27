import React, { useState } from 'react';
import { Entity, EntityAttribute } from '../../types';
import { entityService } from '../../services/entityService';
import { evidenceService } from '../../services/evidenceService';
import { useInvestigation } from '../../context/InvestigationContext';
import { X, Plus, ShieldCheck, FileText } from 'lucide-react';

interface AddAttributeModalProps {
  entity: Entity;
  attributeToEdit?: EntityAttribute | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (attribute: EntityAttribute) => void;
}

const COMMON_KEYS_BY_TYPE: Record<string, Array<{ key: string; label: string; category: EntityAttribute['category'] }>> = {
  PERSON: [
    { key: 'PHONE_PRI', label: 'Primary Phone Number', category: 'CONTACT' },
    { key: 'PHONE_SEC', label: 'Alternate Phone Number', category: 'CONTACT' },
    { key: 'AADHAAR', label: 'Aadhaar Reference', category: 'IDENTIFIER' },
    { key: 'PAN', label: 'PAN Card Number', category: 'IDENTIFIER' },
    { key: 'PASSPORT', label: 'Passport Document No', category: 'IDENTIFIER' },
    { key: 'ADDRESS_RES', label: 'Residential Address', category: 'LOCATION' },
    { key: 'ADDRESS_OFF', label: 'Office Address', category: 'LOCATION' },
    { key: 'OCCUPATION', label: 'Stated Occupation', category: 'BIOGRAPHICAL' },
    { key: 'DOB', label: 'Date of Birth', category: 'BIOGRAPHICAL' },
    { key: 'ALIAS', label: 'Known Operational Alias', category: 'BIOGRAPHICAL' }
  ],
  VEHICLE: [
    { key: 'REG_NO', label: 'Registration Plate Number', category: 'IDENTIFIER' },
    { key: 'CHASSIS', label: 'Chassis / VIN Number', category: 'IDENTIFIER' },
    { key: 'ENGINE', label: 'Engine Serial Number', category: 'IDENTIFIER' },
    { key: 'FASTAG_ID', label: 'FASTag RFID Identifier', category: 'IDENTIFIER' },
    { key: 'MAKE_MODEL', label: 'Make & Model', category: 'VEHICLE' },
    { key: 'COLOR', label: 'Vehicle Color', category: 'VEHICLE' },
    { key: 'RC_OWNER', label: 'Registered RC Owner', category: 'IDENTIFIER' }
  ],
  PHONE: [
    { key: 'MSISDN', label: 'Mobile Subscriber Number', category: 'CONTACT' },
    { key: 'IMEI', label: 'Hardware IMEI', category: 'IDENTIFIER' },
    { key: 'IMSI', label: 'SIM Card IMSI', category: 'IDENTIFIER' },
    { key: 'SERVICE_PROVIDER', label: 'Cellular Operator', category: 'CONTACT' }
  ],
  ACCOUNT: [
    { key: 'ACC_NUM', label: 'Bank Account Number', category: 'FINANCIAL' },
    { key: 'IFSC', label: 'IFSC Branch Code', category: 'FINANCIAL' },
    { key: 'BANK', label: 'Banking Institution', category: 'FINANCIAL' },
    { key: 'ACC_HOLDER', label: 'Account Holder / Signatory', category: 'FINANCIAL' },
    { key: 'KYC_PAN', label: 'Linked KYC PAN', category: 'IDENTIFIER' }
  ],
  LOCATION: [
    { key: 'GEO_LAT', label: 'GPS Latitude', category: 'LOCATION' },
    { key: 'GEO_LNG', label: 'GPS Longitude', category: 'LOCATION' },
    { key: 'JURISDICTION', label: 'Police Station / Jurisdiction', category: 'LOCATION' },
    { key: 'POSTAL_CODE', label: 'PIN / Postal Code', category: 'LOCATION' }
  ],
  ORGANIZATION: [
    { key: 'CIN_LLPIN', label: 'Corporate CIN / LLPIN', category: 'IDENTIFIER' },
    { key: 'GSTIN', label: 'GSTIN Identification Number', category: 'FINANCIAL' },
    { key: 'REGISTERED_OFFICE', label: 'Registered Corporate Office', category: 'LOCATION' },
    { key: 'DIR_DIN', label: 'Director / Partner DIN', category: 'IDENTIFIER' }
  ]
};

export const AddAttributeModal: React.FC<AddAttributeModalProps> = ({
  entity,
  attributeToEdit,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { showToast } = useInvestigation();
  const evidenceList = evidenceService.getAll();

  const presets = COMMON_KEYS_BY_TYPE[entity.type] || COMMON_KEYS_BY_TYPE.PERSON;

  const [category, setCategory] = useState<EntityAttribute['category']>(attributeToEdit?.category || 'CONTACT');
  const [label, setLabel] = useState(attributeToEdit?.label || presets[0].label);
  const [key, setKey] = useState(attributeToEdit?.key || presets[0].key);
  const [value, setValue] = useState(attributeToEdit?.value || '');
  const [verificationStatus, setVerificationStatus] = useState<EntityAttribute['verificationStatus']>(
    attributeToEdit?.verificationStatus || 'VERIFIED'
  );
  const [sourceEvidenceId, setSourceEvidenceId] = useState(attributeToEdit?.sourceEvidenceId || 'EVD-001');
  const [notes, setNotes] = useState(attributeToEdit?.notes || '');

  if (!isOpen) return null;

  const handlePresetSelect = (p: { key: string; label: string; category: EntityAttribute['category'] }) => {
    setKey(p.key);
    setLabel(p.label);
    setCategory(p.category);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || !label.trim()) {
      showToast('Please enter both attribute label and value.');
      return;
    }

    if (attributeToEdit) {
      entityService.updateAttribute(entity.id, attributeToEdit.id, {
        category,
        label,
        key,
        value: value.trim(),
        verificationStatus,
        sourceEvidenceId,
        notes: notes.trim()
      });
      showToast(`Attribute '${label}' updated successfully.`);
      onSuccess({
        ...attributeToEdit,
        category,
        label,
        key,
        value: value.trim(),
        verificationStatus,
        sourceEvidenceId,
        notes: notes.trim()
      });
    } else {
      const created = entityService.addAttribute(entity.id, {
        category,
        label,
        key,
        value: value.trim(),
        verificationStatus,
        sourceEvidenceId,
        notes: notes.trim()
      });
      if (created) {
        showToast(`Attribute '${label}' added to ${entity.name}.`);
        onSuccess(created);
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded border border-slate-700 bg-[#091124] p-6 text-slate-200 shadow-2xl z-10 font-mono text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="text-[10px] text-cyan-400 uppercase tracking-wider font-bold">
              {attributeToEdit ? 'Modify Attribute' : 'Add Dossier Attribute'}
            </div>
            <h3 className="text-sm font-bold text-slate-100 mt-0.5">
              {entity.name} ({entity.id})
            </h3>
          </div>
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:text-slate-200">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Presets */}
        {!attributeToEdit && (
          <div className="my-3">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1.5">
              Standard {entity.type} Attributes
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {presets.map(p => (
                <button
                  type="button"
                  key={p.key}
                  onClick={() => handlePresetSelect(p)}
                  className={`rounded px-2 py-1 text-[11px] transition-colors ${
                    key === p.key
                      ? 'bg-cyan-900/80 text-cyan-300 border border-cyan-700 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 mt-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full rounded border border-slate-700 bg-[#0e1730] px-2.5 py-1.5 text-slate-200 focus:outline-hidden"
              >
                <option value="CONTACT">CONTACT</option>
                <option value="IDENTIFIER">IDENTIFIER</option>
                <option value="LOCATION">LOCATION</option>
                <option value="FINANCIAL">FINANCIAL</option>
                <option value="BIOGRAPHICAL">BIOGRAPHICAL</option>
                <option value="VEHICLE">VEHICLE</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                Verification State
              </label>
              <select
                value={verificationStatus}
                onChange={e => setVerificationStatus(e.target.value as any)}
                className="w-full rounded border border-slate-700 bg-[#0e1730] px-2.5 py-1.5 text-slate-200 focus:outline-hidden"
              >
                <option value="VERIFIED">VERIFIED (Corroborated)</option>
                <option value="UNVERIFIED">UNVERIFIED (Single Sighting)</option>
                <option value="UNCERTAIN">UNCERTAIN (Conflicting Logs)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                Field Label
              </label>
              <input
                type="text"
                value={label}
                onChange={e => setLabel(e.target.value)}
                placeholder="e.g. Alternate Mobile Number"
                className="w-full rounded border border-slate-700 bg-[#0e1730] px-2.5 py-1.5 text-slate-200 focus:border-cyan-500 focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                Internal Key
              </label>
              <input
                type="text"
                value={key}
                onChange={e => setKey(e.target.value.toUpperCase())}
                placeholder="e.g. PHONE_SEC"
                className="w-full rounded border border-slate-700 bg-[#0e1730] px-2.5 py-1.5 text-slate-200 focus:border-cyan-500 focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1 font-bold text-cyan-300">
              Attribute Value *
            </label>
            <input
              type="text"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="e.g. +91 98110 44519 or DL-04-TC-8812"
              className="w-full rounded border border-cyan-800 bg-[#0e1730] px-3 py-2 text-slate-100 font-bold text-sm focus:border-cyan-400 focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
              Source Evidence Citation
            </label>
            <select
              value={sourceEvidenceId}
              onChange={e => setSourceEvidenceId(e.target.value)}
              className="w-full rounded border border-slate-700 bg-[#0e1730] px-2.5 py-1.5 text-slate-200 focus:outline-hidden text-xs"
            >
              {evidenceList.map(ev => (
                <option key={ev.id} value={ev.id}>
                  {ev.id} · {ev.title.slice(0, 45)} ({ev.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
              Verification Notes / Investigator Rationale
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Verified against DoT telecom registration database on 22 Sep 2026"
              className="w-full rounded border border-slate-700 bg-[#0e1730] px-2.5 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-hidden"
            />
          </div>

          {/* Audit Notice */}
          <div className="rounded border border-slate-800 bg-[#060c1c] p-2.5 text-[10px] text-slate-400 leading-normal">
            <strong className="text-cyan-400">Investigative Audit Trail:</strong> Saving this attribute will generate an immutable audit log credited to Inspector Raman Kumar (CID-DEL-7704).
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
              className="rounded bg-cyan-600 px-4 py-1.5 font-bold text-white hover:bg-cyan-500 transition-colors"
            >
              {attributeToEdit ? 'Update Attribute' : 'Save Attribute to Dossier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
