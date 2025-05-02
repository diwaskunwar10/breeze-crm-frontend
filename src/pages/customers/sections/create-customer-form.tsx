
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Customer } from '@/types/Customer';
import { customerService } from '@/api/customers.service';
import { useAppContext } from '@/context/AppContext';

interface CreateCustomerFormProps {
  onSuccess: (customer: Customer) => void;
}

const CreateCustomerForm = ({ onSuccess }: CreateCustomerFormProps) => {
  const { hideModal } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<Partial<Customer>>({
    defaultValues: {
      status: 'lead',
      tags: [],
    }
  });

  const onSubmit = async (data: Partial<Customer>) => {
    setIsSubmitting(true);
    
    try {
      const newCustomer = await customerService.create({
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      onSuccess(newCustomer);
      hideModal();
    } catch (error) {
      toast.error('Failed to create customer. Please try again.');
      console.error('Error creating customer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-background rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6">Create New Customer</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            {...register('name', { required: 'Name is required' })}
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Please enter a valid email',
              }
            })}
            placeholder="john.doe@example.com"
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            {...register('phone')}
            placeholder="+1 (555) 123-4567"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            {...register('company')}
            placeholder="ABC Corporation"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select
            defaultValue="lead"
            onValueChange={(value) => setValue('status', value as 'active' | 'inactive' | 'lead' | 'prospect')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lead">Lead</SelectItem>
              <SelectItem value="prospect">Prospect</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="value">Value (USD)</Label>
          <Input
            id="value"
            type="number"
            {...register('value', {
              valueAsNumber: true,
              min: {
                value: 0,
                message: 'Value cannot be negative',
              },
            })}
            placeholder="0.00"
          />
          {errors.value && (
            <p className="text-sm text-destructive">{errors.value.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            {...register('notes')}
            placeholder="Add any relevant notes about this customer"
            rows={3}
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={hideModal}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Customer'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCustomerForm;
