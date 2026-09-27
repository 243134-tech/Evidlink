/**
 * EVIDLINK - Investigative Intelligence System Domain Models
 * SIH 2026 Problem Statement SIH26189 - Ministry of Home Affairs
 */

export type EntityType = 
  | 'PERSON' 
  | 'VEHICLE' 
  | 'LOCATION' 
  | 'ACCOUNT' 
  | 'ORGANIZATION' 
  | 'PHONE' 
  | 'DOCUMENT'
  | 'CUSTOM';

export type RelationshipType = 
  | 'CALLED' 
  | 'MESSAGED'
  | 'MET' 
  | 'TRANSFERRED_FUNDS' 
  | 'TRANSFERRED'
  | 'OWNED' 
  | 'OPERATED'
  | 'OBSERVED' 
  | 'LOCATED_AT' 
  | 'LOCATED' 
  | 'ASSOCIATED_WITH' 
  | 'ASSOCIATED'
  | 'WORKED_WITH'
  | 'TRAVELED_TO'
  | 'MENTIONED_IN'
  | 'MENTIONED'
  | 'REGISTERED_TO'
  | 'CONNECTED_TO'
  | 'CO_LOCATED'
  | 'SHARED_IDENTIFIER';

export type EvidenceType = 
  | 'FIR_REPORT' 
  | 'CDR' 
  | 'FINANCIAL' 
  | 'VEHICLE_LOG' 
  | 'LOCATION_RECORD' 
  | 'INTELLIGENCE_NOTE'
  | 'FORENSIC_EXTRACT'
  | 'DOCUMENT'
  | 'IMAGE'
  | 'OTHER';

export type ProcessingStatus = 'PENDING' | 'PARSING' | 'EXTRACTING' | 'RESOLVING' | 'COMPLETED' | 'ERROR';

export type LeadPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type LeadType = 
  | 'COMMUNICATION_BURST' 
  | 'FINANCIAL_CHAIN' 
  | 'CROSS_CLUSTER_CONNECTION' 
  | 'IDENTITY_INCONSISTENCY' 
  | 'UNUSUAL_LOCATION_PATTERN' 
  | 'NETWORK_BRIDGE'
  | 'RELATIONSHIP_CONCENTRATION'
  | 'REPEATED_VEHICLE_OBSERVATION';

export type LeadStatus = 'NEW' | 'UNDER_REVIEW' | 'RELEVANT' | 'NOT_RELEVANT' | 'CLOSED' | 'REVIEWED' | 'DISMISSED';

export type VerificationStatus = 'VERIFIED' | 'UNVERIFIED' | 'UNCERTAIN' | 'NEEDS_VERIFICATION';

export type DirectionType = 'DIRECTED' | 'UNDIRECTED' | 'BIDIRECTIONAL';

export interface User {
  id: string;
  name: string;
  badgeNumber: string;
  role: 'ADMIN' | 'INVESTIGATOR' | 'ANALYST' | 'REVIEWER';
  agency: string;
  clearanceLevel: string;
  email?: string;
}

export interface InvestigationNote {
  id: string;
  author: string;
  authorRole: string;
  content: string;
  timestamp: string;
  category: 'OBSERVATION' | 'LEGAL' | 'DIRECTIVE' | 'VERIFICATION' | 'GENERAL';
}

export interface AuditEvent {
  id: string;
  investigationId: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  targetType: 'ENTITY' | 'RELATIONSHIP' | 'EVIDENCE' | 'LEAD' | 'ATTRIBUTE' | 'RESOLUTION' | 'INVESTIGATION';
  targetId: string;
  targetName: string;
  timestamp: string;
  details: string;
  previousValue?: any;
  newValue?: any;
}

export interface EntityAttribute {
  id: string;
  key: string;
  label: string;
  value: string;
  category: 'IDENTIFIER' | 'CONTACT' | 'LOCATION' | 'FINANCIAL' | 'BIOGRAPHICAL' | 'VEHICLE' | 'OTHER';
  verificationStatus: 'VERIFIED' | 'UNVERIFIED' | 'UNCERTAIN';
  sourceEvidenceId?: string;
  notes?: string;
  updatedAt?: string;
  verifiedBy?: string;
}

export interface PersonDetails {
  fullName: string;
  aliases: string[];
  dateOfBirth?: string;
  phoneNumbers: string[];
  addresses: string[];
  identificationReferences: { [key: string]: string }; // PAN, Aadhaar ref, Passport
  occupation?: string;
  associatedVehicles?: string[];
  associatedAccounts?: string[];
  associatedOrganizations?: string[];
  knownLocations?: string[];
  sourceEvidence?: string[];
  verificationStatus: VerificationStatus;
  notes?: string;
}

