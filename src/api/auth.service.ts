
import http from './httpBase';
import { AuthCredentials, AuthResponse, User } from '@/types/User';

const PREFIX = '/v1';

export const authService = {
  // Verify if the tenant slug exists
  verifyTenant: async (slug: string): Promise<{tenant_id: string, tenant_name: string}> => {
    const response = await http.get(`${PREFIX}/get_tenant_id?slug=${slug}`);
    return response.data;
  },

  login: async (credentials: AuthCredentials & { client_id?: string }): Promise<AuthResponse> => {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);
    formData.append('scope', '');
    
    if (credentials.client_id) {
      formData.append('client_id', credentials.client_id);
    }
    
    const response = await http.post<AuthResponse>(`${PREFIX}/login`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },
  
  register: async (userData: AuthCredentials & { name: string }): Promise<AuthResponse> => {
    const response = await http.post<AuthResponse>(`${PREFIX}/register`, userData);
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    await http.post(`${PREFIX}/logout`);
    localStorage.removeItem('token');
    // Note: We don't delete the slug here
  },
  
  getCurrentUser: async (): Promise<User> => {
    const response = await http.get<User>(`${PREFIX}/me`);
    return response.data;
  },

  verifyToken: async (): Promise<boolean> => {
    try {
      const response = await http.get<{ valid: boolean }>(`${PREFIX}/verify-token`);
      return response.data.valid;
    } catch (error) {
      return false;
    }
  },
};
