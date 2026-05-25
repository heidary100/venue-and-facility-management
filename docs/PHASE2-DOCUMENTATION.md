# Phase 2 Documentation | مستندات فاز ۲

**سامانه ارزیابی و نظارت و مدیریت اماکن**  
*Venue Evaluation, Supervision, and Management System*  
Part of the **Comprehensive University Sports Ecosystem** (اکوسیستم جامع ورزش دانشگاهی)

| Meta | Value |
|------|-------|
| Version | 2.0.0 |
| Status | Frontend complete (mock data); backend integration planned |
| Stack | Next.js 16, React 19, TypeScript, Tailwind 4, shadcn/ui |
| Locale | Persian (fa), RTL |

---

## 1. Overview & Objectives | نمای کلی و اهداف

### 1.1 Mission

Phase 2 delivers a national-scale platform for **registering, booking, supervising, maintaining, and evaluating** university sports venues. It enables evidence-based decisions on utilization, quality, and maintenance across regions and universities.

### 1.2 Strategic objectives

| # | Objective (EN) | هدف (FA) |
|---|----------------|----------|
| 1 | Centralize venue registry with GIS | یکپارچه‌سازی ثبت اماکن و موقعیت مکانی |
| 2 | Digitize booking with conflict prevention | رزرو هوشمند با جلوگیری از تداخل |
| 3 | Operational maintenance workflow | گردش کار نگهداری و تعمیرات |
| 4 | Post-use quality evaluation | ارزیابی کیفیت پس از استفاده |
| 5 | Role-scoped dashboards & reporting | داشبورد و گزارش بر اساس نقش |
| 6 | RTL-first Persian UX | تجربه کاربری فارسی و راست‌به‌چپ |

### 1.3 Current implementation status

| Layer | Status | Notes |
|-------|--------|-------|
| UI / UX | ✅ Complete | All primary routes implemented |
| Client validation | ✅ Complete | Zod + React Hook Form |
| Mock data | ✅ Complete | `lib/mock-data.ts` |
| REST API | ⏳ Planned | Contracts in [API-SPEC.md](./API-SPEC.md) |
| Database | ⏳ Planned | Prisma schema in [DATA-MODELS.md](./DATA-MODELS.md) |
| SSO (Phase 1) | ⏳ Planned | JWT / OIDC integration point |

---

## 2. Scope of Phase 2 | محدوده فاز ۲

### 2.1 In scope (included)

- **Dashboard (فاز ۲):** KPIs, charts (Recharts), filters (region, university, date), activity feed
- **Venue registry:** CRUD UI, grid/list, facilities, operating hours, evaluations tab
- **Smart booking:** Calendar, form, conflict detection, approval states, my bookings, cancellation policy
- **Map & locator:** Leaflet map, markers, filters, heatmap, book-from-map
- **Maintenance:** Request form, Kanban board, preventive scheduler, quality metrics
- **Venue evaluation:** Multi-criteria ratings after booking
- **Reports & settings:** Analytics placeholders, configuration UI
- **Audit log:** Placeholder page for compliance trail
- **RBAC:** National, regional, university manager, facility staff, student/athlete

### 2.2 Out of scope (excluded — future phases)

- Payment / billing for venue rental
- SMS gateway (design hooks only)
- Native mobile apps (PWA-ready web only)
- AI predictive maintenance (readiness documented in §12)
- Full user management CRUD (`/users` route not implemented)
- Real-time WebSocket notifications (polling/REST planned)

### 2.3 Boundaries vs Phase 1 & Phase 3

| Phase | Responsibility |
|-------|----------------|
| **Phase 1** | SSO, identity, national user directory |
| **Phase 2** | Venues, bookings, maintenance, evaluation, maps (this document) |
| **Phase 3+** | Competitions, federations, athlete records (ecosystem modules) |

---

## 3. Key Features | ویژگی‌های کلیدی

See [FEATURES.md](./FEATURES.md) for the full prioritized list. Summary:

