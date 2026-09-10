Add two new screens to the Student Dashboard. Both screens use the 
exact same shell as the existing dashboard — same sidebar, same topbar 
(bell icon + "Arjun Kumar" + "AK" avatar), same #F0F2F7 page background. 
Only the main content area changes per screen.

════════════════════════════════════════════
SCREEN 1 — NOTIFICATIONS
════════════════════════════════════════════

Sidebar active state: "Notifications" item highlighted 
(same style as "Dashboard" is highlighted currently — 
left amber border, navy-deep background, white text).

Page title (topbar left): "Notifications"

── MAIN CONTENT ──────────────────────────

Full-width content area. No right panel on this screen 
— notifications take the full width.

FILTER ROW (below page title, above the list):
  Three tab-style text buttons, left-aligned:
    All  |  Unread  |  Read
  Active tab: Inter SemiBold 14px, #1A2B4A, 
              2px bottom border in #E8A020
  Inactive tab: Inter Regular 14px, #6B7280
  A "Mark all as read" text button, right-aligned, 
  Inter Medium 14px, #1A2B4A, no border

NOTIFICATION LIST (white card, 10px radius, 1px #E2E6EF border):
Each notification is a row inside this card.
Row height: auto, min 72px. 1px #E2E6EF divider between rows.
Last row has no divider.

Row anatomy (left to right):
  [Unread dot] [Icon circle] [Text block] [Timestamp]

UNREAD DOT:
  8px circle, #E8A020 (amber), sits left of the icon.
  For read notifications: no dot, that space is empty (8px).

ICON CIRCLE:
  36px circle. Color varies by notification type:
  - Status change → #DBEAFE background, blue info icon
  - Resolved → #DCFCE7 background, green checkmark icon
  - Rejected → #FEE2E2 background, red X icon
  - Confirmation → #FEF3C7 background, amber users icon
  - System → #F3F4F6 background, grey bell icon

TEXT BLOCK (flex-grows to fill space):
  Title: Inter SemiBold 14px, #1C2333
  Subtitle: Inter Regular 13px, #6B7280
  Both left-aligned. 4px gap between title and subtitle.

TIMESTAMP:
  Inter Regular 12px, #6B7280
  Right-aligned, top of the row

SAMPLE NOTIFICATIONS (show 8 rows, mix of read/unread):

Row 1 — UNREAD, status change:
  Title:    "Your report status updated to In Progress"
  Subtitle: "Block B, Room 204 — Fan not working"
  Time:     "2 hours ago"

Row 2 — UNREAD, confirmation:
  Title:    "3 more students confirmed your report"
  Subtitle: "Block A, Washroom F2 — Tap broken"
  Time:     "5 hours ago"

Row 3 — READ, acknowledged:
  Title:    "Staff acknowledged your report"
  Subtitle: "Campus, Main Gate — Garbage pile"
  Time:     "Yesterday"

Row 4 — READ, resolved:
  Title:    "Your report has been resolved"
  Subtitle: "Block C, Lab 301 — Projector issue"
  Time:     "Aug 26"
  → After this row, show a quiet "Leave Feedback" 
    text link in #16A34A (green), 12px, right side 
    of the row only for resolved notifications

Row 5 — READ, rejected:
  Title:    "Your report was marked as invalid"
  Subtitle: "Block B, Room 101 — Bench damaged · Reason: Issue not found on inspection"
  Time:     "Aug 20"
  → Subtitle shows the rejection reason in one line.
    Rejection reason text: #DC2626

Row 6 — READ, system:
  Title:    "Welcome to BMSIT&M CARE"
  Subtitle: "You can now report campus issues directly from your dashboard."
  Time:     "Aug 15"

Row 7 — READ, status change:
  Title:    "Your report status updated to Acknowledged"
  Subtitle: "Block D, Room 112 — Light not working"
  Time:     "Aug 14"

Row 8 — READ, resolved:
  Title:    "Your report has been resolved"
  Subtitle: "Block B, Lab 2 — AC not cooling"
  Time:     "Aug 10"

EMPTY STATE (create as a separate variant, 
for when there are no notifications):
  Centered in the card. 
  A simple grey bell icon, 40px.
  "No notifications yet" — Inter SemiBold 15px, #1C2333
  "You'll be notified when your reports are updated." 
  — Inter Regular 13px, #6B7280
  No illustration, no button.

════════════════════════════════════════════
SCREEN 2 — SETTINGS
════════════════════════════════════════════

Sidebar active state: "Settings" item highlighted.
Page title: "Settings"

── MAIN CONTENT ──────────────────────────

Two-column layout:
  Left column:  420px wide — settings form sections
  Right column: remaining width — account info card

LEFT COLUMN — Three stacked white cards, 
each 10px radius, 1px #E2E6EF border, 24px internal padding, 
24px gap between cards.

────────────────
CARD 1 — Profile
────────────────
Card heading: "Profile" — Inter SemiBold 16px, #1C2333
Thin #E2E6EF divider below the heading.

Fields (stacked, 16px gap between each):

  Full Name:
    Label: "Full Name" — Inter Medium 13px, #6B7280
    Input value: "Arjun Kumar"

  College Email:
    Label: "College Email" — Inter Medium 13px, #6B7280
    Input value: "arjun.kumar@bmsit.in"
    Below input: small note in #6B7280 12px — 
    "Your email cannot be changed."
    Input should appear slightly muted/disabled — 
    #F3F4F6 background, #9CA3AF text

  USN (University Seat Number):
    Label: "USN" — Inter Medium 13px, #6B7280
    Input value: "1BM22CS045"

All inputs:
  Height: 40px
  Border: 1px solid #E2E6EF
  Border-radius: 6px
  Padding: 0 12px
  Font: Inter Regular 14px, #1C2333
  Focus border: 1.5px solid #1A2B4A

"Save Changes" button at bottom of card:
  Background: #1A2B4A
  Color: #FFFFFF
  Font: Inter SemiBold 14px
  Border-radius: 6px
  Padding: 10px 24px
  Width: fit-content (not full width)

──────────────────────────────
CARD 2 — Notification Preferences
──────────────────────────────
Card heading: "Notification Preferences"
Thin divider below heading.

Four toggle rows (label left, toggle switch right).
Each row: 44px height, flex row, space-between.
1px #E2E6EF divider between rows (not after last).

Toggle row anatomy:
  Left:  Label (Inter Medium 14px, #1C2333) 
         + sub-label below it (Inter Regular 12px, #6B7280)
  Right: Toggle switch component
         ON state:  #1A2B4A track, white thumb
         OFF state: #E2E6EF track, white thumb

Row 1 — ON:
  Label:     "Status updates"
  Sub-label: "When your report moves to a new status"

Row 2 — ON:
  Label:     "Confirmations"
  Sub-label: "When others confirm your report"

Row 3 — ON:
  Label:     "Resolved notifications"
  Sub-label: "When your report is marked resolved or rejected"

Row 4 — OFF:
  Label:     "System announcements"
  Sub-label: "General updates from BMSIT&M CARE"

──────────────────────────
CARD 3 — Change Password
──────────────────────────
Card heading: "Change Password"
Thin divider below heading.

Fields:
  Current Password
  New Password
  Confirm New Password

All: same input style as Card 1, type="password" 
(show dots in the input value).

Below "Confirm New Password": 
  A quiet password rule line in #6B7280 12px — 
  "Minimum 8 characters."

"Update Password" button — same style as "Save Changes" 
in Card 1.

RIGHT COLUMN — One white card, same border/radius/padding.

────────────────────
ACCOUNT INFO CARD
────────────────────
Card heading: "Account" — Inter SemiBold 16px, #1C2333
Thin divider below heading.

Avatar block at top:
  A 64px circle, #1A2B4A background, white "AK" initials,
  Inter Bold 20px. Centered in this card.
  Below avatar: "Arjun Kumar" — Inter SemiBold 15px, 
  centered, #1C2333
  Below name: "arjun.kumar@bmsit.in" — Inter Regular 13px, 
  #6B7280, centered

Thin divider.

Info rows (label + value, space-between, 14px each,
20px gap between rows):
  Role:        Student
  USN:         1BM22CS045
  Member since: Aug 2025
  Reports filed: 9

Thin divider.

DANGER ZONE (bottom of this card):
  Small heading: "Danger Zone" — Inter SemiBold 13px, 
  #DC2626
  Below: "Delete Account" button —
    Background: transparent
    Border: 1px solid #DC2626
    Color: #DC2626
    Font: Inter Medium 13px
    Border-radius: 6px
    Padding: 8px 16px
    Width: full width of the card
  Below button: small note — "This will permanently 
  remove your account and all submitted reports." 
  Inter Regular 12px, #6B7280

════════════════════════════════════════════
DO NOT CHANGE
════════════════════════════════════════════
- The existing Dashboard, My Reports, 
  Report a Problem screens
- The sidebar structure, logo, nav items, Log out
- The topbar layout
- Any color tokens already in use
- The landing page