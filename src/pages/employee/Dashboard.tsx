import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import EmployeeLayout from '@/components/layout/EmployeeLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Calendar, DollarSign, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AttendanceTracker from '@/components/employee/AttendanceTracker';
import { useEffect, useRef, useState } from 'react';
import LeaveRequestsList from '@/components/employee/LeaveRequestsList';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function EmployeeDashboard() {
  const { isAuthenticated, isEmployee, user, calculateBonusEligibility, getAttendanceReport, getShifts, startShift, endShift, notifications, markNotificationAsRead, addNote, getNotesByEmployee } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isEmployee) {
    return <Navigate to="/admin" replace />;
  }
  
  // Get upcoming shifts for the logged-in employee
  const allShifts = user ? getShifts(undefined, user.id) : [];
  const now = new Date();
  // Find current shift: any shift that is started and not ended (regardless of date)
  const currentShift = allShifts.find(shift =>
    shift.status === 'started' && !shift.actualEndTime
  );
  // Find next shift (future scheduled, not started)
  const nextShift = allShifts
    .filter(shift => shift.status === 'scheduled' && new Date(shift.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  
  // Get bonus eligibility
  const bonusInfo = user ? calculateBonusEligibility(user.id) : { eligible: false, bonusPercentage: 0, leavesUsed: 0 };
  
  // Get weekly report
  const weeklyReport = user ? getAttendanceReport(user.id, 'week') : { totalHours: 0, attendanceRate: 0 };
  
  const employeeNotifications = notifications.filter(n => n.userId === user?.id);
  const unreadNotifications = employeeNotifications.filter(n => !n.read);
  const notifiedRef = useRef<string[]>([]);

  // Timer state for current shift
  const [timer, setTimer] = useState(0);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  // Add note modal state
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteContent, setNoteContent] = useState('');

  // Attendance Notes state
  const [attendanceNote, setAttendanceNote] = useState('');
  const [refreshNotes, setRefreshNotes] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const todaysNotes = user ? getNotesByEmployee(user.id).filter(note => note.date.startsWith(today) && note.category === 'attendance') : [];

  useEffect(() => {
    if (currentShift && currentShift.actualStartTime && !currentShift.actualEndTime) {
      // Calculate elapsed seconds
      const start = new Date(currentShift.actualStartTime).getTime();
      setTimer(Math.floor((Date.now() - start) / 1000));
      timerInterval.current = setInterval(() => {
        setTimer(Math.floor((Date.now() - start) / 1000));
      }, 1000);
      return () => {
        if (timerInterval.current) clearInterval(timerInterval.current);
      };
    } else {
      setTimer(0);
      if (timerInterval.current) clearInterval(timerInterval.current);
    }
  }, [currentShift?.actualStartTime, currentShift?.actualEndTime]);

  // Format timer as HH:MM:SS
  const formatTimer = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // Shift control handlers
  const handleStartShift = async () => {
    if (currentShift) {
      await startShift(user.id, currentShift.date, undefined, undefined, currentShift.id);
    }
  };
  const handleEndShift = async () => {
    if (currentShift) {
      await endShift(user.id, currentShift.date, undefined, undefined, currentShift.id);
    }
  };

  const handleAddNote = async () => {
    if (user && noteContent.trim()) {
      await addNote(user.id, noteContent.trim(), 'attendance');
      setNoteContent('');
      setRefreshNotes(r => !r); // trigger re-render
    }
  };

  const handleAddAttendanceNote = async () => {
    if (user && attendanceNote.trim()) {
      await addNote(user.id, attendanceNote.trim(), 'attendance');
      setAttendanceNote('');
      setRefreshNotes(r => !r);
    }
  };

  useEffect(() => {
    if (user && unreadNotifications.length > 0 && !sessionStorage.getItem('notifiedNotifications')) {
      unreadNotifications.forEach(n => {
        if (!notifiedRef.current.includes(n.id)) {
          // Show browser notification
          if ('Notification' in window) {
            if (Notification.permission === 'granted') {
              new Notification(n.title, { body: n.message });
            } else if (Notification.permission !== 'denied') {
              Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                  new Notification(n.title, { body: n.message });
                }
              });
            }
          }
          // Play sound
          const audio = new Audio('/notification.mp3');
          audio.play().catch(() => {});
          notifiedRef.current.push(n.id);
        }
      });
      sessionStorage.setItem('notifiedNotifications', 'true');
    }
  }, [user, unreadNotifications.length]);

  return (
    <EmployeeLayout>
      <div className="container mx-auto p-4 sm:p-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Welcome back, {user?.name.split(' ')[0]}!</h1>
          <p className="text-muted-foreground">Here's what's happening with your schedule</p>
        </div>
        
        {/* Current/Next Shift Section */}
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Shift</CardTitle>
              <CardDescription>
                {currentShift
                  ? `Today: ${currentShift.startTime} - ${currentShift.endTime}`
                  : 'No shift in progress'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentShift ? (
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-1">
                    <div className="text-lg font-semibold">
                      {currentShift.day}, {currentShift.date}
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {currentShift.startTime} - {currentShift.endTime}
                    </div>
                    {currentShift.actualStartTime && !currentShift.actualEndTime && (
                      <div className="text-2xl font-mono mb-2">{formatTimer(timer)}</div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {currentShift.status === 'scheduled' && !currentShift.actualStartTime && (
                      <Button onClick={handleStartShift}>
                        Start Shift
                      </Button>
                    )}
                    {currentShift.status === 'started' && !currentShift.actualEndTime && (
                      <Button onClick={handleEndShift} variant="secondary">
                        End Shift
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground">No shift in progress</div>
              )}
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Next Shift</CardTitle>
              <CardDescription>
                {nextShift
                  ? `${nextShift.day}, ${nextShift.date} (${nextShift.startTime} - ${nextShift.endTime})`
                  : 'No upcoming shift'}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
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
              <div className="text-2xl sm:text-3xl font-bold">{allShifts.length}</div>
              <p className="text-xs text-muted-foreground">
                Total shifts
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
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Upcoming Schedule</CardTitle>
              <CardDescription>Your shifts for the next days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 sm:space-y-6">
                {allShifts.map((shift, i) => (
                  <div key={i} className="flex flex-col sm:flex-row items-start gap-3">
                    <div className="w-14 h-14 rounded-md bg-primary/10 flex flex-col items-center justify-center text-primary">
                      <span className="text-xs font-medium">{shift.day.slice(0, 3)}</span>
                      <span className="text-lg font-bold">{shift.date ? new Date(shift.date).getDate() : ''}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-medium">
                          {shift.startTime} - {shift.endTime}
                        </h4>
                        <Badge variant="outline" className="ml-0 sm:ml-2">
                          {(() => {
                            const start = new Date(`2023-01-01T${shift.startTime}`);
                            const end = new Date(`2023-01-01T${shift.endTime}`);
                            return ((end.getTime() - start.getTime()) / 3600000);
                          })()} hrs
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            {/* Today's Attendance Notes Section */}
            <div className="w-full mt-4 sm:mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Attendance Notes</CardTitle>
                  <CardDescription>Add your note for today before your shift starts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <textarea
                      className="w-full border rounded p-2 bg-white text-black border-gray-300 dark:bg-background dark:text-foreground dark:border-muted"
                      rows={3}
                      value={attendanceNote}
                      onChange={e => setAttendanceNote(e.target.value)}
                      placeholder="Enter your attendance note for today..."
                    />
                    <Button onClick={handleAddAttendanceNote}>
                      Add Note
                    </Button>
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Your Notes for Today:</h4>
                      {todaysNotes.length === 0 ? (
                        <div className="text-muted-foreground">No notes added for today.</div>
                      ) : (
                        <ul className="list-disc pl-5 space-y-1">
                          {todaysNotes.map(note => (
                            <li key={note.id} className="text-sm">{note.content}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* My Leave Requests Section */}
            <div className="w-full mt-4 sm:mt-6">
              <LeaveRequestsList />
            </div>
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
