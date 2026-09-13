# C.A.R.E — Campus Alert & Resolution Engine

A web application for reporting and resolving campus issues (damaged facilities, maintenance requests, etc.). Students submit reports with location and category details; staff manage their assigned blocks; admins oversee all reports, staff assignments, and analytics.

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, React Router 8, Tailwind CSS 4, Vite 8 |
| Backend | Express 5, PostgreSQL (pg), bcryptjs, express-session, multer |
| Tooling | Node.js 22, pnpm 10.34.3, oxfmt |

## Prerequisites

- [Node.js 22](https://nodejs.org) (see `frontend/.mise.toml`)
- [pnpm 10.34.3](https://pnpm.io)
- PostgreSQL 16+ running locally on port 5432

## Quick Start

### 1. Clone & install dependencies

```bash
cd campusCare
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
FRONTEND_URL=http://localhost:8443
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
npm run dev
```

**Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
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
campusCare/
├── frontend/                         # React + Vite app
│   ├── index.html                    # Vite HTML shell
│   ├── package.json                  # Frontend dependencies
│   ├── vite.config.js                # Vite config (React, Tailwind, Figma plugins)
│   ├── .mise.toml                    # Node.js 22, pnpm 10.34.3
│   └── src/
│       ├── main.jsx                  # Router config & entrypoint
│       ├── index.css                 # Tailwind CSS v4 imports & theme
│       ├── api.js                    # API fetch wrapper (credentials: include)
│       ├── pages/
│       │   ├── Landing.jsx           # Landing page (hero, how-it-works, contact, roles)
│       │   ├── Login.jsx             # Login / Register
│       │   ├── StudentDashboard.jsx
│       │   ├── ReportProblem.jsx     # Submit a report (with photo upload)
│       │   ├── MyReports.jsx         # Student's own reports
│       │   ├── Notifications.jsx
│       │   ├── Settings.jsx
│       │   ├── StaffDashboard.jsx
│       │   ├── StaffQueue.jsx        # Table view of block reports
│       │   ├── StaffReports.jsx      # Grid view of all reports
│       │   ├── StaffReportDetail.jsx # Individual report detail
│       │   ├── StaffSettings.jsx
│       │   ├── AdminDashboard.jsx
│       │   ├── AdminAllReports.jsx
│       │   ├── AdminReportDetail.jsx
│       │   ├── AdminBlockRatings.jsx
│       │   ├── AdminAnalytics.jsx
│       │   ├── AdminStaffManagement.jsx
│       │   └── AdminSettings.jsx
│       ├── layouts/
│       │   ├── StudentLayout.jsx
│       │   ├── StaffLayout.jsx
│       │   └── AdminLayout.jsx
│       └── components/
│           └── DashboardShell.jsx
├── backend/
│   ├── server.js                     # Express app entry
│   ├── db.js                         # PostgreSQL pool
│   ├── middleware.js                  # Auth helpers (requireAuth, requireRole)
│   ├── schema.sql                    # 8 tables
│   ├── seed.js                       # Seed users & blocks
│   ├── runSchema.js                  # Run schema.sql
│   ├── resetData.js                  # Clear report data
│   ├── package.json                  # Backend dependencies
│   ├── .env                          # Environment variables (gitignored)
│   ├── .env.example                  # Template for .env
│   ├── uploads/                      # Uploaded report photos
│   └── routes/
│       ├── auth.js
│       ├── reports.js
│       ├── staff.js
│       ├── admin.js
│       └── notifications.js
├── AGENTS.md                         # Figma Make project guide
└── README.md
```

## Frontend Routes

| Path | Role | Description |
|------|------|-------------|
| `/` | All | Landing page |
| `/login` | All | Login / Register |
| `/student` | Student | Student dashboard |
| `/student/report` | Student | Submit a new report |
| `/student/reports` | Student | View own reports |
| `/student/notifications` | Student | Notifications |
| `/student/settings` | Student | Settings |
| `/staff` | Staff | Staff dashboard |
| `/staff/queue` | Staff | Table view of block reports |
| `/staff/reports` | Staff | Grid view of all reports |
| `/staff/report/:id` | Staff | Individual report detail |
| `/staff/settings` | Staff | Settings |
| `/admin` | Admin | Admin dashboard |
| `/admin/reports` | Admin | All reports |
| `/admin/reports/:id` | Admin | Individual report detail |
| `/admin/ratings` | Admin | Block ratings |
| `/admin/staff` | Admin | Staff management |
| `/admin/analytics` | Admin | Analytics |
| `/admin/settings` | Admin | Settings |

## API Endpoints

### Auth (`/api/auth`)
- `POST /register` — Register student account
- `POST /login` — Login with email & password
- `POST /logout` — Destroy session
- `GET /me` — Current user info (includes `block_name` for staff)

### Reports (`/api/reports`)
- `POST /` — Create a report (student, with photo upload)
- `GET /my` — Student's own reports
- `GET /:id` — Single report detail
- `POST /:id/confirm` — Confirm a resolved report (student)
- `DELETE /:id/cancel` — Cancel a report (student)
- `POST /:id/feedback` — Submit feedback on a report (student)

### Staff (`/api/staff`)
- `GET /queue` — Staff's block queue
- `PATCH /reports/:id/status` — Update report status
- `PATCH /reports/:id/reject` — Reject a report
- `GET /block-rating` — Block performance rating

### Admin (`/api/admin`)
- `GET /reports` — All reports
- `PATCH /reports/:id/status` — Update report status
- `PATCH /reports/:id/reject` — Reject a report
- `GET /block-ratings` — Block ratings
- `GET /staff` — Staff list
- `POST /staff` — Create staff account
- `DELETE /staff/:id` — Remove staff
- `GET /analytics` — Analytics data
- `GET /escalated` — Escalated reports

### Notifications (`/api/notifications`)
- `GET /` — User notifications
- `PATCH /read-all` — Mark all as read
- `PATCH /:id/read` — Mark single notification as read

### Other
- `GET /api/blocks` — Public block list
- `GET /health` — Health check

## Scripts

| Command | Description |
|---------|-------------|
| `node backend/runSchema.js` | Create all tables |
| `node backend/seed.js` | Seed users & blocks |
| `node backend/resetData.js` | Clear all report data |
| `cd frontend && npm run dev` | Start Vite dev server (port 8443) |
| `cd backend && npm run dev` | Start Express dev server (port 3000) |

## License

MIT
