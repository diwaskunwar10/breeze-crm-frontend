
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterComponentProps {
  onSubmit: (data: RegisterData) => void;
  isLoading: boolean;
  error: string | null;
}

const RegisterComponent = ({ onSubmit, isLoading, error }: RegisterComponentProps) => {
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!agreedToTerms) {
      errors.terms = 'You must agree to the terms and conditions';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
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
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            autoComplete="name"
            required
            value={formData.name}
            onChange={handleChange}
          />
          {formErrors.name && <p className="text-destructive text-sm mt-1">{formErrors.name}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="johndoe@example.com"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
          {formErrors.email && <p className="text-destructive text-sm mt-1">{formErrors.email}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleChange}
          />
          {formErrors.password && <p className="text-destructive text-sm mt-1">{formErrors.password}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {formErrors.confirmPassword && <p className="text-destructive text-sm mt-1">{formErrors.confirmPassword}</p>}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="terms" 
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)} 
            />
            <Label htmlFor="terms" className="text-sm font-normal">
              I agree to the{' '}
              <Link to="/terms" className="text-primary hover:text-primary/90">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary hover:text-primary/90">
                Privacy Policy
              </Link>
            </Label>
          </div>
          {formErrors.terms && <p className="text-destructive text-sm mt-1">{formErrors.terms}</p>}
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Create account'}
      </Button>
      
      <div className="text-center text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:text-primary/90 font-medium">
          Sign in
        </Link>
      </div>
    </form>
  );
};

export default RegisterComponent;
