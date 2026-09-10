import { FormEvent, useEffect, useState } from "react"
import { clsx } from "clsx"
import { apiFetch } from "../api"

interface UserData {
  id: number
  name: string
  email: string
  role: string
  created_at: string
}

function Toggle({ enabled, onChange, label }: { enabled: boolean; onChange: () => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={enabled} aria-label={label} onClick={onChange}
      className={clsx("relative h-5 w-9 rounded-full transition-colors", enabled ? "bg-navy" : "bg-line")}>
      <span className={clsx("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform", enabled ? "translate-x-[18px]" : "translate-x-0.5")} />
    </button>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[10px] border border-line bg-white p-6 shadow-sm">
      <h2 className="border-b border-line pb-4 text-base font-semibold text-ink">{title}</h2>
      {children}
    </section>
  )
}

export function Settings() {
  const [user, setUser] = useState<UserData | null>(null)
  const [name, setName] = useState("")
  const [preferences, setPreferences] = useState([true, true, true, false])
  const [profileSaved, setProfileSaved] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [reportCount, setReportCount] = useState<number | null>(null)

  useEffect(() => {
    apiFetch('/api/auth/me').then(r => r.json()).then(data => {
      setUser(data)
      setName(data.name ?? "")
    })
    apiFetch('/api/reports/my').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setReportCount(data.length)
    })
  }, [])

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault()
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 3000)
  }

  const savePassword = async (e: FormEvent) => {
    e.preventDefault()
    setPasswordError("")
    if (newPassword !== confirmPassword) { setPasswordError("Passwords don't match."); return }
    if (newPassword.length < 8) { setPasswordError("Minimum 8 characters."); return }
    setPasswordSaved(true)
    setTimeout(() => setPasswordSaved(false), 3000)
  }

  const getInitials = (n: string) => n.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase()

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
    : "—"

  const preferenceRows = [
    ["Status updates",          "When your report moves to a new status"],
    ["Confirmations",           "When others confirm your report"],
    ["Resolved notifications",  "When your report is marked resolved or rejected"],
    ["System announcements",    "General updates from BMSIT&M CARE"],
  ]

  return (
    <div className="grid max-w-[1200px] grid-cols-1 gap-6 xl:grid-cols-[420px_minmax(0,1fr)] xl:items-start">
      <div className="flex flex-col gap-6">
        {/* Profile */}
        <Section title="Profile">
          <form className="mt-5 space-y-4" onSubmit={saveProfile}>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium text-ink-muted">Full Name</span>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                className="h-10 w-full rounded-md border border-line px-3 text-sm text-ink outline-none focus:border-[1.5px] focus:border-navy" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium text-ink-muted">College Email</span>
              <input type="email" value={user?.email ?? ""} disabled
                className="h-10 w-full rounded-md border border-line px-3 text-sm bg-[#F3F4F6] text-[#9CA3AF] outline-none" />
              <span className="mt-1.5 block text-xs text-ink-muted">Your email cannot be changed.</span>
            </label>
            <div className="flex items-center gap-3 pt-1">
              <button className="rounded-md bg-navy px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-deep">
                Save Changes
              </button>
              {profileSaved && <span className="text-xs font-medium text-success">Changes saved</span>}
            </div>
          </form>
        </Section>

        {/* Notification Preferences */}
        <Section title="Notification Preferences">
          <div className="mt-2">
            {preferenceRows.map(([label, description], index) => (
              <div key={label} className={clsx("flex min-h-11 items-center justify-between gap-4 py-3", index !== preferenceRows.length - 1 && "border-b border-line")}>
                <div>
                  <p className="text-sm font-medium text-ink">{label}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">{description}</p>
                </div>
                <Toggle label={label} enabled={preferences[index]}
                  onChange={() => setPreferences(v => v.map((val, i) => i === index ? !val : val))} />
              </div>
            ))}
          </div>
        </Section>

        {/* Change Password */}
        <Section title="Change Password">
          <form className="mt-5 space-y-4" onSubmit={savePassword}>
            {[
              { label: "Current Password", val: currentPassword, set: setCurrentPassword },
              { label: "New Password",     val: newPassword,     set: setNewPassword },
              { label: "Confirm New Password", val: confirmPassword, set: setConfirmPassword },
            ].map(f => (
              <label key={f.label} className="block">
                <span className="mb-1.5 block text-[13px] font-medium text-ink-muted">{f.label}</span>
                <input type="password" value={f.val} onChange={e => f.set(e.target.value)}
                  className="h-10 w-full rounded-md border border-line px-3 text-sm text-ink outline-none focus:border-[1.5px] focus:border-navy" />
              </label>
            ))}
            {passwordError && <p className="text-xs text-danger">{passwordError}</p>}
            <div className="flex items-center gap-3 pt-1">
              <button className="rounded-md bg-navy px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-deep">
                Update Password
              </button>
              {passwordSaved && <span className="text-xs font-medium text-success">Password updated</span>}
            </div>
          </form>
        </Section>
      </div>

      {/* Account Card */}
      <Section title="Account">
        <div className="py-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-navy text-xl font-bold text-white">
            {user ? getInitials(user.name) : "…"}
          </div>
          <p className="mt-3 text-[15px] font-semibold text-ink">{user?.name ?? "…"}</p>
          <p className="mt-1 text-[13px] text-ink-muted">{user?.email ?? ""}</p>
        </div>
        <div className="border-y border-line py-5 space-y-5">
          {[
            ["Role",          user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "—"],
            ["Member since",  memberSince],
            ["Reports filed", reportCount !== null ? String(reportCount) : "…"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4 text-sm">
              <span className="text-ink-muted">{label}</span>
              <span className="font-medium text-ink">{value}</span>
            </div>
          ))}
        </div>
        <div className="pt-5">
          <h3 className="text-[13px] font-semibold text-danger">Danger Zone</h3>
          <button type="button"
            className="mt-3 w-full rounded-md border border-danger px-4 py-2 text-[13px] font-medium text-danger transition-colors hover:bg-danger/5">
            Delete Account
          </button>
          <p className="mt-2 text-xs text-ink-muted">This will permanently remove your account and all submitted reports.</p>
        </div>
      </Section>
    </div>
  )
}
