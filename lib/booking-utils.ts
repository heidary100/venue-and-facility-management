import { Booking, Venue, BookingConflict, TimeSlot } from "./types";
import { areIntervalsOverlapping } from "date-fns";

/**
 * Check if a booking conflicts with existing bookings
 */
export function checkBookingConflicts(
  newBooking: {
    venueId: string;
    startTime: Date;
    endTime: Date;
    attendees: number;
  },
  existingBookings: Booking[],
  venue: Venue
): BookingConflict[] {
  const conflicts: BookingConflict[] = [];

  // Check for time overlaps
  const venueBookings = existingBookings.filter(
    (b) => b.venueId === newBooking.venueId && b.status !== "rejected" && b.status !== "cancelled"
  );

  for (const booking of venueBookings) {
    const hasOverlap = areIntervalsOverlapping(
      { start: newBooking.startTime, end: newBooking.endTime },
      { start: new Date(booking.startTime), end: new Date(booking.endTime) }
    );

    if (hasOverlap) {
      conflicts.push({
        existingBooking: booking,
        type: "overlap",
        message: `این زمان با رزرو ${booking.userName} تداخل دارد`,
      });
    }
  }

  // Check capacity
  if (newBooking.attendees > venue.capacity) {
    conflicts.push({
      existingBooking: {} as Booking,
      type: "capacity",
      message: `تعداد شرکت‌کنندگان (${newBooking.attendees}) بیشتر از ظرفیت سالن (${venue.capacity}) است`,
    });
  }

  // Check if venue is under maintenance
  if (venue.status === "maintenance") {
    conflicts.push({
      existingBooking: {} as Booking,
      type: "maintenance",
      message: "این سالن در حال تعمیر و نگهداری است",
    });
  }

  return conflicts;
}

/**
 * Generate available time slots for a venue on a specific date
 */
export function generateAvailableSlots(
  venue: Venue,
  date: Date,
  bookings: Booking[]
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const dayOfWeek = date.getDay();
  
  // Get operating hours for this day
  const operatingHour = venue.operatingHours.find((oh) => {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    return oh.day === days[dayOfWeek];
  });

  if (!operatingHour || !operatingHour.isOpen) {
    return slots;
  }

  const [openHour] = operatingHour.open.split(":").map(Number);
  const [closeHour] = operatingHour.close.split(":").map(Number);

  // Generate hourly slots
  for (let hour = openHour; hour < closeHour; hour++) {
    const slotStart = new Date(date);
    slotStart.setHours(hour, 0, 0, 0);
    
    const slotEnd = new Date(date);
    slotEnd.setHours(hour + 1, 0, 0, 0);

    // Check if slot is booked
    const booking = bookings.find((b) => {
      if (b.venueId !== venue.id || b.status === "rejected" || b.status === "cancelled") {
        return false;
      }
      return areIntervalsOverlapping(
        { start: slotStart, end: slotEnd },
        { start: new Date(b.startTime), end: new Date(b.endTime) }
      );
    });

    const status = booking
      ? booking.status === "pending"
        ? "pending"
        : "booked"
      : venue.status === "maintenance"
      ? "maintenance"
      : "free";

    slots.push({
      time: `${hour.toString().padStart(2, "0")}:00`,
      timeFa: toPersianDigits(`${hour.toString().padStart(2, "0")}:۰۰`),
      hour,
      available: status === "free",
      bookingId: booking?.id,
      status,
    });
  }

  return slots;
}

/**
 * Convert English digits to Persian
 */
export function toPersianDigits(str: string): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
}

/**
 * Format date to Persian
 */
export function formatPersianDate(date: Date): string {
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * Format time to Persian
 */
export function formatPersianTime(date: Date): string {
  return toPersianDigits(
    new Intl.DateTimeFormat("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  );
}

/**
 * Get Persian day name
 */
export function getPersianDayName(date: Date): string {
  const days = ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه", "شنبه"];
  return days[date.getDay()];
}

/**
 * Calculate booking duration in hours
 */
export function calculateDuration(startTime: Date, endTime: Date): number {
  return (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
}

/**
 * Check if booking can be cancelled (at least 24 hours before start)
 */
export function canCancelBooking(booking: Booking): boolean {
  const now = new Date();
  const startTime = new Date(booking.startTime);
  const hoursUntilStart = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  return (
    (booking.status === "pending" || booking.status === "approved") &&
    hoursUntilStart >= 24
  );
}

/**
 * Get booking status color
 */
export function getBookingStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "bg-yellow-500",
    approved: "bg-green-500",
    rejected: "bg-red-500",
    cancelled: "bg-gray-500",
    completed: "bg-blue-500",
  };
  return colors[status] || "bg-gray-500";
}
