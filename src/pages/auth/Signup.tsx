
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [jobType, setJobType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { signup, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword || !jobType) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await signup(name, email, password, jobType);
      toast.success('Account created successfully!');
      navigate('/employee');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to create account. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
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
          <h1 className="text-3xl font-bold">Sign Up</h1>
          <p className="text-muted-foreground">Create a new employee account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="jobType">Job Type</Label>
            <Select value={jobType} onValueChange={setJobType} required>
              <SelectTrigger>
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="waiter">Waiter</SelectItem>
                <SelectItem value="chef">Chef</SelectItem>
                <SelectItem value="bartender">Bartender</SelectItem>
                <SelectItem value="host">Host</SelectItem>
                <SelectItem value="busser">Busser</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
            <UserPlus size={18} className="ml-2" />
          </Button>
        </form>
        
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