export interface VehicleDetails {
  registrationNumber: string;
  vehicleType: string;
  make: string;
  model: string;
  color: string;
  owner?: string;
  associatedPersons?: string[];
  associatedLocations?: string[];
  sightingsCount: number;
  sourceEvidence?: string[];
  notes?: string;
}

export interface PhoneDetails {
  phoneNumber: string;
  associatedPerson?: string;
  provider: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  firstObserved: string;
  lastObserved: string;
  communicationCount: number;
  associatedEntities?: string[];
  sourceEvidence?: string[];
}

export interface AccountDetails {
  accountIdentifier: string;
  accountHolder: string;
  institution: string;
  accountType: 'SAVINGS' | 'CURRENT' | 'ESCROW' | 'SHELL_HOLDING' | 'OVERSEAS';
  transactionCount: number;
  totalTransactionValue: number;
  associatedEntities?: string[];
  sourceEvidence?: string[];
}

export interface LocationDetails {
  locationName: string;
  address: string;
  latitude: number;
  longitude: number;
  locationType: 'TRANSIT_TOLL' | 'WAREHOUSE' | 'RESIDENCE' | 'OFFICE' | 'SAFEHOUSE' | 'FINANCIAL_DISTRICT';
  observedEntities?: string[];
  observationCount: number;
  timeRange: string;
  sourceEvidence?: string[];
}

export interface OrganizationDetails {
  organizationName: string;
  type: 'COMMERCIAL_FREIGHT' | 'FINANCIAL_HOLDING' | 'LEGAL_ESCROW' | 'LOGISTICS_HUB' | 'FRONT_COMPANY';
  address: string;
  associatedPersons?: string[];
  associatedAccounts?: string[];
  associatedVehicles?: string[];
  sourceEvidence?: string[];
}

export interface Entity {
  id: string; // Stable ID like PER-001, VEH-001, etc.
  legacyId?: string; // P001 for backwards compatibility
  name: string;
  type: EntityType;
  aliases: string[];
  identifiers: { [key: string]: string };
  confidence: number; // 0 to 100
  verificationStatus?: VerificationStatus;
  communityId?: string;
  centralityScore?: number; // 0 to 100
  betweennessScore?: number; // 0 to 100
  degreeCount?: number;
  isBridge?: boolean;
  priorityScore?: number;
  status: 'ACTIVE' | 'ARCHIVED' | 'NEEDS_VERIFICATION';
  summary: string;
  photoUrl?: string;
  firstObserved: string;
  lastObserved: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
  source?: string;
  notes?: string;
  customAttributes?: EntityAttribute[];
  person?: PersonDetails;
  vehicle?: VehicleDetails;
  phone?: PhoneDetails;
  account?: AccountDetails;
  location?: LocationDetails;
  organization?: OrganizationDetails;
  notesList?: InvestigationNote[];
  auditHistory?: AuditEvent[];
}

export interface RelationshipTypeDefinition {
  type: RelationshipType;
  label: string;
  description: string;
  sourceEntityTypes: EntityType[];
  targetEntityTypes: EntityType[];
  directionality: DirectionType;
  evidenceRequirements: string;
}

export interface Relationship {
  id: string; // Stable ID like REL-001
  legacyId?: string; // R001
  type: RelationshipType;
  sourceId: string;
  targetId: string;
  sourceName?: string;
  sourceType?: EntityType;
  targetName?: string;
  targetType?: EntityType;
  direction?: DirectionType;
  date?: string;
  startTime?: string;
  endTime?: string;
  frequency?: number;
  duration?: string;
  totalAmount?: number;
  confidence: number;
  status?: 'ACTIVE' | 'UNDER_REVIEW' | 'VERIFIED' | 'DISPUTED';
  evidenceIds: string[];
  extractionMethod?: 'CDR_ANALYSIS' | 'FINANCIAL_INGEST' | 'ANPR_CORRELATION' | 'MANUAL_INVESTIGATOR' | 'NLP_EXTRACTION';
  notes?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  label: string;
  weight: number;
  isCrossCluster?: boolean;
  details?: string;
  firstDate?: string;
  lastDate?: string;
}

