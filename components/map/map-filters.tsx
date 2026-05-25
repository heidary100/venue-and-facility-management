"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Filter,
  X,
  MapPin,
  Building2,
  CheckCircle2,
  Accessibility,
} from "lucide-react";
import { VenueType, VenueStatus, University } from "@/lib/types";
import { getTypeLabel, getStatusLabel } from "@/lib/map-utils";
import { cn } from "@/lib/utils";

interface MapFiltersProps {
  onSearchChange: (search: string) => void;
  onTypeChange: (types: VenueType[]) => void;
  onStatusChange: (statuses: VenueStatus[]) => void;
  onUniversityChange: (universityIds: string[]) => void;
  onAccessibilityChange: (hasAccessibility: boolean | undefined) => void;
  universities: University[];
  activeFiltersCount: number;
  onClearFilters: () => void;
}

const venueTypes: VenueType[] = [
  "stadium",
  "gym",
  "pool",
  "court",
  "field",
  "track",
  "arena",
  "other",
];

const venueStatuses: VenueStatus[] = ["active", "maintenance", "closed", "reserved"];

export function MapFilters({
  onSearchChange,
  onTypeChange,
  onStatusChange,
  onUniversityChange,
  onAccessibilityChange,
  universities,
  activeFiltersCount,
  onClearFilters,
}: MapFiltersProps) {
  const [search, setSearch] = React.useState("");
  const [selectedTypes, setSelectedTypes] = React.useState<VenueType[]>([]);
  const [selectedStatuses, setSelectedStatuses] = React.useState<VenueStatus[]>([]);
  const [selectedUniversities, setSelectedUniversities] = React.useState<string[]>([]);
  const [accessibilityFilter, setAccessibilityFilter] = React.useState<
    boolean | undefined
  >(undefined);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onSearchChange(value);
  };

  const handleTypeToggle = (type: VenueType) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(newTypes);
    onTypeChange(newTypes);
  };

  const handleStatusToggle = (status: VenueStatus) => {
    const newStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];
    setSelectedStatuses(newStatuses);
    onStatusChange(newStatuses);
  };

  const handleUniversityToggle = (universityId: string) => {
    const newUniversities = selectedUniversities.includes(universityId)
      ? selectedUniversities.filter((u) => u !== universityId)
      : [...selectedUniversities, universityId];
    setSelectedUniversities(newUniversities);
    onUniversityChange(newUniversities);
  };

  const handleAccessibilityToggle = () => {
    const newValue = accessibilityFilter === true ? undefined : true;
    setAccessibilityFilter(newValue);
    onAccessibilityChange(newValue);
  };

  const handleClearAll = () => {
    setSearch("");
    setSelectedTypes([]);
    setSelectedStatuses([]);
    setSelectedUniversities([]);
    setAccessibilityFilter(undefined);
    onClearFilters();
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            فیلترها
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="h-8 text-xs"
            >
              <X className="h-3.5 w-3.5 ml-1" />
              پاک کردن
              <Badge variant="secondary" className="mr-1 h-5 w-5 p-0 flex items-center justify-center">
                {activeFiltersCount}
              </Badge>
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-6">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                جستجو
              </Label>
              <Input
                id="search"
                placeholder="نام سالن یا آدرس..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full"
              />
            </div>

            <Separator />

            {/* Venue Type */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                نوع سالن
              </Label>
              <div className="space-y-2">
                {venueTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id={`type-${type}`}
                      checked={selectedTypes.includes(type)}
                      onCheckedChange={() => handleTypeToggle(type)}
                    />
                    <label
                      htmlFor={`type-${type}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {getTypeLabel(type)}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Status */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                وضعیت
              </Label>
              <div className="space-y-2">
                {venueStatuses.map((status) => (
                  <div key={status} className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id={`status-${status}`}
                      checked={selectedStatuses.includes(status)}
                      onCheckedChange={() => handleStatusToggle(status)}
                    />
                    <label
                      htmlFor={`status-${status}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {getStatusLabel(status)}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* University */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                دانشگاه
              </Label>
              <div className="space-y-2">
                {universities.map((university) => (
                  <div
                    key={university.id}
                    className="flex items-center space-x-2 space-x-reverse"
                  >
                    <Checkbox
                      id={`university-${university.id}`}
                      checked={selectedUniversities.includes(university.id)}
                      onCheckedChange={() => handleUniversityToggle(university.id)}
                    />
                    <label
                      htmlFor={`university-${university.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {university.nameFa}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Accessibility */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Accessibility className="h-4 w-4" />
                امکانات
              </Label>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="accessibility"
                  checked={accessibilityFilter === true}
                  onCheckedChange={handleAccessibilityToggle}
                />
                <label
                  htmlFor="accessibility"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  دسترسی برای معلولان
                </label>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
