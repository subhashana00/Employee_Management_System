
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

const leaveFormSchema = z.object({
  startDate: z.date({
    required_error: 'Start date is required',
  }),
  endDate: z.date({
    required_error: 'End date is required',
  }).refine(date => date >= new Date(new Date().setHours(0, 0, 0, 0)), {
    message: "End date must be today or in the future",
  }),
  type: z.enum(['sick', 'vacation', 'personal', 'other'], {
    required_error: 'Please select a leave type',
  }),
  reason: z.string().min(5, {
    message: 'Reason must be at least 5 characters.',
  }).max(500, {
    message: 'Reason must not exceed 500 characters.',
  }),
}).refine(data => data.endDate >= data.startDate, {
  message: "End date must be after or equal to start date",
  path: ["endDate"],
});

type LeaveFormValues = z.infer<typeof leaveFormSchema>;

const LeaveRequestForm = () => {
  const { user, requestLeave } = useAuth();
  
  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
      type: 'vacation',
      reason: '',
    },
  });
  
  const onSubmit = async (data: LeaveFormValues) => {
    if (!user) return;
    
    const startDateStr = format(data.startDate, 'yyyy-MM-dd');
    const endDateStr = format(data.endDate, 'yyyy-MM-dd');
    
    const success = await requestLeave({
      employeeId: user.id,
      startDate: startDateStr,
      endDate: endDateStr,
      type: data.type,
      reason: data.reason,
    });
    
    if (success) {
      form.reset();
      toast.success('Leave request submitted successfully');
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0)) || 
                        date < form.getValues("startDate")
                      }
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Leave Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="sick">Sick Leave</SelectItem>
                  <SelectItem value="vacation">Vacation</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please explain the reason for your leave request..."
                  className="h-24"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full">Submit Leave Request</Button>
      </form>
    </Form>
  );
};

export default LeaveRequestForm;
