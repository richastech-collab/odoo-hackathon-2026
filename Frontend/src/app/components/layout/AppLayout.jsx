/**
 * AppLayout — authenticated shell with collapsible sidebar + fixed header.
 * Phase 8: Added dark mode state management + toggle passed to Header.
 */
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header  from './Header';
import { useAuth } from '../../context/AuthContext';
import Background from '../../../components/Background';

const AppLayout = ({ darkMode, toggleDarkMode }) => {
  const { user }                                    = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed]     = useState(false);
  const [mobileOpen, setMobileOpen]                 = useState(false);

  return (
    <div className={`app-root${darkMode ? ' dark-mode' : ''}`}>
      <Background />
      <div className="app-shell" style={{ position: 'relative', zIndex: 1 }}>
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((c) => !c)}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Header
            collapsed={sidebarCollapsed}
            onMenuToggle={() => setMobileOpen((o) => !o)}
            user={user}
            darkMode={darkMode}
            onDarkModeToggle={toggleDarkMode}
          />

          <main
            className={`d-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}
            id="main-content"
          >
            <Outlet context={{ user, darkMode }} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
