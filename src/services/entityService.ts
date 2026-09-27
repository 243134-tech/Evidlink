/**
 * EVIDLINK Entity Service
 * Manages entities, structured attributes, verification states,
 * and identity resolution linking with complete audit logging.
 */

import { Entity, EntityAttribute, EntityResolutionCandidate, EntityType, InvestigationNote, VerificationStatus } from '../types';
import { initialEntities, initialResolutionCandidates } from '../data/mockData';
import { auditService } from './auditService';

const ENTITIES_KEY = 'evidlink_entities';
const RESOLUTION_KEY = 'evidlink_resolution_candidates';

class EntityService {
  private getEntitiesStore(): Entity[] {
    const data = localStorage.getItem(ENTITIES_KEY);
    if (!data) {
      localStorage.setItem(ENTITIES_KEY, JSON.stringify(initialEntities));
      return initialEntities;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialEntities;
    }
  }

  private saveEntitiesStore(items: Entity[]): void {
    localStorage.setItem(ENTITIES_KEY, JSON.stringify(items));
  }

  private getResolutionStore(): EntityResolutionCandidate[] {
    const data = localStorage.getItem(RESOLUTION_KEY);
    if (!data) {
      localStorage.setItem(RESOLUTION_KEY, JSON.stringify(initialResolutionCandidates));
      return initialResolutionCandidates;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialResolutionCandidates;
    }
  }

  private saveResolutionStore(items: EntityResolutionCandidate[]): void {
    localStorage.setItem(RESOLUTION_KEY, JSON.stringify(items));
  }

  public getAll(): Entity[] {
    return this.getEntitiesStore();
  }

  public getById(id: string): Entity | undefined {
    const store = this.getEntitiesStore();
    return store.find(e => e.id === id || e.legacyId === id);
  }

  public getByType(type: EntityType): Entity[] {
    return this.getEntitiesStore().filter(e => e.type === type);
  }

  public updateEntity(id: string, updates: Partial<Entity>, rationale?: string): Entity | undefined {
    const store = this.getEntitiesStore();
    const entity = store.find(e => e.id === id || e.legacyId === id);
    if (!entity) return undefined;

    const previousValue = { name: entity.name, status: entity.status, confidence: entity.confidence };
    Object.assign(entity, updates);
    entity.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);

    this.saveEntitiesStore(store);

    auditService.logEvent({
      investigationId: 'INV-2026-001',
      userId: 'USR-CID-7704',
      userName: 'Inspector Raman Kumar',
      userRole: 'Lead Forensic Intelligence Analyst',
      action: 'ENTITY_UPDATED',
      targetType: 'ENTITY',
      targetId: entity.id,
      targetName: entity.name,
      details: rationale || `Entity profile updated by investigator.`,
      previousValue,
      newValue: updates
    });