| Module | Route | Priority |
|--------|-------|----------|
| Phase 2 Dashboard | `/dashboard` | P0 |
| Venues | `/venues` | P0 |
| Bookings | `/bookings` | P0 |
| Map | `/map` | P0 |
| Maintenance | `/maintenance` | P0 |
| Reports | `/reports` | P1 |
| Audit | `/audit` | P1 |
| Settings | `/settings` | P2 |

---

## 4. User Roles & Permissions | نقش‌ها و دسترسی (RBAC)

### 4.1 Role definitions

| Role key | Persian label | Scope |
|----------|---------------|-------|
| `admin_national` | مدیر ملی | All regions and universities |
| `admin_regional` | دبیر منطقه‌ای | Universities in assigned `regionId` |
| `university_manager` | مدیر ورزش دانشگاه | Single `universityId` |
| `facility_staff` | کارمند تأسیسات | Maintenance + bookings (university) |
| `student` | دانشجو | Book + own bookings + browse venues |
| `athlete` | ورزشکار | Same as student |

### 4.2 Permission matrix

| Resource / Action | National | Regional | Univ. Manager | Facility | Student |
|-------------------|:--------:|:--------:|:-------------:|:--------:|:-------:|
| View dashboard (admin KPIs) | ✅ | ✅ | ✅ | ✅ | ❌ |
| Student dashboard | ❌ | ❌ | ❌ | ❌ | ✅ |
| List venues (scoped) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create/edit venue | ✅ | ✅ | ✅ | ⚠️ | ❌ |
| Admin booking calendar | ✅ | ✅ | ✅ | ✅ | ❌ |
| Create booking | ✅ | ✅ | ✅ | ✅ | ✅ |
| Approve/reject booking | ✅ | ✅ | ✅ | ⚠️ | ❌ |
| Map (full filters) | ✅ | ✅ | ✅ | ✅ | ❌ |
| Maintenance module | ✅ | ✅ | ✅ | ✅ | ❌ |
| Reports | ✅ | ✅ | ✅ | ❌ | ❌ |
| Audit log | ✅ | ✅ | ❌ | ❌ | ❌ |
| Settings | ✅ | ✅ | ✅ | ❌ | ❌ |

⚠️ = planned / partial in UI

### 4.3 Implementation references

- Navigation filtering: `components/layout/sidebar.tsx`
- Data scoping: `lib/role-utils.ts`
- Route guard: `components/role-guard.tsx`
- Demo role switcher: `components/layout/header.tsx` (development only)

---

## 5. Data Models | مدل‌های داده

Canonical TypeScript definitions live in `lib/types.ts`. Full reference and Prisma suggestions: [DATA-MODELS.md](./DATA-MODELS.md).

**Core entities:** `User`, `University`, `Venue`, `Booking`, `MaintenanceRequest`, `PreventiveMaintenance`, `VenueEvaluationDetailed`, `VenueQualityMetrics`, `Notification`, `ActivityItem`.

---

## 6. Architecture & Tech Stack | معماری و فناوری

### 6.1 High-level architecture

```mermaid
flowchart TB
  subgraph Client["Next.js App (RTL)"]
    Pages[App Router Pages]
    Components[React Components]
    RHF[React Hook Form + Zod]
    Mock[mock-data.ts]
    APIClient[lib/api/client.ts]
  end
  subgraph Future["Phase 2 Backend (planned)"]
    Nest[Nest.js API]
    PG[(PostgreSQL)]
    Redis[(Redis Cache)]
  end
  subgraph Phase1["Phase 1"]
    SSO[SSO / OIDC]
  end
  Pages --> Components
  Components --> RHF
  Components --> Mock
  Components -.-> APIClient
  APIClient -.-> Nest
  Nest --> PG
  Nest --> Redis
  SSO -.-> Nest
```

### 6.2 Frontend stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.x | App Router, SSR/SSG |
| React | 19.x | UI |
| TypeScript | 5.7 | Type safety |
| Tailwind CSS | 4.x | Styling |
| shadcn/ui | — | Component library |
| Recharts | 2.15 | Dashboard charts |
| React Big Calendar | 1.19 | Booking calendar |
| Leaflet / react-leaflet | 1.9 / 5.0 | Map |
| react-hook-form + zod | 7.x / 3.x | Forms |
| sonner | 1.7 | Toast notifications |
| date-fns-jalali | 4.x | Jalali dates |

