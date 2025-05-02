
import http from './httpBase';
import { Customer, CustomerFilters } from '@/types/Customer';
import { ApiResponse } from '@/types/User';

const PREFIX = '/customers';

export const customerService = {
  getAll: async (filters?: CustomerFilters): Promise<Customer[]> => {
    const response = await http.get<ApiResponse<Customer[]>>(PREFIX, { params: filters });
    return response.data.data;
  },
  
  getById: async (id: string): Promise<Customer> => {
    const response = await http.get<ApiResponse<Customer>>(`${PREFIX}/${id}`);
    return response.data.data;
  },
  
  create: async (customer: Partial<Customer>): Promise<Customer> => {
    const response = await http.post<ApiResponse<Customer>>(PREFIX, customer);
    return response.data.data;
  },
  
  update: async (id: string, customer: Partial<Customer>): Promise<Customer> => {
    const response = await http.put<ApiResponse<Customer>>(`${PREFIX}/${id}`, customer);
    return response.data.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await http.delete<ApiResponse<void>>(`${PREFIX}/${id}`);
  },
  
  getStats: async (): Promise<{ 
    total: number;
    active: number;
    leads: number;
    prospects: number;
    recentlyAdded: number;
  }> => {
    const response = await http.get<ApiResponse<any>>(`${PREFIX}/stats`);
    return response.data.data;
  }
};
