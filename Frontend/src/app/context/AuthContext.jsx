/**
 * AuthContext — global authentication state for TransitOps.
 *
 * Provides:
 *   user       — the currently logged-in user object (null = logged out)
 *   isLoading  — true during the initial session restore check
 *   login(email, password) — validates mock credentials, sets user, persists to sessionStorage
 *   logout()               — clears user, redirects to /login
 *
 * MOCK CREDENTIALS (Phase 2 — will be replaced by real API calls in backend integration):
 *   Fleet Manager  → fm@transitops.com     / fleet123
 *   Driver         → driver@transitops.com / drive123
 *   Safety Officer → safety@transitops.com / safe123
 *   Financial      → finance@transitops.com/ fin123
 *
 * Role-based nav visibility is defined here via ROLE_PERMISSIONS.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/* ── Role-based permission map ──────────────────────────────── */
export const ROLES = {
  FLEET_MANAGER:  'Fleet Manager',
  DRIVER:         'Driver',
  SAFETY_OFFICER: 'Safety Officer',
  FINANCIAL:      'Financial Analyst',
};

// Which nav routes each role can access
export const ROLE_PERMISSIONS = {
  [ROLES.FLEET_MANAGER]: [
    '/app/dashboard',
    '/app/vehicles',
    '/app/drivers',
    '/app/trips',
    '/app/maintenance',
    '/app/finance',
  ],
  [ROLES.DRIVER]: [
    '/app/dashboard',
    '/app/trips',
  ],
  [ROLES.SAFETY_OFFICER]: [
    '/app/dashboard',
    '/app/vehicles',
    '/app/drivers',
    '/app/maintenance',
  ],
  [ROLES.FINANCIAL]: [
    '/app/dashboard',
    '/app/finance',
  ],
};

/* ── Mock user database ─────────────────────────────────────── */
const MOCK_USERS = [
  {
    id: '1',
    email: 'fm@transitops.com',
    password: 'fleet123',
    name: 'Alex Johnson',
    role: ROLES.FLEET_MANAGER,
    avatar: 'AJ',
  },
  {
    id: '2',
    email: 'driver@transitops.com',
    password: 'drive123',
    name: 'Sam Rivera',
    role: ROLES.DRIVER,
    avatar: 'SR',
  },
  {
    id: '3',
    email: 'safety@transitops.com',
    password: 'safe123',
    name: 'Jordan Lee',
    role: ROLES.SAFETY_OFFICER,
    avatar: 'JL',
  },
  {
    id: '4',
    email: 'finance@transitops.com',
    password: 'fin123',
    name: 'Morgan Chen',
    role: ROLES.FINANCIAL,
    avatar: 'MC',
  },
];

const SESSION_KEY = 'transitops_user';

/* ── Context ────────────────────────────────────────────────── */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]         = useState(null);
  const [isLoading, setLoading] = useState(true); // for session restore

  // Restore session from sessionStorage on initial mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {
      /* ignore corrupt data */
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * login — validates mock credentials.
   * Returns { success: true } or { success: false, error: string }
   */
  const login = useCallback(async (email, password) => {
    // Simulate network latency
    await new Promise((r) => setTimeout(r, 700));

    const found = MOCK_USERS.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase().trim() &&
        u.password === password,
    );

    if (!found) {
      return { success: false, error: 'Invalid email or password. Please try again.' };
    }

    // Strip password before storing
    const { password: _pwd, ...safeUser } = found;
    setUser(safeUser);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
    return { success: true, user: safeUser };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem(SESSION_KEY);
  }, []);

  const value = { user, isLoading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/* ── Hook ───────────────────────────────────────────────────── */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};

export default AuthContext;
