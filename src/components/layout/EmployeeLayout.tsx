import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  LayoutDashboard,
  User,
  Calendar,
  LogOut,
  Menu,
  X,
  BellRing,
  Settings,
  ClipboardList
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface EmployeeLayoutProps {
  children: React.ReactNode;
}

export default function EmployeeLayout({ children }: EmployeeLayoutProps) {
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
  
  // Also adjust sidebar when window is resized
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const navItems = [
    { name: 'Dashboard', path: '/employee', icon: LayoutDashboard },
    { name: 'My Profile', path: '/employee/profile', icon: User },
    { name: 'My Shifts', path: '/employee/shifts', icon: Calendar },
    { name: 'Leave Requests', path: '/employee/leaves', icon: ClipboardList },
    { name: 'Notifications', path: '/employee/notifications', icon: BellRing },
    { name: 'Settings', path: '/employee/settings', icon: Settings },
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
  
  return (
    <div className="min-h-screen bg-background flex">
      {/* Overlay to close sidebar on mobile */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
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
            onClick={() => setIsSidebarOpen(false)}
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
              onClick={() => isMobile && setIsSidebarOpen(false)}
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
            onClick={() => setIsSidebarOpen(true)}
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
                    <AvatarFallback>{user?.name ? getInitials(user.name) : 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    <div className="mt-1 flex items-center">
                      <span className="text-xs text-muted-foreground capitalize">{user?.jobType}</span>
                      <span className="mx-1 text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">${user?.hourlyRate}/hr</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/employee/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
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
