"use client";

import { Suspense } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ErrorBoundary } from "@/components/error-boundary";
import { PageLoader } from "@/components/ui/page-loader";
import { Phase2Dashboard } from "@/components/dashboard/phase2-dashboard";
import { StudentDashboard } from "@/components/dashboard/student-dashboard";
import { useRoleAccess } from "@/components/role-guard";

function DashboardContent() {
  const { canAdminDashboard } = useRoleAccess();
  if (!canAdminDashboard) {
    return <StudentDashboard />;
  }
  return <Phase2Dashboard />;
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <ErrorBoundary fallbackTitle="خطا در بارگذاری داشبورد">
        <Suspense fallback={<PageLoader />}>
          <DashboardContent />
        </Suspense>
      </ErrorBoundary>
    </DashboardLayout>
  );
}
