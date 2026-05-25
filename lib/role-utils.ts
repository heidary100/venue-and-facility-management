import type {
  User,
  UserRole,
  Venue,
  Booking,
  University,
  MaintenanceRequest,
  RegionId,
} from '@/lib/types';
import { fa, regionLabels, roleLabels } from '@/lib/i18n/fa';

export function isStudentRole(role: UserRole): boolean {
  return role === 'student' || role === 'athlete';
}

export function canAccessAdminDashboard(role: UserRole): boolean {
  return !isStudentRole(role);
}

export function canManageVenues(role: UserRole): boolean {
  return ['admin_national', 'admin_regional', 'university_manager', 'facility_staff'].includes(role);
}

export function canViewReports(role: UserRole): boolean {
  return ['admin_national', 'admin_regional', 'university_manager'].includes(role);
}

export function canViewAudit(role: UserRole): boolean {
  return ['admin_national', 'admin_regional'].includes(role);
}

export function filterUniversitiesByRole(
  universities: University[],
  user: User
): University[] {
  if (user.role === 'admin_national') return universities;
  if (user.role === 'admin_regional' && user.regionId) {
    return universities.filter((u) => u.regionId === user.regionId);
  }
  if (user.universityId) {
    return universities.filter((u) => u.id === user.universityId);
  }
  return universities;
}

export function filterVenuesByRole(venues: Venue[], user: User, universities: University[]): Venue[] {
  const allowedUniversityIds = new Set(
    filterUniversitiesByRole(universities, user).map((u) => u.id)
  );
  return venues.filter((v) => allowedUniversityIds.has(v.universityId));
}

export function filterBookingsByRole(bookings: Booking[], user: User): Booking[] {
  if (isStudentRole(user.role)) {
    return bookings.filter((b) => b.userId === user.id);
  }
  if (user.role === 'university_manager' || user.role === 'facility_staff') {
    if (user.universityId) {
      return bookings.filter((b) => b.universityId === user.universityId);
    }
  }
  if (user.role === 'admin_regional' && user.regionId) {
    return bookings;
  }
  return bookings;
}

export function filterMaintenanceByRole(
  requests: MaintenanceRequest[],
  user: User,
  venueIds: string[]
): MaintenanceRequest[] {
  if (isStudentRole(user.role)) return [];
  return requests.filter((r) => venueIds.includes(r.venueId));
}

export function getScopeDescription(user: User): string {
  if (user.role === 'admin_national') return fa.roles.nationalScope;
  if (user.role === 'admin_regional' && user.regionId) {
    return `${fa.roles.regionalScope}: ${regionLabels[user.regionId]}`;
  }
  if (user.universityId) return fa.roles.universityScope;
  if (isStudentRole(user.role)) return fa.roles.studentScope;
  return roleLabels[user.role];
}

export function getAvailableRegions(user: User): RegionId[] | 'all' {
  if (user.role === 'admin_national') return 'all';
  if (user.role === 'admin_regional' && user.regionId) return [user.regionId];
  return 'all';
}
