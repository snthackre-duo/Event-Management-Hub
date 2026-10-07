import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { RiskAlertBanner } from './components/RiskAlertBanner';
import { DashboardView } from './components/DashboardView';
import { CalendarView } from './components/CalendarView';
import { CreativeStudioView } from './components/CreativeStudioView';
import { TaskTrackerView } from './components/TaskTrackerView';
import { DownloadsCenterView } from './components/DownloadsCenterView';
import { MyUploadsView } from './components/MyUploadsView';
import { ReportsView } from './components/ReportsView';
import { AdminSettingsView } from './components/AdminSettingsView';
import { CreateEventModal } from './components/CreateEventModal';
import { EventDetailModal } from './components/EventDetailModal';
import { ClashResolutionModal } from './components/ClashResolutionModal';
import { EditEventModal } from './components/EditEventModal';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation & Persona Switcher */}
      <Header />

      {/* Real-time Risk Alerts, Active Clashes & Late Requests Bar */}
      <RiskAlertBanner />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'calendar' && <CalendarView />}
        {activeTab === 'creatives' && <CreativeStudioView />}
        {activeTab === 'tasks' && <TaskTrackerView />}
        {activeTab === 'downloads' && <DownloadsCenterView />}
        {activeTab === 'my_uploads' && <MyUploadsView />}
        {activeTab === 'reports' && <ReportsView />}
        {activeTab === 'settings' && <AdminSettingsView />}
      </main>

      {/* Universal Modals */}
      <CreateEventModal />
      <EventDetailModal />
      <EditEventModal />
      <ClashResolutionModal />

      {/* University Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400">
          Developed and maintained by Marketing Department.
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
