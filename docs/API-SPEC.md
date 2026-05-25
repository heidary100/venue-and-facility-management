# API Specification | مشخصات API

**Version:** 1.0.0 (draft)  
**Base URL:** `https://api.example.ir/api/v1`  
**Format:** JSON · UTF-8 · Persian error messages supported

---

## 1. Conventions

### 1.1 Authentication

```http
Authorization: Bearer <access_token>
```

Tokens issued by Phase 1 SSO. Claims:

```json
{
  "sub": "user-uuid",
  "role": "university_manager",
  "universityId": "u1",
  "regionId": "region_tehran"
}
```

### 1.2 Standard response envelope

**Success:**

```json
{
  "data": { },
  "meta": { "page": 1, "limit": 20, "total": 100 }
}
```

**Error:**

```json
{
  "statusCode": 400,
  "message": "داده‌های ورودی نامعتبر است",
  "errors": [
    { "field": "startTime", "message": "زمان شروع الزامی است" }
  ]
}
```

### 1.3 Pagination

Query: `?page=1&limit=20&sort=-createdAt`

### 1.4 Scoping (RBAC)

| Role | Auto-applied filter |
|------|---------------------|
| `admin_national` | none |
| `admin_regional` | `regionId` from JWT |
| `university_manager` | `universityId` from JWT |
| `student` | `userId=me` on bookings |

---

## 2. Auth

### `POST /auth/login`

*Delegated to Phase 1 — documented for completeness.*

**Request:**

```json
{
  "email": "user@university.ac.ir",
  "password": "***"
}
```

**Response `200`:**

```json
{
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "expiresIn": 3600,
    "user": {
      "id": "u1",
      "name": "علی احمدی",
      "role": "admin_national"
    }
  }
}
```

### `GET /auth/me`

**Response `200`:**

```json
{
  "data": {
    "id": "u1",
    "name": "علی احمدی",
    "email": "ali@example.ir",
    "role": "university_manager",
    "universityId": "u1",
    "regionId": "region_tehran"
  }
}
```

---

## 3. Venues

### `GET /venues`

**Query:** `regionId`, `universityId`, `type`, `status`, `search`, `page`, `limit`

**Response `200`:**

```json
{
  "data": [
    {
      "id": "v1",
      "nameFa": "ورزشگاه المپیک",
      "type": "stadium",
      "status": "active",
      "capacity": 25000,
      "utilizationRate": 78,
      "universityId": "u1",
      "location": { "lat": 35.6892, "lng": 51.389, "addressFa": "پردیس دانشگاه" }
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 156 }
}
```

### `GET /venues/:id`

**Response `200`:** Full `Venue` object.

### `POST /venues`

**Roles:** `admin_national`, `admin_regional`, `university_manager`

**Request:**

```json
{
  "nameFa": "سالن جدید",
  "type": "gym",
  "capacity": 500,
  "universityId": "u1",
  "location": { "lat": 35.7, "lng": 51.4, "addressFa": "..." },
  "facilities": { "parking": true, "lockerRooms": true }
}
```

**Response `201`:** Created venue.

### `PUT /venues/:id` · `DELETE /venues/:id`

Standard update / soft-delete.

---

## 4. Bookings

### `GET /bookings`

**Query:** `from`, `to`, `status`, `venueId`, `userId` (admin only)

**Response `200`:**

```json
{
  "data": [
    {
      "id": "b1",
      "venueId": "v1",
      "venueName": "ورزشگاه المپیک",
      "userId": "u4",
      "userName": "سارا محمدی",
      "startTime": "2026-05-26T08:00:00Z",
      "endTime": "2026-05-26T10:00:00Z",
      "purpose": "training",
      "status": "pending",
      "attendees": 22
    }
  ]
}
```

### `POST /bookings`

**Request:**

```json
{
  "venueId": "v1",
  "startTime": "2026-05-26T08:00:00Z",
  "endTime": "2026-05-26T10:00:00Z",
  "purpose": "training",
  "purposeDetail": "تمرین تیم فوتبال",
  "attendees": 22,
  "notes": ""
}
```

**Response `201`:** Booking with `status: "pending"`.

**Response `409` (conflict):**

```json
{
  "statusCode": 409,
  "message": "تداخل زمانی با رزرو موجود",
  "errors": [{ "type": "overlap", "bookingId": "b99" }]
}
```

