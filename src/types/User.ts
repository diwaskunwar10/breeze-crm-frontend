
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

// New login response class that matches the API response
export class LoginResponse {
  id: string;
  access_token: string;
  token_type: string;
  username: string;
  role: string;
  tenant_id: string;
  tenant_label: string;
  tenant_slug: string;

  constructor(data: any) {
    this.id = data.id || '';
    this.access_token = data.access_token || '';
    this.token_type = data.token_type || 'bearer';
    this.username = data.username || '';
    this.role = data.role || '';
    this.tenant_id = data.tenant_id || '';
    this.tenant_label = data.tenant_label || '';
    this.tenant_slug = data.tenant_slug || '';
  }

  // Convert to a simple object for storage
  toJSON() {
    return {
      id: this.id,
      access_token: this.access_token,
      token_type: this.token_type,
      username: this.username,
      role: this.role,
      tenant_id: this.tenant_id,
      tenant_label: this.tenant_label,
      tenant_slug: this.tenant_slug
    };
  }

  // Create a user object from this login response
  toUser(): User {
    return {
      id: this.id,
      name: this.username,
      email: '', // Email might not be available in the response
      role: this.role as any,
      createdAt: new Date().toISOString()
    };
  }
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}
