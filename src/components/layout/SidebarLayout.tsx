
import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAppSelector, useAppDispatch } from '@/redux/store';
import { logout } from '@/features/authSlice';
import { 
  BarChart3, 
  Users, 
  Settings, 
  MessageSquare, 
  Calendar, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  LayoutDashboard
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const SidebarLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Customers', path: '/customers', icon: <Users size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} /> },
    { name: 'Messages', path: '/messages', icon: <MessageSquare size={20} /> },
    { name: 'Calendar', path: '/calendar', icon: <Calendar size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> }
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-secondary text-secondary-foreground h-screen flex flex-col border-r transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="p-4 flex items-center justify-between">
          {!collapsed && (
            <Link to="/dashboard" className="text-xl font-bold">
              BreezeCRM
            </Link>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        </div>

        <nav className="flex-1 pt-5 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {navigationItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm rounded-md transition-colors",
                    location.pathname === item.path
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <span className="mr-3">{item.icon}</span>
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={cn(
          "border-t p-4",
          collapsed ? "items-center justify-center" : ""
        )}>
          <div className={cn(
            "flex items-center",
            collapsed ? "flex-col space-y-2" : "space-x-3"
          )}>
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback>
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            )}
            
            {!collapsed && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout} 
                title="Logout"
              >
                <LogOut size={18} />
              </Button>
            )}
          </div>
          
          {collapsed && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="mt-4" 
              onClick={handleLogout} 
              title="Logout"
            >
              <LogOut size={18} />
            </Button>
          )}
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
