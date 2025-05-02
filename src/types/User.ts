
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'agent' | 'user';
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}
