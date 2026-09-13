# CARE — Figma Make Prompt
## Campus Alert & Resolution Engine | BMSIT&M

---

## WHAT YOU ARE BUILDING

A campus facility complaint and tracking system for **BMSIT&M (BMS Institute of Technology & Management)**. The full product name is **CARE — Campus Alert & Resolution Engine**. Students report broken infrastructure, block staff resolve issues in their assigned block, and admin monitors everything campus-wide.

Build all screens with **mock/placeholder data** — no real backend is connected yet. The design must feel like a real, demoable product, not a wireframe.

---

## DESIGN LANGUAGE

### Reference images you have
- **Landing page:** Model after the Oxford University website reference — full-screen college photograph as background, large typographic overlay on top of the image, vertical left navigation, a content card/panel floating on the right side. Replace Oxford's content with BMSIT&M content.
- **Dashboard (all roles):** Model after the Lingua dashboard reference — dark navy sidebar on the left (~220px wide), white/light-grey main content area, a right panel for supplementary info, cards at the top for key numbers, and rich data tables/charts in the center. All three roles (Student, Staff, Admin) follow this same shell.

### Color tokens
| Name | Hex | Use |
|---|---|---|
| `navy` | `#1A2B4A` | Sidebar, header, primary buttons |
| `navy-deep` | `#111D33` | Sidebar active state, dark panels |
| `accent` | `#E8A020` | Highlights, status "In Progress", CTA hover |
| `page-bg` | `#F0F2F7` | Dashboard main content background |
| `surface` | `#FFFFFF` | Cards, panels, table rows |
| `ink` | `#1C2333` | Primary text |
| `ink-muted` | `#6B7280` | Labels, secondary text |
| `line` | `#E2E6EF` | Borders, dividers, table rules |
| `success` | `#16A34A` | Resolved status |
| `warning` | `#D97706` | In Progress status |
| `danger` | `#DC2626` | Rejected status, SLA breach flag |
| `info` | `#2563EB` | Acknowledged status |
| `open-grey` | `#6B7280` | Open status |

### Typography
Use **Inter** for all UI (dashboard, forms, tables, nav). Use **Playfair Display** only for the landing page headline and the college name — nowhere else. This pairing gives the landing page an institutional, editorial feel while keeping the product UI clean and functional.

- Landing headline: Playfair Display Bold, 56–72px
- Dashboard heading (page title): Inter SemiBold, 22px
- Card title: Inter SemiBold, 15px
- Body / table row: Inter Regular, 14px
- Label / badge: Inter Medium, 12px
- Sidebar nav: Inter Medium, 14px

### Status badge system (use consistently everywhere)
| Status | Background | Text |
|---|---|---|
| Open | `#F3F4F6` | `#6B7280` |
| Acknowledged | `#DBEAFE` | `#1D4ED8` |
| In Progress | `#FEF3C7` | `#92400E` |
| Resolved | `#DCFCE7` | `#15803D` |
| Rejected | `#FEE2E2` | `#B91C1C` |

Badges: 4px border-radius, 6px horizontal padding, 3px vertical padding. Small, sharp, not pill-shaped — they read like stamps, not tags.

### Spacing & shape
- Sidebar width: 220px, full height, `navy` background
- Card radius: 10px
- Button radius: 6px
- Input radius: 6px
- Card shadow: `0 1px 4px rgba(0,0,0,0.06)`
- Page content max-width: 1200px, left-aligned in content area

---

## PAGE 1 — LANDING PAGE

### Layout concept
Full-viewport design. A large, full-bleed **photograph of BMSIT&M college campus** fills the entire page as background (I will provide this image — use a placeholder for now labeled "BMSIT&M campus photo here"). The page structure is inspired by the Oxford reference: a vertical navigation on the left, a large typographic treatment over the image in the center-left, and a floating announcement/info card on the right.

