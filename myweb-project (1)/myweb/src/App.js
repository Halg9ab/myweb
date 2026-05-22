import React from 'react';
import './styles/globals.css';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Finance from './pages/Finance';
import Tasks from './pages/Tasks';
import Goals from './pages/Goals';
import Analytics from './pages/Analytics';

function AppContent() {
  const { state } = useApp();
  const { activeSection, sidebarCollapsed } = state;

  const renderPage = () => {
    switch (activeSection) {
      case 'dashboard': return <Dashboard />;
      case 'calendar': return <Calendar />;
      case 'finance': return <Finance />;
      case 'tasks': return <Tasks />;
      case 'goals': return <Goals />;
      case 'analytics': return <Analytics />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app-layout">
      {/* Background effects */}
      <div className="bg-grid" />
      <div className="ambient-orb orb-1" />
      <div className="ambient-orb orb-2" />

      <Sidebar />

      <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`} style={{ position: 'relative', zIndex: 1 }}>
        <Header />
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
