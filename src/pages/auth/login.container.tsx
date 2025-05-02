
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { login, clearAuthError } from '@/features/authSlice';
import { AuthCredentials } from '@/types/User';
import LoginComponent from './login.component';
import AuthLayout from '@/components/layout/AuthLayout';
import { authService } from '@/api/auth.service';
import { toast } from 'sonner';

const LoginContainer = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  const [tenantVerified, setTenantVerified] = useState<boolean | null>(null);

  useEffect(() => {
    // Clear any previous auth errors when component mounts
    dispatch(clearAuthError());

    // Verify the tenant slug - only once per component mount
    const verifyTenant = async () => {
      // Prevent multiple verification attempts
      if (tenantVerified !== null) {
        return; // Already verified or failed
      }

      if (slug) {
        try {
          // Make a single API call to verify the tenant
          const tenantData = await authService.verifyTenant(slug);

          if (tenantData && tenantData.tenant_id) {
            // Get project name from env
            const projectName = import.meta.env.VITE_PROJECT_NAME || 'chat_demo';
            // Save slug with project name prefix
            const slugKey = `${projectName}_slug`;
            localStorage.setItem(slugKey, slug);
            // Also keep the original tenant_slug for backward compatibility
            localStorage.setItem('tenant_slug', slug);
            setTenantVerified(true);
          } else {
            // Invalid tenant - set state and navigate once
            setTenantVerified(false);
            navigate('/not-found', { replace: true });
          }
        } catch (error) {
          // Error during verification - set state and navigate once
          console.error('Error verifying tenant:', error);
          setTenantVerified(false);
          navigate('/not-found', { replace: true });
        }
      } else {
        // No slug provided in URL, try to use stored slug - only once
        const projectName = import.meta.env.VITE_PROJECT_NAME || 'chat_demo';
        const slugKey = `${projectName}_slug`;
        // Try to get slug with project name prefix first
        let storedSlug = localStorage.getItem(slugKey);

        // If not found, try the original key as fallback
        if (!storedSlug) {
          storedSlug = localStorage.getItem('tenant_slug');
          // If found in the old format, migrate it to the new format
          if (storedSlug) {
            localStorage.setItem(slugKey, storedSlug);
          }
        }

        // If we have a slug, redirect to /:slug/login - only once
        if (storedSlug) {
          navigate(`/${storedSlug}`, { replace: true });
        } else {
          // No slug found - set state and navigate once
          setTenantVerified(false);
          navigate('/not-found', { replace: true });
        }
      }
    };

    verifyTenant();
  }, [dispatch, navigate, slug]);

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (credentials: AuthCredentials) => {
    if (!slug) {
      toast.error('Invalid tenant. Please check the URL.');
      return;
    }

    // Get project name from env
    const projectName = import.meta.env.VITE_PROJECT_NAME || 'chat_demo';

    // Save slug with project name prefix BEFORE login attempt - only once
    // This ensures we have the slug even if login fails
    const slugKey = `${projectName}_slug`;
    localStorage.setItem(slugKey, slug);
    localStorage.setItem('tenant_slug', slug);

    try {
      // Attempt login only once
      const resultAction = await dispatch(login({
        ...credentials,
        client_id: slug
      }));

      if (login.fulfilled.match(resultAction)) {
        // Login successful - navigate to dashboard
        navigate('/dashboard');
      } else if (login.rejected.match(resultAction)) {
        // Login failed - don't retry, just show the error
        console.error('Login failed:', resultAction.payload);
      }
    } catch (error) {
      // Handle any unexpected errors
      console.error('Unexpected error during login:', error);
      toast.error('An unexpected error occurred. Please try again later.');
    }
  };

  // Show loading while verifying tenant
  if (tenantVerified === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show not found if tenant verification failed
  if (tenantVerified === false) {
    return null; // This will be handled by the navigation to NotFound
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle={`Sign in to your account - ${slug}`}
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
