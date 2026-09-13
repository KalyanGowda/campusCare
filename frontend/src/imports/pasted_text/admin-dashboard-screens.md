Add five missing screens to the Admin Dashboard. All five use the 
exact same shell as the existing Admin Dashboard — same dark navy 
sidebar (Dashboard, All Reports, Block Ratings, Staff Management, 
Analytics, Settings, Log out), same topbar with bell icon + "Admin" 
+ "BMSIT&M" sub-label + "A" avatar, same #F0F2F7 page background. 
Only the main content area changes per screen.

════════════════════════════════════════════
SCREEN 1 — ALL REPORTS
════════════════════════════════════════════

Sidebar active: "All Reports" highlighted
(left amber border, navy-deep background, white text)
Page title: "All Reports"

── MAIN CONTENT ──────────────────────────

HEADER ROW (flex, space-between, margin-bottom 20px):
  Left:
    Heading "All Reports" Inter SemiBold 18px, #1C2333
    Below: "138 total reports across all blocks 
    and campus areas"
    Inter Regular 13px, #6B7280
  Right:
    "Export CSV" button —
      Background: transparent
      Border: 1px solid #E2E6EF
      Color: #1C2333
      Font: Inter Medium 13px
      Border-radius: 6px
      Padding: 8px 16px
      Download icon left of label

FILTER BAR (white card, 10px radius, 
1px #E2E6EF border, 16px padding, 
flex row, gap 12px, margin-bottom 16px):

  Filter 1 — Block dropdown (160px wide):
    "All Blocks" default
    Options: All Blocks / Block A / Block B / 
    Block C / Block D / Block E / Block F / Campus

  Filter 2 — Status dropdown (160px wide):
    "All Statuses" default
    Options: All / Open / Acknowledged / 
    In Progress / Resolved / Rejected

  Filter 3 — Category dropdown (180px wide):
    "All Categories" default
    Options: All / Electrical Issue / 
    Furniture Damage / Washroom / Projector & AC / 
    Campus Area / Others

  Filter 4 — Date range (200px wide):
    "Sep 2025" default, calendar icon right

  Search input (flex-grow, fills remaining):
    Placeholder: "Search by location, ID, or category"
    Search icon inside left

  All inputs: 38px height, 1px #E2E6EF border, 
  6px radius, Inter Regular 13px, #1C2333

