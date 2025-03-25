
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, Clock, Search, Check, X, Plus, 
  AlertCircle, CheckCircle, XCircle, ArrowUpDown 
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

// Define overtime request type
type OvertimeRequest = {
  id: string;
  employeeId: string;
  date: string;
  hours: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
};

export default function OvertimeManagement() {
  const { isAuthenticated, isAdmin, getEmployees } = useAuth();
  const [employees, setEmployees] = useState<any[]>([]);
  const [overtimeRequests, setOvertimeRequests] = useState<OvertimeRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddRequestOpen, setIsAddRequestOpen] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Form state
  const [employeeId, setEmployeeId] = useState('');
  const [date, setDate] = useState('');
  const [hours, setHours] = useState('1');
  const [reason, setReason] = useState('');
  
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      const allEmployees = getEmployees();
      setEmployees(allEmployees);
      
      // Generate mock overtime requests
      const mockRequests: OvertimeRequest[] = [];
      const statuses: ('pending' | 'approved' | 'rejected')[] = ['pending', 'approved', 'rejected'];
      
      for (let i = 0; i < 15; i++) {
        const randomEmployee = allEmployees[Math.floor(Math.random() * allEmployees.length)];
        
        const day = Math.floor(Math.random() * 28) + 1;
        const month = Math.floor(Math.random() * 3) + 1;
        const dateStr = `2023-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
        
        mockRequests.push({
          id: `overtime-${i}`,
          employeeId: randomEmployee?.id || 'emp1',
          date: dateStr,
          hours: Math.floor(Math.random() * 4) + 1,
          reason: [
            'Busy restaurant night', 
            'Staff shortage', 
            'Special event', 
            'Inventory check',
            'Training new staff'
          ][Math.floor(Math.random() * 5)],
          status: statuses[Math.floor(Math.random() * 3)]
        });
      }
      
      setOvertimeRequests(mockRequests);
    }
  }, [isAuthenticated, isAdmin, getEmployees]);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/employee" replace />;
  }
  
  const handleAddRequest = () => {
    const newRequest: OvertimeRequest = {
      id: `overtime-${Date.now()}`,
      employeeId,
      date,
      hours: parseInt(hours),
      reason,
      status: 'pending'
    };
    
    setOvertimeRequests([...overtimeRequests, newRequest]);
    resetForm();
    setIsAddRequestOpen(false);
    toast.success('Overtime request added successfully');
  };
  
  const handleStatusChange = (id: string, status: 'approved' | 'rejected') => {
    const updatedRequests = overtimeRequests.map(request => 
      request.id === id ? { ...request, status } : request
    );
    
    setOvertimeRequests(updatedRequests);
    toast.success(`Overtime request ${status}`);
  };
  
  const resetForm = () => {
    setEmployeeId('');
    setDate('');
    setHours('1');
    setReason('');
  };
  
  const getEmployeeName = (id: string) => {
    const employee = employees.find(emp => emp.id === id);
    return employee ? employee.name : 'Unknown';
  };
  
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };
  
  // Filter and sort overtime requests
  const filteredRequests = overtimeRequests.filter(request => {
    const nameMatch = getEmployeeName(request.employeeId).toLowerCase().includes(searchTerm.toLowerCase());
    const reasonMatch = request.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = filterStatus === 'all' || request.status === filterStatus;
    
    return (nameMatch || reasonMatch) && statusMatch;
  });
  
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (sortBy === 'date') {
      return sortDirection === 'asc' 
        ? a.date.localeCompare(b.date)
        : b.date.localeCompare(a.date);
    } else if (sortBy === 'employee') {
      return sortDirection === 'asc'
        ? getEmployeeName(a.employeeId).localeCompare(getEmployeeName(b.employeeId))
        : getEmployeeName(b.employeeId).localeCompare(getEmployeeName(a.employeeId));
    } else if (sortBy === 'hours') {
      return sortDirection === 'asc'
        ? a.hours - b.hours
        : b.hours - a.hours;
    }
    return 0;
  });
  
  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <a href="/admin">
                <ArrowLeft className="h-4 w-4" />
              </a>
            </Button>
            <h1 className="text-3xl font-bold">Overtime Management</h1>
          </div>
          <Button onClick={() => {
            resetForm();
            setIsAddRequestOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Request
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Overtime Requests
                </CardTitle>
                <CardDescription>
                  Manage employee overtime requests
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search employee or reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {sortedRequests.length === 0 ? (
              <div className="text-center py-12 border rounded-md bg-accent/10">
                <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No overtime requests found</p>
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="cursor-pointer" 
                        onClick={() => handleSort('date')}
                      >
                        <div className="flex items-center gap-1">
                          Date
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer" 
                        onClick={() => handleSort('employee')}
                      >
                        <div className="flex items-center gap-1">
                          Employee
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer" 
                        onClick={() => handleSort('hours')}
                      >
                        <div className="flex items-center gap-1">
                          Hours
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedRequests.map(request => (
                      <TableRow key={request.id}>
                        <TableCell>{new Date(request.date).toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium">{getEmployeeName(request.employeeId)}</TableCell>
                        <TableCell>{request.hours}</TableCell>
                        <TableCell>{request.reason}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              request.status === 'approved' ? 'success' : 
                              request.status === 'rejected' ? 'destructive' : 
                              'outline'
                            }
                            className="text-xs"
                          >
                            {request.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {request.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                            {request.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {request.status === 'pending' && (
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleStatusChange(request.id, 'approved')}
                                className="text-green-500 hover:text-green-700 hover:bg-green-100"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleStatusChange(request.id, 'rejected')}
                                className="text-red-500 hover:text-red-700 hover:bg-red-100"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Add Overtime Request Dialog */}
      <Dialog open={isAddRequestOpen} onOpenChange={setIsAddRequestOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Overtime Request</DialogTitle>
            <DialogDescription>
              Create a new overtime request for an employee
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="employee">Employee</Label>
              <Select value={employeeId} onValueChange={setEmployeeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map(employee => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hours">Hours</Label>
              <Input
                type="number"
                id="hours"
                min="1"
                max="12"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Input
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason for overtime request"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRequestOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleAddRequest} 
              disabled={!employeeId || !date || !hours || !reason}
            >
              Add Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
