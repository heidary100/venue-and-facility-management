# ⚠️ DEPRECATED → See [docs/PHASE2-DOCUMENTATION.md](./docs/PHASE2-DOCUMENTATION.md) § 7

# University Sports Venue Management System - Phase 2

سامانه جامع مدیریت اماکن و تأسیسات ورزشی دانشگاه‌های کشور

## 📁 Folder Structure

```
├── app/
│   ├── layout.tsx              # Root layout with RTL & Persian support
│   ├── page.tsx                # Redirects to dashboard
│   ├── globals.css             # Theme & Vazirmatn font
│   ├── dashboard/
│   │   └── page.tsx            # Main dashboard with KPIs
│   ├── venues/
│   │   └── page.tsx            # Venue registry (CRUD)
│   ├── bookings/
│   │   └── page.tsx            # Smart calendar/booking system
│   ├── map/
│   │   └── page.tsx            # GIS/Map integration placeholder
│   ├── maintenance/
│   │   └── page.tsx            # Maintenance & evaluation module
│   ├── reports/
│   │   └── page.tsx            # Reports & analytics
│   └── settings/
│       └── page.tsx            # System settings
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx         # Navigation sidebar
│   │   ├── header.tsx          # Top header with search & user menu
│   │   └── dashboard-layout.tsx # Main layout wrapper
│   ├── dashboard/
│   │   ├── kpi-cards.tsx       # KPI metric cards
│   │   ├── charts.tsx          # Utilization & booking charts
│   │   └── widgets.tsx         # Recent bookings, alerts, quick actions
│   ├── theme-provider.tsx      # Dark/light mode provider
│   └── theme-toggle.tsx        # Theme toggle button
├── lib/
│   ├── types.ts                # TypeScript type definitions
│   ├── mock-data.ts            # Mock data & Persian number helpers
│   └── utils.ts                # Utility functions (cn)
└── public/
    └── manifest.json           # PWA manifest
```

## 🔐 Role-Based Access

| Role | Persian | Access Level |
|------|---------|--------------|
| `admin_national` | مدیر ملی | Full access to all features |
| `admin_regional` | مدیر منطقه‌ای | Regional venues & reports |
| `university_manager` | مدیر ورزش دانشگاه | University-level management |
| `facility_staff` | کارمند تأسیسات | Maintenance & bookings |
| `student` | دانشجو | View venues, create bookings |
| `athlete` | ورزشکار | View venues, create bookings |

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL=postgresql://...

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Map Integration (OpenStreetMap/Leaflet)
NEXT_PUBLIC_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
NEXT_PUBLIC_MAP_DEFAULT_CENTER=[35.6892, 51.3890]
NEXT_PUBLIC_MAP_DEFAULT_ZOOM=12

# File Storage
BLOB_READ_WRITE_TOKEN=your-blob-token

# API Keys (optional)
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

## 📱 PWA Support

The app is PWA-ready with:
- Web App Manifest (`public/manifest.json`)
- Mobile-first responsive design
- Dark/light mode support
- Persian (RTL) language support with Vazirmatn font

## 🎨 Design System

- **Colors**: Teal primary with dark neutral backgrounds
- **Typography**: Vazirmatn (Persian) + Geist (Latin)
- **Icons**: Lucide React
- **Components**: shadcn/ui
- **Charts**: Recharts

## 📊 Main Features

1. **Dashboard** - KPIs, utilization charts, recent bookings
2. **Venues** - CRUD operations with grid/list views
3. **Bookings** - Weekly calendar with time slots
4. **Map** - GIS placeholder for venue locations
5. **Maintenance** - Task management with priorities
6. **Reports** - Analytics with exportable reports
