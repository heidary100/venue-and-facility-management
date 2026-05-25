"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import type { UserRole } from "@/lib/types";
import { useUser } from "@/providers/user-provider";
import { canAccessAdminDashboard, isStudentRole } from "@/lib/role-utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const routeRoles: Record<string, UserRole[]> = {
  "/dashboard": ["admin_national", "admin_regional", "university_manager", "facility_staff", "student", "athlete"],
  "/venues": ["admin_national", "admin_regional", "university_manager", "facility_staff", "student", "athlete"],
  "/bookings": ["admin_national", "admin_regional", "university_manager", "facility_staff", "student", "athlete"],
  "/map": ["admin_national", "admin_regional", "university_manager", "facility_staff"],
  "/maintenance": ["admin_national", "admin_regional", "university_manager", "facility_staff"],
  "/reports": ["admin_national", "admin_regional", "university_manager"],
  "/audit": ["admin_national", "admin_regional"],
  "/settings": ["admin_national", "admin_regional", "university_manager"],
};

export function RoleGuard({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    if (isStudentRole(user.role) && pathname === "/dashboard") {
      router.replace("/bookings");
    }
  }, [user.role, pathname, router]);

  const basePath = pathname?.split("/").slice(0, 2).join("/") || "/";
  const allowed = routeRoles[basePath];

  if (allowed && !allowed.includes(user.role)) {
    return (
      <Card className="max-w-lg mx-auto mt-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-destructive" />
            دسترسی غیرمجاز
          </CardTitle>
          <CardDescription>شما به این بخش دسترسی ندارید.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/bookings">بازگشت به رزرو</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}

export function useRoleAccess() {
  const { user } = useUser();
  return {
    user,
    isStudent: isStudentRole(user.role),
    canAdminDashboard: canAccessAdminDashboard(user.role),
  };
}
