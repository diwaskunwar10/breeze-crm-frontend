
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.example.com';

const http = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
http.interceptors.request.use(
  (config) => {
    // Get project name from env
    const projectName = import.meta.env.VITE_PROJECT_NAME || 'chat_demo';

    // Try to get token with project name prefix first
    let token = localStorage.getItem(`${projectName}_token`);

    // If not found, try the original key as fallback
    if (!token) {
      token = localStorage.getItem('token');
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (!response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    if (response.status === 401) {
      // Get project name from env
      const projectName = import.meta.env.VITE_PROJECT_NAME || 'chat_demo';

      // Remove token with project name prefix
      localStorage.removeItem(`${projectName}_token`);
      // Also remove the original token for backward compatibility
      localStorage.removeItem('token');

      // Remove user data with project name prefix
      localStorage.removeItem(`${projectName}_user`);

      // DO NOT remove the slug - keep it for future logins

      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    }

    if (response.status === 403) {
      toast.error('You do not have permission to perform this action.');
    }

    if (response.status === 500) {
      toast.error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);

export default http;
