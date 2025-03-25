
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { Calendar, Clock, AlertCircle } from 'lucide-react';

const LeaveRequestsList = () => {
  const { user, getLeaveRequests } = useAuth();
  
  const leaves = user ? getLeaveRequests(user.id) : [];
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getLeaveTypeBadge = (type: string) => {
    switch (type) {
      case 'sick':
        return <Badge variant="outline" className="border-red-200 text-red-700">Sick</Badge>;
      case 'vacation':
        return <Badge variant="outline" className="border-blue-200 text-blue-700">Vacation</Badge>;
      case 'personal':
        return <Badge variant="outline" className="border-purple-200 text-purple-700">Personal</Badge>;
      case 'other':
        return <Badge variant="outline">Other</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" /> Leave Requests
        </CardTitle>
        <CardDescription>
          View the status of your leave requests
        </CardDescription>
      </CardHeader>
      <CardContent>
        {leaves.length === 0 ? (
          <div className="text-center py-8 border rounded">
            <Calendar className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No leave requests found</p>
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaves.map((leave) => (
                  <TableRow key={leave.id}>
                    <TableCell>{getLeaveTypeBadge(leave.type)}</TableCell>
                    <TableCell>
                      <div className="font-medium">{formatDate(leave.startDate)}</div>
                      <div className="text-xs text-muted-foreground">
                        to {formatDate(leave.endDate)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(leave.requestDate), { addSuffix: true })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {getStatusBadge(leave.status)}
                        
                        {leave.responseNote && (
                          <div className="flex items-start gap-1 mt-1">
                            <AlertCircle className="h-3 w-3 text-muted-foreground mt-0.5" />
                            <span className="text-xs text-muted-foreground">
                              {leave.responseNote}
                            </span>
                          </div>
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
  );
};

export default LeaveRequestsList;
