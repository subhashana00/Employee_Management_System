
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Clock,
  DollarSign,
  BarChart3,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Settings
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  
  useEffect(() => {
    // Close sidebar by default on mobile
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Employees', path: '/admin/employees', icon: Users },
    { name: 'Shifts', path: '/admin/shifts', icon: Calendar },
    { name: 'Overtime', path: '/admin/overtime', icon: Clock },
    { name: 'Salary', path: '/admin/salary', icon: DollarSign },
    { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { name: 'Attendance', path: '/admin/attendance', icon: Clock },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];
  
  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const closeSidebarOnMobile = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background flex">
      {/* Overlay to close sidebar on mobile */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={closeSidebarOnMobile}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`bg-sidebar text-sidebar-foreground fixed inset-y-0 z-50 flex flex-col border-r border-sidebar-border transition-all duration-300 lg:left-0 ${
          isSidebarOpen ? 'left-0' : '-left-72'
        }`}
        style={{ width: '18rem' }}
      >
        <div className="p-4 md:p-6 flex items-center justify-between border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              BB
            </div>
            <h1 className="text-xl font-bold">Bistro Boardroom</h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                location.pathname === item.path
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                  : 'hover:bg-sidebar-accent/50'
              }`}
              onClick={closeSidebarOnMobile}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t border-sidebar-border mt-auto">
          <Button 
            variant="outline" 
            className="w-full justify-start text-sidebar-foreground" 
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>
      
      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 w-full ${
        isSidebarOpen ? 'lg:ml-72' : ''
      }`}>
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className={isSidebarOpen ? 'lg:hidden' : ''}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="ml-auto flex items-center gap-4">
            <ThemeToggle />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    {user?.photoURL ? (
                      <AvatarImage src={user.photoURL} alt={user.name} />
                    ) : (
                      <AvatarFallback>{user?.name ? getInitials(user.name) : 'A'}</AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/admin/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Main content */}
        <main className="w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
