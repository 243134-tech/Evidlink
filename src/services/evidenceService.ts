import { Evidence, ProcessingStatus } from '../types';
import { initialEvidence } from '../data/mockData';

const STORAGE_KEY = 'evidlink_evidence';

class EvidenceService {
  private getStore(): Evidence[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEvidence));
      return initialEvidence;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialEvidence;
    }
  }

  private saveStore(items: Evidence[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  public getAll(): Evidence[] {
    return this.getStore();
  }

  public getById(id: string): Evidence | undefined {
    return this.getStore().find(e => e.id === id);
  }

  public getByEntityId(entityId: string): Evidence[] {
    return this.getStore().filter(e => e.entityIds.includes(entityId));
  }

  public add(item: Omit<Evidence, 'id' | 'timestamp' | 'hash'>): Evidence {
    const store = this.getStore();
    const id = `E${String(store.length + 1).padStart(3, '0')}`;
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const hash = `sha256-${Math.random().toString(36).substring(2, 12)}${Date.now().toString(36)}`;
    
    const newEvidence: Evidence = {
      ...item,
      id,
      timestamp,
      hash
    };

    store.unshift(newEvidence);
    this.saveStore(store);
    return newEvidence;
  }

  public updateStatus(id: string, status: ProcessingStatus): void {
    const store = this.getStore();
    const item = store.find(e => e.id === id);
    if (item) {
      item.status = status;
      this.saveStore(store);
    }
  }

  public resetToDefault(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEvidence));
  }
}

export const evidenceService = new EvidenceService();
