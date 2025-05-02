
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchCustomers, setFilters } from '@/features/customersSlice';
import { CustomerFilters } from '@/types/Customer';
import CustomersComponent from './customers.component';
import { useAppContext } from '@/context/AppContext';
import CreateCustomerForm from './sections/create-customer-form';

const CustomersContainer = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showModal } = useAppContext();
  const { customers, isLoading, filters } = useAppSelector((state) => state.customers);
  const [isMounted, setIsMounted] = useState(false);

  // Fetch customers on mount and when filters change
  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
      return;
    }
    
    dispatch(fetchCustomers(filters));
  }, [dispatch, filters, isMounted]);

  // Handle creating a new customer
  const handleCreateCustomer = () => {
    showModal(
      <CreateCustomerForm
        onSuccess={(customer) => {
          toast.success(`Customer ${customer.name} created successfully!`);
          dispatch(fetchCustomers(filters));
        }}
      />
    );
  };

  // Handle viewing a customer
  const handleViewCustomer = (customerId: string) => {
    navigate(`/customers/${customerId}`);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: CustomerFilters) => {
    dispatch(setFilters({
      ...filters,
      ...newFilters
    }));
  };

  return (
    <CustomersComponent
      customers={customers}
      isLoading={isLoading}
      onCreateCustomer={handleCreateCustomer}
      onViewCustomer={handleViewCustomer}
      onFilterChange={handleFilterChange}
    />
  );
};

export default CustomersContainer;
