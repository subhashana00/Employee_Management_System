
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ManageAttendance from '@/components/admin/ManageAttendance';
import ManageLeaves from '@/components/admin/ManageLeaves';
import PayrollManagement from '@/components/admin/PayrollManagement';
import { PageTransition } from '@/components/ui/page-transition';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function AttendanceManagement() {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('attendance');
  
  // Extract the tab from URL query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    if (tab && ['attendance', 'leaves', 'payroll'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);
  
  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/admin/attendance?tab=${value}`, { replace: true });
  };
  
  // Show success toast when directly accessing the leaves tab
  useEffect(() => {
    if (activeTab === 'leaves') {
      const fromDashboard = document.referrer.includes('/admin') && !document.referrer.includes('/attendance');
      if (fromDashboard) {
        toast.success("Leave management panel loaded successfully");
      }
    }
  }, [activeTab]);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/employee" replace />;
  }
  
  return (
    <AdminLayout>
      <PageTransition>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" asChild>
                <a href="/admin">
                  <ArrowLeft className="h-4 w-4" />
                </a>
              </Button>
              <h1 className="text-3xl font-bold">Attendance & Leave Management</h1>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="leaves">Leave Requests</TabsTrigger>
              <TabsTrigger value="payroll">Payroll</TabsTrigger>
            </TabsList>
            
            <TabsContent value="attendance" className="animate-in fade-in-50 duration-300">
              <ManageAttendance />
            </TabsContent>
            
            <TabsContent value="leaves" className="animate-in fade-in-50 duration-300">
              <ManageLeaves />
            </TabsContent>
            
            <TabsContent value="payroll" className="animate-in fade-in-50 duration-300">
              <PayrollManagement />
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
    </AdminLayout>
  );
}
