"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Calendar as CalendarIcon,
  List,
  Clock,
  MapPin,
  Users,
  FileText,
  CheckCircle2,
  XCircle,
  Clock3,
  X,
  AlertTriangle,
} from "lucide-react";
import { BookingCalendar } from "@/components/bookings/booking-calendar";
import { BookingForm } from "@/components/bookings/booking-form";
import { MyBookings } from "@/components/bookings/my-bookings";
import { mockBookings, mockVenues } from "@/lib/mock-data";
import { Booking, Venue } from "@/lib/types";
import {
  formatPersianDate,
  formatPersianTime,
  toPersianDigits,
  calculateDuration,
} from "@/lib/booking-utils";
import { cn } from "@/lib/utils";
import { View } from "react-big-calendar";
import { toast } from "sonner";

const statusConfig = {
  pending: {
    label: "در انتظار تأیید",
    className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    icon: Clock3,
  },
  approved: {
    label: "تأیید شده",
    className: "bg-green-500/10 text-green-600 border-green-500/20",
    icon: CheckCircle2,
  },
  rejected: {
    label: "رد شده",
    className: "bg-red-500/10 text-red-600 border-red-500/20",
    icon: XCircle,
  },
  cancelled: {
    label: "لغو شده",
    className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
    icon: X,
  },
  completed: {
    label: "انجام شده",
    className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    icon: CheckCircle2,
  },
};

const purposeLabels: Record<string, string> = {
  class: "کلاس درسی",
  training: "تمرین",
  competition: "مسابقه",
  event: "رویداد",
  maintenance: "تعمیرات",
  other: "سایر",
};

