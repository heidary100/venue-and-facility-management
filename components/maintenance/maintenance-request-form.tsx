"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VenueSearchCombobox } from "@/components/bookings/venue-search-combobox";
import { Venue, MaintenanceCategory, MaintenancePriority } from "@/lib/types";
import { getCategoryLabel, getPriorityLabel } from "@/lib/maintenance-utils";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const maintenanceFormSchema = z.object({
  venueId: z.string().min(1, "لطفاً سالن را انتخاب کنید"),
  category: z.enum([
    "electrical",
    "plumbing",
    "hvac",
    "equipment",
    "structural",
    "cleaning",
    "safety",
    "other",
  ]),
  title: z.string().min(3, "عنوان باید حداقل ۳ کاراکتر باشد"),
  description: z.string().min(10, "توضیحات باید حداقل ۱۰ کاراکتر باشد"),
  priority: z.enum(["low", "medium", "high", "critical"]),
  photos: z.array(z.string()).optional(),
});

type MaintenanceFormValues = z.infer<typeof maintenanceFormSchema>;

interface MaintenanceRequestFormProps {
  venues: Venue[];
  onSubmit: (data: MaintenanceFormValues) => void;
  initialVenueId?: string;
}

const categories: { value: MaintenanceCategory; label: string }[] = [
  { value: "electrical", label: getCategoryLabel("electrical") },
  { value: "plumbing", label: getCategoryLabel("plumbing") },
  { value: "hvac", label: getCategoryLabel("hvac") },
  { value: "equipment", label: getCategoryLabel("equipment") },
  { value: "structural", label: getCategoryLabel("structural") },
  { value: "cleaning", label: getCategoryLabel("cleaning") },
  { value: "safety", label: getCategoryLabel("safety") },
  { value: "other", label: getCategoryLabel("other") },
];

const priorities: { value: MaintenancePriority; label: string }[] = [
  { value: "low", label: getPriorityLabel("low") },
  { value: "medium", label: getPriorityLabel("medium") },
  { value: "high", label: getPriorityLabel("high") },
  { value: "critical", label: getPriorityLabel("critical") },
];

export function MaintenanceRequestForm({
  venues,
  onSubmit,
  initialVenueId,
}: MaintenanceRequestFormProps) {
  const [photos, setPhotos] = React.useState<string[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceFormSchema),
    defaultValues: {
      venueId: initialVenueId || "",
      category: "other",
      title: "",
      description: "",
      priority: "medium",
      photos: [],
    },
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Simulate photo upload (in real app, upload to server)
    const newPhotos: string[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPhotos.push(reader.result as string);
        if (newPhotos.length === files.length) {
          setPhotos([...photos, ...newPhotos]);
          form.setValue("photos", [...photos, ...newPhotos]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    form.setValue("photos", newPhotos);
  };

  const handleSubmit = (data: MaintenanceFormValues) => {
    onSubmit({ ...data, photos });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Venue Selection */}
        <FormField
          control={form.control}
          name="venueId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>سالن ورزشی</FormLabel>
              <FormControl>
                <VenueSearchCombobox
                  venues={venues}
                  value={field.value}
                  onValueChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>دسته‌بندی</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب دسته‌بندی" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Priority */}
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اولویت</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب اولویت" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                بحرانی: نیاز به اقدام فوری | بالا: ظرف ۲۴ ساعت | متوسط: ظرف یک هفته
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>عنوان مشکل</FormLabel>
              <FormControl>
                <Input placeholder="مثال: خرابی سیستم روشنایی" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>توضیحات کامل</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="لطفاً مشکل را با جزئیات شرح دهید..."
                  className="min-h-[120px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Photo Upload */}
        <div className="space-y-3">
          <FormLabel>تصاویر (اختیاری)</FormLabel>
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <Upload className="ml-2 h-4 w-4" />
              آپلود تصویر
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handlePhotoUpload}
            />

            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {photos.map((photo, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden border border-border group"
                  >
                    <img
                      src={photo}
                      alt={`تصویر ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 left-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            تصاویر به تشخیص بهتر مشکل کمک می‌کنند
          </p>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          ثبت درخواست تعمیرات
        </Button>
      </form>
    </Form>
  );
}