    return entity;
  }

  public addAttribute(entityId: string, attr: Omit<EntityAttribute, 'id'>): EntityAttribute | undefined {
    const store = this.getEntitiesStore();
    const entity = store.find(e => e.id === entityId || e.legacyId === entityId);
    if (!entity) return undefined;

    if (!entity.customAttributes) {
      entity.customAttributes = [];
    }

    const attrId = `ATTR-${Date.now().toString(36).toUpperCase()}`;
    const newAttr: EntityAttribute = {
      ...attr,
      id: attrId,
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      verifiedBy: attr.verificationStatus === 'VERIFIED' ? 'Inspector Raman Kumar' : undefined
    };

    entity.customAttributes.push(newAttr);
    entity.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
    this.saveEntitiesStore(store);

    auditService.logEvent({
      investigationId: 'INV-2026-001',
      userId: 'USR-CID-7704',
      userName: 'Inspector Raman Kumar',
      userRole: 'Lead Forensic Intelligence Analyst',
      action: 'ATTRIBUTE_ADDED',
      targetType: 'ATTRIBUTE',
      targetId: entity.id,
      targetName: `${entity.name} (${newAttr.label})`,
      details: `Attribute '${newAttr.label}: ${newAttr.value}' was added by investigator.`,
      newValue: newAttr
    });

    return newAttr;
  }

  public updateAttribute(entityId: string, attrId: string, updates: Partial<EntityAttribute>): boolean {
    const store = this.getEntitiesStore();
    const entity = store.find(e => e.id === entityId || e.legacyId === entityId);
    if (!entity || !entity.customAttributes) return false;

    const attr = entity.customAttributes.find(a => a.id === attrId);
    if (!attr) return false;

    const previousValue = { ...attr };
    Object.assign(attr, updates);
    attr.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
    if (updates.verificationStatus === 'VERIFIED') {
      attr.verifiedBy = 'Inspector Raman Kumar';
    }

    this.saveEntitiesStore(store);

    auditService.logEvent({
      investigationId: 'INV-2026-001',
      userId: 'USR-CID-7704',
      userName: 'Inspector Raman Kumar',
      userRole: 'Lead Forensic Intelligence Analyst',
      action: 'ATTRIBUTE_UPDATED',
      targetType: 'ATTRIBUTE',
      targetId: entity.id,
      targetName: `${entity.name} (${attr.label})`,
      details: `Attribute '${attr.label}' modified: status set to ${attr.verificationStatus}.`,
      previousValue,
      newValue: updates
    });

    return true;
  }

  public removeAttribute(entityId: string, attrId: string): boolean {
    const store = this.getEntitiesStore();
    const entity = store.find(e => e.id === entityId || e.legacyId === entityId);
    if (!entity || !entity.customAttributes) return false;

    const index = entity.customAttributes.findIndex(a => a.id === attrId);
    if (index === -1) return false;

    const removed = entity.customAttributes.splice(index, 1)[0];
    this.saveEntitiesStore(store);

    auditService.logEvent({
      investigationId: 'INV-2026-001',
      userId: 'USR-CID-7704',
      userName: 'Inspector Raman Kumar',
      userRole: 'Lead Forensic Intelligence Analyst',
      action: 'ATTRIBUTE_REMOVED',
      targetType: 'ATTRIBUTE',
      targetId: entity.id,
      targetName: entity.name,
      details: `Attribute '${removed.label}: ${removed.value}' was removed from dossier.`
    });

    return true;
  }

  public addNoteToEntity(entityId: string, content: string, category: InvestigationNote['category'] = 'OBSERVATION'): InvestigationNote | undefined {
    const store = this.getEntitiesStore();
    const entity = store.find(e => e.id === entityId || e.legacyId === entityId);
    if (!entity) return undefined;

    if (!entity.notesList) {
      entity.notesList = [];
    }

    const note: InvestigationNote = {
      id: `NOTE-${Date.now().toString(36).toUpperCase()}`,
      author: 'Inspector Raman Kumar',
      authorRole: 'Lead Forensic Intelligence Analyst',
      content,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      category
    };

    entity.notesList.unshift(note);
    this.saveEntitiesStore(store);

    auditService.logEvent({
      investigationId: 'INV-2026-001',
      userId: 'USR-CID-7704',
      userName: 'Inspector Raman Kumar',
      userRole: 'Lead Forensic Intelligence Analyst',
      action: 'NOTE_ADDED',
      targetType: 'ENTITY',
      targetId: entity.id,
      targetName: entity.name,
      details: `Investigator note attached to entity dossier: "${content.slice(0, 60)}..."`
    });

    return note;
  }

  public createEntity(data: {
    name: string;
    type: EntityType;
    summary: string;
    confidence?: number;
    aliases?: string[];
    identifiers?: { [key: string]: string };
    source?: string;
    notes?: string;
    communityId?: string;
  }): Entity {
    const store = this.getEntitiesStore();

    // Determine prefix based on type
    let prefix = 'ENT';
    if (data.type === 'PERSON') prefix = 'PER';
    else if (data.type === 'VEHICLE') prefix = 'VEH';
    else if (data.type === 'LOCATION') prefix = 'LOC';
    else if (data.type === 'ACCOUNT') prefix = 'ACC';
    else if (data.type === 'PHONE') prefix = 'TEL';
    else if (data.type === 'ORGANIZATION') prefix = 'ORG';

    // Count existing of same prefix
    const existingCount = store.filter(e => e.id.startsWith(prefix)).length;
    const id = `${prefix}-${String(existingCount + 1).padStart(3, '0')}`;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const newEntity: Entity = {
      id,
      legacyId: id,
      name: data.name,
      type: data.type,
      aliases: data.aliases || [],
      identifiers: data.identifiers || {},
      confidence: data.confidence || 85,
      verificationStatus: 'NEEDS_VERIFICATION',
      status: 'ACTIVE',
      summary: data.summary,
      firstObserved: now.slice(0, 10),
      lastObserved: now.slice(0, 10),
      createdAt: now,
      updatedAt: now,
      source: data.source || 'Manual Investigator Intake',
      notes: data.notes,
      tags: ['Manual Intake', data.type],
      communityId: data.communityId || 'CLUSTER_ALPHA',
      customAttributes: [],
      notesList: data.notes ? [{
        id: `NOTE-${Date.now().toString(36).toUpperCase()}`,
        author: 'Inspector Raman Kumar',
        authorRole: 'Lead Forensic Intelligence Analyst',
        content: data.notes,
        timestamp: now,
        category: 'OBSERVATION'
      }] : []
    };

    store.push(newEntity);
    this.saveEntitiesStore(store);

    auditService.logEvent({
      investigationId: 'INV-2026-001',
      userId: 'USR-CID-7704',
      userName: 'Inspector Raman Kumar',
      userRole: 'Lead Forensic Intelligence Analyst',
      action: 'ENTITY_CREATED',
      targetType: 'ENTITY',
      targetId: newEntity.id,
      targetName: newEntity.name,
      details: `New entity ${newEntity.id} (${newEntity.type}) created by investigator.`,
      newValue: newEntity
    });

    return newEntity;
  }

  public getResolutionCandidates(): EntityResolutionCandidate[] {
    return this.getResolutionStore();
  }

  public mergeEntities(primaryId: string, duplicateId: string, notes?: string): void {
    this.linkEntities(primaryId, duplicateId, notes);
  }

  public linkEntities(primaryId: string, candidateId: string, rationale?: string): void {
    const candidates = this.getResolutionStore();
    const target = candidates.find(c => 
      (c.primaryEntityId === primaryId && c.candidateEntityId === candidateId) ||
      (c.primaryEntityId === candidateId && c.candidateEntityId === primaryId)
    );

    if (target) {
      target.status = 'LINKED';
      target.lastEvaluated = new Date().toISOString().replace('T', ' ').slice(0, 16);
      target.reviewNotes = rationale || 'Confirmed identical subject based on multi-signal matching.';
      target.reviewedBy = 'Inspector Raman Kumar';
      this.saveResolutionStore(candidates);
    }

    // Boost confidence and sync alias on primary entity
    const entities = this.getEntitiesStore();
    const primary = entities.find(e => e.id === primaryId || e.legacyId === primaryId);
    if (primary) {
      primary.confidence = Math.min(100, primary.confidence + 6);
      primary.verificationStatus = 'VERIFIED';
      if (!primary.aliases.includes('R. Sharma (Resolved Intercept)')) {
        primary.aliases.push('R. Sharma (Resolved Intercept)');
      }
      primary.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
      this.saveEntitiesStore(entities);
    }

    auditService.logEvent({
      investigationId: 'INV-2026-001',
      userId: 'USR-CID-7704',
      userName: 'Inspector Raman Kumar',
      userRole: 'Lead Forensic Intelligence Analyst',
      action: 'ENTITY_LINKED',
      targetType: 'RESOLUTION',
      targetId: primaryId,
      targetName: primary?.name || primaryId,
      details: rationale || `Entities ${primaryId} and ${candidateId} confirmed as single identity after human review.`
    });
  }

  public separateEntities(primaryId: string, candidateId: string, rationale?: string): void {
    const candidates = this.getResolutionStore();
    const target = candidates.find(c => 
      (c.primaryEntityId === primaryId && c.candidateEntityId === candidateId) ||
      (c.primaryEntityId === candidateId && c.candidateEntityId === primaryId)
    );

    if (target) {
      target.status = 'SEPARATED';
      target.lastEvaluated = new Date().toISOString().replace('T', ' ').slice(0, 16);
      target.reviewNotes = rationale || 'Investigator verified these are distinct individuals.';
      target.reviewedBy = 'Inspector Raman Kumar';
      this.saveResolutionStore(candidates);
    }

    auditService.logEvent({
      investigationId: 'INV-2026-001',
      userId: 'USR-CID-7704',
      userName: 'Inspector Raman Kumar',
      userRole: 'Lead Forensic Intelligence Analyst',
      action: 'ENTITY_SEPARATED',
      targetType: 'RESOLUTION',
      targetId: primaryId,
      targetName: `${primaryId} vs ${candidateId}`,
      details: rationale || `Entities ${primaryId} and ${candidateId} kept separate by investigator.`
    });
  }

  public updateResolutionStatus(candidateId: string, status: 'LINKED' | 'SEPARATED'): void {
    const candidates = this.getResolutionStore();
    const target = candidates.find(c => c.id === candidateId);
    if (target) {
      if (status === 'LINKED') {
        this.linkEntities(target.primaryEntityId, target.candidateEntityId);
      } else {
        this.separateEntities(target.primaryEntityId, target.candidateEntityId);
      }
    }
  }

  public add(entity: Omit<Entity, 'id'>): Entity {
    return this.createEntity(entity as any);
  }

  public resetToDefault(): void {
    localStorage.setItem(ENTITIES_KEY, JSON.stringify(initialEntities));
    localStorage.setItem(RESOLUTION_KEY, JSON.stringify(initialResolutionCandidates));
  }
}

export const entityService = new EntityService();
