# 🏨 StayEasy

> A full-stack hotel discovery and booking platform, built to production-grade patterns — combining natural-language search, real-time room holds, Razorpay 
payments, and role-based hotel administration.

[![Node](https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Technical Deep Dives](#-technical-deep-dives)
- [Project Metrics](#-project-metrics)
- [Roadmap](#-roadmap)

---

## 🚀 Overview

**StayEasy** is a full-stack hotel booking platform serving two audiences from one codebase:

- **Travelers** who search, filter, and book hotel rooms — including via natural-language search ("a quiet resort in Mumbai under 5000 for 2 guests")
- **Hotel/admin staff** who manage hotels, rooms, amenities, cities, bookings, and reviews through a dedicated admin dashboard

What sets it apart isn't just CRUD — it's how the system handles the *hard* problems in booking platforms:

- 🔒 **Redis-based room holds** to prevent double-booking during the payment window
- 💳 **Razorpay webhook processing** with signature verification and idempotency protection
- 🤖 **Gemini-powered natural-language search** with a deterministic fallback so a flaky LLM never breaks search
- 🛡️ **Permission-based authorization** (not just role checks) backed by a relational RBAC model

---

## ✨ Key Features

### Customer-facing
- Registration, login, refresh-token rotation, session persistence
- Hotel browsing with filters: city, property type, amenities, guest capacity, price range, rating, availability by date, pagination & sorting
- Natural-language hotel search
- End-to-end booking flow: hold → pay → confirm
- Razorpay payment integration with webhook-driven confirmation
- Booking history, cancellation, and refund tracking
- Hotel reviews and ratings

### Admin
- Full CRUD for hotels, rooms, cities, property types, amenities, and image galleries
- Booking management and status transitions
- Review moderation
- Dashboard analytics: revenue, monthly bookings, booking-status breakdowns, AI search logs

### Under the hood
| Feature | What makes it notable |
|---|---|
| **Booking holds** | Redis `SET NX EX` locks each room-night for 600s during checkout, with partial-hold rollback |
| **Payment reliability** | HMAC-SHA256 webhook verification, event-idempotency table, automatic refunds on orphaned payments |
| **AI search** | Grounds Gemini prompts in real DB entities, validates output with Zod, falls back to deterministic parsing on failure |
| **Security** | 15-min JWT access tokens, 7-day rotating refresh tokens, HttpOnly cookies, bcrypt hashing, per-route rate limiting |

---

## 🛠 Tech Stack

**Backend:** Node.js 22 · Express 5 · TypeScript · Prisma 6 · PostgreSQL 16 · Redis (`ioredis`) · Zod · JWT · bcryptjs

**Frontend:** Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TanStack Query & Table · Zustand · React Hook Form + Zod · Recharts · Radix UI

**Integrations:** Razorpay (payments) · Cloudinary (image storage) · Google Gemini (NL search) · Nodemailer/SMTP (transactional email)

**Infra:** Docker & Docker Compose · Prisma Migrate

---

## 🏗 Architecture

StayEasy is a **client–server monolith** — a single Express API serving a Next.js frontend, not a microservices system.

```
Next.js Frontend (React 19, TanStack Query)
        │  Axios · credentialed cookies
        ▼
Express REST API  (/api/v1)
  Rate limit → CORS → Helmet → Auth → Permissions → Zod validation
        │
        ├── Prisma ORM ──► PostgreSQL
        ├── Redis          (holds, rate limits, AI quotas)
        ├── Cloudinary     (images)
        ├── Gemini         (NL search)
        ├── Razorpay       (payments + webhooks)
        └── SMTP           (email)
```

**Backend** follows a layered, module-per-feature structure:
```
modules/<feature>/
  ├── *.route.ts
  ├── *.controller.ts
  ├── *.service.ts
  ├── *.validation.ts
  └── *.types.ts
```

**Frontend** uses a feature-based structure with Next.js route groups separating customer and admin experiences (`app/`, `features/`, `ui/`, `providers/`, `stores/`).

**Patterns used:** layered architecture, middleware pipelines, Prisma `$transaction` for atomic writes, idempotent webhook handling via a `WebhookEvent` model, and a strategy-style fallback for AI search.

---

## 🏁 Getting Started

### Prerequisites
Node.js 22 · npm · Docker & Docker Compose · Redis · Cloudinary account · Gemini API key · Razorpay account · SMTP credentials

### Option A — Docker Compose
```bash
cd backend
copy .env.example .env   # then fill in real values
cd ..
docker compose up --build
```
> ⚠️ Redis is **not** included in `docker-compose.yml` — run it separately and point `REDIS_HOST` at it.

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

---

## 🔐 Environment Variables

**Backend** (`backend/.env`)
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

**Frontend** (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

---

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
Response includes parsed filters (`city`, `propertyType`, `maxPrice`, `guests`, `keyword`) or a fallback outcome. AI endpoint is quota-limited (10/user/day, 10/min & 900/day globally).

---

## 🧠 Technical Deep Dives

**Booking consistency under concurrency**
Booking initiation validates dates → acquires a Redis hold → creates a Razorpay order → rolls back the hold on failure. Since payment confirmation can arrive *after* another booking succeeds, the webhook handler re-checks availability before finalizing — combining Redis locks, a PostgreSQL overlap query, and DB transactions rather than trusting any single layer.

**AI search that degrades gracefully**
Instead of trusting Gemini blindly, the search pipeline grounds prompts in real database IDs, validates the response with Zod, discards unknown entities, and falls back to deterministic keyword parsing on timeout or low-confidence output — with latency and outcome logged for every request.

**Query performance**
Indexed hotel filters, a composite index on `(roomId, status, checkIn, checkOut)` for overlap checks, PostgreSQL full-text search (`tsvector`), parallelized Prisma queries, and allowlisted sort/pagination params.

---

## 🧪 Testing

Core flows — authentication, booking creation, concurrent booking holds, 
payment webhook handling, cancellations, and refunds — were manually 
tested across normal and edge-case scenarios, including simultaneous 
booking attempts on the same room, expired holds, and duplicate/failed 
webhook events.

**Not yet present:** automated tests, CI/CD pipeline, coverage reports, load-testing setup — tracked below.

---

## 🗺 Roadmap

- [ ] Automated tests (unit + integration) and a CI pipeline
- [ ] Ownership-aware Redis hold release with atomic Lua-script acquisition
- [ ] Structured logging & observability for payments, bookings, and AI latency
