import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DashboardKPIs } from "@/components/dashboard/kpi-cards";
import { UtilizationChart, BookingsChart, VenueTypesChart } from "@/components/dashboard/charts";
import { RecentBookings, MaintenanceAlerts, QuickActions } from "@/components/dashboard/widgets";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-bold">داشبورد</h1>
          <p className="text-muted-foreground">
            خلاصه وضعیت اماکن ورزشی و شاخص‌های کلیدی عملکرد
          </p>
        </div>

        {/* KPI Cards */}
        <DashboardKPIs />

        {/* Quick Actions */}
        <QuickActions />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UtilizationChart />
          <BookingsChart />
        </div>

        {/* Widgets Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentBookings />
          </div>
          <div className="space-y-6">
            <VenueTypesChart />
            <MaintenanceAlerts />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
