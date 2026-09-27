import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Users,
  Network,
  Activity,
  AlertTriangle,
  Calendar,
  PhoneCall,
  Coins,
  MapPin,
  BellRing,
  GitMerge,
  Cpu,
  FileCheck,
  Database,
  Search,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();

  const mainNavItems: NavItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { name: 'Investigations', path: '/investigations', icon: <FolderOpen className="h-4 w-4" />, badge: '3' },
    { name: 'Evidence Center', path: '/evidence', icon: <FileText className="h-4 w-4" />, badge: '18' },
    { name: 'Entities Explorer', path: '/entities', icon: <Users className="h-4 w-4" />, badge: '24' },
    { name: 'Investigation Graph', path: '/graph', icon: <Network className="h-4 w-4" /> },
    { name: 'Network Analysis', path: '/network-analysis', icon: <Activity className="h-4 w-4" /> },
    { name: 'Analytical Leads', path: '/leads', icon: <AlertTriangle className="h-4 w-4 text-amber-400" />, badge: '6', badgeColor: 'bg-amber-950 text-amber-300 border-amber-800' },
    { name: 'Timeline Stream', path: '/timeline', icon: <Calendar className="h-4 w-4" /> },
    { name: 'Communications (CDR)', path: '/communications', icon: <PhoneCall className="h-4 w-4" /> },
    { name: 'Financial Flows', path: '/financial-flows', icon: <Coins className="h-4 w-4" /> },
    { name: 'Locations & Vehicles', path: '/locations', icon: <MapPin className="h-4 w-4" /> },
    { name: 'Alerts Queue', path: '/alerts', icon: <BellRing className="h-4 w-4" /> }
  ];

  const intelligenceTools: NavItem[] = [
    { name: 'AI / NLP Extraction', path: '/pipeline', icon: <Cpu className="h-4 w-4" /> },
    { name: 'Entity Resolution', path: '/resolution', icon: <GitMerge className="h-4 w-4" />, badge: '1', badgeColor: 'bg-purple-950 text-purple-300 border-purple-800' },
    { name: 'Case Reports', path: '/reports', icon: <FileCheck className="h-4 w-4" /> },
    { name: 'Data Sources', path: '/sources', icon: <Database className="h-4 w-4" /> },
    { name: 'Global Search', path: '/search', icon: <Search className="h-4 w-4" /> }
  ];

  const bottomNavItems: NavItem[] = [
    { name: 'Documentation', path: '/help', icon: <HelpCircle className="h-4 w-4" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="h-4 w-4" /> }
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-800 bg-[#070c1a] font-mono text-xs transition-all duration-200 md:static ${
        isOpen ? 'w-64 translate-x-0' : '-translate-x-full md:translate-x-0 md:w-16'
      }`}
    >
      {/* Sidebar Header / Brand */}
      <div className="flex h-14 items-center justify-between border-b border-slate-800/80 px-4">
        {isOpen ? (
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              TACTICAL NAV
            </span>
          </div>
        ) : (
          <div className="mx-auto h-2 w-2 rounded-full bg-cyan-400" />
        )}

        <button
          onClick={onToggle}
          className="hidden md:flex rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          title={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
        >
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav Link Items */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {/* Core Investigative Tools */}
        <div>
          {isOpen && (
            <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Core Modules
            </div>
          )}
          <nav className="space-y-0.5">
            {mainNavItems.map(item => {
              const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 rounded px-2.5 py-2 transition-colors ${
                    isActive
                      ? 'bg-cyan-950/80 border border-cyan-800/80 text-cyan-200 font-semibold'
                      : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                  }`}
                  title={!isOpen ? item.name : undefined}
                >
                  <span className={`shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`}>
                    {item.icon}
                  </span>
                  {isOpen && (
                    <div className="flex flex-1 items-center justify-between truncate">
                      <span className="truncate">{item.name}</span>
                      {item.badge && (
                        <span
                          className={`rounded border px-1.5 py-0.2 text-[10px] ${
                            item.badgeColor || 'border-slate-800 bg-slate-900 text-slate-400'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Intelligence Processing Tools */}
        <div>
          {isOpen && (
            <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Intelligence Engine
            </div>
          )}
          <nav className="space-y-0.5">
            {intelligenceTools.map(item => {
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path);
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 rounded px-2.5 py-2 transition-colors ${
                    isActive
                      ? 'bg-cyan-950/80 border border-cyan-800/80 text-cyan-200 font-semibold'
                      : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                  }`}
                  title={!isOpen ? item.name : undefined}
                >
                  <span className={`shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`}>
                    {item.icon}
                  </span>
                  {isOpen && (
                    <div className="flex flex-1 items-center justify-between truncate">
                      <span className="truncate">{item.name}</span>
                      {item.badge && (
                        <span
                          className={`rounded border px-1.5 py-0.2 text-[10px] ${
                            item.badgeColor || 'border-slate-800 bg-slate-900 text-slate-400'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Utility Links */}
      <div className="border-t border-slate-800/80 p-2 space-y-0.5">
        {bottomNavItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded px-2.5 py-1.5 transition-colors ${
                isActive
                  ? 'bg-slate-850 text-slate-200 font-semibold'
                  : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'
              }`}
              title={!isOpen ? item.name : undefined}
            >
              <span className="shrink-0">{item.icon}</span>
              {isOpen && <span className="truncate">{item.name}</span>}
            </NavLink>
          );
        })}

        <NavLink
          to="/"
          className="flex items-center gap-3 rounded px-2.5 py-1.5 text-slate-400 hover:bg-slate-850 hover:text-slate-200 transition-colors"
          title={!isOpen ? 'Public Landing' : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0 text-slate-500" />
          {isOpen && <span>Exit to Portal</span>}
        </NavLink>
      </div>
    </aside>
  );
};
