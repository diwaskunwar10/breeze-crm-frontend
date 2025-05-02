
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AuthCredentials } from '@/types/User';

interface LoginComponentProps {
  onSubmit: (credentials: AuthCredentials) => void;
  isLoading: boolean;
  error: string | null;
}

const LoginComponent = ({ onSubmit, isLoading, error }: LoginComponentProps) => {
  const [credentials, setCredentials] = useState<AuthCredentials>({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(credentials);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="text"
            placeholder="johndoe@example.com"
            autoComplete="email"
            required
            value={credentials.email}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-sm text-primary hover:text-primary/90">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
            value={credentials.password}
            onChange={handleChange}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember" className="text-sm font-normal">
            Remember me
          </Label>
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>
      
      <div className="text-center text-sm">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary hover:text-primary/90 font-medium">
          Sign up
        </Link>
      </div>
    </form>
  );
};

export default LoginComponent;
