
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import EmployeeLayout from '@/components/layout/EmployeeLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LeaveRequestForm from '@/components/employee/LeaveRequestForm';
import LeaveRequestsList from '@/components/employee/LeaveRequestsList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, FileText, Award } from 'lucide-react';

export default function EmployeeLeaves() {
  const { isAuthenticated, isEmployee, user, calculateBonusEligibility, getAttendanceReport } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isEmployee) {
    return <Navigate to="/admin" replace />;
  }
  
  // Get bonus eligibility
  const bonusInfo = user ? calculateBonusEligibility(user.id) : { eligible: false, bonusPercentage: 0, leavesUsed: 0 };
  
  // Get yearly report
  const yearlyReport = user ? getAttendanceReport(user.id, 'year') : { 
    totalShifts: 0, 
    attendedShifts: 0, 
    missedShifts: 0,
    totalHours: 0,
    attendanceRate: 0,
    leavesUsed: 0
  };
  
  return (
    <EmployeeLayout>
      <div className="container mx-auto p-4 sm:p-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Leave Management</h1>
          <p className="text-muted-foreground">Request and track your leaves</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Leaves Used</CardTitle>
              <ClipboardList className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{bonusInfo.leavesUsed}</div>
              <p className="text-xs text-muted-foreground">This year</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{yearlyReport.attendanceRate}%</div>
              <p className="text-xs text-muted-foreground">
                {yearlyReport.attendedShifts}/{yearlyReport.totalShifts} shifts
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Bonus Status</CardTitle>
              <Award className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">
                {bonusInfo.eligible ? `+${bonusInfo.bonusPercentage}%` : 'Not eligible'}
              </div>
              <p className="text-xs text-muted-foreground">
                {bonusInfo.eligible 
                  ? `You qualify for a ${bonusInfo.bonusPercentage}% bonus` 
                  : 'Take fewer than 5 leaves to qualify'}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="requests">My Requests</TabsTrigger>
            <TabsTrigger value="new">New Request</TabsTrigger>
          </TabsList>
          
          <TabsContent value="requests" className="mt-6">
            <LeaveRequestsList />
          </TabsContent>
          
          <TabsContent value="new" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Request Leave</CardTitle>
                <CardDescription>
                  Submit a new leave request
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LeaveRequestForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </EmployeeLayout>
  );
}
