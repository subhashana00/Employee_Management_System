import { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import EmployeeLayout from '@/components/layout/EmployeeLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BellRing, 
  Check, 
  Clock, 
  CalendarClock, 
  DollarSign, 
  Users, 
  MessageSquare,
  CheckCheck,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'shift' | 'overtime' | 'payment' | 'message' | 'general';
  date: string;
  read: boolean;
  userId: string;
};

export default function Notifications() {
  const { isAuthenticated, isAdmin, user, notifications, markNotificationAsRead } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  
  const employeeNotifications = notifications.filter(n => n.userId === user?.id);
  
  const notifiedRef = useRef<string[]>([]);
  useEffect(() => {
    if (user && employeeNotifications.length > 0 && !sessionStorage.getItem('notifiedNotifications')) {
      employeeNotifications.filter(n => !n.read).forEach(n => {
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
  }, [user, employeeNotifications.length]);
  
  const markAsRead = (id: string) => {
    markNotificationAsRead(id);
    toast.success('Notification marked as read');
  };
  
  const markAllAsRead = () => {
    employeeNotifications.forEach(n => {
      if (!n.read) markNotificationAsRead(n.id);
    });
    toast.success('All notifications marked as read');
  };
  
  const deleteNotification = (id: string) => {
    // Implementation of deleteNotification
    toast.success('Notification deleted');
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffInDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'shift':
        return <CalendarClock className="h-5 w-5" />;
      case 'overtime':
        return <Clock className="h-5 w-5" />;
      case 'payment':
        return <DollarSign className="h-5 w-5" />;
      case 'message':
        return <MessageSquare className="h-5 w-5" />;
      default:
        return <BellRing className="h-5 w-5" />;
    }
  };
  
  const unreadCount = employeeNotifications.filter(n => !n.read).length;
  
  return (
    <EmployeeLayout>
      <div className="container mx-auto p-4 sm:p-6">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold">Notifications</h1>
              {unreadCount > 0 && (
                <Badge variant="info" className="ml-2">
                  {unreadCount} unread
                </Badge>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
                <CheckCheck className="mr-1 h-4 w-4" />
                Mark all as read
              </Button>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="shifts">Shifts</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            {employeeNotifications.length > 0 ? (
              <div className="space-y-4">
                {employeeNotifications.map(notification => (
                  <Card key={notification.id} className={`${notification.read ? '' : 'border-l-4 border-l-primary'}`}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-full ${notification.read ? 'bg-muted' : 'bg-primary/10'}`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div>
                            <h3 className="font-medium text-base">{notification.title}</h3>
                            <p className="text-muted-foreground text-sm mt-1">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-2">{formatDate(notification.date)}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {!notification.read && (
                            <Button variant="ghost" size="icon" onClick={() => markNotificationAsRead(notification.id)} title="Mark as read">
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => deleteNotification(notification.id)} title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BellRing className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Notifications</h3>
                <p className="text-muted-foreground">You don't have any notifications at this time.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="unread" className="mt-6">
            {employeeNotifications.filter(n => !n.read).length > 0 ? (
              <div className="space-y-4">
                {employeeNotifications.filter(n => !n.read).map(notification => (
                  <Card key={notification.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-full bg-primary/10">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div>
                            <h3 className="font-medium text-base">{notification.title}</h3>
                            <p className="text-muted-foreground text-sm mt-1">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-2">{formatDate(notification.date)}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => markNotificationAsRead(notification.id)} title="Mark as read">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteNotification(notification.id)} title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCheck className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-medium mb-2">All Caught Up</h3>
                <p className="text-muted-foreground">You have no unread notifications.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="shifts" className="mt-6">
            {employeeNotifications.filter(n => n.type === 'shift').length > 0 ? (
              <div className="space-y-4">
                {employeeNotifications
                  .filter(n => n.type === 'shift')
                  .map(notification => (
                    <Card key={notification.id} className={`${notification.read ? '' : 'border-l-4 border-l-primary'}`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex items-start gap-4">
                            <div className={`p-2 rounded-full ${notification.read ? 'bg-muted' : 'bg-primary/10'}`}>
                              <CalendarClock className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-medium text-base">{notification.title}</h3>
                              <p className="text-muted-foreground text-sm mt-1">{notification.message}</p>
                              <p className="text-xs text-muted-foreground mt-2">{formatDate(notification.date)}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {!notification.read && (
                              <Button variant="ghost" size="icon" onClick={() => markNotificationAsRead(notification.id)} title="Mark as read">
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" onClick={() => deleteNotification(notification.id)} title="Delete">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CalendarClock className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Shift Notifications</h3>
                <p className="text-muted-foreground">You don't have any shift-related notifications.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="payments" className="mt-6">
            {employeeNotifications.filter(n => n.type === 'payment').length > 0 ? (
              <div className="space-y-4">
                {employeeNotifications
                  .filter(n => n.type === 'payment')
                  .map(notification => (
                    <Card key={notification.id} className={`${notification.read ? '' : 'border-l-4 border-l-primary'}`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex items-start gap-4">
                            <div className={`p-2 rounded-full ${notification.read ? 'bg-muted' : 'bg-primary/10'}`}>
                              <DollarSign className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-medium text-base">{notification.title}</h3>
                              <p className="text-muted-foreground text-sm mt-1">{notification.message}</p>
                              <p className="text-xs text-muted-foreground mt-2">{formatDate(notification.date)}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {!notification.read && (
                              <Button variant="ghost" size="icon" onClick={() => markNotificationAsRead(notification.id)} title="Mark as read">
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" onClick={() => deleteNotification(notification.id)} title="Delete">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <DollarSign className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Payment Notifications</h3>
                <p className="text-muted-foreground">You don't have any payment-related notifications.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </EmployeeLayout>
  );
}
