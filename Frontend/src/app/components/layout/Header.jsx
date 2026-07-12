/**
 * Header — top bar showing page title, breadcrumb, user avatar, role badge,
 * and dark mode toggle (Phase 8 Bonus).
 */
import React from 'react';
import { useLocation } from 'react-router-dom';

const TITLE_MAP = {
  '/app/dashboard':  { title: 'Dashboard',       breadcrumb: 'Overview' },
  '/app/vehicles':   { title: 'Vehicle Registry', breadcrumb: 'Fleet Management' },
  '/app/drivers':    { title: 'Driver Management',breadcrumb: 'Fleet Management' },
  '/app/trips':      { title: 'Trip Management',  breadcrumb: 'Fleet Management' },
  '/app/maintenance':{ title: 'Maintenance',      breadcrumb: 'Fleet Management' },
  '/app/finance':    { title: 'Fuel & Expenses',  breadcrumb: 'Finance' },
};

const Header = ({ collapsed, onMenuToggle, user, darkMode, onDarkModeToggle }) => {
  const location = useLocation();
  const meta = TITLE_MAP[location.pathname] || { title: 'TransitOps', breadcrumb: '' };
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <header className={`d-header ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="d-header-left">
        {/* Mobile hamburger */}
        <button
          className="d-btn d-btn-ghost d-btn-icon"
          style={{ display: 'none' }}
          id="mobile-menu-btn"
          onClick={onMenuToggle}
          aria-label="Open menu"
        >
          ☰
        </button>
        <div>
          <div className="d-page-title">{meta.title}</div>
          {meta.breadcrumb && (
            <div className="d-breadcrumb">
              TransitOps · {meta.breadcrumb}
            </div>
          )}
        </div>
      </div>

      <div className="d-header-right">
        {/* Dark Mode Toggle */}
        <button
          id="dark-mode-toggle"
          onClick={onDarkModeToggle}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle dark mode"
          style={{
            width: 38, height: 38,
            borderRadius: 12,
            border: '1.5px solid var(--d-border-md)',
            background: darkMode
              ? 'linear-gradient(135deg, #2d2a3e, #1a1828)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(242,238,252,0.8))',
            boxShadow: 'var(--d-shadow-sm)',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s ease',
            flexShrink: 0,
          }}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

        <span className="d-role-badge">
          {user?.role || 'Fleet Manager'}
        </span>
        <div className="d-avatar" title={user?.name || 'User'}>
          {initials}
        </div>
      </div>

      {/* CSS to show hamburger on mobile */}
      <style>{`
        @media (max-width: 768px) {
          #mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
};

export default Header;
