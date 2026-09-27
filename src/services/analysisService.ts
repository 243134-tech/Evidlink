/**
 * EVIDLINK Analysis Service
 * Manages analytical leads, network signals, temporal timeline events,
 * and review workflows with audit logging.
 */

import {
  AnalyticalLead,
  LeadStatus,
  TimelineEvent,
  CommunicationRecord,
  FinancialTransaction,
  VehicleObservation,
  InvestigationNote
} from '../types';
import {
  initialAnalyticalLeads,
  initialTimelineEvents,
  initialCommunications,
  initialFinancialTransactions,
  initialVehicleObservations
} from '../data/mockData';
import { auditService } from './auditService';

const LEADS_KEY = 'evidlink_leads';
const TIMELINE_KEY = 'evidlink_timeline';
const CDR_KEY = 'evidlink_cdr';
const TX_KEY = 'evidlink_tx';
const VO_KEY = 'evidlink_vo';

class AnalysisService {
  private getLeads(): AnalyticalLead[] {
    const data = localStorage.getItem(LEADS_KEY);
    if (!data) {
      localStorage.setItem(LEADS_KEY, JSON.stringify(initialAnalyticalLeads));
      return initialAnalyticalLeads;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialAnalyticalLeads;
    }
  }

  private saveLeads(items: AnalyticalLead[]): void {
    localStorage.setItem(LEADS_KEY, JSON.stringify(items));
  }

  public getAllLeads(): AnalyticalLead[] {
    return this.getLeads();
  }

  public getLeadById(id: string): AnalyticalLead | undefined {
    return this.getLeads().find(l => l.id === id);
  }

  public updateLeadStatus(id: string, status: LeadStatus, noteContent?: string): void {
    const leads = this.getLeads();
    const item = leads.find(l => l.id === id);
    if (item) {
      const prevStatus = item.status;
      item.status = status;
      item.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);

      if (noteContent) {
        if (!item.investigatorNotes) item.investigatorNotes = [];
        item.investigatorNotes.push({
          id: `NOTE-${Date.now().toString(36).toUpperCase()}`,
          author: 'Inspector Raman Kumar',
          authorRole: 'Lead Forensic Intelligence Analyst',
          content: noteContent,
          timestamp: item.updatedAt,
          category: 'DIRECTIVE'
        });
      }

      this.saveLeads(leads);

      auditService.logEvent({
        investigationId: item.investigationId || 'INV-2026-001',
        userId: 'USR-CID-7704',
        userName: 'Inspector Raman Kumar',
        userRole: 'Lead Forensic Intelligence Analyst',
        action: 'LEAD_REVIEWED',
        targetType: 'LEAD',
        targetId: item.id,
        targetName: item.title,
        details: `Lead status changed from ${prevStatus} to ${status}.${noteContent ? ` Note: "${noteContent}"` : ''}`,
        previousValue: { status: prevStatus },
        newValue: { status, note: noteContent }
      });
    }
  }

  public addNoteToLead(id: string, content: string): InvestigationNote | undefined {
    const leads = this.getLeads();
    const item = leads.find(l => l.id === id);
    if (!item) return undefined;

    if (!item.investigatorNotes) item.investigatorNotes = [];
    const note: InvestigationNote = {
      id: `NOTE-${Date.now().toString(36).toUpperCase()}`,
      author: 'Inspector Raman Kumar',
      authorRole: 'Lead Forensic Intelligence Analyst',
      content,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      category: 'OBSERVATION'
    };

    item.investigatorNotes.push(note);
    item.updatedAt = note.timestamp;
    this.saveLeads(leads);

    auditService.logEvent({
      investigationId: item.investigationId || 'INV-2026-001',
      userId: 'USR-CID-7704',
      userName: 'Inspector Raman Kumar',
      userRole: 'Lead Forensic Intelligence Analyst',
      action: 'NOTE_ADDED',
      targetType: 'LEAD',
      targetId: item.id,
      targetName: item.title,
      details: `Investigator review note added to lead: "${content.slice(0, 60)}..."`
    });

    return note;
  }

  public getTimelineEvents(): TimelineEvent[] {
    const data = localStorage.getItem(TIMELINE_KEY);
    if (!data) {
      localStorage.setItem(TIMELINE_KEY, JSON.stringify(initialTimelineEvents));
      return initialTimelineEvents;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialTimelineEvents;
    }
  }

  public addTimelineEvent(event: Omit<TimelineEvent, 'id'>): TimelineEvent {
    const data = this.getTimelineEvents();
    const id = `TLE-${String(data.length + 1).padStart(3, '0')}`;
    const newEvent: TimelineEvent = {
      ...event,
      id
    };
    data.unshift(newEvent);
    localStorage.setItem(TIMELINE_KEY, JSON.stringify(data));
    return newEvent;
  }

  public getCommunications(): CommunicationRecord[] {
    const data = localStorage.getItem(CDR_KEY);
    if (!data) {
      localStorage.setItem(CDR_KEY, JSON.stringify(initialCommunications));
      return initialCommunications;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialCommunications;
    }
  }

  public getFinancialTransactions(): FinancialTransaction[] {
    const data = localStorage.getItem(TX_KEY);
    if (!data) {
      localStorage.setItem(TX_KEY, JSON.stringify(initialFinancialTransactions));
      return initialFinancialTransactions;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialFinancialTransactions;
    }
  }

  public getVehicleObservations(): VehicleObservation[] {
    const data = localStorage.getItem(VO_KEY);
    if (!data) {
      localStorage.setItem(VO_KEY, JSON.stringify(initialVehicleObservations));
      return initialVehicleObservations;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialVehicleObservations;
    }
  }

  public resetToDefault(): void {
    localStorage.setItem(LEADS_KEY, JSON.stringify(initialAnalyticalLeads));
    localStorage.setItem(TIMELINE_KEY, JSON.stringify(initialTimelineEvents));
    localStorage.setItem(CDR_KEY, JSON.stringify(initialCommunications));
    localStorage.setItem(TX_KEY, JSON.stringify(initialFinancialTransactions));
    localStorage.setItem(VO_KEY, JSON.stringify(initialVehicleObservations));
  }
}

export const analysisService = new AnalysisService();
