
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Customer, CustomerFilters } from '@/types/Customer';
import { Plus, Search, Filter, UserCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CustomersComponentProps {
  customers: Customer[];
  isLoading: boolean;
  onCreateCustomer: () => void;
  onViewCustomer: (customerId: string) => void;
  onFilterChange: (filters: CustomerFilters) => void;
}

const CustomersComponent = ({ 
  customers, 
  isLoading, 
  onCreateCustomer, 
  onViewCustomer,
  onFilterChange 
}: CustomersComponentProps) => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<CustomerFilters>({});

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    onFilterChange({ ...filters, search: value });
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Get customer status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'lead':
        return <Badge className="bg-blue-500">Lead</Badge>;
      case 'prospect':
        return <Badge className="bg-yellow-500">Prospect</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">Manage and view your customer database</p>
        </div>
        <Button onClick={onCreateCustomer}>
          <Plus className="mr-2 h-4 w-4" />
          New Customer
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Filters & Search</CardTitle>
          <CardDescription>Narrow down your customer list</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="relative">
                <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  value={search}
                  onChange={handleSearchChange}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div>
              <Select onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="lead">Leads</SelectItem>
                  <SelectItem value="prospect">Prospects</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select onValueChange={(value) => handleFilterChange('assignedTo', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by assignment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignments</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  <SelectItem value="me">Assigned to Me</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Customers Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Value</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading state
                Array(5).fill(0).map((_, index) => (
                  <TableRow key={index}>
                    {Array(7).fill(0).map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <div className="h-4 bg-muted animate-pulse rounded"></div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : customers.length === 0 ? (
                // Empty state
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <UserCircle className="h-10 w-10 text-muted-foreground" />
                      <div className="text-xl font-medium">No customers found</div>
                      <div className="text-sm text-muted-foreground">
                        Add a new customer or adjust your search filters.
                      </div>
                      <Button onClick={onCreateCustomer} className="mt-2">
                        <Plus className="mr-2 h-4 w-4" />
                        New Customer
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                // Customer list
                customers.map((customer) => (
                  <TableRow 
                    key={customer.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onViewCustomer(customer.id)}
                  >
                    <TableCell>
                      <div className="font-medium">{customer.name}</div>
                      {customer.company && (
                        <div className="text-sm text-muted-foreground">{customer.company}</div>
                      )}
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{getStatusBadge(customer.status)}</TableCell>
                    <TableCell>
                      {customer.lastContact
                        ? formatDistanceToNow(new Date(customer.lastContact), { addSuffix: true })
                        : 'Never'}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {customer.tags.slice(0, 2).map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {customer.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{customer.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {customer.value
                        ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(customer.value)
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomersComponent;
