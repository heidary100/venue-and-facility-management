"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Download,
  FileText,
  TrendingUp,
  Building2,
  Calendar,
  DollarSign,
} from "lucide-react";
import { mockReportData, toPersianDigits } from "@/lib/mock-data";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const universityData = [
  { name: "دانشگاه تهران", venues: 28, utilization: 78, bookings: 420 },
  { name: "دانشگاه شریف", venues: 22, utilization: 82, bookings: 380 },
  { name: "دانشگاه امیرکبیر", venues: 18, utilization: 75, bookings: 290 },
  { name: "دانشگاه علم و صنعت", venues: 15, utilization: 68, bookings: 210 },
  { name: "دانشگاه شهید بهشتی", venues: 12, utilization: 71, bookings: 180 },
];

const venueTypeDistribution = [
  { name: "سالن ورزشی", value: 45 },
  { name: "استادیوم", value: 15 },
  { name: "استخر", value: 12 },
  { name: "زمین چمن", value: 18 },
  { name: "پیست", value: 10 },
];

const monthlyComparison = [
  { month: "فروردین", current: 65, previous: 58 },
  { month: "اردیبهشت", current: 72, previous: 65 },
  { month: "خرداد", current: 78, previous: 70 },
  { month: "تیر", current: 82, previous: 75 },
  { month: "مرداد", current: 85, previous: 78 },
  { month: "شهریور", current: 79, previous: 72 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string; dataKey: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
        <p className="font-medium mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm text-muted-foreground">
            {entry.dataKey === "current" ? "سال جاری" : entry.dataKey === "previous" ? "سال قبل" : entry.name}:{" "}
            {toPersianDigits(entry.value)}
            {entry.dataKey.includes("utilization") || entry.dataKey === "current" || entry.dataKey === "previous"
              ? "٪"
              : ""}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function ReportsPage() {
  const [period, setPeriod] = React.useState("6months");
  const [reportType, setReportType] = React.useState("utilization");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">گزارش‌ها و تحلیل</h1>
            <p className="text-muted-foreground">تحلیل عملکرد و آمار اماکن ورزشی</p>
          </div>
          <div className="flex gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="بازه زمانی" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">یک ماه</SelectItem>
                <SelectItem value="3months">سه ماه</SelectItem>
                <SelectItem value="6months">شش ماه</SelectItem>
                <SelectItem value="1year">یک سال</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              دانلود گزارش
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{toPersianDigits(156)}</p>
                  <p className="text-sm text-muted-foreground">کل اماکن</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{toPersianDigits(73.5)}٪</p>
                  <p className="text-sm text-muted-foreground">میانگین بهره‌برداری</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Calendar className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{toPersianDigits(4850)}</p>
                  <p className="text-sm text-muted-foreground">رزرو در ۶ ماه</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/10">
                  <DollarSign className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{toPersianDigits(365)}</p>
                  <p className="text-sm text-muted-foreground">میلیون تومان درآمد</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts */}
        <Tabs defaultValue="utilization" className="space-y-4">
          <TabsList>
            <TabsTrigger value="utilization">بهره‌برداری</TabsTrigger>
            <TabsTrigger value="bookings">رزروها</TabsTrigger>
            <TabsTrigger value="comparison">مقایسه</TabsTrigger>
            <TabsTrigger value="distribution">توزیع</TabsTrigger>
          </TabsList>

          <TabsContent value="utilization">
            <Card>
              <CardHeader>
                <CardTitle>روند بهره‌برداری ماهانه</CardTitle>
                <CardDescription>نرخ بهره‌برداری از اماکن ورزشی در ۶ ماه گذشته</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockReportData}>
                      <defs>
                        <linearGradient id="colorUtil" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="period" stroke="var(--muted-foreground)" fontSize={12} />
                      <YAxis
                        stroke="var(--muted-foreground)"
                        fontSize={12}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="utilization"
                        stroke="var(--chart-1)"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorUtil)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>آمار رزروها</CardTitle>
                <CardDescription>تعداد رزروهای ثبت شده به تفکیک ماه</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockReportData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="period" stroke="var(--muted-foreground)" fontSize={12} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="bookings" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison">
            <Card>
              <CardHeader>
                <CardTitle>مقایسه سال جاری با سال قبل</CardTitle>
                <CardDescription>مقایسه نرخ بهره‌برداری در دو سال متوالی</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyComparison}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                      <YAxis
                        stroke="var(--muted-foreground)"
                        fontSize={12}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        formatter={(value) => (value === "current" ? "سال جاری" : "سال قبل")}
                      />
                      <Line
                        type="monotone"
                        dataKey="current"
                        stroke="var(--chart-1)"
                        strokeWidth={2}
                        dot={{ fill: "var(--chart-1)" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="previous"
                        stroke="var(--chart-3)"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: "var(--chart-3)" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="distribution">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>توزیع انواع اماکن</CardTitle>
                  <CardDescription>درصد هر نوع مکان ورزشی</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={venueTypeDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {venueTypeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
                                  <p className="font-medium">{data.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {toPersianDigits(data.value)} مکان
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {venueTypeDistribution.map((entry, index) => (
                      <div key={entry.name} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>عملکرد دانشگاه‌ها</CardTitle>
                  <CardDescription>مقایسه تعداد اماکن و بهره‌برداری</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={universityData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
                        <YAxis
                          dataKey="name"
                          type="category"
                          stroke="var(--muted-foreground)"
                          fontSize={11}
                          width={100}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="venues" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle>خروجی گزارش</CardTitle>
            <CardDescription>دانلود گزارش‌ها در فرمت‌های مختلف</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                PDF
              </Button>
              <Button variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                Excel
              </Button>
              <Button variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