export interface Evidence {
  id: string; // EVD-001
  legacyId?: string; // E001
  title: string;
  type: EvidenceType;
  source: string;
  date: string;
  timestamp: string;
  status: ProcessingStatus;
  confidence: number;
  entityIds: string[];
  relationshipIds: string[];
  rawContent: string;
  extractedSnippet?: string;
  hash: string;
  fileSize: string;
  uploadedBy: string;
  fileName: string;
  createdAt?: string;
  updatedAt?: string;
  notes?: string;
  provenance: {
    sourceAgency: string;
    intakeChannel: string;
    chainOfCustodyId: string;
    verifiedBy: string;
  };
}

export interface Investigation {
  id: string;
  code: string;
  title: string;
  description: string;
  status: 'ACTIVE' | 'PENDING_REVIEW' | 'ARCHIVED';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  leadInvestigator: string;
  createdDate: string;
  lastUpdated: string;
  evidenceCount: number;
  entityCount: number;
  relationshipCount: number;
  leadsCount: number;
  tags: string[];
  summaryAnalysis: string;
  notesList?: InvestigationNote[];
}

export interface AnalyticalLead {
  id: string; // LEAD-001
  title: string;
  type: LeadType;
  investigationId: string;
  detectedTime: string;
  priority: LeadPriority;
  confidence: number;
  explanation: string;
  detectionReason?: string;
  supportingEvidenceIds: string[];
  relatedEntityIds: string[];
  relatedRelationshipIds: string[];
  status: LeadStatus;
  keySignals: string[];
  recommendedAction: string;
  analyticalScore?: number;
  createdAt?: string;
  updatedAt?: string;
  investigatorNotes?: InvestigationNote[];
  networkMetrics?: {
    degreeScore?: number;
    betweennessScore?: number;
    communityA?: string;
    communityB?: string;
    temporalBurstRate?: string;
    financialHopCount?: number;
  };
}

export interface TimelineEvent {
  id: string;
  investigationId: string;
  date: string;
  time: string;
  timestamp: string;
  title: string;
  description: string;
  category: 
    | 'COMMUNICATION' 
    | 'VEHICLE' 
    | 'FINANCIAL' 
    | 'LOCATION' 
    | 'REPORT' 
    | 'LEAD_GENERATED' 
    | 'RESOLUTION'
    | 'EVIDENCE_UPLOADED'
    | 'ENTITY_UPDATED'
    | 'NOTE_ADDED';
  relatedEntityIds: string[];
  evidenceId?: string;
  significance: 'HIGH' | 'MEDIUM' | 'LOW';
  locationName?: string;
  location?: string;
  source?: string;
  investigatorNote?: string;
}

export interface CommunicationRecord {
  id: string;
  callerId: string;
  callerNumber: string;
  callerName: string;
  receiverId: string;
  receiverNumber: string;
  receiverName: string;
  timestamp: string;
  durationSeconds: number;
  callType: 'VOICE' | 'SMS' | 'ENCRYPTED_CALL';
  cellTowerId: string;
  evidenceId: string;
  isBurst?: boolean;
}

export interface FinancialTransaction {
  id: string;
  sourceAccountId: string;
  sourceEntityId: string;
  sourceEntityName: string;
  targetAccountId: string;
  targetEntityId: string;
  targetEntityName: string;
  amount: number;
  currency: string;
  timestamp: string;
  referenceNumber: string;
  channel: 'IMPS' | 'NEFT' | 'RTGS' | 'UPI' | 'WIRE';
  evidenceId: string;
  hopIndex?: number;
}

export interface VehicleObservation {
  id: string;
  vehicleId: string;
  plateNumber: string;
  associatedEntityId: string;
  associatedEntityName: string;
  locationId: string;
  locationName: string;
  timestamp: string;
  detectionMethod: 'ANPR_CAMERA' | 'TOLL_PLAZA' | 'FIELD_PATROL';
  confidence: number;
  evidenceId: string;
  speedKmh?: number;
}

export interface EntityResolutionCandidate {
  id: string;
  primaryEntityId: string;
  candidateEntityId: string;
  primaryEntityName?: string;
  candidateEntityName?: string;
  confidenceScore: number;
  commonSignals: string[];
  conflictingSignals: string[];
  supportingEvidenceIds: string[];
  status: 'PENDING_REVIEW' | 'LINKED' | 'SEPARATED';
  lastEvaluated: string;
  reviewNotes?: string;
  reviewedBy?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'LEAD' | 'EVIDENCE' | 'RESOLUTION' | 'SYSTEM';
  isRead: boolean;
  targetRoute: string;
  priority: 'HIGH' | 'NORMAL';
}

