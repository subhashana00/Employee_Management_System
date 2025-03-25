
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon, User, Lock, Eye, EyeOff, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/context/ThemeContext';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/ui/image-upload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminSettings() {
  const { isAuthenticated, isAdmin, user, updateUserProfile } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState(user?.photoURL || '');
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/employee" replace />;
  }
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm({
      ...profileForm,
      [e.target.id]: e.target.value
    });
  };
  
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsUpdating(true);
    
    // Simulate API call
    toast.promise(
      new Promise<void>((resolve) => {
        setTimeout(() => {
          // In a real app, you would call updateUserProfile here
          // updateUserProfile({ ...profileForm, photoURL: avatar });
          resolve();
        }, 1000);
      }),
      {
        loading: 'Updating profile...',
        success: () => {
          setIsUpdating(false);
          return 'Profile updated successfully';
        },
        error: () => {
          setIsUpdating(false);
          return 'Failed to update profile';
        }
      }
    );
  };
  
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
    
    setIsUpdating(true);
    
    // Simulate API call
    toast.promise(
      new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      }),
      {
        loading: 'Updating password...',
        success: () => {
          setPasswordForm({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
          setIsUpdating(false);
          return 'Password updated successfully';
        },
        error: () => {
          setIsUpdating(false);
          return 'Failed to update password';
        }
      }
    );
  };
  
  const handlePasswordFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.id]: e.target.value
    });
  };
  
  return (
    <AdminLayout>
      <div className="container mx-auto p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <SettingsIcon className="h-6 w-6" />
              Admin Settings
            </h1>
            <p className="text-muted-foreground mt-1">Manage your administrator account</p>
          </div>
        </div>
        
        <Tabs defaultValue="profile">
          <div className="flex flex-col sm:flex-row gap-6">
            <TabsList className="sm:flex-col h-auto mb-6 sm:mb-0 sm:w-52 bg-transparent -mx-2 justify-start">
              <TabsTrigger value="profile" className="w-full justify-start px-2">
                Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="w-full justify-start px-2">
                Security
              </TabsTrigger>
            </TabsList>
            
            <div className="flex-1">
              <TabsContent value="profile" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your account information and profile picture
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                      <div className="flex justify-center mb-4">
                        <ImageUpload 
                          value={avatar} 
                          onImageChange={setAvatar} 
                          avatarSize="xl"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            placeholder="Your name" 
                            value={profileForm.name}
                            onChange={handleProfileChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="Your email address" 
                            value={profileForm.email}
                            onChange={handleProfileChange}
                          />
                        </div>
                      </div>
                      
                      <Button type="submit" disabled={isUpdating}>
                        Save Changes
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                      Update your password to keep your account secure
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
                              onChange={handlePasswordFormChange}
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
                            onChange={handlePasswordFormChange}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input 
                            id="confirmPassword" 
                            type="password" 
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordFormChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <Button type="submit" disabled={isUpdating}>
                        Update Password
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
