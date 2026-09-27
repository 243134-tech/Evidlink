import React, { createContext, useContext, useState, useEffect } from 'react';
import { Investigation, AnalyticalLead, Entity, Relationship } from '../types';
import { investigationService } from '../services/investigationService';
import { analysisService } from '../services/analysisService';
import { entityService } from '../services/entityService';
import { relationshipService } from '../services/relationshipService';
import { notificationService } from '../services/notificationService';
import { CreateEntityModal } from '../components/entities/CreateEntityModal';
import { CreateRelationshipModal } from '../components/relationships/CreateRelationshipModal';
import { RelationshipDrawer } from '../components/common/RelationshipDrawer';

export interface UserProfile {
  id: string;
  name: string;
  badgeNumber: string;
  role: string;
  agency: string;
  clearanceLevel: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4';
  email: string;
  jurisdiction: string;
  department: string;
  avatarInitials: string;
}

export const DEMO_PERSONAS: UserProfile[] = [
  {
    id: 'USR-001',
    name: 'Inspector Raman Kumar',
    badgeNumber: 'CBI-DEL-7704',
    role: 'Lead Forensic Intelligence Analyst',
    agency: 'Central Bureau of Investigation (CBI Special Wing)',
    clearanceLevel: 'LEVEL_4',
    email: 'r.kumar@cbi.gov.in',
    jurisdiction: 'National Capital Region & Inter-State Corridor',
    department: 'Special Crime & Syndicate Analytics',
    avatarInitials: 'RK'
  },
  {
    id: 'USR-002',
    name: 'DySP Ananya Sen',
    badgeNumber: 'NIA-CYBER-2091',
    role: 'Cyber & Telecom Forensics Lead',
    agency: 'National Investigation Agency (NIA)',
    clearanceLevel: 'LEVEL_3',
    email: 'ananya.sen@nia.gov.in',
    jurisdiction: 'DoT Telecom Corridors & Electronic Intercepts',
    department: 'Cyber Forensics & Signal Intelligence',
    avatarInitials: 'AS'
  },
  {
    id: 'USR-003',
    name: 'Joint Director R. Malhotra',
    badgeNumber: 'ED-AML-1049',
    role: 'Hawala & Financial Tracking Director',
    agency: 'Enforcement Directorate (FIU-IND Liaison)',
    clearanceLevel: 'LEVEL_4',
    email: 'r.malhotra@ed.gov.in',
    jurisdiction: 'Corporate Shells & Banking Hawala Corridors',
    department: 'Anti-Money Laundering & STR Division',
    avatarInitials: 'RM'
  },
  {
    id: 'USR-004',
    name: 'Sub-Inspector Vikram Rao',
    badgeNumber: 'DL-PATROL-5518',
    role: 'Highway & Inter-State Intercept Officer',
    agency: 'Delhi Police Special Cell (Northern Range)',
    clearanceLevel: 'LEVEL_2',
    email: 'vikram.rao@delhipolice.gov.in',
    jurisdiction: 'NH-44 & GT Karnal Highway Outposts',
    department: 'Organized Crime & Tactical Fleet Surveillance',
    avatarInitials: 'VR'
  }
];

interface InvestigationContextType {
  currentInvestigation: Investigation | null;
  setCurrentInvestigation: (inv: Investigation) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isPresentationModeOpen: boolean;
  setIsPresentationModeOpen: (open: boolean) => void;
  isGuidedDemoOpen: boolean;
  setIsGuidedDemoOpen: (open: boolean) => void;
  isBootloaderOpen: boolean;
  setIsBootloaderOpen: (open: boolean) => void;
  triggerBootloader: () => void;
  selectedLeadForProvenance: AnalyticalLead | null;
  setSelectedLeadForProvenance: (lead: AnalyticalLead | null) => void;
  selectedEntityForDossier: Entity | null;
  setSelectedEntityForDossier: (entity: Entity | null) => void;
  selectedRelationshipForDrawer: Relationship | null;
  setSelectedRelationshipForDrawer: (rel: Relationship | null) => void;
  isUploadPipelineOpen: boolean;
  setIsUploadPipelineOpen: (open: boolean) => void;
  isCreateEntityModalOpen: boolean;
  setIsCreateEntityModalOpen: (open: boolean) => void;
  isCreateRelationshipModalOpen: boolean;
  setIsCreateRelationshipModalOpen: (open: boolean) => void;
  unreadCount: number;
  refreshUnreadCount: () => void;
  triggerDemoMode: () => void;
  activeToast: string | null;
  showToast: (msg: string) => void;
  currentUser: UserProfile;
  loginUser: (profile: Partial<UserProfile>) => void;
  switchPersona: (personaId: string) => void;
  logoutUser: () => void;
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    link?: string;
  }>;
  markAllNotificationsRead: () => void;
  isLiveInterceptStreamActive: boolean;
  toggleLiveInterceptStream: () => void;
  isAudioMuted: boolean;
  toggleAudioMute: () => void;
  liveInterceptLogs: Array<{
    id: string;
    timestamp: string;
    category: 'CDR' | 'ANPR' | 'HAWALA' | 'GEO_PING' | 'INTERCEPT';
    message: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    source: string;
  }>;
}

