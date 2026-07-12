/**
 * ProtectedRoute — guards authenticated routes.
 *
 * Behaviour:
 *  - While session is being restored (isLoading) → shows full-screen spinner
 *  - If no user → redirects to /login, preserving the attempted URL as `?from=`
 *  - If user is present → renders children (via <Outlet />)
 *
 * Usage (in AppRouter):
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="dashboard" element={<DashboardPage />} />
 *     ...
 *   </Route>
 */
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FullScreenSpinner = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      background: 'linear-gradient(145deg, #f0eaf9 0%, #e8f2fb 40%, #eaf7f1 100%)',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}
  >
    <div
      style={{
        width: 48, height: 48,
        borderRadius: 16,
        background: 'linear-gradient(135deg, #7b9fe8, #9b7ee6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '6px 6px 18px rgba(107,143,216,0.4), -4px -4px 12px rgba(255,255,255,0.7)',
        animation: 'spin 1s linear infinite',
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="11" width="18" height="4" rx="2" fill="white" />
        <circle cx="7" cy="17" r="2.5" fill="white" />
        <circle cx="17" cy="17" r="2.5" fill="white" />
        <path d="M3 13V9a2 2 0 0 1 2-2h10l3 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#7b718e' }}>
      Loading TransitOps…
    </div>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <FullScreenSpinner />;

  if (!user) {
    // Preserve the route they tried to visit so we can redirect after login
    return <Navigate to={`/login?from=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
