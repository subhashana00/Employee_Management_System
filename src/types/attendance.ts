
// Types for attendance tracking
export type AttendanceStatus = 'pending' | 'started' | 'completed' | 'absent';

export type Attendance = {
  id: string;
  employeeId: string;
  shiftId?: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  duration: number | null;
  status: AttendanceStatus;
  notes?: string;
  isLate?: boolean;
  lateMinutes?: number;
  overtime?: number;
};

// Types for leave management
export type LeaveType = 'sick' | 'vacation' | 'personal' | 'other';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export type LeaveRequest = {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  type: LeaveType;
  reason: string;
  status: LeaveStatus;
  requestDate: string;
  responseDate?: string;
  responseNote?: string;
};

// Types for shift scheduling
export type Shift = {
  id: string;
  employeeId: string;
  day: string;
  date?: string;
  startTime: string;
  endTime: string;
  type: string;
  status?: 'scheduled' | 'completed' | 'missed';
};

// Types for payroll
export type PayrollStatus = 'draft' | 'processed' | 'paid';

export type PayrollItem = {
  id: string;
  employeeId: string;
  periodStart: string;
  periodEnd: string;
  regularHours: number;
  overtimeHours: number;
  regularPay: number;
  overtimePay: number;
  bonusPay: number;
  deductions: number;
  totalPay: number;
  status: PayrollStatus;
  processedDate?: string;
  paidDate?: string;
};

// Types for reports
export type AttendanceReport = {
  employeeId?: string;
  totalShifts: number;
  attendedShifts: number;
  missedShifts: number;
  totalHours: number;
  attendanceRate: number;
  leavesUsed: number;
  totalOvertime: number;
  totalLate: number;
  bonusEligible?: boolean;
  bonusAmount?: number;
};
