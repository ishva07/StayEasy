# StayEasy

**Live site:** https://stayeasy.duckdns.org

<!-- Add one or two screenshots here (home page, hotel page, admin dashboard) -->

A full-stack hotel discovery and booking platform. It supports natural-language search, room holds during checkout, Razorpay payments, and role-based hotel administration.

`Node` `TypeScript` `Next.js` `Express` `PostgreSQL` `Prisma` `Redis` `Docker`

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Technical Deep Dives](#technical-deep-dives)
- [Deployment](#deployment)
- [Load Testing](#load-testing)
- [Testing](#testing)
- [What I Learned](#what-i-learned)
- [Roadmap](#roadmap)

## Overview

StayEasy serves two groups from one codebase:

- **Travelers** who search, filter, and book hotel rooms, including with natural-language search ("a quiet resort in Mumbai under 5000 for 2 guests")
- **Hotel/admin staff** who manage hotels, rooms, amenities, cities, bookings, and reviews from an admin dashboard

Besides the usual CRUD, the project deals with a few problems that booking platforms run into:

- **Double-booking:** Redis room holds stop two people from reaching payment for the same room and nights
- **Payment reliability:** Razorpay webhooks are verified with an HMAC signature and made idempotent at the database level
- **Natural-language search:** an LLM is used only to parse the query into filters, and a deterministic fallback produces the same filters without AI
- **Authorization:** permissions are stored as data (roles and permissions tables), not hardcoded role checks
- **Rate limiting:** one reusable Redis-backed limiter factory, configured per route (login, refresh, writes, global)

## Key Features

**Customer-facing**
- Registration, login, refresh-token rotation (single-use), session persistence
- Hotel browsing with filters: city, property type, amenities, guest capacity, price range, rating, availability by date, pagination and sorting
- Natural-language hotel search
- Booking flow: hold, pay, confirm
- Razorpay payment integration with webhook-driven confirmation
- Booking history, cancellation, and refund tracking
- Hotel reviews and ratings

**Admin**
- CRUD for hotels, rooms, cities, property types, amenities, and image galleries
- Booking management and status transitions (explicit state machine)
- Review moderation
- Dashboard analytics: revenue, monthly bookings, booking-status breakdowns, AI search logs

**Under the hood**

| Feature | How it works |
|---|---|
| Booking holds | Redis `SET NX EX` locks each room-**night** (not the whole date range) for 600s during checkout. The hold is rolled back actively if payment-order creation fails, and passively through the TTL otherwise |
| Payment reliability | HMAC-SHA256 webhook signature verification against the **raw** request body, a DB-unique `WebhookEvent.eventId` for idempotency, and automatic refunds on orphaned payments |
| AI search | The LLM only parses the query. It never touches the DB, is grounded in real city/amenity/property-type names, and its output is validated with Zod. A separate deterministic fallback (entity matching and regex extraction) feeds Postgres full-text search |
| Authorization | `Permission` and `RolePermission` tables, enforced by one generic `hasPermission` middleware, so changing access is a data change, not a code change |
| Rate limiting | One generic Redis-backed limiter factory, configured per route (IP-based for login/refresh/global, user-ID-based for writes). It fails open if Redis is unavailable |
| Security | 15-minute JWT access tokens, 7-day single-use rotating refresh tokens (checked against both signature and DB), httpOnly cookies scoped by path, bcrypt hashing |

## Tech Stack

**Backend:** Node.js 22 · Express 5 · TypeScript · Prisma 6 · PostgreSQL 16 · Redis (ioredis) · Zod · JWT · bcryptjs

**Frontend:** Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TanStack Query & Table · Zustand · React Hook Form + Zod · Recharts · Radix UI

**Integrations:** Razorpay (payments) · Cloudinary (image storage, via Multer) · Google Gemini (NL search parsing) · Nodemailer/SMTP (transactional email)

**Infra:** Docker (multi-stage builds) and Docker Compose · Prisma Migrate · Azure VM · Nginx (reverse proxy) · Let's Encrypt/Certbot (SSL) · DuckDNS

## Architecture

StayEasy is a client-server monolith: one Express API serving a Next.js frontend. It is not a microservices system.

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
        ├── Gemini         (NL search parsing only, no DB access)
        ├── Razorpay       (payments + webhooks)
        └── SMTP           (email)
```

The backend uses a layered, module-per-feature structure:

```
modules/<feature>/
  ├── *.route.ts
  ├── *.controller.ts
  ├── *.service.ts
  ├── *.validation.ts
  └── *.types.ts
```

The frontend is organized by feature, with Next.js route groups separating the customer and admin experiences (`app/`, `features/`, `ui/`, `providers/`, `stores/`).

**Patterns used:** layered architecture, middleware pipelines, `Prisma $transaction` for atomic writes, idempotent webhook handling via a `WebhookEvent` model, a fallback strategy for AI search, and a reusable rate-limiter factory.

## Getting Started

**Prerequisites:** Node.js 22 · npm · Docker & Docker Compose · Redis · Cloudinary account · Gemini API key · Razorpay account · SMTP credentials

### Option A: Docker Compose
```bash
cd backend
copy .env.example .env   # then fill in real values
cd ..
docker compose up --build
```
Note: Redis is not included in the local-dev `docker-compose.yml`. Run it separately and point `REDIS_HOST` at it.

Services: PostgreSQL → `:5434` · Backend → `:5000` · Frontend → `:3000`

### Option B: Local development
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

## Environment Variables

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

**Optional (load testing only)**
```
DISABLE_GLOBAL_LIMITER=true
```
The global rate limiter is on by default. It is turned off only when this variable is exactly `true`, so a missing or mistyped value keeps it on. The server logs a warning at startup when it is disabled. Never set it in normal production use.

**Frontend (`frontend/.env.local`)**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

## API Reference

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
The response includes the parsed filters (city, propertyType, minPrice/maxPrice, guests, minRating, amenityIds, keyword), whether they came from the AI path or the deterministic fallback. The response shape is identical either way. Quota: 10 requests/user/day, plus global caps of 10/min and 900/day (Redis-backed fixed-window counters).

## Technical Deep Dives

**Booking consistency under concurrency.** A Redis hold (`SET NX EX 600`), keyed per room *per night* rather than per date range, blocks a second checkout before it reaches payment. The database transaction at webhook time is the main correctness layer. Redis keeps double-charges from being a common case. *Known gap: the conflict check is not backed by a hard DB constraint yet. A Postgres exclusion constraint would close the last theoretical race.*

**Payment reliability.** Webhooks are verified with HMAC-SHA256 against the raw request body (not parsed JSON). Idempotency is enforced by a DB-unique constraint on the event ID, not just an application check. Refunds are triggered automatically for any orphaned payment. *Known gap: there is no proactive alert yet for a refund stuck mid-flight.*

**AI search that degrades gracefully.** Gemini is used only as a parser and never touches the database, so a bad model response can at worst produce a wrong filter. It is quota-limited through Redis. A separate deterministic fallback (entity matching and regex) feeds ranked Postgres full-text search, so search does not depend on the AI succeeding.

**Authorization as data.** Permissions live in the database (`Permission` and `RolePermission`) and are enforced by one generic middleware. Changing what a role can do is a data change, not a redeploy.

**Auth.** Short-lived access tokens, single-use rotating refresh tokens checked against both the JWT signature and a DB row, and httpOnly cookies scoped by path. A used or superseded refresh token no longer exists.

**Rate limiting.** One reusable Redis fixed-window limiter, configured per route (IP for login/refresh, user ID for writes). It fails open if Redis is down.

**Image storage.** Uploads stream straight to Cloudinary through Multer and never touch local disk. This is needed for multi-instance deployments and gives CDN delivery.

**Transactional email.** Fire-and-forget, and always sent after the DB transaction commits, so a flaky email provider cannot affect a financial record.

## Deployment

Backend and frontend images are built as **multi-stage Docker builds**. A `builder` stage installs all dependencies and compiles TypeScript/Next.js. A separate `production` stage reinstalls only production dependencies (`npm ci --omit=dev`) and copies across just the compiled output, so no raw source, dev dependencies, or build tooling ship in the final image. Both images are pushed to Docker Hub.

Production runs on a single Azure VM (Ubuntu 24.04, `Standard B2als_v2`: 2 vCPU, 4 GiB RAM, Central India). The server holds only a `docker-compose.yml` and a `backend.env` file (no source code or git clone) and pulls the images from Docker Hub. Compose runs four containers on one Docker network: Postgres 16, Redis, the backend, and the frontend. Postgres and Redis each use a named volume, and every service uses `restart: unless-stopped`.

**Request path:** browser → Nginx (HTTPS on 443) → Next.js on port 3000 for pages, or Express on port 5000 for `/api/v1` and `/static`. Nginx runs on the VM itself, redirects HTTP to HTTPS, and uses a Let's Encrypt certificate issued and renewed by Certbot. A DuckDNS subdomain points to the VM's public IP. CORS and `NEXT_PUBLIC_API_URL` are configured for the real domain.

**Network:** the Azure network security group allows inbound traffic only on ports 22 (SSH), 80, and 443. Docker also publishes ports 3000, 5000, and 5434 on the VM, but the Azure firewall blocks them from the internet. Binding them to `127.0.0.1` is on the roadmap as a second layer.

**Database:** Postgres runs as a container on the same VM as the application, so the database shares that machine's disk and uptime. The named volume means recreating or updating the container does not delete data. Backups are manual `pg_dump` dumps, copied to a separate machine. Moving to a managed Postgres service is on the roadmap.

## Load Testing

I load tested the live site to find out how much traffic the VM handles and which part runs out first.

**Setup**
- Tool: [loader.io](https://loader.io), test type "Maintain client load" (a fixed number of virtual users, each sending a new request as soon as the previous response arrives)
- Each run lasted 1 minute, over HTTPS, against the live site
- Server: the Azure VM described above (2 vCPU, 4 GiB RAM), with Nginx, the app containers, Postgres, and Redis all on the one machine
- CPU and memory were read with `docker stats` while each run was in progress

**Results**

| Target | Concurrent users | Requests | Req/sec | Avg response | Errors | Container CPU during run* |
|---|---|---|---|---|---|---|
| Home page (Next.js) | 50 | 15,147 | ~250 | 193 ms | 0% | frontend ~52% |
| `GET /hotels/:id` | 20 | 5,910 | ~100 | 197 ms | 0% | backend ~37%, Postgres ~7% |
| `GET /hotels/:id` | 50 | 14,840 | ~250 | 203 ms | 0% | backend ~96-99%, Postgres ~16% |
| `GET /hotels/:id` | 100 | 22,069 | ~368 | 268 ms | 0% | backend ~138%, Postgres ~26% |

\*`docker stats` snapshots taken during the run. 100% equals one CPU core, so this VM's total is 200%.

**What the results show**
- No errors or timeouts at any level, up to 100 concurrent users.
- On the API, the backend container reached its CPU limit first, while Postgres stayed lightly loaded. If traffic grew, the first step would be more backend capacity, not a bigger database.
- Doubling the users from 50 to 100 raised throughput by about 47% and average response time by about 30%, which is what a server near its limit looks like.
- The home page used far less CPU than the API for the same request rate.

**Rate limiter check**
With the global limiter enabled, I sent 250 sequential requests to the API from one IP. 201 returned `200` and 49 returned `429`, which matches the limit of 200 requests per 15 minutes per IP.

## Testing

Core flows (authentication, booking creation, concurrent booking holds, payment webhook handling, cancellations, and refunds) were tested manually across normal and edge cases. These included simultaneous booking attempts on the same room, expired holds, and duplicate or failed webhook events.

Performance is covered in [Load Testing](#load-testing).

## What I Learned

Before this project I had never deployed anything to a real server. I learned Docker, VPS setup, Nginx, and SSL one piece at a time: Docker locally first, then the VPS, then Nginx, then SSL, so that only one new thing could break at once.

The hardest design problem was preventing double-booking. Redis holds stop two people from reaching payment for the same room and nights, and the database transaction at webhook time is the final check.

While load testing, I also learned to check my own assumptions instead of trusting them. I looked at where my database actually runs and what my firewall actually allows, and I corrected this documentation to match.

## Roadmap

- [ ] Automated test suite and CI/CD pipeline
- [ ] Scheduled daily database backups (cron) with copies stored off the VM
- [ ] Move Postgres to a managed service
- [ ] Load test the filtered hotel list and the booking flow, and go past 100 users
