
import React, { useEffect } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Users, Calendar, Clock, Wallet, FileText, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BonusReportInDashboard from '@/components/admin/BonusReportInDashboard';
import { useIsMobile } from '@/hooks/use-mobile';
import { PageTransition } from '@/components/ui/page-transition';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Welcome toast notification
    if (user) {
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`, {
        description: "Your bistro dashboard is ready.",
        duration: 3000,
      });
    }
  }, [user]);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/employee" replace />;
  }
  
  // Analytics data (would come from API in real app)
  const analytics = {
    totalEmployees: 12,
    activeShifts: 4,
    scheduledHours: 320,
    averagePay: 18.5,
  };
  
  const handleQuickAction = (action: string, path: string) => {
    toast.info(`Navigating to ${action}...`);
    navigate(path);
  };
  
  return (
    <AdminLayout>
      <PageTransition>
        <div className="container mx-auto p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user?.name.split(' ')[0]}</p>
            </div>
            <div className="flex gap-4">
              <Button asChild className="w-full sm:w-auto">
                <Link to="/admin/employees" onClick={() => handleQuickAction('Employee Management', '/admin/employees')}>
                  Manage Employees
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 sm:mb-8 animate-in fade-in duration-700">
            <Link to="/admin/employees" className="transition-transform hover:scale-102 duration-300">
              <Card className="h-full transition-all hover:shadow-md border-l-4 border-l-primary">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalEmployees}</div>
                  <p className="text-xs text-muted-foreground">
                    +2 from last month
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/admin/shifts" className="transition-transform hover:scale-102 duration-300">
              <Card className="h-full transition-all hover:shadow-md border-l-4 border-l-blue-400">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Shifts</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.activeShifts}</div>
                  <p className="text-xs text-muted-foreground">
                    Current working shifts
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/admin/shifts" className="transition-transform hover:scale-102 duration-300">
              <Card className="h-full transition-all hover:shadow-md border-l-4 border-l-green-400">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Scheduled Hours</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.scheduledHours}h</div>
                  <p className="text-xs text-muted-foreground">
                    This week
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/admin/salary" className="transition-transform hover:scale-102 duration-300">
              <Card className="h-full transition-all hover:shadow-md border-l-4 border-l-yellow-400">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Average Pay</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${analytics.averagePay}/hr</div>
                  <p className="text-xs text-muted-foreground">
                    All employees
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
          
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6 sm:mb-8 animate-in fade-in duration-700 delay-200">
            <div className="md:col-span-2">
              <Card className="w-full h-full">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Manage your bistro staff and operations</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <Button className="w-full justify-start hover:shadow-md transition-all" variant="outline" 
                      onClick={() => handleQuickAction('Shift Scheduling', '/admin/shifts')}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Shift Scheduling
                    </Button>
                    
                    <Button className="w-full justify-start hover:shadow-md transition-all" variant="outline" 
                      onClick={() => handleQuickAction('Attendance Management', '/admin/attendance')}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Attendance
                    </Button>
                    
                    <Button className="w-full justify-start hover:shadow-md transition-all" variant="outline" 
                      onClick={() => handleQuickAction('Payroll Management', '/admin/salary')}
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      Payroll
                    </Button>
                    
                    <Button className="w-full justify-start hover:shadow-md transition-all" variant="outline" 
                      onClick={() => handleQuickAction('Reports', '/admin/reports')}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Reports
                    </Button>
                    
                    <Button className="w-full justify-start hover:shadow-md transition-all" variant="outline" 
                      onClick={() => handleQuickAction('Overtime Management', '/admin/overtime')}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Overtime
                    </Button>
                    
                    <Button className="w-full justify-start hover:shadow-md transition-all" variant="outline" 
                      onClick={() => handleQuickAction('Leave Management', '/admin/attendance?tab=leaves')}
                    >
                      <Award className="mr-2 h-4 w-4" />
                      Leave Requests
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2 lg:col-span-1">
              <BonusReportInDashboard />
            </div>
          </div>
        </div>
      </PageTransition>
    </AdminLayout>
  );
}
