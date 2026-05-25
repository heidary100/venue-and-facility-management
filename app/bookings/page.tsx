"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ChevronRight,
  ChevronLeft,
  Plus,
  Clock,
  MapPin,
  Users,
  Calendar as CalendarIcon,
  Filter,
  Search,
  Bell,
  Check,
  X,
  MoreHorizontal,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock3,
  Building2,
  Mail,
  Phone,
  FileText,
  Repeat,
  Sparkles,
  Info,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  mockBookings,
  mockVenues,
  mockUniversities,
  mockNotifications,
  toPersianDigits,
  formatPersianDate,
} from "@/lib/mock-data";
import type { Booking, BookingStatus, BookingPurpose, Venue, Notification, TimeSlot } from "@/lib/types";

// Status configuration
const statusConfig: Record<BookingStatus, { label: string; className: string; icon: React.ElementType }> = {
  pending: { label: "در انتظار تأیید", className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:text-yellow-400", icon: Clock3 },
  approved: { label: "تأیید شده", className: "bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400", icon: CheckCircle2 },
  rejected: { label: "رد شده", className: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400", icon: XCircle },
  cancelled: { label: "لغو شده", className: "bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400", icon: X },
  completed: { label: "انجام شده", className: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400", icon: Check },
};

const purposeConfig: Record<BookingPurpose, { label: string; className: string }> = {
  class: { label: "کلاس درسی", className: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  training: { label: "تمرین", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  competition: { label: "مسابقه", className: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
  event: { label: "رویداد", className: "bg-pink-500/10 text-pink-600 border-pink-500/20" },
  maintenance: { label: "تعمیرات", className: "bg-gray-500/10 text-gray-600 border-gray-500/20" },
  other: { label: "سایر", className: "bg-slate-500/10 text-slate-600 border-slate-500/20" },
};

const recurrenceLabels: Record<string, string> = {
  none: "بدون تکرار",
  daily: "روزانه",
  weekly: "هفتگی",
  monthly: "ماهانه",
};

const persianDays = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"];
const persianMonths = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
];

// Generate time slots
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let hour = 6; hour <= 22; hour++) {
    slots.push({
      time: `${hour.toString().padStart(2, "0")}:00`,
      timeFa: toPersianDigits(`${hour.toString().padStart(2, "0")}:۰۰`),
      hour,
      available: true,
      status: "free",
    });
  }
  return slots;
};

const timeSlots = generateTimeSlots();

// Generate week days
function generateWeekDays(startDate: Date) {
  const days = [];
  const start = new Date(startDate);
  // Adjust to Saturday (start of Persian week)
  const dayOfWeek = start.getDay();
  const diff = dayOfWeek === 6 ? 0 : -dayOfWeek - 1;
  start.setDate(start.getDate() + diff);

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    days.push(date);
  }
  return days;
}

// Calendar Event Component
interface CalendarEventProps {
  booking: Booking;
  onClick?: () => void;
}

function CalendarEvent({ booking, onClick }: CalendarEventProps) {
  const status = statusConfig[booking.status];
  const startHour = new Date(booking.startTime).getHours();
  const startMinute = new Date(booking.startTime).getMinutes();
  const endHour = new Date(booking.endTime).getHours();
  const endMinute = new Date(booking.endTime).getMinutes();
  const duration = (endHour * 60 + endMinute - startHour * 60 - startMinute) / 60;

  return (
    <button
      onClick={onClick}
      className={cn(
        "absolute inset-x-1 rounded-md p-1.5 text-right transition-all hover:ring-2 hover:ring-ring overflow-hidden",
        status.className
      )}
      style={{
        top: `${(startHour - 6) * 48 + (startMinute / 60) * 48 + 2}px`,
        height: `${Math.max(duration * 48 - 4, 20)}px`,
      }}
    >
      <p className="text-xs font-medium line-clamp-1">{booking.userName}</p>
      {duration >= 1 && (
        <p className="text-[10px] opacity-80 line-clamp-1">{booking.purposeDetail}</p>
      )}
    </button>
  );
}

// Notification Item Component
function NotificationItem({ notification, onMarkRead }: { notification: Notification; onMarkRead: (id: string) => void }) {
  const typeIcons: Record<string, React.ElementType> = {
    booking_approved: CheckCircle2,
    booking_rejected: XCircle,
    booking_created: CalendarIcon,
    booking_reminder: Bell,
    booking_cancelled: X,
    maintenance_alert: AlertTriangle,
  };
  const Icon = typeIcons[notification.type] || Bell;

  return (
    <div
      className={cn(
        "p-3 border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer",
        !notification.read && "bg-primary/5"
      )}
      onClick={() => onMarkRead(notification.id)}
    >
      <div className="flex gap-3">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
          notification.type.includes("approved") && "bg-green-500/10 text-green-500",
          notification.type.includes("rejected") && "bg-red-500/10 text-red-500",
          notification.type.includes("created") && "bg-blue-500/10 text-blue-500",
          notification.type.includes("reminder") && "bg-yellow-500/10 text-yellow-500",
          notification.type.includes("maintenance") && "bg-orange-500/10 text-orange-500",
        )}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{notification.title}</p>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{notification.message}</p>
          <p className="text-[10px] text-muted-foreground mt-1">
            {formatPersianDate(new Date(notification.createdAt))}
          </p>
        </div>
        {!notification.read && (
          <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
        )}
      </div>
    </div>
  );
}

