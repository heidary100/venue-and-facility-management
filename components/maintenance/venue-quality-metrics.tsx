"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, TrendingUp, TrendingDown } from "lucide-react";
import { VenueQualityMetrics } from "@/lib/types";
import { getRatingLabel, getRatingColor } from "@/lib/maintenance-utils";
import { toPersianDigits } from "@/lib/booking-utils";
import { cn } from "@/lib/utils";

interface VenueQualityMetricsProps {
  metrics: VenueQualityMetrics[];
}

const ratingCategories = [
  { key: "cleanliness" as const, label: "نظافت" },
  { key: "equipment" as const, label: "تجهیزات" },
  { key: "lighting" as const, label: "روشنایی" },
  { key: "safety" as const, label: "ایمنی" },
  { key: "overall" as const, label: "کلی" },
];

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" dir="ltr">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-4 w-4",
            star <= Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          )}
        />
      ))}
    </div>
  );
}

export function VenueQualityMetricsDisplay({
  metrics,
}: VenueQualityMetricsProps) {
  // Calculate overall average
  const overallAverage =
    metrics.reduce((sum, m) => sum + m.averageRatings.overall, 0) /
    (metrics.length || 1);

  // Sort by overall rating
  const sortedMetrics = [...metrics].sort(
    (a, b) => b.averageRatings.overall - a.averageRatings.overall
  );

  return (
    <div className="space-y-6">
      {/* Overall Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  میانگین رضایت
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-2xl font-bold">
                    {toPersianDigits(overallAverage.toFixed(1))}
                  </p>
                  <StarDisplay rating={overallAverage} />
                </div>
              </div>
              <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  کل ارزیابی‌ها
                </p>
                <p className="text-2xl font-bold">
                  {toPersianDigits(
                    metrics
                      .reduce((sum, m) => sum + m.totalEvaluations, 0)
                      .toString()
                  )}
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
                  سالن‌های ارزیابی شده
                </p>
                <p className="text-2xl font-bold">
                  {toPersianDigits(metrics.length.toString())}
                </p>
              </div>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {toPersianDigits(metrics.length.toString())}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Venue Ratings */}
      <Card>
        <CardHeader>
          <CardTitle>رتبه‌بندی سالن‌ها</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {sortedMetrics.length === 0 ? (
            <div className="text-center py-8">
              <Star className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                هنوز ارزیابی‌ای ثبت نشده است
              </p>
            </div>
          ) : (
            sortedMetrics.map((metric, index) => (
              <div key={metric.venueId} className="space-y-3">
                {/* Venue Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        #{toPersianDigits((index + 1).toString())}
                      </Badge>
                      <h4 className="font-semibold">{metric.venueName}</h4>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span
                          className={cn(
                            "text-2xl font-bold",
                            getRatingColor(metric.averageRatings.overall)
                          )}
                        >
                          {toPersianDigits(
                            metric.averageRatings.overall.toFixed(1)
                          )}
                        </span>
                        <StarDisplay rating={metric.averageRatings.overall} />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {toPersianDigits(metric.totalEvaluations.toString())}{" "}
                        ارزیابی
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          metric.averageRatings.overall >= 4.5
                            ? "bg-green-500/10 text-green-600 border-green-500/20"
                            : metric.averageRatings.overall >= 3.5
                            ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                            : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                        )}
                      >
                        {getRatingLabel(metric.averageRatings.overall)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Rating Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {ratingCategories
                    .filter((cat) => cat.key !== "overall")
                    .map((category) => {
                      const rating =
                        metric.averageRatings[category.key as keyof typeof metric.averageRatings];
                      return (
                        <div key={category.key} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {category.label}
                            </span>
                            <span className="font-medium">
                              {toPersianDigits(rating.toFixed(1))}
                            </span>
                          </div>
                          <Progress value={rating * 20} className="h-2" />
                        </div>
                      );
                    })}
                </div>

                {index < sortedMetrics.length - 1 && (
                  <div className="pt-3 border-b" />
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
