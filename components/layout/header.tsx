"use client";

import * as React from "react";
import { Bell, Search, ChevronDown, UserCog } from "lucide-react";
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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileSidebar } from "@/components/layout/sidebar";
import { useUser } from "@/providers/user-provider";
import { roleLabels, fa } from "@/lib/i18n/fa";
import { demoUsers } from "@/lib/mock-data";
import type { UserRole } from "@/lib/types";
import { toast } from "sonner";

export function Header() {
  const { user, setUser } = useUser();

  const handleRoleSwitch = (role: UserRole) => {
    const match = demoUsers.find((u) => u.role === role);
    if (match) {
      setUser(match);
      toast.info(`نقش نمایشی: ${roleLabels[role]}`, {
        description: "در محیط واقعی از SSO/API احراز هویت استفاده می‌شود.",
      });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        <div className="flex items-center gap-3">
          <MobileSidebar userRole={user.role} />

          <div className="hidden md:flex relative w-64 lg:w-80">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="جستجو در اماکن، رزروها..."
              className="pr-10 bg-secondary border-0"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>

          <ThemeToggle />

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
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {roleLabels[user.role]}
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
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="flex items-center gap-2 text-xs text-muted-foreground">
                <UserCog className="h-3 w-3" />
                {fa.roles.switchUser}
              </DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={user.role}
                onValueChange={(v) => handleRoleSwitch(v as UserRole)}
              >
                {demoUsers.map((u) => (
                  <DropdownMenuRadioItem key={u.id} value={u.role}>
                    {roleLabels[u.role]}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">خروج</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
