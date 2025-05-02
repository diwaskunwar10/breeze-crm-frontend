
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
    const token = localStorage.getItem('token');
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
      localStorage.removeItem('token');
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
