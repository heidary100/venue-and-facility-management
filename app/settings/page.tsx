"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Key,
  Save,
} from "lucide-react";

export default function SettingsPage() {
  const [notifications, setNotifications] = React.useState({
    email: true,
    push: true,
    bookings: true,
    maintenance: true,
    reports: false,
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">تنظیمات</h1>
          <p className="text-muted-foreground">مدیریت تنظیمات سیستم و حساب کاربری</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="flex-wrap">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              پروفایل
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              اعلان‌ها
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="h-4 w-4" />
              ظاهر
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              امنیت
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>اطلاعات پروفایل</CardTitle>
                <CardDescription>اطلاعات شخصی و حساب کاربری خود را مدیریت کنید</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">نام و نام خانوادگی</Label>
                    <Input id="name" defaultValue="علی احمدی" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">ایمیل</Label>
                    <Input id="email" type="email" defaultValue="ali.ahmadi@university.ac.ir" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">شماره تماس</Label>
                    <Input id="phone" defaultValue="۰۹۱۲۳۴۵۶۷۸۹" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="university">دانشگاه</Label>
                    <Select defaultValue="tehran">
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب دانشگاه" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tehran">دانشگاه تهران</SelectItem>
                        <SelectItem value="sharif">دانشگاه شریف</SelectItem>
                        <SelectItem value="amirkabir">دانشگاه امیرکبیر</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-end">
                  <Button className="gap-2">
                    <Save className="h-4 w-4" />
                    ذخیره تغییرات
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>تنظیمات اعلان‌ها</CardTitle>
                <CardDescription>نحوه دریافت اعلان‌ها را تنظیم کنید</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>اعلان‌های ایمیلی</Label>
                      <p className="text-sm text-muted-foreground">
                        دریافت اعلان‌ها از طریق ایمیل
                      </p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, email: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>اعلان‌های پوش</Label>
                      <p className="text-sm text-muted-foreground">
                        دریافت اعلان‌های فوری در مرورگر
                      </p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, push: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>رزروها</Label>
                      <p className="text-sm text-muted-foreground">
                        اطلاع‌رسانی درباره رزروهای جدید و تغییرات
                      </p>
                    </div>
                    <Switch
                      checked={notifications.bookings}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, bookings: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>نگهداری</Label>
                      <p className="text-sm text-muted-foreground">
                        هشدارهای مربوط به تعمیرات و نگهداری
                      </p>
                    </div>
                    <Switch
                      checked={notifications.maintenance}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, maintenance: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>گزارش‌ها</Label>
                      <p className="text-sm text-muted-foreground">
                        اطلاع‌رسانی هنگام آماده شدن گزارش‌های جدید
                      </p>
                    </div>
                    <Switch
                      checked={notifications.reports}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, reports: checked })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>تنظیمات ظاهری</CardTitle>
                <CardDescription>ظاهر و نمایش سیستم را شخصی‌سازی کنید</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>تم</Label>
                    <Select defaultValue="dark">
                      <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="انتخاب تم" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">روشن</SelectItem>
                        <SelectItem value="dark">تاریک</SelectItem>
                        <SelectItem value="system">سیستم</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>زبان</Label>
                    <Select defaultValue="fa">
                      <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="انتخاب زبان" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fa">فارسی</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ar">العربية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>اندازه فونت</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="انتخاب اندازه" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">کوچک</SelectItem>
                        <SelectItem value="medium">متوسط</SelectItem>
                        <SelectItem value="large">بزرگ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>تنظیمات امنیتی</CardTitle>
                <CardDescription>رمز عبور و امنیت حساب خود را مدیریت کنید</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">رمز عبور فعلی</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">رمز عبور جدید</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">تکرار رمز عبور جدید</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>احراز هویت دو مرحله‌ای</Label>
                    <p className="text-sm text-muted-foreground">
                      افزایش امنیت حساب با تأیید دو مرحله‌ای
                    </p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex justify-end">
                  <Button className="gap-2">
                    <Key className="h-4 w-4" />
                    تغییر رمز عبور
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
