import { entityService } from './entityService';
import { evidenceService } from './evidenceService';
import { investigationService } from './investigationService';
import { analysisService } from './analysisService';
import { relationshipService } from './relationshipService';
import { Entity, Evidence, Investigation, AnalyticalLead, TimelineEvent } from '../types';

export interface SearchResults {
  entities: Entity[];
  evidence: Evidence[];
  leads: AnalyticalLead[];
  investigations: Investigation[];
  timeline: TimelineEvent[];
  totalMatches: number;
}

class SearchService {
  public search(query: string): SearchResults {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        entities: [],
        evidence: [],
        leads: [],
        investigations: [],
        timeline: [],
        totalMatches: 0
      };
    }

    const allEntities = entityService.getAll();
    const allEvidence = evidenceService.getAll();
    const allLeads = analysisService.getAllLeads();
    const allInvestigations = investigationService.getAll();
    const allTimeline = analysisService.getTimelineEvents();

    const entities = allEntities.filter(e => 
      e.id.toLowerCase().includes(q) ||
      e.name.toLowerCase().includes(q) ||
      e.aliases.some(a => a.toLowerCase().includes(q)) ||
      e.summary.toLowerCase().includes(q) ||
      Object.values(e.identifiers).some(v => v.toLowerCase().includes(q))
    );

    const evidence = allEvidence.filter(ev =>
      ev.id.toLowerCase().includes(q) ||
      ev.title.toLowerCase().includes(q) ||
      ev.rawContent.toLowerCase().includes(q) ||
      ev.source.toLowerCase().includes(q) ||
      ev.fileName.toLowerCase().includes(q)
    );

    const leads = allLeads.filter(l =>
      l.id.toLowerCase().includes(q) ||
      l.title.toLowerCase().includes(q) ||
      l.explanation.toLowerCase().includes(q) ||
      l.keySignals.some(s => s.toLowerCase().includes(q))
    );

    const investigations = allInvestigations.filter(inv =>
      inv.id.toLowerCase().includes(q) ||
      inv.title.toLowerCase().includes(q) ||
      inv.description.toLowerCase().includes(q) ||
      inv.code.toLowerCase().includes(q)
    );

    const timeline = allTimeline.filter(t =>
      t.id.toLowerCase().includes(q) ||
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      (t.locationName && t.locationName.toLowerCase().includes(q))
    );

    const totalMatches = entities.length + evidence.length + leads.length + investigations.length + timeline.length;

    return {
      entities,
      evidence,
      leads,
      investigations,
      timeline,
      totalMatches
    };
  }
}

export const searchService = new SearchService();
