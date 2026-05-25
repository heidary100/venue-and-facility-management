"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
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
  Wrench,
  ClipboardList,
  Star,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  MapPin,
  User,
  Clock,
} from "lucide-react";
import { MaintenanceRequestForm } from "@/components/maintenance/maintenance-request-form";
import { MaintenanceKanban } from "@/components/maintenance/maintenance-kanban";
import { VenueEvaluationForm } from "@/components/maintenance/venue-evaluation-form";
import { PreventiveMaintenanceScheduler } from "@/components/maintenance/preventive-maintenance-scheduler";
import { VenueQualityMetricsDisplay } from "@/components/maintenance/venue-quality-metrics";
import { mockVenues, mockBookings } from "@/lib/mock-data";
import {
  MaintenanceRequest,
  MaintenanceStatus,
  PreventiveMaintenance,
  VenueEvaluationDetailed,
  VenueQualityMetrics,
  Booking,
} from "@/lib/types";
import {
  getMaintenanceStats,
  calculateAverageRatings,
  calculateNextScheduledDate,
} from "@/lib/maintenance-utils";
import { formatPersianDate, toPersianDigits } from "@/lib/booking-utils";
import { toast } from "sonner";

export default function MaintenancePage() {
  const [maintenanceRequests, setMaintenanceRequests] = React.useState<
    MaintenanceRequest[]
  >([
    {
      id: "maint-1",
      venueId: "venue-1",
      venueName: "سالن ورزشی شهید چمران",
      category: "electrical",
      title: "خرابی سیستم روشنایی",
      description: "چراغ‌های سمت شرقی سالن خاموش هستند و نیاز به تعمیر دارند",
      priority: "high",
      status: "reported",
      reportedBy: "user-1",
      reportedByName: "علی احمدی",
      photos: [],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: "maint-2",
      venueId: "venue-2",
      venueName: "استخر المپیک",
      category: "plumbing",
      title: "نشت آب در رختکن",
      description: "نشت آب از سقف رختکن مردانه",
      priority: "critical",
      status: "assigned",
      reportedBy: "user-2",
      reportedByName: "مریم رضایی",
      assignedTo: "staff-1",
      assignedToName: "حسین کریمی",
      photos: [],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: "maint-3",
      venueId: "venue-3",
      venueName: "زمین فوتبال شماره ۱",
      category: "equipment",
      title: "تعویض تور دروازه",
      description: "تور دروازه پاره شده و نیاز به تعویض دارد",
      priority: "medium",
      status: "in_progress",
      reportedBy: "user-3",
      reportedByName: "رضا محمدی",
      assignedTo: "staff-2",
      assignedToName: "محمد صادقی",
      photos: [],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ]);

  const [preventiveSchedules, setPreventiveSchedules] = React.useState<
    PreventiveMaintenance[]
  >([
    {
      id: "prev-1",
      venueId: "venue-1",
      venueName: "سالن ورزشی شهید چمران",
      title: "بازرسی سیستم برق",
      description: "بررسی و تست تمام تجهیزات برقی",
      frequency: "monthly",
      lastPerformed: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      nextScheduled: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      assignedTo: "staff-1",
      assignedToName: "حسین کریمی",
      checklist: [
        "بررسی تابلو برق اصلی",
        "تست کلیدهای اتوماتیک",
        "بررسی سیستم روشنایی",
        "تست سیستم اضطراری",
      ],
      isActive: true,
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    },
    {
      id: "prev-2",
      venueId: "venue-2",
      venueName: "استخر المپیک",
      title: "تست کیفیت آب",
      description: "بررسی pH و کلر آب استخر",
      frequency: "weekly",
      lastPerformed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      nextScheduled: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      assignedTo: "staff-3",
      assignedToName: "فاطمه احمدی",
      checklist: [
        "اندازه‌گیری pH",
        "تست کلر",
        "بررسی فیلترها",
        "تمیز کردن کف استخر",
      ],
      isActive: true,
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    },
  ]);

  const [evaluations, setEvaluations] = React.useState<
    VenueEvaluationDetailed[]
  >([
    {
      id: "eval-1",
      bookingId: "booking-1",
      venueId: "venue-1",
      venueName: "سالن ورزشی شهید چمران",
      userId: "user-1",
      userName: "علی احمدی",
      ratings: {
        cleanliness: 4,
        equipment: 5,
        lighting: 3,
        safety: 5,
        overall: 4,
      },
      comment: "سالن خوبی است اما روشنایی نیاز به بهبود دارد",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: "eval-2",
      bookingId: "booking-2",
      venueId: "venue-2",
      venueName: "استخر المپیک",
      userId: "user-2",
      userName: "مریم رضایی",
      ratings: {
        cleanliness: 5,
        equipment: 4,
        lighting: 5,
        safety: 5,
        overall: 5,
      },
      comment: "استخر عالی و تمیز",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  ]);

  const [isNewRequestOpen, setIsNewRequestOpen] = React.useState(false);
  const [isEvaluationOpen, setIsEvaluationOpen] = React.useState(false);
  const [selectedBookingForEval, setSelectedBookingForEval] =
    React.useState<Booking | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = React.useState(false);
  const [selectedRequest, setSelectedRequest] =
    React.useState<MaintenanceRequest | null>(null);

  // Calculate metrics
  const stats = React.useMemo(
    () => getMaintenanceStats(maintenanceRequests),
    [maintenanceRequests]
  );

  const qualityMetrics = React.useMemo(() => {
    const venueIds = [...new Set(evaluations.map((e) => e.venueId))];
    return venueIds.map((venueId) => {
      const venueEvals = evaluations.filter((e) => e.venueId === venueId);
      const venue = venueEvals[0];
      return {
        venueId,
        venueName: venue.venueName,
        averageRatings: calculateAverageRatings(venueEvals),
        totalEvaluations: venueEvals.length,
        lastEvaluated: new Date(
          Math.max(...venueEvals.map((e) => e.createdAt.getTime()))
        ),
      };
    });
  }, [evaluations]);

  const overallSatisfaction =
    qualityMetrics.reduce((sum, m) => sum + m.averageRatings.overall, 0) /
    (qualityMetrics.length || 1);

  // Get completed bookings without evaluation
  const bookingsNeedingEvaluation = mockBookings.filter(
    (b) =>
      b.status === "completed" &&
      !b.evaluationSubmitted &&
      new Date(b.endTime) < new Date()
  );

  const handleNewRequest = (data: any) => {
    const venue = mockVenues.find((v) => v.id === data.venueId);
    const newRequest: MaintenanceRequest = {
      id: `maint-${Date.now()}`,
      venueId: data.venueId,
      venueName: venue?.nameFa || "",
      category: data.category,
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: "reported",
      reportedBy: "current-user",
      reportedByName: "کاربر فعلی",
      photos: data.photos || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setMaintenanceRequests([newRequest, ...maintenanceRequests]);
    setIsNewRequestOpen(false);
    toast.success("درخواست تعمیرات ثبت شد", {
      description: "درخواست شما با موفقیت ثبت و به تیم فنی ارسال شد.",
    });
  };

  const handleUpdateStatus = (
    requestId: string,
    newStatus: MaintenanceStatus
  ) => {
    setMaintenanceRequests(
      maintenanceRequests.map((req) =>
        req.id === requestId
          ? { ...req, status: newStatus, updatedAt: new Date() }
          : req
      )
    );
    toast.success("وضعیت به‌روزرسانی شد");
  };

  const handleAssign = (requestId: string) => {
    // In real app, show assignment dialog
    setMaintenanceRequests(
      maintenanceRequests.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: "assigned" as const,
              assignedTo: "staff-1",
              assignedToName: "تکنسین فنی",
              updatedAt: new Date(),
            }
          : req
      )
    );
    toast.success("درخواست واگذار شد");
  };

  const handleDeleteRequest = (requestId: string) => {
    setMaintenanceRequests(
      maintenanceRequests.filter((req) => req.id !== requestId)
    );
    toast.success("درخواست حذف شد");
  };

  const handleViewDetails = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setIsDetailSheetOpen(true);
  };

  const handleSubmitEvaluation = (data: any) => {
    if (!selectedBookingForEval) return;

    const newEvaluation: VenueEvaluationDetailed = {
      id: `eval-${Date.now()}`,
      bookingId: selectedBookingForEval.id,
      venueId: selectedBookingForEval.venueId,
      venueName: selectedBookingForEval.venueName,
      userId: "current-user",
      userName: "کاربر فعلی",
      ratings: data,
      comment: data.comment,
      createdAt: new Date(),
    };

    setEvaluations([newEvaluation, ...evaluations]);
    setIsEvaluationOpen(false);
    setSelectedBookingForEval(null);
    toast.success("ارزیابی ثبت شد", {
      description: "از نظر شما متشکریم.",
    });
  };

  const handleMarkScheduleComplete = (scheduleId: string) => {
    setPreventiveSchedules(
      preventiveSchedules.map((schedule) =>
        schedule.id === scheduleId
          ? {
              ...schedule,
              lastPerformed: new Date(),
              nextScheduled: calculateNextScheduledDate(
                new Date(),
                schedule.frequency
              ),
            }
          : schedule
      )
    );
    toast.success("انجام تعمیرات ثبت شد");
  };

  const handleToggleScheduleActive = (scheduleId: string) => {
    setPreventiveSchedules(
      preventiveSchedules.map((schedule) =>
        schedule.id === scheduleId
          ? { ...schedule, isActive: !schedule.isActive }
          : schedule
      )
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">مدیریت تعمیرات و کیفیت</h1>
            <p className="text-muted-foreground mt-1">
              ثبت درخواست تعمیرات، ارزیابی کیفیت و برنامه‌ریزی نگهداری
            </p>
          </div>
          <div className="flex items-center gap-2">
            {bookingsNeedingEvaluation.length > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedBookingForEval(bookingsNeedingEvaluation[0]);
                  setIsEvaluationOpen(true);
                }}
                className="gap-2"
              >
                <Star className="h-4 w-4" />
                ارزیابی رزرو
                <Badge variant="secondary">
                  {toPersianDigits(bookingsNeedingEvaluation.length.toString())}
                </Badge>
              </Button>
            )}
            <Button onClick={() => setIsNewRequestOpen(true)} size="lg">
              <Plus className="ml-2 h-5 w-5" />
              درخواست تعمیرات
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    درخواست‌های باز
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {toPersianDigits(
                      (stats.reported + stats.assigned + stats.inProgress).toString()
                    )}
                  </p>
                </div>
                <Wrench className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    بحرانی
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {toPersianDigits(stats.critical.toString())}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    تکمیل شده
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {toPersianDigits(stats.completed.toString())}
                  </p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    رضایت کلی
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {toPersianDigits(overallSatisfaction.toFixed(1))}
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="kanban" className="space-y-4">
          <TabsList>
            <TabsTrigger value="kanban" className="gap-2">
              <ClipboardList className="h-4 w-4" />
              تابلو کانبان
            </TabsTrigger>
            <TabsTrigger value="preventive" className="gap-2">
              <Calendar className="h-4 w-4" />
              تعمیرات پیشگیرانه
            </TabsTrigger>
            <TabsTrigger value="quality" className="gap-2">
              <Star className="h-4 w-4" />
              ارزیابی کیفیت
            </TabsTrigger>
          </TabsList>

          <TabsContent value="kanban" className="space-y-4">
            <MaintenanceKanban
              requests={maintenanceRequests}
              onViewDetails={handleViewDetails}
              onUpdateStatus={handleUpdateStatus}
              onAssign={handleAssign}
              onDelete={handleDeleteRequest}
            />
          </TabsContent>

          <TabsContent value="preventive" className="space-y-4">
            <PreventiveMaintenanceScheduler
              schedules={preventiveSchedules}
              onMarkComplete={handleMarkScheduleComplete}
              onToggleActive={handleToggleScheduleActive}
              onEdit={(schedule) => console.log("Edit", schedule)}
              onDelete={(id) => {
                setPreventiveSchedules(
                  preventiveSchedules.filter((s) => s.id !== id)
                );
                toast.success("برنامه حذف شد");
              }}
            />
          </TabsContent>

          <TabsContent value="quality" className="space-y-4">
            <VenueQualityMetricsDisplay metrics={qualityMetrics} />
          </TabsContent>
        </Tabs>
      </div>

      {/* New Request Dialog */}
      <Dialog open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>درخواست تعمیرات جدید</DialogTitle>
            <DialogDescription>
              فرم زیر را برای ثبت درخواست تعمیرات تکمیل کنید
            </DialogDescription>
          </DialogHeader>
          <MaintenanceRequestForm
            venues={mockVenues}
            onSubmit={handleNewRequest}
          />
        </DialogContent>
      </Dialog>

      {/* Evaluation Dialog */}
      <Dialog open={isEvaluationOpen} onOpenChange={setIsEvaluationOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>ارزیابی سالن</DialogTitle>
            <DialogDescription>
              لطفاً تجربه خود را با ما به اشتراک بگذارید
            </DialogDescription>
          </DialogHeader>
          {selectedBookingForEval && (
            <VenueEvaluationForm
              booking={selectedBookingForEval}
              onSubmit={handleSubmitEvaluation}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Detail Sheet */}
      <Sheet open={isDetailSheetOpen} onOpenChange={setIsDetailSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedRequest && (
            <>
              <SheetHeader>
                <SheetTitle>جزئیات درخواست</SheetTitle>
                <SheetDescription>
                  اطلاعات کامل درخواست تعمیرات
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                {/* Status & Priority */}
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={
                      selectedRequest.status === "completed"
                        ? "bg-green-500/10 text-green-600 border-green-500/20"
                        : selectedRequest.status === "in_progress"
                        ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                        : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                    }
                  >
                    {selectedRequest.status === "reported"
                      ? "گزارش شده"
                      : selectedRequest.status === "assigned"
                      ? "واگذار شده"
                      : selectedRequest.status === "in_progress"
                      ? "در حال انجام"
                      : "تکمیل شده"}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      selectedRequest.priority === "critical"
                        ? "bg-red-500/10 text-red-600 border-red-500/20"
                        : selectedRequest.priority === "high"
                        ? "bg-orange-500/10 text-orange-600 border-orange-500/20"
                        : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                    }
                  >
                    {selectedRequest.priority === "critical"
                      ? "بحرانی"
                      : selectedRequest.priority === "high"
                      ? "بالا"
                      : selectedRequest.priority === "medium"
                      ? "متوسط"
                      : "کم"}
                  </Badge>
                </div>

                <Separator />

                {/* Title & Description */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">
                    {selectedRequest.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.description}
                  </p>
                </div>

                <Separator />

                {/* Venue */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">سالن:</span>
                  </div>
                  <p className="text-sm">{selectedRequest.venueName}</p>
                </div>

                {/* Reporter */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="font-medium">گزارش‌دهنده:</span>
                  </div>
                  <p className="text-sm">{selectedRequest.reportedByName}</p>
                </div>

                {/* Assigned To */}
                {selectedRequest.assignedToName && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span className="font-medium">مسئول:</span>
                    </div>
                    <p className="text-sm">{selectedRequest.assignedToName}</p>
                  </div>
                )}

                {/* Date */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">تاریخ ثبت:</span>
                  </div>
                  <p className="text-sm">
                    {formatPersianDate(new Date(selectedRequest.createdAt))}
                  </p>
                </div>

                {/* Photos */}
                {selectedRequest.photos && selectedRequest.photos.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">تصاویر</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedRequest.photos.map((photo, index) => (
                          <img
                            key={index}
                            src={photo}
                            alt={`تصویر ${index + 1}`}
                            className="w-full aspect-square object-cover rounded-lg border"
                          />
                        ))}
                      </div>
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
