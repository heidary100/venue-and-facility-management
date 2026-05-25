"use client";

import Link from "next/link";
import { Calendar, List, Building2, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fa } from "@/lib/i18n/fa";
import { useUser } from "@/providers/user-provider";
import { filterBookingsByRole, getScopeDescription } from "@/lib/role-utils";
import { mockBookings, toPersianDigits } from "@/lib/mock-data";

export function StudentDashboard() {
  const { user } = useUser();
  const myBookings = filterBookingsByRole(mockBookings, user);
  const pending = myBookings.filter((b) => b.status === "pending").length;
  const upcoming = myBookings.filter(
    (b) =>
      (b.status === "approved" || b.status === "pending") &&
      new Date(b.startTime) > new Date()
  ).length;

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">{fa.dashboard.studentTitle}</h1>
        <p className="text-muted-foreground mt-1">{fa.dashboard.studentSubtitle}</p>
        <p className="text-sm text-primary mt-2">{getScopeDescription(user)}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-card">
          <CardHeader>
            <CardTitle className="text-lg">رزروهای در انتظار</CardTitle>
            <CardDescription>درخواست‌هایی که منتظر تأیید هستند</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{toPersianDigits(pending)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">رزروهای آینده</CardTitle>
            <CardDescription>رزروهای تأییدشده پیش رو</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-emerald-600">{toPersianDigits(upcoming)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <Calendar className="h-8 w-8 text-primary mb-2" />
            <CardTitle>رزرو جدید</CardTitle>
            <CardDescription>ثبت درخواست رزرو سالن ورزشی</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/bookings">
                شروع رزرو
                <ArrowLeft className="mr-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <List className="h-8 w-8 text-primary mb-2" />
            <CardTitle>رزروهای من</CardTitle>
            <CardDescription>مشاهده و لغو رزروهای شخصی</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <Link href="/bookings">مشاهده لیست</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <Building2 className="h-8 w-8 text-primary mb-2" />
            <CardTitle>مشاهده اماکن</CardTitle>
            <CardDescription>جستجو و مشاهده اطلاعات سالن‌ها</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <Link href="/venues">لیست اماکن</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
