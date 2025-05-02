
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/redux/store';
import { useEffect, useState } from 'react';

const PrivateRoute = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token && !user) {
        // If we have a token but no user, fetch the user data
        // If fetching user fails, the token is likely invalid
        localStorage.removeItem('token');
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [dispatch, user]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login with the proper slug
  if (!isAuthenticated) {
    // Get project name from env
    const projectName = import.meta.env.VITE_PROJECT_NAME || 'chat_demo';
    // Get the saved slug
    const slugKey = `${projectName}_slug`;
    const slug = localStorage.getItem(slugKey) || localStorage.getItem('tenant_slug') || '';
    
    if (slug) {
      return <Navigate to={`/${slug}`} replace />;
    }
    return <Navigate to="/" replace />;
  }

  // If authenticated, render the route
  return <Outlet />;
};

export default PrivateRoute;
