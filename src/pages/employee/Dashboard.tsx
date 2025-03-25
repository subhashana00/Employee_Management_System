
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import EmployeeLayout from '@/components/layout/EmployeeLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Calendar, DollarSign, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AttendanceTracker from '@/components/employee/AttendanceTracker';

export default function EmployeeDashboard() {
  const { isAuthenticated, isEmployee, user, calculateBonusEligibility, getAttendanceReport } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isEmployee) {
    return <Navigate to="/admin" replace />;
  }
  
  // Mock data for upcoming shifts
  const upcomingShifts = [
    { day: 'Monday', date: '2023-09-18', startTime: '9:00 AM', endTime: '5:00 PM' },
    { day: 'Wednesday', date: '2023-09-20', startTime: '10:00 AM', endTime: '6:00 PM' },
    { day: 'Friday', date: '2023-09-22', startTime: '12:00 PM', endTime: '8:00 PM' },
  ];
  
  // Get bonus eligibility
  const bonusInfo = user ? calculateBonusEligibility(user.id) : { eligible: false, bonusPercentage: 0, leavesUsed: 0 };
  
  // Get weekly report
  const weeklyReport = user ? getAttendanceReport(user.id, 'week') : { totalHours: 0, attendanceRate: 0 };
  
  return (
    <EmployeeLayout>
      <div className="container mx-auto p-4 sm:p-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Welcome back, {user?.name.split(' ')[0]}!</h1>
          <p className="text-muted-foreground">Here's what's happening with your schedule</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Hours this week</CardTitle>
              <Clock className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{weeklyReport.totalHours} hrs</div>
              <p className="text-xs text-muted-foreground">
                {Math.random() > 0.5 ? '+' : '-'}{Math.floor(Math.random() * 5)} from last week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Shifts</CardTitle>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{upcomingShifts.length}</div>
              <p className="text-xs text-muted-foreground">
                Next 7 days
              </p>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Bonus Eligibility</CardTitle>
              <Award className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">
                {bonusInfo.eligible ? `${bonusInfo.bonusPercentage}%` : 'Not eligible'}
              </div>
              <p className="text-xs text-muted-foreground">
                Based on {bonusInfo.leavesUsed} leaves taken this year
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <AttendanceTracker />
            
            <Card className="w-full mt-4 sm:mt-6">
              <CardHeader>
                <CardTitle>Upcoming Schedule</CardTitle>
                <CardDescription>Your shifts for the next days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 sm:space-y-6">
                  {upcomingShifts.map((shift, i) => (
                    <div key={i} className="flex flex-col sm:flex-row items-start gap-3">
                      <div className="w-14 h-14 rounded-md bg-primary/10 flex flex-col items-center justify-center text-primary">
                        <span className="text-xs font-medium">{shift.day.slice(0, 3)}</span>
                        <span className="text-lg font-bold">{Math.floor(Math.random() * 28) + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-medium">
                            {shift.startTime} - {shift.endTime}
                          </h4>
                          <Badge variant="outline" className="ml-0 sm:ml-2">
                            {Math.floor((new Date(`2023-01-01T${shift.endTime}`).getTime() - 
                              new Date(`2023-01-01T${shift.startTime}`).getTime()) / 3600000)} hrs
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 capitalize">
                          {user?.jobType} shift
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
              <CardDescription>Personal and job details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="text-sm font-medium">{user?.name}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-sm font-medium break-words">{user?.email}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Job Type</p>
                  <p className="text-sm font-medium capitalize">{user?.jobType}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Hourly Rate</p>
                  <p className="text-sm font-medium">${user?.hourlyRate}/hour</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Attendance Rate</p>
                  <p className="text-sm font-medium">{weeklyReport.attendanceRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </EmployeeLayout>
  );
}
