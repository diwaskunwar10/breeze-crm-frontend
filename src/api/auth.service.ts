import http from './httpBase';
import { AuthCredentials, AuthResponse, User, LoginResponse } from '@/types/User';

const PREFIX = '/v1';

export const authService = {
  // Verify if the tenant slug exists
  verifyTenant: async (slug: string): Promise<{tenant_id: string, tenant_name: string}> => {
    const response = await http.get(`${PREFIX}/get_tenant_id?slug=${slug}`);
    return response.data;
  },

  login: async (credentials: AuthCredentials & { client_id?: string }): Promise<LoginResponse> => {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);
    formData.append('scope', '');

    if (credentials.client_id) {
      formData.append('client_id', credentials.client_id);
    }

    const response = await http.post(`${PREFIX}/login`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // Create a new LoginResponse instance from the API response
    return new LoginResponse(response.data);
  },

  register: async (userData: AuthCredentials & { name: string }): Promise<AuthResponse> => {
    const response = await http.post<AuthResponse>(`${PREFIX}/register`, userData);
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await http.post(`${PREFIX}/logout`);
    } catch (error) {
      console.error('Error during logout:', error);
      // Continue with client-side logout even if server logout fails
    }

    // Get project name from env
    const projectName = import.meta.env.VITE_PROJECT_NAME || 'chat_demo';

    // Remove token with project name prefix
    localStorage.removeItem(`${projectName}_token`);
    // Also remove the original token for backward compatibility
    localStorage.removeItem('token');

    // Remove user data with project name prefix
    localStorage.removeItem(`${projectName}_user`);
    
    // Remove login data
    localStorage.removeItem(`${projectName}_login_data`);

    // DO NOT remove the slug - keep it for future logins
    // const slugKey = `${projectName}_slug`;
    // DO NOT: localStorage.removeItem(slugKey);
    // DO NOT: localStorage.removeItem('tenant_slug');
  },

  // verifyToken: async (): Promise<boolean> => {
  //   try {
  //     const response = await http.get<{ valid: boolean }>(`${PREFIX}/verify-token`);
  //     return response.data.valid;
  //   } catch (error) {
  //     return false;
  //   }
  // },
  
  // Update stored slug only if verification is successful
  updateSlugIfValid: async (newSlug: string): Promise<boolean> => {
    try {
      const tenantData = await authService.verifyTenant(newSlug);
      if (tenantData && tenantData.tenant_id) {
        // Save verified slug
        const projectName = import.meta.env.VITE_PROJECT_NAME || 'chat_demo';
        const slugKey = `${projectName}_slug`;
        localStorage.setItem(slugKey, newSlug);
        localStorage.setItem('tenant_slug', newSlug);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error verifying tenant slug:', error);
      return false;
    }
  }
};
