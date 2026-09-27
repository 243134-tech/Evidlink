import { investigationService } from './investigationService';
import { entityService } from './entityService';
import { evidenceService } from './evidenceService';
import { relationshipService } from './relationshipService';
import { analysisService } from './analysisService';

export interface GeneratedReport {
  id: string;
  investigationId: string;
  investigationTitle: string;
  generatedAt: string;
  generatedBy: string;
  classification: string;
  totalEntities: number;
  totalRelationships: number;
  totalEvidence: number;
  totalLeads: number;
  executiveSummary: string;
  keyFindings: string[];
  bridgeEntities: string[];
  responsibleUseNotice: string;
}

class ReportService {
  public generateInvestigationReport(investigationId: string): GeneratedReport {
    const inv = investigationService.getById(investigationId) || investigationService.getAll()[0];
    const entities = entityService.getAll();
    const relationships = relationshipService.getAll();
    const evidence = evidenceService.getAll();
    const leads = analysisService.getAllLeads();

    const bridges = entities.filter(e => e.isBridge).map(e => `${e.name} (${e.id}) - Betweenness: ${e.betweennessScore}/100`);

    return {
      id: `REP-${inv.code}-${Date.now().toString().slice(-4)}`,
      investigationId: inv.id,
      investigationTitle: inv.title,
      generatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      generatedBy: 'Inspector K. Raman (Lead Analyst)',
      classification: 'OFFICIAL / RESTRICTED - LAW ENFORCEMENT INTERNAL USE ONLY',
      totalEntities: entities.length,
      totalRelationships: relationships.length,
      totalEvidence: evidence.length,
      totalLeads: leads.length,
      executiveSummary: `Forensic graph analysis of ${inv.title} (${inv.code}) identified 2 dense operational clusters connected almost exclusively through key bridging entity Vikram S. (P002). Correlated financial intelligence demonstrates multi-hop layering through conduit account #3340 with sub-30 minute dwell time, coinciding with midnight vehicle transit logged by highway ANPR cameras.`,
      keyFindings: [
        'Network Topology: High modularity (0.74) separating transport logistics from corporate finance, with single-point bridge vulnerability.',
        'Financial Flow: Systematic ₹1.45 Cr layering pattern through intermediate ICICI account with 98.4% pass-through rate.',
        'Spatio-Temporal Coincidence: Optical plate recognition matches burner IMEI handset pings at Kundli Toll Plaza (NH44) across 3 distinct dates.',
        'Documentary Nexus: National E-Way bill manifest CF-882 directly bears identities of both corporate consignor and carrier fleet.'
      ],
      bridgeEntities: bridges,
      responsibleUseNotice: 'EVIDLINK is an investigative decision-support system. Analytical leads and graph metrics are computed from ingested synthetic evidence records and require independent human verification by authorized investigators. The system does not determine guilt or replace judicial procedure.'
    };
  }

  public exportDataJson(type: 'GRAPH' | 'LEADS' | 'EVIDENCE'): void {
    let payload: any = {};
    if (type === 'GRAPH') {
      payload = {
        entities: entityService.getAll(),
        relationships: relationshipService.getAll()
      };
    } else if (type === 'LEADS') {
      payload = {
        leads: analysisService.getAllLeads()
      };
    } else {
      payload = {
        evidence: evidenceService.getAll()
      };
    }

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `EVIDLINK_EXPORT_${type}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }
}

export const reportService = new ReportService();
