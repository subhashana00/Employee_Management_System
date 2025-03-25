
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ShiftScheduleManager from '@/components/admin/ShiftScheduleManager';
import { PageTransition } from '@/components/ui/page-transition';

export default function ShiftScheduling() {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/employee" replace />;
  }
  
  return (
    <AdminLayout>
      <PageTransition>
        <div className="container mx-auto p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="outline" size="icon" asChild>
              <a href="/admin">
                <ArrowLeft className="h-4 w-4" />
              </a>
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold">Shift Scheduling</h1>
          </div>
          
          <ShiftScheduleManager />
        </div>
      </PageTransition>
    </AdminLayout>
  );
}
