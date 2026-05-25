"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockBookings, mockMaintenanceTasks, toPersianDigits } from "@/lib/mock-data";
import type { MaintenanceTaskStatus, MaintenancePriority } from "@/lib/types";
import Link from "next/link";

const statusConfig = {
  pending: {
    label: "در انتظار",
    variant: "warning" as const,
    icon: <AlertCircle className="h-4 w-4" />,
  },
  approved: {
    label: "تأیید شده",
    variant: "success" as const,
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  rejected: {
    label: "رد شده",
    variant: "destructive" as const,
    icon: <XCircle className="h-4 w-4" />,
  },
  cancelled: {
    label: "لغو شده",
    variant: "secondary" as const,
    icon: <XCircle className="h-4 w-4" />,
  },
  completed: {
    label: "انجام شده",
    variant: "default" as const,
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
};

const maintenanceStatusConfig: Record<
  MaintenanceTaskStatus,
  { label: string; className: string }
> = {
  scheduled: {
    label: "برنامه‌ریزی شده",
    className: "bg-blue-500/10 text-blue-500",
  },
  in_progress: {
    label: "در حال انجام",
    className: "bg-yellow-500/10 text-yellow-500",
  },
  completed: {
    label: "تکمیل شده",
    className: "bg-green-500/10 text-green-500",
  },
  overdue: {
    label: "عقب‌افتاده",
    className: "bg-red-500/10 text-red-500",
  },
};

const priorityConfig: Record<
  MaintenancePriority,
  { label: string; className: string }
> = {
  low: { label: "کم", className: "bg-secondary text-secondary-foreground" },
  medium: { label: "متوسط", className: "bg-blue-500/10 text-blue-500" },
  high: { label: "بالا", className: "bg-yellow-500/10 text-yellow-500" },
  critical: { label: "بحرانی", className: "bg-red-500/10 text-red-500" },
};

export function RecentBookings() {
  const recentBookings = mockBookings.slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>رزروهای اخیر</CardTitle>
          <CardDescription>آخرین درخواست‌های رزرو اماکن</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/bookings" className="flex items-center gap-1">
            مشاهده همه
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px] pr-4">
          <div className="space-y-4">
            {recentBookings.map((booking) => {
              const status = statusConfig[booking.status];
              return (
                <div
                  key={booking.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {booking.userName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="font-medium truncate">{booking.userName}</h4>
                      <Badge
                        variant="outline"
                        className={cn(
                          "shrink-0",
                          status.variant === "success" && "border-green-500 text-green-500",
                          status.variant === "warning" && "border-yellow-500 text-yellow-500",
                          status.variant === "destructive" && "border-red-500 text-red-500"
                        )}
                      >
                        {status.icon}
                        <span className="mr-1">{status.label}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{booking.purpose}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {booking.venueName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(booking.startTime).toLocaleDateString("fa-IR")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(booking.startTime).toLocaleTimeString("fa-IR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {toPersianDigits(booking.attendees)} نفر
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export function MaintenanceAlerts() {
  const alerts = mockMaintenanceTasks.filter(
    (task) => task.status === "overdue" || task.status === "in_progress"
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>هشدارهای نگهداری</CardTitle>
          <CardDescription>کارهای عقب‌افتاده و در حال انجام</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/maintenance" className="flex items-center gap-1">
            مشاهده همه
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((task) => {
            const status = maintenanceStatusConfig[task.status];
            const priority = priorityConfig[task.priority];
            return (
              <div
                key={task.id}
                className="p-4 rounded-lg border border-border bg-card hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-medium">{task.titleFa}</h4>
                  <Badge className={cn("shrink-0", status.className)}>{status.label}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={priority.className}>
                      اولویت: {priority.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 inline ml-1" />
                      {task.venueName}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    موعد:{" "}
                    {task.scheduledDate
                      ? new Date(task.scheduledDate).toLocaleDateString("fa-IR")
                      : "—"}
                  </span>
                </div>
              </div>
            );
          })}
          {alerts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
              <p>هشدار فعالی وجود ندارد</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function QuickActions() {
  const actions = [
    { label: "رزرو جدید", href: "/bookings/new", icon: Calendar },
    { label: "ثبت مکان", href: "/venues/new", icon: MapPin },
    { label: "گزارش تعمیرات", href: "/maintenance/new", icon: AlertCircle },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>دسترسی سریع</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {actions.map((action) => (
            <Button
              key={action.href}
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              asChild
            >
              <Link href={action.href}>
                <action.icon className="h-5 w-5 text-primary" />
                <span>{action.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
