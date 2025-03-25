
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Award, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const BonusReports = () => {
  const { getEmployees, calculateBonusEligibility } = useAuth();
  const [period, setPeriod] = useState<'year' | 'all'>('year');
  
  const employees = getEmployees().filter(e => e.role === 'employee');
  
  // Get bonus data for each employee
  const employeesWithBonus = employees.map(employee => {
    const bonusInfo = calculateBonusEligibility(employee.id);
    return {
      ...employee,
      ...bonusInfo,
      bonusAmount: employee.hourlyRate 
        ? Math.round(employee.hourlyRate * 40 * 52 * (bonusInfo.bonusPercentage / 100)) 
        : 0,
    };
  });
  
  // Sort by eligibility and bonus percentage (higher first)
  employeesWithBonus.sort((a, b) => {
    if (a.eligible !== b.eligible) {
      return a.eligible ? -1 : 1;
    }
    return b.bonusPercentage - a.bonusPercentage;
  });
  
  const totalBonusAmount = employeesWithBonus.reduce(
    (total, employee) => total + (employee.eligible ? employee.bonusAmount : 0), 
    0
  );
  
  const eligibleCount = employeesWithBonus.filter(e => e.eligible).length;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" /> Bonus Eligibility Report
        </CardTitle>
        <CardDescription>
          Employees eligible for year-end bonuses based on leave usage
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-1">
            <div className="text-sm font-medium">Total Bonus Amount:</div>
            <div className="text-2xl font-bold">${totalBonusAmount.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">
              {eligibleCount} of {employees.length} employees eligible
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Select
              value={period}
              onValueChange={(value) => setPeriod(value as 'year' | 'all')}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="year">Current Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Job Type</TableHead>
                <TableHead>Leaves Used</TableHead>
                <TableHead>Eligibility</TableHead>
                <TableHead>Bonus %</TableHead>
                <TableHead className="text-right">Bonus Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employeesWithBonus.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell className="capitalize">{employee.jobType || 'staff'}</TableCell>
                  <TableCell>{employee.leavesUsed}</TableCell>
                  <TableCell>
                    {employee.eligible ? (
                      <Badge className="bg-green-100 text-green-800">Eligible</Badge>
                    ) : (
                      <Badge variant="outline">Not Eligible</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {employee.eligible ? `${employee.bonusPercentage}%` : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {employee.eligible
                      ? `$${employee.bonusAmount.toLocaleString()}`
                      : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="bg-muted/20 p-4 rounded-md mt-6">
          <h3 className="text-sm font-medium mb-2">Bonus Eligibility Criteria:</h3>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
            <li>Employees with 0 leaves: 7% bonus</li>
            <li>Employees with 1 leave: 6% bonus</li>
            <li>Employees with 2 leaves: 5% bonus</li>
            <li>Employees with 3 leaves: 4% bonus</li>
            <li>Employees with 4 leaves: 3% bonus</li>
            <li>Employees with 5 leaves: 2% bonus</li>
            <li>Employees with more than 5 leaves: Not eligible</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default BonusReports;