### Structure (top to bottom)
**Left vertical nav (fixed, narrow strip, ~80px wide):**
- CARE logo mark at the top (just the letter C in a square, `navy` background, white text)
- Stacked vertical nav labels rotated 90°, bottom-aligned: About · How it Works · Blocks · Login
- Same visual language as the Oxford vertical nav in the reference

**Center (over the background image):**
- Very large college name: **"BMSIT&M"** in Playfair Display Bold, white, ~80–100px — partially cropped at edges, large and typographic, sitting on top of the college image (like "Oxford" in the reference)
- Below it: a smaller label in Inter Regular: *"BMS Institute of Technology & Management"*
- Tagline below that: *"Every issue reported. Every block accountable. Every fix tracked."*
- Two buttons: **"Report a Problem"** (filled, `navy`) and **"See How It Works"** (ghost, white border)

**Right floating card (~360px wide, white, 12px radius, `navy-deep` header strip):**
- Small label at top: "CAMPUS ALERT & RESOLUTION ENGINE"
- A brief description: "Students report facility issues by block and room. Staff resolve them. Admin monitors the whole campus."
- Three small role pills below: Student · Staff · Admin
- A "Log In" button at the bottom of the card
- Below the card: a year label "2025 | BMSIT&M" (same placement as "2025 | RECAP" in the Oxford reference)

**Below the fold (scroll down — white background section):**
Break out of the full-screen image here. Clean white background.

**"How it works" — 4 steps, horizontal row:**
Use a numbered sequence (genuinely is a sequence):
1. **Spot it** — Notice a broken switch, damaged bench, dirty corridor
2. **Report it** — Select the block, space, and describe the issue
3. **It routes automatically** — Block staff or admin gets notified instantly
4. **Tracked until fixed** — Follow your report's status until it's resolved

Layout: four equal columns, a thin connecting horizontal rule between the numbers (same motif as a timeline), number in `navy`, title in Inter SemiBold, description in `ink-muted`.

**Role showcase — 3 columns:**
Each column is a quiet card showing one specific real screen detail:
- **Students:** A mini "My Reports" card — 3 report rows with status badges (one Open, one In Progress, one Resolved)
- **Block Staff:** A mini queue card — filtered to "Block B", showing 4 report rows with a confirmation count badge
- **Admin:** A mini leaderboard card — Block A (91), Block B (84), Block C (76) with small trend sparklines

**Performance strip — `navy-deep` background, white text:**
Three real-feeling metrics in a horizontal row (not round marketing numbers):
- 87% of reports resolved within SLA
- Avg. resolution time: 2.4 days
- 6 blocks tracked across campus

**Footer:** Plain. CARE logo, college name, "Campus Infrastructure Complaint System — VTU Project". No decorative elements.

---

## PAGE 2 — LOGIN & SIGNUP

### Layout: two-column split
**Left column (55% width):**
- CARE logo + "Campus Alert & Resolution Engine" wordmark at top-left
- Heading: "Welcome back" (login) / "Create your account" (signup)
- **Role selector at the top:** three tab-style buttons — Student | Staff | Admin. Selecting a role updates the helper text below the email field. "Staff and Admin accounts are created by your administrator."
- Fields: Name (signup only) · College Email · Password · Confirm Password (signup only)
- Helper text under email (Student only): "Use your college email — e.g. you@bmsit.in"
- Submit button: full width, `navy`, "Log In" / "Create Account"
- Toggle line at bottom: "New here? Create an account" (visible only on Student tab) / "Already have an account? Log in"
- Error state example: "That email and password don't match." — inline under the button, `danger` color, no icon

**Right column (45% width, `navy` background):**
An abstracted visual of the campus block grid — a 3×3 grid of "block plates" (Block A, Block B, Block C... styled like room-number plaques), slightly offset/rotated, quiet and structural. Not an illustration. `navy-deep` tiles on `navy` background, white labels. Below the grid, a small line: *"Serving 6 blocks across BMSIT&M campus."*

