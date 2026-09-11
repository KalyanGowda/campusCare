import { FormEvent, useEffect, useState } from "react";
import { clsx } from "clsx";
import { apiFetch } from "../api";
function Toggle({ enabled, onChange, label }) {
    return (<button type="button" role="switch" aria-checked={enabled} aria-label={label} onClick={onChange} className={clsx("relative h-5 w-9 rounded-full transition-colors", enabled ? "bg-navy" : "bg-line")}>
      <span className={clsx("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform", enabled ? "translate-x-[18px]" : "translate-x-0.5")}/>
    </button>);
}
function Section({ title, children }) {
    return (<section className="rounded-[10px] border border-line bg-white p-6 shadow-sm">
      <h2 className="border-b border-line pb-4 text-base font-semibold text-ink">{title}</h2>
      {children}
    </section>);
}
export function AdminSettings() {
    const [user, setUser] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [staffCount, setStaffCount] = useState(null);
    const [preferences, setPreferences] = useState([true, true, true, true, false]);
    const [profileSaved, setProfileSaved] = useState(false);
    const [passwordSaved, setPasswordSaved] = useState(false);
    const [slaSaved, setSlaSaved] = useState(false);
    const [currentPw, setCurrentPw] = useState("");
    const [newPw, setNewPw] = useState("");
    const [confirmPw, setConfirmPw] = useState("");
    const [pwError, setPwError] = useState("");
    useEffect(() => {
        apiFetch('/api/auth/me').then(r => r.json()).then(setUser);
        apiFetch('/api/admin/analytics').then(r => r.json()).then(setAnalytics).catch(() => { });
        apiFetch('/api/admin/staff').then(r => r.json()).then(data => {
            if (Array.isArray(data))
                setStaffCount(data.length);
        }).catch(() => { });
    }, []);
    const getInitials = (n) => n.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase();
    const saveProfile = (e) => { e.preventDefault(); setProfileSaved(true); setTimeout(() => setProfileSaved(false), 3000); };
    const savePassword = (e) => {
        e.preventDefault();
        setPwError("");
        if (newPw !== confirmPw) {
            setPwError("Passwords don't match.");
            return;
        }
        if (newPw.length < 8) {
            setPwError("Minimum 8 characters.");
            return;
        }
        setPasswordSaved(true);
        setTimeout(() => setPasswordSaved(false), 3000);
    };
    const saveSla = (e) => { e.preventDefault(); setSlaSaved(true); setTimeout(() => setSlaSaved(false), 3000); };
    const preferenceRows = [
        ["SLA breach alerts", "When any report goes overdue across any block"],
        ["New campus-area reports", "Reports submitted for open campus areas"],
        ["Block rating drops", "When a block's rating falls below 70"],
        ["Staff account activity", "When a staff account is created or removed"],
        ["Daily summary digest", "A daily summary with open report counts and escalations"],
    ];
    const slaRows = [
        { label: "Electrical Issue", value: "24" },
        { label: "Furniture Damage", value: "48" },
        { label: "Washroom Issues", value: "12" },
        { label: "Projector & AC", value: "36" },
        { label: "Campus Area / Others", value: "72" },
    ];
    return (<div className="grid max-w-[1200px] grid-cols-1 gap-6 xl:grid-cols-[420px_minmax(0,1fr)] xl:items-start">
      <div className="flex flex-col gap-6">
        <Section title="Profile">
          <form className="mt-5 space-y-4" onSubmit={saveProfile}>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium text-ink-muted">Full Name</span>
              <input type="text" defaultValue={user?.name ?? ""} key={user?.name} className="h-10 w-full rounded-md border border-line px-3 text-sm text-ink outline-none focus:border-[1.5px] focus:border-navy"/>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium text-ink-muted">Email</span>
              <input type="email" value={user?.email ?? ""} disabled className="h-10 w-full rounded-md border border-line px-3 text-sm bg-[#F3F4F6] text-[#9CA3AF] outline-none"/>
              <span className="mt-1.5 block text-xs text-ink-muted">Admin email cannot be changed.</span>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium text-ink-muted">Institution</span>
              <input type="text" value="BMSIT&M" disabled className="h-10 w-full rounded-md border border-line px-3 text-sm bg-[#F3F4F6] text-[#9CA3AF] outline-none"/>
            </label>
            <div className="flex items-center gap-3 pt-1">
              <button className="rounded-md bg-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep transition-colors">Save Changes</button>
              {profileSaved && <span className="text-xs font-medium text-success">Changes saved</span>}
            </div>
          </form>
        </Section>

        <Section title="Notification Preferences">
          <div className="mt-2">
            {preferenceRows.map(([label, description], i) => (<div key={label} className={clsx("flex min-h-11 items-center justify-between gap-4 py-3", i !== preferenceRows.length - 1 && "border-b border-line")}>
                <div>
                  <p className="text-sm font-medium text-ink">{label}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">{description}</p>
                </div>
                <Toggle label={label} enabled={preferences[i]} onChange={() => setPreferences(v => v.map((val, idx) => idx === i ? !val : val))}/>
              </div>))}
          </div>
        </Section>

        {/* SLA Configuration */}
        <div className="rounded-[10px] border border-[#E2E6EF] bg-white p-6 shadow-sm">
          <h2 className="text-[16px] font-semibold text-[#1C2333]">SLA Target Times</h2>
          <p className="text-[12px] text-[#6B7280] mt-1 mb-4">Tickets not resolved within these times are auto-escalated.</p>
          <div className="h-px bg-[#E2E6EF] mb-4"/>
          <form onSubmit={saveSla}>
            <div className="flex flex-col mb-6">
              {slaRows.map((row, i) => (<div key={row.label} className={clsx("flex justify-between items-center h-[44px]", i !== slaRows.length - 1 && "border-b border-[#E2E6EF]")}>
                  <span className="text-[14px] text-[#1C2333]">{row.label}</span>
                  <div className="flex items-center gap-2">
                    <input type="text" defaultValue={row.value} className="w-[64px] h-[36px] rounded-md border border-[#E2E6EF] text-center text-[14px] font-semibold text-[#1C2333] focus:outline-none focus:border-navy"/>
                    <span className="text-[13px] text-[#6B7280] w-[40px]">hours</span>
                  </div>
                </div>))}
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-md bg-[#1A2B4A] px-6 py-2.5 text-[14px] font-semibold text-white hover:opacity-90 transition-opacity">Save SLA Settings</button>
              {slaSaved && <span className="text-[12px] font-medium text-[#16A34A]">Settings saved</span>}
            </div>
          </form>
        </div>

        <Section title="Change Password">
          <form className="mt-5 space-y-4" onSubmit={savePassword}>
            {[
            { label: "Current Password", val: currentPw, set: setCurrentPw },
            { label: "New Password", val: newPw, set: setNewPw },
            { label: "Confirm New Password", val: confirmPw, set: setConfirmPw },
        ].map(f => (<label key={f.label} className="block">
                <span className="mb-1.5 block text-[13px] font-medium text-ink-muted">{f.label}</span>
                <input type="password" value={f.val} onChange={e => f.set(e.target.value)} className="h-10 w-full rounded-md border border-line px-3 text-sm text-ink outline-none focus:border-[1.5px] focus:border-navy"/>
              </label>))}
            {pwError && <p className="text-xs text-danger">{pwError}</p>}
            <div className="flex items-center gap-3 pt-1">
              <button className="rounded-md bg-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep transition-colors">Update Password</button>
              {passwordSaved && <span className="text-xs font-medium text-success">Password updated</span>}
            </div>
          </form>
        </Section>
      </div>

      {/* Account Card */}
      <div className="rounded-[10px] border border-line bg-white p-5 shadow-sm">
        <h2 className="text-[16px] font-semibold text-[#1C2333] mb-4">Account</h2>
        <div className="h-px bg-[#E2E6EF] mb-6"/>
        <div className="text-center mb-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#1A2B4A] text-[24px] font-bold text-white mb-3">
            {user ? getInitials(user.name) : "…"}
          </div>
          <p className="text-[15px] font-semibold text-ink">{user?.name ?? "…"}</p>
          <p className="text-[13px] text-[#6B7280] mt-1">{user?.email ?? ""}</p>
          <p className="text-[12px] text-[#6B7280] mt-1">BMSIT&amp;M</p>
        </div>
        <div className="h-px bg-[#E2E6EF] mb-5"/>
        <div className="space-y-4 mb-5">
          {[
            ["Role", "Administrator"],
            ["Institution", "BMSIT&M"],
            ["Access level", "Full campus access"],
        ].map(([label, value]) => (<div key={label} className="flex items-center justify-between text-sm">
              <span className="text-[#6B7280]">{label}</span>
              <span className="font-medium text-ink text-right">{value}</span>
            </div>))}
        </div>
        <div className="h-px bg-[#E2E6EF] mb-5"/>
        <div className="bg-[#F0F2F7] rounded-lg p-3.5">
          <p className="text-[12px] font-medium text-[#6B7280] mb-4">System Overview</p>
          <div className="space-y-4">
            {[
            ["Active staff accounts", staffCount !== null ? String(staffCount) : "…"],
            ["Blocks monitored", "6"],
            ["Reports this month", analytics ? String(analytics.total_this_month) : "…"],
        ].map(([label, value]) => (<div key={label} className="flex items-center justify-between">
                <span className="text-[14px] text-[#1C2333]">{label}</span>
                <span className="text-[14px] font-medium text-[#1C2333]">{value}</span>
              </div>))}
          </div>
        </div>
      </div>
    </div>);
}
