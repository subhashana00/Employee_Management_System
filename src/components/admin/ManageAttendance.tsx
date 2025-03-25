
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Search, Clock, UserCheck, UserX, ClockIcon, Edit, Info, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { Attendance } from '@/types/attendance';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

const ManageAttendance = () => {
  const { getEmployees, getAttendancesByDate, getAttendancesByEmployee, markAbsent, updateAttendance } = useAuth();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editLateMinutes, setEditLateMinutes] = useState(0);
  const [editOvertime, setEditOvertime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const isMobile = useIsMobile();
  
  const employees = getEmployees();
  
  // Get and filter attendance records
  const loadAttendanceRecords = () => {
    let attendances: Attendance[] = [];
    if (selectedEmployee) {
      attendances = getAttendancesByEmployee(selectedEmployee);
    } else {
      attendances = getAttendancesByDate(selectedDate);
    }
    
    // Filter by search term
    return attendances.filter(attendance => {
      const employeeName = getEmployeeName(attendance.employeeId).toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      return employeeName.includes(searchLower) || attendance.status.includes(searchLower);
    });
  };
  
  const [filteredAttendances, setFilteredAttendances] = useState<Attendance[]>([]);
  
  useEffect(() => {
    const records = loadAttendanceRecords();
    
    // Sort attendances by date (newest first) if employee is selected
    if (selectedEmployee) {
      records.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    }
    
    setFilteredAttendances(records);
  }, [selectedDate, selectedEmployee, searchTerm, refreshKey]);
  
  // Refresh data
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setRefreshKey(prev => prev + 1);
      setIsLoading(false);
      toast.success("Attendance records refreshed");
    }, 600);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'started':
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'absent':
        return <Badge className="bg-red-100 text-red-800">Absent</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getEmployeeName = (id: string) => {
    const employee = employees.find(e => e.id === id);
    return employee ? employee.name : 'Unknown';
  };
  
  const handleMarkAbsent = async (employeeId: string, date: string) => {
    try {
      setIsLoading(true);
      
      if (!confirm('Are you sure you want to mark this employee as absent?')) {
        setIsLoading(false);
        return;
      }
      
      const success = await markAbsent(employeeId, date, 'Marked as absent by admin');
      if (success) {
        toast.success('Employee marked as absent');
        setRefreshKey(prev => prev + 1);
      }
    } catch (error) {
      toast.error("Failed to mark employee absent");
      console.error("Error marking absent:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditAttendance = (attendance: Attendance) => {
    setSelectedAttendance(attendance);
    setEditNotes(attendance.notes || '');
    setEditLateMinutes(attendance.lateMinutes || 0);
    setEditOvertime(attendance.overtime || 0);
    setEditDialogOpen(true);
  };
  
  const handleUpdateAttendance = async () => {
    if (!selectedAttendance) return;
    
    try {
      setIsLoading(true);
      
      const updatedAttendance = {
        ...selectedAttendance,
        notes: editNotes,
        lateMinutes: editLateMinutes,
        overtime: editOvertime,
        isLate: editLateMinutes > 0
      };
      
      const success = await updateAttendance(updatedAttendance);
      if (success) {
        setEditDialogOpen(false);
        toast.success('Attendance record updated');
        setRefreshKey(prev => prev + 1);
      }
    } catch (error) {
      toast.error("Failed to update attendance record");
      console.error("Update attendance error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  return (
    <>
      <Card className="w-full transition-all hover:shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" /> 
              <CardTitle>Attendance Management</CardTitle>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          <CardDescription>
            Track and manage employee attendance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Filter By Date</label>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedEmployee(null);
                  }}
                />
              </div>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Filter By Employee</label>
              <Select
  value={selectedEmployee || "all"} // Use "all" as fallback
  onValueChange={(value) => {
    if (value === "all") {
      setSelectedEmployee(null);
    } else {
      setSelectedEmployee(value);
    }
  }}
>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Select employee" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All Employees</SelectItem> {/* Changed from "" to "all" */}
    {employees.map((employee) => (
      <SelectItem key={employee.id} value={employee.id}>
        {employee.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
          
          {filteredAttendances.length === 0 ? (
            <div className="text-center py-12 border rounded-md bg-accent/10 animate-in fade-in duration-300">
              <Clock className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No attendance records found</p>
            </div>
          ) : (
            <div className="border rounded-md overflow-auto animate-in fade-in duration-300">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{selectedEmployee ? 'Date' : 'Employee'}</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className={isMobile ? "hidden" : ""}>Start Time</TableHead>
                    <TableHead className={isMobile ? "hidden" : ""}>End Time</TableHead>
                    <TableHead className={isMobile ? "hidden" : ""}>Duration</TableHead>
                    <TableHead className={isMobile ? "hidden" : ""}>Late / OT</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttendances.map((attendance) => (
                    <TableRow key={attendance.id} className="animate-in fade-in duration-300 hover:bg-accent/5">
                      <TableCell className="font-medium">
                        {selectedEmployee ? 
                          new Date(attendance.date).toLocaleDateString() : 
                          getEmployeeName(attendance.employeeId)}
                      </TableCell>
                      <TableCell>{getStatusBadge(attendance.status)}</TableCell>
                      <TableCell className={isMobile ? "hidden" : ""}>{attendance.startTime || '-'}</TableCell>
                      <TableCell className={isMobile ? "hidden" : ""}>{attendance.endTime || '-'}</TableCell>
                      <TableCell className={isMobile ? "hidden" : ""}>
                        {attendance.duration ? 
                          `${Math.floor(attendance.duration / 60)}h ${attendance.duration % 60}m` : 
                          '-'}
                      </TableCell>
                      <TableCell className={isMobile ? "hidden" : ""}>
                        <div className="flex flex-col gap-1">
                          {attendance.isLate && (
                            <Badge variant="outline" className="text-red-600 border-red-200 inline-flex items-center">
                              <ClockIcon className="mr-1 h-3 w-3" />
                              Late: {attendance.lateMinutes}m
                            </Badge>
                          )}
                          {attendance.overtime > 0 && (
                            <Badge variant="outline" className="text-blue-600 border-blue-200 inline-flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              OT: {attendance.overtime}m
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          {attendance.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkAbsent(attendance.employeeId, attendance.date)}
                              disabled={isLoading}
                              className="transition-colors hover:bg-red-50"
                            >
                              <UserX className="h-4 w-4 mr-1" />
                              {isMobile ? "" : "Mark Absent"}
                            </Button>
                          )}
                          {(attendance.status === 'completed' || attendance.status === 'started') && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditAttendance(attendance)}
                              disabled={isLoading}
                              className="transition-colors hover:bg-blue-50"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              {isMobile ? "" : "Edit"}
                            </Button>
                          )}
                          {attendance.notes && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                toast.info(attendance.notes || 'No notes provided');
                              }}
                              disabled={isLoading}
                            >
                              <Info className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md animate-in fade-in-50 slide-in-from-bottom-10 duration-300">
          <DialogHeader>
            <DialogTitle>Edit Attendance Record</DialogTitle>
            <DialogDescription>
              Update attendance information for {selectedAttendance && getEmployeeName(selectedAttendance.employeeId)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="lateMinutes">Late Minutes</Label>
              <Input
                id="lateMinutes"
                type="number"
                min="0"
                value={editLateMinutes}
                onChange={(e) => setEditLateMinutes(parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="overtime">Overtime Minutes</Label>
              <Input
                id="overtime"
                type="number"
                min="0"
                value={editOvertime}
                onChange={(e) => setEditOvertime(parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Add notes about this attendance record"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setEditDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateAttendance}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ManageAttendance;
