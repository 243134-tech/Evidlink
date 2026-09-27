import { Investigation } from '../types';
import { initialInvestigations } from '../data/mockData';

const STORAGE_KEY = 'evidlink_investigations';

class InvestigationService {
  private getStore(): Investigation[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialInvestigations));
      return initialInvestigations;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialInvestigations;
    }
  }

  private saveStore(items: Investigation[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  public getAll(): Investigation[] {
    return this.getStore();
  }

  public getById(id: string): Investigation | undefined {
    return this.getStore().find(inv => inv.id === id || inv.code === id);
  }

  public create(newInv: Omit<Investigation, 'id' | 'createdDate' | 'lastUpdated' | 'evidenceCount' | 'entityCount' | 'relationshipCount' | 'leadsCount'>): Investigation {
    const store = this.getStore();
    const id = `INV-2026-${String(store.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    
    const created: Investigation = {
      ...newInv,
      id,
      createdDate: now.slice(0, 10),
      lastUpdated: now,
      evidenceCount: 1,
      entityCount: 3,
      relationshipCount: 2,
      leadsCount: 1
    };

    store.unshift(created);
    this.saveStore(store);
    return created;
  }

  public update(id: string, updates: Partial<Investigation>): Investigation | undefined {
    const store = this.getStore();
    const index = store.findIndex(i => i.id === id);
    if (index === -1) return undefined;
    store[index] = { ...store[index], ...updates, lastUpdated: new Date().toISOString().slice(0, 16) };
    this.saveStore(store);
    return store[index];
  }

  public resetToDefault(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialInvestigations));
  }
}

export const investigationService = new InvestigationService();
