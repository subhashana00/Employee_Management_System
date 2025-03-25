
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, Award, Check, Search, Filter, BarChart } from 'lucide-react';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { AttendanceReport } from '@/types/attendance';

const BonusManagement = () => {
  const { getEmployees, getBonusEligibleEmployees, calculateBonusAmount, applyBonus } = useAuth();
  const [employees, setEmployees] = useState<any[]>([]);
  const [eligibleEmployees, setEligibleEmployees] = useState<{ employeeId: string; report: AttendanceReport }[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdjustBonusOpen, setIsAdjustBonusOpen] = useState(false);
  const [currentEmployeeId, setCurrentEmployeeId] = useState('');
  const [bonusAmount, setBonusAmount] = useState(0);
  const [isBulkApplyOpen, setIsBulkApplyOpen] = useState(false);
  
  useEffect(() => {
    const allEmployees = getEmployees();
    setEmployees(allEmployees);
    
    // Load eligible employees
    loadEligibleEmployees();
  }, [selectedYear, selectedEmployee]);
  
  const loadEligibleEmployees = () => {
    const eligible = getBonusEligibleEmployees(
      parseInt(selectedYear), 
      selectedEmployee || undefined
    );
    setEligibleEmployees(eligible);
  };
  
  const getEmployeeName = (id: string) => {
    const employee = employees.find(e => e.id === id);
    return employee ? employee.name : 'Unknown';
  };
  
  const filteredEmployees = eligibleEmployees.filter(item => {
    const employeeName = getEmployeeName(item.employeeId).toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    return employeeName.includes(searchLower);
  });
  
  const handleOpenAdjustBonus = (employeeId: string) => {
    const employee = eligibleEmployees.find(e => e.employeeId === employeeId);
    if (employee) {
      setCurrentEmployeeId(employeeId);
      setBonusAmount(employee.report.bonusAmount || calculateBonusAmount(employee.report));
      setIsAdjustBonusOpen(true);
    }
  };
  
  const handleSaveBonus = async () => {
    const success = await applyBonus(currentEmployeeId, parseInt(selectedYear), bonusAmount);
    if (success) {
      toast.success('Bonus updated successfully');
      setIsAdjustBonusOpen(false);
      loadEligibleEmployees();
    } else {
      toast.error('Failed to update bonus');
    }
  };
  
  const handleApplyAllBonuses = async () => {
    for (const employee of eligibleEmployees) {
      const amount = employee.report.bonusAmount || calculateBonusAmount(employee.report);
      await applyBonus(employee.employeeId, parseInt(selectedYear), amount);
    }
    
    toast.success('All bonuses applied successfully');
    setIsBulkApplyOpen(false);
    loadEligibleEmployees();
  };
  
  const getBonusClassification = (report: AttendanceReport) => {
    if (report.leavesUsed === 0) {
      return 'Perfect Attendance';
    } else if (report.leavesUsed <= 3) {
      return 'Excellent Attendance';
    } else if (report.leavesUsed <= 5) {
      return 'Good Attendance';
    } else if (report.leavesUsed <= 7) {
      return 'Eligible';
    }
    return 'Not Eligible';
  };
  
  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());
  
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" /> Attendance Bonus Management
              </CardTitle>
              <CardDescription>
                Manage employee attendance-based bonuses
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  toast.success('Bonus report exported');
                }}
              >
                <BarChart className="mr-2 h-4 w-4" />
                Report
              </Button>
              <Button onClick={() => setIsBulkApplyOpen(true)}>
                <Check className="mr-2 h-4 w-4" />
                Apply All Bonuses
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Label className="text-sm font-medium mb-2 block">Year</Label>
              <Select
                value={selectedYear}
                onValueChange={setSelectedYear}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <Label className="text-sm font-medium mb-2 block">Filter By Employee</Label>
              <Select
                value={selectedEmployee}
                onValueChange={setSelectedEmployee}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All employees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Employees</SelectItem>
                  {employees.map(employee => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <Label className="text-sm font-medium mb-2 block">Search</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employee..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
          
          <div className="border rounded-md overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Classification</TableHead>
                  <TableHead>Attendance Rate</TableHead>
                  <TableHead>Leaves Used</TableHead>
                  <TableHead>Bonus Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No employees found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map(({ employeeId, report }) => (
                    <TableRow key={employeeId}>
                      <TableCell className="font-medium">{getEmployeeName(employeeId)}</TableCell>
                      <TableCell>
                        <Badge variant={
                          report.leavesUsed === 0 ? "success" :
                          report.leavesUsed <= 3 ? "default" :
                          "outline"
                        }>
                          {getBonusClassification(report)}
                        </Badge>
                      </TableCell>
                      <TableCell>{report.attendanceRate}%</TableCell>
                      <TableCell>{report.leavesUsed}</TableCell>
                      <TableCell>${report.bonusAmount || calculateBonusAmount(report)}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleOpenAdjustBonus(employeeId)}
                        >
                          <DollarSign className="h-3.5 w-3.5 mr-1" />
                          Adjust
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Adjust Bonus Dialog */}
      <Dialog open={isAdjustBonusOpen} onOpenChange={setIsAdjustBonusOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adjust Bonus Amount</DialogTitle>
            <DialogDescription>
              Update the bonus amount for {getEmployeeName(currentEmployeeId)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="bonusAmount">Bonus Amount ($)</Label>
              <Input
                id="bonusAmount"
                type="number"
                min="0"
                step="10"
                value={bonusAmount}
                onChange={(e) => setBonusAmount(Number(e.target.value))}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdjustBonusOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveBonus}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Bulk Apply Dialog */}
      <Dialog open={isBulkApplyOpen} onOpenChange={setIsBulkApplyOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Apply All Bonuses</DialogTitle>
            <DialogDescription>
              This will apply the calculated bonus amounts to all eligible employees.
            </DialogDescription>
          </DialogHeader>
          
          <div className="pt-4">
            <p className="text-center text-muted-foreground">
              Are you sure you want to apply bonuses for {filteredEmployees.length} employees?
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkApplyOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApplyAllBonuses}>
              Apply All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BonusManagement;
