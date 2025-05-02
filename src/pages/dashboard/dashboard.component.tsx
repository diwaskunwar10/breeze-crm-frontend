
import { BarChart3, Users, Inbox, TrendingUp, Clock, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

interface DashboardComponentProps {
  stats: {
    total: number;
    active: number;
    leads: number;
    prospects: number;
    recentlyAdded: number;
  } | null;
  isLoading: boolean;
}

const DashboardComponent = ({ stats, isLoading }: DashboardComponentProps) => {
  // Sample data for charts - in a real app, this would come from the API
  const customerActivityData = [
    { name: 'Mon', value: 20 },
    { name: 'Tue', value: 15 },
    { name: 'Wed', value: 25 },
    { name: 'Thu', value: 30 },
    { name: 'Fri', value: 22 },
    { name: 'Sat', value: 12 },
    { name: 'Sun', value: 8 },
  ];

  const recentActivities = [
    { id: 1, type: 'message', customer: 'Alice Johnson', time: '10 min ago', description: 'Sent a follow-up email' },
    { id: 2, type: 'call', customer: 'Bob Smith', time: '1 hour ago', description: 'Scheduled a demo call' },
    { id: 3, type: 'meeting', customer: 'Carol Williams', time: '3 hours ago', description: 'Completed onboarding meeting' },
    { id: 4, type: 'note', customer: 'David Brown', time: '5 hours ago', description: 'Added new customer requirements' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Demo Call with XYZ Corp', time: '1:00 PM', date: 'Today' },
    { id: 2, title: 'Follow-up with Johnson LLC', time: '3:30 PM', date: 'Today' },
    { id: 3, title: 'Product Presentation', time: '10:00 AM', date: 'Tomorrow' },
    { id: 4, title: 'Team Sales Meeting', time: '2:00 PM', date: 'Tomorrow' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your CRM metrics and activity</p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className={cn(isLoading ? "animate-pulse" : "")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '—' : stats?.total || 0}</div>
            <p className="text-xs text-muted-foreground">+{isLoading ? '—' : stats?.recentlyAdded || 0} since last month</p>
          </CardContent>
        </Card>
        
        <Card className={cn(isLoading ? "animate-pulse" : "")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '—' : stats?.active || 0}</div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? '—' : `${Math.round((stats?.active || 0) / (stats?.total || 1) * 100)}%`} of total customers
            </p>
          </CardContent>
        </Card>
        
        <Card className={cn(isLoading ? "animate-pulse" : "")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Leads</CardTitle>
            <Inbox className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '—' : stats?.leads || 0}</div>
            <p className="text-xs text-muted-foreground">Ready for qualification</p>
          </CardContent>
        </Card>
        
        <Card className={cn(isLoading ? "animate-pulse" : "")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Prospects</CardTitle>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '—' : stats?.prospects || 0}</div>
            <p className="text-xs text-muted-foreground">In sales pipeline</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {/* Customer Activity Chart */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Customer Activity</CardTitle>
            <CardDescription>Daily customer interactions over the week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={customerActivityData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                  <YAxis stroke="#888888" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Activity */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions across your CRM</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className="p-2 bg-primary/20 rounded-full">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{activity.customer}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Your schedule for today and tomorrow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-4 p-3 border rounded-md">
                <div className="p-2 bg-secondary rounded-md">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.date}, {event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardComponent;
