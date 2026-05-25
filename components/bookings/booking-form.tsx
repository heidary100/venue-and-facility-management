"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Users, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { VenueSearchCombobox } from "./venue-search-combobox";
import { Booking, Venue, BookingPurpose, BookingConflict } from "@/lib/types";
import { checkBookingConflicts, toPersianDigits } from "@/lib/booking-utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

const bookingFormSchema = z.object({
  venueId: z.string().min(1, "لطفاً سالن را انتخاب کنید"),
  date: z.date({
    required_error: "لطفاً تاریخ را انتخاب کنید",
  }),
  startTime: z.string().min(1, "لطفاً زمان شروع را انتخاب کنید"),
  endTime: z.string().min(1, "لطفاً زمان پایان را انتخاب کنید"),
  purpose: z.enum(["class", "training", "competition", "event", "maintenance", "other"]),
  purposeDetail: z.string().min(3, "لطفاً توضیحات را وارد کنید"),
  attendees: z.number().min(1, "تعداد شرکت‌کنندگان باید حداقل ۱ نفر باشد"),
  specialRequests: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  venues: Venue[];
  existingBookings: Booking[];
  onSubmit: (data: BookingFormValues) => void;
  initialDate?: Date;
  initialVenueId?: string;
}

const purposeOptions: { value: BookingPurpose; label: string }[] = [
  { value: "training", label: "تمرین" },
  { value: "class", label: "کلاس درسی" },
  { value: "competition", label: "مسابقه" },
  { value: "event", label: "رویداد" },
  { value: "other", label: "سایر" },
];

const timeSlots = Array.from({ length: 17 }, (_, i) => {
  const hour = i + 6;
  return {
    value: `${hour.toString().padStart(2, "0")}:00`,
    label: toPersianDigits(`${hour.toString().padStart(2, "0")}:۰۰`),
  };
});

export function BookingForm({
  venues,
  existingBookings,
  onSubmit,
  initialDate,
  initialVenueId,
}: BookingFormProps) {
  const [conflicts, setConflicts] = React.useState<BookingConflict[]>([]);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      venueId: initialVenueId || "",
      date: initialDate || new Date(),
      startTime: "",
      endTime: "",
      purpose: "training",
      purposeDetail: "",
      attendees: 1,
      specialRequests: "",
    },
  });

  const selectedVenueId = form.watch("venueId");
  const selectedDate = form.watch("date");
  const startTime = form.watch("startTime");
  const endTime = form.watch("endTime");
  const attendees = form.watch("attendees");

  const selectedVenue = venues.find((v) => v.id === selectedVenueId);

  // Check for conflicts whenever relevant fields change
  React.useEffect(() => {
    if (selectedVenueId && selectedDate && startTime && endTime && selectedVenue) {
      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = endTime.split(":").map(Number);

      const startDateTime = new Date(selectedDate);
      startDateTime.setHours(startHour, startMinute, 0, 0);

      const endDateTime = new Date(selectedDate);
      endDateTime.setHours(endHour, endMinute, 0, 0);

      if (endDateTime <= startDateTime) {
        setConflicts([
          {
            existingBooking: {} as Booking,
            type: "overlap",
            message: "زمان پایان باید بعد از زمان شروع باشد",
          },
        ]);
        return;
      }

      const detectedConflicts = checkBookingConflicts(
        {
          venueId: selectedVenueId,
          startTime: startDateTime,
          endTime: endDateTime,
          attendees,
        },
        existingBookings,
        selectedVenue
      );

      setConflicts(detectedConflicts);
    } else {
      setConflicts([]);
    }
  }, [selectedVenueId, selectedDate, startTime, endTime, attendees, selectedVenue, existingBookings]);

  const handleSubmit = (data: BookingFormValues) => {
    if (conflicts.length > 0) {
      return;
    }
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Venue Selection */}
        <FormField
          control={form.control}
          name="venueId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>سالن ورزشی</FormLabel>
              <FormControl>
                <VenueSearchCombobox
                  venues={venues}
                  value={field.value}
                  onValueChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date Selection */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>تاریخ</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-right font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        new Intl.DateTimeFormat("fa-IR").format(field.value)
                      ) : (
                        <span>انتخاب تاریخ</span>
                      )}
                      <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Time Selection */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>زمان شروع</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب زمان" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot.value} value={slot.value}>
                        {slot.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>زمان پایان</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب زمان" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot.value} value={slot.value}>
                        {slot.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Purpose */}
        <FormField
          control={form.control}
          name="purpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>هدف رزرو</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب هدف" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {purposeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Purpose Detail */}
        <FormField
          control={form.control}
          name="purposeDetail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>توضیحات</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="توضیحات تکمیلی درباره رزرو..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Attendees */}
        <FormField
          control={form.control}
          name="attendees"
          render={({ field }) => (
            <FormItem>
              <FormLabel>تعداد شرکت‌کنندگان</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    min={1}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </div>
              </FormControl>
              {selectedVenue && (
                <FormDescription>
                  ظرفیت سالن: {toPersianDigits(selectedVenue.capacity.toString())} نفر
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Special Requests */}
        <FormField
          control={form.control}
          name="specialRequests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>درخواست‌های ویژه (اختیاری)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="درخواست‌های خاص یا تجهیزات مورد نیاز..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Conflicts Alert */}
        {conflicts.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                {conflicts.map((conflict, index) => (
                  <div key={index}>{conflict.message}</div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={conflicts.length > 0}
        >
          ثبت درخواست رزرو
        </Button>
      </form>
    </Form>
  );
}
