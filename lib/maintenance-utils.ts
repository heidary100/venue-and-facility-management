import {
  MaintenanceRequest,
  MaintenanceStatus,
  MaintenancePriority,
  MaintenanceCategory,
  VenueEvaluationDetailed,
  VenueQualityMetrics,
  PreventiveMaintenance,
} from "./types";

/**
 * Get status label in Persian
 */
export function getMaintenanceStatusLabel(status: MaintenanceStatus): string {
  const labels: Record<MaintenanceStatus, string> = {
    reported: "گزارش شده",
    assigned: "واگذار شده",
    in_progress: "در حال انجام",
    completed: "تکمیل شده",
    cancelled: "لغو شده",
  };
  return labels[status];
}

/**
 * Get priority label in Persian
 */
export function getPriorityLabel(priority: MaintenancePriority): string {
  const labels: Record<MaintenancePriority, string> = {
    low: "کم",
    medium: "متوسط",
    high: "بالا",
    critical: "بحرانی",
  };
  return labels[priority];
}

/**
 * Get category label in Persian
 */
export function getCategoryLabel(category: MaintenanceCategory): string {
  const labels: Record<MaintenanceCategory, string> = {
    electrical: "برق",
    plumbing: "لوله‌کشی",
    hvac: "تهویه و سرمایش",
    equipment: "تجهیزات",
    structural: "ساختمانی",
    cleaning: "نظافت",
    safety: "ایمنی",
    other: "سایر",
  };
  return labels[category];
}

/**
 * Get status color class
 */
export function getStatusColor(status: MaintenanceStatus): string {
  const colors: Record<MaintenanceStatus, string> = {
    reported: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    assigned: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    in_progress: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    completed: "bg-green-500/10 text-green-600 border-green-500/20",
    cancelled: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  };
  return colors[status];
}

/**
 * Get priority color class
 */
export function getPriorityColor(priority: MaintenancePriority): string {
  const colors: Record<MaintenancePriority, string> = {
    low: "bg-gray-500/10 text-gray-600 border-gray-500/20",
    medium: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    high: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    critical: "bg-red-500/10 text-red-600 border-red-500/20",
  };
  return colors[priority];
}

/**
 * Calculate average ratings from evaluations
 */
export function calculateAverageRatings(
  evaluations: VenueEvaluationDetailed[]
): VenueQualityMetrics["averageRatings"] {
  if (evaluations.length === 0) {
    return {
      cleanliness: 0,
      equipment: 0,
      lighting: 0,
      safety: 0,
      overall: 0,
    };
  }

  const totals = evaluations.reduce(
    (acc, evaluation) => ({
      cleanliness: acc.cleanliness + evaluation.ratings.cleanliness,
      equipment: acc.equipment + evaluation.ratings.equipment,
      lighting: acc.lighting + evaluation.ratings.lighting,
      safety: acc.safety + evaluation.ratings.safety,
      overall: acc.overall + evaluation.ratings.overall,
    }),
    { cleanliness: 0, equipment: 0, lighting: 0, safety: 0, overall: 0 }
  );

  const count = evaluations.length;
  return {
    cleanliness: Math.round((totals.cleanliness / count) * 10) / 10,
    equipment: Math.round((totals.equipment / count) * 10) / 10,
    lighting: Math.round((totals.lighting / count) * 10) / 10,
    safety: Math.round((totals.safety / count) * 10) / 10,
    overall: Math.round((totals.overall / count) * 10) / 10,
  };
}

/**
 * Get rating label in Persian
 */
export function getRatingLabel(rating: number): string {
  if (rating >= 4.5) return "عالی";
  if (rating >= 3.5) return "خوب";
  if (rating >= 2.5) return "متوسط";
  if (rating >= 1.5) return "ضعیف";
  return "بسیار ضعیف";
}

/**
 * Get rating color
 */
export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return "text-green-600";
  if (rating >= 3.5) return "text-blue-600";
  if (rating >= 2.5) return "text-yellow-600";
  if (rating >= 1.5) return "text-orange-600";
  return "text-red-600";
}

/**
 * Calculate next scheduled date for preventive maintenance
 */
export function calculateNextScheduledDate(
  lastPerformed: Date | undefined,
  frequency: PreventiveMaintenance["frequency"]
): Date {
  const baseDate = lastPerformed || new Date();
  const next = new Date(baseDate);

  switch (frequency) {
    case "daily":
      next.setDate(next.getDate() + 1);
      break;
    case "weekly":
      next.setDate(next.getDate() + 7);
      break;
    case "monthly":
      next.setMonth(next.getMonth() + 1);
      break;
    case "quarterly":
      next.setMonth(next.getMonth() + 3);
      break;
    case "yearly":
      next.setFullYear(next.getFullYear() + 1);
      break;
  }

  return next;
}

/**
 * Check if maintenance is overdue
 */
export function isMaintenanceOverdue(scheduledDate: Date): boolean {
  return new Date() > new Date(scheduledDate);
}

/**
 * Get frequency label in Persian
 */
export function getFrequencyLabel(
  frequency: PreventiveMaintenance["frequency"]
): string {
  const labels: Record<PreventiveMaintenance["frequency"], string> = {
    daily: "روزانه",
    weekly: "هفتگی",
    monthly: "ماهانه",
    quarterly: "سه‌ماهه",
    yearly: "سالانه",
  };
  return labels[frequency];
}

/**
 * Filter maintenance requests by status
 */
export function filterMaintenanceByStatus(
  requests: MaintenanceRequest[],
  status: MaintenanceStatus
): MaintenanceRequest[] {
  return requests.filter((req) => req.status === status);
}

/**
 * Sort maintenance requests by priority
 */
export function sortByPriority(
  requests: MaintenanceRequest[]
): MaintenanceRequest[] {
  const priorityOrder: Record<MaintenancePriority, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };

  return [...requests].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );
}

/**
 * Get maintenance statistics
 */
export function getMaintenanceStats(requests: MaintenanceRequest[]) {
  return {
    total: requests.length,
    reported: requests.filter((r) => r.status === "reported").length,
    assigned: requests.filter((r) => r.status === "assigned").length,
    inProgress: requests.filter((r) => r.status === "in_progress").length,
    completed: requests.filter((r) => r.status === "completed").length,
    critical: requests.filter((r) => r.priority === "critical").length,
    high: requests.filter((r) => r.priority === "high").length,
  };
}
