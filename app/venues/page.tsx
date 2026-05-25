"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Search,
  Plus,
  MoreHorizontal,
  Building2,
  MapPin,
  Users,
  Pencil,
  Trash2,
  Eye,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  Phone,
  Mail,
  Clock,
  Star,
  Calendar,
  Wrench,
  ImageIcon,
  Info,
  FileText,
  Car,
  Wifi,
  Wind,
  Accessibility,
  Coffee,
  Dumbbell,
  Armchair,
  Lightbulb,
  Volume2,
  ShowerHead,
  HeartPulse,
  Download,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockVenues, mockUniversities, mockEvaluations, mockMaintenanceTasks, mockBookings, toPersianDigits, formatPersianDate } from "@/lib/mock-data";
import type { Venue, VenueStatus, VenueType, VenueEvaluation, MaintenanceTask, Booking } from "@/lib/types";

// Status Configuration
const statusConfig: Record<VenueStatus, { label: string; className: string }> = {
  active: { label: "فعال", className: "bg-green-500/10 text-green-500 border-green-500/20" },
  maintenance: { label: "در حال تعمیر", className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  closed: { label: "بسته", className: "bg-red-500/10 text-red-500 border-red-500/20" },
  reserved: { label: "رزرو شده", className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
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

const facilityLabels = {
  parking: { label: "پارکینگ", icon: Car },
  lockerRooms: { label: "رختکن", icon: Armchair },
  showers: { label: "دوش", icon: ShowerHead },
  firstAid: { label: "کمک‌های اولیه", icon: HeartPulse },
  lighting: { label: "روشنایی", icon: Lightbulb },
  soundSystem: { label: "سیستم صوتی", icon: Volume2 },
  ac: { label: "تهویه مطبوع", icon: Wind },
  wifi: { label: "وای‌فای", icon: Wifi },
  accessibility: { label: "دسترسی معلولین", icon: Accessibility },
  cafe: { label: "کافه/بوفه", icon: Coffee },
  equipmentRental: { label: "اجاره تجهیزات", icon: Dumbbell },
  seating: { label: "صندلی تماشاچی", icon: Armchair },
};

// Pagination Component
function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <span className="text-sm text-muted-foreground px-4">
        صفحه {toPersianDigits(currentPage)} از {toPersianDigits(totalPages)}
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    </div>
  );
}

// Star Rating Component
function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const sizeClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClass,
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );
}

