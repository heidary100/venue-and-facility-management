"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Plus,
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  User,
  MapPin,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockMaintenanceTasks, mockVenues, toPersianDigits } from "@/lib/mock-data";
import type { MaintenanceStatus, MaintenancePriority, MaintenanceType } from "@/lib/types";

const statusConfig: Record<MaintenanceStatus, { label: string; className: string; icon: React.ReactNode }> = {
  scheduled: {
    label: "برنامه‌ریزی شده",
    className: "bg-blue-500/10 text-blue-500",
    icon: <Calendar className="h-4 w-4" />,
  },
  in_progress: {
    label: "در حال انجام",
    className: "bg-yellow-500/10 text-yellow-500",
    icon: <Clock className="h-4 w-4" />,
  },
  completed: {
    label: "تکمیل شده",
    className: "bg-green-500/10 text-green-500",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  overdue: {
    label: "عقب‌افتاده",
    className: "bg-red-500/10 text-red-500",
    icon: <AlertTriangle className="h-4 w-4" />,
  },
};

const priorityConfig: Record<MaintenancePriority, { label: string; className: string }> = {
  low: { label: "کم", className: "bg-secondary text-secondary-foreground" },
  medium: { label: "متوسط", className: "bg-blue-500/10 text-blue-500" },
  high: { label: "بالا", className: "bg-yellow-500/10 text-yellow-500" },
  critical: { label: "بحرانی", className: "bg-red-500/10 text-red-500" },
};

const typeLabels: Record<MaintenanceType, string> = {
  preventive: "پیشگیرانه",
  corrective: "اصلاحی",
  emergency: "اضطراری",
  inspection: "بازرسی",
};

// Stats for overview
const maintenanceStats = {
  total: 48,
  completed: 32,
  inProgress: 8,
  scheduled: 5,
  overdue: 3,
};

export default function MaintenancePage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [priorityFilter, setPriorityFilter] = React.useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const filteredTasks = mockMaintenanceTasks.filter((task) => {
    const matchesSearch =
      task.titleFa.includes(searchQuery) ||
      task.venueName.includes(searchQuery) ||
      task.description.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const completionRate = Math.round((maintenanceStats.completed / maintenanceStats.total) * 100);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">نگهداری و ارزیابی</h1>
            <p className="text-muted-foreground">مدیریت تعمیرات و نگهداری اماکن ورزشی</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                ثبت کار جدید
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>ثبت کار نگهداری جدید</DialogTitle>
                <DialogDescription>اطلاعات کار نگهداری یا تعمیرات را وارد کنید</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="venue">مکان ورزشی</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب مکان" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockVenues.map((venue) => (
                        <SelectItem key={venue.id} value={venue.id}>
                          {venue.nameFa}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="title">عنوان کار</Label>
                  <Input id="title" placeholder="مثال: تعمیر سیستم روشنایی" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">نوع کار</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب نوع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="preventive">پیشگیرانه</SelectItem>
                        <SelectItem value="corrective">اصلاحی</SelectItem>
                        <SelectItem value="emergency">اضطراری</SelectItem>
                        <SelectItem value="inspection">بازرسی</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="priority">اولویت</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب اولویت" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">کم</SelectItem>
                        <SelectItem value="medium">متوسط</SelectItem>
                        <SelectItem value="high">بالا</SelectItem>
                        <SelectItem value="critical">بحرانی</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="assignee">مسئول انجام</Label>
                  <Input id="assignee" placeholder="نام مسئول" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">تاریخ موعد</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">توضیحات</Label>
                  <Textarea id="description" placeholder="شرح کار نگهداری..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  انصراف
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>ثبت</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{toPersianDigits(maintenanceStats.total)}</p>
              <p className="text-sm text-muted-foreground">کل کارها</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-500">{toPersianDigits(maintenanceStats.completed)}</p>
              <p className="text-sm text-muted-foreground">تکمیل شده</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-yellow-500">{toPersianDigits(maintenanceStats.inProgress)}</p>
              <p className="text-sm text-muted-foreground">در حال انجام</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-500">{toPersianDigits(maintenanceStats.scheduled)}</p>
              <p className="text-sm text-muted-foreground">برنامه‌ریزی شده</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-red-500">{toPersianDigits(maintenanceStats.overdue)}</p>
              <p className="text-sm text-muted-foreground">عقب‌افتاده</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">پیشرفت کلی نگهداری</span>
              <span className="text-sm text-muted-foreground">{toPersianDigits(completionRate)}٪</span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="جستجو در کارها..."
                  className="pr-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="وضعیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                  <SelectItem value="scheduled">برنامه‌ریزی شده</SelectItem>
                  <SelectItem value="in_progress">در حال انجام</SelectItem>
                  <SelectItem value="completed">تکمیل شده</SelectItem>
                  <SelectItem value="overdue">عقب‌افتاده</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="اولویت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه اولویت‌ها</SelectItem>
                  <SelectItem value="low">کم</SelectItem>
                  <SelectItem value="medium">متوسط</SelectItem>
                  <SelectItem value="high">بالا</SelectItem>
                  <SelectItem value="critical">بحرانی</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Table */}
        <Card>
          <CardHeader>
            <CardTitle>لیست کارهای نگهداری</CardTitle>
            <CardDescription>{toPersianDigits(filteredTasks.length)} کار یافت شد</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">عنوان</TableHead>
                  <TableHead className="text-right">مکان</TableHead>
                  <TableHead className="text-right">نوع</TableHead>
                  <TableHead className="text-right">اولویت</TableHead>
                  <TableHead className="text-right">وضعیت</TableHead>
                  <TableHead className="text-right">مسئول</TableHead>
                  <TableHead className="text-right">موعد</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => {
                  const status = statusConfig[task.status];
                  const priority = priorityConfig[task.priority];
                  return (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Wrench className="h-4 w-4 text-muted-foreground" />
                          {task.titleFa}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {task.venueName}
                        </div>
                      </TableCell>
                      <TableCell>{typeLabels[task.type]}</TableCell>
                      <TableCell>
                        <Badge className={priority.className}>{priority.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("gap-1", status.className)}>
                          {status.icon}
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <User className="h-3 w-3 text-muted-foreground" />
                          {task.assignedTo}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(task.scheduledDate).toLocaleDateString("fa-IR")}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
