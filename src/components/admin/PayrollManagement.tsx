import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, FileText, Download, CheckCircle, Clock, Filter } from 'lucide-react';
import { format, subMonths } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { PayrollItem } from '@/types/attendance';

const PayrollManagement = () => {
  const { getEmployees, getAttendancesByEmployee, getPayroll, generatePayroll, processPayroll, payPayroll } = useAuth();
  const [employees, setEmployees] = useState<any[]>([]);
  const [payrollItems, setPayrollItems] = useState<PayrollItem[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [isGeneratingPayroll, setIsGeneratingPayroll] = useState(false);
  const [isPayrollDetailOpen, setIsPayrollDetailOpen] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  useEffect(() => {
    const allEmployees = getEmployees();
    setEmployees(allEmployees);
    
    // Load payroll data
    loadPayrollData();
  }, [selectedMonth, statusFilter]);
  
  const loadPayrollData = () => {
    // Fix: Call getPayroll with one argument that combines month and filter
    const items = getPayroll(selectedMonth);
    setPayrollItems(items);
  };
  
  const getEmployeeName = (id: string) => {
    const employee = employees.find(e => e.id === id);
    return employee ? employee.name : 'Unknown';
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'processed':
        return <Badge className="bg-yellow-100 text-yellow-800">Processed</Badge>;
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const handleGeneratePayroll = async () => {
    setIsGeneratingPayroll(true);
    
    try {
      // Extract year and month from selectedMonth
      const [year, month] = selectedMonth.split('-').map(Number);
      
      // Calculate period dates
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0); // Last day of the month
      
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');
      
      // Fix: generatePayroll should only receive one parameter with the formatted date
      const success = await generatePayroll(formattedStartDate);
      
      if (success) {
        toast.success('Payroll generated successfully');
        loadPayrollData();
      } else {
        toast.error('Failed to generate payroll');
      }
    } catch (error) {
      toast.error('Error generating payroll');
      console.error(error);
    } finally {
      setIsGeneratingPayroll(false);
    }
  };
  
  const handleProcessPayroll = async (payrollId: string) => {
    const success = await processPayroll(payrollId);
    if (success) {
      toast.success('Payroll processed successfully');
      loadPayrollData();
    }
  };
  
  const handlePayPayroll = async (payrollId: string) => {
    const success = await payPayroll(payrollId);
    if (success) {
      toast.success('Payroll marked as paid');
      loadPayrollData();
    }
  };
  
  const handleViewDetails = (payroll: PayrollItem) => {
    setSelectedPayroll(payroll);
    setIsPayrollDetailOpen(true);
  };
  
  const handleExportPayroll = () => {
    toast.success('Payroll data exported');
  };
  
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" /> Payroll Management
              </CardTitle>
              <CardDescription>
                Manage employee payroll and process payments
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportPayroll}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button 
                onClick={handleGeneratePayroll} 
                disabled={isGeneratingPayroll}
              >
                {isGeneratingPayroll ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Payroll
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Label className="text-sm font-medium mb-2 block">Pay Period</Label>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <Input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex-1">
              <Label className="text-sm font-medium mb-2 block">Filter By Status</Label>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="processed">Processed</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {payrollItems.length === 0 ? (
            <div className="text-center py-12 border rounded-md bg-accent/10">
              <DollarSign className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No payroll data for this period</p>
              <Button 
                className="mt-4" 
                onClick={handleGeneratePayroll}
                disabled={isGeneratingPayroll}
              >
                {isGeneratingPayroll ? 'Generating...' : 'Generate Payroll'}
              </Button>
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Regular Hours</TableHead>
                    <TableHead>OT Hours</TableHead>
                    <TableHead>Total Pay</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollItems.map((payroll) => (
                    <TableRow key={payroll.id}>
                      <TableCell className="font-medium">
                        {getEmployeeName(payroll.employeeId)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(payroll.periodStart), 'MMM d')} - {format(new Date(payroll.periodEnd), 'MMM d, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell>{payroll.regularHours.toFixed(1)}</TableCell>
                      <TableCell>{payroll.overtimeHours.toFixed(1)}</TableCell>
                      <TableCell className="font-semibold">${payroll.totalPay.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(payroll.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(payroll)}
                          >
                            Details
                          </Button>
                          
                          {payroll.status === 'draft' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleProcessPayroll(payroll.id)}
                            >
                              Process
                            </Button>
                          )}
                          
                          {payroll.status === 'processed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700"
                              onClick={() => handlePayPayroll(payroll.id)}
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Pay
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isPayrollDetailOpen} onOpenChange={setIsPayrollDetailOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Payroll Details</DialogTitle>
            <DialogDescription>
              Detailed breakdown for {selectedPayroll && getEmployeeName(selectedPayroll.employeeId)}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayroll && (
            <div className="py-4">
              <div className="border rounded-md p-4 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Pay Period</p>
                    <p className="font-medium">
                      {format(new Date(selectedPayroll.periodStart), 'MMM d')} - {format(new Date(selectedPayroll.periodEnd), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p>{getStatusBadge(selectedPayroll.status)}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Earnings Breakdown</h3>
                
                <div className="border-b pb-2">
                  <div className="flex justify-between">
                    <p>Regular Pay ({selectedPayroll.regularHours.toFixed(1)} hours)</p>
                    <p className="font-medium">${selectedPayroll.regularPay.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="border-b pb-2">
                  <div className="flex justify-between">
                    <p>Overtime Pay ({selectedPayroll.overtimeHours.toFixed(1)} hours)</p>
                    <p className="font-medium">${selectedPayroll.overtimePay.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="border-b pb-2">
                  <div className="flex justify-between">
                    <p>Bonus Pay</p>
                    <p className="font-medium">${selectedPayroll.bonusPay.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="border-b pb-2">
                  <div className="flex justify-between">
                    <p>Deductions</p>
                    <p className="font-medium">-${selectedPayroll.deductions.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="pt-2">
                  <div className="flex justify-between font-semibold">
                    <p>Total Pay</p>
                    <p>${selectedPayroll.totalPay.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              {selectedPayroll.status === 'processed' && (
                <div className="text-sm text-muted-foreground mt-4">
                  Processed on {selectedPayroll.processedDate ? format(new Date(selectedPayroll.processedDate), 'MMMM d, yyyy') : 'N/A'}
                </div>
              )}
              
              {selectedPayroll.status === 'paid' && (
                <div className="text-sm text-muted-foreground mt-4">
                  Paid on {selectedPayroll.paidDate ? format(new Date(selectedPayroll.paidDate), 'MMMM d, yyyy') : 'N/A'}
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPayrollDetailOpen(false)}>Close</Button>
            <Button onClick={handleExportPayroll}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PayrollManagement;
