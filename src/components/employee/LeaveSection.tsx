
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Calendar, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const LeaveSection = () => {
  const { user, getLeaveRequests, calculateBonusEligibility } = useAuth();
  
  if (!user) return null;
  
  // Get pending leaves
  const pendingLeaves = getLeaveRequests(user.id, 'pending');
  
  // Get bonus eligibility
  const bonusInfo = calculateBonusEligibility(user.id);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" /> Leave Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm">Pending Requests:</div>
          <Badge variant="outline" className="bg-yellow-50">
            {pendingLeaves.length}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm">Leaves Used This Year:</div>
          <Badge variant="outline" className="bg-blue-50">
            {bonusInfo.leavesUsed}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm">Bonus Eligibility:</div>
          <Badge 
            className={bonusInfo.eligible ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
          >
            {bonusInfo.eligible ? `${bonusInfo.bonusPercentage}% Bonus` : 'Not Eligible'}
          </Badge>
        </div>
        
        <div className="pt-3 space-y-3">
          {pendingLeaves.length > 0 ? (
            <div className="bg-yellow-50 p-3 rounded-md">
              <div className="flex gap-2 items-start">
                <Clock className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Pending approval</p>
                  <p className="text-xs text-yellow-700">
                    You have {pendingLeaves.length} pending leave {pendingLeaves.length === 1 ? 'request' : 'requests'}
                  </p>
                </div>
              </div>
            </div>
          ) : bonusInfo.eligible ? (
            <div className="bg-green-50 p-3 rounded-md">
              <div className="flex gap-2 items-start">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">Bonus eligible</p>
                  <p className="text-xs text-green-700">
                    You qualify for a {bonusInfo.bonusPercentage}% year-end bonus!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 p-3 rounded-md">
              <div className="flex gap-2 items-start">
                <Calendar className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Need time off?</p>
                  <p className="text-xs text-blue-700">
                    Submit a leave request when you need time away from work
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" size="sm" variant="outline" asChild>
          <a href="/employee/leaves">
            Manage Leave Requests
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LeaveSection;
