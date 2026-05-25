"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Calendar,
  Map,
  Wrench,
  BarChart3,
  Settings,
  Users,
  Bell,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Dumbbell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { UserRole } from "@/lib/types";

interface NavItem {
  title: string;
  titleFa: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    titleFa: "داشبورد",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    roles: ["admin_national", "admin_regional", "university_manager", "facility_staff", "student", "athlete"],
  },
  {
    title: "Venues",
    titleFa: "اماکن ورزشی",
    href: "/venues",
    icon: <Building2 className="h-5 w-5" />,
    roles: ["admin_national", "admin_regional", "university_manager", "facility_staff", "student", "athlete"],
  },
  {
    title: "Bookings",
    titleFa: "رزرو",
    href: "/bookings",
    icon: <Calendar className="h-5 w-5" />,
    badge: 5,
    roles: ["admin_national", "admin_regional", "university_manager", "facility_staff", "student", "athlete"],
  },
  {
    title: "Map",
    titleFa: "نقشه",
    href: "/map",
    icon: <Map className="h-5 w-5" />,
    roles: ["admin_national", "admin_regional", "university_manager", "facility_staff", "student", "athlete"],
  },
  {
    title: "Maintenance",
    titleFa: "نگهداری",
    href: "/maintenance",
    icon: <Wrench className="h-5 w-5" />,
    badge: 3,
    roles: ["admin_national", "admin_regional", "university_manager", "facility_staff"],
  },
  {
    title: "Reports",
    titleFa: "گزارش‌ها",
    href: "/reports",
    icon: <BarChart3 className="h-5 w-5" />,
    roles: ["admin_national", "admin_regional", "university_manager"],
  },
  {
    title: "Users",
    titleFa: "کاربران",
    href: "/users",
    icon: <Users className="h-5 w-5" />,
    roles: ["admin_national", "admin_regional"],
  },
  {
    title: "Settings",
    titleFa: "تنظیمات",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
    roles: ["admin_national", "admin_regional", "university_manager"],
  },
];

interface SidebarProps {
  userRole?: UserRole;
}

export function Sidebar({ userRole = "admin_national" }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  const filteredNavItems = navItems.filter((item) => item.roles.includes(userRole));

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col h-screen bg-sidebar border-l border-sidebar-border transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
              <Dumbbell className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sidebar-foreground">ورزش دانشگاهی</span>
              <span className="text-xs text-muted-foreground">سامانه مدیریت اماکن</span>
            </div>
          </Link>
        )}
        {collapsed && (
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary mx-auto">
            <Dumbbell className="h-6 w-6 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="px-3 space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <span className={cn(isActive && "text-sidebar-primary")}>{item.icon}</span>
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.titleFa}</span>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className="h-5 min-w-5 flex items-center justify-center text-xs bg-primary text-primary-foreground"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
                {collapsed && item.badge && (
                  <Badge
                    variant="secondary"
                    className="absolute top-0 right-0 h-4 min-w-4 flex items-center justify-center text-[10px] bg-primary text-primary-foreground"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Collapse Button */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <>
              <ChevronRight className="h-4 w-4 ml-2" />
              <span>جمع کردن</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}

export function MobileSidebar({ userRole = "admin_national" }: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const filteredNavItems = navItems.filter((item) => item.roles.includes(userRole));

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">منو</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 p-0 bg-sidebar">
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
              <Dumbbell className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sidebar-foreground">ورزش دانشگاهی</span>
              <span className="text-xs text-muted-foreground">سامانه مدیریت اماکن</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4 h-[calc(100vh-4rem)]">
          <nav className="px-3 space-y-1">
            {filteredNavItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <span className={cn(isActive && "text-sidebar-primary")}>{item.icon}</span>
                  <span className="flex-1">{item.titleFa}</span>
                  {item.badge && (
                    <Badge
                      variant="secondary"
                      className="h-5 min-w-5 flex items-center justify-center text-xs bg-primary text-primary-foreground"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
