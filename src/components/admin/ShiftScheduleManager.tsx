import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Edit, Plus, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Shift } from "@/types/attendance";

const ShiftScheduleManager = () => {
  const { getEmployees, getShifts, createShift, updateShift, deleteShift } =
    useAuth();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

  // Form states
  const [shiftEmployee, setShiftEmployee] = useState("");
  const [shiftDate, setShiftDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [shiftStartTime, setShiftStartTime] = useState("09:00");
  const [shiftEndTime, setShiftEndTime] = useState("17:00");
  const [shiftType, setShiftType] = useState("regular");

  const employees = getEmployees();

  // Load shifts based on filters
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      let loadedShifts = [];
      if (selectedEmployee) {
        loadedShifts = getShifts(undefined, selectedEmployee);
      } else if (selectedDate) {
        loadedShifts = getShifts(selectedDate);
      } else {
        loadedShifts = getShifts();
      }
      setShifts(loadedShifts as Shift[]);
      setIsLoading(false);
    }, 500);
  }, [selectedDate, selectedEmployee, refreshKey]);

  // Get employee name by id
  const getEmployeeName = (id: string) => {
    const employee = employees.find((e) => e.id === id);
    return employee ? employee.name : "Unknown";
  };

  // Handle opening add/edit dialog
  const handleAddEditShift = (shift?: Shift) => {
    if (shift) {
      // Edit existing shift
      setIsCreating(false);
      setSelectedShift(shift);
      setShiftEmployee(shift.employeeId);
      setShiftDate(shift.date || format(new Date(), "yyyy-MM-dd"));
      setShiftStartTime(shift.startTime);
      setShiftEndTime(shift.endTime);
      setShiftType(shift.type);
    } else {
      // Add new shift
      setIsCreating(true);
      setSelectedShift(null);
      setShiftEmployee(employees[0]?.id || "");
      setShiftDate(selectedDate);
      setShiftStartTime("09:00");
      setShiftEndTime("17:00");
      setShiftType("regular");
    }
    setDialogOpen(true);
  };

  // Handle opening delete confirmation dialog
  const handleOpenDeleteDialog = (shift: Shift) => {
    setSelectedShift(shift);
    setIsDeleteDialogOpen(true);
  };

  // Handle saving shift (create or update)
  const handleSaveShift = () => {
    setIsLoading(true);

    const shiftData: Shift = {
      id: isCreating
        ? `shift-${Date.now()}`
        : selectedShift?.id || `shift-${Date.now()}`,
      employeeId: shiftEmployee,
      date: shiftDate,
      day: new Date(shiftDate).toLocaleDateString("en-US", { weekday: "long" }),
      startTime: shiftStartTime,
      endTime: shiftEndTime,
      type: shiftType,
      status: "scheduled",
    };

    setTimeout(() => {
      try {
        if (isCreating) {
          createShift(shiftData);
          toast.success("Shift added successfully");
        } else {
          updateShift(shiftData);
          toast.success("Shift updated successfully");
        }
        setDialogOpen(false);
        setRefreshKey((prev) => prev + 1);
      } catch (error) {
        toast.error("Failed to save shift");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }, 600);
  };

  // Handle deleting a shift
  const handleDeleteShift = () => {
    if (!selectedShift) return;

    setIsLoading(true);
    setTimeout(() => {
      try {
        deleteShift(selectedShift.id);
        toast.success("Shift deleted successfully");
        setIsDeleteDialogOpen(false);
        setRefreshKey((prev) => prev + 1);
      } catch (error) {
        toast.error("Failed to delete shift");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }, 600);
  };

  // Handle refreshing the data
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setRefreshKey((prev) => prev + 1);
      setIsLoading(false);
      toast.success("Shift data refreshed");
    }, 600);
  };

  // Handle clearing filters
  const handleClearFilters = () => {
    setSelectedDate(format(new Date(), "yyyy-MM-dd"));
    setSelectedEmployee(null);
  };

  // Get badge for shift type
  const getShiftTypeBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case "morning":
        return <Badge className="bg-blue-100 text-blue-800">Morning</Badge>;
      case "evening":
        return <Badge className="bg-indigo-100 text-indigo-800">Evening</Badge>;
      case "night":
        return <Badge className="bg-purple-100 text-purple-800">Night</Badge>;
      default:
        return <Badge variant="outline">Regular</Badge>;
    }
  };

  // Get badge for shift status
  const getShiftStatusBadge = (status?: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "missed":
        return <Badge className="bg-red-100 text-red-800">Missed</Badge>;
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Scheduled</Badge>
        );
    }
  };

  return (
    <>
      <Card className="w-full mb-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Shift Schedule
              </CardTitle>
              <CardDescription>Manage employee work shifts</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                Clear Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button
                size="sm"
                onClick={() => handleAddEditShift()}
                disabled={isLoading}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Shift
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Label className="text-sm font-medium mb-2 block">
                Filter By Date
              </Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="flex-1">
              <Label className="text-sm font-medium mb-2 block">
                Filter By Employee
              </Label>
           
              <Select
                value={selectedEmployee || "all"}
                onValueChange={(value) =>
                  setSelectedEmployee(value === "all" ? null : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Employees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <RefreshCw className="mx-auto h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-muted-foreground">Loading shifts...</p>
            </div>
          ) : shifts.length === 0 ? (
            <div className="text-center py-12 border rounded-md bg-accent/10">
              <Calendar className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No shifts found</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => handleAddEditShift()}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add New Shift
              </Button>
            </div>
          ) : (
            <div className="border rounded-md overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date/Day</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shifts.map((shift) => (
                    <TableRow key={shift.id}>
                      <TableCell className="font-medium">
                        {getEmployeeName(shift.employeeId)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>
                            {shift.date
                              ? new Date(shift.date).toLocaleDateString()
                              : "N/A"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {shift.day}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                          {shift.startTime} - {shift.endTime}
                        </div>
                      </TableCell>
                      <TableCell>{getShiftTypeBadge(shift.type)}</TableCell>
                      <TableCell>{getShiftStatusBadge(shift.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAddEditShift(shift)}
                            disabled={isLoading}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDeleteDialog(shift)}
                            disabled={isLoading}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
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

      {/* Add/Edit Shift Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isCreating ? "Add New Shift" : "Edit Shift"}
            </DialogTitle>
            <DialogDescription>
              {isCreating
                ? "Schedule a new work shift"
                : "Update the selected work shift"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="employee">Employee</Label>
              <Select
                value={shiftEmployee || employees[0]?.id || ""}
                onValueChange={setShiftEmployee}
              >
                <SelectTrigger id="employee">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={shiftDate}
                onChange={(e) => setShiftDate(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={shiftStartTime}
                  onChange={(e) => setShiftStartTime(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={shiftEndTime}
                  onChange={(e) => setShiftEndTime(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Shift Type</Label>
              <Select value={shiftType} onValueChange={setShiftType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select shift type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                  <SelectItem value="night">Night</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveShift} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isCreating ? (
                "Add Shift"
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this shift? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          {selectedShift && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Employee:</span>{" "}
                  {getEmployeeName(selectedShift.employeeId)}
                </div>
                <div>
                  <span className="font-medium">Date:</span>{" "}
                  {selectedShift.date
                    ? new Date(selectedShift.date).toLocaleDateString()
                    : "N/A"}
                </div>
                <div>
                  <span className="font-medium">Time:</span>{" "}
                  {selectedShift.startTime} - {selectedShift.endTime}
                </div>
                <div>
                  <span className="font-medium">Type:</span>{" "}
                  {selectedShift.type}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteShift}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Shift"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShiftScheduleManager;
