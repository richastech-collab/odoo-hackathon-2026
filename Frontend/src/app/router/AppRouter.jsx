/**
 * AppRouter — all internal app routes.
 *
 * Phase 2 additions:
 *  - <ProtectedRoute> wraps the entire /app/* tree
 *  - /login redirects to /app/dashboard if already authenticated (handled in LoginPage)
 *  - Redirect from /app root → /app/dashboard
 */
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute  from './ProtectedRoute';
import AppLayout        from '../components/layout/AppLayout';
import LoginPage        from '../pages/LoginPage';
import SignupPage       from '../pages/SignupPage';
import DashboardPage    from '../pages/DashboardPage';
import VehiclesPage     from '../pages/VehiclesPage';
import DriversPage      from '../pages/DriversPage';
import TripsPage        from '../pages/TripsPage';
import MaintenancePage  from '../pages/MaintenancePage';
import FinancePage      from '../pages/FinancePage';
import NotFoundPage     from '../pages/NotFoundPage';

const AppRouter = () => (
  <Routes>
    {/* Public — Login */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />

    {/* Protected — requires authentication */}
    <Route element={<ProtectedRoute />}>
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard"   element={<DashboardPage   />} />
        <Route path="vehicles"    element={<VehiclesPage    />} />
        <Route path="drivers"     element={<DriversPage     />} />
        <Route path="trips"       element={<TripsPage       />} />
        <Route path="maintenance" element={<MaintenancePage />} />
        <Route path="finance"     element={<FinancePage     />} />
      </Route>
    </Route>

    {/* Catch-all */}
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRouter;
