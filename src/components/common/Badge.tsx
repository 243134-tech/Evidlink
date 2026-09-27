import React from 'react';
import { EntityType, LeadPriority, LeadType, ProcessingStatus, EvidenceType } from '../../types';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'cyan' | 'amber' | 'rose' | 'emerald' | 'purple' | 'slate';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size = 'sm',
  icon
}) => {
  const variantStyles = {
    default: 'bg-slate-800/80 text-slate-300 border-slate-700/60',
    cyan: 'bg-cyan-950/60 text-cyan-300 border-cyan-800/50',
    amber: 'bg-amber-950/50 text-amber-300 border-amber-800/50',
    rose: 'bg-rose-950/50 text-rose-300 border-rose-800/50',
    emerald: 'bg-emerald-950/50 text-emerald-300 border-emerald-800/50',
    purple: 'bg-purple-950/50 text-purple-300 border-purple-800/50',
    slate: 'bg-slate-900/80 text-slate-400 border-slate-800'
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 tracking-wider font-mono font-medium',
    md: 'text-xs px-2.5 py-1 tracking-wider font-mono font-medium'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border uppercase transition-colors ${variantStyles[variant]} ${sizeStyles[size]}`}
    >
      {icon && <span className="opacity-80">{icon}</span>}
      {label}
    </span>
  );
};

export const EntityTypeBadge: React.FC<{ type: EntityType }> = ({ type }) => {
  const map: Partial<Record<EntityType, { label: string; variant: BadgeProps['variant'] }>> = {
    PERSON: { label: 'Person', variant: 'cyan' },
    VEHICLE: { label: 'Vehicle', variant: 'amber' },
    LOCATION: { label: 'Location', variant: 'emerald' },
    ACCOUNT: { label: 'Financial Account', variant: 'rose' },
    ORGANIZATION: { label: 'Organization', variant: 'purple' },
    PHONE: { label: 'Hardware/IMEI', variant: 'amber' },
    DOCUMENT: { label: 'Evidence Doc', variant: 'slate' },
    CUSTOM: { label: 'Custom Node', variant: 'slate' }
  };
  const config = map[type] || { label: type, variant: 'default' };
  return <Badge label={config.label} variant={config.variant} />;
};

export const EvidenceTypeBadge: React.FC<{ type: EvidenceType }> = ({ type }) => {
  const map: Partial<Record<EvidenceType, { label: string; variant: BadgeProps['variant'] }>> = {
    FIR_REPORT: { label: 'Police FIR', variant: 'cyan' },
    CDR: { label: 'DoT CDR', variant: 'amber' },
    FINANCIAL: { label: 'Bank Wire / STR', variant: 'rose' },
    VEHICLE_LOG: { label: 'ANPR Toll', variant: 'emerald' },
    LOCATION_RECORD: { label: 'BTS Tower', variant: 'purple' },
    INTELLIGENCE_NOTE: { label: 'Field Intel', variant: 'slate' },
    FORENSIC_EXTRACT: { label: 'Forensic Intercept', variant: 'slate' },
    DOCUMENT: { label: 'Case Document', variant: 'slate' },
    IMAGE: { label: 'Optical Evidence', variant: 'slate' },
    OTHER: { label: 'Other Record', variant: 'slate' }
  };
  const config = map[type] || { label: type, variant: 'default' };
  return <Badge label={config.label} variant={config.variant} />;
};

export const LeadPriorityBadge: React.FC<{ priority: LeadPriority }> = ({ priority }) => {

  const map: Record<LeadPriority, { label: string; variant: BadgeProps['variant'] }> = {
    CRITICAL: { label: 'Critical Lead', variant: 'rose' },
    HIGH: { label: 'High Priority', variant: 'amber' },
    MEDIUM: { label: 'Medium Lead', variant: 'cyan' },
    LOW: { label: 'Routine Signal', variant: 'slate' }
  };
  const config = map[priority] || { label: priority, variant: 'default' };
  return <Badge label={config.label} variant={config.variant} />;
};

export const ProcessingStatusBadge: React.FC<{ status: ProcessingStatus }> = ({ status }) => {
  const map: Record<ProcessingStatus, { label: string; variant: BadgeProps['variant'] }> = {
    COMPLETED: { label: 'Parsed & Ingested', variant: 'emerald' },
    PARSING: { label: 'Parsing Document', variant: 'cyan' },
    EXTRACTING: { label: 'Extracting Graph', variant: 'amber' },
    RESOLVING: { label: 'Resolving Entities', variant: 'purple' },
    PENDING: { label: 'Queued', variant: 'slate' },
    ERROR: { label: 'Ingest Anomaly', variant: 'rose' }
  };
  const config = map[status] || { label: status, variant: 'default' };
  return <Badge label={config.label} variant={config.variant} />;
};
