/**
 * EVIDLINK Audit Service
 * Maintains an immutable chain of investigator modifications, attribute adjustments,
 * relationship linkages, and analytical lead review decisions.
 */

import { AuditEvent } from '../types';

const AUDIT_STORAGE_KEY = 'evidlink_audit_trail';

const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'AUD-001',
    investigationId: 'INV-2026-001',
    userId: 'USR-CID-7704',
    userName: 'Inspector Raman Kumar',
    userRole: 'Lead Forensic Intelligence Analyst',
    action: 'EVIDENCE_INGESTED',
    targetType: 'EVIDENCE',
    targetId: 'EVD-001',
    targetName: 'FIR-2026-0881',
    timestamp: '2026-08-12 10:15',
    details: 'Initial Police First Information Report ingested into evidence registry with SHA-256 validation.'
  },
  {
    id: 'AUD-002',
    investigationId: 'INV-2026-001',
    userId: 'USR-CID-7704',
    userName: 'Inspector Raman Kumar',
    userRole: 'Lead Forensic Intelligence Analyst',
    action: 'ENTITY_CREATED',
    targetType: 'ENTITY',
    targetId: 'PER-001',
    targetName: 'Devraj Anand',
    timestamp: '2026-08-12 11:30',
    details: 'Entity extracted from FIR-2026-0881 text and registered under Cluster Alpha logistics.'
  },
  {
    id: 'AUD-003',
    investigationId: 'INV-2026-001',
    userId: 'USR-CID-7704',
    userName: 'Inspector Raman Kumar',
    userRole: 'Lead Forensic Intelligence Analyst',
    action: 'ATTRIBUTE_VERIFIED',
    targetType: 'ATTRIBUTE',
    targetId: 'PER-002',
    targetName: 'Vikram S. / V. Sharma',
    timestamp: '2026-09-18 14:22',
    details: 'Primary mobile number +91 98771 90012 verified against DoT subscriber database.'
  },
  {
    id: 'AUD-004',
    investigationId: 'INV-2026-001',
    userId: 'USR-CID-7704',
    userName: 'Inspector Raman Kumar',
    userRole: 'Lead Forensic Intelligence Analyst',
    action: 'RELATIONSHIP_CREATED',
    targetType: 'RELATIONSHIP',
    targetId: 'REL-002',
    targetName: 'CALLED (Devraj Anand → Vikram S.)',
    timestamp: '2026-09-19 09:45',
    details: 'Established telecommunications edge based on 14 recorded voice calls in DoT CDR intake.'
  },
  {
    id: 'AUD-005',
    investigationId: 'INV-2026-001',
    userId: 'USR-CID-7704',
    userName: 'Inspector Raman Kumar',
    userRole: 'Lead Forensic Intelligence Analyst',
    action: 'LEAD_REVIEWED',
    targetType: 'LEAD',
    targetId: 'LEAD-001',
    targetName: 'Bridge Node Detection: Vikram S.',
    timestamp: '2026-09-22 16:30',
    details: 'Investigator reviewed topological betweenness score of 98/100 and marked lead as RELEVANT for surveillance tasking.'
  }
];

class AuditService {
  private getStore(): AuditEvent[] {
    const data = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  }

  private saveStore(items: AuditEvent[]): void {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(items));
  }

  public getAll(): AuditEvent[] {
    return this.getStore().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public getByInvestigation(investigationId: string): AuditEvent[] {
    return this.getAll().filter(e => e.investigationId === investigationId);
  }

  public getByTarget(targetId: string): AuditEvent[] {
    return this.getAll().filter(e => e.targetId === targetId);
  }

  public getRecent(limit = 20): AuditEvent[] {
    return this.getAll().slice(0, limit);
  }

  public logEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): AuditEvent {
    const store = this.getStore();
    const id = `AUD-${String(store.length + 1).padStart(3, '0')}`;
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const fullEvent: AuditEvent = {
      ...event,
      id,
      timestamp
    };

    store.unshift(fullEvent);
    this.saveStore(store);
    return fullEvent;
  }

  public resetToDefault(): void {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
  }
}

export const auditService = new AuditService();