---

## PAGE 3 — STUDENT DASHBOARD SHELL

Use the **Lingua dashboard reference** as the layout template for all role dashboards. Adapt the content for CARE.

### Sidebar (220px, `navy`, full height)
- Top: CARE logo + "CARE" wordmark in white
- Nav items with icons (use simple line icons):
  - Dashboard (home icon)
  - Report a Problem (plus-circle icon) — highlighted in `accent` as the primary action
  - My Reports (list icon)
  - Notifications (bell icon)
  - Settings (gear icon)
  - Log out (arrow-right icon, bottom of sidebar)
- Active state: `navy-deep` background, left 3px border in `accent`

### Top bar (right of sidebar, full width)
- Left: Page title "Dashboard"
- Right: notification bell + student's name + avatar (initials circle)

### Student Dashboard — main content
**Welcome banner (full-width card, `navy` background, white text):**
"Good morning, Arjun. You have 2 open reports." — clean, no illustration (unlike Lingua which has a character illustration; skip that here, keep it text-focused).

**Quick stats row (3 cards):**
- Open Reports: 2
- In Progress: 1
- Resolved: 7

Each card: white, 10px radius, number in Inter Bold 28px `navy`, label in `ink-muted` 13px.

**My Recent Reports (table/card list, below stats):**
5 sample rows. Columns: Location | Category | Status badge | Date Submitted | Action ("View")
Sample data:
- Block B, Room 204 | Fan not working | In Progress | 3 Sep 2025
- Block A, Washroom F2 | Tap broken | Open | 5 Sep 2025
- Campus, Main Gate | Garbage pile | Acknowledged | 1 Sep 2025
- Block C, Lab 301 | Projector issue | Resolved | 25 Aug 2025
- Block B, Room 101 | Bench damaged | Rejected | 20 Aug 2025

"View all reports →" link below the table.

