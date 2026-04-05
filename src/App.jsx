import React, { useState, useEffect } from 'react';
import { FinanceProvider } from './context/FinanceContext';
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

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return width;
}

function AppContent() {
  const width = useWindowWidth();
  const isMobile = width <= 768;
  const isTablet = width <= 1024;

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(!isTablet);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  useEffect(() => {
    if (width > 1024) { setSidebarOpen(true); setMobileSidebar(false); }
    else { setSidebarOpen(false); }
  }, [width]);

  const ActivePage = TABS[activeTab] || DashboardOverview;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (isTablet) setMobileSidebar(false);
  };

  const mainMargin = isTablet ? 0 : (sidebarOpen ? 260 : 72);

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
        isMobile={isTablet}
      />

      <main style={{
        flex: 1,
        padding: isMobile ? '14px' : isTablet ? '18px' : '24px 32px',
        marginLeft: mainMargin,
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        maxWidth: '1440px',
        width: '100%',
        minHeight: '100vh',
      }}>
        <Header
          onMenuClick={() => setMobileSidebar(true)}
          showMenuButton={isTablet}
          isMobile={isMobile}
        />

        <div key={activeTab} className="animate-fade-in" style={{ marginTop: isMobile ? '1rem' : '1.5rem' }}>
          <ActivePage isMobile={isMobile} isTablet={isTablet} />
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
