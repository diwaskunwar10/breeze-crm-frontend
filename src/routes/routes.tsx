
import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';
import SidebarLayout from '@/components/layout/SidebarLayout';

// Lazy-loaded page components
const LoginContainer = lazy(() => import('@/pages/auth/login.container'));
const RegisterContainer = lazy(() => import('@/pages/auth/register.container'));
const DashboardContainer = lazy(() => import('@/pages/dashboard/dashboard.container'));
const CustomersContainer = lazy(() => import('@/pages/customers/customers.container'));
const NotFound = lazy(() => import('@/pages/NotFound'));

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
        {/* Public Routes */}
        <Route path="/login" element={<LoginContainer />} />
        <Route path="/register" element={<RegisterContainer />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<SidebarLayout />}>
            <Route path="/dashboard" element={<DashboardContainer />} />
            <Route path="/customers" element={<CustomersContainer />} />
            <Route path="/analytics" element={<div className="p-6">Analytics page (Coming soon)</div>} />
            <Route path="/messages" element={<div className="p-6">Messages page (Coming soon)</div>} />
            <Route path="/calendar" element={<div className="p-6">Calendar page (Coming soon)</div>} />
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
