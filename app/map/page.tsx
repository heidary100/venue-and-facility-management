"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapFilters } from "@/components/map/map-filters";
import { BookingForm } from "@/components/bookings/booking-form";
import { mockVenues, mockUniversities, mockBookings } from "@/lib/mock-data";
import { Venue, VenueType, VenueStatus } from "@/lib/types";
import { filterVenues, generateHeatmapData } from "@/lib/map-utils";
import {
  Map,
  Layers,
  MapPin,
  TrendingUp,
  Building2,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toPersianDigits } from "@/lib/booking-utils";
import { toast } from "sonner";

// Dynamic import to avoid SSR issues with Leaflet
const VenueMap = dynamic(
  () => import("@/components/map/venue-map").then((mod) => mod.VenueMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg border border-border">
        <div className="text-center space-y-4">
          <Map className="h-12 w-12 mx-auto text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">در حال بارگذاری نقشه...</p>
        </div>
      </div>
    ),
  }
);

export default function MapPage() {
  const [mounted, setMounted] = React.useState(false);
  const [venues] = React.useState<Venue[]>(mockVenues);
  const [filteredVenues, setFilteredVenues] = React.useState<Venue[]>(mockVenues);
  const [selectedVenue, setSelectedVenue] = React.useState<Venue | null>(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = React.useState(false);
  const [showHeatmap, setShowHeatmap] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  // Filter states
  const [filters, setFilters] = React.useState<{
    search?: string;
    types?: VenueType[];
    statuses?: VenueStatus[];
    universityIds?: string[];
    hasAccessibility?: boolean;
  }>({});

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Apply filters
  React.useEffect(() => {
    const filtered = filterVenues(venues, filters);
    setFilteredVenues(filtered);
  }, [venues, filters]);

  const activeFiltersCount = React.useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.types && filters.types.length > 0) count += filters.types.length;
    if (filters.statuses && filters.statuses.length > 0) count += filters.statuses.length;
    if (filters.universityIds && filters.universityIds.length > 0)
      count += filters.universityIds.length;
    if (filters.hasAccessibility !== undefined) count++;
    return count;
  }, [filters]);

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  const handleTypeChange = (types: VenueType[]) => {
    setFilters((prev) => ({ ...prev, types }));
  };

  const handleStatusChange = (statuses: VenueStatus[]) => {
    setFilters((prev) => ({ ...prev, statuses }));
  };

  const handleUniversityChange = (universityIds: string[]) => {
    setFilters((prev) => ({ ...prev, universityIds }));
  };

  const handleAccessibilityChange = (hasAccessibility: boolean | undefined) => {
    setFilters((prev) => ({ ...prev, hasAccessibility }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleVenueSelect = (venue: Venue) => {
    setSelectedVenue(venue);
  };

  const handleBookVenue = (venue: Venue) => {
    setSelectedVenue(venue);
    setIsBookingDialogOpen(true);
  };

  const handleBookingSubmit = (data: any) => {
    console.log("Booking submitted:", data);
    setIsBookingDialogOpen(false);
    toast.success("درخواست رزرو با موفقیت ثبت شد", {
      description: "درخواست شما در انتظار تأیید مدیر است.",
    });
  };

  // Statistics
  const stats = React.useMemo(() => {
    return {
      total: filteredVenues.length,
      active: filteredVenues.filter((v) => v.status === "active").length,
      avgUtilization:
        filteredVenues.reduce((sum, v) => sum + v.utilizationRate, 0) /
        filteredVenues.length || 0,
      universities: new Set(filteredVenues.map((v) => v.universityId)).size,
    };
  }, [filteredVenues]);

  if (!mounted) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 h-[calc(100vh-8rem)]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">نقشه سالن‌ها</h1>
            <p className="text-muted-foreground mt-1">
              مشاهده و جستجوی سالن‌های ورزشی روی نقشه
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={showHeatmap ? "default" : "outline"}
              onClick={() => setShowHeatmap(!showHeatmap)}
              className="gap-2"
            >
              <Activity className="h-4 w-4" />
              نقشه حرارتی
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="gap-2 lg:hidden"
            >
              <Layers className="h-4 w-4" />
              فیلترها
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    کل سالن‌ها
                  </p>
                  <p className="text-2xl font-bold">
                    {toPersianDigits(stats.total.toString())}
                  </p>
                </div>
                <MapPin className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    سالن‌های فعال
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {toPersianDigits(stats.active.toString())}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    میانگین استفاده
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {toPersianDigits(Math.round(stats.avgUtilization).toString())}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    دانشگاه‌ها
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {toPersianDigits(stats.universities.toString())}
                  </p>
                </div>
                <Building2 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map and Filters */}
        <div className="grid lg:grid-cols-[320px_1fr] gap-4 h-[calc(100%-12rem)]">
          {/* Filters Sidebar */}
          <div
            className={cn(
              "lg:block",
              isSidebarOpen ? "block" : "hidden"
            )}
          >
            <MapFilters
              onSearchChange={handleSearchChange}
              onTypeChange={handleTypeChange}
              onStatusChange={handleStatusChange}
              onUniversityChange={handleUniversityChange}
              onAccessibilityChange={handleAccessibilityChange}
              universities={mockUniversities}
              activeFiltersCount={activeFiltersCount}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Map */}
          <div className="h-full min-h-[500px]">
            <VenueMap
              venues={filteredVenues}
              selectedVenueId={selectedVenue?.id}
              onVenueSelect={handleVenueSelect}
              onBookVenue={handleBookVenue}
              showHeatmap={showHeatmap}
            />
          </div>
        </div>

        {/* Results Info */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>
              {toPersianDigits(filteredVenues.length.toString())} سالن یافت شد
            </span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">
                {toPersianDigits(activeFiltersCount.toString())} فیلتر فعال
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Booking Dialog */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>رزرو {selectedVenue?.nameFa}</DialogTitle>
            <DialogDescription>
              فرم زیر را برای ثبت درخواست رزرو تکمیل کنید
            </DialogDescription>
          </DialogHeader>
          {selectedVenue && (
            <BookingForm
              venues={venues}
              existingBookings={mockBookings}
              onSubmit={handleBookingSubmit}
              initialVenueId={selectedVenue.id}
            />
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
