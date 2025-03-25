
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, Calendar, Clock, Users, UserCheck, UserX, PieChart, TrendingUp, Download, ArrowUpDown, Filter, Settings, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

const AttendanceReports = () => {
  const { getAttendanceReports, getEmployees } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [reportData, setReportData] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    loadData();
  }, [selectedPeriod]);
  
  const loadData = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Get attendance report data
      const data = getAttendanceReports(selectedPeriod);
      setReportData(data);
      
      // Get employees for reference
      const allEmployees = getEmployees();
      setEmployees(allEmployees);
      setIsLoading(false);
    }, 500);
  };
  
  // Helper function to get employee name
  const getEmployeeName = (id: string) => {
    const employee = employees.find(e => e.id === id);
    return employee ? employee.name : 'Unknown';
  };
  
  const handleExportReport = () => {
    setIsGenerating(true);
    
    const exportPromise = new Promise((resolve) => {
      setTimeout(resolve, 1500);
    });
  
    toast.promise(exportPromise, {
      loading: 'Generating attendance report...',
      success: 'Attendance report downloaded successfully',
      error: 'Failed to download report',
    });
  
    exportPromise
      .then(() => {
        // Optional: Add any additional success logic
      })
      .catch(() => {
        // Optional: Add any error handling
      })
      .finally(() => {
        setIsGenerating(false);
      });
  };
  const handleRefresh = () => {
    loadData();
    toast.success("Report data refreshed");
  };
  
  // Mock data for employee attendance
  const employeeAttendance = [
    { employeeId: '2', attendanceRate: 98, lateCount: 1, overtimeHours: 5 },
    { employeeId: '3', attendanceRate: 92, lateCount: 3, overtimeHours: 2 },
    { employeeId: '4', attendanceRate: 85, lateCount: 5, overtimeHours: 0 },
  ];
  
  // Mock data for daily attendance
  const dailyAttendance = [
    { date: '2023-09-18', present: 12, absent: 2, late: 3 },
    { date: '2023-09-19', present: 13, absent: 1, late: 2 },
    { date: '2023-09-20', present: 11, absent: 3, late: 1 },
    { date: '2023-09-21', present: 14, absent: 0, late: 4 },
    { date: '2023-09-22', present: 10, absent: 4, late: 2 },
  ];
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <RefreshCw className="mx-auto h-8 w-8 text-primary animate-spin" />
            <p>Loading report data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" /> Attendance Reports
              </CardTitle>
              <CardDescription>
                View attendance statistics and trends
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select period" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="week">This Week</SelectItem>
    <SelectItem value="month">This Month</SelectItem>
    <SelectItem value="quarter">This Quarter</SelectItem>
    <SelectItem value="year">This Year</SelectItem>
  </SelectContent>
</Select>
              
              <Button 
                variant="outline" 
                size="default" 
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <Button 
                onClick={handleExportReport}
                disabled={isGenerating || !reportData}
              >
                <Download className="mr-2 h-4 w-4" />
                {isGenerating ? 'Generating...' : 'Export Report'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {reportData && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="bg-card/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
                        <p className="text-2xl font-bold">{reportData.totalEmployees}</p>
                      </div>
                      <Users className="h-8 w-8 text-primary/60" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Present Today</p>
                        <p className="text-2xl font-bold">{reportData.presentToday}</p>
                      </div>
                      <UserCheck className="h-8 w-8 text-green-500/60" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Absent Today</p>
                        <p className="text-2xl font-bold">{reportData.absentToday}</p>
                      </div>
                      <UserX className="h-8 w-8 text-red-500/60" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">On Leave</p>
                        <p className="text-2xl font-bold">{reportData.onLeaveToday}</p>
                      </div>
                      <Calendar className="h-8 w-8 text-blue-500/60" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Attendance Rate</CardTitle>
                    <CardDescription>Overall attendance performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Overall Rate</span>
                        <span className="text-sm font-medium">{reportData.attendanceRate}%</span>
                      </div>
                      <Progress value={reportData.attendanceRate} className="h-2" />
                      
                      <div className="pt-4 space-y-4">
                        <h4 className="text-sm font-medium">By Employee</h4>
                        {employeeAttendance.map((item) => (
                          <div key={item.employeeId} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">{getEmployeeName(item.employeeId)}</span>
                              <span className="text-sm font-medium">{item.attendanceRate}%</span>
                            </div>
                            <Progress 
                              value={item.attendanceRate} 
                              className="h-1.5" 
                              indicatorClassName={
                                item.attendanceRate > 95 ? "bg-green-500" :
                                item.attendanceRate > 85 ? "bg-yellow-500" :
                                "bg-red-500"
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Daily Attendance</CardTitle>
                    <CardDescription>Last 5 working days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Present</TableHead>
                            <TableHead>Absent</TableHead>
                            <TableHead>Late</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dailyAttendance.map((day) => (
                            <TableRow key={day.date}>
                              <TableCell>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  {day.present}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                  {day.absent}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                  {day.late}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Employee Performance</CardTitle>
                    <CardDescription>Attendance metrics by employee</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead>Attendance Rate</TableHead>
                            <TableHead className={isMobile ? "hidden" : ""}>Late Count</TableHead>
                            <TableHead className={isMobile ? "hidden" : ""}>Overtime Hours</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {employeeAttendance.map((item) => (
                            <TableRow key={item.employeeId}>
                              <TableCell className="font-medium">{getEmployeeName(item.employeeId)}</TableCell>
                              <TableCell>{item.attendanceRate}%</TableCell>
                              <TableCell className={isMobile ? "hidden" : ""}>{item.lateCount}</TableCell>
                              <TableCell className={isMobile ? "hidden" : ""}>{item.overtimeHours}</TableCell>
                              <TableCell>
                                <Badge variant={
                                  item.attendanceRate > 95 ? "default" :
                                  item.attendanceRate > 85 ? "outline" :
                                  "secondary"
                                } className={
                                  item.attendanceRate > 95 ? "bg-green-100 text-green-800" :
                                  item.attendanceRate > 85 ? "bg-yellow-100 text-yellow-800" :
                                  "bg-red-100 text-red-800"
                                }>
                                  {item.attendanceRate > 95 ? "Excellent" :
                                   item.attendanceRate > 85 ? "Good" :
                                   "Needs Improvement"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => {
                                    toast.success(`Detailed report for ${getEmployeeName(item.employeeId)} opened`);
                                  }}
                                >
                                  <Settings className="h-4 w-4" />
                                  <span className="sr-only">View details</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceReports;
