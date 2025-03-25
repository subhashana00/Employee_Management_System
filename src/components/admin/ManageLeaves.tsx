
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Search, Clock, RefreshCw, FileText, CheckCircle, XCircle, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { LeaveRequest, LeaveStatus, LeaveType } from '@/types/attendance';
import { useIsMobile } from '@/hooks/use-mobile';
import { format } from 'date-fns';

const ManageLeaves = () => {
  const { getEmployees, getLeaveRequests, approveLeave, rejectLeave } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [filteredLeaveRequests, setFilteredLeaveRequests] = useState<LeaveRequest[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [responseNote, setResponseNote] = useState('');
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const isMobile = useIsMobile();
  
  const employees = getEmployees();
  
  // Get employee name by ID
  const getEmployeeName = (id: string) => {
    const employee = employees.find(e => e.id === id);
    return employee ? employee.name : 'Unknown';
  };
  
  // Load leave requests
  useEffect(() => {
    const allLeaveRequests = getLeaveRequests() as LeaveRequest[];
    setLeaveRequests(allLeaveRequests);
    
    // Apply initial filtering
    filterLeaveRequests(allLeaveRequests);
  }, [refreshKey]);
  
  // Filter leave requests
  const filterLeaveRequests = (requests: LeaveRequest[]) => {
    let filtered = [...requests];
    
    if (selectedStatus) {
      filtered = filtered.filter(leave => leave.status === selectedStatus);
    }
    
    if (selectedType) {
      filtered = filtered.filter(leave => leave.type === selectedType);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(leave => {
        const employeeName = getEmployeeName(leave.employeeId).toLowerCase();
        return employeeName.includes(term) || leave.reason.toLowerCase().includes(term);
      });
    }
    
    // Sort by request date (newest first)
    filtered.sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());
    
    setFilteredLeaveRequests(filtered);
  };
  
  // Apply filters when filter options change
  useEffect(() => {
    filterLeaveRequests(leaveRequests);
  }, [selectedStatus, selectedType, searchTerm]);
  
  // Refresh data
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setRefreshKey(prev => prev + 1);
      setIsLoading(false);
      toast.success("Leave requests refreshed");
    }, 600);
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setSelectedStatus(null);
    setSelectedType(null);
    setSearchTerm('');
  };
  
  // Open response dialog for approve/reject
  const handleOpenResponseDialog = (leave: LeaveRequest, action: 'approve' | 'reject') => {
    setSelectedLeave({ ...leave, status: action === 'approve' ? 'approved' : 'rejected' });
    setResponseNote('');
    setDialogOpen(true);
  };
  
  // Handle leave request response
  const handleLeaveResponse = async () => {
    if (!selectedLeave) return;
    
    setIsLoading(true);
    try {
      let success = false;
      
      if (selectedLeave.status === 'approved') {
        success = await approveLeave(selectedLeave.id, responseNote);
        if (success) {
          toast.success(`Leave request approved`);
        }
      } else if (selectedLeave.status === 'rejected') {
        success = await rejectLeave(selectedLeave.id, responseNote);
        if (success) {
          toast.success(`Leave request rejected`);
        }
      }
      
      if (success) {
        setDialogOpen(false);
        setRefreshKey(prev => prev + 1);
      }
    } catch (error) {
      toast.error(`Failed to ${selectedLeave.status} leave request`);
      console.error("Leave response error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get badge for leave status
  const getStatusBadge = (status: LeaveStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  // Get badge for leave type
  const getTypeBadge = (type: LeaveType) => {
    switch (type) {
      case 'sick':
        return <Badge variant="outline" className="bg-orange-50 text-orange-800 border-orange-200">Sick</Badge>;
      case 'vacation':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">Vacation</Badge>;
      case 'personal':
        return <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">Personal</Badge>;
      case 'other':
        return <Badge variant="outline" className="bg-gray-50 text-gray-800 border-gray-200">Other</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  // Calculate leave duration
  const getLeaveDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dayDiff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return dayDiff === 1 ? '1 day' : `${dayDiff} days`;
  };
  
  return (
    <>
      <Card className="w-full transition-all hover:shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" /> 
              <CardTitle>Leave Requests</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearFilters}
                disabled={!selectedStatus && !selectedType && !searchTerm}
              >
                <Filter className="h-4 w-4 mr-1" />
                Clear Filters
              </Button>
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
          </div>
          <CardDescription>
            Manage employee leave requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Filter By Status</label>
              <Select 
  value={selectedStatus || "all"} 
  onValueChange={(value) => setSelectedStatus(value === "all" ? null : value)}
>
  <SelectTrigger>
    <SelectValue placeholder="All Statuses" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All Statuses</SelectItem>
    <SelectItem value="pending">Pending</SelectItem>
    <SelectItem value="approved">Approved</SelectItem>
    <SelectItem value="rejected">Rejected</SelectItem>
  </SelectContent>
</Select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Filter By Type</label>
              <Select 
  value={selectedType || "all"} 
  onValueChange={(value) => setSelectedType(value === "all" ? null : value)}
>
  <SelectTrigger>
    <SelectValue placeholder="All Types" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All Types</SelectItem>
    <SelectItem value="sick">Sick</SelectItem>
    <SelectItem value="vacation">Vacation</SelectItem>
    <SelectItem value="personal">Personal</SelectItem>
    <SelectItem value="other">Other</SelectItem>
  </SelectContent>
</Select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search employee or reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
          
          {filteredLeaveRequests.length === 0 ? (
            <div className="text-center py-12 border rounded-md bg-accent/10 animate-in fade-in duration-300">
              <Calendar className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No leave requests found</p>
            </div>
          ) : (
            <div className="border rounded-md overflow-auto animate-in fade-in duration-300">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead className={isMobile ? "hidden" : ""}>Request Date</TableHead>
                    <TableHead>Leave Period</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeaveRequests.map((leave) => (
                    <TableRow key={leave.id} className="animate-in fade-in duration-300 hover:bg-accent/5">
                      <TableCell className="font-medium">{getEmployeeName(leave.employeeId)}</TableCell>
                      <TableCell className={isMobile ? "hidden" : ""}>
                        {new Date(leave.requestDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</span>
                          <span className="text-xs text-muted-foreground">
                            {getLeaveDuration(leave.startDate, leave.endDate)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(leave.type)}</TableCell>
                      <TableCell>{getStatusBadge(leave.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          {leave.status === 'pending' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenResponseDialog(leave, 'approve')}
                                disabled={isLoading}
                                className="transition-colors hover:bg-green-50"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                {isMobile ? "" : "Approve"}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenResponseDialog(leave, 'reject')}
                                disabled={isLoading}
                                className="transition-colors hover:bg-red-50"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                {isMobile ? "" : "Reject"}
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              toast.info(leave.reason || 'No reason provided');
                            }}
                            disabled={isLoading}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
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
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md animate-in fade-in-50 slide-in-from-bottom-10 duration-300">
          <DialogHeader>
            <DialogTitle>
              {selectedLeave?.status === 'approved' ? 'Approve Leave Request' : 'Reject Leave Request'}
            </DialogTitle>
            <DialogDescription>
              {selectedLeave?.status === 'approved' 
                ? 'Approve leave request for' 
                : 'Reject leave request for'} {selectedLeave && getEmployeeName(selectedLeave.employeeId)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {selectedLeave && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Type</Label>
                    <p>{selectedLeave.type}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Duration</Label>
                    <p>{getLeaveDuration(selectedLeave.startDate, selectedLeave.endDate)}</p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm text-muted-foreground">Reason</Label>
                  <p className="text-sm bg-muted p-2 rounded-md">{selectedLeave.reason}</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Response Note</Label>
                  <Textarea
                    id="notes"
                    value={responseNote}
                    onChange={(e) => setResponseNote(e.target.value)}
                    placeholder="Add a note to your response (optional)"
                    rows={3}
                  />
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleLeaveResponse}
              disabled={isLoading}
              variant={selectedLeave?.status === 'approved' ? 'default' : 'destructive'}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : selectedLeave?.status === 'approved' ? 'Approve Leave' : 'Reject Leave'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ManageLeaves;
