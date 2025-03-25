import * as React from "react";
import { AttendanceReport, AttendanceStatus, Attendance } from "@/types/attendance";

interface User {
  id: string;
  name: string;
  email: string;
  jobType?: string;
  role: 'admin' | 'employee';
  photoURL?: string;
  profileImage?: string;
  hourlyRate?: number;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isEmployee: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (name: string, email: string, password: string, jobType: string) => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  updateEmail: (newEmail: string, password: string) => Promise<boolean>;
  
  // Mock methods for employee and admin management
  getEmployees: () => User[];
  addEmployee: (employee: Omit<User, 'id' | 'password'> & { password?: string }) => Promise<boolean>;
  updateEmployee: (id: string, data: Partial<User>) => Promise<boolean>;
  deleteEmployee: (id: string) => Promise<boolean>;
  updateProfileImage: (id: string, imageData: string) => Promise<boolean>;
  
  // Attendance methods
  getAttendance: (userId: string, date?: string) => Attendance | null;
  startShift: (userId: string, date: string, notes?: string, lateInfo?: any, shiftId?: string) => Promise<boolean>;
  endShift: (userId: string, date: string, notes?: string, overtime?: number) => Promise<boolean>;
  getCurrentShift: (userId: string, date?: string) => any | null;
  getAttendanceReport: (userId: string, period?: string) => AttendanceReport;
  getAttendancesByDate: (date: string) => Attendance[];
  getAttendancesByEmployee: (employeeId: string) => Attendance[];
  markAbsent: (employeeId: string, date: string, notes?: string) => Promise<boolean>;
  updateAttendance: (attendance: Attendance) => Promise<boolean>;
  
  // Leave management
  getLeaveRequests: (employeeId?: string, status?: string) => any[];
  requestLeave: (data: any) => Promise<boolean>;
  approveLeave: (leaveId: string, note?: string) => Promise<boolean>;
  rejectLeave: (leaveId: string, note?: string) => Promise<boolean>;
  
  // Bonus calculations
  calculateBonusEligibility: (employeeId: string) => any;
  getBonusEligibleEmployees: (year?: number, employeeId?: string) => { employeeId: string; report: AttendanceReport }[];
  calculateBonusAmount: (report: AttendanceReport) => number;
  applyBonus: (employeeId: string, year: number, amount: number) => Promise<boolean>;
  
  // Shift management
  getShifts: (date?: string, employeeId?: string) => any[];
  createShift: (shift: any) => boolean;
  updateShift: (shift: any) => boolean;
  deleteShift: (shiftId: string) => boolean;
  
  // Payroll functions
  getPayroll: (month: string) => any[];
  generatePayroll: (month: string) => any[];
  processPayroll: (payrollId: string) => Promise<boolean>;
  payPayroll: (payrollId: string) => Promise<boolean>;
  
  // Reports
  getAttendanceReports: (period: string) => any;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  
  // Mock employees data
  const [employees, setEmployees] = React.useState<User[]>([
    {
      id: "1",
      name: "Prabhath@33",
      email: "admin@bistro.com",
      role: "admin",
      jobType: "Manager",
      profileImage: "/placeholder.svg",
      hourlyRate: 25
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "employee@bistro.com",
      role: "employee",
      jobType: "Waiter",
      profileImage: "/placeholder.svg",
      hourlyRate: 15
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@bistro.com",
      role: "employee",
      jobType: "Chef",
      profileImage: "/placeholder.svg",
      hourlyRate: 20
    },
    {
      id: "4",
      name: "Sarah Williams",
      email: "sarah@bistro.com",
      role: "employee",
      jobType: "Bartender",
      profileImage: "/placeholder.svg",
      hourlyRate: 18
    }
  ]);
  
  // Mock shifts data
  const [shifts, setShifts] = React.useState<any[]>([
    {
      id: "shift-1",
      employeeId: "2",
      day: "Monday",
      date: "2024-03-25",
      startTime: "09:00",
      endTime: "17:00",
      type: "Morning",
      status: "completed"
    },
    {
      id: "shift-2",
      employeeId: "3",
      day: "Monday",
      date: "2024-03-25",
      startTime: "10:00",
      endTime: "18:00",
      type: "Morning",
      status: "completed"
    },
    {
      id: "shift-3",
      employeeId: "4",
      day: "Monday",
      date: "2024-03-25",
      startTime: "16:00",
      endTime: "00:00",
      type: "Evening",
      status: "scheduled"
    }
  ]);
  
