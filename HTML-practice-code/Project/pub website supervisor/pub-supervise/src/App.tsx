import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppHeader, AppSidebar } from './components/Navigation';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { MeetingsPage } from './pages/MeetingsPage';
import { SuperviseInsightPage } from './pages/SuperviseInsightPage';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-pub-bg flex flex-col font-sans">
    <AppHeader />
    <div className="flex flex-1">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  </div>
);

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<AppLayout><DashboardPage /></AppLayout>} />
          <Route path="/workspace/:projectId" element={<AppLayout><WorkspacePage /></AppLayout>} />
          <Route path="/meetings" element={<AppLayout><MeetingsPage /></AppLayout>} />
          <Route path="/supervise-insight" element={<AppLayout><SuperviseInsightPage /></AppLayout>} />
          <Route path="/supervisor/review-queue" element={<AppLayout><WorkspacePage /></AppLayout>} />
          <Route path="/supervisor/my-students" element={<AppLayout><DashboardPage /></AppLayout>} />
          <Route path="/admin/projects" element={<AppLayout><DashboardPage /></AppLayout>} />
          <Route path="/admin/users" element={<AppLayout><DashboardPage /></AppLayout>} />
          <Route path="/activities" element={<AppLayout><DashboardPage /></AppLayout>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
