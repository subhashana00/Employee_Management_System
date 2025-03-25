
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import EmployeeLayout from '@/components/layout/EmployeeLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { PageTransition } from '@/components/ui/page-transition';
import { useInView } from '@/lib/animation-utils';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

export default function EmployeeShifts() {
  const { isAuthenticated, isEmployee, user, getShifts } = useAuth();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  
  // Animation hooks
  const statsCard1 = useInView({ threshold: 0.1 });
  const statsCard2 = useInView({ threshold: 0.1 });
  const tableSection = useInView({ threshold: 0.1 });
  
  // Get shifts for the employee using getShifts instead of getShiftsByEmployee
  const shifts = user ? getShifts(user.id) : [];
  
  // Calculate current month stats
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();
  const totalHours = shifts.reduce((total, shift) => {
    // Calculate hours from start and end time
    const startParts = shift.startTime.split(':').map(Number);
    const endParts = shift.endTime.split(':').map(Number);
    const startHours = startParts[0] + startParts[1] / 60;
    const endHours = endParts[0] + endParts[1] / 60;
    const hours = endHours - startHours;
    return total + (hours > 0 ? hours : 0);
  }, 0);
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isEmployee) {
    return <Navigate to="/admin" replace />;
  }
  
  return (
    <EmployeeLayout>
      <PageTransition>
        <div className="container mx-auto p-4 sm:p-6 max-w-5xl">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">My Shifts</h1>
          <p className="text-muted-foreground mb-6">View your scheduled and completed shifts</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <div 
              ref={statsCard1.ref as React.RefObject<HTMLDivElement>}
              className={`transition-all duration-500 ease-out ${statsCard1.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Shifts</CardTitle>
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <>
                      <Skeleton className="h-8 w-20 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </>
                  ) : (
                    <>
                      <div className="text-2xl sm:text-3xl font-bold">
                        {shifts.filter(shift => shift.status === 'scheduled').length}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Next 2 weeks
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div 
              ref={statsCard2.ref as React.RefObject<HTMLDivElement>}
              className={`transition-all duration-500 delay-150 ease-out ${statsCard2.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Hours This Month</CardTitle>
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <>
                      <Skeleton className="h-8 w-24 mb-1" />
                      <Skeleton className="h-4 w-28" />
                    </>
                  ) : (
                    <>
                      <div className="text-2xl sm:text-3xl font-bold">
                        {totalHours.toFixed(1)} hrs
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {currentMonth} {currentYear}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div 
            ref={tableSection.ref as React.RefObject<HTMLDivElement>}
            className={`transition-all duration-500 delay-300 ease-out ${tableSection.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <Card>
              <CardHeader>
                <CardTitle>All Shifts</CardTitle>
                <CardDescription>Your scheduled and past shifts</CardDescription>
              </CardHeader>
              <CardContent className="p-0 sm:p-6">
                {isLoading ? (
                  <div className="p-4 sm:p-0">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex flex-col gap-2 mb-6">
                        <Skeleton className="h-12 w-full rounded-md" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <ScrollArea className="h-[500px] sm:h-auto">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead className="hidden sm:table-cell">Day</TableHead>
                            <TableHead>Shift Time</TableHead>
                            <TableHead className="text-right">Hours</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {shifts.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-6">
                                <div className="flex flex-col items-center justify-center text-muted-foreground">
                                  <Calendar className="h-10 w-10 mb-2" />
                                  <p>No shifts scheduled</p>
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : (
                            shifts.map((shift, i) => {
                              // Calculate hours from start and end time
                              const startParts = shift.startTime.split(':').map(Number);
                              const endParts = shift.endTime.split(':').map(Number);
                              const startHours = startParts[0] + startParts[1] / 60;
                              const endHours = endParts[0] + endParts[1] / 60;
                              const hours = endHours - startHours;
                              
                              return (
                                <TableRow 
                                  key={i}
                                  className="animate-fadeIn"
                                  style={{ animationDelay: `${i * 50}ms` }}
                                >
                                  <TableCell className="font-medium">
                                    {shift.date ? new Date(shift.date).toLocaleDateString() : 'N/A'}
                                  </TableCell>
                                  <TableCell className="hidden sm:table-cell">{shift.day}</TableCell>
                                  <TableCell>
                                    <span className="whitespace-nowrap">{shift.startTime} - {shift.endTime}</span>
                                  </TableCell>
                                  <TableCell className="text-right">{hours.toFixed(1)}</TableCell>
                                  <TableCell>
                                    <Badge 
                                      variant="outline"
                                      className={
                                        shift.status === 'completed' 
                                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border-green-200 dark:border-green-800' 
                                          : shift.status === 'missed'
                                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 border-red-200 dark:border-red-800'
                                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 border-blue-200 dark:border-blue-800'
                                      }
                                    >
                                      {shift.status === 'completed' ? 'Completed' : 
                                       shift.status === 'missed' ? 'Missed' : 'Scheduled'}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              );
                            })
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <ScrollToTop />
      </PageTransition>
    </EmployeeLayout>
  );
}
