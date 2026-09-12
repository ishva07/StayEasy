# 🏨 StayEasy

A full-stack hotel discovery and booking platform, built to production-grade patterns — combining natural-language search, real-time room holds, Razorpay payments, and role-based hotel administration.

`Node` `TypeScript` `Next.js` `Express` `PostgreSQL` `Prisma` `Redis` `Docker`

## 📖 Table of Contents
- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Technical Deep Dives](#-technical-deep-dives)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Roadmap](#-roadmap)

## 🚀 Overview

StayEasy is a full-stack hotel booking platform serving two audiences from one codebase:

- **Travelers** who search, filter, and book hotel rooms — including via natural-language search ("a quiet resort in Mumbai under 5000 for 2 guests")
- **Hotel/admin staff** who manage hotels, rooms, amenities, cities, bookings, and reviews through a dedicated admin dashboard

What sets it apart isn't just CRUD — it's how the system handles the hard problems in booking platforms:

- 🔒 **Redis-based room holds** to prevent double-booking during the payment window
- 💳 **Razorpay webhook processing** with HMAC signature verification and database-level idempotency
- 🤖 **AI-assisted natural-language search** where the LLM acts purely as a parser — grounded in real DB entities, validated with Zod, with a fully independent deterministic fallback that reconstructs the same structured filters without AI
- 🛡️ **Permission-based RBAC** — access control modeled as data (roles ↔ permissions), not hardcoded role checks
- 🚦 **Redis-backed rate limiting** — a single reusable limiter factory configured differently per route (login, refresh, writes, global)

## ✨ Key Features

**Customer-facing**
- Registration, login, refresh-token rotation (single-use), session persistence
- Hotel browsing with filters: city, property type, amenities, guest capacity, price range, rating, availability by date, pagination & sorting
- Natural-language hotel search
- End-to-end booking flow: hold → pay → confirm
- Razorpay payment integration with webhook-driven confirmation
- Booking history, cancellation, and refund tracking
- Hotel reviews and ratings

**Admin**
- Full CRUD for hotels, rooms, cities, property types, amenities, and image galleries
- Booking management and status transitions (with an explicit state machine)
- Review moderation
- Dashboard analytics: revenue, monthly bookings, booking-status breakdowns, AI search logs

**Under the hood**

| Feature | What makes it notable |
|---|---|
| Booking holds | Redis `SET NX EX` locks each room-**night** (not the whole date range) for 600s during checkout, with active rollback on payment-order failure and passive rollback via TTL otherwise |
| Payment reliability | HMAC-SHA256 webhook signature verification against the **raw** request body, a DB-unique `WebhookEvent.eventId` for real idempotency, and automatic refunds on orphaned payments |
| AI search | LLM used strictly as a **parser** (never touches the DB directly), grounded in real city/amenity/property-type names, validated with Zod, with a fully independent deterministic fallback (entity matching + regex extraction) feeding into Postgres full-text search |
| Authorization | Permission-based RBAC — `Permission` + `RolePermission` tables, enforced by a generic `hasPermission` middleware, so access changes are data changes, not code changes |
| Rate limiting | One generic Redis-backed limiter factory, configured per-route (IP-based for login/refresh/global, user-ID-based for writes), fail-open if Redis is unavailable |
| Security | 15-min JWT access tokens, 7-day single-use rotating refresh tokens (verified against both signature and DB), httpOnly cookies scoped by path, bcrypt hashing |

## 🛠 Tech Stack

**Backend:** Node.js 22 · Express 5 · TypeScript · Prisma 6 · PostgreSQL 16 · Redis (ioredis) · Zod · JWT · bcryptjs

**Frontend:** Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TanStack Query & Table · Zustand · React Hook Form + Zod · Recharts · Radix UI

**Integrations:** Razorpay (payments) · Cloudinary (image storage, via Multer) · Google Gemini (NL search parsing) · Nodemailer/SMTP (transactional email)

**Infra:** Docker (multi-stage builds) & Docker Compose · Prisma Migrate · Azure VPS · Nginx (reverse proxy) · Let's Encrypt/Certbot (SSL) · DuckDNS

## 🏗 Architecture

StayEasy is a client–server monolith — a single Express API serving a Next.js frontend, not a microservices system.

```
Next.js Frontend (React 19, TanStack Query)
        │  Axios · credentialed cookies
        ▼
Express REST API  (/api/v1)
  Rate limit → CORS → Helmet → Auth → Permissions → Zod validation
        │
        ├── Prisma ORM ──► PostgreSQL
        ├── Redis          (holds, quotas, rate limits)
        ├── Cloudinary     (images, via Multer)
        ├── Gemini         (NL search parsing only — no DB access)
        ├── Razorpay       (payments + webhooks)
        └── SMTP           (email)
```

Backend follows a layered, module-per-feature structure:

```
modules/<feature>/
  ├── *.route.ts
  ├── *.controller.ts
  ├── *.service.ts
  ├── *.validation.ts
  └── *.types.ts
```

Frontend uses a feature-based structure with Next.js route groups separating customer and admin experiences (`app/`, `features/`, `ui/`, `providers/`, `stores/`).

**Patterns used:** layered architecture, middleware pipelines, `Prisma $transaction` for atomic writes, idempotent webhook handling via a `WebhookEvent` model, a strategy-style fallback for AI search, and a reusable rate-limiter factory instead of per-route implementations.

## 🏁 Getting Started

**Prerequisites:** Node.js 22 · npm · Docker & Docker Compose · Redis · Cloudinary account · Gemini API key · Razorpay account · SMTP credentials

### Option A — Docker Compose
```bash
cd backend
copy .env.example .env   # then fill in real values
cd ..
docker compose up --build
```
⚠️ Redis is not included in `docker-compose.yml` for local dev — run it separately and point `REDIS_HOST` at it.

Services: PostgreSQL → `:5434` · Backend → `:5000` · Frontend → `:3000`

### Option B — Local development
```bash
# Backend
cd backend
npm install
copy .env.example .env
npx prisma migrate dev
npx prisma db seed
npm run dev          # → http://localhost:5000

# Frontend (new terminal)
cd frontend
npm install
copy .env.example .env.local
npm run dev           # → http://localhost:3000
```

## 🔐 Environment Variables

**Backend (`backend/.env`)**
```
DATABASE_URL
PORT
JWT_SECRET
COOKIE_PARSER
FRONTEND_URL

CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET

REDIS_HOST
REDIS_PORT

GEMINI_API_KEY

RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET

EMAIL_USER
EMAIL_PASS
EMAIL_FROM
```

**Frontend (`frontend/.env.local`)**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

## 📡 API Reference

All routes are prefixed with `/api/v1`.

**Auth**
```
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/logout
GET  /auth/me
```

**Hotels & Rooms**
```
GET/POST/PATCH/DELETE  /hotels
GET/POST/PATCH/DELETE  /hotels/:hotelId/rooms/:roomId
```

**Bookings**
```
POST  /bookings/initiate
GET   /bookings/myBookings
GET   /bookings/confirmation-status/:holdId
GET   /bookings/:bookingId
PATCH /bookings/:bookingId/cancel
PUT   /bookings/:bookingId/status
```

**AI Search**
```
POST /search/ai
Body:  { "query": "a quiet resort in Mumbai under 5000 for 2 guests" }
```
Response includes parsed filters (city, propertyType, minPrice/maxPrice, guests, minRating, amenityIds, keyword) whether they came from the AI path or the deterministic fallback — the response shape is identical either way. Quota-limited: 10 requests/user/day, plus global caps of 10/min and 900/day (Redis-backed fixed-window counters).

## 🧠 Technical Deep Dives

**Booking consistency under concurrency** — A Redis hold (`SET NX EX 600`), keyed per room *per night* rather than per date range, blocks a second checkout before it ever reaches payment. The database transaction at webhook time is the real correctness guarantee; Redis just keeps double-charges from being the common case instead of a rare one. *Known gap: the conflict check isn't backed by a hard DB constraint yet — a Postgres exclusion constraint would close the last theoretical race.*

**Payment reliability** — Webhooks are verified via HMAC-SHA256 against the raw request body (not parsed JSON), with idempotency enforced by a real DB-unique constraint on event ID, not just an application check. Refunds are triggered automatically on any orphaned payment. *Known gap: no proactive alert yet for a refund stuck mid-flight.*

**AI search that degrades gracefully** — Gemini is used strictly as a parser, never touching the database directly, so a bad model response can't do more damage than a wrong filter. Quota-limited via Redis, with a fully independent deterministic fallback (entity matching + regex) feeding into ranked Postgres full-text search — so search never actually depends on the AI succeeding.

**Authorization as data** — Permissions live in the database (`Permission` + `RolePermission`), enforced by one generic middleware. Changing what a role can do is a data change, not a redeploy.

**Auth** — Short-lived access tokens, single-use rotating refresh tokens checked against both JWT signature and a DB row, httpOnly cookies scoped by path. A used or stolen-but-superseded refresh token simply no longer exists.

**Rate limiting** — One reusable Redis fixed-window limiter, configured differently per route (IP for login/refresh, user ID for writes), fails open if Redis itself is down.

**Image storage** — Uploads stream straight to Cloudinary via Multer, never touching local disk — required for multi-instance deployments and free CDN delivery.

**Transactional email** — Fire-and-forget, always after the DB transaction commits, so a flaky email provider can never affect a financial record.

*(Full mechanism write-ups, honest gaps, and design tradeoffs for each of these live in the codebase comments / are covered in interviews on request.)*

## 🚢 Deployment

Backend and frontend images are built as **multi-stage Docker builds**: a `builder` stage installs all dependencies and compiles TypeScript/Next.js, and a separate `production` stage reinstalls only production dependencies (`npm ci --omit=dev`) and copies across just the compiled output — no raw source, dev dependencies, or build tooling ship in the final image. Both images are pushed to Docker Hub.

Production runs on an Azure VPS (Ubuntu 24.04, `Standard B2als_v2`, Central India region) with only ports 22/80/443 open. The server pulls images from Docker Hub via a hand-written `docker-compose.yml` (no source code or git clone on the server) and brings up Postgres, Redis, backend, and frontend on one shared Docker network, with named volumes for Postgres/Redis data persistence and `restart: unless-stopped` on every service. Postgres runs as a separate managed instance rather than in the same compose stack, decoupling the database's lifecycle and backups from the application server. A DuckDNS subdomain points at the VPS's public IP; Nginx reverse-proxies both services behind that single domain; Certbot issues and auto-renews a Let's Encrypt SSL certificate. CORS and `NEXT_PUBLIC_API_URL` are configured against the real domain for the final production wiring.

## 🧪 Testing

Core flows — authentication, booking creation, concurrent booking holds, payment webhook handling, cancellations, and refunds — were manually tested across normal and edge-case scenarios, including simultaneous booking attempts on the same room, expired holds, and duplicate/failed webhook events.

**Not yet present:** automated tests, CI/CD pipeline, coverage reports, load-testing setup — tracked below.

## 🗺 Roadmap

- [ ] Automated test suite + CI/CD pipeline
- [ ] Scheduled job to detect and flag refunds stuck in `PROCESSING`
- [ ] Queue-based retry (or manual resend) for failed transactional emails
- [ ] Cleanup/reconciliation job for orphaned Cloudinary images
- [ ] Sliding-window or token-bucket rate limiting to close fixed-window burst edge case
