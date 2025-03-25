import React, { Suspense, useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";

// Pages (kept as lazy-loaded components)
const Index = React.lazy(() => import("./pages/Index"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Login = React.lazy(() => import("./pages/auth/Login"));
const Signup = React.lazy(() => import("./pages/auth/Signup"));

// Admin pages
const AdminDashboard = React.lazy(() => import("./pages/admin/Dashboard"));
const EmployeeList = React.lazy(() => import("./pages/admin/EmployeeList"));
const ShiftScheduling = React.lazy(() => import("./pages/admin/ShiftScheduling"));
const Overtime = React.lazy(() => import("./pages/admin/Overtime"));
const Salary = React.lazy(() => import("./pages/admin/Salary"));
const Reports = React.lazy(() => import("./pages/admin/Reports"));
const Attendance = React.lazy(() => import("./pages/admin/Attendance"));
const AdminSettings = React.lazy(() => import("./pages/admin/Settings"));

// Employee pages
const EmployeeDashboard = React.lazy(() => import("./pages/employee/Dashboard"));
const EmployeeProfile = React.lazy(() => import("./pages/employee/Profile"));
const EmployeeShifts = React.lazy(() => import("./pages/employee/Shifts"));
const EmployeeNotifications = React.lazy(() => import("./pages/employee/Notifications"));
const EmployeeSettings = React.lazy(() => import("./pages/employee/Settings"));
const EmployeeLeaves = React.lazy(() => import("./pages/employee/Leaves"));

// Loading Component
const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin w-16 h-16 border-4 border-t-4 border-gray-200 dark:border-gray-700 border-t-blue-500 dark:border-t-blue-400 rounded-full"></div>
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          Loading...
        </p>
      </div>
    </div>
  );
};

const queryClient = new QueryClient();

function App() {
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  useEffect(() => {
    // Simulate initial app load
    const timer = setTimeout(() => {
      setIsInitialLoadComplete(true);
    }, 1500); // 1.5 seconds loading screen

    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            
            {!isInitialLoadComplete ? (
              <LoadingScreen />
            ) : (
              <BrowserRouter>
                <Suspense fallback={<LoadingScreen />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/employees" element={<EmployeeList />} />
                    <Route path="/admin/shifts" element={<ShiftScheduling />} />
                    <Route path="/admin/overtime" element={<Overtime />} />
                    <Route path="/admin/salary" element={<Salary />} />
                    <Route path="/admin/reports" element={<Reports />} />
                    <Route path="/admin/attendance" element={<Attendance />} />
                    <Route path="/admin/settings" element={<AdminSettings />} />

                    {/* Employee Routes */}
                    <Route path="/employee" element={<EmployeeDashboard />} />
                    <Route path="/employee/profile" element={<EmployeeProfile />} />
                    <Route path="/employee/shifts" element={<EmployeeShifts />} />
                    <Route path="/employee/notifications" element={<EmployeeNotifications />} />
                    <Route path="/employee/settings" element={<EmployeeSettings />} />
                    <Route path="/employee/leaves" element={<EmployeeLeaves />} />

                    {/* Catch-all route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            )}
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;