export interface GraphNode {
  id: string;
  name: string;
  type: EntityType;
  communityId: string;
  isBridge: boolean;
  priorityScore: number;
  betweenness: number;
  degree: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  aliases: string[];
  verificationStatus?: VerificationStatus;
  confidence?: number;
}

export interface GraphLink {
  id: string;
  source: string;
  target: string;
  type: RelationshipType;
  label: string;
  confidence: number;
  isCrossCluster: boolean;
  evidenceIds: string[];
  weight: number;
  status?: string;
}

export const RELATIONSHIP_TAXONOMY: RelationshipTypeDefinition[] = [
  {
    type: 'CALLED',
    label: 'Telecom Voice Call',
    description: 'Direct cellular voice exchange recorded by telecommunications gateway.',
    sourceEntityTypes: ['PERSON', 'PHONE'],
    targetEntityTypes: ['PERSON', 'PHONE'],
    directionality: 'DIRECTED',
    evidenceRequirements: 'Certified Call Detail Record (CDR) or BTS tower intercept'
  },
  {
    type: 'MESSAGED',
    label: 'SMS / Instant Message',
    description: 'Short messaging service or electronic text packet transmission.',
    sourceEntityTypes: ['PERSON', 'PHONE'],
    targetEntityTypes: ['PERSON', 'PHONE'],
    directionality: 'DIRECTED',
    evidenceRequirements: 'SMS gateway log or forensic extraction'
  },
  {
    type: 'MET',
    label: 'Physical In-Person Meeting',
    description: 'Co-located physical meeting observed by surveillance patrol or confirmed in statement.',
    sourceEntityTypes: ['PERSON'],
    targetEntityTypes: ['PERSON'],
    directionality: 'UNDIRECTED',
    evidenceRequirements: 'Field observation report or CCTV optical footage'
  },
  {
    type: 'TRANSFERRED_FUNDS',
    label: 'Fund Transfer / Wire',
    description: 'Electronic banking transaction (RTGS, NEFT, IMPS) between designated accounts.',
    sourceEntityTypes: ['ACCOUNT', 'PERSON', 'ORGANIZATION'],
    targetEntityTypes: ['ACCOUNT', 'PERSON', 'ORGANIZATION'],
    directionality: 'DIRECTED',
    evidenceRequirements: 'Bank statement, SWIFT/UTR transaction digest, or STR filing'
  },
  {
    type: 'TRANSFERRED',
    label: 'Asset / Physical Transfer',
    description: 'Handover or dispatch of physical assets, freight, or documents.',
    sourceEntityTypes: ['PERSON', 'ORGANIZATION'],
    targetEntityTypes: ['PERSON', 'ORGANIZATION', 'LOCATION'],
    directionality: 'DIRECTED',
    evidenceRequirements: 'Consignment manifest, receipt, or surveillance log'
  },
  {
    type: 'OWNED',
    label: 'Ownership / Title Holder',
    description: 'Legal or beneficial registration of an asset, vehicle, or account.',
    sourceEntityTypes: ['PERSON', 'ORGANIZATION'],
    targetEntityTypes: ['VEHICLE', 'ACCOUNT', 'LOCATION', 'PHONE'],
    directionality: 'DIRECTED',
    evidenceRequirements: 'Vahan database, MCA-21 registry, or title deed'
  },
  {
    type: 'OPERATED',
    label: 'Operator / Driver / Handler',
    description: 'Physical operation or active management of vehicle, facility, or account without legal title.',
    sourceEntityTypes: ['PERSON'],
    targetEntityTypes: ['VEHICLE', 'ACCOUNT', 'LOCATION', 'ORGANIZATION'],
    directionality: 'DIRECTED',
    evidenceRequirements: 'Driver trip log, witness deposition, or FASTag toll tag association'
  },
  {
    type: 'OBSERVED',
    label: 'Surveillance Observation',
    description: 'Sighting by automated camera (ANPR, CCTV) or field checkpoint personnel.',
    sourceEntityTypes: ['LOCATION'],
    targetEntityTypes: ['VEHICLE', 'PERSON'],
    directionality: 'DIRECTED',
    evidenceRequirements: 'ANPR camera optical capture or toll timestamp'
  },
  {
    type: 'LOCATED_AT',
    label: 'Co-Located / Base of Operations',
    description: 'Entity residing at, registered at, or repeatedly recorded at a geographic location.',
    sourceEntityTypes: ['PERSON', 'VEHICLE', 'ORGANIZATION'],
    targetEntityTypes: ['LOCATION'],
    directionality: 'DIRECTED',
    evidenceRequirements: 'Address registration, lease contract, or repeated BTS cell tower lock'
  },
  {
    type: 'LOCATED',
    label: 'Sited / Present',
    description: 'Presence recorded at a location.',
    sourceEntityTypes: ['PERSON', 'VEHICLE'],
    targetEntityTypes: ['LOCATION'],
    directionality: 'DIRECTED',
    evidenceRequirements: 'Location record'
  },
  {
    type: 'ASSOCIATED_WITH',
    label: 'Investigative Association',
    description: 'Corroborated operational, logistical, or syndicate association.',
    sourceEntityTypes: ['PERSON', 'ORGANIZATION', 'ACCOUNT'],
    targetEntityTypes: ['PERSON', 'ORGANIZATION', 'ACCOUNT'],
    directionality: 'UNDIRECTED',
    evidenceRequirements: 'FIR mention, intelligence memo, or multi-modal corroboration'
  },
  {
    type: 'ASSOCIATED',
    label: 'General Association',
    description: 'General linkage between entities.',
    sourceEntityTypes: ['PERSON', 'ORGANIZATION'],
    targetEntityTypes: ['PERSON', 'ORGANIZATION'],
    directionality: 'UNDIRECTED',
    evidenceRequirements: 'Intelligence record'
  },
  {
    type: 'WORKED_WITH',
    label: 'Professional / Syndicate Collaboration',
    description: 'Shared commercial enterprise, transport brokerage, or operational partnership.',
    sourceEntityTypes: ['PERSON'],
    targetEntityTypes: ['PERSON', 'ORGANIZATION'],
    directionality: 'UNDIRECTED',
    evidenceRequirements: 'Corporate filing, payroll, or business correspondence'
  },
  {
    type: 'TRAVELED_TO',
    label: 'Transit / Movement',
    description: 'Physical transit along a designated highway, border checkpoint, or terminal.',
    sourceEntityTypes: ['PERSON', 'VEHICLE'],
    targetEntityTypes: ['LOCATION'],
    directionality: 'DIRECTED',
    evidenceRequirements: 'Toll transponder passage or transit manifest'
  },
  {
    type: 'MENTIONED_IN',
    label: 'Documentary Mention',
    description: 'Named as subject, witness, or related party in an official evidentiary filing.',
    sourceEntityTypes: ['PERSON', 'ORGANIZATION', 'VEHICLE'],
    targetEntityTypes: ['DOCUMENT'],
    directionality: 'DIRECTED',
    evidenceRequirements: 'Police First Information Report (FIR) or judicial affidavit'
  },
  {
    type: 'REGISTERED_TO',
    label: 'Statutory Registration',
    description: 'Formal regulatory registration on record with statutory authorities.',
    sourceEntityTypes: ['VEHICLE', 'PHONE', 'ACCOUNT'],
    targetEntityTypes: ['PERSON', 'ORGANIZATION'],
    directionality: 'DIRECTED',
    evidenceRequirements: 'Telecom CAF form, Vahan vehicle registry, or bank KYC dossier'
  },
  {
    type: 'CONNECTED_TO',
    label: 'Network Connection',
    description: 'Algorithmic or topological connection identified through multi-hop path.',
    sourceEntityTypes: ['PERSON', 'VEHICLE', 'LOCATION', 'ACCOUNT', 'ORGANIZATION', 'PHONE'],
    targetEntityTypes: ['PERSON', 'VEHICLE', 'LOCATION', 'ACCOUNT', 'ORGANIZATION', 'PHONE'],
    directionality: 'UNDIRECTED',
    evidenceRequirements: 'Network path resolution'
  },
  {
    type: 'CO_LOCATED',
    label: 'Temporal-Spatial Co-Location',
    description: 'Entities recorded in identical cellular sector or physical checkpoint within narrow window.',
    sourceEntityTypes: ['PERSON', 'VEHICLE', 'PHONE'],
    targetEntityTypes: ['PERSON', 'VEHICLE', 'PHONE'],
    directionality: 'UNDIRECTED',
    evidenceRequirements: 'Synchronized BTS antenna pings or ANPR transit timestamps'
  },
  {
    type: 'SHARED_IDENTIFIER',
    label: 'Shared Hardware / Identifier',
    description: 'Entities sharing identical IMEI, MAC address, bank signatory DIN, or billing address.',
    sourceEntityTypes: ['PERSON', 'PHONE', 'ACCOUNT'],
    targetEntityTypes: ['PERSON', 'PHONE', 'ACCOUNT'],
    directionality: 'UNDIRECTED',
    evidenceRequirements: 'Hardware IMEI registry or KYC match'
  }
];
