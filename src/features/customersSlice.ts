
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customerService } from '@/api/customers.service';
import { Customer, CustomerFilters } from '@/types/Customer';

interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  filters: CustomerFilters;
  isLoading: boolean;
  error: string | null;
  stats: {
    total: number;
    active: number;
    leads: number;
    prospects: number;
    recentlyAdded: number;
  } | null;
}

const initialState: CustomerState = {
  customers: [],
  selectedCustomer: null,
  filters: {},
  isLoading: false,
  error: null,
  stats: null,
};

export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (filters: CustomerFilters | undefined, { rejectWithValue }) => {
    try {
      const customers = await customerService.getAll(filters);
      return customers;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customers');
    }
  }
);

export const fetchCustomerById = createAsyncThunk(
  'customers/fetchCustomerById',
  async (id: string, { rejectWithValue }) => {
    try {
      const customer = await customerService.getById(id);
      return customer;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customer');
    }
  }
);

export const createCustomer = createAsyncThunk(
  'customers/createCustomer',
  async (customer: Partial<Customer>, { rejectWithValue }) => {
    try {
      const newCustomer = await customerService.create(customer);
      return newCustomer;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create customer');
    }
  }
);

export const updateCustomer = createAsyncThunk(
  'customers/updateCustomer',
  async ({ id, customer }: { id: string, customer: Partial<Customer> }, { rejectWithValue }) => {
    try {
      const updatedCustomer = await customerService.update(id, customer);
      return updatedCustomer;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update customer');
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  'customers/deleteCustomer',
  async (id: string, { rejectWithValue }) => {
    try {
      await customerService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete customer');
    }
  }
);

export const fetchCustomerStats = createAsyncThunk(
  'customers/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const stats = await customerService.getStats();
      return stats;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customer stats');
    }
  }
);

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearSelectedCustomer: (state) => {
      state.selectedCustomer = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch customers
      .addCase(fetchCustomers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch customer by id
      .addCase(fetchCustomerById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedCustomer = action.payload;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create customer
      .addCase(createCustomer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers.push(action.payload);
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update customer
      .addCase(updateCustomer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers = state.customers.map(customer => 
          customer.id === action.payload.id ? action.payload : customer
        );
        if (state.selectedCustomer?.id === action.payload.id) {
          state.selectedCustomer = action.payload;
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Delete customer
      .addCase(deleteCustomer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers = state.customers.filter(customer => customer.id !== action.payload);
        if (state.selectedCustomer?.id === action.payload) {
          state.selectedCustomer = null;
        }
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch stats
      .addCase(fetchCustomerStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCustomerStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchCustomerStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearSelectedCustomer } = customersSlice.actions;

export default customersSlice.reducer;
