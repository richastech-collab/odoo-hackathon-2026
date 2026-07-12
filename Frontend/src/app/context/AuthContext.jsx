import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient, getMockSession, clearMockSession } from '../../api/client';

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

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]         = useState(null);
  const [isLoading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const userData = await apiClient.get('/auth/me');
      setUser(userData);
    } catch (e) {
      sessionStorage.removeItem('token');
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (token) {
      fetchMe();
    } else {
      setLoading(false);
    }
  }, [fetchMe]);

  const login = useCallback(async (email, password) => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await apiClient.postForm('/auth/login', formData);
      const token = response.access_token;
      
      sessionStorage.setItem('token', token);
      
      // Fetch user profile
      const userData = await apiClient.get('/auth/me');
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message || 'Invalid email or password. Please try again.' };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('token');
    localStorage.removeItem('token');
    clearMockSession(); // also clear mock session if using fallback
  }, []);

  const value = { user, isLoading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};

export default AuthContext;
