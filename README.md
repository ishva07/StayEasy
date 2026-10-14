# StayEasy

**Live site:** [stayeasy.duckdns.org](https://stayeasy.duckdns.org)

**Product demo:** [Watch the 58-second walkthrough](./StayEasy-Portfolio-Demo.mp4)

A full-stack hotel discovery and booking platform with natural-language search, online payments, and role-based administration.

`Node.js` `TypeScript` `Next.js` `Express` `PostgreSQL` `Prisma` `Redis` `Docker`

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Key API Endpoints](#key-api-endpoints)
- [Technical Deep Dives](#technical-deep-dives)
- [Deployment](#deployment)
- [Testing](#testing)
- [Roadmap](#roadmap)

## Overview

StayEasy lets travelers discover and book hotel rooms, including through natural-language search. Hotel administrators can manage listings, bookings, reviews, users, and role permissions from an admin dashboard.

## Key Features

**Customer**
- Account registration, login, and refresh-token rotation
- Hotel search and filtering by city, property type, amenities, guest capacity, price, rating, and availability
- Natural-language hotel search
- Room holds, online payments, booking confirmation, booking history, and cancellation/refund tracking
- Hotel reviews and ratings

**Admin**
- Manage hotels, rooms, cities, property types, amenities, and image galleries
- Manage bookings and review moderation
- Manage user roles and role permissions
- Dashboard analytics and AI search logs

## Tech Stack

**Backend:** Node.js 22 · Express 5 · TypeScript · Prisma 6 · PostgreSQL 16 · Redis · Zod

**Frontend:** Next.js 16 · React 19 · Tailwind CSS 4 · TanStack Query and Table · Zustand

**Integrations and infrastructure:** Razorpay · Cloudinary · Google Gemini · Nodemailer/SMTP · Docker Compose · Nginx · Azure VM

## Architecture

StayEasy is a client-server monolith: one Express API serves a Next.js frontend.

```text
Next.js frontend
      │ Axios and credentialed cookies
      ▼
Express REST API (/api/v1)
  Rate limiting → CORS → Authentication → Permissions → Validation
      │
      ├── Prisma ── PostgreSQL
      ├── Redis (booking holds, quotas, rate limits)
      ├── Cloudinary (images)
      ├── Gemini (search query parsing)
      ├── Razorpay (payments and webhooks)
      └── SMTP (transactional email)
```

The backend follows a route/controller/service structure organized by feature. The frontend separates customer and admin experiences using Next.js route groups and feature-based modules.

## Getting Started

**Prerequisites:** Node.js 22, npm, Docker and Docker Compose (or local PostgreSQL and Redis). Cloudinary, Gemini, Razorpay, and SMTP credentials are needed for the corresponding integrations.

### Start local dependencies

From the repository root, start PostgreSQL and Redis with Docker Compose:

```bash
docker compose up -d postgres redis
```

The database is available at `localhost:5434`; Redis is available at `localhost:6379`.

### Run the application

```bash
# Backend
cd backend
npm install
copy .env.example .env
# Set DATABASE_URL to connect to the Compose PostgreSQL service at localhost:5434.
# Add the required integration credentials for the features you want to use.
npx prisma migrate dev
npx prisma db seed
npm run dev

# Frontend (in a second terminal)
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

The API runs at `http://localhost:5000`; the frontend runs at `http://localhost:3000`.

On macOS/Linux, use `cp` instead of the Windows `copy` command.

## Environment Variables

Copy the example files and provide values in your local environment. Do not commit secrets.

**Backend (`backend/.env`)**

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `PORT` | API port (defaults to `5000`) |
| `JWT_SECRET`, `COOKIE_PARSER` | Authentication and cookie signing |
| `FRONTEND_URL` | Allowed frontend origin |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Image uploads |
| `REDIS_HOST`, `REDIS_PORT` | Redis connection |
| `GEMINI_API_KEY` | Natural-language search |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` | Payments and webhook verification |
| `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM` | Transactional email |

**Frontend (`frontend/.env.local`)**

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | API base URL, for example `http://localhost:5000/api/v1` |

## Key API Endpoints

All routes are prefixed with `/api/v1`. Some routes require authentication and/or a matching role permission.

| Method | Route | Purpose |
|---|---|---|
| `POST` | `/auth/register` | Register |
| `POST` | `/auth/login` | Sign in |
| `POST` | `/auth/refresh` | Refresh the session |
| `GET` | `/auth/me` | Get the current user |
| `GET` | `/hotels` | Browse hotels |
| `GET` | `/hotels/:hotelId/rooms` | Browse rooms for a hotel |
| `POST` | `/bookings/initiate` | Start checkout and create a payment order |
| `GET` | `/bookings/myBookings` | List the current user's bookings |
| `GET` | `/bookings/confirmation-status/:holdId` | Check checkout confirmation |
| `GET` | `/users` | List users and roles (admin permission required) |
| `PATCH` | `/users/:userId/role` | Change a user's role (admin permission required) |
| `GET` | `/roles` | List roles and available permissions |
| `PUT` | `/roles/:roleId/permissions` | Update a role's permissions |
| `POST` | `/search/ai` | Search using a natural-language query |

## Technical Deep Dives

**Booking consistency.** Redis `SET NX EX` holds each room-night for 600 seconds during checkout. During payment capture, a database transaction locks the room row before checking for overlapping bookings and confirming one. This serializes concurrent payment-capture webhooks for the same room; other booking writers must follow the same locking rule for it to cover them too.

**Payment reliability.** Razorpay webhooks are verified with HMAC-SHA256 against the raw request body. A unique database constraint on webhook event IDs prevents duplicate events from being processed twice. Checkout stores its quoted amount with the Razorpay order; the capture webhook verifies that amount and confirms the booking using the saved quote, not the room's current price. Captured payments with a missing checkout record, mismatched amount, or unavailable room are recorded and sent through the refund flow.

**AI search fallback.** Gemini parses queries into filters but does not access the database. A deterministic fallback extracts entities and filters for PostgreSQL full-text search when AI parsing is unavailable.

**Authorization.** Permissions are stored in `Permission` and `RolePermission` tables and enforced by shared middleware. Admins can change role permissions through the dashboard.

**Authentication and rate limiting.** Access tokens are short-lived; refresh tokens are single-use and checked against the database. Redis-backed rate limits are configured by route.

**Images and email.** Images are uploaded to Cloudinary through Multer. Transactional email is sent after database transactions commit.

## Deployment

The application is deployed on an Azure VM using Docker Compose, with PostgreSQL, Redis, and Nginx providing HTTPS access. Visit the [live site](https://stayeasy.duckdns.org).

A limited load test exercised selected pages and API routes with up to 100 virtual users and reported no errors during those runs. This is an indicative test, not a capacity guarantee; detailed methodology and results can be documented separately.

## Testing

There is no committed automated test suite yet. The currently available repeatable checks are:

```bash
# Backend TypeScript build
cd backend
npm run build

# Frontend lint and type-check
cd ../frontend
npm run lint
npx next typegen
npx tsc --noEmit
```

## Roadmap

- [ ] Add an automated test suite and CI/CD pipeline
- [ ] Schedule daily database backups and store copies off the VM
- [ ] Move PostgreSQL to a managed service
- [ ] Expand load tests to filtered hotel lists and booking flows
