import { Venue, VenueType, VenueStatus } from "./types";

/**
 * Get marker color based on venue type
 */
export function getMarkerColor(type: VenueType): string {
  const colors: Record<VenueType, string> = {
    stadium: "#ef4444", // red
    gym: "#3b82f6", // blue
    pool: "#06b6d4", // cyan
    court: "#f59e0b", // amber
    field: "#22c55e", // green
    track: "#a855f7", // purple
    arena: "#ec4899", // pink
    other: "#6b7280", // gray
  };
  return colors[type] || colors.other;
}

/**
 * Get marker icon based on venue type
 */
export function getMarkerIcon(type: VenueType): string {
  const icons: Record<VenueType, string> = {
    stadium: "🏟️",
    gym: "🏋️",
    pool: "🏊",
    court: "🎾",
    field: "⚽",
    track: "🏃",
    arena: "🏀",
    other: "📍",
  };
  return icons[type] || icons.other;
}

/**
 * Create custom Leaflet icon for venue (client-side only)
 */
export function createVenueIcon(venue: Venue): any {
  // This will be called client-side only, so we can safely import L here
  if (typeof window === 'undefined') return null;
  
  const L = require('leaflet');
  const color = getMarkerColor(venue.type);
  const icon = getMarkerIcon(venue.type);
  
  const statusClass = venue.status === "active" ? "active" : 
                      venue.status === "maintenance" ? "maintenance" : "closed";

  return L.divIcon({
    className: "custom-venue-marker",
    html: `
      <div class="venue-marker ${statusClass}" style="background-color: ${color};">
        <span class="venue-icon">${icon}</span>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
}

/**
 * Calculate map bounds for venues
 */
export function calculateBounds(venues: Venue[]): [[number, number], [number, number]] | null {
  if (venues.length === 0) return null;

  const lats = venues.map((v) => v.location.lat);
  const lngs = venues.map((v) => v.location.lng);

  return [
    [Math.min(...lats), Math.min(...lngs)],
    [Math.max(...lats), Math.max(...lngs)],
  ];
}

/**
 * Get status label in Persian
 */
export function getStatusLabel(status: VenueStatus): string {
  const labels: Record<VenueStatus, string> = {
    active: "فعال",
    maintenance: "در حال تعمیر",
    closed: "بسته",
    reserved: "رزرو شده",
  };
  return labels[status];
}

/**
 * Get type label in Persian
 */
export function getTypeLabel(type: VenueType): string {
  const labels: Record<VenueType, string> = {
    stadium: "استادیوم",
    gym: "سالن بدنسازی",
    pool: "استخر",
    court: "زمین تنیس/بسکتبال",
    field: "زمین فوتبال",
    track: "پیست دو",
    arena: "سالن ورزشی",
    other: "سایر",
  };
  return labels[type];
}

/**
 * Filter venues based on criteria
 */
export function filterVenues(
  venues: Venue[],
  filters: {
    search?: string;
    types?: VenueType[];
    statuses?: VenueStatus[];
    universityIds?: string[];
    hasAccessibility?: boolean;
  }
): Venue[] {
  return venues.filter((venue) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        venue.nameFa.toLowerCase().includes(searchLower) ||
        venue.name.toLowerCase().includes(searchLower) ||
        venue.location.addressFa.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Type filter
    if (filters.types && filters.types.length > 0) {
      if (!filters.types.includes(venue.type)) return false;
    }

    // Status filter
    if (filters.statuses && filters.statuses.length > 0) {
      if (!filters.statuses.includes(venue.status)) return false;
    }

    // University filter
    if (filters.universityIds && filters.universityIds.length > 0) {
      if (!filters.universityIds.includes(venue.universityId)) return false;
    }

    // Accessibility filter
    if (filters.hasAccessibility !== undefined) {
      if (venue.facilities.accessibility !== filters.hasAccessibility) return false;
    }

    return true;
  });
}

/**
 * Generate heatmap data from venues
 */
export function generateHeatmapData(venues: Venue[]): [number, number, number][] {
  return venues.map((venue) => [
    venue.location.lat,
    venue.location.lng,
    venue.utilizationRate / 100, // Normalize to 0-1
  ]);
}

/**
 * Default map center (Iran)
 */
export const DEFAULT_MAP_CENTER: [number, number] = [35.6892, 51.389]; // Tehran
export const DEFAULT_ZOOM = 6;