**Right panel (same position as Lingua's calendar panel):**
A "Report a Problem" shortcut card at top — `navy` background, white text, big plus icon, "Tap to report a new issue." Button inside.
Below: a "Recent Activity" feed — 4 items showing status changes: "Your report (Block B, Fan) moved to In Progress — 2 hours ago", etc.

---

## PAGE 4 — REPORT A PROBLEM (MULTI-STEP FORM)

Full-page flow. Show a step indicator at the top (horizontal stepper: Step 1 of 4, with step labels below each number). White card centered on the `page-bg`, max-width 680px, generous padding.

### Step 1 — Choose location type
Two large option cards side by side:
- **Block** (building icon) — "An issue inside a classroom, lab, washroom, or corridor"
- **Campus** (map icon) — "An issue in an open campus area — parking, grounds, gates"

Cards: white, 1px `line` border, 12px radius. Selected state: `navy` border (2px), light `navy` tint background, checkmark in top-right corner.

"Next" button: disabled until one is selected.

---

### IF BLOCK SELECTED:

**Step 2 — Select block**
Heading: "Which block is the problem in?"
A grid of block name buttons (Block A, Block B, Block C, Block D, Block E, Block F) — 3 columns, each a selectable tile. Selected: `navy` fill, white text.

**Step 3 — Select space type**
Four option cards in a 2×2 grid:
- Classroom (desk icon)
- Lab (flask icon)
- Washroom (droplet icon)
- Others (grid icon)

**Step 4 — Describe the problem**
*If Classroom or Lab:*
- Toggle row: "Issue" | "Damage" (segmented control, `navy` active)
- IF ISSUE: Multi-select chip row of common problems: Switch · Fan · Light · Projector · AC · Door Lock · Other. Below: text area "Describe the problem in detail" (placeholder: "e.g. The ceiling fan in the back row has not worked for 3 days").
- IF DAMAGE: A large dashed-border upload zone — "Drag or tap to upload a photo. Required for damage reports." Below: text area "What's damaged?" (placeholder: "e.g. Two benches near the window are broken — the seat plank is split").
- Both: a text input at the bottom — "Room / Lab number" (e.g. Room 204, Lab 3A).

*If Washroom:*
Same issue/damage toggle, simplified chip options (Tap · Flush · Light · Door · Tile · Other), and a "Floor & Wing" text field instead of room number.

*If Others:*
Category text input + description text area + optional photo upload.

---

### IF CAMPUS SELECTED:

**Step 2 — Upload a photo**
Large dashed upload zone — "Take or upload a photo of the issue. Required." Below: text area "Describe the issue."

**Step 3 — Select nearest landmark**
Heading: "Where on campus is this?"
Dropdown with options: Block A Gate · Block B Gate · Basketball Court · Parking Area · Main Gate · Canteen · Library · Open Ground · Other

---

### Duplicate check screen (between last step and final submission)
Triggered automatically before showing the confirm button.

Two states:

**State A — Match found:**
A yellow/amber banner at top: "⚠ A similar report already exists."
Below: a read-only report card showing the existing open report (location, category, date, confirmation count — e.g. "Confirmed by 4 students").
Two buttons:
- "Yes, I see this too" (primary, `navy`) — confirms the existing report, increments count
- "No, mine is different — submit anyway" (secondary, ghost)

**State B — No match:**
A green banner: "✓ No duplicate found. Ready to submit."
A summary card of what they're about to submit (location, space, category, description, photo thumbnail if uploaded).
"Submit Report" button (full width, `navy`).

**Confirmation screen (after submit):**
A centered success state. A large checkmark in `success` green. "Your report has been submitted." Report ID below (e.g. #RPT-2025-0047). "You'll be notified when staff acknowledge it." Two buttons: "View My Reports" and "Report Another Issue."

---

## PAGE 5 — MY REPORTS (STUDENT)

List of the student's submitted reports as cards.

**Filter bar at top:** Status dropdown (All / Open / Acknowledged / In Progress / Resolved / Rejected) · Category dropdown · Sort by (Newest / Oldest)

**Report cards (full width, stacked):**
Each card:
- Left: colored left border matching status color (3px)
- Top row: Location (bold) + Status badge (right-aligned)
- Second row: Category description in `ink-muted`
- Third row: "Submitted 3 Sep 2025" + Confirmation count if >1: "3 others confirmed this"
- Bottom row (if Open): a quiet "Cancel report" text link in `danger`. If Resolved: "Leave feedback" link in `success`.
- Click anywhere on card → opens Report Detail drawer/page

**Report Detail page:**
A drawer sliding in from the right (or a new page). Shows:
- Full location, category, description, photo (if any), current status badge
- Status history timeline (vertical, left-side dots): Open (3 Sep, 9:12am) → Acknowledged (3 Sep, 2:30pm) → In Progress (4 Sep, 10:00am). Future dots greyed out.
- Confirmation count: "4 students have confirmed this issue"
- If Resolved: feedback widget (see Page 6)

---

## PAGE 6 — FEEDBACK (POST-RESOLUTION)

Appears inline at the bottom of the Report Detail page when status is Resolved.

A quiet card:
"Was this resolved properly?"
Two large icon buttons side by side: 👍 Yes, all good | 👎 No, not really
Below: "Optional comment" text area (placeholder: "Anything else to add?")
"Submit feedback" button.
After submission: replaced with "Thanks for your feedback." — no animation needed.

---

## PAGE 7 — STAFF DASHBOARD

Same sidebar/topbar shell as Student dashboard, adapted for staff role.
Sidebar nav: Dashboard · My Queue · Report Detail (contextual) · Settings · Log out
Top bar right side: "Block B Incharge" label + name + avatar.

### Staff Dashboard main content
**Summary row (4 cards):**
- Open: 5
- Acknowledged: 3
- In Progress: 4
- Resolved this month: 18

**Block Queue (main table, filterable):**
Heading: "Block B — Open Reports"
Filter tabs: All | Open | Acknowledged | In Progress

Table columns:
| Location | Category | Description | Confirmed by | Status | Date | SLA | Action |
|---|---|---|---|---|---|---|---|
| Room 204 | Fan issue | "Fan not working since..." | 4 students | In Progress | 3 Sep | 🟡 1 day left | View |
| Lab 301 | Projector | "Projector shows no signal" | 1 student | Open | 5 Sep | 🟢 3 days | View |
| Washroom F2 | Tap broken | "Cold tap dripping..." | 7 students | Acknowledged | 1 Sep | 🔴 Overdue | View |

SLA column: green dot if time remaining, yellow if <1 day, red "Overdue" if breached.

**Right panel:**
Block rating card: "Block B Rating — 84 / 100" with two sub-scores: Resolution Rate 88% and Timeliness Score 79%. A small horizontal bar for each.

---

## PAGE 8 — STAFF REPORT DETAIL

A full-page detail view (not a drawer for staff — give it more space).

**Left section (60%):**
- Report ID + timestamp
- Location: Block B, Room 204
- Space: Classroom
- Category: Issue — Fan not working
- Description full text
- Photo (if damage report): image preview
- Confirmation count: "4 students confirmed this issue"
- Status history timeline (same as student view but staff can see who changed it)

**Right section (40%):**
**Status update card (the primary action):**
Current status: "In Progress" badge.
A select/dropdown: "Move to →" with options Acknowledged / In Progress / Resolved.
"Update Status" button (`navy`).

**Rejection card (below, more muted):**
"Mark as Invalid / Rejected" — a collapsible section. When expanded: a required text area "Reason for rejection (visible to admin)" and a red "Reject Report" button.

**Student info (bottom of right column):**
"Reported by: Student #S-4821" (no name shown to staff — privacy). Past reports count: "This student has submitted 3 reports, 1 previously rejected."

---

## PAGE 9 — ADMIN DASHBOARD

Same sidebar/topbar shell. Sidebar: Dashboard · All Reports · Block Ratings · Staff Management · Analytics · Settings · Log out.
Top bar: "Admin — BMSIT&M" + name + avatar.

### Admin Dashboard main content
**Summary cards (4, top row):**
- Total Open Reports: 23
- Resolved This Month: 61
- Currently Escalated (SLA Breach): 4
- Avg. Resolution Time: 2.4 days

Cards with subtle color tinting: Open = plain white, Escalated = light `danger` tint.

**Two-column layout below summary cards:**

**Left (60%) — Global Reports (recent):**
A compact table: Location | Category | Assigned To | Status | Date | SLA
Shows 6 rows across all blocks + campus. "View all reports →" link.

**Right (40%) — Block Rating Leaderboard:**
Small heading: "Block Performance — September 2025"
A ranked list:
1. Block A — 91 ⬆
2. Block C — 88 →
3. Block D — 84 ⬆
4. Block B — 79 ⬇
5. Block E — 71 ⬇
6. Block F — 64 ⬇

Each row: rank number · block name · score · small trend arrow (up/down/flat in green/red/grey) · thin progress bar behind the score.

**Bottom row — SLA Escalated (urgent):**
A `danger`-tinted banner row: "4 reports have breached SLA and need your attention."
A compact table of just those 4 reports with a "Take action" link on each.

---

## PAGE 10 — ADMIN ALL REPORTS

**Filter bar (full width):**
Block dropdown · Status dropdown · Category dropdown · Date range · Search input
"Export CSV" button (right-aligned, ghost style).

**Full reports table:**
Columns: Report ID | Location | Block | Category | Reported By | Status | Submitted | SLA | Assigned To | Action
Rows alternate white / very light grey (`#F9FAFB`).
Pagination at bottom (showing 1–20 of 87).

---

## PAGE 11 — BLOCK RATINGS PAGE (ADMIN)

Heading: "Block Performance — BMSIT&M"
Sub-heading: "Updated monthly. Based on resolution rate and average time to resolve."

**Period selector:** Month tabs — Aug 2025 | Sep 2025 (current)

**Leaderboard table (full width):**
| Rank | Block | Incharge | Resolution Rate | Timeliness Score | Rating | Trend | |
|---|---|---|---|---|---|---|---|
| 1 | Block A | Name | 92% | 89% | 91 | ↑ sparkline | View detail |
| 2 | Block C | Name | 88% | 87% | 88 | → sparkline | View detail |
| ... | | | | | | | |

Rating column: show the number large (Inter Bold, 20px) with a colored bar behind it (green >80, amber 60–79, red <60).
Trend sparkline: a tiny 6-point line chart in the last column (3 months of data).

---

## PAGE 12 — STAFF MANAGEMENT (ADMIN)

**Header row:** "Block Staff Accounts" + "Add Staff Account" button (primary, `navy`).

**Staff table:**
| Name | Email | Assigned Block | Account Created | Status | Actions |
|---|---|---|---|---|---|
| Ravi Kumar | ravi@bmsit.in | Block A | 12 Jan 2025 | Active | Edit · Remove |
| Priya S | priya@bmsit.in | Block C | 5 Mar 2025 | Active | Edit · Remove |
| Unassigned | — | — | — | — | — |

**Add Staff modal:**
Triggered by "Add Staff Account" button. A modal overlay.
Fields: Full Name · College Email · Assign Block (dropdown) · Temporary Password.
"Create Account" button. Note below: "Staff will be prompted to change their password on first login."

---

## PAGE 13 — ANALYTICS (ADMIN)

Three charts, laid out in a 2-column grid:

**Top left — Most Reported Block (horizontal bar chart):**
Block names on Y axis, report count on X axis. `navy` bars.
Block B: 34 | Block A: 28 | Block C: 22 | Block D: 17 | Block E: 11 | Block F: 8

**Top right — Most Reported Category (horizontal bar chart):**
Category names on Y axis. `accent` bars.
Electrical Issues: 41 | Washroom: 28 | Furniture Damage: 19 | Projector/AC: 14 | Campus/Other: 9

**Bottom center (full width) — Open vs Resolved vs Rejected (donut chart):**
Three segments: Resolved (68%, `success`), Open (21%, `open-grey`), Rejected (11%, `danger`).
Center of donut: "138 total this month".
Legend below the donut.

---

## FIGMA FILE ORGANIZATION

**Pages:**
1. `🎨 Tokens` — color swatches, type scale, badge system, spacing reference
2. `🏠 Landing` — landing page (desktop 1440px + mobile 390px)
3. `🔑 Auth` — login and signup (desktop + mobile)
4. `👤 Student` — Dashboard, Report Flow (all steps), My Reports, Report Detail, Feedback
5. `🔧 Staff` — Dashboard, Report Detail + Action
6. `⚙️ Admin` — Dashboard, All Reports, Block Ratings, Staff Management, Analytics
7. `🧩 Components` — sidebar, topbar, cards, badges, buttons, form inputs, table row, step indicator, sparkline

**Frame sizes:**
- All dashboard screens: 1440 × 900px
- All landing/auth screens: 1440 × 900px (desktop) + 390 × 844px (mobile)

**Prototype flows to wire up:**
1. Landing → Login → Student Dashboard (student role)
2. Landing → Login → Staff Dashboard (staff role)
3. Landing → Login → Admin Dashboard (admin role)
4. Student Dashboard → Report a Problem → Step 1 → Step 2 → ... → Duplicate Check → Success
5. Student Dashboard → My Reports → Report Detail
6. Staff Dashboard → Queue row → Report Detail → Status Update

**Use Figma variables** for all color tokens so swapping the accent color is one change everywhere.
**Use Auto Layout** on all cards, tables, sidebar nav, step indicators, and form fields.