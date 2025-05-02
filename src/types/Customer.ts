
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  status: 'active' | 'inactive' | 'lead' | 'prospect';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  lastContact?: string;
  value?: number;
  assignedTo?: string;
  notes?: string;
}

export interface CustomerFilters {
  status?: string;
  assignedTo?: string;
  tags?: string[];
  search?: string;
}
