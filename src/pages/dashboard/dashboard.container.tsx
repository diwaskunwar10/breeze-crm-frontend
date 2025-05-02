
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchCustomerStats } from '@/features/customersSlice';
import DashboardComponent from './dashboard.component';

const DashboardContainer = () => {
  const dispatch = useAppDispatch();
  const { stats, isLoading } = useAppSelector((state) => state.customers);

  useEffect(() => {
    dispatch(fetchCustomerStats());
  }, [dispatch]);

  return (
    <DashboardComponent 
      stats={stats}
      isLoading={isLoading}
    />
  );
};

export default DashboardContainer;
