
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { login, clearAuthError } from '@/features/authSlice';
import { authService } from '@/api/auth.service';
import RegisterComponent from './register.component';
import AuthLayout from '@/components/layout/AuthLayout';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterContainer = () => {
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

  const handleSubmit = async (data: RegisterData) => {
    try {
      // Register the user
      const response = await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      
      // If registration is successful, automatically log them in
      const resultAction = await dispatch(login({
        email: data.email,
        password: data.password,
      }));
      
      if (login.fulfilled.match(resultAction)) {
        toast.success('Account created successfully!');
        navigate('/dashboard');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create account');
    }
  };

  return (
    <AuthLayout 
      title="Create an account" 
      subtitle="Sign up to get started with BreezeCRM"
    >
      <RegisterComponent 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
        error={error} 
      />
    </AuthLayout>
  );
};

export default RegisterContainer;
