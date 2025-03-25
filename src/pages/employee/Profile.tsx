import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import EmployeeLayout from '@/components/layout/EmployeeLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, Save, User, Mail, Briefcase, DollarSign } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/ui/image-upload';

export default function EmployeeProfile() {
  const { isAuthenticated, isEmployee, user, updateEmployee, updateProfileImage } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);
  
  // Form states
  const [name, setName] = useState('');
  const [jobType, setJobType] = useState('');
  const [profileImage, setProfileImage] = useState('');
  
  useEffect(() => {
    if (user) {
      setName(user.name);
      setJobType(user.jobType || '');
      setProfileImage(user.profileImage || '');
    }
  }, [user]);
  
  const handleSave = async () => {
    setIsSubmitting(true);
    
    try {
      if (!user) return;
      
      const success = await updateEmployee(user.id, {
        name,
        jobType,
      });
      
      if (success) {
        setIsEditing(false);
        toast.success('Profile updated successfully');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = async (imageData: string) => {
    if (!user) return;
    
    setIsUpdatingImage(true);
    try {
      await updateProfileImage(user.id, imageData);
    } finally {
      setIsUpdatingImage(false);
    }
  };
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isEmployee) {
    return <Navigate to="/admin" replace />;
  }
  
  return (
    <EmployeeLayout>
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">My Profile</CardTitle>
                <CardDescription>View and update your personal information</CardDescription>
              </div>
              <Button 
                variant={isEditing ? "default" : "outline"}
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                disabled={isSubmitting}
              >
                {isEditing ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </>
                ) : (
                  <>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">Basic Information</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your full name"
                        />
                      ) : (
                        <div className="p-2 border rounded-md bg-muted/30">{user?.name}</div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="p-2 border rounded-md bg-muted/30 flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        {user?.email}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    <span className="text-sm font-medium">Job Information</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="jobType">Job Type</Label>
                        <div className="p-2 border rounded-md bg-muted/30 capitalize flex items-center">
                          <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                          {user?.jobType}
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate">Hourly Rate</Label>
                      <div className="p-2 border rounded-md bg-muted/30 flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                        ${user?.hourlyRate}/hour
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-1/3 flex flex-col items-center justify-start p-6 bg-accent/20 rounded-lg">
                <div className="mb-4 flex flex-col items-center">
                  <ImageUpload 
                    value={profileImage} 
                    onImageChange={handleImageChange}
                    avatarSize="xl"
                  />
                  {isUpdatingImage && (
                    <p className="text-xs text-muted-foreground mt-2">Updating...</p>
                  )}
                </div>
                <h3 className="text-xl font-medium mb-1">{user?.name}</h3>
                <p className="text-muted-foreground mb-3">{user?.email}</p>
                <Badge className="mb-4 capitalize">{user?.jobType}</Badge>
                <div className="w-full mt-auto">
                  <div className="border-t border-border pt-4 mt-4 w-full">
                    <div className="text-sm flex justify-between">
                      <span className="text-muted-foreground">Employee ID:</span>
                      <span className="font-mono">{user?.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t flex justify-between">
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            {isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </EmployeeLayout>
  );
}
