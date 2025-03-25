import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, AlertCircle, ClockIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Attendance } from '@/types/attendance';

const AttendanceTracker = () => {
  const { user, getAttendance, startShift, endShift, getCurrentShift } = useAuth();
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [currentShift, setCurrentShift] = useState<any>(null);
  const [notes, setNotes] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [isLate, setIsLate] = useState(false);
  const [lateMinutes, setLateMinutes] = useState(0);
  
  useEffect(() => {
    if (user) {
      const today = new Date().toISOString().split('T')[0];
      
      // Get current shift for today
      const shift = getCurrentShift(user.id, today);
      setCurrentShift(shift);
      
      const currentAttendance = getAttendance(user.id, today);
      setAttendance(currentAttendance);
      
      // If shift already started, calculate elapsed time and start timer
      if (currentAttendance?.status === 'started' && currentAttendance?.startTime) {
        const [hours, minutes] = currentAttendance.startTime.split(':').map(Number);
        const startTimeDate = new Date();
        startTimeDate.setHours(hours, minutes, 0, 0);
        
        const elapsedMilliseconds = Date.now() - startTimeDate.getTime();
        setElapsedTime(Math.floor(elapsedMilliseconds / 1000));
        setTimerActive(true);
      }
      
      // Check if employee is late
      if (shift && !currentAttendance) {
        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        
        const [shiftHours, shiftMinutes] = shift.startTime.split(':').map(Number);
        const shiftStartDate = new Date();
        shiftStartDate.setHours(shiftHours, shiftMinutes, 0, 0);
        
        if (now > shiftStartDate) {
          setIsLate(true);
          const diffMs = now.getTime() - shiftStartDate.getTime();
          setLateMinutes(Math.floor(diffMs / 60000)); // Convert ms to minutes
        }
      }
    }
  }, [user, getAttendance, getCurrentShift]);
  
  useEffect(() => {
    let interval: number | null = null;
    
    if (timerActive) {
      interval = window.setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive]);
  
  const handleStartShift = async () => {
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate if late
    let lateInfo = undefined;
    if (isLate) {
      lateInfo = {
        isLate: true,
        lateMinutes: lateMinutes
      };
    }
    
    const success = await startShift(
      user.id, 
      today,
      notes,
      lateInfo,
      currentShift?.id
    );
    
    if (success) {
      const updatedAttendance = getAttendance(user.id, today);
      setAttendance(updatedAttendance);
      setTimerActive(true);
      setElapsedTime(0);
      setNotes('');
      toast('Shift started successfully', {
        description: `Time: ${new Date().toLocaleTimeString()}`,
      });
    }
  };
  
  const handleEndShift = async () => {
    if (!user) return;
    
    if (!confirm('Are you sure you want to end your shift?')) {
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate overtime if applicable
    let overtime = 0;
    if (currentShift) {
      const [endHours, endMinutes] = currentShift.endTime.split(':').map(Number);
      const shiftEndDate = new Date();
      shiftEndDate.setHours(endHours, endMinutes, 0, 0);
      
      const now = new Date();
      if (now > shiftEndDate) {
        const diffMs = now.getTime() - shiftEndDate.getTime();
        overtime = Math.floor(diffMs / 60000); // Convert ms to minutes
      }
    }
    
    const success = await endShift(user.id, today, notes, overtime);
    
    if (success) {
      const updatedAttendance = getAttendance(user.id, today);
      setAttendance(updatedAttendance);
      setTimerActive(false);
      setNotes('');
      toast('Shift ended successfully', {
        description: `Time: ${new Date().toLocaleTimeString()}`,
      });
    }
  };
  
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };
  
  const getStatusBadge = () => {
    if (!attendance) {
      return <Badge variant="outline">Not Started</Badge>;
    }
    
    switch (attendance.status) {
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'started':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'absent':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Absent</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" /> Today's Attendance
        </CardTitle>
        <CardDescription>
          Track your work hours for today
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Status:</p>
              {getStatusBadge()}
            </div>
            <div>
              <p className="text-sm font-medium">Date:</p>
              <p className="text-sm">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
          
          {currentShift && (
            <div className="p-3 bg-secondary/10 rounded-md">
              <p className="text-sm font-medium mb-1">Today's Scheduled Shift:</p>
              <div className="flex justify-between items-center">
                <p className="text-sm">
                  <span className="font-medium">Time:</span> {currentShift.startTime} - {currentShift.endTime}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Type:</span> {currentShift.type}
                </p>
              </div>
            </div>
          )}
          
          {isLate && !attendance && (
            <div className="p-3 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">
                You are {lateMinutes} minutes late for your shift. Your lateness will be recorded.
              </p>
            </div>
          )}
          
          {attendance?.status === 'started' && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Elapsed Time:</p>
              <div className="text-3xl font-mono font-bold text-center py-3 bg-secondary/10 rounded-md">
                {formatTime(elapsedTime)}
              </div>
              <div className="mt-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <p className="text-xs text-muted-foreground">
                  Started at {attendance.startTime}
                </p>
                {attendance.isLate && (
                  <Badge variant="outline" className="text-red-600 border-red-200">
                    <ClockIcon className="mr-1 h-3 w-3" />
                    Late by {attendance.lateMinutes} minutes
                  </Badge>
                )}
              </div>
            </div>
          )}
          
          {attendance?.status === 'completed' && (
            <div className="mt-4 space-y-2 p-3 bg-secondary/10 rounded-md">
              <div className="flex justify-between">
                <p className="text-sm font-medium">Start Time:</p>
                <p className="text-sm">{attendance.startTime}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm font-medium">End Time:</p>
                <p className="text-sm">{attendance.endTime}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm font-medium">Total Duration:</p>
                <p className="text-sm">
                  {Math.floor(attendance.duration / 60)}h {attendance.duration % 60}m
                </p>
              </div>
              {attendance.overtime > 0 && (
                <div className="flex justify-between">
                  <p className="text-sm font-medium">Overtime:</p>
                  <p className="text-sm">
                    {Math.floor(attendance.overtime / 60)}h {attendance.overtime % 60}m
                  </p>
                </div>
              )}
              {attendance.isLate && (
                <div className="flex justify-between">
                  <p className="text-sm font-medium">Late By:</p>
                  <p className="text-sm">{attendance.lateMinutes} minutes</p>
                </div>
              )}
            </div>
          )}
          
          {(!attendance || attendance.status === 'pending' || attendance.status === 'started') && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Notes (optional):</p>
              <Textarea 
                placeholder="Add any notes about your shift..." 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-24"
              />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {(!attendance || attendance.status === 'pending') && (
          <Button onClick={handleStartShift} className="w-full">
            <CheckCircle className="mr-2 h-4 w-4" />
            Start Shift
          </Button>
        )}
        
        {attendance?.status === 'started' && (
          <Button onClick={handleEndShift} variant="secondary" className="w-full">
            <XCircle className="mr-2 h-4 w-4" />
            End Shift
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AttendanceTracker;
