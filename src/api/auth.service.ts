
import http from './httpBase';
import { AuthCredentials, AuthResponse, User } from '@/types/User';

const PREFIX = '/auth';

export const authService = {
  login: async (credentials: AuthCredentials): Promise<AuthResponse> => {
    const response = await http.post<AuthResponse>(`${PREFIX}/login`, credentials);
    return response.data;
  },
  
  register: async (userData: AuthCredentials & { name: string }): Promise<AuthResponse> => {
    const response = await http.post<AuthResponse>(`${PREFIX}/register`, userData);
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    await http.post(`${PREFIX}/logout`);
    localStorage.removeItem('token');
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
