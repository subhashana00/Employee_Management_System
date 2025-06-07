import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  Plus, Pencil, Trash2, Search, AlertCircle, 
  Save, X, EyeOff, Eye, ArrowLeft, User
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AdminLayout from '@/components/layout/AdminLayout';
import { ImageUpload } from '@/components/ui/image-upload';

export default function EmployeeList() {
  const { isAuthenticated, isAdmin, getEmployees, addEmployee, updateEmployee, deleteEmployee, updateProfileImage } = useAuth();
  const [employees, setEmployees] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [currentEmployee, setCurrentEmployee] = useState<any>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [jobType, setJobType] = useState('waiter');
  const [hourlyRate, setHourlyRate] = useState('15');

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      loadEmployees();
    }
  }, [isAuthenticated, isAdmin]);

  const loadEmployees = () => {
    const allEmployees = getEmployees();
    setEmployees(allEmployees);
  };

  const filteredEmployees = employees.filter(employee => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      employee.name.toLowerCase().includes(searchTermLower) ||
      employee.email.toLowerCase().includes(searchTermLower) ||
      employee.jobType.toLowerCase().includes(searchTermLower)
    );
  });

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const success = await addEmployee({
        name,
        email,
        password,
        role: 'employee',
        jobType,
        hourlyRate: parseFloat(hourlyRate)
      });

      if (success) {
        setIsAddDialogOpen(false);
        resetForm();
        loadEmployees();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!currentEmployee) return;

      const success = await updateEmployee(currentEmployee.id, {
        name,
        email,
        jobType,
        hourlyRate: parseFloat(hourlyRate)
      });

      if (success) {
        setIsEditDialogOpen(false);
        resetForm();
        loadEmployees();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEmployee = async () => {
    setIsSubmitting(true);

    try {
      if (!currentEmployee) return;

      const success = await deleteEmployee(currentEmployee.id);

      if (success) {
        setIsDeleteDialogOpen(false);
        loadEmployees();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProfileImage = async () => {
    if (!currentEmployee) return;

    setIsUpdatingImage(true);
    try {
      await updateProfileImage(currentEmployee.id, profileImage);
      setIsImageDialogOpen(false);
      loadEmployees();
    } finally {
      setIsUpdatingImage(false);
    }
  };

  const prepareForEdit = (employee: any) => {
    setCurrentEmployee(employee);
    setName(employee.name);
    setEmail(employee.email);
    setJobType(employee.jobType);
    setHourlyRate(employee.hourlyRate.toString());
    setIsEditDialogOpen(true);
  };

  const prepareForImageEdit = (employee: any) => {
    setCurrentEmployee(employee);
    setProfileImage(employee.profileImage || '');
    setIsImageDialogOpen(true);
  };

  const prepareForDelete = (employee: any) => {
    setCurrentEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setJobType('waiter');
    setHourlyRate('15');
    setCurrentEmployee(null);
    setShowPassword(false);
    setProfileImage('');
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/employee" replace />;
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <a href="/admin">
                <ArrowLeft className="h-4 w-4" />
              </a>
            </Button>
            <h1 className="text-3xl font-bold">Employee Management</h1>
          </div>
          <Button onClick={() => {
            resetForm();
            setIsAddDialogOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Employees</CardTitle>
            <CardDescription>View, add, edit and remove employees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {employees.length === 0 ? (
              <div className="text-center py-12 border rounded-md bg-accent/10">
                <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No employees found. Add your first employee to get started.</p>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="text-center py-12 border rounded-md bg-accent/10">
                <Search className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No employees match your search criteria.</p>
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">Image</TableHead>
                      <TableHead className="w-[180px]">Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Job Type</TableHead>
                      <TableHead className="text-right">Hourly Rate</TableHead>
                      <TableHead className="w-[150px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <Avatar className="h-10 w-10 cursor-pointer hover:opacity-80" onClick={() => prepareForImageEdit(employee)}>
                            <AvatarImage src={employee.profileImage} />
                            <AvatarFallback className="bg-primary/10 text-xs">
                              {employee.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell className="capitalize">{employee.jobType}</TableCell>
                        <TableCell className="text-right">${employee.hourlyRate.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => prepareForImageEdit(employee)}
                              title="Update photo"
                            >
                              <User className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => prepareForEdit(employee)}
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => prepareForDelete(employee)}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
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
          <CardFooter className="border-t px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredEmployees.length} of {employees.length} employees
            </p>
          </CardFooter>
        </Card>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Create a new employee account. The employee will be able to log in using their email and password.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddEmployee}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john.doe@example.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="flex items-center">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="mr-2"
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => setShowPassword(p => !p)}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="jobType">Job Type</Label>
                  <Select value={jobType} onValueChange={setJobType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="waiter">Waiter</SelectItem>
                      <SelectItem value="chef">Chef</SelectItem>
                      <SelectItem value="bartender">Bartender</SelectItem>
                      <SelectItem value="host">Host</SelectItem>
                      <SelectItem value="busser">Busser</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    min="10"
                    max="50"
                    step="0.5"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Adding...' : 'Add Employee'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Employee</DialogTitle>
              <DialogDescription>
                Update employee information.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateEmployee}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email Address</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-jobType">Job Type</Label>
                  <Select value={jobType} onValueChange={setJobType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="waiter">Waiter</SelectItem>
                      <SelectItem value="chef">Chef</SelectItem>
                      <SelectItem value="bartender">Bartender</SelectItem>
                      <SelectItem value="host">Host</SelectItem>
                      <SelectItem value="busser">Busser</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-hourlyRate">Hourly Rate ($)</Label>
                  <Input
                    id="edit-hourlyRate"
                    type="number"
                    min="10"
                    max="50"
                    step="0.5"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating...' : 'Update Employee'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {currentEmployee?.name}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteEmployee}
                disabled={isSubmitting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Update Profile Image</DialogTitle>
              <DialogDescription>
                Upload a new profile image for {currentEmployee?.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid place-items-center py-6">
              <ImageUpload 
                value={profileImage}
                onImageChange={setProfileImage}
                avatarSize="xl"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsImageDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateProfileImage}
                disabled={isUpdatingImage}
              >
                {isUpdatingImage ? 'Updating...' : 'Update Image'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
