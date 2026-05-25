# ⚠️ DEPRECATED → See [docs/FEATURES.md](./docs/FEATURES.md) § Smart Booking

# Smart Booking / Reservation System - Phase 2

## ✅ Implemented Features

### 1. **Calendar Integration**
- ✅ React Big Calendar with full RTL support
- ✅ Persian (Jalali) date formatting
- ✅ Week, Day, and Month views
- ✅ Real-time availability visualization
- ✅ Color-coded booking statuses:
  - 🟡 Pending (در انتظار تأیید)
  - 🟢 Approved (تأیید شده)
  - 🔴 Rejected (رد شده)
  - ⚫ Cancelled (لغو شده)
  - 🔵 Completed (انجام شده)

### 2. **Smart Booking Form**
- ✅ Venue search with combobox (searchable dropdown)
- ✅ Persian calendar date picker
- ✅ Time range selection (start/end time)
- ✅ Purpose selection:
  - تمرین (Training)
  - کلاس درسی (PE Class)
  - مسابقه (Competition)
  - رویداد (Event)
  - سایر (Other)
- ✅ Number of participants input
- ✅ Special requests textarea
- ✅ Real-time conflict detection
- ✅ Capacity validation
- ✅ Maintenance status checking

### 3. **Conflict Detection System**
- ✅ Automatic time overlap detection
- ✅ Capacity validation (attendees vs venue capacity)
- ✅ Maintenance period blocking
- ✅ Real-time validation feedback
- ✅ Persian error messages

### 4. **Booking Approval Workflow**
- ✅ Student → University Manager → Approval flow
- ✅ Status tracking:
  - Pending: Awaiting approval
  - Approved: Manager approved
  - Rejected: Manager rejected with reason
  - Cancelled: User cancelled with reason

### 5. **My Bookings Page**
- ✅ Tabbed interface:
  - آینده (Upcoming): Pending + Approved future bookings
  - گذشته (Past): Completed bookings
  - لغو/رد شده (Cancelled/Rejected): Cancelled or rejected bookings
- ✅ Booking cards with full details
- ✅ Status badges with icons
- ✅ Quick actions menu
- ✅ View details sheet

### 6. **Cancellation System**
- ✅ 24-hour advance cancellation policy
- ✅ Cancellation reason required
- ✅ Confirmation dialog
- ✅ Status update to "cancelled"
- ✅ Toast notifications

### 7. **Booking Details View**
- ✅ Comprehensive side sheet with:
  - Venue information
  - Time and duration
  - Purpose and description
  - Participant count
  - Special requests
  - User information
  - Approval/rejection details
  - Status history

### 8. **Statistics Dashboard**
- ✅ Total bookings count
- ✅ Pending bookings count
- ✅ Approved bookings count
- ✅ Upcoming bookings count
- ✅ Persian digit formatting

### 9. **RTL & Persian Support**
- ✅ Full RTL layout
- ✅ Vazirmatn Persian font
- ✅ Persian date formatting (Jalali calendar)
- ✅ Persian digit conversion
- ✅ Persian day names
- ✅ All UI text in Persian

### 10. **TypeScript Types**
- ✅ Complete type definitions in `lib/types.ts`
- ✅ Booking, Venue, BookingConflict types
- ✅ BookingStatus, BookingPurpose enums
- ✅ Full type safety

## 📁 File Structure

```
lib/
├── booking-utils.ts          # Utility functions for bookings
├── types.ts                   # TypeScript type definitions
└── mock-data.ts              # Mock data (existing)

components/
├── bookings/
│   ├── booking-calendar.tsx   # React Big Calendar wrapper
│   ├── booking-form.tsx       # Smart booking form with validation
│   ├── my-bookings.tsx        # My bookings page with tabs
│   └── venue-search-combobox.tsx  # Searchable venue selector
└── ui/
    └── form.tsx              # Form components (react-hook-form)

app/
├── bookings/
│   └── page.tsx              # Main bookings page
└── globals.css               # Calendar RTL styles

```

## 🎨 UI Components Used

- shadcn/ui components:
  - Card, Button, Badge
  - Dialog, Sheet, AlertDialog
  - Tabs, Select, Input, Textarea
  - Calendar, Popover, Command
  - Form (react-hook-form integration)
  - Toast notifications (sonner)

## 🔧 Dependencies Added

- `react-big-calendar` - Calendar component
- `date-fns-jalali` - Persian date support
- `@hookform/resolvers` - Form validation
- `zod` - Schema validation

## 🚀 Key Features

1. **Real-time Conflict Detection**: Automatically checks for time overlaps, capacity issues, and maintenance periods
2. **Smart Venue Search**: Searchable combobox with venue details (capacity, location)
3. **Persian Calendar**: Full Jalali calendar support with Persian formatting
4. **Approval Workflow**: Complete booking lifecycle from request to approval/rejection
5. **Cancellation Policy**: 24-hour advance cancellation with reason tracking
6. **Responsive Design**: Works on desktop and mobile
7. **Accessibility**: Proper ARIA labels and keyboard navigation

## 📊 Booking Statuses

| Status | Persian | Color | Description |
|--------|---------|-------|-------------|
| pending | در انتظار تأیید | Yellow | Awaiting manager approval |
| approved | تأیید شده | Green | Approved by manager |
| rejected | رد شده | Red | Rejected by manager |
| cancelled | لغو شده | Gray | Cancelled by user |
| completed | انجام شده | Blue | Booking completed |

## 🎯 Usage

1. **Create New Booking**: Click "رزرو جدید" button or click on calendar slot
2. **View Calendar**: Switch between Week/Day/Month views
3. **My Bookings**: View all your bookings organized by status
4. **Cancel Booking**: Click on booking → More menu → Cancel (if eligible)
5. **View Details**: Click on any booking to see full details

## ✨ Next Steps (Optional Enhancements)

- [ ] Email notifications for booking status changes
- [ ] Recurring bookings (daily, weekly, monthly)
- [ ] Booking history and analytics
- [ ] Export bookings to PDF/Excel
- [ ] Integration with payment system
- [ ] SMS notifications
- [ ] Manager approval dashboard
- [ ] Booking templates for frequent users