// Venue Form Component
function VenueForm({ 
  venue, 
  onSave, 
  onCancel 
}: { 
  venue?: Venue; 
  onSave: (data: Partial<Venue>) => void; 
  onCancel: () => void;
}) {
  const [formData, setFormData] = React.useState<Partial<Venue>>(
    venue || {
      name: "",
      nameFa: "",
      type: "gym",
      status: "active",
      capacity: 0,
      area: 0,
      location: {
        address: "",
        addressFa: "",
        lat: 35.6892,
        lng: 51.3890,
        city: "",
        province: "",
      },
      facilities: {
        parking: false,
        lockerRooms: false,
        showers: false,
        firstAid: false,
        lighting: false,
        soundSystem: false,
        ac: false,
        wifi: false,
        accessibility: false,
        cafe: false,
        equipmentRental: false,
        seating: false,
      },
      universityId: "",
      universityName: "",
      contactPhone: "",
      contactEmail: "",
      rulesFa: [],
    }
  );

  const [newRule, setNewRule] = React.useState("");

  const updateField = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateLocation = (field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location!, [field]: value }
    }));
  };

  const updateFacility = (facility: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      facilities: { ...prev.facilities!, [facility]: checked }
    }));
  };

  const addRule = () => {
    if (newRule.trim()) {
      setFormData(prev => ({
        ...prev,
        rulesFa: [...(prev.rulesFa || []), newRule.trim()]
      }));
      setNewRule("");
    }
  };

  const removeRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rulesFa: prev.rulesFa?.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto p-1">
      {/* Basic Info */}
      <div className="space-y-4">
        <h4 className="font-semibold text-sm text-muted-foreground">اطلاعات پایه</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>نام مکان (فارسی)</Label>
            <Input
              value={formData.nameFa || ""}
              onChange={(e) => updateField("nameFa", e.target.value)}
              placeholder="ورزشگاه المپیک"
            />
          </div>
          <div className="space-y-2">
            <Label>نام مکان (انگلیسی)</Label>
            <Input
              value={formData.name || ""}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Olympic Stadium"
              dir="ltr"
            />
          </div>
          <div className="space-y-2">
            <Label>نوع مکان</Label>
            <Select value={formData.type} onValueChange={(v) => updateField("type", v)}>
              <SelectTrigger>
                <SelectValue placeholder="انتخاب نوع" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(typeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>وضعیت</Label>
            <Select value={formData.status} onValueChange={(v) => updateField("status", v)}>
              <SelectTrigger>
                <SelectValue placeholder="انتخاب وضعیت" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(statusConfig).map(([value, config]) => (
                  <SelectItem key={value} value={value}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>ظرفیت (نفر)</Label>
            <Input
              type="number"
              value={formData.capacity || ""}
              onChange={(e) => updateField("capacity", parseInt(e.target.value))}
              placeholder="1000"
              dir="ltr"
            />
          </div>
          <div className="space-y-2">
            <Label>مساحت (متر مربع)</Label>
            <Input
              type="number"
              value={formData.area || ""}
              onChange={(e) => updateField("area", parseInt(e.target.value))}
              placeholder="5000"
              dir="ltr"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>دانشگاه</Label>
            <Select 
              value={formData.universityId} 
              onValueChange={(v) => {
                const uni = mockUniversities.find(u => u.id === v);
                updateField("universityId", v);
                updateField("universityName", uni?.nameFa || "");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="انتخاب دانشگاه" />
              </SelectTrigger>
              <SelectContent>
                {mockUniversities.map((uni) => (
                  <SelectItem key={uni.id} value={uni.id}>{uni.nameFa}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      {/* Location */}
      <div className="space-y-4">
        <h4 className="font-semibold text-sm text-muted-foreground">موقعیت مکانی</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label>آدرس</Label>
            <Textarea
              value={formData.location?.addressFa || ""}
              onChange={(e) => updateLocation("addressFa", e.target.value)}
              placeholder="آدرس کامل..."
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>شهر</Label>
            <Input
              value={formData.location?.city || ""}
              onChange={(e) => updateLocation("city", e.target.value)}
              placeholder="تهران"
            />
          </div>
          <div className="space-y-2">
            <Label>استان</Label>
            <Input
              value={formData.location?.province || ""}
              onChange={(e) => updateLocation("province", e.target.value)}
              placeholder="تهران"
            />
          </div>
          <div className="space-y-2">
            <Label>عرض جغرافیایی (Latitude)</Label>
            <Input
              type="number"
              step="0.0001"
              value={formData.location?.lat || ""}
              onChange={(e) => updateLocation("lat", parseFloat(e.target.value))}
              placeholder="35.6892"
              dir="ltr"
            />
          </div>
          <div className="space-y-2">
            <Label>طول جغرافیایی (Longitude)</Label>
            <Input
              type="number"
              step="0.0001"
              value={formData.location?.lng || ""}
              onChange={(e) => updateLocation("lng", parseFloat(e.target.value))}
              placeholder="51.3890"
              dir="ltr"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Contact */}
      <div className="space-y-4">
        <h4 className="font-semibold text-sm text-muted-foreground">اطلاعات تماس</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>تلفن</Label>
            <Input
              value={formData.contactPhone || ""}
              onChange={(e) => updateField("contactPhone", e.target.value)}
              placeholder="021-12345678"
              dir="ltr"
            />
          </div>
          <div className="space-y-2">
            <Label>ایمیل</Label>
            <Input
              type="email"
              value={formData.contactEmail || ""}
              onChange={(e) => updateField("contactEmail", e.target.value)}
              placeholder="venue@university.ac.ir"
              dir="ltr"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Facilities */}
      <div className="space-y-4">
        <h4 className="font-semibold text-sm text-muted-foreground">امکانات</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(facilityLabels).map(([key, { label, icon: Icon }]) => (
            <div
              key={key}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                formData.facilities?.[key as keyof typeof formData.facilities]
                  ? "bg-primary/10 border-primary"
                  : "hover:bg-muted"
              )}
              onClick={() => updateFacility(key, !formData.facilities?.[key as keyof typeof formData.facilities])}
            >
              <Checkbox
                checked={formData.facilities?.[key as keyof typeof formData.facilities] || false}
                onCheckedChange={(checked) => updateFacility(key, checked as boolean)}
              />
              <Icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Photos Upload */}
      <div className="space-y-4">
        <h4 className="font-semibold text-sm text-muted-foreground">تصاویر</h4>
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground mb-2">
            تصاویر را اینجا رها کنید یا کلیک کنید
          </p>
          <Button variant="outline" size="sm">
            انتخاب فایل
          </Button>
        </div>
      </div>

      <Separator />

      {/* Rules */}
      <div className="space-y-4">
        <h4 className="font-semibold text-sm text-muted-foreground">قوانین و مقررات</h4>
        <div className="flex gap-2">
          <Input
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
            placeholder="قانون جدید..."
            onKeyDown={(e) => e.key === "Enter" && addRule()}
          />
          <Button onClick={addRule}>افزودن</Button>
        </div>
        <div className="space-y-2">
          {formData.rulesFa?.map((rule, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
              <span className="text-sm">{rule}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => removeRule(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-background">
        <Button variant="outline" onClick={onCancel}>انصراف</Button>
        <Button onClick={() => onSave(formData)}>
          {venue ? "ذخیره تغییرات" : "ایجاد مکان"}
        </Button>
      </div>
    </div>
  );
}

// Venue Detail Sheet Component
function VenueDetailSheet({ 
  venue, 
  open, 
  onOpenChange 
}: { 
  venue: Venue | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  if (!venue) return null;

  const venueEvaluations = mockEvaluations.filter(e => e.venueId === venue.id);
  const venueMaintenance = mockMaintenanceTasks.filter(m => m.venueId === venue.id);
  const venueBookings = mockBookings.filter(b => b.venueId === venue.id);
  const avgRating = venueEvaluations.length > 0 
    ? venueEvaluations.reduce((sum, e) => sum + e.rating, 0) / venueEvaluations.length 
    : 0;

  const status = statusConfig[venue.status];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full sm:max-w-2xl p-0">
        <SheetHeader className="p-6 pb-0">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="text-2xl">{venue.nameFa}</SheetTitle>
              <SheetDescription className="flex items-center gap-2 mt-1">
                <Building2 className="h-4 w-4" />
                {venue.universityName}
              </SheetDescription>
            </div>
            <Badge className={cn("text-sm", status.className)}>{status.label}</Badge>
          </div>
        </SheetHeader>

        <Tabs defaultValue="info" className="mt-6">
          <TabsList className="w-full justify-start px-6 h-auto flex-wrap gap-1">
            <TabsTrigger value="info" className="gap-2">
              <Info className="h-4 w-4" />
              اطلاعات
            </TabsTrigger>
            <TabsTrigger value="photos" className="gap-2">
              <ImageIcon className="h-4 w-4" />
              تصاویر
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <Calendar className="h-4 w-4" />
              تقویم
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="gap-2">
              <Wrench className="h-4 w-4" />
              تعمیرات
            </TabsTrigger>
            <TabsTrigger value="evaluations" className="gap-2">
              <Star className="h-4 w-4" />
              ارزیابی
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(100vh-200px)]">
            {/* Info Tab */}
            <TabsContent value="info" className="p-6 space-y-6 mt-0">
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{toPersianDigits(venue.capacity)}</div>
                  <div className="text-xs text-muted-foreground">ظرفیت</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <MapPin className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{toPersianDigits(venue.area)}</div>
                  <div className="text-xs text-muted-foreground">متر مربع</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Star className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                  <div className="text-2xl font-bold">{toPersianDigits(avgRating.toFixed(1))}</div>
                  <div className="text-xs text-muted-foreground">امتیاز</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{toPersianDigits(venue.utilizationRate)}٪</div>
                  <div className="text-xs text-muted-foreground">بهره‌برداری</div>
                </div>
              </div>

              {/* Type & Location */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">موقعیت و نوع</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{typeLabels[venue.type]}</Badge>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                    <span>{venue.location.addressFa}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{venue.location.city}، {venue.location.province}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Contact */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">اطلاعات تماس</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span dir="ltr">{venue.contactPhone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span dir="ltr">{venue.contactEmail}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Operating Hours */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    ساعات کاری
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {venue.operatingHours.map((oh) => (
                      <div key={oh.day} className="flex items-center justify-between text-sm">
                        <span className={cn(!oh.isOpen && "text-muted-foreground")}>{oh.dayFa}</span>
                        {oh.isOpen ? (
                          <span dir="ltr">{oh.open} - {oh.close}</span>
                        ) : (
                          <span className="text-muted-foreground">تعطیل</span>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Facilities */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">امکانات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(venue.facilities).map(([key, available]) => {
                      if (!available) return null;
                      const facility = facilityLabels[key as keyof typeof facilityLabels];
                      const Icon = facility.icon;
                      return (
                        <Badge key={key} variant="secondary" className="gap-1.5 py-1.5">
                          <Icon className="h-3.5 w-3.5" />
                          {facility.label}
                        </Badge>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Rules */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    قوانین و مقررات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm list-disc list-inside text-muted-foreground">
                    {venue.rulesFa.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Photos Tab */}
            <TabsContent value="photos" className="p-6 mt-0">
              <div className="grid grid-cols-2 gap-4">
                {venue.images.length > 0 ? (
                  venue.images.map((_, index) => (
                    <div
                      key={index}
                      className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center"
                    >
                      <ImageIcon className="h-12 w-12 text-primary/40" />
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12 text-muted-foreground">
                    <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>تصویری موجود نیست</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Calendar Tab */}
            <TabsContent value="calendar" className="p-6 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">رزروهای آینده</CardTitle>
                </CardHeader>
                <CardContent>
                  {venueBookings.length > 0 ? (
                    <div className="space-y-3">
                      {venueBookings.map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <p className="font-medium">{booking.userName}</p>
                            <p className="text-sm text-muted-foreground">{booking.purpose}</p>
                          </div>
                          <div className="text-left text-sm">
                            <p>{formatPersianDate(booking.startTime)}</p>
                            <p className="text-muted-foreground" dir="ltr">
                              {booking.startTime.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">رزروی وجود ندارد</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Maintenance Tab */}
            <TabsContent value="maintenance" className="p-6 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">سابقه تعمیرات</CardTitle>
                </CardHeader>
                <CardContent>
                  {venueMaintenance.length > 0 ? (
                    <div className="space-y-3">
                      {venueMaintenance.map((task) => (
                        <div key={task.id} className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">{task.titleFa}</p>
                            <Badge variant={
                              task.status === "completed" ? "default" :
                              task.status === "in_progress" ? "secondary" :
                              task.status === "overdue" ? "destructive" : "outline"
                            }>
                              {task.status === "completed" ? "انجام شده" :
                               task.status === "in_progress" ? "در حال انجام" :
                               task.status === "overdue" ? "تاخیر" : "برنامه‌ریزی شده"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                            <span>مسئول: {task.assignedTo}</span>
                            <span>
                              {task.scheduledDate
                                ? formatPersianDate(task.scheduledDate)
                                : "—"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">سابقه‌ای وجود ندارد</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Evaluations Tab */}
            <TabsContent value="evaluations" className="p-6 mt-0">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">نظرات و امتیازات</CardTitle>
                    <div className="flex items-center gap-2">
                      <StarRating rating={Math.round(avgRating)} size="md" />
                      <span className="font-bold">{toPersianDigits(avgRating.toFixed(1))}</span>
                      <span className="text-muted-foreground text-sm">
                        ({toPersianDigits(venueEvaluations.length)} نظر)
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {venueEvaluations.length > 0 ? (
                    <div className="space-y-4">
                      {venueEvaluations.map((evaluation) => (
                        <div key={evaluation.id} className="p-4 bg-muted rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{evaluation.userName}</span>
                            <StarRating rating={evaluation.rating} />
                          </div>
                          <p className="text-sm text-muted-foreground">{evaluation.comment}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatPersianDate(evaluation.date)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">نظری ثبت نشده</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

// Main Page Component
export default function VenuesPage() {
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("list");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  const [universityFilter, setUniversityFilter] = React.useState<string>("all");
  const [capacityFilter, setCapacityFilter] = React.useState<string>("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [editingVenue, setEditingVenue] = React.useState<Venue | null>(null);
  const [selectedVenue, setSelectedVenue] = React.useState<Venue | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);

  const itemsPerPage = 10;

  const filteredVenues = mockVenues.filter((venue) => {
    const matchesSearch =
      venue.nameFa.includes(searchQuery) ||
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.universityName.includes(searchQuery) ||
      venue.location.city.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || venue.status === statusFilter;
    const matchesType = typeFilter === "all" || venue.type === typeFilter;
    const matchesUniversity = universityFilter === "all" || venue.universityId === universityFilter;
    const matchesCapacity = capacityFilter === "all" || 
      (capacityFilter === "small" && venue.capacity < 500) ||
      (capacityFilter === "medium" && venue.capacity >= 500 && venue.capacity < 2000) ||
      (capacityFilter === "large" && venue.capacity >= 2000 && venue.capacity < 10000) ||
      (capacityFilter === "xlarge" && venue.capacity >= 10000);
    return matchesSearch && matchesStatus && matchesType && matchesUniversity && matchesCapacity;
  });

  const totalPages = Math.ceil(filteredVenues.length / itemsPerPage);
  const paginatedVenues = filteredVenues.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSaveVenue = (data: Partial<Venue>) => {
    console.log("Saving venue:", data);
    setIsAddDialogOpen(false);
    setEditingVenue(null);
  };

  const handleViewVenue = (venue: Venue) => {
    setSelectedVenue(venue);
    setIsDetailOpen(true);
  };

  const handleEditVenue = (venue: Venue) => {
    setEditingVenue(venue);
    setIsAddDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">مدیریت اماکن ورزشی</h1>
            <p className="text-muted-foreground">ثبت، ویرایش و مشاهده تمامی اماکن و تاسیسات ورزشی</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              خروجی
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  افزودن مکان جدید
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>
                    {editingVenue ? "ویرایش مکان" : "افزودن مکان جدید"}
                  </DialogTitle>
                  <DialogDescription>
                    اطلاعات مکان ورزشی را وارد کنید
                  </DialogDescription>
                </DialogHeader>
                <VenueForm
                  venue={editingVenue || undefined}
                  onSave={handleSaveVenue}
                  onCancel={() => {
                    setIsAddDialogOpen(false);
                    setEditingVenue(null);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search & Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="جستجو بر اساس نام، دانشگاه یا شهر..."
                    className="pr-10"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    className="gap-2 sm:hidden"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-4 w-4" />
                    فیلترها
                  </Button>
                  <div className="flex border rounded-lg overflow-hidden">
                    <Button
                      variant={viewMode === "list" ? "secondary" : "ghost"}
                      size="icon"
                      className="rounded-none"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "grid" ? "secondary" : "ghost"}
                      size="icon"
                      className="rounded-none"
                      onClick={() => setViewMode("grid")}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Filter Controls */}
              <div className={cn(
                "flex flex-wrap gap-2",
                !showFilters && "hidden sm:flex"
              )}>
                <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setCurrentPage(1); }}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="نوع مکان" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه انواع</SelectItem>
                    {Object.entries(typeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="وضعیت" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                    {Object.entries(statusConfig).map(([value, config]) => (
                      <SelectItem key={value} value={value}>{config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={universityFilter} onValueChange={(v) => { setUniversityFilter(v); setCurrentPage(1); }}>
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="دانشگاه" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه دانشگاه‌ها</SelectItem>
                    {mockUniversities.map((uni) => (
                      <SelectItem key={uni.id} value={uni.id}>{uni.nameFa}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={capacityFilter} onValueChange={(v) => { setCapacityFilter(v); setCurrentPage(1); }}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="ظرفیت" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه ظرفیت‌ها</SelectItem>
                    <SelectItem value="small">کمتر از ۵۰۰</SelectItem>
                    <SelectItem value="medium">۵۰۰ تا ۲۰۰۰</SelectItem>
                    <SelectItem value="large">۲۰۰۰ تا ۱۰۰۰۰</SelectItem>
                    <SelectItem value="xlarge">بیش از ۱۰۰۰۰</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {toPersianDigits(filteredVenues.length)} مکان یافت شد
          </p>
        </div>

        {/* Content */}
        {viewMode === "list" ? (
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right min-w-[200px]">نام مکان</TableHead>
                    <TableHead className="text-right min-w-[150px]">دانشگاه</TableHead>
                    <TableHead className="text-right">نوع</TableHead>
                    <TableHead className="text-right">شهر</TableHead>
                    <TableHead className="text-right">ظرفیت</TableHead>
                    <TableHead className="text-right">وضعیت</TableHead>
                    <TableHead className="text-right">بهره‌برداری</TableHead>
                    <TableHead className="text-right w-[80px]">عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedVenues.map((venue) => {
                    const status = statusConfig[venue.status];
                    return (
                      <TableRow key={venue.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                              <Building2 className="h-5 w-5 text-primary/60" />
                            </div>
                            <div>
                              <p className="font-medium">{venue.nameFa}</p>
                              <p className="text-xs text-muted-foreground">{venue.name}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{venue.universityName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{typeLabels[venue.type]}</Badge>
                        </TableCell>
                        <TableCell>{venue.location.city}</TableCell>
                        <TableCell>{toPersianDigits(venue.capacity)}</TableCell>
                        <TableCell>
                          <Badge className={status.className}>{status.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={venue.utilizationRate} className="w-16 h-2" />
                            <span className="text-sm">{toPersianDigits(venue.utilizationRate)}٪</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewVenue(venue)}>
                                <Eye className="h-4 w-4 ml-2" />
                                مشاهده جزئیات
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditVenue(venue)}>
                                <Pencil className="h-4 w-4 ml-2" />
                                ویرایش
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 ml-2" />
                                حذف
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedVenues.map((venue) => {
              const status = statusConfig[venue.status];
              const venueEvaluations = mockEvaluations.filter(e => e.venueId === venue.id);
              const avgRating = venueEvaluations.length > 0
                ? venueEvaluations.reduce((sum, e) => sum + e.rating, 0) / venueEvaluations.length
                : 0;

              return (
                <Card
                  key={venue.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => handleViewVenue(venue)}
                >
                  <div className="h-36 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
                    <Building2 className="h-14 w-14 text-primary/40" />
                    <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="secondary" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditVenue(venue); }}>
                            <Pencil className="h-4 w-4 ml-2" />
                            ویرایش
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={(e) => e.stopPropagation()}>
                            <Trash2 className="h-4 w-4 ml-2" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-base line-clamp-1">{venue.nameFa}</h3>
                      <Badge className={cn("shrink-0 text-xs", status.className)}>{status.label}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{venue.universityName}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {venue.location.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {toPersianDigits(venue.capacity)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <Badge variant="outline" className="text-xs">{typeLabels[venue.type]}</Badge>
                      <div className="flex items-center gap-1">
                        <StarRating rating={Math.round(avgRating)} />
                        <span className="text-xs text-muted-foreground mr-1">
                          ({toPersianDigits(venueEvaluations.length)})
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center pt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {/* Detail Sheet */}
        <VenueDetailSheet
          venue={selectedVenue}
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
        />
      </div>
    </DashboardLayout>
  );
}
