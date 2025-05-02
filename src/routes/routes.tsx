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
        {/* Public Routes with slug */}
        <Route path="/:slug" element={<Navigate to="/:slug/login" replace />} />
        <Route path="/:slug/login" element={<LoginContainer />} />
        <Route path="/:slug/register" element={<RegisterContainer />} />
        
        {/* Fallback for direct login/register access */}
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/register" element={<Navigate to="/" replace />} />

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

        {/* Default root route - redirects based on auth state */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

// Component to handle root route redirects
const RootRedirect = () => {
  const projectName = import.meta.env.VITE_PROJECT_NAME || 'chat_demo';
  const slugKey = `${projectName}_slug`;
  const slug = localStorage.getItem(slugKey) || localStorage.getItem('tenant_slug');
  
  // If we have a saved slug, redirect to /:slug/login
  if (slug) {
    return <Navigate to={`/${slug}/login`} replace />;
  }
  
  // Otherwise, show 404
  return <NotFound />;
};

export default AppRoutes;