  // Mock leave requests
  const [leaveRequests, setLeaveRequests] = React.useState<any[]>([
    {
      id: "leave-1",
      employeeId: "2",
      startDate: "2024-04-10",
      endDate: "2024-04-15",
      type: "vacation",
      reason: "Family vacation",
      status: "pending",
      requestDate: "2024-03-20"
    },
    {
      id: "leave-2",
      employeeId: "3",
      startDate: "2024-03-28",
      endDate: "2024-03-30",
      type: "sick",
      reason: "Flu",
      status: "approved",
      requestDate: "2024-03-15",
      responseDate: "2024-03-16",
      responseNote: "Get well soon"
    }
  ]);
  
  // Mock attendance data
  const [attendances, setAttendances] = React.useState<any[]>([
    {
      id: "att-1",
      employeeId: "2",
      date: "2024-03-24",
      checkIn: "08:55",
      checkOut: "17:05",
      status: "present",
      hoursWorked: 8.17
    },
    {
      id: "att-2",
      employeeId: "3",
      date: "2024-03-24",
      checkIn: "09:50",
      checkOut: "18:10",
      status: "present",
      hoursWorked: 8.33
    },
    {
      id: "att-3",
      employeeId: "4",
      date: "2024-03-24",
      status: "absent"
    }
  ]);
  
  const login = async (email: string, password: string) => {
    try {
      // Simulate API call
      await new Promise<void>((resolve) => setTimeout(resolve, 1000));
      
      // Find user with matching email
      const userToLogin = employees.find(emp => emp.email.toLowerCase() === email.toLowerCase());
      
      if (userToLogin) {
        // In a real app, you would validate password here
        setUser(userToLogin);
        setIsAuthenticated(true);
        setIsAdmin(userToLogin.role === "admin");
        
        // Store user in localStorage for persistence
        localStorage.setItem("user", JSON.stringify(userToLogin));
        
        return;
      }
      
      throw new Error("Invalid credentials");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };
  
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem("user");
  };
  
