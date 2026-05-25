"use client";

import * as React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Building2,
  TrendingUp,
  CalendarCheck,
  Star,
  Wrench,
  Filter,
  Activity,
  Info,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useUser } from "@/providers/user-provider";
import { fa, regionLabels } from "@/lib/i18n/fa";
import { getScopeDescription } from "@/lib/role-utils";
import type { RegionId } from "@/lib/types";
import {
  type DashboardFilters,
  getScopedData,
  computePhase2KPIs,
  getOccupancyTrend,
  getBookingByVenueType,
  getSatisfactionTrend,
  getTopVenuesByUsage,
  getRecentActivity,
} from "@/lib/dashboard-utils";
import { toPersianDigits } from "@/lib/mock-data";
import { formatPersianDate } from "@/lib/booking-utils";

interface KPICardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  accent?: string;
}

function KPICard({ title, value, icon, accent }: KPICardProps) {
  return (
    <Card className="overflow-hidden border-border/60 bg-gradient-to-br from-card to-card/80 hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={cn("p-2 rounded-lg bg-primary/10", accent)}>{icon}</div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl md:text-3xl font-bold tracking-tight">{value}</p>
      </CardContent>
    </Card>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
  suffix = "",
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
  suffix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 shadow-lg text-sm" dir="rtl">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-muted-foreground">
          {toPersianDigits(String(p.value))}
          {suffix}
        </p>
      ))}
    </div>
  );
}

export function Phase2Dashboard() {
  const { user } = useUser();
  const [filters, setFilters] = React.useState<DashboardFilters>({
    regionId: user.regionId ?? "all",
    universityId: user.universityId ?? "all",
  });
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(t);
  }, [filters, user.id]);

  const { venues, bookings, universities, maintenance } = getScopedData(user, filters);
  const kpis = computePhase2KPIs(venues, bookings, maintenance.length);
  const occupancyData = getOccupancyTrend();
  const bookingTypeData = getBookingByVenueType(venues, bookings);
  const satisfactionData = getSatisfactionTrend();
  const topVenues = getTopVenuesByUsage(venues, bookings);
  const activities = getRecentActivity(bookings);

  const regionOptions: { value: RegionId | "all"; label: string }[] = [
    { value: "all", label: fa.dashboard.filters.allRegions },
    ...(user.role === "admin_national"
      ? (Object.keys(regionLabels) as RegionId[]).map((id) => ({
          value: id,
          label: regionLabels[id],
        }))
      : user.regionId
        ? [{ value: user.regionId, label: regionLabels[user.regionId] }]
        : []),
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-muted rounded" />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-28 bg-muted rounded-xl" />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="h-80 bg-muted rounded-xl" />
          <div className="h-80 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{fa.dashboard.title}</h1>
          <p className="text-muted-foreground mt-1">{fa.dashboard.subtitle}</p>
          <div className="flex items-center gap-2 mt-2 text-sm text-primary">
            <Info className="h-4 w-4" />
            <span>{getScopeDescription(user)}</span>
          </div>
        </div>

        <Card className="border-dashed lg:min-w-[420px]">
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-wrap items-end gap-3">
              <Filter className="h-4 w-4 text-muted-foreground mb-2" />
              {user.role === "admin_national" && (
                <div className="flex-1 min-w-[140px]">
                  <label className="text-xs text-muted-foreground mb-1 block">
                    {fa.dashboard.filters.region}
                  </label>
                  <Select
                    value={filters.regionId ?? "all"}
                    onValueChange={(v) =>
                      setFilters((f) => ({
                        ...f,
                        regionId: v as RegionId | "all",
                        universityId: "all",
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {regionOptions.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex-1 min-w-[140px]">
                <label className="text-xs text-muted-foreground mb-1 block">
                  {fa.dashboard.filters.university}
                </label>
                <Select
                  value={filters.universityId ?? "all"}
                  onValueChange={(v) =>
                    setFilters((f) => ({ ...f, universityId: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{fa.dashboard.filters.allUniversities}</SelectItem>
                    {universities.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.nameFa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  setFilters({
                    regionId: user.regionId ?? "all",
                    universityId: user.universityId ?? "all",
                  })
                }
              >
                {fa.dashboard.filters.reset}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title={fa.dashboard.kpis.totalVenues}
          value={toPersianDigits(kpis.totalVenues)}
          icon={<Building2 className="h-5 w-5 text-primary" />}
        />
        <KPICard
          title={fa.dashboard.kpis.avgUtilization}
          value={`${toPersianDigits(kpis.avgUtilization)}٪`}
          icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
          accent="bg-emerald-500/10"
        />
        <KPICard
          title={fa.dashboard.kpis.activeBookingsToday}
          value={toPersianDigits(kpis.activeBookingsToday)}
          icon={<CalendarCheck className="h-5 w-5 text-blue-500" />}
          accent="bg-blue-500/10"
        />
        <KPICard
          title={fa.dashboard.kpis.avgSatisfaction}
          value={`${toPersianDigits(kpis.avgSatisfaction)} / ۵`}
          icon={<Star className="h-5 w-5 text-amber-500" />}
          accent="bg-amber-500/10"
        />
        <KPICard
          title={fa.dashboard.kpis.openMaintenance}
          value={toPersianDigits(kpis.openMaintenance)}
          icon={<Wrench className="h-5 w-5 text-orange-500" />}
          accent="bg-orange-500/10"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{fa.dashboard.charts.occupancy}</CardTitle>
            <CardDescription>روند ماهانه نرخ اشغال اماکن</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `${v}%`} width={40} />
                <Tooltip content={<ChartTooltip suffix="٪" />} />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{fa.dashboard.charts.bookingByType}</CardTitle>
            <CardDescription>تعداد رزرو بر اساس نوع مکان</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingTypeData.length ? bookingTypeData : [{ name: "—", count: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} width={36} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{fa.dashboard.charts.satisfaction}</CardTitle>
            <CardDescription>میانگین امتیاز رضایت کاربران</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={satisfactionData}>
                <defs>
                  <linearGradient id="satGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis domain={[3.5, 5]} width={36} />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--chart-3))"
                  fill="url(#satGrad)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{fa.dashboard.charts.topVenues}</CardTitle>
            <CardDescription>پرتکرارترین مکان‌ها بر اساس تعداد رزرو</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topVenues} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="bookings" fill="hsl(var(--chart-1))" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            {fa.dashboard.activity}
          </CardTitle>
          <CardDescription>آخرین رویدادهای رزرو و عملیات</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[280px] pr-4">
            <div className="space-y-3">
              {activities.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">{fa.common.noData}</p>
              ) : (
                activities.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4 p-3 rounded-lg border bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Badge variant="outline" className="shrink-0 text-xs">
                      {formatPersianDate(item.timestamp)}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
