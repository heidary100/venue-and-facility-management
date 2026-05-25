// User Roles
export type UserRole = 'admin_national' | 'admin_regional' | 'university_manager' | 'facility_staff' | 'student' | 'athlete';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  universityId?: string;
  avatar?: string;
}

// Venue Types
export type VenueType = 'stadium' | 'gym' | 'pool' | 'court' | 'field' | 'track' | 'arena' | 'other';
export type VenueStatus = 'active' | 'maintenance' | 'closed' | 'reserved';

export interface OperatingHours {
  day: string;
  dayFa: string;
  open: string;
  close: string;
  isOpen: boolean;
}

export interface VenueEvaluation {
  id: string;
  venueId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
}

export interface Venue {
  id: string;
  name: string;
  nameFa: string;
  type: VenueType;
  status: VenueStatus;
  capacity: number;
  area: number; // square meters
  location: {
    address: string;
    addressFa: string;
    lat: number;
    lng: number;
    city: string;
    province: string;
  };
  amenities: string[];
  facilities: {
    parking: boolean;
    lockerRooms: boolean;
    showers: boolean;
    firstAid: boolean;
    lighting: boolean;
    soundSystem: boolean;
    ac: boolean;
    wifi: boolean;
    accessibility: boolean;
    cafe: boolean;
    equipmentRental: boolean;
    seating: boolean;
  };
  images: string[];
  universityId: string;
  universityName: string;
  utilizationRate: number;
  operatingHours: OperatingHours[];
  rules: string[];
  rulesFa: string[];
  contactPhone: string;
  contactEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

// Booking Types
export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed';
export type BookingPurpose = 'class' | 'training' | 'competition' | 'event' | 'maintenance' | 'other';
export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Booking {
  id: string;
  venueId: string;
  venueName: string;
  venueType?: VenueType;
  userId: string;
  userName: string;
  userEmail?: string;
  userPhone?: string;
  universityId?: string;
  universityName?: string;
  startTime: Date;
  endTime: Date;
  purpose: BookingPurpose;
  purposeDetail: string;
  status: BookingStatus;
  attendees: number;
  equipmentNeeded?: string[];
  notes?: string;
  recurrence: RecurrenceType;
  recurrenceEnd?: Date;
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface TimeSlot {
  time: string;
  timeFa: string;
  hour: number;
  available: boolean;
  bookingId?: string;
  status?: 'free' | 'booked' | 'maintenance' | 'pending';
}

export interface BookingConflict {
  existingBooking: Booking;
  type: 'overlap' | 'capacity' | 'maintenance';
  message: string;
}

export interface SmartSuggestion {
  venue: Venue;
  timeSlot: TimeSlot;
  date: Date;
  score: number;
  reason: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'booking_created' | 'booking_approved' | 'booking_rejected' | 'booking_reminder' | 'booking_cancelled' | 'maintenance_alert';
  title: string;
  message: string;
  read: boolean;
  bookingId?: string;
  createdAt: Date;
}

// Maintenance Types
export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed' | 'overdue';
export type MaintenancePriority = 'low' | 'medium' | 'high' | 'critical';
export type MaintenanceType = 'preventive' | 'corrective' | 'emergency' | 'inspection';

export interface MaintenanceTask {
  id: string;
  venueId: string;
  venueName: string;
  title: string;
  titleFa: string;
  description: string;
  type: MaintenanceType;
  status: MaintenanceStatus;
  priority: MaintenancePriority;
  assignedTo: string;
  scheduledDate: Date;
  completedDate?: Date;
  cost?: number;
  createdAt: Date;
}

// Dashboard KPIs
export interface DashboardKPIs {
  totalVenues: number;
  activeVenues: number;
  utilizationRate: number;
  occupancyToday: number;
  maintenanceAlerts: number;
  satisfactionScore: number;
  totalBookings: number;
  pendingBookings: number;
}

// Report Types
export interface ReportData {
  period: string;
  utilization: number;
  bookings: number;
  revenue: number;
  maintenance: number;
}

// Navigation Items
export interface NavItem {
  title: string;
  titleFa: string;
  href: string;
  icon: string;
  badge?: number;
  roles: UserRole[];
}

// Universities
export interface University {
  id: string;
  name: string;
  nameFa: string;
  city: string;
  province: string;
}
