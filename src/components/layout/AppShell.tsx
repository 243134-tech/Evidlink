import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { FooterNotice } from './FooterNotice';
import { CommandPalette } from '../common/CommandPalette';
import { ProvenanceDrawer } from '../common/ProvenanceDrawer';
import { ProcessingPipelineModal } from '../pipeline/ProcessingPipelineModal';
import { GuidedDemoModal } from '../common/GuidedDemoModal';
import { Toast } from '../common/Toast';
import { useInvestigation } from '../../context/InvestigationContext';

export const AppShell: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { activeToast } = useInvestigation();

  return (
    <div className="flex min-h-screen flex-col bg-[#070c1a] text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top command navigation bar */}
      <TopBar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />

      {/* Main workspace with Sidebar & Content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(prev => !prev)} />

        <main className="flex-1 overflow-y-auto bg-[#080e1d] p-4 sm:p-6 lg:p-8 flex flex-col">
          <div className="flex-1 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
          <div className="mt-8">
            <FooterNotice />
          </div>
        </main>
      </div>

      {/* Interactive Global Drawers & Modals */}
      <CommandPalette />
      <ProvenanceDrawer />
      <ProcessingPipelineModal />
      <GuidedDemoModal />
      <Toast message={activeToast} />
    </div>
  );
};
