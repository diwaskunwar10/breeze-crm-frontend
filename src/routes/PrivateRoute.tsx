
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/redux/store';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/features/authSlice';
import { authService } from '@/api/auth.service';

const PrivateRoute = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsVerifying(false);
        return;
      }

      try {
        // Verify token validity
        const isTokenValid = await authService.verifyToken();
        setIsValid(isTokenValid);
        
        // If token is valid but user info is not loaded, fetch user info
        if (isTokenValid && !user) {
          await dispatch(getCurrentUser());
        }
      } catch (error) {
        setIsValid(false);
        localStorage.removeItem('token');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAuth();
  }, [dispatch, user]);

  // Show loading state while verifying
  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated or token is invalid, redirect to login
  if (!isAuthenticated || !isValid) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated and token is valid, render the route
  return <Outlet />;
};

export default PrivateRoute;
