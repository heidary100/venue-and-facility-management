"use client";

import * as React from "react";
import { Suspense } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ErrorBoundary } from "@/components/error-boundary";
import { PageLoader } from "@/components/ui/page-loader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileSearch, Construction } from "lucide-react";
import { fa } from "@/lib/i18n/fa";
import { formatPersianDate } from "@/lib/booking-utils";

const placeholderLogs = [
  {
    id: "1",
    action: "ورود به سیستم",
    user: "علی احمدی",
    module: "احراز هویت",
    at: new Date(),
  },
  {
    id: "2",
    action: "تأیید رزرو",
    user: "حسین کریمی",
    module: "رزرو",
    at: new Date(Date.now() - 3600000),
  },
  {
    id: "3",
    action: "ثبت درخواست نگهداری",
    user: "مریم رضایی",
    module: "نگهداری",
    at: new Date(Date.now() - 7200000),
  },
];

function AuditContent() {
  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-primary/10">
          <FileSearch className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{fa.audit.title}</h1>
          <p className="text-muted-foreground mt-1">{fa.audit.subtitle}</p>
        </div>
      </div>

      <Card className="border-dashed border-amber-500/40 bg-amber-500/5">
        <CardContent className="pt-6 flex items-center gap-3">
          <Construction className="h-5 w-5 text-amber-600 shrink-0" />
          <p className="text-sm text-muted-foreground">{fa.audit.placeholder}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>نمونه لاگ (موقت)</CardTitle>
          <CardDescription>داده‌های نمایشی تا اتصال API</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">عملیات</TableHead>
                <TableHead className="text-right">کاربر</TableHead>
                <TableHead className="text-right">ماژول</TableHead>
                <TableHead className="text-right">زمان</TableHead>
                <TableHead className="text-right">وضعیت</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {placeholderLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.action}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{log.module}</TableCell>
                  <TableCell>{formatPersianDate(log.at)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">نمونه</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AuditPage() {
  return (
    <DashboardLayout>
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <AuditContent />
        </Suspense>
      </ErrorBoundary>
    </DashboardLayout>
  );
}
