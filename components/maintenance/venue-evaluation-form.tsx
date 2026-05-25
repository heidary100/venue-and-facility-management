"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Booking } from "@/lib/types";

const evaluationFormSchema = z.object({
  cleanliness: z.number().min(1).max(5),
  equipment: z.number().min(1).max(5),
  lighting: z.number().min(1).max(5),
  safety: z.number().min(1).max(5),
  overall: z.number().min(1).max(5),
  comment: z.string().optional(),
});

type EvaluationFormValues = z.infer<typeof evaluationFormSchema>;

interface VenueEvaluationFormProps {
  booking: Booking;
  onSubmit: (data: EvaluationFormValues) => void;
}

const ratingCategories = [
  { key: "cleanliness" as const, label: "نظافت و بهداشت" },
  { key: "equipment" as const, label: "تجهیزات و امکانات" },
  { key: "lighting" as const, label: "روشنایی" },
  { key: "safety" as const, label: "ایمنی" },
  { key: "overall" as const, label: "امتیاز کلی" },
];

function StarRating({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (value: number) => void;
  label: string;
}) {
  const [hoverValue, setHoverValue] = React.useState(0);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-muted-foreground">
          {value > 0 ? `${value} از ۵` : "انتخاب نشده"}
        </span>
      </div>
      <div className="flex gap-1" dir="ltr">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHoverValue(star)}
            onMouseLeave={() => setHoverValue(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={cn(
                "h-8 w-8 transition-colors",
                star <= (hoverValue || value)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export function VenueEvaluationForm({
  booking,
  onSubmit,
}: VenueEvaluationFormProps) {
  const form = useForm<EvaluationFormValues>({
    resolver: zodResolver(evaluationFormSchema),
    defaultValues: {
      cleanliness: 0,
      equipment: 0,
      lighting: 0,
      safety: 0,
      overall: 0,
      comment: "",
    },
  });

  const handleSubmit = (data: EvaluationFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Booking Info */}
        <div className="p-4 bg-muted rounded-lg space-y-1">
          <h3 className="font-semibold">{booking.venueName}</h3>
          <p className="text-sm text-muted-foreground">
            {new Date(booking.startTime).toLocaleDateString("fa-IR")}
          </p>
        </div>

        {/* Rating Categories */}
        <div className="space-y-6">
          {ratingCategories.map((category) => (
            <FormField
              key={category.key}
              control={form.control}
              name={category.key}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <StarRating
                      value={field.value}
                      onChange={field.onChange}
                      label={category.label}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        {/* Comment */}
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نظرات و پیشنهادات (اختیاری)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="نظرات خود را در مورد سالن بنویسید..."
                  className="min-h-[100px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          ثبت ارزیابی
        </Button>
      </form>
    </Form>
  );
}
