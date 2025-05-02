import http from './httpBase';
import { AuthCredentials, AuthResponse, User, LoginResponse } from '@/types/User';

const PREFIX = '/v1';

export const authService = {
  // Verify if the tenant slug exists - with caching to prevent repeated calls
  verifyTenant: async (slug: string): Promise<{tenant_id: string, tenant_name: string}> => {
    // Check if we already verified this slug recently (cache for 5 minutes)
    const projectName = import.meta.env.VITE_PROJECT_NAME || 'chat_demo';
    const cacheKey = `${projectName}_verified_tenant_${slug}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
       
        return parsedData.data;
      } catch (e) {
        console.error('Error parsing cached tenant data:', e);
        // Continue with API call if cache parsing fails
      }
    }

    try {
      // Make a single API call to verify the tenant
      const response = await http.get(`${PREFIX}/get_tenant_id?slug=${slug}`);

      // Cache the successful response
      if (response.data && response.data.tenant_id) {
        localStorage.setItem(cacheKey, JSON.stringify({
          data: response.data,
          timestamp: Date.now()
        }));
      }

      return response.data;
    } catch (error) {
      console.error('Error verifying tenant:', error);
      // Don't retry on failure
      throw error;
    }
  },

  login: async (credentials: AuthCredentials & { client_id?: string }): Promise<LoginResponse> => {
    // Set up login request data
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);
    formData.append('scope', '');

    if (credentials.client_id) {
      formData.append('client_id', credentials.client_id);
    }

    try {
      // Make a single API call for login - no retries
      const response = await http.post(`${PREFIX}/login`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      // Create a new LoginResponse instance from the API response
      return new LoginResponse(response.data);
    } catch (error) {
      console.error('Login failed:', error);
      // Don't retry on failure
      throw error;
    }
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

  // Update stored slug only if verification is successful - no retries
  updateSlugIfValid: async (newSlug: string): Promise<boolean> => {
    // Check if this slug is already saved and valid
    const projectName = import.meta.env.VITE_PROJECT_NAME || 'chat_demo';
    const slugKey = `${projectName}_slug`;
    const currentSlug = localStorage.getItem(slugKey);

    // If the slug is already saved, don't verify again
    if (currentSlug === newSlug) {
      return true;
    }

    try {
      // Use the cached verification if possible
      const tenantData = await authService.verifyTenant(newSlug);

      if (tenantData && tenantData.tenant_id) {
        // Save verified slug
        localStorage.setItem(slugKey, newSlug);
        localStorage.setItem('tenant_slug', newSlug);
        return true;
      }

      // Invalid tenant - don't retry
      return false;
    } catch (error) {
      console.error('Error verifying tenant slug:', error);
      // Don't retry on failure
      return false;
    }
  },

  // Get the current slug from localStorage
  getCurrentSlug: (): string | null => {
    const projectName = import.meta.env.VITE_PROJECT_NAME || 'chat_demo';
    const slugKey = `${projectName}_slug`;

    // Try to get slug with project name prefix first
    let slug = localStorage.getItem(slugKey);

    // If not found, try the original key as fallback
    if (!slug) {
      slug = localStorage.getItem('tenant_slug');

      // If found in the old format, migrate it to the new format
      if (slug) {
        localStorage.setItem(slugKey, slug);
      }
    }

    return slug;
  },

  // Save slug to localStorage
  saveSlug: (slug: string): void => {
    if (!slug) return;

    const projectName = import.meta.env.VITE_PROJECT_NAME || 'chat_demo';
    const slugKey = `${projectName}_slug`;

    // Save with project name prefix
    localStorage.setItem(slugKey, slug);
    // Also save with original key for backward compatibility
    localStorage.setItem('tenant_slug', slug);
  }
};
