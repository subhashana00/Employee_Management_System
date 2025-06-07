import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "employee">("employee");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const { login, isAuthenticated, isAdmin, getEmployees } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (email) {
      const employees = getEmployees();
      const matchingEmployee = employees.find((emp) => emp.email === email);
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
      toast.error("Please enter both email and password");
      return;
    }

    setIsSubmitting(true);

    try {
      await login(email, password);
      toast.success(`Logged in successfully`);

      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/employee");
      }
    } catch (error) {
      toast.error("Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const setDemoCredentials = (role: "admin" | "employee") => {
    if (role === "admin") {
      setEmail("admin@bistro.com");
      setPassword("admin123");
      setRole("admin");
    } else {
      setEmail("employee@bistro.com");
      setPassword("employee123");
      setRole("employee");
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

      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-xl shadow-sm border border-border">
        {/* Header with role toggle */}
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-2xl font-semibold text-center">
            {role === "employee" ? "Employee Login" : "Admin Login"}
          </h1>

          {/* Profile avatar for employee login */}
          {role === "employee" && (
            <Avatar className="h-20 w-20 border-2 border-primary/20">
              <AvatarImage src={profileImage || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                {email ? email.charAt(0).toUpperCase() : "E"}
              </AvatarFallback>
            </Avatar>
          )}

          {/* Role selector */}
          <div className="flex w-full rounded-lg overflow-hidden border border-border bg-muted">
            <button
              type="button"
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                role === "employee"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent/50"
              }`}
              onClick={() => setRole("employee")}
            >
              Employee
            </button>
            <button
              type="button"
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                role === "admin"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent/50"
              }`}
              onClick={() => setRole("admin")}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-primary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-10 pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full h-10" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                </svg>
                Signing In...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Sign In <LogIn size={16} />
              </span>
            )}
          </Button>
        </form>

        {/* Secondary actions */}
        <div className="flex flex-col items-center space-y-4 pt-2">
          <Link to="/signup" className="text-sm text-primary hover:underline">
            Don't have an account? Sign up
          </Link>

          <div className="w-full pt-4 border-t border-border">
            <p className="text-xs text-center text-muted-foreground mb-3">
              Try demo accounts
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="sm"
                className="h-9"
                onClick={() => setDemoCredentials("employee")}
              >
                Employee Demo
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9"
                onClick={() => setDemoCredentials("admin")}
              >
                Admin Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
