
import { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'employee'>('employee');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  const { login, isAuthenticated, isAdmin, getEmployees } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Find employee with matching email to display their profile image
    if (email) {
      const employees = getEmployees();
      const matchingEmployee = employees.find(emp => emp.email === email);
      if (matchingEmployee && matchingEmployee.profileImage) {
        setProfileImage(matchingEmployee.profileImage);
      } else {
        setProfileImage(null);
      }
    } else {
      setProfileImage(null);
    }
  }, [email, getEmployees]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      toast.success(`Logged in successfully`);
      
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/employee');
      }
    } catch (error) {
      toast.error('Invalid credentials. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const setDemoCredentials = (role: 'admin' | 'employee') => {
    if (role === 'admin') {
      setEmail('admin@bistro.com');
      setPassword('admin123');
      setRole('admin');
    } else {
      setEmail('employee@bistro.com');
      setPassword('employee123');
      setRole('employee');
    }
  };
  
  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin" : "/employee"} replace />;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/30 p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg border border-border">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-muted-foreground">Sign in to Bistro Boardroom</p>
        </div>
        
        {/* Display employee profile image if available */}
        {role === 'employee' && (
          <div className="flex justify-center my-6">
            <Avatar className="h-24 w-24 border-4 border-primary/20">
              <AvatarImage src={profileImage || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                {email ? email.charAt(0).toUpperCase() : "?"}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
        
        <div className="flex rounded-md overflow-hidden border border-border">
          <button
            type="button"
            className={`flex-1 py-2.5 text-sm font-medium text-center transition-colors ${
              role === 'employee' ? 'bg-primary text-primary-foreground' : 'bg-accent/50 text-accent-foreground'
            }`}
            onClick={() => setRole('employee')}
          >
            Employee
          </button>
          <button
            type="button"
            className={`flex-1 py-2.5 text-sm font-medium text-center transition-colors ${
              role === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-accent/50 text-accent-foreground'
            }`}
            onClick={() => setRole('admin')}
          >
            Admin
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
            <LogIn size={18} className="ml-2" />
          </Button>
        </form>
        
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
        
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-center text-muted-foreground mb-2">Demo Credentials</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => setDemoCredentials('employee')}
            >
              Employee Demo
            </Button>
            <Button
              type="button" 
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => setDemoCredentials('admin')}
            >
              Admin Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
