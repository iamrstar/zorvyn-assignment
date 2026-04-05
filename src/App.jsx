import React, { useState, useEffect } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardOverview from './components/dashboard/Overview';
import TransactionList from './components/transactions/Transactions';
import InsightsPanel from './components/insights/Insights';
import './index.css';

const TABS = {
  dashboard: DashboardOverview,
  transactions: TransactionList,
  insights: InsightsPanel,
};

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setSidebarOpen(true);
        setMobileSidebar(false);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const ActivePage = TABS[activeTab] || DashboardOverview;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (window.innerWidth <= 1024) setMobileSidebar(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      {mobileSidebar && (
        <div
          onClick={() => setMobileSidebar(false)}
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 40, backdropFilter: 'blur(2px)',
          }}
        />
      )}

      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        mobileOpen={mobileSidebar}
      />

      <main style={{
        flex: 1,
        padding: '24px 32px',
        marginLeft: sidebarOpen ? '260px' : '72px',
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        maxWidth: '1440px',
        width: '100%',
        minHeight: '100vh',
        ...(window.innerWidth <= 1024 ? { marginLeft: 0, padding: '16px' } : {}),
      }}>
        <Header onMenuClick={() => setMobileSidebar(true)} showMenuButton={!sidebarOpen && window.innerWidth <= 1024} />

        <div key={activeTab} className="animate-fade-in" style={{ marginTop: '1.5rem' }}>
          <ActivePage />
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}

export default App;
