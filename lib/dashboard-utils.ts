import type { User, Venue, Booking, RegionId, ActivityItem } from '@/lib/types';
import {
  filterVenuesByRole,
  filterBookingsByRole,
  filterUniversitiesByRole,
} from '@/lib/role-utils';
import {
  mockVenues,
  mockBookings,
  mockUniversities,
  mockMaintenanceTasks,
} from '@/lib/mock-data';

export interface DashboardFilters {
  regionId?: RegionId | 'all';
  universityId?: string | 'all';
  dateFrom?: Date;
  dateTo?: Date;
}

export interface Phase2KPIs {
  totalVenues: number;
  avgUtilization: number;
  activeBookingsToday: number;
  avgSatisfaction: number;
  openMaintenance: number;
}

const venueTypeLabels: Record<string, string> = {
  stadium: 'استادیوم',
  gym: 'سالن ورزشی',
  pool: 'استخر',
  court: 'زمین بازی',
  field: 'چمن',
  track: 'پیست',
  arena: 'آرنا',
  other: 'سایر',
};

export function getScopedData(user: User, filters: DashboardFilters) {
  let venues = filterVenuesByRole(mockVenues, user, mockUniversities);
  let bookings = filterBookingsByRole(mockBookings, user);
  const universities = filterUniversitiesByRole(mockUniversities, user);

  if (filters.regionId && filters.regionId !== 'all') {
    const uniIds = mockUniversities
      .filter((u) => u.regionId === filters.regionId)
      .map((u) => u.id);
    venues = venues.filter((v) => uniIds.includes(v.universityId));
    bookings = bookings.filter((b) => b.universityId && uniIds.includes(b.universityId));
  }

  if (filters.universityId && filters.universityId !== 'all') {
    venues = venues.filter((v) => v.universityId === filters.universityId);
    bookings = bookings.filter((b) => b.universityId === filters.universityId);
  }

  const venueIds = new Set(venues.map((v) => v.id));
  const maintenance = mockMaintenanceTasks.filter(
    (m) => venueIds.has(m.venueId) && m.status !== 'completed'
  );

  return { venues, bookings, universities, maintenance };
}

export function computePhase2KPIs(
  venues: Venue[],
  bookings: Booking[],
  maintenanceCount: number
): Phase2KPIs {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const activeToday = bookings.filter((b) => {
    const start = new Date(b.startTime);
    return (
      (b.status === 'approved' || b.status === 'pending') &&
      start >= today &&
      start < tomorrow
    );
  }).length;

  const avgUtil =
    venues.length > 0
      ? venues.reduce((s, v) => s + v.utilizationRate, 0) / venues.length
      : 0;

  return {
    totalVenues: venues.length,
    avgUtilization: Math.round(avgUtil * 10) / 10,
    activeBookingsToday: activeToday,
    avgSatisfaction: 4.6,
    openMaintenance: maintenanceCount,
  };
}

export function getOccupancyTrend() {
  return [
    { month: 'آذر', rate: 62 },
    { month: 'دی', rate: 68 },
    { month: 'بهمن', rate: 71 },
    { month: 'اسفند', rate: 74 },
    { month: 'فروردین', rate: 69 },
    { month: 'اردیبهشت', rate: 76 },
  ];
}

export function getBookingByVenueType(venues: Venue[], bookings: Booking[]) {
  const counts: Record<string, number> = {};
  bookings.forEach((b) => {
    const venue = venues.find((v) => v.id === b.venueId);
    const type = venue?.type ?? 'other';
    const label = venueTypeLabels[type] ?? type;
    counts[label] = (counts[label] ?? 0) + 1;
  });
  return Object.entries(counts).map(([name, count]) => ({ name, count }));
}

export function getSatisfactionTrend() {
  return [
    { month: 'آذر', score: 4.1 },
    { month: 'دی', score: 4.2 },
    { month: 'بهمن', score: 4.4 },
    { month: 'اسفند', score: 4.5 },
    { month: 'فروردین', score: 4.3 },
    { month: 'اردیبهشت', score: 4.6 },
  ];
}

export function getTopVenuesByUsage(venues: Venue[], bookings: Booking[]) {
  const usage: Record<string, number> = {};
  bookings.forEach((b) => {
    usage[b.venueId] = (usage[b.venueId] ?? 0) + 1;
  });
  return venues
    .map((v) => ({
      name: v.nameFa,
      bookings: usage[v.id] ?? Math.round(v.utilizationRate / 5),
    }))
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 5);
}

export function getRecentActivity(bookings: Booking[]): ActivityItem[] {
  return bookings.slice(0, 8).map((b, i) => ({
    id: `act-${i}`,
    type: 'booking' as const,
    title: `رزرو ${b.venueName}`,
    description: `${b.userName} — ${b.status === 'pending' ? 'در انتظار تأیید' : 'تأیید شده'}`,
    timestamp: new Date(b.createdAt),
    universityId: b.universityId,
  }));
}
