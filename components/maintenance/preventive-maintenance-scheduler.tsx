"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  Clock,
  MoreHorizontal,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  Edit,
  Trash2,
} from "lucide-react";
import { PreventiveMaintenance } from "@/lib/types";
import {
  getFrequencyLabel,
  isMaintenanceOverdue,
} from "@/lib/maintenance-utils";
import { formatPersianDate, toPersianDigits } from "@/lib/booking-utils";
import { cn } from "@/lib/utils";

interface PreventiveMaintenanceSchedulerProps {
  schedules: PreventiveMaintenance[];
  onMarkComplete: (scheduleId: string) => void;
  onToggleActive: (scheduleId: string) => void;
  onEdit: (schedule: PreventiveMaintenance) => void;
  onDelete: (scheduleId: string) => void;
}

export function PreventiveMaintenanceScheduler({
  schedules,
  onMarkComplete,
  onToggleActive,
  onEdit,
  onDelete,
}: PreventiveMaintenanceSchedulerProps) {
  const [selectedSchedule, setSelectedSchedule] =
    React.useState<PreventiveMaintenance | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  const handleViewDetails = (schedule: PreventiveMaintenance) => {
    setSelectedSchedule(schedule);
    setIsDetailOpen(true);
  };

  const overdueSchedules = schedules.filter(
    (s) => s.isActive && isMaintenanceOverdue(s.nextScheduled)
  );
  const upcomingSchedules = schedules.filter(
    (s) => s.isActive && !isMaintenanceOverdue(s.nextScheduled)
  );

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  کل برنامه‌ها
                </p>
                <p className="text-2xl font-bold">
                  {toPersianDigits(schedules.length.toString())}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  معوق
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {toPersianDigits(overdueSchedules.length.toString())}
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
                  آینده
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {toPersianDigits(upcomingSchedules.length.toString())}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedules Table */}
      <Card>
        <CardHeader>
          <CardTitle>برنامه‌های تعمیرات پیشگیرانه</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>عنوان</TableHead>
                <TableHead>سالن</TableHead>
                <TableHead>دوره</TableHead>
                <TableHead>آخرین انجام</TableHead>
                <TableHead>زمان بعدی</TableHead>
                <TableHead>مسئول</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead className="text-left">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">
                      برنامه‌ای ثبت نشده است
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                schedules.map((schedule) => {
                  const isOverdue = isMaintenanceOverdue(schedule.nextScheduled);

                  return (
                    <TableRow key={schedule.id}>
                      <TableCell>
                        <button
                          onClick={() => handleViewDetails(schedule)}
                          className="font-medium hover:underline text-right"
                        >
                          {schedule.title}
                        </button>
                      </TableCell>
                      <TableCell>{schedule.venueName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getFrequencyLabel(schedule.frequency)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {schedule.lastPerformed
                          ? formatPersianDate(new Date(schedule.lastPerformed))
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <div
                          className={cn(
                            "flex items-center gap-2",
                            isOverdue && schedule.isActive && "text-red-600"
                          )}
                        >
                          {isOverdue && schedule.isActive && (
                            <AlertTriangle className="h-4 w-4" />
                          )}
                          {formatPersianDate(new Date(schedule.nextScheduled))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {schedule.assignedToName || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            schedule.isActive
                              ? "bg-green-500/10 text-green-600 border-green-500/20"
                              : "bg-gray-500/10 text-gray-600 border-gray-500/20"
                          }
                        >
                          {schedule.isActive ? "فعال" : "غیرفعال"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-left">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => onMarkComplete(schedule.id)}
                            >
                              <CheckCircle2 className="ml-2 h-4 w-4" />
                              ثبت انجام
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onToggleActive(schedule.id)}
                            >
                              {schedule.isActive ? (
                                <>
                                  <Pause className="ml-2 h-4 w-4" />
                                  غیرفعال کردن
                                </>
                              ) : (
                                <>
                                  <Play className="ml-2 h-4 w-4" />
                                  فعال کردن
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(schedule)}>
                              <Edit className="ml-2 h-4 w-4" />
                              ویرایش
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => onDelete(schedule.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="ml-2 h-4 w-4" />
                              حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedSchedule?.title}</DialogTitle>
            <DialogDescription>
              جزئیات برنامه تعمیرات پیشگیرانه
            </DialogDescription>
          </DialogHeader>
          {selectedSchedule && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">توضیحات</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedSchedule.description}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">چک‌لیست</h4>
                <ul className="space-y-2">
                  {selectedSchedule.checklist.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
