import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { InvestigationProvider } from './context/InvestigationContext';
import { AppShell } from './components/layout/AppShell';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { AboutPage } from './pages/public/AboutPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { ResponsibleUsePage } from './pages/public/ResponsibleUsePage';
import { LoginPage } from './pages/public/LoginPage';
import { SignupPage } from './pages/public/SignupPage';
import { AnimatedLaunchPage } from './pages/public/AnimatedLaunchPage';
import { TacticalBootloaderModal } from './components/common/TacticalBootloaderModal';

// Application Pages
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { InvestigationsPage } from './pages/investigations/InvestigationsPage';
import { InvestigationWorkspacePage } from './pages/investigations/InvestigationWorkspacePage';
import { EvidenceCenterPage } from './pages/evidence/EvidenceCenterPage';
import { EvidenceDetailPage } from './pages/evidence/EvidenceDetailPage';
import { EvidenceUnderstandingPage } from './pages/pipeline/EvidenceUnderstandingPage';
import { EntityResolutionPage } from './pages/resolution/EntityResolutionPage';
import { EntityExplorerPage } from './pages/entities/EntityExplorerPage';
import { EntityProfilePage } from './pages/entities/EntityProfilePage';
import { InvestigationGraphPage } from './pages/graph/InvestigationGraphPage';
import { NetworkAnalysisPage } from './pages/analysis/NetworkAnalysisPage';
import { AnalyticalLeadsPage } from './pages/leads/AnalyticalLeadsPage';
import { TimelinePage } from './pages/timeline/TimelinePage';
import { CommunicationsPage } from './pages/communications/CommunicationsPage';
import { FinancialFlowsPage } from './pages/financial/FinancialFlowsPage';
import { LocationsVehiclesPage } from './pages/locations/LocationsVehiclesPage';
import { AlertsQueuePage } from './pages/alerts/AlertsQueuePage';
import { ReportsPage } from './pages/reports/ReportsPage';
import { ReportViewerPage } from './pages/reports/ReportViewerPage';
import { DataSourcesPage } from './pages/sources/DataSourcesPage';
import { GlobalSearchPage } from './pages/search/GlobalSearchPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { UserProfilePage } from './pages/profile/UserProfilePage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { HelpDocsPage } from './pages/help/HelpDocsPage';

export default function App() {
  return (
    <BrowserRouter>
      <InvestigationProvider>
        <Routes>
          {/* Public Landing & Documentation Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/responsible-use" element={<ResponsibleUsePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/launch" element={<AnimatedLaunchPage />} />

          {/* Secure Operational Workspace Routes wrapped in AppShell */}
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/investigations" element={<InvestigationsPage />} />
            <Route path="/investigations/:id" element={<InvestigationWorkspacePage />} />
            <Route path="/investigations/workspace" element={<InvestigationWorkspacePage />} />
            <Route path="/evidence" element={<EvidenceCenterPage />} />
            <Route path="/evidence/:id" element={<EvidenceDetailPage />} />
            <Route path="/pipeline/understanding" element={<EvidenceUnderstandingPage />} />
            <Route path="/resolution" element={<EntityResolutionPage />} />
            <Route path="/entities" element={<EntityExplorerPage />} />
            <Route path="/entities/:id" element={<EntityProfilePage />} />
            <Route path="/graph" element={<InvestigationGraphPage />} />
            <Route path="/network-analysis" element={<NetworkAnalysisPage />} />
            <Route path="/leads" element={<AnalyticalLeadsPage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/communications" element={<CommunicationsPage />} />
            <Route path="/financial" element={<FinancialFlowsPage />} />
            <Route path="/locations" element={<LocationsVehiclesPage />} />
            <Route path="/alerts" element={<AlertsQueuePage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/reports/view" element={<ReportViewerPage />} />
            <Route path="/sources" element={<DataSourcesPage />} />
            <Route path="/search" element={<GlobalSearchPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/help" element={<HelpDocsPage />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </InvestigationProvider>
    </BrowserRouter>
  );
}
