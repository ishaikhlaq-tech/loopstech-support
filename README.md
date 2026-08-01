# LoopTech Support System

Full-stack customer support ticketing system built for a client submission.

## Overview

LoopTech Support is a role-aware support platform for customers, agents, and admins. It supports ticket creation and tracking, SLA policy management, team directory administration, dashboard analytics, and user lifecycle management.

## Stack

- Frontend: React 19, Vite, React Router v6, Tailwind CSS, Lucide React, Recharts, Framer Motion
- Backend: Node.js, Express, Supabase JS, dotenv, helmet, cors, morgan
- Database/Auth: Supabase PostgreSQL and Supabase Auth

## Architecture

Browser (React) -> Express API on port 5000 -> Supabase (PostgreSQL + Auth)

The frontend stores the access token and refresh token in localStorage. API requests include the bearer token and use `cache: 'no-store'` to avoid stale 304 responses after role changes.

## Core Roles

- Admin: full access to users, tickets, SLA, and team directory administration
- Agent: manage tickets and view operational data
- Customer: create tickets and view only their own records

## Database Schema

### `profiles`

```sql
CREATE TABLE profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id),
  email      TEXT UNIQUE NOT NULL,
  full_name  TEXT,
  role       TEXT DEFAULT 'customer',
  department TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### `tickets`

```sql
CREATE TABLE tickets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT,
  status      TEXT DEFAULT 'open',
  priority    TEXT DEFAULT 'medium',
  created_by  UUID REFERENCES auth.users(id),
  assigned_to UUID REFERENCES auth.users(id),
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);
```

### `sla_policies`

```sql
CREATE TABLE sla_policies (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  priority             TEXT UNIQUE,
  first_response_hours INTEGER,
  resolution_hours     INTEGER,
  updated_at           TIMESTAMPTZ DEFAULT now()
);
```

### `company_settings`

```sql
CREATE TABLE company_settings (
  id UUID PRIMARY KEY,
  departments JSONB NOT NULL DEFAULT '[]'::jsonb,
  clients JSONB NOT NULL DEFAULT '[]'::jsonb,
  routing_rules JSONB NOT NULL DEFAULT '[]'::jsonb,
  modules JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

## Authentication

Login flow:

1. User submits email and password.
2. Frontend calls `POST /api/auth/login`.
3. Backend uses `supabaseAdmin.auth.signInWithPassword()`.
4. Backend reads the user's app role from `profiles` using the dedicated `supabaseDB` client.
5. Backend returns `token`, `refresh_token`, and a user object containing `role` and `app_role`.
6. Frontend stores the tokens in localStorage and uses the returned user object.

The `/api/auth/me` endpoint validates the session on page load and rehydrates the user with the current role from `profiles`.

## RBAC

- All authenticated users can view the dashboard, tickets, SLA policies, and team directory.
- Only admins can create, edit, or delete users.
- Only admins can edit SLA policies.
- Customers can only see their own tickets.
- Agents and admins can manage tickets across the system.

## Admin Constraints

- The system enforces a maximum of 2 admin users.
- Admins cannot change their own role.
- Admins cannot delete their own account.

The 2-admin check is applied when creating users, changing a user's role, and editing a user profile.

## Features

### Team Directory

Displays all users with name, email, role, department, and active status. Admins can edit or delete users and can also assign departments such as Engineering, Support, Sales, Marketing, Finance, and HR.

### SLA Manager

Shows SLA policies for low, medium, high, and urgent priorities. Non-admins can view the values but cannot edit them.

### Tickets System

Supports the lifecycle open -> in_progress -> resolved -> closed. Tickets can be filtered, searched, sorted, and updated based on role permissions.

### Dashboard and Analytics

Provides summary cards and live operational metrics from `/api/dashboard/summary` and related ticket aggregation routes.

### Sidebar Navigation

Dashboard, Tickets, SLA Manager, Canned Responses, Team Directory, and Company Settings are available behind authentication. Admin-only actions appear in the relevant pages rather than as separate locked sections.

## Critical Bug Fixes

1. Role lookup now uses a dedicated `supabaseDB` client so login is not affected by RLS-tainted auth state.
2. Profile reads use array-based queries instead of `.single()` to avoid empty-result coercion failures.
3. The backend returns `app_role` and overrides `role` in auth responses so Supabase's internal `authenticated` role does not leak into the app.
4. `GET /api/users` is available to all authenticated users so the team directory can load for non-admins.
5. The frontend uses `cache: 'no-store'` on API requests to avoid stale cached role data.

## API Routes

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/me`

### Users

- `GET /api/users`
- `POST /api/users`
- `PATCH /api/users/:id/role`
- `PATCH /api/users/:id/profile`
- `PATCH /api/users/:id/password`
- `DELETE /api/users/:id`

### Tickets

- `GET /api/tickets`
- `GET /api/tickets/stats`
- `GET /api/tickets/:id`
- `POST /api/tickets`
- `PATCH /api/tickets/:id`

### SLA

- `GET /api/sla`
- `PUT /api/sla/:id`

### Dashboard

- `GET /api/dashboard/summary`

## Known Demo Accounts

- `sara@gmail.com` / `sara1234` / `admin`
- `ishaikhlaq@gmail.com` / original password / `agent`

## Environment Variables

### Backend

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PORT=5000
CLIENT_URL=http://localhost:5173
```

### Frontend

```env
VITE_API_URL=http://localhost:5000/api
```

## Run Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## File Structure

```text
looptech-support/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── config/supabase.js
│   │   ├── middleware/auth.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── tickets.js
│   │   │   ├── sla.js
│   │   │   └── dashboard.js
│   │   └── ...
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/client.js
│   │   ├── context/AuthContext.jsx
│   │   ├── components/
│   │   ├── pages/
│   │   └── routes/AppRoutes.jsx
│   └── package.json
└── README.md
```

## Notes

This repository is production-oriented and currently includes the critical role/RLS fixes called out above. The frontend README is intentionally kept brief so the top-level README remains the single source of truth for the full stack.