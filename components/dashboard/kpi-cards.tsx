"use client";

import * as React from "react";
import {
  Building2,
  Users,
  TrendingUp,
  Wrench,
  Star,
  Calendar,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { mockDashboardKPIs, toPersianDigits } from "@/lib/mock-data";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning" | "danger";
}

function KPICard({ title, value, subtitle, icon, trend, variant = "default" }: KPICardProps) {
  const variantStyles = {
    default: "bg-card",
    success: "bg-card border-l-4 border-l-[var(--success)]",
    warning: "bg-card border-l-4 border-l-[var(--warning)]",
    danger: "bg-card border-l-4 border-l-destructive",
  };

  return (
    <Card className={cn("transition-all hover:shadow-lg", variantStyles[variant])}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="p-2 rounded-lg bg-secondary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl md:text-3xl font-bold">{value}</span>
          {trend && (
            <span
              className={cn(
                "flex items-center text-sm font-medium",
                trend.isPositive ? "text-[var(--success)]" : "text-destructive"
              )}
            >
              {trend.isPositive ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
              {toPersianDigits(trend.value)}٪
            </span>
          )}
        </div>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}

export function DashboardKPIs() {
  const kpis = mockDashboardKPIs;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        title="کل اماکن ورزشی"
        value={toPersianDigits(kpis.totalVenues)}
        subtitle={`${toPersianDigits(kpis.activeVenues)} مکان فعال`}
        icon={<Building2 className="h-5 w-5 text-primary" />}
        trend={{ value: 8, isPositive: true }}
      />
      <KPICard
        title="نرخ بهره‌برداری"
        value={`${toPersianDigits(kpis.utilizationRate)}٪`}
        subtitle="میانگین ماهانه"
        icon={<TrendingUp className="h-5 w-5 text-primary" />}
        trend={{ value: 5.2, isPositive: true }}
        variant="success"
      />
      <KPICard
        title="هشدارهای نگهداری"
        value={toPersianDigits(kpis.maintenanceAlerts)}
        subtitle={`${toPersianDigits(3)} مورد بحرانی`}
        icon={<Wrench className="h-5 w-5 text-[var(--warning)]" />}
        variant="warning"
      />
      <KPICard
        title="امتیاز رضایت"
        value={`${toPersianDigits(kpis.satisfactionScore)}`}
        subtitle="از ۵ امتیاز"
        icon={<Star className="h-5 w-5 text-[var(--warning)]" />}
        trend={{ value: 2.1, isPositive: true }}
      />
      <KPICard
        title="اشغال امروز"
        value={`${toPersianDigits(kpis.occupancyToday)}٪`}
        subtitle="وضعیت لحظه‌ای"
        icon={<Clock className="h-5 w-5 text-primary" />}
      />
      <KPICard
        title="کل رزروها"
        value={toPersianDigits(kpis.totalBookings)}
        subtitle="در این ماه"
        icon={<Calendar className="h-5 w-5 text-primary" />}
        trend={{ value: 12, isPositive: true }}
      />
      <KPICard
        title="رزروهای در انتظار"
        value={toPersianDigits(kpis.pendingBookings)}
        subtitle="نیاز به تأیید"
        icon={<AlertTriangle className="h-5 w-5 text-destructive" />}
        variant="danger"
      />
      <KPICard
        title="کاربران فعال"
        value={toPersianDigits(2847)}
        subtitle="در ۳۰ روز گذشته"
        icon={<Users className="h-5 w-5 text-primary" />}
        trend={{ value: 15, isPositive: true }}
      />
    </div>
  );
}