  const signup = async (name: string, email: string, password: string, jobType: string) => {
    try {
      // Simulate API call
      await new Promise<void>((resolve) => setTimeout(resolve, 1000));
      
      // Check if email is already in use
      if (employees.some(emp => emp.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("Email already in use");
      }
      
      // Create new user with employee role
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        name,
        email,
        jobType,
        role: "employee",
        hourlyRate: 15 // Default hourly rate
      };
      
      // Add to employees
      setEmployees(prev => [...prev, newUser]);
      
      setUser(newUser);
      setIsAuthenticated(true);
      setIsAdmin(false);
      
      // Store user in localStorage for persistence
      localStorage.setItem("user", JSON.stringify(newUser));
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  };
  
  const updateUserProfile = async (data: Partial<User>) => {
    if (!user) return;
    
    try {
      // Simulate API call
      await new Promise<void>((resolve) => setTimeout(resolve, 1000));
      
      // Update the user in both the user state and the employees list
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      
      // Update in employees list
      setEmployees(prevEmployees => 
        prevEmployees.map(emp => 
          emp.id === user.id ? { ...emp, ...data } : emp
        )
      );
      
      // Update local storage
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };
  
  const updatePassword = async (oldPassword: string, newPassword: string) => {
    // Simulate API call
    await new Promise<void>((resolve) => setTimeout(resolve, 1000));
    
    // In a real app, you would verify the old password and update to the new one
    console.log("Password updated from", oldPassword, "to", newPassword);
    return true;
  };
  
  const updateEmail = async (newEmail: string, password: string) => {
    if (!user) return false;
    
    // Check if email is already in use by another account
    if (employees.some(emp => emp.id !== user.id && emp.email.toLowerCase() === newEmail.toLowerCase())) {
      throw new Error("Email already in use");
    }
    
    // Simulate API call
    await new Promise<void>((resolve) => setTimeout(resolve, 1000));
    
    // Update email
    await updateUserProfile({ email: newEmail });
    return true;
  };
  
  // Employee management functions
  const getEmployees = () => {
    return employees;
  };
  
  const addEmployee = async (employeeData: Omit<User, 'id' | 'password'> & { password?: string }) => {
    // Simulate API call
    await new Promise<void>((resolve) => setTimeout(resolve, 1000));
    
    // Generate an ID for the new employee
    const newEmployee: User = {
      ...employeeData,
      id: Math.random().toString(36).substring(2, 9)
    };
    
    setEmployees(prev => [...prev, newEmployee]);
    return true;
  };
  
  const updateEmployee = async (id: string, data: Partial<User>) => {
    // Simulate API call
    await new Promise<void>((resolve) => setTimeout(resolve, 1000));
    
    setEmployees(prev => 
      prev.map(emp => 
        emp.id === id ? { ...emp, ...data } : emp
      )
    );
    
    // If the current user is being updated, also update the user state
    if (user && user.id === id) {
      setUser(prev => prev ? { ...prev, ...data } : null);
      localStorage.setItem('user', JSON.stringify({ ...user, ...data }));
    }
    
    return true;
  };
  
  const deleteEmployee = async (id: string) => {
    // Simulate API call
    await new Promise<void>((resolve) => setTimeout(resolve, 1000));
    
    setEmployees(prev => prev.filter(emp => emp.id !== id));
    return true;
  };
  
  const updateProfileImage = async (id: string, imageData: string) => {
    // Simulate API call
    await new Promise<void>((resolve) => setTimeout(resolve, 1000));
    
    // Update the profile image for the given employee
    setEmployees(prev => 
      prev.map(emp => 
        emp.id === id ? { ...emp, profileImage: imageData } : emp
      )
    );
    
    // If the current user's image is being updated, also update the user state
    if (user && user.id === id) {
      setUser(prev => prev ? { ...prev, profileImage: imageData } : null);
      localStorage.setItem('user', JSON.stringify({ ...user, profileImage: imageData }));
    }
    
    return true;
  };
  
  // Attendance management
  const getAttendance = (userId: string, date?: string) => {
    const todayDate = date || new Date().toISOString().split('T')[0];
    const userAttendance = attendances.find(att => 
      att.employeeId === userId && att.date === todayDate
    );
    return userAttendance || null;
  };
  
  const startShift = async (userId: string, date: string, notes?: string, lateInfo?: any, shiftId?: string) => {
    console.log("Starting shift with params:", { userId, date, notes, lateInfo, shiftId });
    return true;
  };
  
  const endShift = async (userId: string, date: string, notes?: string, overtime?: number) => {
    console.log("Ending shift with params:", { userId, date, notes, overtime });
    return true;
  };
  
  const getCurrentShift = (userId: string, date?: string) => {
    return null;
  };
  
  // Attendance reports
  const getAttendanceReport = (userId: string, period = 'month') => {
    const userAttendances = attendances.filter(att => att.employeeId === userId);
    
    // Mock calculations
    const total = userAttendances.length;
    const present = userAttendances.filter(a => a.status === 'present').length;
    const absent = userAttendances.filter(a => a.status === 'absent').length;
    const totalHours = userAttendances.reduce((sum, att) => sum + (att.hoursWorked || 0), 0);
    
    return {
      employeeId: userId,
      totalShifts: total,
      attendedShifts: present,
      missedShifts: absent,
      totalHours: totalHours,
      attendanceRate: total > 0 ? Math.round((present / total) * 100) : 0,
      leavesUsed: leaveRequests.filter(l => 
        l.employeeId === userId && 
        l.status === 'approved'
      ).length,
      totalOvertime: 0,
      totalLate: 0,
      bonusEligible: false,
      bonusAmount: 0
    };
  };
  
  const getAttendancesByDate = (date: string) => {
    return attendances.filter(att => att.date === date) as Attendance[];
  };
  
  const getAttendancesByEmployee = (employeeId: string) => {
    return attendances.filter(att => att.employeeId === employeeId) as Attendance[];
  };
  
  const markAbsent = async (employeeId: string, date: string, notes?: string) => {
    console.log("Marking absent with params:", { employeeId, date, notes });
    return true;
  };
  
  const updateAttendance = async (attendance: Attendance) => {
    console.log("Updating attendance:", attendance);
    return true;
  };
  
  // Leave management
  const getLeaveRequests = (employeeId?: string, status?: string) => {
    let filteredLeaves = [...leaveRequests];
    
    if (employeeId) {
      filteredLeaves = filteredLeaves.filter(leave => leave.employeeId === employeeId);
    }
    
    if (status) {
      filteredLeaves = filteredLeaves.filter(leave => leave.status === status);
    }
    
    return filteredLeaves;
  };
  
  const requestLeave = async (leaveData: any) => {
    return true;
  };
  
  const approveLeave = async (leaveId: string, note?: string) => {
    return true;
  };
  
  const rejectLeave = async (leaveId: string, note?: string) => {
    return true;
  };
  
  // Bonus calculations
  const calculateBonusEligibility = (employeeId: string) => {
    const employeeLeaves = leaveRequests.filter(
      leave => leave.employeeId === employeeId && leave.status === 'approved'
    ).length;
    
    // Bonus percentage decreases with more leaves used
    let bonusPercentage = 0;
    if (employeeLeaves < 2) {
      bonusPercentage = 7;
    } else if (employeeLeaves < 3) {
      bonusPercentage = 5;
    } else if (employeeLeaves < 5) {
      bonusPercentage = 3;
    }
    
    return {
      eligible: employeeLeaves < 5,
      bonusPercentage: bonusPercentage,
      leavesUsed: employeeLeaves
    };
  };
  
  const getBonusEligibleEmployees = (year?: number, employeeId?: string) => {
    const eligibleEmployees = employeeId 
      ? [employees.find(emp => emp.id === employeeId)].filter(Boolean) as User[]
      : employees.filter(emp => emp.role === 'employee');
    
    return eligibleEmployees.map(emp => ({
      employeeId: emp.id,
      report: getAttendanceReport(emp.id)
    }));
  };
  
  const calculateBonusAmount = (report: AttendanceReport) => {
    const employee = employees.find(emp => emp.id === report.employeeId);
    if (!employee || !employee.hourlyRate) return 0;
    
    // Bonus percentage based on attendance rate
    let bonusPercentage = 0;
    if (report.attendanceRate > 95) {
      bonusPercentage = 7;
    } else if (report.attendanceRate > 90) {
      bonusPercentage = 5;
    } else if (report.attendanceRate > 85) {
      bonusPercentage = 3;
    }
    
    // Simple calculation: hourlyRate * 160 hours * bonus percentage
    return employee.hourlyRate * 160 * (bonusPercentage / 100);
  };
  
  const applyBonus = async (employeeId: string, year: number, amount: number) => {
    console.log("Applying bonus with params:", { employeeId, year, amount });
    return true;
  };
  
  // Shift management
  const getShifts = (date?: string, employeeId?: string) => {
    let filteredShifts = [...shifts];
    
    if (date) {
      filteredShifts = filteredShifts.filter(shift => 
        shift.date === date || 
        (date.includes('Monday') && shift.day === 'Monday') ||
        (date.includes('Tuesday') && shift.day === 'Tuesday') ||
        (date.includes('Wednesday') && shift.day === 'Wednesday') ||
        (date.includes('Thursday') && shift.day === 'Thursday') ||
        (date.includes('Friday') && shift.day === 'Friday') ||
        (date.includes('Saturday') && shift.day === 'Saturday') ||
        (date.includes('Sunday') && shift.day === 'Sunday')
      );
    }
    
    if (employeeId) {
      filteredShifts = filteredShifts.filter(shift => shift.employeeId === employeeId);
    }
    
    return filteredShifts;
  };
  
  const createShift = (shift: any) => {
    setShifts(prev => [...prev, shift]);
    return true;
  };
  
  const updateShift = (updatedShift: any) => {
    setShifts(prev => 
      prev.map(shift => 
        shift.id === updatedShift.id ? updatedShift : shift
      )
    );
    return true;
  };
  
  const deleteShift = (shiftId: string) => {
    setShifts(prev => prev.filter(shift => shift.id !== shiftId));
    return true;
  };
  
  // Payroll functions
  const getPayroll = (month: string) => {
    return [];
  };
  
  const generatePayroll = (month: string) => {
    return [];
  };
  
  const processPayroll = async (payrollId: string) => {
    return true;
  };
  
  const payPayroll = async (payrollId: string) => {
    return true;
  };
  
  // Reports
  const getAttendanceReports = (period: string) => {
    return {
      totalEmployees: employees.filter(e => e.role === 'employee').length,
      presentToday: 10,
      absentToday: 2,
      onLeaveToday: 1,
      attendanceRate: 90,
      averageHoursWorked: 7.5
    };
  };
  
  // Check for existing user session on initial load
  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser) as User;
        setUser(userData);
        setIsAuthenticated(true);
        setIsAdmin(userData.role === "admin");
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isAuthenticated,
        isEmployee: isAuthenticated && !isAdmin,
        login,
        logout,
        signup,
        updateUserProfile,
        updatePassword,
        updateEmail,
        getEmployees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        updateProfileImage,
        getAttendance,
        startShift,
        endShift,
        getCurrentShift,
        getAttendanceReport,
        getAttendancesByDate,
        getAttendancesByEmployee,
        markAbsent,
        updateAttendance,
        getLeaveRequests,
        requestLeave,
        approveLeave,
        rejectLeave,
        calculateBonusEligibility,
        getBonusEligibleEmployees,
        calculateBonusAmount,
        applyBonus,
        getShifts,
        createShift,
        updateShift,
        deleteShift,
        getPayroll,
        generatePayroll,
        processPayroll,
        payPayroll,
        getAttendanceReports
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