// Smart Suggestion Card
function SmartSuggestionCard({ venue, date, time, reason, onSelect }: {
  venue: Venue;
  date: Date;
  time: string;
  reason: string;
  onSelect: () => void;
}) {
  return (
    <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={onSelect}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{venue.nameFa}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatPersianDate(date)} - ساعت {toPersianDigits(time)}
            </p>
            <p className="text-xs text-primary mt-1">{reason}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Page Component
export default function BookingsPage() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedVenue, setSelectedVenue] = React.useState<string>("all");
  const [selectedUniversity, setSelectedUniversity] = React.useState<string>("all");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("calendar");
  const [isBookingDialogOpen, setIsBookingDialogOpen] = React.useState(false);
  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState(mockNotifications);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);
  const [bookings, setBookings] = React.useState(mockBookings);

  // Booking form state
  const [bookingForm, setBookingForm] = React.useState({
    venueId: "",
    date: "",
    startTime: "",
    duration: "1",
    purpose: "" as BookingPurpose | "",
    purposeDetail: "",
    attendees: "",
    recurrence: "none",
    notes: "",
    equipmentNeeded: [] as string[],
  });

  const [conflicts, setConflicts] = React.useState<{ message: string; type: string }[]>([]);
  const [suggestions, setSuggestions] = React.useState<{ venue: Venue; date: Date; time: string; reason: string }[]>([]);

  const weekDays = generateWeekDays(currentDate);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Filter bookings
  const filteredBookings = React.useMemo(() => {
    return bookings.filter((booking) => {
      const matchesVenue = selectedVenue === "all" || booking.venueId === selectedVenue;
      const matchesUniversity = selectedUniversity === "all" || booking.universityId === selectedUniversity;
      const matchesStatus = selectedStatus === "all" || booking.status === selectedStatus;
      const matchesSearch = searchQuery === "" ||
        booking.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.venueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.purposeDetail.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesVenue && matchesUniversity && matchesStatus && matchesSearch;
    });
  }, [bookings, selectedVenue, selectedUniversity, selectedStatus, searchQuery]);

  // Calendar bookings for current week
  const calendarBookings = React.useMemo(() => {
    return filteredBookings.filter((booking) => {
      const bookingDate = new Date(booking.startTime);
      const weekStart = weekDays[0];
      const weekEnd = new Date(weekDays[6]);
      weekEnd.setHours(23, 59, 59);
      return bookingDate >= weekStart && bookingDate <= weekEnd;
    });
  }, [filteredBookings, weekDays]);

  // My bookings (current user)
  const myBookings = React.useMemo(() => {
    return bookings.filter(b => b.userId === "u1" || b.userId === "u2");
  }, [bookings]);

  // Pending bookings for approval
  const pendingBookings = React.useMemo(() => {
    return bookings.filter(b => b.status === "pending");
  }, [bookings]);

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentDate(newDate);
  };

  const goToToday = () => setCurrentDate(new Date());

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleApproveBooking = (bookingId: string) => {
    setBookings(prev => prev.map(b =>
      b.id === bookingId
        ? { ...b, status: "approved" as BookingStatus, approvedBy: "مدیر سیستم", approvedAt: new Date() }
        : b
    ));
  };

  const handleRejectBooking = (bookingId: string) => {
    setBookings(prev => prev.map(b =>
      b.id === bookingId
        ? { ...b, status: "rejected" as BookingStatus, rejectionReason: "عدم تطابق با برنامه" }
        : b
    ));
  };

  // Check for conflicts when booking form changes
  React.useEffect(() => {
    if (bookingForm.venueId && bookingForm.date && bookingForm.startTime) {
      const newConflicts: { message: string; type: string }[] = [];
      const newSuggestions: { venue: Venue; date: Date; time: string; reason: string }[] = [];

      const selectedDate = new Date(bookingForm.date);
      const startHour = parseInt(bookingForm.startTime.split(":")[0]);
      const endHour = startHour + parseInt(bookingForm.duration);

      // Check for existing bookings
      const existingBookings = bookings.filter(b => {
        const bDate = new Date(b.startTime);
        return b.venueId === bookingForm.venueId &&
          bDate.toDateString() === selectedDate.toDateString() &&
          b.status !== "rejected" && b.status !== "cancelled";
      });

      existingBookings.forEach(b => {
        const bStartHour = new Date(b.startTime).getHours();
        const bEndHour = new Date(b.endTime).getHours();
        if ((startHour >= bStartHour && startHour < bEndHour) ||
            (endHour > bStartHour && endHour <= bEndHour)) {
          newConflicts.push({
            message: `تداخل با رزرو "${b.userName}" از ساعت ${toPersianDigits(bStartHour)} تا ${toPersianDigits(bEndHour)}`,
            type: "overlap"
          });
        }
      });

      // Check venue maintenance
      const selectedVenueData = mockVenues.find(v => v.id === bookingForm.venueId);
      if (selectedVenueData?.status === "maintenance") {
        newConflicts.push({
          message: "این مکان در حال تعمیرات است",
          type: "maintenance"
        });
      }

      // Generate smart suggestions if conflicts exist
      if (newConflicts.length > 0) {
        // Suggest alternative times
        const availableTimes = timeSlots.filter(slot => {
          const slotEnd = slot.hour + parseInt(bookingForm.duration);
          return !existingBookings.some(b => {
            const bStart = new Date(b.startTime).getHours();
            const bEnd = new Date(b.endTime).getHours();
            return (slot.hour >= bStart && slot.hour < bEnd) || (slotEnd > bStart && slotEnd <= bEnd);
          }) && slotEnd <= 22;
        });

        if (availableTimes.length > 0 && selectedVenueData) {
          newSuggestions.push({
            venue: selectedVenueData,
            date: selectedDate,
            time: availableTimes[0].time,
            reason: "اولین زمان خالی در همین روز"
          });
        }

        // Suggest alternative venues
        const alternativeVenues = mockVenues.filter(v =>
          v.id !== bookingForm.venueId &&
          v.status === "active" &&
          v.capacity >= parseInt(bookingForm.attendees || "0")
        );

        alternativeVenues.slice(0, 2).forEach(venue => {
          newSuggestions.push({
            venue,
            date: selectedDate,
            time: bookingForm.startTime,
            reason: `${venue.nameFa} - ظرفیت ${toPersianDigits(venue.capacity)} نفر`
          });
        });
      }

      setConflicts(newConflicts);
      setSuggestions(newSuggestions);
    }
  }, [bookingForm.venueId, bookingForm.date, bookingForm.startTime, bookingForm.duration, bookingForm.attendees, bookings]);

  const handleSubmitBooking = () => {
    if (conflicts.length > 0) {
      return;
    }

    const newBooking: Booking = {
      id: `b${Date.now()}`,
      venueId: bookingForm.venueId,
      venueName: mockVenues.find(v => v.id === bookingForm.venueId)?.nameFa || "",
      venueType: mockVenues.find(v => v.id === bookingForm.venueId)?.type,
      userId: "u1",
      userName: "کاربر فعلی",
      startTime: new Date(`${bookingForm.date}T${bookingForm.startTime}`),
      endTime: new Date(`${bookingForm.date}T${(parseInt(bookingForm.startTime.split(":")[0]) + parseInt(bookingForm.duration)).toString().padStart(2, "0")}:00`),
      purpose: bookingForm.purpose as BookingPurpose,
      purposeDetail: bookingForm.purposeDetail,
      status: "pending",
      attendees: parseInt(bookingForm.attendees) || 0,
      notes: bookingForm.notes,
      equipmentNeeded: bookingForm.equipmentNeeded,
      recurrence: bookingForm.recurrence as "none" | "daily" | "weekly" | "monthly",
      createdAt: new Date(),
    };

    setBookings(prev => [newBooking, ...prev]);
    setIsBookingDialogOpen(false);
    setBookingForm({
      venueId: "",
      date: "",
      startTime: "",
      duration: "1",
      purpose: "",
      purposeDetail: "",
      attendees: "",
      recurrence: "none",
      notes: "",
      equipmentNeeded: [],
    });
    setConflicts([]);
    setSuggestions([]);
  };

  const applySuggestion = (suggestion: { venue: Venue; date: Date; time: string }) => {
    setBookingForm(prev => ({
      ...prev,
      venueId: suggestion.venue.id,
      date: suggestion.date.toISOString().split("T")[0],
      startTime: suggestion.time,
    }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">سیستم رزرو هوشمند</h1>
            <p className="text-muted-foreground">مدیریت و رزرو اماکن ورزشی</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Bell className="h-4 w-4" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {toPersianDigits(unreadNotifications)}
                  </span>
                )}
              </Button>

              {showNotifications && (
                <Card className="absolute left-0 top-full mt-2 w-80 z-50 shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">اعلان‌ها</CardTitle>
                  </CardHeader>
                  <ScrollArea className="h-80">
                    <CardContent className="p-0">
                      {notifications.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">اعلانی وجود ندارد</p>
                      ) : (
                        notifications.map(notification => (
                          <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onMarkRead={handleMarkNotificationRead}
                          />
                        ))
                      )}
                    </CardContent>
                  </ScrollArea>
                </Card>
              )}
            </div>

            <Button onClick={() => setIsBookingDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">رزرو جدید</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <CalendarIcon className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{toPersianDigits(bookings.length)}</p>
                  <p className="text-xs text-muted-foreground">کل رزروها</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Clock3 className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{toPersianDigits(pendingBookings.length)}</p>
                  <p className="text-xs text-muted-foreground">در انتظار تأیید</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{toPersianDigits(bookings.filter(b => b.status === "approved").length)}</p>
                  <p className="text-xs text-muted-foreground">تأیید شده</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{toPersianDigits(mockVenues.filter(v => v.status === "active").length)}</p>
                  <p className="text-xs text-muted-foreground">مکان فعال</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <TabsList className="grid w-full sm:w-auto grid-cols-4 h-auto">
              <TabsTrigger value="calendar" className="text-xs sm:text-sm py-2">تقویم</TabsTrigger>
              <TabsTrigger value="my-bookings" className="text-xs sm:text-sm py-2">رزروهای من</TabsTrigger>
              <TabsTrigger value="approval" className="text-xs sm:text-sm py-2 relative">
                صف تأیید
                {pendingBookings.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                    {toPersianDigits(pendingBookings.length)}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="all" className="text-xs sm:text-sm py-2">همه</TabsTrigger>
            </TabsList>

            <Button
              variant="outline"
              size="sm"
              className="gap-2 sm:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              فیلترها
              <ChevronDown className={cn("h-4 w-4 transition-transform", showFilters && "rotate-180")} />
            </Button>
          </div>

          {/* Filters */}
          <Card className={cn("transition-all", !showFilters && "hidden sm:block")}>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="جستجو..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-9"
                  />
                </div>
                <Select value={selectedVenue} onValueChange={setSelectedVenue}>
                  <SelectTrigger>
                    <SelectValue placeholder="مکان ورزشی" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه اماکن</SelectItem>
                    {mockVenues.map((venue) => (
                      <SelectItem key={venue.id} value={venue.id}>
                        {venue.nameFa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
                  <SelectTrigger>
                    <SelectValue placeholder="دانشگاه" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه دانشگاه‌ها</SelectItem>
                    {mockUniversities.map((uni) => (
                      <SelectItem key={uni.id} value={uni.id}>
                        {uni.nameFa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="وضعیت" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                    {Object.entries(statusConfig).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => {
                  setSearchQuery("");
                  setSelectedVenue("all");
                  setSelectedUniversity("all");
                  setSelectedStatus("all");
                }} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  پاک کردن
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-4">
            {/* Calendar Controls */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => navigateWeek("prev")}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" onClick={goToToday}>
                      امروز
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => navigateWeek("next")}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="font-medium mr-4">
                      {persianMonths[currentDate.getMonth()]} {toPersianDigits(currentDate.getFullYear())}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/30" />
                      <span className="text-xs text-muted-foreground">خالی</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-blue-500/20 border border-blue-500/30" />
                      <span className="text-xs text-muted-foreground">رزرو شده</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
                      <span className="text-xs text-muted-foreground">در انتظار</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-orange-500/20 border border-orange-500/30" />
                      <span className="text-xs text-muted-foreground">تعمیرات</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calendar Grid */}
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Header */}
                  <div className="grid grid-cols-8 border-b border-border">
                    <div className="p-3 border-l border-border bg-muted/50">
                      <span className="text-sm font-medium text-muted-foreground">ساعت</span>
                    </div>
                    {weekDays.map((day, index) => {
                      const isToday = day.toDateString() === new Date().toDateString();
                      return (
                        <div
                          key={index}
                          className={cn(
                            "p-3 text-center border-l border-border last:border-l-0",
                            isToday && "bg-primary/5"
                          )}
                        >
                          <p className="text-sm text-muted-foreground">{persianDays[index]}</p>
                          <p className={cn("text-lg font-bold", isToday && "text-primary")}>
                            {toPersianDigits(day.getDate())}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Time Slots */}
                  <ScrollArea className="h-[600px]">
                    <div className="grid grid-cols-8">
                      {/* Time Column */}
                      <div className="border-l border-border">
                        {timeSlots.map((slot) => (
                          <div
                            key={slot.time}
                            className="h-12 px-3 flex items-center justify-center border-b border-border text-xs text-muted-foreground"
                          >
                            {slot.timeFa}
                          </div>
                        ))}
                      </div>

                      {/* Day Columns */}
                      {weekDays.map((day, dayIndex) => {
                        const dayBookings = calendarBookings.filter(
                          (b) => new Date(b.startTime).toDateString() === day.toDateString()
                        );
                        const isToday = day.toDateString() === new Date().toDateString();

                        return (
                          <div
                            key={dayIndex}
                            className={cn(
                              "relative border-l border-border last:border-l-0",
                              isToday && "bg-primary/5"
                            )}
                          >
                            {timeSlots.map((_, index) => (
                              <div key={index} className="h-12 border-b border-border hover:bg-muted/30 cursor-pointer transition-colors" />
                            ))}
                            {dayBookings.map((booking) => (
                              <CalendarEvent
                                key={booking.id}
                                booking={booking}
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setIsDetailSheetOpen(true);
                                }}
                              />
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* My Bookings Tab */}
          <TabsContent value="my-bookings" className="space-y-4">
            <div className="grid gap-4">
              {myBookings.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">شما هنوز رزروی ثبت نکرده‌اید</p>
                    <Button className="mt-4" onClick={() => setIsBookingDialogOpen(true)}>
                      ثبت اولین رزرو
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                myBookings.map((booking) => (
                  <Card key={booking.id} className="hover:border-primary/30 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            "w-12 h-12 rounded-lg flex items-center justify-center shrink-0",
                            statusConfig[booking.status].className
                          )}>
                            {React.createElement(statusConfig[booking.status].icon, { className: "h-6 w-6" })}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold">{booking.venueName}</h3>
                              <Badge variant="outline" className={purposeConfig[booking.purpose].className}>
                                {purposeConfig[booking.purpose].label}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{booking.purposeDetail}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                              <span className="flex items-center gap-1">
                                <CalendarIcon className="h-3.5 w-3.5" />
                                {formatPersianDate(new Date(booking.startTime))}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {toPersianDigits(new Date(booking.startTime).getHours())}:۰۰ - {toPersianDigits(new Date(booking.endTime).getHours())}:۰۰
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3.5 w-3.5" />
                                {toPersianDigits(booking.attendees)} نفر
                              </span>
                              {booking.recurrence !== "none" && (
                                <span className="flex items-center gap-1">
                                  <Repeat className="h-3.5 w-3.5" />
                                  {recurrenceLabels[booking.recurrence]}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <Badge variant="outline" className={statusConfig[booking.status].className}>
                            {statusConfig[booking.status].label}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setSelectedBooking(booking);
                                setIsDetailSheetOpen(true);
                              }}>
                                <Eye className="h-4 w-4 ml-2" />
                                مشاهده جزئیات
                              </DropdownMenuItem>
                              {booking.status === "pending" && (
                                <>
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 ml-2" />
                                    ویرایش
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="h-4 w-4 ml-2" />
                                    لغو رزرو
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Approval Queue Tab */}
          <TabsContent value="approval" className="space-y-4">
            <div className="grid gap-4">
              {pendingBookings.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-muted-foreground">هیچ درخواستی در انتظار تأیید نیست</p>
                  </CardContent>
                </Card>
              ) : (
                pendingBookings.map((booking) => (
                  <Card key={booking.id} className="border-yellow-500/30">
                    <CardContent className="p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center shrink-0">
                            <Clock3 className="h-6 w-6 text-yellow-500" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold">{booking.userName}</h3>
                              <Badge variant="outline">{booking.venueName}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{booking.purposeDetail}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                              <span className="flex items-center gap-1">
                                <CalendarIcon className="h-3.5 w-3.5" />
                                {formatPersianDate(new Date(booking.startTime))}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {toPersianDigits(new Date(booking.startTime).getHours())}:۰۰ - {toPersianDigits(new Date(booking.endTime).getHours())}:۰۰
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3.5 w-3.5" />
                                {toPersianDigits(booking.attendees)} نفر
                              </span>
                              {booking.universityName && (
                                <span className="flex items-center gap-1">
                                  <Building2 className="h-3.5 w-3.5" />
                                  {booking.universityName}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setIsDetailSheetOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4 ml-1" />
                            جزئیات
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                            onClick={() => handleRejectBooking(booking.id)}
                          >
                            <X className="h-4 w-4 ml-1" />
                            رد
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApproveBooking(booking.id)}
                          >
                            <Check className="h-4 w-4 ml-1" />
                            تأیید
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* All Bookings Tab */}
          <TabsContent value="all" className="space-y-4">
            <Card>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">درخواست‌دهنده</TableHead>
                      <TableHead className="text-right">مکان</TableHead>
                      <TableHead className="text-right">تاریخ و ساعت</TableHead>
                      <TableHead className="text-right">هدف</TableHead>
                      <TableHead className="text-right">تعداد</TableHead>
                      <TableHead className="text-right">وضعیت</TableHead>
                      <TableHead className="text-right w-[60px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.userName}</p>
                            {booking.universityName && (
                              <p className="text-xs text-muted-foreground">{booking.universityName}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{booking.venueName}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{formatPersianDate(new Date(booking.startTime))}</p>
                            <p className="text-muted-foreground">
                              {toPersianDigits(new Date(booking.startTime).getHours())}:۰۰ - {toPersianDigits(new Date(booking.endTime).getHours())}:۰۰
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={purposeConfig[booking.purpose].className}>
                            {purposeConfig[booking.purpose].label}
                          </Badge>
                        </TableCell>
                        <TableCell>{toPersianDigits(booking.attendees)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusConfig[booking.status].className}>
                            {statusConfig[booking.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setIsDetailSheetOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* New Booking Dialog */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>درخواست رزرو جدید</DialogTitle>
            <DialogDescription>
              اطلاعات رزرو را وارد کنید. سیستم به‌صورت هوشمند تداخل‌ها را بررسی می‌کند.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Venue Selection */}
            <div className="grid gap-2">
              <Label htmlFor="venue">مکان ورزشی *</Label>
              <Select
                value={bookingForm.venueId}
                onValueChange={(value) => setBookingForm(prev => ({ ...prev, venueId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب مکان" />
                </SelectTrigger>
                <SelectContent>
                  {mockVenues.map((venue) => (
                    <SelectItem key={venue.id} value={venue.id} disabled={venue.status === "maintenance"}>
                      <div className="flex items-center gap-2">
                        <span>{venue.nameFa}</span>
                        {venue.status === "maintenance" && (
                          <Badge variant="outline" className="text-xs bg-orange-500/10 text-orange-500">تعمیرات</Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">تاریخ *</Label>
                <Input
                  id="date"
                  type="date"
                  value={bookingForm.date}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, date: e.target.value }))}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">ساعت شروع *</Label>
                <Select
                  value={bookingForm.startTime}
                  onValueChange={(value) => setBookingForm(prev => ({ ...prev, startTime: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب ساعت" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot.time} value={slot.time}>
                        {slot.timeFa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">مدت (ساعت) *</Label>
                <Select
                  value={bookingForm.duration}
                  onValueChange={(value) => setBookingForm(prev => ({ ...prev, duration: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="مدت" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">۱ ساعت</SelectItem>
                    <SelectItem value="2">۲ ساعت</SelectItem>
                    <SelectItem value="3">۳ ساعت</SelectItem>
                    <SelectItem value="4">۴ ساعت</SelectItem>
                    <SelectItem value="6">۶ ساعت</SelectItem>
                    <SelectItem value="8">۸ ساعت</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Conflicts Alert */}
            {conflicts.length > 0 && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">تداخل شناسایی شد</span>
                </div>
                <ul className="space-y-1">
                  {conflicts.map((conflict, i) => (
                    <li key={i} className="text-sm text-red-600/80 dark:text-red-400/80 flex items-center gap-2">
                      <X className="h-3 w-3" />
                      {conflict.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Smart Suggestions */}
            {suggestions.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <Lightbulb className="h-5 w-5" />
                  <span className="font-medium">پیشنهادات هوشمند</span>
                </div>
                <div className="grid gap-2">
                  {suggestions.map((suggestion, i) => (
                    <SmartSuggestionCard
                      key={i}
                      venue={suggestion.venue}
                      date={suggestion.date}
                      time={suggestion.time}
                      reason={suggestion.reason}
                      onSelect={() => applySuggestion(suggestion)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Purpose */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="purpose">هدف رزرو *</Label>
                <Select
                  value={bookingForm.purpose}
                  onValueChange={(value) => setBookingForm(prev => ({ ...prev, purpose: value as BookingPurpose }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب هدف" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(purposeConfig).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="attendees">تعداد شرکت‌کنندگان *</Label>
                <Input
                  id="attendees"
                  type="number"
                  placeholder="مثال: ۲۵"
                  value={bookingForm.attendees}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, attendees: e.target.value }))}
                />
              </div>
            </div>

            {/* Purpose Detail */}
            <div className="grid gap-2">
              <Label htmlFor="purposeDetail">توضیحات *</Label>
              <Textarea
                id="purposeDetail"
                placeholder="توضیحات مختصر درباره هدف رزرو..."
                value={bookingForm.purposeDetail}
                onChange={(e) => setBookingForm(prev => ({ ...prev, purposeDetail: e.target.value }))}
                rows={2}
              />
            </div>

            {/* Recurrence */}
            <div className="grid gap-2">
              <Label htmlFor="recurrence">تکرار</Label>
              <Select
                value={bookingForm.recurrence}
                onValueChange={(value) => setBookingForm(prev => ({ ...prev, recurrence: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="نوع تکرار" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(recurrenceLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="grid gap-2">
              <Label htmlFor="notes">یادداشت (اختیاری)</Label>
              <Textarea
                id="notes"
                placeholder="نکات اضافی..."
                value={bookingForm.notes}
                onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)}>
              انصراف
            </Button>
            <Button
              onClick={handleSubmitBooking}
              disabled={
                !bookingForm.venueId ||
                !bookingForm.date ||
                !bookingForm.startTime ||
                !bookingForm.purpose ||
                !bookingForm.purposeDetail ||
                !bookingForm.attendees ||
                conflicts.length > 0
              }
            >
              ثبت درخواست
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Booking Detail Sheet */}
      <Sheet open={isDetailSheetOpen} onOpenChange={setIsDetailSheetOpen}>
        <SheetContent side="left" className="w-full sm:max-w-lg overflow-y-auto">
          {selectedBooking && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <span>{selectedBooking.venueName}</span>
                  <Badge variant="outline" className={statusConfig[selectedBooking.status].className}>
                    {statusConfig[selectedBooking.status].label}
                  </Badge>
                </SheetTitle>
                <SheetDescription>
                  جزئیات رزرو
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Booking Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{formatPersianDate(new Date(selectedBooking.startTime))}</p>
                      <p className="text-sm text-muted-foreground">
                        ساعت {toPersianDigits(new Date(selectedBooking.startTime).getHours())}:۰۰ تا {toPersianDigits(new Date(selectedBooking.endTime).getHours())}:۰۰
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">درخواست‌دهنده</p>
                      <p className="font-medium">{selectedBooking.userName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">هدف</p>
                      <Badge variant="outline" className={purposeConfig[selectedBooking.purpose].className}>
                        {purposeConfig[selectedBooking.purpose].label}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">تعداد شرکت‌کنندگان</p>
                      <p className="font-medium">{toPersianDigits(selectedBooking.attendees)} نفر</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">تکرار</p>
                      <p className="font-medium">{recurrenceLabels[selectedBooking.recurrence]}</p>
                    </div>
                  </div>

                  {selectedBooking.universityName && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedBooking.universityName}</span>
                    </div>
                  )}

                  {selectedBooking.userEmail && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedBooking.userEmail}</span>
                    </div>
                  )}

                  {selectedBooking.userPhone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedBooking.userPhone}</span>
                    </div>
                  )}

                  <Separator />

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">توضیحات</p>
                    <p className="text-sm">{selectedBooking.purposeDetail}</p>
                  </div>

                  {selectedBooking.notes && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">یادداشت</p>
                      <p className="text-sm">{selectedBooking.notes}</p>
                    </div>
                  )}

                  {selectedBooking.equipmentNeeded && selectedBooking.equipmentNeeded.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">تجهیزات مورد نیاز</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedBooking.equipmentNeeded.map((item, i) => (
                          <Badge key={i} variant="outline">{item}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedBooking.approvedBy && (
                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <p className="text-sm text-green-600 dark:text-green-400">
                        تأیید شده توسط: {selectedBooking.approvedBy}
                      </p>
                      {selectedBooking.approvedAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatPersianDate(new Date(selectedBooking.approvedAt))}
                        </p>
                      )}
                    </div>
                  )}

                  {selectedBooking.rejectionReason && (
                    <div className="p-3 bg-red-500/10 rounded-lg">
                      <p className="text-sm text-red-600 dark:text-red-400">
                        دلیل رد: {selectedBooking.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {selectedBooking.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 text-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                      onClick={() => {
                        handleRejectBooking(selectedBooking.id);
                        setIsDetailSheetOpen(false);
                      }}
                    >
                      <X className="h-4 w-4 ml-2" />
                      رد کردن
                    </Button>
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        handleApproveBooking(selectedBooking.id);
                        setIsDetailSheetOpen(false);
                      }}
                    >
                      <Check className="h-4 w-4 ml-2" />
                      تأیید
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
}
