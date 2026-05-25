"use client";

import * as React from "react";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { faIR } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Booking } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatPersianDate, formatPersianTime } from "@/lib/booking-utils";

const locales = {
  "fa-IR": faIR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 6 }), // Saturday
  getDay,
  locales,
});

interface BookingCalendarProps {
  bookings: Booking[];
  onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
  onSelectEvent?: (event: Booking) => void;
  view?: View;
  onViewChange?: (view: View) => void;
  date?: Date;
  onNavigate?: (date: Date) => void;
}

const messages = {
  allDay: "تمام روز",
  previous: "قبلی",
  next: "بعدی",
  today: "امروز",
  month: "ماه",
  week: "هفته",
  day: "روز",
  agenda: "برنامه",
  date: "تاریخ",
  time: "زمان",
  event: "رویداد",
  noEventsInRange: "هیچ رزروی در این بازه زمانی وجود ندارد",
  showMore: (total: number) => `+ ${total} بیشتر`,
};

export function BookingCalendar({
  bookings,
  onSelectSlot,
  onSelectEvent,
  view = "week",
  onViewChange,
  date,
  onNavigate,
}: BookingCalendarProps) {
  const events = React.useMemo(() => {
    return bookings.map((booking) => ({
      ...booking,
      start: new Date(booking.startTime),
      end: new Date(booking.endTime),
      title: `${booking.venueName} - ${booking.userName}`,
    }));
  }, [bookings]);

  const eventStyleGetter = (event: Booking) => {
    const statusColors: Record<string, string> = {
      pending: "#eab308",
      approved: "#22c55e",
      rejected: "#ef4444",
      cancelled: "#6b7280",
      completed: "#3b82f6",
    };

    return {
      style: {
        backgroundColor: statusColors[event.status] || "#6b7280",
        borderRadius: "6px",
        opacity: 0.9,
        color: "white",
        border: "0px",
        display: "block",
        fontSize: "0.875rem",
        padding: "4px 8px",
      },
    };
  };

  return (
    <div className="booking-calendar-wrapper" dir="rtl">
      <style jsx global>{`
        .booking-calendar-wrapper {
          height: 600px;
          direction: rtl;
        }
        
        .rbc-calendar {
          font-family: 'Vazirmatn', sans-serif;
          direction: rtl;
        }
        
        .rbc-header {
          padding: 12px 4px;
          font-weight: 600;
          border-bottom: 2px solid hsl(var(--border));
          background: hsl(var(--muted));
        }
        
        .rbc-time-view {
          border: 1px solid hsl(var(--border));
          border-radius: 8px;
          overflow: hidden;
        }
        
        .rbc-time-header {
          border-bottom: 2px solid hsl(var(--border));
        }
        
        .rbc-time-content {
          border-top: none;
        }
        
        .rbc-timeslot-group {
          border-bottom: 1px solid hsl(var(--border));
          min-height: 60px;
        }
        
        .rbc-time-slot {
          border-top: 1px solid hsl(var(--border) / 0.3);
        }
        
        .rbc-current-time-indicator {
          background-color: hsl(var(--primary));
          height: 2px;
        }
        
        .rbc-today {
          background-color: hsl(var(--accent) / 0.1);
        }
        
        .rbc-event {
          padding: 4px 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .rbc-event:hover {
          opacity: 1 !important;
          transform: scale(1.02);
        }
        
        .rbc-event-label {
          font-size: 0.75rem;
        }
        
        .rbc-event-content {
          font-size: 0.875rem;
        }
        
        .rbc-toolbar {
          padding: 16px;
          margin-bottom: 16px;
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        
        .rbc-toolbar button {
          padding: 8px 16px;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--background));
          color: hsl(var(--foreground));
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Vazirmatn', sans-serif;
          font-size: 0.875rem;
        }
        
        .rbc-toolbar button:hover {
          background: hsl(var(--accent));
        }
        
        .rbc-toolbar button.rbc-active {
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          border-color: hsl(var(--primary));
        }
        
        .rbc-toolbar-label {
          font-size: 1.125rem;
          font-weight: 600;
          color: hsl(var(--foreground));
        }
        
        .rbc-day-slot .rbc-time-slot {
          border-top: 1px solid hsl(var(--border) / 0.2);
        }
        
        .rbc-time-header-content {
          border-left: none;
        }
        
        .rbc-time-content > * + * > * {
          border-left: 1px solid hsl(var(--border));
        }
        
        .rbc-day-slot .rbc-events-container {
          margin-right: 0;
        }
        
        .rbc-addons-dnd .rbc-addons-dnd-resizable {
          position: relative;
        }
        
        .rbc-slot-selection {
          background-color: hsl(var(--primary) / 0.2);
          border: 2px solid hsl(var(--primary));
        }
      `}</style>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        messages={messages}
        culture="fa-IR"
        rtl={true}
        view={view}
        onView={onViewChange}
        date={date}
        onNavigate={onNavigate}
        onSelectSlot={onSelectSlot}
        onSelectEvent={onSelectEvent}
        selectable
        eventPropGetter={eventStyleGetter}
        step={30}
        timeslots={2}
        min={new Date(2024, 0, 1, 6, 0, 0)}
        max={new Date(2024, 0, 1, 23, 0, 0)}
        formats={{
          dayFormat: (date, culture, localizer) =>
            localizer?.format(date, "EEEE", culture) || "",
          dayHeaderFormat: (date, culture, localizer) =>
            localizer?.format(date, "dd MMMM", culture) || "",
          timeGutterFormat: (date, culture, localizer) =>
            localizer?.format(date, "HH:mm", culture) || "",
          eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
            `${localizer?.format(start, "HH:mm", culture)} - ${localizer?.format(end, "HH:mm", culture)}`,
        }}
      />
    </div>
  );
}
