"use client";

import * as React from "react";
import { Bell, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileSidebar } from "@/components/layout/sidebar";
import { currentUser } from "@/lib/mock-data";

const roleLabels: Record<string, string> = {
  admin_national: "مدیر ملی",
  admin_regional: "مدیر منطقه‌ای",
  university_manager: "مدیر ورزش دانشگاه",
  facility_staff: "کارمند تأسیسات",
  student: "دانشجو",
  athlete: "ورزشکار",
};

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Mobile Menu & Search */}
        <div className="flex items-center gap-3">
          <MobileSidebar userRole={currentUser.role} />
          
          <div className="hidden md:flex relative w-64 lg:w-80">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="جستجو در اماکن، رزروها..."
              className="pr-10 bg-secondary border-0"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Search */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center text-[10px] bg-destructive text-destructive-foreground p-0">
                  ۳
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>اعلان‌ها</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <span className="font-medium">درخواست رزرو جدید</span>
                <span className="text-xs text-muted-foreground">
                  تیم فوتبال دانشگاه تهران درخواست رزرو ورزشگاه المپیک را ثبت کرده است.
                </span>
                <span className="text-xs text-primary">۵ دقیقه پیش</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <span className="font-medium">هشدار تعمیرات</span>
                <span className="text-xs text-muted-foreground">
                  تعمیرات استخر مجموعه آبی به تأخیر افتاده است.
                </span>
                <span className="text-xs text-destructive">۱ ساعت پیش</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <span className="font-medium">گزارش ماهانه</span>
                <span className="text-xs text-muted-foreground">
                  گزارش بهره‌برداری اسفند ماه آماده شد.
                </span>
                <span className="text-xs text-primary">۳ ساعت پیش</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {currentUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium">{currentUser.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {roleLabels[currentUser.role]}
                  </span>
                </div>
                <ChevronDown className="hidden md:block h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>حساب کاربری</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>پروفایل</DropdownMenuItem>
              <DropdownMenuItem>تنظیمات</DropdownMenuItem>
              <DropdownMenuItem>راهنما</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">خروج</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
