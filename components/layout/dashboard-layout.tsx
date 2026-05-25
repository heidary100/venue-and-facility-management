"use client";

import * as React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { RoleGuard } from "@/components/role-guard";
import { useUser } from "@/providers/user-provider";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useUser();

  return (
    <div className="flex min-h-screen bg-background" dir="rtl">
      <Sidebar userRole={user.role} />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <RoleGuard>{children}</RoleGuard>
          </div>
        </main>
      </div>
    </div>
  );
}
