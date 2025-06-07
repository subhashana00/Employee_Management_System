import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, DollarSign, ArrowUpDown, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function SalaryManagement() {
  const { isAuthenticated, isAdmin, getEmployees } = useAuth();
  const [employees, setEmployees] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      const allEmployees = getEmployees();
      setEmployees(allEmployees);
    }
  }, [isAuthenticated, isAdmin, getEmployees]);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/employee" replace />;
  }
  
  const filteredEmployees = employees.filter(employee => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      employee.name.toLowerCase().includes(searchTermLower) ||
      employee.email.toLowerCase().includes(searchTermLower) ||
      (employee.jobType && employee.jobType.toLowerCase().includes(searchTermLower))
    );
  });
  
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (sortBy === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'jobType') {
      const aJobType = a.jobType || '';
      const bJobType = b.jobType || '';
      return sortDirection === 'asc'
        ? aJobType.localeCompare(bJobType)
        : bJobType.localeCompare(aJobType);
    } else if (sortBy === 'hourlyRate') {
      return sortDirection === 'asc'
        ? a.hourlyRate - b.hourlyRate
        : b.hourlyRate - a.hourlyRate;
    }
    return 0;
  });
  
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };
  
  const calculateMonthlySalary = (hourlyRate: number) => {
    // Assuming 40 hours per week, 4 weeks per month
    return (hourlyRate * 40 * 4).toFixed(2);
  };

  const handleExportSalaryData = () => {
    const headers = ["Name", "Email", "Job Type", "Hourly Rate", "Monthly Salary", "YTD Earnings"];
    const rows = sortedEmployees.map(employee => [
      employee.name,
      employee.email,
      employee.jobType,
      employee.hourlyRate.toFixed(2),
      calculateMonthlySalary(employee.hourlyRate),
      (parseFloat(calculateMonthlySalary(employee.hourlyRate)) * (Math.floor(Math.random() * 6) + 1)).toFixed(2) // Mock YTD
    ]);

    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'salary_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Salary data exported successfully!');
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <a href="/admin">
                <ArrowLeft className="h-4 w-4" />
              </a>
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold">Salary Management</h1>
          </div>
          <Button className="w-full sm:w-auto" onClick={handleExportSalaryData}>
            <Download className="mr-2 h-4 w-4" />
            Export Salary Data
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Employee Salaries
                </CardTitle>
                <CardDescription>
                  Manage and view employee salary information
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            
            <div className="border rounded-md overflow-hidden overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="w-[180px] cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-1">
                        Name
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hidden sm:table-cell"
                      onClick={() => handleSort('jobType')}
                    >
                      <div className="flex items-center gap-1">
                        Job Type
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-right cursor-pointer"
                      onClick={() => handleSort('hourlyRate')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        Hourly Rate
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right hidden sm:table-cell">Monthly Salary</TableHead>
                    <TableHead className="text-right">YTD Earnings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell className="capitalize hidden sm:table-cell">{employee.jobType}</TableCell>
                      <TableCell className="text-right">${employee.hourlyRate.toFixed(2)}</TableCell>
                      <TableCell className="text-right hidden sm:table-cell">${calculateMonthlySalary(employee.hourlyRate)}</TableCell>
                      <TableCell className="text-right">
                        ${(parseFloat(calculateMonthlySalary(employee.hourlyRate)) * (Math.floor(Math.random() * 6) + 1)).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