export default function BookingsPage() {
  const [bookings, setBookings] = React.useState<Booking[]>(mockBookings);
  const [venues] = React.useState<Venue[]>(mockVenues);
  const [isNewBookingOpen, setIsNewBookingOpen] = React.useState(false);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = React.useState(false);
  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(null);
  const [calendarView, setCalendarView] = React.useState<View>("week");
  const [calendarDate, setCalendarDate] = React.useState(new Date());
  const [initialBookingDate, setInitialBookingDate] = React.useState<Date | undefined>();
  const [initialVenueId, setInitialVenueId] = React.useState<string | undefined>();

  // Statistics
  const stats = React.useMemo(() => {
    const now = new Date();
    return {
      total: bookings.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      approved: bookings.filter((b) => b.status === "approved").length,
      upcoming: bookings.filter(
        (b) =>
          (b.status === "approved" || b.status === "pending") &&
          new Date(b.startTime) > now
      ).length,
    };
  }, [bookings]);

  const handleNewBooking = (data: any) => {
    const [startHour, startMinute] = data.startTime.split(":").map(Number);
    const [endHour, endMinute] = data.endTime.split(":").map(Number);

    const startDateTime = new Date(data.date);
    startDateTime.setHours(startHour, startMinute, 0, 0);

    const endDateTime = new Date(data.date);
    endDateTime.setHours(endHour, endMinute, 0, 0);

    const venue = venues.find((v) => v.id === data.venueId);

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      venueId: data.venueId,
      venueName: venue?.nameFa || "",
      venueType: venue?.type,
      userId: "current-user",
      userName: "کاربر فعلی",
      userEmail: "user@example.com",
      userPhone: "09123456789",
      universityId: venue?.universityId,
      universityName: venue?.universityName,
      startTime: startDateTime,
      endTime: endDateTime,
      purpose: data.purpose,
      purposeDetail: data.purposeDetail,
      status: "pending",
      attendees: data.attendees,
      notes: data.specialRequests,
      recurrence: "none",
      createdAt: new Date(),
    };

    setBookings([...bookings, newBooking]);
    setIsNewBookingOpen(false);
    toast.success("درخواست رزرو با موفقیت ثبت شد", {
      description: "درخواست شما در انتظار تأیید مدیر است.",
    });
  };

  const handleCancelBooking = (bookingId: string, reason: string) => {
    setBookings(
      bookings.map((b) =>
        b.id === bookingId
          ? { ...b, status: "cancelled" as const, rejectionReason: reason }
          : b
      )
    );
    toast.success("رزرو با موفقیت لغو شد");
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setInitialBookingDate(slotInfo.start);
    setInitialVenueId(undefined);
    setIsNewBookingOpen(true);
  };

  const handleSelectEvent = (event: Booking) => {
    setSelectedBooking(event);
    setIsDetailSheetOpen(true);
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailSheetOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">مدیریت رزرو</h1>
            <p className="text-muted-foreground mt-1">
              رزرو سالن‌های ورزشی و مشاهده وضعیت درخواست‌ها
            </p>
          </div>
          <Button onClick={() => setIsNewBookingOpen(true)} size="lg">
            <Plus className="ml-2 h-5 w-5" />
            رزرو جدید
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">کل رزروها</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {toPersianDigits(stats.total.toString())}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">در انتظار تأیید</CardTitle>
              <Clock3 className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {toPersianDigits(stats.pending.toString())}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">تأیید شده</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {toPersianDigits(stats.approved.toString())}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">رزروهای آینده</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {toPersianDigits(stats.upcoming.toString())}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="calendar" className="space-y-4">
          <TabsList>
            <TabsTrigger value="calendar" className="gap-2">
              <CalendarIcon className="h-4 w-4" />
              تقویم رزرو
            </TabsTrigger>
            <TabsTrigger value="my-bookings" className="gap-2">
              <List className="h-4 w-4" />
              رزروهای من
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>تقویم رزرو سالن‌ها</CardTitle>
                <CardDescription>
                  برای رزرو جدید، روی بازه زمانی مورد نظر کلیک کنید
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BookingCalendar
                  bookings={bookings}
                  onSelectSlot={handleSelectSlot}
                  onSelectEvent={handleSelectEvent}
                  view={calendarView}
                  onViewChange={setCalendarView}
                  date={calendarDate}
                  onNavigate={setCalendarDate}
                />
              </CardContent>
            </Card>

            {/* Legend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">راهنمای رنگ‌ها</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {Object.entries(statusConfig).map(([key, config]) => {
                    const Icon = config.icon;
                    return (
                      <div key={key} className="flex items-center gap-2">
                        <Badge variant="outline" className={cn("gap-1", config.className)}>
                          <Icon className="h-3 w-3" />
                          {config.label}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-bookings" className="space-y-4">
            <MyBookings
              bookings={bookings}
              onCancelBooking={handleCancelBooking}
              onViewDetails={handleViewDetails}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* New Booking Dialog */}
      <Dialog open={isNewBookingOpen} onOpenChange={setIsNewBookingOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>رزرو جدید</DialogTitle>
            <DialogDescription>
              فرم زیر را برای ثبت درخواست رزرو تکمیل کنید
            </DialogDescription>
          </DialogHeader>
          <BookingForm
            venues={venues}
            existingBookings={bookings}
            onSubmit={handleNewBooking}
            initialDate={initialBookingDate}
            initialVenueId={initialVenueId}
          />
        </DialogContent>
      </Dialog>

      {/* Booking Details Sheet */}
      <Sheet open={isDetailSheetOpen} onOpenChange={setIsDetailSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedBooking && (
            <>
              <SheetHeader>
                <SheetTitle>جزئیات رزرو</SheetTitle>
                <SheetDescription>
                  اطلاعات کامل درخواست رزرو
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                {/* Status Badge */}
                <div className="flex items-center justify-center">
                  <Badge
                    variant="outline"
                    className={cn(
                      "gap-2 px-4 py-2 text-base",
                      statusConfig[selectedBooking.status].className
                    )}
                  >
                    {React.createElement(statusConfig[selectedBooking.status].icon, {
                      className: "h-4 w-4",
                    })}
                    {statusConfig[selectedBooking.status].label}
                  </Badge>
                </div>

                <Separator />

                {/* Venue Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    اطلاعات سالن
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">نام سالن:</span>
                      <span className="font-medium">{selectedBooking.venueName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">دانشگاه:</span>
                      <span className="font-medium">
                        {selectedBooking.universityName || "نامشخص"}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Time Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    زمان رزرو
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">تاریخ:</span>
                      <span className="font-medium">
                        {formatPersianDate(new Date(selectedBooking.startTime))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ساعت شروع:</span>
                      <span className="font-medium">
                        {formatPersianTime(new Date(selectedBooking.startTime))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ساعت پایان:</span>
                      <span className="font-medium">
                        {formatPersianTime(new Date(selectedBooking.endTime))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">مدت زمان:</span>
                      <span className="font-medium">
                        {toPersianDigits(
                          calculateDuration(
                            new Date(selectedBooking.startTime),
                            new Date(selectedBooking.endTime)
                          ).toString()
                        )}{" "}
                        ساعت
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Booking Details */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    جزئیات رزرو
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">هدف:</span>
                      <span className="font-medium">
                        {purposeLabels[selectedBooking.purpose]}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">تعداد شرکت‌کنندگان:</span>
                      <span className="font-medium">
                        {toPersianDigits(selectedBooking.attendees.toString())} نفر
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground">توضیحات:</span>
                      <p className="text-foreground">{selectedBooking.purposeDetail}</p>
                    </div>
                    {selectedBooking.notes && (
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground">درخواست‌های ویژه:</span>
                        <p className="text-foreground">{selectedBooking.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* User Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    اطلاعات درخواست‌کننده
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">نام:</span>
                      <span className="font-medium">{selectedBooking.userName}</span>
                    </div>
                    {selectedBooking.userEmail && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ایمیل:</span>
                        <span className="font-medium">{selectedBooking.userEmail}</span>
                      </div>
                    )}
                    {selectedBooking.userPhone && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">تلفن:</span>
                        <span className="font-medium">{selectedBooking.userPhone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Approval/Rejection Info */}
                {selectedBooking.status === "approved" && selectedBooking.approvedBy && (
                  <>
                    <Separator />
                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <p className="text-sm text-green-600">
                        <strong>تأیید شده توسط:</strong> {selectedBooking.approvedBy}
                      </p>
                      {selectedBooking.approvedAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatPersianDate(new Date(selectedBooking.approvedAt))}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {selectedBooking.rejectionReason && (
                  <>
                    <Separator />
                    <div className="p-3 bg-red-500/10 rounded-lg">
                      <p className="text-sm text-red-600">
                        <strong>دلیل رد:</strong> {selectedBooking.rejectionReason}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
}
