# Deployment Guide | راهنمای استقرار

Production deployment for the Phase 2 **Next.js frontend** and planned **Nest.js API**.

---

## 1. Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | 20 LTS (minimum 18) |
| pnpm | 9+ (or npm 10+) |
| PostgreSQL | 15+ (backend) |
| Redis | 7+ (optional cache) |

---

## 2. Local development

### 2.1 Install

```bash
git clone <repository-url>
cd venue-and-facility-management
pnpm install
```

All dependencies including `leaflet`, `react-leaflet`, and `react-big-calendar` are declared in `package.json`. No manual map package install is required for standard clones.

### 2.2 Environment

Create `.env.local`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1

NEXT_PUBLIC_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
NEXT_PUBLIC_MAP_DEFAULT_CENTER=35.6892,51.3890
NEXT_PUBLIC_MAP_DEFAULT_ZOOM=12

# When SSO is wired:
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-change-in-production
```

### 2.3 Run

```bash
pnpm dev
```

| URL | Module |
|-----|--------|
| http://localhost:3000/dashboard | Dashboard |
| http://localhost:3000/bookings | Bookings |
| http://localhost:3000/map | Map |
| http://localhost:3000/maintenance | Maintenance |

### 2.4 Verify build

```bash
pnpm build
pnpm start
```

Expected routes (static):

```
/  /dashboard  /venues  /bookings  /map
/maintenance  /reports  /audit  /settings
```

---

## 3. Vercel deployment (frontend)

### 3.1 Steps

1. Import Git repository in Vercel
2. Framework preset: **Next.js**
3. Build command: `pnpm build`
4. Output: default (Next.js 16)
5. Set environment variables (§ 2.2) in Vercel dashboard
6. Enable **Iran region** or nearest edge per latency requirements

### 3.2 `vercel.json` (optional)

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ]
}
```

### 3.3 Production checklist

- [ ] Remove demo role switcher or guard behind `NODE_ENV=development`
- [ ] Set strong `NEXTAUTH_SECRET`
- [ ] Point `NEXT_PUBLIC_API_URL` to production API
- [ ] Enable Vercel Analytics or Sentry
- [ ] Confirm RTL fonts load (Vazirmatn from globals.css)

---

## 4. Docker deployment

### 4.1 Frontend Dockerfile

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

Enable standalone output in `next.config.ts`:

```typescript
const nextConfig = { output: 'standalone' };
export default nextConfig;
```

### 4.2 Compose stack (frontend + API + DB)

```yaml
services:
  web:
    build: .
    ports: ["3000:3000"]
    environment:
      NEXT_PUBLIC_API_URL: http://api:3001/api/v1
    depends_on: [api]

  api:
    image: your-registry/venues-api:latest
    ports: ["3001:3001"]
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/venues
    depends_on: [db]

  db:
    image: postgres:15-alpine
    volumes: [pgdata:/var/lib/postgresql/data]

volumes:
  pgdata:
```

---

## 5. Backend deployment (Nest.js — planned)

```bash
pnpm build
node dist/main.js
```

- Run migrations before traffic: `npx prisma migrate deploy`
- Health probe: `GET /api/v1/health`
- Horizontal scale: stateless replicas behind nginx/ALB

---

## 6. Scaling for ~10× concurrent users

Assume baseline 50 concurrent → target 500 concurrent.

| Component | Action |
|-----------|--------|
| Next.js | CDN cache static assets; ISR for public venue list if needed |
| API | 3–5 replicas; CPU 1 vCPU each |
| PostgreSQL | `max_connections` + PgBouncer; read replica for reports |
| Redis | Cache dashboard KPIs TTL 60s |
| Bookings | DB constraint on overlapping ranges per venue |
| Maps | Client-side tiles only — no server proxy |

**Load test:** k6 or Artillery on `GET /venues`, `GET /bookings`, `POST /bookings`.

---

## 7. Security

| Control | Implementation |
|---------|----------------|
| TLS | Terminate at CDN / reverse proxy |
| Auth | JWT from Phase 1; validate on every API request |
| CORS | Allow only `NEXT_PUBLIC_APP_URL` |
| Rate limit | 100 req/min per IP on public endpoints |
| CSRF | SameSite cookies if using cookie session |
| Secrets | Vault / platform secret manager — never commit `.env` |
| RBAC | Server-side guards — **never trust client-only** `role-guard` |

---

## 8. Monitoring & operations

| Tool | Purpose |
|------|---------|
| Sentry | Frontend + API exceptions |
| Uptime Robot / Pingdom | `/health` |
| Pino + Loki | API structured logs |
| Grafana | DB connections, latency p95 |

**Alert thresholds:**

- API p95 latency > 2s for 5 min
- Error rate > 1% for 5 min
- DB disk > 80%

---

## 9. Backup & recovery

```bash
# Daily PostgreSQL backup
pg_dump $DATABASE_URL | gzip > backup_$(date +%F).sql.gz
```

- Retain 30 days
- Quarterly restore drill
- Document RPO/RTO in ops runbook (see main doc § 10.6)

---

## 10. Troubleshooting

| Issue | Fix |
|-------|-----|
| Map blank | Check Leaflet CSS in `globals.css`; disable SSR on map page |
| Calendar SSR error | `react-big-calendar` is client-only — ensure `"use client"` |
| Build OOM | `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` |
| RTL layout broken | Verify `lang="fa" dir="rtl"` on `<html>` |
| Types fail | `pnpm exec tsc --noEmit` |

Clear cache:

```bash
rm -rf .next
pnpm build
```

---

## 11. CI/CD pipeline (recommended)

```yaml
name: ci
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm exec tsc --noEmit
      - run: pnpm build
      - run: pnpm lint
```

Deploy production on tag `v*` only.

---

## 12. Post-deploy smoke test

1. Login (or demo role) → dashboard KPIs render
2. Create booking → toast success → appears in my bookings
3. Open map → markers visible → popup works
4. Submit maintenance request → appears on Kanban
5. Switch to student role → limited nav → booking only

---

*For architecture context see [PHASE2-DOCUMENTATION.md](./PHASE2-DOCUMENTATION.md).*
