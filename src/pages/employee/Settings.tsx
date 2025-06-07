import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import EmployeeLayout from '@/components/layout/EmployeeLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon, Bell, Lock, Eye, EyeOff, Phone, Mail, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/context/ThemeContext';
import { toast } from 'sonner';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel, 
  FormMessage
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUpload } from '@/components/ui/image-upload';

export default function EmployeeSettings() {
  const { isAuthenticated, isAdmin, user, updateProfileImage, getAttendanceReport, getShifts } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    shiftReminders: true,
    paymentAlerts: true,
    marketingEmails: false
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    
    // Simulate API call
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Updating password...',
        success: 'Password updated successfully',
        error: 'Failed to update password'
      }
    );
    
    // Reset form
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };
  
  const handleNotificationChange = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    toast.success(`${key} setting updated`);
  };
  
  const handleSaveSettings = () => {
    toast.success('Settings saved successfully');
  };
  
  const handleImageChange = async (imageData: string) => {
    if (!user) return;
    setIsUpdatingImage(true);
    try {
      await updateProfileImage(user.id, imageData);
      setProfileImage(imageData);
      toast.success('Profile image updated');
    } finally {
      setIsUpdatingImage(false);
    }
  };
  
  const handleDownloadData = () => {
    if (!user) return;
    const attendance = getAttendanceReport(user.id, 'all');
    const data = {
      profile: user,
      attendance,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my_employee_data.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data downloaded');
  };
  
  useEffect(() => {
    if (notificationSettings.shiftReminders && user) {
      // Get upcoming shifts for the user
      const allShifts = user ? getShifts(undefined, user.id) : [];
      const now = new Date();
      allShifts.forEach(shift => {
        if (shift.status === 'scheduled' && shift.date) {
          const shiftDateTime = new Date(`${shift.date}T${shift.startTime}`);
          const reminderTime = new Date(shiftDateTime.getTime() - 30 * 60000); // 30 min before
          if (reminderTime > now) {
            const timeout = reminderTime.getTime() - now.getTime();
            // Schedule browser notification
            if ('Notification' in window) {
              if (Notification.permission === 'granted') {
                setTimeout(() => {
                  new Notification('Shift Reminder', {
                    body: `You have a shift at ${shift.startTime} on ${shift.day}.`,
                  });
                }, timeout);
              } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                  if (permission === 'granted') {
                    setTimeout(() => {
                      new Notification('Shift Reminder', {
                        body: `You have a shift at ${shift.startTime} on ${shift.day}.`,
                      });
                    }, timeout);
                  }
                });
              }
            }
          }
        }
      });
    }
  }, [notificationSettings.shiftReminders, user]);
  
  return (
    <EmployeeLayout>
      <div className="container mx-auto p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <SettingsIcon className="h-6 w-6" />
              Settings
            </h1>
            <p className="text-muted-foreground mt-1">Manage your account preferences</p>
          </div>
          
          <Button onClick={handleSaveSettings} className="mt-4 sm:mt-0">
            Save Changes
          </Button>
        </div>
        
        <Tabs defaultValue="account">
          <div className="flex flex-col sm:flex-row gap-6">
            <TabsList className="sm:flex-col h-auto mb-6 sm:mb-0 sm:w-52 bg-transparent -mx-2 justify-start">
              <TabsTrigger value="account" className="w-full justify-start px-2">
                Account
              </TabsTrigger>
              <TabsTrigger value="notifications" className="w-full justify-start px-2">
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="w-full justify-start px-2">
                Security
              </TabsTrigger>
              <TabsTrigger value="appearance" className="w-full justify-start px-2">
                Appearance
              </TabsTrigger>
            </TabsList>
            
            <div className="flex-1">
              <TabsContent value="account" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>
                      Manage your basic account information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col items-center mb-6">
                      <ImageUpload value={profileImage} onImageChange={handleImageChange} avatarSize="xl" />
                      {isUpdatingImage && <span className="text-xs text-muted-foreground mt-2">Updating...</span>}
                    </div>
                    <Button onClick={handleDownloadData} className="mb-4" variant="outline">Download My Data</Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={user?.name} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue={user?.email} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" placeholder="Your phone number" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="jobType">Job Title</Label>
                        <Input id="jobType" defaultValue={user?.jobType} disabled />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Manage how you want to be notified
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="emailNotifications" className="font-medium">
                            Email Notifications
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications via email
                          </p>
                        </div>
                        <Switch 
                          id="emailNotifications" 
                          checked={notificationSettings.emailNotifications}
                          onCheckedChange={() => handleNotificationChange('emailNotifications')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="pushNotifications" className="font-medium">
                            Push Notifications
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Receive push notifications on your device
                          </p>
                        </div>
                        <Switch 
                          id="pushNotifications" 
                          checked={notificationSettings.pushNotifications}
                          onCheckedChange={() => handleNotificationChange('pushNotifications')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="shiftReminders" className="font-medium">
                            Shift Reminders
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Get notifications about upcoming shifts
                          </p>
                        </div>
                        <Switch 
                          id="shiftReminders" 
                          checked={notificationSettings.shiftReminders}
                          onCheckedChange={() => handleNotificationChange('shiftReminders')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="paymentAlerts" className="font-medium">
                            Payment Alerts
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications when you get paid
                          </p>
                        </div>
                        <Switch 
                          id="paymentAlerts" 
                          checked={notificationSettings.paymentAlerts}
                          onCheckedChange={() => handleNotificationChange('paymentAlerts')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="marketingEmails" className="font-medium">
                            Marketing Emails
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Receive occasional marketing emails
                          </p>
                        </div>
                        <Switch 
                          id="marketingEmails" 
                          checked={notificationSettings.marketingEmails}
                          onCheckedChange={() => handleNotificationChange('marketingEmails')}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your password and account security
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordChange} className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <div className="relative">
                            <Input 
                              id="currentPassword" 
                              type={showPassword ? "text" : "password"} 
                              value={passwordForm.currentPassword}
                              onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                              required
                            />
                            <Button 
                              type="button"
                              variant="ghost" 
                              size="icon"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input 
                            id="newPassword" 
                            type="password" 
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input 
                            id="confirmPassword" 
                            type="password" 
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      
                      <Button type="submit">Update Password</Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="appearance" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                      Customize how the application looks
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="darkMode" className="font-medium">
                          Dark Mode
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        </p>
                      </div>
                      <div 
                        className="flex items-center space-x-2 cursor-pointer"
                        onClick={toggleTheme}
                      >
                        {theme === 'dark' ? (
                          <Moon className="h-5 w-5 text-primary" />
                        ) : (
                          <Sun className="h-5 w-5 text-warning" />
                        )}
                        <Switch 
                          id="darkMode" 
                          checked={theme === 'dark'}
                          onCheckedChange={toggleTheme}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </EmployeeLayout>
  );
}