REPORTS TABLE (white card, 10px radius,
1px #E2E6EF border, table fills edge to edge):

  Column headers (48px, #F9FAFB background):
    REPORT ID | LOCATION | BLOCK | CATEGORY | 
    REPORTED BY | STATUS | DATE | SLA | ASSIGNED TO | ACTION
    
    All: Inter Medium 12px, #6B7280, 
    uppercase, letter-spacing 0.04em
    Left padding first col: 20px
    Right padding last col: 20px

  10 TABLE ROWS, 60px height, 
  alternating white/#F9FAFB,
  1px #E2E6EF bottom border,
  Overdue rows: #FFF5F5 tint:

  ROW 1:
    ID:          #RPT-2025-0047
    Location:    Room 204
    Block:       Block B
    Category:    Fan not working
    Reported by: Student #S-4821
    Status:      [In Progress badge]
    Date:        3 Sep 2025
    SLA:         🟡 1 day left, #D97706
    Assigned to: Ravi Kumar
    Action:      "View" #1A2B4A SemiBold 13px

  ROW 2:
    ID:          #RPT-2025-0046
    Location:    Washroom F2
    Block:       Block A
    Category:    Tap broken
    Reported by: Student #S-3302
    Status:      [Acknowledged badge]
    Date:        1 Sep 2025
    SLA:         🔴 Overdue, #DC2626
    Assigned to: Meena S
    Action:      "View"
    Row tint:    #FFF5F5

  ROW 3:
    ID:          #RPT-2025-0045
    Location:    Main Gate
    Block:       Campus
    Category:    Garbage pile
    Reported by: Student #S-1190
    Status:      [Open badge]
    Date:        5 Sep 2025
    SLA:         🟢 2 days, #16A34A
    Assigned to: Admin
    Action:      "View"

  ROW 4:
    ID:          #RPT-2025-0044
    Location:    Lab 301
    Block:       Block C
    Category:    Projector issue
    Reported by: Student #S-2204
    Status:      [Resolved badge]
    Date:        25 Aug 2025
    SLA:         ✓ Met
    Assigned to: Suresh R
    Action:      "View"

  ROW 5:
    ID:          #RPT-2025-0043
    Location:    Room 101
    Block:       Block B
    Category:    Bench damaged
    Reported by: Student #S-4821
    Status:      [Rejected badge]
    Date:        20 Aug 2025
    SLA:         —
    Assigned to: Ravi Kumar
    Action:      "View"

  ROW 6:
    ID:          #RPT-2025-0042
    Location:    Corridor F1
    Block:       Block B
    Category:    Broken railing
    Reported by: Student #S-5501
    Status:      [Acknowledged badge]
    Date:        31 Aug 2025
    SLA:         🔴 Overdue, #DC2626
    Assigned to: Ravi Kumar
    Action:      "View"
    Row tint:    #FFF5F5

  ROW 7:
    ID:          #RPT-2025-0041
    Location:    Parking Area
    Block:       Campus
    Category:    Damaged barrier
    Reported by: Student #S-0872
    Status:      [Open badge]
    Date:        4 Sep 2025
    SLA:         🟢 3 days
    Assigned to: Admin
    Action:      "View"

  ROW 8:
    ID:          #RPT-2025-0040
    Location:    Room 112
    Block:       Block D
    Category:    Light not working
    Reported by: Student #S-3310
    Status:      [In Progress badge]
    Date:        2 Sep 2025
    SLA:         🟢 1 day
    Assigned to: Anita P
    Action:      "View"

  ROW 9:
    ID:          #RPT-2025-0039
    Location:    Lab 2
    Block:       Block E
    Category:    AC not cooling
    Reported by: Student #S-4400
    Status:      [Open badge]
    Date:        5 Sep 2025
    SLA:         🟢 4 days
    Assigned to: Kiran M
    Action:      "View"

  ROW 10:
    ID:          #RPT-2025-0038
    Location:    Washroom G3
    Block:       Block F
    Category:    Flush broken
    Reported by: Student #S-2281
    Status:      [Acknowledged badge]
    Date:        3 Sep 2025
    SLA:         🟡 1 day
    Assigned to: Deepa N
    Action:      "View"

  TABLE FOOTER (48px, #F9FAFB, border-radius 
  bottom 10px):
    Left: "Showing 10 of 138 reports"
    Inter Regular 13px, #6B7280
    Right: Previous | 1 | 2 | 3 | ... | 14 | Next
    Active page (1): #1A2B4A fill, white text, 
    6px radius, 28px × 28px

  SLA ESCALATION BANNER (above the table, 
  below filter bar):
    Background: #FFF5F5
    Border: 1px solid #FCA5A5
    Border-radius: 8px
    Padding: 14px 20px
    Flex row, space-between, align-center
    
    Left: "⚠ 4 reports have breached SLA 
    and require your attention."
    Inter SemiBold 14px, #DC2626
    
    Right: "View escalated only" text button
    Inter Medium 13px, #DC2626, underline

════════════════════════════════════════════
SCREEN 2 — BLOCK RATINGS
════════════════════════════════════════════

Sidebar active: "Block Ratings" highlighted
Page title: "Block Ratings"

── MAIN CONTENT ──────────────────────────

HEADER ROW (flex, space-between):
  Left:
    Heading "Block Performance"
    Sub: "Ratings reset monthly. Based on 
    resolution rate and timeliness."
    Inter Regular 13px, #6B7280
  Right:
    Period tab selector — two tabs:
    "Aug 2025" | "Sep 2025"
    Active (Sep 2025): #1A2B4A fill, white, 
    6px radius, Inter Medium 13px
    Inactive: white, #6B7280, 1px #E2E6EF border, 
    6px radius

FORMULA CARD (white, 10px radius, 
1px #E2E6EF border, 16px padding, 
flex row, gap 32px, margin-bottom 20px):
  
  Small label: "HOW RATINGS ARE CALCULATED"
  Inter Medium 11px, #6B7280, letter-spacing 0.06em
  Below, two metrics side by side:
  
  "50% Resolution Rate" 
  Inter SemiBold 14px, #1C2333
  + 
  "50% Timeliness Score"
  Inter SemiBold 14px, #1C2333
  
  Right side: "= Rating out of 100"
  Inter Medium 13px, #6B7280

LEADERBOARD TABLE (white card, 10px radius,
1px #E2E6EF border, table fills edge to edge):

  Column headers (48px, #F9FAFB):
    RANK | BLOCK | INCHARGE | RESOLUTION RATE | 
    TIMELINESS SCORE | RATING | TREND | DETAIL
    Same header style as other tables.

  6 ROWS (one per block), 72px height each:

  ROW 1 — Block A:
    Rank:        "1" Inter Bold 16px, #E8A020 
                 (gold for #1)
    Block:       "Block A" Inter SemiBold 14px
    Incharge:    "Meena S" + small avatar initials 
                 circle (24px, #DBEAFE bg, #1A2B4A text)
    Res. Rate:   "92%" Inter SemiBold 14px, #16A34A
    Timeliness:  "89%" Inter SemiBold 14px, #16A34A
    Rating:      "91" Inter Bold 24px, #1A2B4A
                 A thin green horizontal bar behind 
                 the number spanning ~91% of cell width
                 (8px height, #DCFCE7 fill, subtle)
    Trend:       Small sparkline — 6 dots connected 
                 by a thin line showing upward trend
                 Color: #16A34A
                 3 months data (left to right): 
                 82 → 87 → 91
    Detail:      "View" #1A2B4A SemiBold 13px

  ROW 2 — Block C:
    Rank:        "2" Inter Bold 16px, #9CA3AF
    Block:       "Block C"
    Incharge:    "Suresh R"
    Res. Rate:   "88%" #16A34A
    Timeliness:  "87%" #16A34A
    Rating:      "88" — green bar at 88%
    Trend:       Flat line, #6B7280
                 Data: 87 → 88 → 88
    Detail:      "View"

  ROW 3 — Block D:
    Rank:        "3" #9CA3AF
    Block:       "Block D"
    Incharge:    "Anita P"
    Res. Rate:   "84%" #16A34A
    Timeliness:  "83%" #16A34A
    Rating:      "84" — green bar at 84%
    Trend:       Upward, #16A34A
                 Data: 78 → 81 → 84
    Detail:      "View"

  ROW 4 — Block B:
    Rank:        "4" #9CA3AF
    Block:       "Block B"
    Incharge:    "Ravi Kumar"
    Res. Rate:   "88%" #16A34A
    Timeliness:  "79%" #D97706 (amber — moderate)
    Rating:      "79" — amber bar #FEF3C7 fill
    Trend:       Downward, #DC2626
                 Data: 85 → 82 → 79
                 Row gets a very subtle 
                 #FFFBF0 background tint
    Detail:      "View"

  ROW 5 — Block E:
    Rank:        "5" #9CA3AF
    Block:       "Block E"
    Incharge:    "Kiran M"
    Res. Rate:   "74%" #D97706
    Timeliness:  "68%" #D97706
    Rating:      "71" — amber bar
    Trend:       Downward, #DC2626
                 Data: 75 → 73 → 71
    Detail:      "View"

  ROW 6 — Block F:
    Rank:        "6" #9CA3AF
    Block:       "Block F"
    Incharge:    "Deepa N"
    Res. Rate:   "61%" #DC2626 (red — poor)
    Timeliness:  "67%" #D97706
    Rating:      "64" — red bar #FEE2E2 fill
    Trend:       Downward, #DC2626
                 Data: 70 → 67 → 64
                 Row gets #FFF5F5 tint
    Detail:      "View"

BOTTOM ALERT CARD (below table, 16px gap):
  White card, 1px solid #FCA5A5 border, 
  10px radius, 16px 20px padding.
  Flex row, space-between.
  
  Left: "Block F and Block E are below the 
  acceptable rating threshold (70). Consider 
  a review with their incharges."
  Inter Regular 13px, #DC2626
  
  Right: "Contact Incharges" button —
  Background: #DC2626, white text, 
  Inter SemiBold 13px, 6px radius, 
  Padding: 8px 16px

════════════════════════════════════════════
SCREEN 3 — STAFF MANAGEMENT
════════════════════════════════════════════

Sidebar active: "Staff Management" highlighted
Page title: "Staff Management"

── MAIN CONTENT ──────────────────────────

HEADER ROW (flex, space-between, margin-bottom 20px):
  Left:
    Heading "Block Staff Accounts"
    Sub: "6 staff accounts · 6 blocks assigned"
  Right:
    "+ Add Staff Account" button —
      Background: #1A2B4A
      Color: #FFFFFF
      Font: Inter SemiBold 13px
      Border-radius: 6px
      Padding: 10px 20px
      Plus icon left of label

STAFF TABLE (white card, 10px radius,
1px #E2E6EF border):

  Column headers (48px, #F9FAFB):
    NAME | EMAIL | ASSIGNED BLOCK | 
    REPORTS HANDLED | CURRENT RATING | 
    ACCOUNT CREATED | STATUS | ACTIONS

  6 ROWS, 68px height:

  ROW 1:
    Name:       Avatar circle (32px, #DBEAFE, 
                "MS" initials) + "Meena S"
                Inter SemiBold 14px, #1C2333
    Email:      meena.s@bmsit.in
                Inter Regular 13px, #6B7280
    Block:      [Block A pill] — #EEF2FF bg, 
                #3730A3 text, 4px radius, 
                Inter Medium 12px, padding 3px 10px
    Handled:    54
    Rating:     "91" — small green badge
                #DCFCE7 bg, #15803D text
    Created:    12 Jan 2025
    Status:     [Active] — #DCFCE7 bg, 
                #15803D text, same badge style
    Actions:    "Edit" text link #1A2B4A 
                | "Remove" text link #DC2626
                separated by thin | divider

  ROW 2:
    Name:       "Suresh R" (avatar "SR", #DCFCE7)
    Email:      suresh.r@bmsit.in
    Block:      [Block C pill]
    Handled:    41
    Rating:     "88" — green badge
    Created:    5 Mar 2025
    Status:     [Active]
    Actions:    Edit | Remove

  ROW 3:
    Name:       "Anita P" (avatar "AP", #FEF3C7)
    Email:      anita.p@bmsit.in
    Block:      [Block D pill]
    Handled:    38
    Rating:     "84" — green badge
    Created:    5 Mar 2025
    Status:     [Active]
    Actions:    Edit | Remove

  ROW 4:
    Name:       "Ravi Kumar" (avatar "RK", #DBEAFE)
    Email:      ravi.kumar@bmsit.in
    Block:      [Block B pill]
    Handled:    47
    Rating:     "79" — amber badge 
                #FEF3C7 bg, #92400E text
    Created:    12 Jan 2025
    Status:     [Active]
    Actions:    Edit | Remove

  ROW 5:
    Name:       "Kiran M" (avatar "KM", #F3F4F6)
    Email:      kiran.m@bmsit.in
    Block:      [Block E pill]
    Handled:    29
    Rating:     "71" — amber badge
    Created:    18 Apr 2025
    Status:     [Active]
    Actions:    Edit | Remove

  ROW 6:
    Name:       "Deepa N" (avatar "DN", #FEE2E2)
    Email:      deepa.n@bmsit.in
    Block:      [Block F pill]
    Handled:    22
    Rating:     "64" — red badge 
                #FEE2E2 bg, #B91C1C text
    Created:    2 Jun 2025
    Status:     [Active]
    Actions:    Edit | Remove

ADD STAFF MODAL (design as a separate 
overlay/modal component):

  Dark overlay background: rgba(0,0,0,0.4)
  
  Modal card: 480px wide, white, 12px radius,
  box-shadow: 0 20px 60px rgba(0,0,0,0.15),
  32px padding

  Modal header (flex, space-between):
    "Add Staff Account" 
    Inter SemiBold 18px, #1C2333
    × close icon button, right-aligned, #6B7280

  Thin #E2E6EF divider, 24px gap.

  FORM FIELDS (stacked, 16px gap):

    Full Name:
      Label: Inter Medium 13px, #6B7280
      Input: placeholder "e.g. Priya Sharma"

    College Email:
      Label: "College Email"
      Input: placeholder "e.g. priya.s@bmsit.in"
      Note below: "Must be a college email domain"
      Inter Regular 12px, #6B7280

    Assign Block:
      Label: "Assign Block"
      Dropdown: "Select a block"
      Options: Block A through Block F
      Note: "Each block can have only one incharge."

    Temporary Password:
      Label: "Temporary Password"
      Input: type password
      Note: "Staff will be prompted to change 
      this on first login."

  All inputs: same style as other screens
  (40px height, 1px #E2E6EF border, 6px radius)

  24px gap. Thin divider. 16px gap.

  Button row (flex, gap 12px, right-aligned):
    "Cancel" — ghost button, 1px #E2E6EF border,
    #6B7280 text, 6px radius, padding 10px 20px
    "Create Account" — #1A2B4A fill, white text,
    6px radius, padding 10px 20px

════════════════════════════════════════════
SCREEN 4 — ANALYTICS
════════════════════════════════════════════

Sidebar active: "Analytics" highlighted
Page title: "Analytics"

── MAIN CONTENT ──────────────────────────

HEADER ROW (flex, space-between, margin-bottom 20px):
  Left:
    Heading "Campus Analytics"
    Sub: "BMSIT&M · September 2025"
  Right:
    Period dropdown "September 2025" —
    160px wide, 38px height, 
    1px #E2E6EF border, 6px radius

SUMMARY ROW (4 mini stat cards, 
same style as existing dashboard cards,
but smaller — use existing 4-card row as reference.
These already exist — DO NOT recreate them.
Skip directly to charts below.)

CHART GRID — 2 columns, gap 20px:

── TOP LEFT CARD ─────────────────────────
"Most Reported Block" 
White card, 10px radius, 1px #E2E6EF border, 
20px padding.

Card header row (flex, space-between):
  "Most Reported Block" 
  Inter SemiBold 15px, #1C2333
  "Sep 2025" Inter Regular 12px, #6B7280

Horizontal bar chart (below header, 24px gap):
Each bar row: label left (80px fixed), 
bar middle (flex-grow), value right (40px fixed).
Bar height: 28px, border-radius: 4px, 
color: #1A2B4A.
8px gap between rows.

  Block B: ████████████████████ 34
  Block A: ████████████████ 28
  Block C: ████████████ 22
  Block D: █████████ 17
  Block E: ██████ 11
  Block F: ████ 8

Labels: Inter Medium 13px, #1C2333
Values: Inter SemiBold 13px, #1C2333
Bar fill: #1A2B4A at proportional widths
(Block B is widest at 100%, others proportional)

── TOP RIGHT CARD ────────────────────────
"Most Reported Category"
Same card style.

Horizontal bar chart, bar color: #E8A020 (amber):

  Electrical Issue:    ████████████████████████ 41
  Washroom:            ████████████████ 28
  Furniture Damage:    ███████████ 19
  Projector & AC:      ████████ 14
  Campus Area:         █████ 9
  Others:              ██ 4

── BOTTOM — FULL WIDTH CARD ──────────────
"Report Status Breakdown"
White card, 10px radius, 1px #E2E6EF border,
20px padding. Full width (spans both columns).

Card header:
  "Report Status Breakdown — September 2025"
  Inter SemiBold 15px, #1C2333
  Sub: "138 total reports this month"
  Inter Regular 13px, #6B7280

Two-column layout inside this card:
  Left (donut chart, ~280px): 
    A donut chart, 200px diameter.
    Three segments:
    Resolved: 68% — #16A34A (green)
    Open/In Progress: 21% — #1A2B4A (navy)
    Rejected: 11% — #DC2626 (red)
    
    Center of donut (the hole):
      "138" Inter Bold 28px, #1C2333
      "reports" Inter Regular 12px, #6B7280

  Right (legend + detail, flex-grow):
    Three legend rows (24px gap between):
    
    Each row: colored square (12px) + label + 
    count + percentage (right-aligned)
    
    ■ Resolved      94 reports    68%
      Inter Regular 14px, #1C2333
      Count: Inter SemiBold 20px, #16A34A
      
    ■ Open / Active 29 reports    21%
      Count: Inter SemiBold 20px, #1A2B4A
      
    ■ Rejected      15 reports    11%
      Count: Inter SemiBold 20px, #DC2626

    Thin #E2E6EF divider below legend rows.
    
    Insight line below divider:
    "Resolution rate is up 6% from last month."
    Inter Regular 13px, #16A34A
    Small ↑ arrow icon before text.

════════════════════════════════════════════
SCREEN 5 — SETTINGS (ADMIN)
════════════════════════════════════════════

Sidebar active: "Settings" highlighted
Page title: "Settings"

── MAIN CONTENT — TWO COLUMN LAYOUT ──────
Left column: 420px
Right column: remaining width
Gap: 24px

── LEFT COLUMN — FOUR CARDS ───────────────

CARD 1 — PROFILE
Same structure as staff and student settings.

Fields:
  Full Name:    "Admin User"
  Email:        "admin@bmsit.in"
               (disabled, same muted input style)
               Note: "Admin email cannot be changed."
  Designation:  "Campus Administrator"
  Institution:  "BMSIT&M"
               (disabled)

"Save Changes" button — same style.

CARD 2 — NOTIFICATION PREFERENCES
Same toggle row structure.

Row 1 — ON:
  Label:     "SLA breach alerts"
  Sub-label: "When any report goes overdue 
              across any block"

Row 2 — ON:
  Label:     "New campus-area reports"
  Sub-label: "Reports submitted for open 
              campus areas (assigned to admin)"

Row 3 — ON:
  Label:     "Block rating drops"
  Sub-label: "When a block's rating falls 
              below 70"

Row 4 — ON:
  Label:     "Staff account activity"
  Sub-label: "When a staff account is created 
              or removed"

Row 5 — OFF:
  Label:     "Daily summary digest"
  Sub-label: "A daily email with open report 
              counts and escalations"

CARD 3 — SLA CONFIGURATION
White card, 10px radius, 1px #E2E6EF border, 
24px padding. This card is admin-only — 
staff and students don't see this.

Card heading: "SLA Target Times"
Inter SemiBold 16px, #1C2333
Sub: "Tickets not resolved within these 
times are auto-escalated to admin."
Inter Regular 12px, #6B7280
Thin divider, 16px gap.

Five SLA rows (label left, input right):
Each row: flex, space-between, align-center, 
44px height, 1px #E2E6EF bottom border 
(not on last row).

  Electrical Issue:       [  24  ] hours
  Furniture Damage:       [  48  ] hours
  Washroom Issues:        [  12  ] hours
  Projector & AC:         [  36  ] hours
  Campus Area / Others:   [  72  ] hours

Input: 64px wide, 36px height, 
1px #E2E6EF border, 6px radius, 
text-align: center, Inter SemiBold 14px, #1C2333.
"hours" label: Inter Regular 13px, #6B7280, 
8px left of input.

"Save SLA Settings" button — same style as 
other save buttons.

CARD 4 — CHANGE PASSWORD
Identical to staff/student settings Card 3.

── RIGHT COLUMN ───────────────────────────

ADMIN ACCOUNT CARD
White card, 10px radius, 1px #E2E6EF border,
20px padding.

Heading: "Account" — same style as other roles.
Thin divider.

Avatar: 64px circle, #1A2B4A background, 
"A" white initial, Inter Bold 24px. Centered.
Below: "Admin User" Inter SemiBold 15px, centered
Below: "admin@bmsit.in" Inter Regular 13px, 
#6B7280, centered
Below: "BMSIT&M" Inter Regular 12px, 
#6B7280, centered

Thin divider.

Info rows:
  Role:              Administrator
  Institution:       BMSIT&M
  Access level:      Full campus access
  Member since:      Jan 2025
  Total reports managed: 138

Thin divider.

SYSTEM STATS (inside account card, 
#F0F2F7 background, 8px radius, 14px padding):

  Label: "System Overview"
  Inter Medium 12px, #6B7280

  Three rows (label left, value right, 
  16px gap between):
    Active staff accounts:  6
    Blocks monitored:       6
    Reports this month:    138

Note: No Danger Zone section for admin.
Admin accounts are managed by super-admin only.

════════════════════════════════════════════
DO NOT CHANGE
════════════════════════════════════════════
- Existing Admin Dashboard screen 
  (4 stat cards + welcome banner)
- Sidebar structure and all nav labels
- Topbar layout and "BMSIT&M" sub-label
- All badge styles, card styles, color tokens
- Student dashboard screens
- Staff dashboard screens
- Landing page