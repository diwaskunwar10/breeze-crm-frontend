
import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';
import SidebarLayout from '@/components/layout/SidebarLayout';
import NotFound from '@/pages/NotFound';

// Lazy-loaded page components
const LoginContainer = lazy(() => import('@/pages/auth/login.container'));
const RegisterContainer = lazy(() => import('@/pages/auth/register.container'));
const DashboardContainer = lazy(() => import('@/pages/dashboard/dashboard.container'));
const CustomersContainer = lazy(() => import('@/pages/customers/customers.container'));
const PlaygroundContainer = lazy(() => import('@/pages/playground/playground.container.tsx'));

const AppRoutes = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      }
    >
      <Routes>
        {/* Public Routes - slug-based routes first */}
        <Route path="/:slug" element={<LoginContainer />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/register" element={<RegisterContainer />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<SidebarLayout />}>
            <Route path="/dashboard" element={<DashboardContainer />} />
            <Route path="/customers" element={<CustomersContainer />} />
            <Route path="/channels" element={<div className="p-6">Channels page (Coming soon)</div>} />
            <Route path="/playground" element={<PlaygroundContainer />} />
            <Route path="/settings" element={<div className="p-6">Settings page (Coming soon)</div>} />
          </Route>
        </Route>

        {/* Default routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
