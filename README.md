# C.A.R.E — Campus Alert & Resolution Engine

A web application for reporting and resolving campus issues (damaged facilities, maintenance requests, etc.). Students submit reports with location and category details; staff manage their assigned blocks; admins oversee all reports, staff assignments, and analytics.

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, React Router 8, Tailwind CSS 4, Vite 8, TypeScript 5.7 |
| Backend | Express 5, PostgreSQL (pg), bcryptjs, express-session, multer |
| Tooling | pnpm, Figma Make (frontend dev server on port 8443) |

## Prerequisites

- [Node.js 22](https://nodejs.org) (see `.mise.toml`)
- [pnpm 10.34.3](https://pnpm.io)
- PostgreSQL 16+ running locally on port 5432

## Quick Start

### 1. Clone & install dependencies

```bash
cd "Project Overview"
cd frontend && pnpm install
cd ../backend && pnpm install
```

### 2. Set up the database

Create the database and configure credentials in `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=care_db
SESSION_SECRET=change_this_in_production
PORT=3000
COLLEGE_EMAIL_DOMAIN=bmsit.in
```

Then create the schema and seed data:

```bash
cd backend
node runSchema.js
node seed.js
```

The seed script prints login credentials:

| Role | Email | Password |
|------|-------|----------|
| admin | admin@bmsit.in | admin123 |
| staff | ravi.kumar@bmsit.in | staff123 (Block B) |
| student | arjun.kumar@bmsit.in | student123 |

### 3. Run both apps

**Backend** (Terminal 1):
```bash
cd backend
pnpm dev   # or: npm run dev
```

**Frontend** (Terminal 2):
```bash
cd frontend
pnpm dev   # or: npm run dev
```

- Frontend: [http://localhost:8443](http://localhost:8443)
- Backend API: [http://localhost:3000](http://localhost:3000)

## Landing Page Features

- **Hero section** — Full-viewport campus background with giant "BMSIT&M" sky text and call-to-action buttons
- **How it works** — 4-step process with scroll-triggered staggered reveal animations
- **Role showcase** — Student, Staff, and Admin role cards with mock UI previews
- **Performance strip** — Key metrics (87% SLA, 2.4 day avg resolution, 6 blocks tracked)
- **Contact section** — Contact info (email, phone, address, hours) with a professional form on a navy-deep background
- **Smooth scroll** — Navbar links smoothly scroll to corresponding sections

## Project Structure

```
Project Overview/
├── frontend/                    # React + Vite app
│   ├── src/
│   │   ├── pages/               # Page components
│   │   │   ├── Landing.tsx      # Landing page (hero, how-it-works, contact, roles)
│   │   │   ├── Login.tsx
│   │   │   ├── StudentDashboard.tsx
│   │   │   ├── ReportProblem.tsx
│   │   │   ├── MyReports.tsx
│   │   │   ├── Notifications.tsx
│   │   │   ├── Settings.tsx
│   │   │   ├── StaffDashboard.tsx
│   │   │   ├── StaffQueue.tsx
│   │   │   ├── StaffReports.tsx
│   │   │   ├── StaffReportDetail.tsx
│   │   │   ├── StaffSettings.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminAllReports.tsx
│   │   │   ├── AdminBlockRatings.tsx
│   │   │   ├── AdminAnalytics.tsx
│   │   │   ├── AdminStaffManagement.tsx
│   │   │   └── AdminSettings.tsx
│   │   ├── layouts/
│   │   │   ├── StudentLayout.tsx
│   │   │   ├── StaffLayout.tsx
│   │   │   └── AdminLayout.tsx
│   │   └── components/
│   │       └── DashboardShell.tsx
│   └── main.tsx                 # Router config
├── backend/
│   ├── server.js                # Express app entry
│   ├── db.js                    # PostgreSQL pool
│   ├── schema.sql               # 8 tables
│   ├── seed.js                  # Seed data
│   ├── runSchema.js             # Run schema.sql
│   ├── resetData.js             # Clear report data
│   ├── middleware.js            # Auth helper
│   ├── .env                     # Environment variables
│   └── routes/
│       ├── auth.js
│       ├── reports.js
│       ├── staff.js
│       ├── admin.js
│       └── notifications.js
└── AGENTS.md                    # Figma Make project guide
```

## Routes

| Path | Role | Description |
|------|------|-------------|
| `/` | All | Landing page |
| `/login` | All | Login / Register |
| `/student` | Student | Student dashboard, submit reports, view reports |
| `/staff` | Staff | Staff dashboard, queue, report details |
| `/staff/queue` | Staff | Table view of block reports |
| `/staff/reports` | Staff | **Report Details** — grid view of all reports |
| `/staff/report/:id` | Staff | Individual report detail with status update |
| `/admin` | Admin | Admin dashboard, analytics, staff management |

## API Endpoints

### Auth
- `POST /api/auth/login` — Login with email & password
- `POST /api/auth/register` — Register student account
- `POST /api/auth/logout` — Destroy session
- `GET /api/auth/me` — Current user info

### Reports
- `GET /api/reports` — List reports (filtered by role)
- `GET /api/reports/:id` — Single report detail
- `POST /api/reports` — Create a report
- `PATCH /api/reports/:id/status` — Update report status
- `PATCH /api/reports/:id/reject` — Reject a report (staff)

### Staff
- `GET /api/staff/queue` — Staff's block queue
- `GET /api/staff/block-rating` — Block performance rating

### Admin
- `GET /api/admin/stats` — Dashboard statistics
- `GET /api/admin/stats/time-series` — 30-day time series
- `GET /api/admin/stats/distribution` — Category distribution
- `GET /api/admin/stats/staff` — Staff performance list
- `GET /api/admin/stats/staff/:id` — Staff detail
- `POST /api/admin/staff` — Create staff account
- `PUT /api/admin/staff/:id/block` — Assign block to staff
- `DELETE /api/admin/staff/:id` — Remove staff
- `GET /api/admin/leaderboard` — Leaderboard

### Notifications
- `GET /api/notifications` — User notifications
- `PATCH /api/notifications/:id/read` — Mark read
- `POST /api/notifications/:id/confirm` — Confirm report
- `DELETE /api/notifications/:id` — Delete notification

### Other
- `GET /api/blocks` — Public block list
- `GET /health` — Health check

## Scripts

| Command | Description |
|---------|-------------|
| `node backend/runSchema.js` | Create all tables |
| `node backend/seed.js` | Seed users & blocks |
| `node backend/resetData.js` | Clear all report data |
| `cd frontend && pnpm dev` | Start Vite dev server (port 8443) |
| `cd backend && pnpm dev` | Start Express dev server (port 3000) |

## License

MIT
