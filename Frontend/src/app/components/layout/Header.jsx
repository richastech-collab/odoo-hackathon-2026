/**
 * Header — top bar showing page title, breadcrumb, user avatar and role badge.
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

const Header = ({ collapsed, onMenuToggle, user }) => {
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
