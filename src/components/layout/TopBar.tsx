import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useInvestigation, DEMO_PERSONAS } from '../../context/InvestigationContext';
import { investigationService } from '../../services/investigationService';
import {
  Shield,
  Search,
  Bell,
  PlayCircle,
  UploadCloud,
  ChevronDown,
  User,
  Sliders,
  HelpCircle,
  Menu,
  CheckCircle2,
  Zap,
  Volume2,
  VolumeX,
  Radio,
  Lock,
  Activity
} from 'lucide-react';

interface TopBarProps {
  onToggleSidebar?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar }) => {
  const {
    currentInvestigation,
    setCurrentInvestigation,
    setIsCommandPaletteOpen,
    setIsUploadPipelineOpen,
    triggerDemoMode,
    triggerBootloader,
    currentUser,
    switchPersona,
    unreadCount,
    isLiveInterceptStreamActive,
    toggleLiveInterceptStream,
    isAudioMuted,
    toggleAudioMute
  } = useInvestigation();

  const [isInvDropdownOpen, setIsInvDropdownOpen] = useState(false);
  const [isPersonaDropdownOpen, setIsPersonaDropdownOpen] = useState(false);
  const allInvestigations = investigationService.getAll();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-cyan-950/80 bg-[#060b18]/95 px-3 sm:px-4 backdrop-blur-md font-mono text-xs">
      {/* Left: Mobile hamburger + Logo + Investigation Selector */}
      <div className="flex items-center gap-2 sm:gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <Link to="/dashboard" className="flex items-center gap-2 pr-2 group">
          <div className="flex h-7 w-7 items-center justify-center rounded border border-cyan-500/50 bg-cyan-950/80 text-cyan-400 group-hover:border-cyan-400 group-hover:shadow-[0_0_12px_rgba(6,182,212,0.4)] transition-all">
            <Shield className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-wider text-slate-100 uppercase group-hover:text-cyan-300 transition-colors">
              EVIDLINK
            </span>
            <span className="text-[8px] text-cyan-400/90 -mt-1 tracking-widest hidden sm:inline">
              CRIMINAL INTEL & FORENSICS
            </span>
          </div>
        </Link>

        {/* Security Classification Pill */}
        <div className="hidden xl:flex items-center gap-1.5 px-2 py-0.5 rounded border border-emerald-800/60 bg-emerald-950/30 text-emerald-300 text-[10px]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold tracking-wider">RESTRICTED LEA</span>
          <span className="text-emerald-500/70">· {currentUser.clearanceLevel}</span>
        </div>

        {/* Vertical divider */}
        <div className="hidden sm:block h-5 w-px bg-slate-800" />

        {/* Investigation Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsInvDropdownOpen(prev => !prev)}
            className="flex items-center gap-2 rounded border border-slate-800 bg-[#0b1222] px-2.5 py-1 text-slate-200 hover:border-cyan-700/80 transition-colors"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]"></span>
            <span className="font-semibold text-slate-300 truncate max-w-[120px] sm:max-w-[200px]">
              {currentInvestigation ? `${currentInvestigation.code} · ${currentInvestigation.title}` : 'Select Investigation'}
            </span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {isInvDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsInvDropdownOpen(false)}
              />
              <div className="absolute left-0 top-full mt-1.5 w-80 rounded border border-slate-700 bg-[#0a1224] p-1.5 shadow-2xl z-40 space-y-1">
                <div className="px-2 py-1 text-[10px] uppercase text-slate-400 tracking-wider flex items-center justify-between">
                  <span>Active Investigation Cases</span>
                  <span className="text-cyan-400">{allInvestigations.length} Loaded</span>
                </div>
                {allInvestigations.map(inv => (
                  <button
                    key={inv.id}
                    onClick={() => {
                      setCurrentInvestigation(inv);
                      setIsInvDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded text-xs transition-colors flex items-center justify-between ${
                      currentInvestigation?.id === inv.id
                        ? 'bg-cyan-950/70 border border-cyan-800 text-cyan-200'
                        : 'text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-100">{inv.code} · {inv.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{inv.evidenceCount} Evidences · {inv.leadsCount} Leads · Priority: {inv.priority}</div>
                    </div>
                    {currentInvestigation?.id === inv.id && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Center/Right: Quick Search, Live Stream, Sound, Demo Mode, Upload, Notifications, Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Live Intercept Stream Button */}
        <button
          onClick={toggleLiveInterceptStream}
          className={`flex items-center gap-1.5 rounded border px-2 py-1 text-[11px] font-semibold transition-all ${
            isLiveInterceptStreamActive
              ? 'border-emerald-700/80 bg-emerald-950/40 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
              : 'border-slate-800 bg-slate-900/60 text-slate-400'
          }`}
          title={isLiveInterceptStreamActive ? 'Live Intercept Telemetry Stream Active (Click to Pause)' : 'Live Intercept Stream Paused (Click to Resume)'}
        >
          <Radio className={`h-3 w-3 ${isLiveInterceptStreamActive ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
          <span className="hidden lg:inline">{isLiveInterceptStreamActive ? 'LIVE TELEMETRY' : 'STREAM PAUSED'}</span>
        </button>

        {/* Tactical Sound Toggle */}
        <button
          onClick={toggleAudioMute}
          className={`rounded border p-1.5 text-xs transition-colors ${
            !isAudioMuted
              ? 'border-cyan-800/80 bg-cyan-950/40 text-cyan-300'
              : 'border-slate-800 bg-slate-900/60 text-slate-500'
          }`}
          title={isAudioMuted ? 'Tactical Audio Muted (Click to Unmute)' : 'Tactical Audio Active (Radar/Alert Tones ON)'}
        >
          {isAudioMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5 text-cyan-400" />}
        </button>

        {/* Global Search Bar (CTRL+K trigger) */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-1.5 rounded border border-slate-800 bg-[#0b1222] px-2.5 py-1 text-slate-400 hover:border-cyan-800 hover:text-slate-200 transition-colors"
        >
          <Search className="h-3.5 w-3.5 text-cyan-400" />
          <span className="hidden md:inline">Search...</span>
          <kbd className="hidden xl:inline-block rounded border border-slate-700 bg-slate-900 px-1 text-[9px] text-slate-400">
            Ctrl K
          </kbd>
        </button>

        {/* DEMO MODE PRESENTATION BUTTON */}
        <button
          onClick={triggerDemoMode}
          className="flex items-center gap-1.5 rounded border border-amber-500/40 bg-amber-950/40 px-2 py-1 text-amber-300 hover:bg-amber-900/50 hover:border-amber-400 transition-colors font-semibold text-[11px] shadow-xs"
          title="Launch Guided 13-Scene Presentation Flow"
        >
          <PlayCircle className="h-3 w-3 text-amber-400 animate-pulse" />
          <span className="hidden sm:inline">DEMO FLOW</span>
        </button>

        {/* Ingest Evidence Button */}
        <button
          onClick={() => setIsUploadPipelineOpen(true)}
          className="flex items-center gap-1.5 rounded border border-cyan-800/80 bg-cyan-950/40 px-2 py-1 text-cyan-300 hover:bg-cyan-900/50 hover:border-cyan-500 transition-colors text-[11px]"
          title="Run Simulated NLP Ingestion & Graph Extraction Pipeline"
        >
          <UploadCloud className="h-3 w-3 text-cyan-400" />
          <span className="hidden lg:inline">Ingest</span>
        </button>

        {/* Notifications Icon with Badge */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative rounded border border-slate-800 bg-[#0b1222] p-1.5 text-slate-400 hover:text-slate-100 hover:border-slate-700"
          title="View Notifications"
        >
          <Bell className="h-3.5 w-3.5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-[0_0_8px_rgba(244,63,94,0.6)]">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Persona Quick Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsPersonaDropdownOpen(prev => !prev)}
            className="flex items-center gap-1.5 rounded border border-cyan-900/70 bg-[#0b1222] px-2 py-1 text-slate-300 hover:border-cyan-600 transition-colors"
            title="Switch Investigator Persona & Clearance Level"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500 text-[10px] font-bold">
              {currentUser.avatarInitials}
            </div>
            <span className="hidden xl:inline text-[11px] font-semibold text-slate-200">
              {currentUser.name.split(' ')[0]}
            </span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {isPersonaDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsPersonaDropdownOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1.5 w-72 rounded border border-slate-700 bg-[#0a1224] p-1.5 shadow-2xl z-40 space-y-1">
                <div className="px-2 py-1 text-[10px] uppercase text-slate-400 tracking-wider flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1">
                  <span>Switch Law Enforcement Persona</span>
                  <span className="text-cyan-400 font-bold">{currentUser.clearanceLevel}</span>
                </div>
                {DEMO_PERSONAS.map(persona => (
                  <button
                    key={persona.id}
                    onClick={() => {
                      switchPersona(persona.id);
                      setIsPersonaDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded text-xs transition-colors flex items-center justify-between ${
                      currentUser.id === persona.id
                        ? 'bg-cyan-950/80 border border-cyan-700 text-cyan-200'
                        : 'text-slate-300 hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-slate-900 border border-cyan-500/50 flex items-center justify-center text-[10px] font-bold text-cyan-300">
                        {persona.avatarInitials}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-100 text-[11px]">{persona.name}</div>
                        <div className="text-[9px] text-cyan-400/90 truncate max-w-[170px]">{persona.agency}</div>
                      </div>
                    </div>
                    {currentUser.id === persona.id && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                    )}
                  </button>
                ))}
                <div className="pt-1.5 border-t border-slate-800 mt-1 flex justify-between">
                  <button
                    onClick={() => {
                      setIsPersonaDropdownOpen(false);
                      navigate('/profile');
                    }}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 px-2 py-1"
                  >
                    Manage Credentials →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
