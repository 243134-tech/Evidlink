/**
 * EVIDLINK Relationship Service
 * First-class relationship management with rich forensic attributes,
 * directionality, temporal timestamps, evidence linking, and audit trail.
 */

import { Relationship, RelationshipType, DirectionType, InvestigationNote } from '../types';
import { initialRelationships } from '../data/mockData';
import { entityService } from './entityService';
import { auditService } from './auditService';

const STORAGE_KEY = 'evidlink_relationships';

class RelationshipService {
  private getStore(): Relationship[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialRelationships));
      return initialRelationships;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialRelationships;
    }
  }

  private saveStore(items: Relationship[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  public getAll(): Relationship[] {
    return this.getStore();
  }

  public getById(id: string): Relationship | undefined {
    return this.getStore().find(r => r.id === id || r.legacyId === id);
  }

  public getByEntityId(entityId: string): Relationship[] {
    return this.getStore().filter(r => r.sourceId === entityId || r.targetId === entityId);
  }

  public getByType(type: RelationshipType): Relationship[] {
    return this.getStore().filter(r => r.type === type);
  }

  public createRelationship(data: {
    type: RelationshipType;
    sourceId: string;
    targetId: string;
    label?: string;
    direction?: DirectionType;
    date?: string;
    startTime?: string;
    endTime?: string;
    frequency?: number;
    duration?: string;
    totalAmount?: number;
    confidence?: number;
    evidenceIds?: string[];
    extractionMethod?: Relationship['extractionMethod'];
    notes?: string;
    details?: string;
  }): Relationship {
    const store = this.getStore();
    const id = `REL-${String(store.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const sourceEntity = entityService.getById(data.sourceId);
    const targetEntity = entityService.getById(data.targetId);

    const isCrossCluster = Boolean(
      sourceEntity && targetEntity &&
      sourceEntity.communityId && targetEntity.communityId &&
      sourceEntity.communityId !== targetEntity.communityId
    );

    const newRel: Relationship = {
      id,
      legacyId: id,
      type: data.type,
      sourceId: data.sourceId,
      targetId: data.targetId,
      sourceName: sourceEntity?.name || data.sourceId,
      sourceType: sourceEntity?.type,
      targetName: targetEntity?.name || data.targetId,
      targetType: targetEntity?.type,
      direction: data.direction || 'DIRECTED',
      date: data.date || now.slice(0, 10),
      startTime: data.startTime,
      endTime: data.endTime,
      frequency: data.frequency || 1,
      duration: data.duration,
      totalAmount: data.totalAmount,
      confidence: data.confidence || 85,
      status: 'VERIFIED',
      evidenceIds: data.evidenceIds || ['EVD-001'],
      extractionMethod: data.extractionMethod || 'MANUAL_INVESTIGATOR',
      notes: data.notes,
      details: data.details || `${data.type} connection established between ${sourceEntity?.name || data.sourceId} and ${targetEntity?.name || data.targetId}`,
      createdBy: 'Inspector Raman Kumar',
      createdAt: now,
      updatedAt: now,
      label: data.label || data.type,
      weight: 2,
      isCrossCluster
    };

    store.push(newRel);
    this.saveStore(store);

    auditService.logEvent({
      investigationId: 'INV-2026-001',
      userId: 'USR-CID-7704',
      userName: 'Inspector Raman Kumar',
      userRole: 'Lead Forensic Intelligence Analyst',
      action: 'RELATIONSHIP_CREATED',
      targetType: 'RELATIONSHIP',
      targetId: newRel.id,
      targetName: `${newRel.type} (${newRel.sourceName} → ${newRel.targetName})`,
      details: `Relationship ${newRel.id} created with ${newRel.confidence}% confidence citing evidence [${newRel.evidenceIds.join(', ')}].`,
      newValue: newRel
    });

    return newRel;
  }

  public updateRelationship(id: string, updates: Partial<Relationship>, rationale?: string): Relationship | undefined {
    const store = this.getStore();
    const rel = store.find(r => r.id === id || r.legacyId === id);
    if (!rel) return undefined;

    const previousValue = { ...rel };
    Object.assign(rel, updates);
    rel.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);

    this.saveStore(store);

    auditService.logEvent({
      investigationId: 'INV-2026-001',
      userId: 'USR-CID-7704',
      userName: 'Inspector Raman Kumar',
      userRole: 'Lead Forensic Intelligence Analyst',
      action: 'RELATIONSHIP_UPDATED',
      targetType: 'RELATIONSHIP',
      targetId: rel.id,
      targetName: `${rel.type} (${rel.sourceName || rel.sourceId} → ${rel.targetName || rel.targetId})`,
      details: rationale || `Relationship specification modified by investigator.`,
      previousValue,
      newValue: updates
    });

    return rel;
  }

  public deleteRelationship(id: string, rationale?: string): boolean {
    const store = this.getStore();
    const index = store.findIndex(r => r.id === id || r.legacyId === id);
    if (index === -1) return false;

    const [deleted] = store.splice(index, 1);
    this.saveStore(store);

    auditService.logEvent({
      investigationId: 'INV-2026-001',
      userId: 'USR-CID-7704',
      userName: 'Inspector Raman Kumar',
      userRole: 'Lead Forensic Intelligence Analyst',
      action: 'RELATIONSHIP_REMOVED',
      targetType: 'RELATIONSHIP',
      targetId: deleted.id,
      targetName: `${deleted.type} (${deleted.sourceName} → ${deleted.targetName})`,
      details: rationale || `Relationship removed from active investigation graph.`
    });

    return true;
  }

  public add(rel: Omit<Relationship, 'id'>): Relationship {
    return this.createRelationship(rel as any);
  }

  public resetToDefault(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialRelationships));
  }
}

export const relationshipService = new RelationshipService();
