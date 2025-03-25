
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileBarChart, FilePieChart, FileSpreadsheet, Download, ArrowUpDown, Filter, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import AttendanceReports from '@/components/admin/AttendanceReports';

export default function Reports() {
  const { isAuthenticated, isAdmin } = useAuth();
  const isMobile = useIsMobile();
  const [reportStatus, setReportStatus] = useState<Record<string, string>>({
    shifts: 'pending',
    employees: 'pending',
    financial: 'pending'
  });
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/employee" replace />;
  }

  const handleGenerateReport = (reportType: string) => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          setReportStatus({...reportStatus, [reportType]: 'generated'});
          resolve(true);
        }, 1500);
      }),
      {
        loading: `Generating ${reportType} report...`,
        success: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report generated successfully`,
        error: `Failed to generate ${reportType} report`
      }
    );
  };

  const handleDownload = (reportType: string) => {
    toast.success(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report downloaded`);
  };

  const handleShare = (reportType: string) => {
    toast.success(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report shared`);
  };

  const handleExportAll = () => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 2000);
      }),
      {
        loading: 'Exporting all reports...',
        success: 'All reports exported successfully',
        error: 'Failed to export reports'
      }
    );
  };
  
  const handleSort = () => {
    toast.info('Sorting options applied');
  };
  
  const handleFilter = () => {
    toast.info('Filtering options applied');
  };
  
  return (
    <AdminLayout>
      <div className="container mx-auto p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <a href="/admin">
                <ArrowLeft className="h-4 w-4" />
              </a>
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold">Reports</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size={isMobile ? "sm" : "default"}>
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => handleFilter()}>
                    Last 7 days
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilter()}>
                    Last 30 days
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilter()}>
                    Last 90 days
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilter()}>
                    Custom range
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size={isMobile ? "sm" : "default"}>
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => handleSort()}>
                    Date (newest first)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort()}>
                    Date (oldest first)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort()}>
                    Employee (A-Z)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort()}>
                    Status
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button onClick={handleExportAll} size={isMobile ? "sm" : "default"}>
              <Download className="mr-2 h-4 w-4" />
              Export All
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="attendance">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="shifts">Shift Reports</TabsTrigger>
            <TabsTrigger value="employees">Employee Reports</TabsTrigger>
            <TabsTrigger value="financial">Financial Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="attendance" className="mt-6">
            <AttendanceReports />
          </TabsContent>
          
          <TabsContent value="shifts" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileBarChart className="h-5 w-5" />
                      Shift Reports
                    </CardTitle>
                    <CardDescription>
                      View and analyze shift data across all employees
                    </CardDescription>
                  </div>
                  <Badge variant={reportStatus.shifts === 'generated' ? 'success' : 'secondary'}>
                    {reportStatus.shifts === 'generated' ? 'Generated' : 'Pending'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 sm:py-12">
                  <FileBarChart className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Shift Reports</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Track employee attendance, total hours, and shift patterns. Generate weekly, monthly, or custom date range reports.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {reportStatus.shifts === 'generated' ? (
                      <>
                        <Button variant="outline" onClick={() => handleDownload('shifts')}>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <Button variant="outline" onClick={() => handleShare('shifts')}>
                          <Share className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                        <Button onClick={() => handleGenerateReport('shifts')}>
                          Regenerate Report
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => handleGenerateReport('shifts')}>Generate Report</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="employees" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FilePieChart className="h-5 w-5" />
                      Employee Reports
                    </CardTitle>
                    <CardDescription>
                      View employee performance and analytics
                    </CardDescription>
                  </div>
                  <Badge variant={reportStatus.employees === 'generated' ? 'success' : 'secondary'}>
                    {reportStatus.employees === 'generated' ? 'Generated' : 'Pending'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 sm:py-12">
                  <FilePieChart className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Employee Reports</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Analyze employee performance, attendance records, punctuality metrics, and overtime patterns.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {reportStatus.employees === 'generated' ? (
                      <>
                        <Button variant="outline" onClick={() => handleDownload('employees')}>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <Button variant="outline" onClick={() => handleShare('employees')}>
                          <Share className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                        <Button onClick={() => handleGenerateReport('employees')}>
                          Regenerate Report
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => handleGenerateReport('employees')}>Generate Report</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="financial" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileSpreadsheet className="h-5 w-5" />
                      Financial Reports
                    </CardTitle>
                    <CardDescription>
                      View financial data including salaries and overtime costs
                    </CardDescription>
                  </div>
                  <Badge variant={reportStatus.financial === 'generated' ? 'success' : 'secondary'}>
                    {reportStatus.financial === 'generated' ? 'Generated' : 'Pending'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 sm:py-12">
                  <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Financial Reports</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Track salary expenses, overtime costs, and financial metrics. Generate payroll reports for accounting purposes.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {reportStatus.financial === 'generated' ? (
                      <>
                        <Button variant="outline" onClick={() => handleDownload('financial')}>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <Button variant="outline" onClick={() => handleShare('financial')}>
                          <Share className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                        <Button onClick={() => handleGenerateReport('financial')}>
                          Regenerate Report
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => handleGenerateReport('financial')}>Generate Report</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
