"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2,
  XCircle,
  Clock3,
  X,
  MoreHorizontal,
  MapPin,
  Calendar as CalendarIcon,
  Users,
  FileText,
  Trash2,
} from "lucide-react";
import { Booking, BookingStatus } from "@/lib/types";
import {
  formatPersianDate,
  formatPersianTime,
  canCancelBooking,
  toPersianDigits,
  calculateDuration,
} from "@/lib/booking-utils";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MyBookingsProps {
  bookings: Booking[];
  onCancelBooking: (bookingId: string, reason: string) => void;
  onViewDetails: (booking: Booking) => void;
}

const statusConfig: Record<
  BookingStatus,
  { label: string; className: string; icon: React.ElementType }
> = {
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

export function MyBookings({
  bookings,
  onCancelBooking,
  onViewDetails,
}: MyBookingsProps) {
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false);
  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = React.useState("");

  const handleCancelClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setCancelReason("");
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = () => {
    if (selectedBooking && cancelReason.trim()) {
      onCancelBooking(selectedBooking.id, cancelReason);
      setCancelDialogOpen(false);
      setSelectedBooking(null);
      setCancelReason("");
    }
  };

  const filterBookingsByStatus = (status: BookingStatus[]) => {
    return bookings.filter((b) => status.includes(b.status));
  };

  const upcomingBookings = filterBookingsByStatus(["pending", "approved"]).filter(
    (b) => new Date(b.startTime) > new Date()
  );
  const pastBookings = filterBookingsByStatus(["completed"]).concat(
    filterBookingsByStatus(["approved"]).filter(
      (b) => new Date(b.endTime) < new Date()
    )
  );
  const cancelledRejectedBookings = filterBookingsByStatus(["cancelled", "rejected"]);

  const BookingCard = ({ booking }: { booking: Booking }) => {
    const status = statusConfig[booking.status];
    const StatusIcon = status.icon;
    const duration = calculateDuration(
      new Date(booking.startTime),
      new Date(booking.endTime)
    );

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">{booking.venueName}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                {booking.universityName || "دانشگاه"}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={cn("gap-1", status.className)}>
                <StatusIcon className="h-3 w-3" />
                {status.label}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onViewDetails(booking)}>
                    <FileText className="ml-2 h-4 w-4" />
                    مشاهده جزئیات
                  </DropdownMenuItem>
                  {canCancelBooking(booking) && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleCancelClick(booking)}
                        className="text-red-600"
                      >
                        <Trash2 className="ml-2 h-4 w-4" />
                        لغو رزرو
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <span>{formatPersianDate(new Date(booking.startTime))}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock3 className="h-4 w-4" />
              <span>
                {formatPersianTime(new Date(booking.startTime))} -{" "}
                {formatPersianTime(new Date(booking.endTime))}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{toPersianDigits(booking.attendees.toString())} نفر</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>{purposeLabels[booking.purpose]}</span>
            </div>
          </div>

          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {booking.purposeDetail}
            </p>
          </div>

          {booking.status === "rejected" && booking.rejectionReason && (
            <div className="p-3 bg-red-500/10 rounded-lg">
              <p className="text-sm text-red-600">
                <strong>دلیل رد:</strong> {booking.rejectionReason}
              </p>
            </div>
          )}

          {booking.status === "approved" && booking.approvedBy && (
            <div className="p-3 bg-green-500/10 rounded-lg">
              <p className="text-sm text-green-600">
                تأیید شده توسط: {booking.approvedBy}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">
            آینده ({toPersianDigits(upcomingBookings.length.toString())})
          </TabsTrigger>
          <TabsTrigger value="past">
            گذشته ({toPersianDigits(pastBookings.length.toString())})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            لغو/رد شده ({toPersianDigits(cancelledRejectedBookings.length.toString())})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {upcomingBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">رزرو آینده‌ای وجود ندارد</p>
              </CardContent>
            </Card>
          ) : (
            upcomingBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4 mt-6">
          {pastBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock3 className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">رزرو گذشته‌ای وجود ندارد</p>
              </CardContent>
            </Card>
          ) : (
            pastBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4 mt-6">
          {cancelledRejectedBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <XCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">رزرو لغو یا رد شده‌ای وجود ندارد</p>
              </CardContent>
            </Card>
          ) : (
            cancelledRejectedBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Cancel Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>لغو رزرو</AlertDialogTitle>
            <AlertDialogDescription>
              آیا مطمئن هستید که می‌خواهید این رزرو را لغو کنید؟ این عملیات قابل بازگشت نیست.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 py-4">
            <Label htmlFor="cancel-reason">دلیل لغو</Label>
            <Textarea
              id="cancel-reason"
              placeholder="لطفاً دلیل لغو رزرو را بنویسید..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              disabled={!cancelReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              تأیید لغو
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