### 6.3 Cross-cutting concerns

| Concern | Implementation |
|---------|----------------|
| Theming | `next-themes`, CSS variables in `app/globals.css` |
| i18n strings | `lib/i18n/fa.ts` |
| Errors | `components/error-boundary.tsx` |
| Loading | `components/ui/page-loader.tsx`, Suspense on pages |
| Auth context | `providers/user-provider.tsx` (mock) |

---

## 7. Folder Structure | ساختار پوشه‌ها

```
venue-and-facility-management/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root: RTL, AppProviders
│   ├── page.tsx                  # → /dashboard
│   ├── dashboard/page.tsx        # Phase 2 dashboard
│   ├── venues/page.tsx
│   ├── bookings/page.tsx
│   ├── map/page.tsx
│   ├── maintenance/page.tsx
│   ├── reports/page.tsx
│   ├── audit/page.tsx
│   └── settings/page.tsx
├── components/
│   ├── layout/                   # sidebar, header, dashboard-layout
│   ├── dashboard/                # phase2-dashboard, charts, KPIs
│   ├── bookings/
│   ├── map/
│   ├── maintenance/
│   ├── providers/                # app-providers
│   ├── error-boundary.tsx
│   ├── role-guard.tsx
│   └── ui/                       # shadcn primitives
├── lib/
│   ├── types.ts                  # Domain types
│   ├── mock-data.ts
│   ├── role-utils.ts
│   ├── dashboard-utils.ts
│   ├── booking-utils.ts
│   ├── maintenance-utils.ts
│   ├── map-utils.ts
│   ├── i18n/fa.ts
│   └── api/client.ts
├── providers/user-provider.tsx
├── docs/                         # This documentation package
├── public/manifest.json            # PWA
└── types/                        # Ambient declarations (leaflet, RBC)
```

---

## 8. API Contracts | قراردادهای API

REST design for Nest.js backend: [API-SPEC.md](./API-SPEC.md).

**Base URL:** `{NEXT_PUBLIC_API_URL}/api/v1`

**Auth:** `Authorization: Bearer <JWT>` from Phase 1 SSO.

---

## 9. UI/UX Guidelines | راهنمای رابط کاربری

### 9.1 Design principles

- **RTL-first:** `dir="rtl"` on `html` and layout wrappers
- **Persian copy:** All user-facing strings in Persian via `lib/i18n/fa.ts`
- **Digits:** Use `toPersianDigits()` for displayed numbers
- **Dates:** Jalali via `date-fns-jalali` / `formatPersianDate`
- **Accessibility:** shadcn focus rings, `sr-only` labels, semantic headings

### 9.2 Design system

| Token | Usage |
|-------|-------|
| `--primary` | Teal brand actions |
| `--chart-1` … `--chart-5` | Recharts series |
| Vazirmatn | Persian body font (globals.css) |
| Lucide | Icons |

### 9.3 Patterns

- **Forms:** Zod schema → `zodResolver` → shadcn `Form` fields → `FormMessage` for errors
- **Feedback:** `sonner` toasts for success/error
- **Dense data:** Cards + tables + sheets for detail views
- **Mobile:** Collapsible sidebar (`Sheet`), responsive grids

---

## 10. Deployment & Production Readiness | استقرار و آمادگی تولید

Full guide: [DEPLOYMENT.md](./DEPLOYMENT.md).

### 10.1 Environment variables

```env
# App
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://venues.example.ir

# API (when backend live)
NEXT_PUBLIC_API_URL=https://api.example.ir/api/v1

# Map
NEXT_PUBLIC_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
NEXT_PUBLIC_MAP_DEFAULT_CENTER=35.6892,51.3890
NEXT_PUBLIC_MAP_DEFAULT_ZOOM=12

# Auth (Phase 1 SSO)
NEXTAUTH_URL=https://venues.example.ir
NEXTAUTH_SECRET=<strong-secret>

# Database (backend)
DATABASE_URL=postgresql://user:pass@host:5432/venues

# Observability
NEXT_PUBLIC_ANALYTICS_ID=
SENTRY_DSN=
```

