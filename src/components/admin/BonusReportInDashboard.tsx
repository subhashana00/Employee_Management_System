
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Award, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BonusReportInDashboard = () => {
  const { getEmployees, calculateBonusEligibility } = useAuth();
  
  const employees = getEmployees().filter(emp => emp.role === 'employee');
  
  // Calculate eligibility stats
  const employeesWithBonus = employees.map(employee => {
    const bonusInfo = calculateBonusEligibility(employee.id);
    return {
      ...employee,
      ...bonusInfo
    };
  });
  
  const eligibleCount = employeesWithBonus.filter(e => e.eligible).length;
  const highBonusCount = employeesWithBonus.filter(e => e.bonusPercentage >= 5).length;
  const notEligibleCount = employeesWithBonus.filter(e => !e.eligible).length;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" /> Bonus Eligibility
        </CardTitle>
        <CardDescription>
          Annual bonus eligibility based on leave usage
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <div className="flex flex-col items-center justify-center p-4 bg-secondary/20 rounded-md">
            <div className="text-2xl sm:text-3xl font-bold">{eligibleCount}</div>
            <div className="text-sm text-muted-foreground text-center mt-1">Eligible Employees</div>
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 bg-green-100 rounded-md">
            <div className="text-2xl sm:text-3xl font-bold text-green-700">{highBonusCount}</div>
            <div className="text-sm text-green-700/70 text-center mt-1">High Bonus (5%+)</div>
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 bg-yellow-100 rounded-md">
            <div className="text-2xl sm:text-3xl font-bold text-yellow-700">{notEligibleCount}</div>
            <div className="text-sm text-yellow-700/70 text-center mt-1">Not Eligible</div>
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Bonus criteria</p>
              <p className="text-sm text-muted-foreground">
                Employees with fewer than 5 leaves this year are eligible for a bonus ranging from 2% to 7%.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Leave policy reminder</p>
              <p className="text-sm text-muted-foreground">
                All employees are encouraged to use their leave responsibly and plan ahead for time off.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <a href="/admin/attendance">
            Manage Attendance & Leaves
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BonusReportInDashboard;
