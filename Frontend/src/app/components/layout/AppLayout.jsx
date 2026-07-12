/**
 * AppLayout — authenticated shell with collapsible sidebar + fixed header.
 * Phase 2: reads real user from AuthContext instead of the Phase 1 MOCK_USER constant.
 */
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header  from './Header';
import { useAuth } from '../../context/AuthContext';
import Background from '../../../components/Background';

const AppLayout = () => {
  const { user }                                    = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed]     = useState(false);
  const [mobileOpen, setMobileOpen]                 = useState(false);

  return (
    <div className="app-root">
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
          />

          <main
            className={`d-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}
            id="main-content"
          >
            <Outlet context={{ user }} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