const InvestigationContext = createContext<InvestigationContextType | undefined>(undefined);

import { soundService } from '../services/soundService';

export const InvestigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentInvestigation, setCurrentInvestigationState] = useState<Investigation | null>(() => {
    return investigationService.getById('INV-2026-001') || investigationService.getAll()[0] || null;
  });

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isPresentationModeOpen, setIsPresentationModeOpen] = useState(false);
  const [isGuidedDemoOpen, setIsGuidedDemoOpen] = useState(false);
  const [isBootloaderOpen, setIsBootloaderOpen] = useState(false);
  const [selectedLeadForProvenance, setSelectedLeadForProvenance] = useState<AnalyticalLead | null>(null);
  const [selectedEntityForDossier, setSelectedEntityForDossier] = useState<Entity | null>(null);
  const [selectedRelationshipForDrawer, setSelectedRelationshipForDrawer] = useState<Relationship | null>(null);
  const [isUploadPipelineOpen, setIsUploadPipelineOpen] = useState(false);
  const [isCreateEntityModalOpen, setIsCreateEntityModalOpen] = useState(false);
  const [isCreateRelationshipModalOpen, setIsCreateRelationshipModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(() => notificationService.getUnreadCount());
  const [activeToast, setActiveToast] = useState<string | null>(null);
  const [isLiveInterceptStreamActive, setIsLiveInterceptStreamActive] = useState<boolean>(true);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(() => soundService.getIsMuted());

  const [liveInterceptLogs, setLiveInterceptLogs] = useState<Array<{
    id: string;
    timestamp: string;
    category: 'CDR' | 'ANPR' | 'HAWALA' | 'GEO_PING' | 'INTERCEPT';
    message: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    source: string;
  }>>([
    {
      id: 'LIV-901',
      timestamp: '10:44:12',
      category: 'ANPR',
      message: 'Vehicle DL-04-TC-8812 detected at Kundli Toll (Lane 04 Northbound). Speed: 64 km/h.',
      severity: 'HIGH',
      source: 'NHAI-ANPR-GATE-44'
    },
    {
      id: 'LIV-902',
      timestamp: '10:43:55',
      category: 'CDR',
      message: 'Burner MSISDN +91 98771-90012 initiated 42s encrypted voice burst to +91 98110-22341.',
      severity: 'CRITICAL',
      source: 'DOT-SIGINT-TOWER-ND-204'
    },
    {
      id: 'LIV-903',
      timestamp: '10:42:19',
      category: 'HAWALA',
      message: 'FIU STR Trigger: RTGS ₹45,00,000 cleared to M/S Kuber Logistics via HDFC 4410.',
      severity: 'CRITICAL',
      source: 'FIU-IND-FINNET'
    },
    {
      id: 'LIV-904',
      timestamp: '10:40:02',
      category: 'GEO_PING',
      message: 'Suspect Vikram S. (P002) handset co-located within 40m of Devraj Anand (P001).',
      severity: 'HIGH',
      source: 'CELL-TRIANGULATION'
    }
  ]);

  const toggleAudioMute = () => {
    const muted = soundService.toggleMute();
    setIsAudioMuted(muted);
    showToast(muted ? 'Tactical Audio Muted' : 'Tactical Audio Active (Radar/Alert Tones ON)');
  };

  const toggleLiveInterceptStream = () => {
    setIsLiveInterceptStreamActive(prev => {
      const next = !prev;
      showToast(next ? 'Live Intercept Telemetry Stream: RESUMED' : 'Live Intercept Telemetry Stream: PAUSED');
      return next;
    });
  };

  // Periodic simulated live intelligence feed
  useEffect(() => {
    if (!isLiveInterceptStreamActive) return;

    const simulatedFeeds = [
      {
        category: 'ANPR' as const,
        message: 'Toll Camera NH-44: Tata 407 (HR-55-E-1092) optical plate match at Panipat Bypass.',
        severity: 'MEDIUM' as const,
        source: 'NHAI-CAMERA-P12'
      },
      {
        category: 'CDR' as const,
        message: 'IMSI swap detected: Device IMEI 8690123... registered to new unregistered SIM.',
        severity: 'HIGH' as const,
        source: 'TELECOM-TRAI-MONITOR'
      },
      {
        category: 'HAWALA' as const,
        message: 'Angadia Token "Z-889" verified at Chandni Chowk cash hub for ₹18.5 Lakhs.',
        severity: 'CRITICAL' as const,
        source: 'ED-HAWALA-LIAISON'
      },
      {
        category: 'GEO_PING' as const,
        message: 'Cell Tower 404-92 Sector 62 registered signal handoff from Target Handset #3.',
        severity: 'LOW' as const,
        source: 'NOIDA-TOWER-ARRAY'
      },
      {
        category: 'INTERCEPT' as const,
        message: 'Encrypted message fragment matched keyword "CONVOY_CLEAR_NH44" with 91% confidence.',
        severity: 'CRITICAL' as const,
        source: 'CYBER-SIGINT-ENGINE'
      }
    ];

    const interval = setInterval(() => {
      const randomFeed = simulatedFeeds[Math.floor(Math.random() * simulatedFeeds.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      
      const newEntry = {
        id: `LIV-${Date.now().toString().slice(-4)}`,
        timestamp: timeStr,
        ...randomFeed
      };

      setLiveInterceptLogs(prev => [newEntry, ...prev.slice(0, 19)]);
      if (randomFeed.severity === 'CRITICAL') {
        soundService.playAlertChime();
      } else {
        soundService.playRadarPing();
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [isLiveInterceptStreamActive]);

  const [currentUser, setCurrentUserState] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('evidlink_active_officer');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return DEMO_PERSONAS[0];
  });

  const loginUser = (profileData: Partial<UserProfile>) => {
    const updated: UserProfile = {
      ...currentUser,
      ...profileData,
      id: profileData.id || `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: profileData.name || currentUser.name,
      badgeNumber: profileData.badgeNumber || currentUser.badgeNumber,
      role: profileData.role || currentUser.role,
      agency: profileData.agency || currentUser.agency,
      clearanceLevel: profileData.clearanceLevel || 'LEVEL_4',
      email: profileData.email || currentUser.email,
      jurisdiction: profileData.jurisdiction || currentUser.jurisdiction,
      department: profileData.department || currentUser.department,
      avatarInitials: (profileData.name || currentUser.name)
        .split(' ')
        .map(n => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    };
    setCurrentUserState(updated);
    localStorage.setItem('evidlink_active_officer', JSON.stringify(updated));
    showToast(`Officer Credential Loaded: ${updated.name} (${updated.badgeNumber})`);
  };

  const switchPersona = (personaId: string) => {
    const target = DEMO_PERSONAS.find(p => p.id === personaId);
    if (target) {
      setCurrentUserState(target);
      localStorage.setItem('evidlink_active_officer', JSON.stringify(target));
      showToast(`Switched active officer persona to: ${target.name} [${target.agency}]`);
    }
  };

  const logoutUser = () => {
    const guest: UserProfile = {
      id: 'USR-GUEST',
      name: 'Unassigned Officer',
      badgeNumber: 'GUEST-SESSION',
      role: 'Observation Observer',
      agency: 'Law Enforcement Multi-Agency Sandbox',
      clearanceLevel: 'LEVEL_1',
      email: 'visitor@mha.gov.in',
      jurisdiction: 'Read-Only Sandbox Evaluation',
      department: 'Tactical Evaluation',
      avatarInitials: 'UO'
    };
    setCurrentUserState(guest);
    localStorage.removeItem('evidlink_active_officer');
    showToast('Signed out of investigator session.');
  };

  const triggerBootloader = () => {
    setIsBootloaderOpen(true);
  };

  const [notifications, setNotifications] = useState([
    {
      id: 'NOTIF-01',
      title: 'High Betweenness Broker Isolated',
      message: 'Vikram S. (PER-002) betweenness score reached 98/100, connecting transport and financial clusters.',
      timestamp: '12 mins ago',
      read: false,
      link: '/entities/P002'
    },
    {
      id: 'NOTIF-02',
      title: '23-Minute Pass-Through Alert',
      message: 'ICICI Account 3340 funneled ₹1.45 Cr into transport company accounts.',
      timestamp: '35 mins ago',
      read: false,
      link: '/financial'
    },
    {
      id: 'NOTIF-03',
      title: 'Convoy Optical Corroboration',
      message: 'Scorpio DL-04-TC-8812 and Tata Container crossed Kundli Toll within 4 minutes.',
      timestamp: '1 hour ago',
      read: true,
      link: '/locations'
    }
  ]);

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    showToast('All notifications marked as read.');
  };

  const showToast = (msg: string) => {
    setActiveToast(msg);
    setTimeout(() => {
      setActiveToast(null);
    }, 4000);
  };

  const refreshUnreadCount = () => {
    setUnreadCount(notificationService.getUnreadCount());
  };

  const setCurrentInvestigation = (inv: Investigation) => {
    setCurrentInvestigationState(inv);
    showToast(`Switched workspace to: ${inv.title} (${inv.code})`);
  };

  const triggerDemoMode = () => {
    const inv = investigationService.getById('INV-2026-001');
    if (inv) setCurrentInvestigationState(inv);
    setIsPresentationModeOpen(true);
    showToast('Demo Mode Activated: Launching Guided Hackathon Presentation Flow');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <InvestigationContext.Provider
      value={{
        currentInvestigation,
        setCurrentInvestigation,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isPresentationModeOpen,
        setIsPresentationModeOpen,
        isGuidedDemoOpen,
        setIsGuidedDemoOpen,
        isBootloaderOpen,
        setIsBootloaderOpen,
        triggerBootloader,
        selectedLeadForProvenance,
        setSelectedLeadForProvenance,
        selectedEntityForDossier,
        setSelectedEntityForDossier,
        selectedRelationshipForDrawer,
        setSelectedRelationshipForDrawer,
        isUploadPipelineOpen,
        setIsUploadPipelineOpen,
        isCreateEntityModalOpen,
        setIsCreateEntityModalOpen,
        isCreateRelationshipModalOpen,
        setIsCreateRelationshipModalOpen,
        unreadCount,
        refreshUnreadCount,
        triggerDemoMode,
        activeToast,
        showToast,
        currentUser,
        loginUser,
        switchPersona,
        logoutUser,
        notifications,
        markAllNotificationsRead,
        isLiveInterceptStreamActive,
        toggleLiveInterceptStream,
        isAudioMuted,
        toggleAudioMute,
        liveInterceptLogs
      }}
    >
      {children}

      {/* Global Modals & Drawers */}
      <CreateEntityModal
        isOpen={isCreateEntityModalOpen}
        onClose={() => setIsCreateEntityModalOpen(false)}
      />

      <CreateRelationshipModal
        isOpen={isCreateRelationshipModalOpen}
        onClose={() => setIsCreateRelationshipModalOpen(false)}
      />

      <RelationshipDrawer
        relationship={selectedRelationshipForDrawer}
        isOpen={Boolean(selectedRelationshipForDrawer)}
        onClose={() => setSelectedRelationshipForDrawer(null)}
        onUpdate={updated => setSelectedRelationshipForDrawer(updated)}
      />
    </InvestigationContext.Provider>
  );
};

export const useInvestigation = () => {
  const context = useContext(InvestigationContext);
  if (!context) {
    throw new Error('useInvestigation must be used within an InvestigationProvider');
  }
  return context;
};
