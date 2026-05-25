"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockVenues, toPersianDigits } from "@/lib/mock-data";
import {
  MapPin,
  Layers,
  Navigation,
  ZoomIn,
  ZoomOut,
  Locate,
  Building2,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { VenueStatus, VenueType } from "@/lib/types";

const statusConfig: Record<VenueStatus, { label: string; color: string }> = {
  active: { label: "فعال", color: "#22c55e" },
  maintenance: { label: "در حال تعمیر", color: "#eab308" },
  closed: { label: "بسته", color: "#ef4444" },
  reserved: { label: "رزرو شده", color: "#3b82f6" },
};

const typeLabels: Record<VenueType, string> = {
  stadium: "استادیوم",
  gym: "سالن ورزشی",
  pool: "استخر",
  court: "زمین بازی",
  field: "چمن",
  track: "پیست",
  arena: "آرنا",
  other: "سایر",
};

// Placeholder map component - in production, integrate with Leaflet/OpenStreetMap
function MapPlaceholder() {
  const [selectedVenue, setSelectedVenue] = React.useState<string | null>(null);

  return (
    <div className="relative w-full h-full bg-secondary/20 rounded-lg overflow-hidden">
      {/* Map Background Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--border) 1px, transparent 1px),
            linear-gradient(to bottom, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Map Placeholder Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <MapPin className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">نقشه اماکن ورزشی</h3>
          <p className="text-sm text-muted-foreground mb-4">
            برای استفاده از نقشه، Leaflet یا OpenStreetMap را یکپارچه کنید
          </p>
          <Badge variant="outline">در حال توسعه</Badge>
        </div>
      </div>

      {/* Venue Markers (Simulated) */}
      <div className="absolute inset-0 pointer-events-none">
        {mockVenues.map((venue, index) => {
          const offsetX = 15 + (index * 12) % 70;
          const offsetY = 20 + (index * 15) % 60;
          const status = statusConfig[venue.status];

          return (
            <div
              key={venue.id}
              className="absolute pointer-events-auto cursor-pointer group"
              style={{ left: `${offsetX}%`, top: `${offsetY}%` }}
              onClick={() => setSelectedVenue(venue.id)}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
                  selectedVenue === venue.id && "ring-2 ring-primary ring-offset-2"
                )}
                style={{ backgroundColor: status.color }}
              >
                <Building2 className="h-4 w-4 text-white" />
              </div>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-popover border border-border rounded-lg shadow-lg p-2 text-xs whitespace-nowrap">
                  <p className="font-medium">{venue.nameFa}</p>
                  <p className="text-muted-foreground">{venue.location.city}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button variant="secondary" size="icon" className="h-10 w-10 shadow-lg">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" className="h-10 w-10 shadow-lg">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" className="h-10 w-10 shadow-lg">
          <Locate className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" className="h-10 w-10 shadow-lg">
          <Layers className="h-4 w-4" />
        </Button>
      </div>

      {/* Selected Venue Info */}
      {selectedVenue && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:w-80">
          <Card>
            <CardContent className="p-4">
              {(() => {
                const venue = mockVenues.find((v) => v.id === selectedVenue);
                if (!venue) return null;
                const status = statusConfig[venue.status];
                return (
                  <>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-semibold">{venue.nameFa}</h4>
                      <Badge style={{ backgroundColor: `${status.color}20`, color: status.color }}>
                        {status.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{venue.universityName}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <MapPin className="h-3 w-3" />
                      <span>{venue.location.addressFa}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{typeLabels[venue.type]}</Badge>
                      <span className="text-sm">
                        ظرفیت: <strong>{toPersianDigits(venue.capacity)}</strong>
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="flex-1">مشاهده جزئیات</Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Navigation className="h-4 w-4 ml-1" />
                        مسیریابی
                      </Button>
                    </div>
                  </>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function MapPage() {
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  return (
    <DashboardLayout>
      <div className="space-y-6 h-[calc(100vh-10rem)]">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">نقشه اماکن</h1>
            <p className="text-muted-foreground">مشاهده موقعیت جغرافیایی اماکن ورزشی</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="نوع مکان" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه انواع</SelectItem>
                <SelectItem value="stadium">استادیوم</SelectItem>
                <SelectItem value="gym">سالن ورزشی</SelectItem>
                <SelectItem value="pool">استخر</SelectItem>
                <SelectItem value="court">زمین بازی</SelectItem>
                <SelectItem value="field">چمن</SelectItem>
                <SelectItem value="track">پیست</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="وضعیت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                <SelectItem value="active">فعال</SelectItem>
                <SelectItem value="maintenance">در حال تعمیر</SelectItem>
                <SelectItem value="closed">بسته</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Map Container */}
        <Card className="flex-1 h-[calc(100%-5rem)]">
          <CardContent className="p-0 h-full">
            <MapPlaceholder />
          </CardContent>
        </Card>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 justify-center">
          {Object.entries(statusConfig).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: value.color }} />
              <span className="text-sm text-muted-foreground">{value.label}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