### 10.2 Build & run

```bash
pnpm install
pnpm build
pnpm start
```

### 10.3 Scaling (~10× concurrent users)

| Area | Recommendation |
|------|----------------|
| Frontend | Vercel edge / CDN; static pages where possible |
| API | Horizontal Nest.js replicas behind load balancer |
| DB | PostgreSQL read replicas; connection pooling (PgBouncer) |
| Cache | Redis for dashboard KPIs (TTL 60s) |
| Maps | Tile CDN; avoid server-side map rendering |
| Sessions | Stateless JWT; no sticky sessions required |

### 10.4 Security & data protection

- HTTPS everywhere; HSTS at reverse proxy
- JWT short TTL + refresh via Phase 1 SSO
- RBAC enforced **server-side** (client guards are UX only)
- Input validation: Zod (client) + class-validator/Zod (server)
- File uploads: virus scan, size limits, signed URLs (S3-compatible)
- Audit log: append-only table for sensitive actions
- **PII:** Minimize storage; align with Iran data protection policies
- **CSP:** Restrict script sources in production `next.config`

### 10.5 Error handling & monitoring

| Layer | Approach |
|-------|----------|
| React | `ErrorBoundary` per major page |
| API | Standard error envelope `{ statusCode, message, errors[] }` |
| Logging | Structured JSON logs (Pino) on Nest |
| Metrics | Prometheus + Grafana or Vercel Analytics |
| Uptime | Health check `GET /api/v1/health` |
| Alerts | PagerDuty/email on 5xx rate > 1% |

### 10.6 Backup & disaster recovery

- PostgreSQL: daily full backup + WAL archiving
- RPO target: 24 hours (adjust per policy)
- RTO target: 4 hours for API + DB restore
- Document runbook in ops wiki

---

## 11. Integration Points | نقاط یکپارچه‌سازی

### 11.1 Phase 1 — SSO / Identity

```
User → Phase 1 OIDC → JWT (roles, universityId, regionId) → Phase 2 API
```

- Map claims: `sub`, `role`, `university_id`, `region_id`
- Frontend: replace `UserProvider` mock with session from NextAuth or custom middleware

### 11.2 Future ecosystem modules

| Module | Integration |
|--------|-------------|
| Competitions | Link bookings to event IDs |
| Athlete registry | Restrict bookings by team affiliation |
| National reporting | Export KPIs to data warehouse |

---

## 12. Future Enhancements & AI Readiness | توسعه آینده و آمادگی هوش مصنوعی

### 12.1 Near-term backlog

- Email/SMS notifications on booking status
- Recurring bookings
- Manager approval inbox
- Marker clustering on map
- Export PDF/Excel reports
- Real `/users` admin module

### 12.2 AI readiness

| Use case | Data required | Endpoint sketch |
|----------|---------------|-----------------|
| Utilization forecast | Historical bookings per venue | `GET /ai/forecast/utilization` |
| Maintenance prioritization | Request history + severity | `POST /ai/maintenance/prioritize` |
| Anomaly detection | Satisfaction score drops | `GET /ai/quality/anomalies` |
| Smart slot suggestion | `SmartSuggestion` type exists | `GET /ai/bookings/suggest` |

Prepare by logging structured events (`ActivityItem`, audit log) and maintaining clean dimensional data in the warehouse.

---

## Appendix A — Application routes

| Route | Page |
|-------|------|
| `/` | Redirect to dashboard |
| `/dashboard` | Phase 2 / student dashboard |
| `/venues` | Venue registry |
| `/bookings` | Booking management |
| `/map` | Facility map |
| `/maintenance` | Maintenance & evaluation |
| `/reports` | Reports |
| `/audit` | Audit log (placeholder) |
| `/settings` | Settings |

## Appendix B — Related documents

- [FEATURES.md](./FEATURES.md)
- [DATA-MODELS.md](./DATA-MODELS.md)
- [API-SPEC.md](./API-SPEC.md)
- [DEPLOYMENT.md](./DEPLOYMENT.md)

---

*Maintainers: update this file when scope or architecture changes. Single source of truth for Phase 2.*
