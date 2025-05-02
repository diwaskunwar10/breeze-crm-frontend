
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { login, clearAuthError } from '@/features/authSlice';
import { AuthCredentials } from '@/types/User';
import LoginComponent from './login.component';
import AuthLayout from '@/components/layout/AuthLayout';

const LoginContainer = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Clear any previous auth errors when component mounts
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (credentials: AuthCredentials) => {
    const resultAction = await dispatch(login(credentials));
    if (login.fulfilled.match(resultAction)) {
      navigate('/dashboard');
    }
  };

  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Sign in to your account"
    >
      <LoginComponent 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
        error={error} 
      />
    </AuthLayout>
  );
};

export default LoginContainer;
