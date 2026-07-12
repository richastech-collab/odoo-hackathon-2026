/**
 * Sidebar — collapsible navigation sidebar with RBAC filtering.
 *
 * Phase 2 additions:
 *  - Reads `user` from AuthContext to filter nav items by role (ROLE_PERMISSIONS)
 *  - Shows user name + role at the bottom footer
 *  - "Sign Out" button with confirmation
 *  - Collapsed tooltip on nav items
 */
import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, ROLE_PERMISSIONS } from '../../context/AuthContext';

const ALL_NAV_ITEMS = [
  {
    section: 'Overview',
    items: [
      { to: '/app/dashboard',   icon: '🎛️', label: 'Dashboard'       },
    ],
  },
  {
    section: 'Fleet Management',
    items: [
      { to: '/app/vehicles',    icon: '🚛', label: 'Vehicles'         },
      { to: '/app/drivers',     icon: '👤', label: 'Drivers'          },
      { to: '/app/trips',       icon: '🗺️', label: 'Trips'            },
      { to: '/app/maintenance', icon: '🔧', label: 'Maintenance'      },
    ],
  },
  {
    section: 'Finance',
    items: [
      { to: '/app/finance',     icon: '⛽', label: 'Fuel & Expenses'  },
    ],
  },
];

const Sidebar = ({ collapsed, onToggle, mobileOpen, onMobileClose }) => {
  const location     = useLocation();
  const navigate     = useNavigate();
  const { user, logout } = useAuth();

  // Filter nav items by role
  const allowedRoutes = user
    ? (ROLE_PERMISSIONS[user.role] || [])
    : [];

  const filteredNav = ALL_NAV_ITEMS
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => allowedRoutes.includes(item.to)),
    }))
    .filter((group) => group.items.length > 0);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Avatar initials
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`d-sidebar-overlay ${mobileOpen ? 'mobile-open' : ''}`}
        onClick={onMobileClose}
        aria-hidden="true"
      />

      <aside
        className={`d-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
        aria-label="Main navigation"
      >
        {/* ── Logo ── */}
        <div className="d-sidebar-logo">
          <div className="d-sidebar-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="4" rx="2" fill="white" />
              <circle cx="7" cy="17" r="2.5" fill="white" />
              <circle cx="17" cy="17" r="2.5" fill="white" />
              <path d="M3 13V9a2 2 0 0 1 2-2h10l3 5"
                stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="d-sidebar-logo-text">TransitOps</span>
        </div>

        {/* ── Navigation ── */}
        <nav className="d-sidebar-nav" aria-label="App navigation">
          {filteredNav.map((group) => (
            <React.Fragment key={group.section}>
              <span className="d-nav-section-label">{group.section}</span>
              {group.items.map((item) => {
                const isActive =
                  location.pathname === item.to ||
                  location.pathname.startsWith(item.to + '/');
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={`d-nav-item ${isActive ? 'active' : ''}`}
                    title={collapsed ? item.label : undefined}
                    onClick={onMobileClose}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="d-nav-item-icon" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className="d-nav-item-label">{item.label}</span>
                  </NavLink>
                );
              })}
            </React.Fragment>
          ))}
        </nav>

        {/* ── Footer: user info + collapse + logout ── */}
        <div className="d-sidebar-footer">
          {/* User identity strip */}
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px',
              borderRadius: 12,
              background: 'rgba(155,126,230,0.07)',
              border: '1px solid var(--d-border)',
              marginBottom: 8,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: 32, height: 32, borderRadius: 10,
                background: 'linear-gradient(135deg, #9b7ee6, #6b9bdf)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.72rem', fontWeight: 800, color: '#fff',
                flexShrink: 0,
                boxShadow: '3px 3px 8px rgba(107,143,216,0.35), -2px -2px 5px rgba(255,255,255,0.7)',
              }}
            >
              {initials}
            </div>
            <div className="d-collapse-btn-label" style={{ minWidth: 0 }}>
              <div style={{
                fontSize: '0.8rem', fontWeight: 700, color: 'var(--d-text)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {user?.name || 'User'}
              </div>
              <div style={{
                fontSize: '0.68rem', color: 'var(--d-muted)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {user?.role || ''}
              </div>
            </div>
          </div>

          {/* Collapse toggle */}
          <button
            className="d-collapse-btn"
            onClick={onToggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>
              {collapsed ? '→' : '←'}
            </span>
            <span className="d-collapse-btn-label">Collapse</span>
          </button>

          {/* Logout */}
          <button
            className="d-collapse-btn"
            onClick={handleLogout}
            style={{ color: 'var(--d-danger)' }}
            title={collapsed ? 'Sign out' : undefined}
            aria-label="Sign out"
          >
            <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>🚪</span>
            <span className="d-collapse-btn-label">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