### `PATCH /bookings/:id/status`

**Roles:** `university_manager`, `admin_regional`, `admin_national`

**Request:**

```json
{
  "status": "approved",
  "rejectionReason": null
}
```

or

```json
{
  "status": "rejected",
  "rejectionReason": "تداخل با رویداد رسمی"
}
```

### `POST /bookings/:id/cancel`

**Request:**

```json
{
  "reason": "تغییر برنامه تیم"
}
```

**Rules:** Must be ≥ 24h before `startTime` (configurable).

### `GET /bookings/conflicts`

**Query:** `venueId`, `startTime`, `endTime`, `attendees`

**Response:** `{ "hasConflict": true, "conflicts": [...] }`

---

## 5. Maintenance

### `GET /maintenance/requests`

**Query:** `venueId`, `status`, `priority`, `page`, `limit`

### `POST /maintenance/requests`

**Request:**

```json
{
  "venueId": "v1",
  "category": "electrical",
  "title": "خرابی روشنایی",
  "description": "چراغ‌های ردیف شرقی",
  "priority": "high",
  "photos": ["https://storage/photo1.jpg"]
}
```

### `PATCH /maintenance/requests/:id`

Update `status`, `assignedTo`, `scheduledDate`, `actualCost`.

### `GET /maintenance/preventive` · `POST /maintenance/preventive`

CRUD for preventive schedules.

---

## 6. Evaluations

### `POST /evaluations`

**Request:**

```json
{
  "bookingId": "b1",
  "ratings": {
    "cleanliness": 5,
    "equipment": 4,
    "lighting": 5,
    "safety": 5,
    "overall": 5
  },
  "comment": "محیط عالی"
}
```

### `GET /venues/:id/quality-metrics`

**Response:**

```json
{
  "data": {
    "venueId": "v1",
    "averageRatings": { "cleanliness": 4.5, "overall": 4.6 },
    "totalEvaluations": 42,
    "lastEvaluated": "2026-05-20T12:00:00Z"
  }
}
```

---

## 7. Dashboard

### `GET /dashboard/kpis`

**Query:** `regionId`, `universityId`, `from`, `to`

**Response:**

```json
{
  "data": {
    "totalVenues": 42,
    "avgUtilization": 73.5,
    "activeBookingsToday": 18,
    "avgSatisfaction": 4.6,
    "openMaintenance": 5
  }
}
```

### `GET /dashboard/charts/occupancy`

**Response:**

```json
{
  "data": [
    { "month": "فروردین", "rate": 69 },
    { "month": "اردیبهشت", "rate": 76 }
  ]
}
```

### `GET /dashboard/activity`

**Query:** `limit=10`

---

## 8. Audit

### `GET /audit/logs`

**Roles:** `admin_national`, `admin_regional`

**Query:** `page`, `limit`, `userId`, `action`, `from`, `to`

**Response:**

```json
{
  "data": [
    {
      "id": "log1",
      "userId": "u1",
      "userName": "علی احمدی",
      "action": "booking.approved",
      "entityType": "Booking",
      "entityId": "b1",
      "createdAt": "2026-05-25T10:00:00Z"
    }
  ]
}
```

---

## 9. Health

### `GET /health`

```json
{ "status": "ok", "db": "up", "version": "1.0.0" }
```

---

## 10. Frontend integration map

| Frontend file | Replace with service |
|---------------|---------------------|
| `lib/mock-data.ts` | `lib/api/services/*.service.ts` |
| `providers/user-provider.tsx` | Session from `/auth/me` |
| `lib/dashboard-utils.ts` | `GET /dashboard/*` |

**Client:** `lib/api/client.ts`

```typescript
import { apiClient } from '@/lib/api/client';

export async function getVenues(params: URLSearchParams) {
  return apiClient<VenueListResponse>(`/venues?${params}`);
}
```

---

## 11. Nest.js module layout

See [PHASE2-DOCUMENTATION.md](./PHASE2-DOCUMENTATION.md) § 8 and legacy `docs/api-structure.md` (merged here).

```
src/modules/
  auth/ bookings/ venues/ maintenance/
  evaluations/ dashboard/ audit/ reports/
```

---

## 12. OpenAPI

Generate from Nest decorators:

```bash
npx @nestjs/swagger cli generate
```

Host Swagger UI at `/api/docs` (non-production or auth-protected).
