import { Link, useLocation, useNavigate } from "react-router"
import { LogOut, Bell } from "lucide-react"
import { clsx } from "clsx"
import { ReactNode, useEffect, useState } from "react"
import { apiFetch } from "../api"

interface NavItem {
  label: string
  icon: React.ElementType
  path: string
  highlight?: boolean
}

interface DashboardShellProps {
  role: "Student" | "Staff" | "Admin"
  userName?: string        // optional — overridden by session data
  userLabel?: string
  navItems: NavItem[]
  children: ReactNode
  pageTitle: string
}

export function DashboardShell({
  role,
  userName: userNameProp,
  userLabel: userLabelProp,
  navItems,
  children,
  pageTitle,
}: DashboardShellProps) {
  const location = useLocation()
  const navigate  = useNavigate()
  const [userName,  setUserName]  = useState(userNameProp ?? "…")
  const [userLabel, setUserLabel] = useState(userLabelProp ?? "")

  // Fetch the real logged-in user on mount
  useEffect(() => {
    apiFetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data?.name) setUserName(data.name)
        // For staff show their block name as the sub-label
        if (data?.role === 'staff' && data?.block_id) {
          setUserLabel(`Block incharge`)
        }
      })
      .catch(() => {})
  }, [])

  const handleLogout = async () => {
    await apiFetch('/api/auth/logout', { method: 'POST' })
    navigate('/login')
  }

  const getInitials = (name: string) =>
    name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()

  return (
    <div className="flex h-screen w-full font-sans bg-page-bg overflow-hidden">
      {/* Sidebar */}
      <div className="w-[220px] bg-navy flex flex-col h-full shrink-0">
        <div className="h-16 flex items-center px-6 gap-3 mb-6 shrink-0">
          <div className="w-8 h-8 bg-white text-navy font-bold flex items-center justify-center rounded-sm">C</div>
          <span className="font-bold text-white tracking-wide text-lg">CARE</span>
        </div>

        <nav className="flex-1 px-3 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.path.endsWith('/')
              ? location.pathname === item.path
              : location.pathname === item.path || location.pathname.startsWith(item.path + '/')
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all",
                  isActive
                    ? "bg-navy-deep text-white shadow-inner"
                    : item.highlight
                      ? "text-accent hover:bg-navy-deep"
                      : "text-white/70 hover:text-white hover:bg-navy-deep",
                )}
              >
                {isActive && (
                  <div className="absolute left-0 w-[3px] h-8 bg-accent rounded-r-full" />
                )}
                <Icon className={clsx("w-4 h-4", isActive ? "text-accent" : "")} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-white/70 hover:text-white hover:bg-navy-deep transition-all"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 bg-white border-b border-line flex items-center justify-between px-8 shrink-0 z-10">
          <h1 className="text-[22px] font-semibold text-navy">{pageTitle}</h1>
          <div className="flex items-center gap-6">
            <button className="text-ink-muted hover:text-navy relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-danger rounded-full ring-2 ring-white"></span>
            </button>
            <div className="w-px h-6 bg-line"></div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold text-navy">{userName}</span>
                {userLabel && <span className="text-xs text-ink-muted">{userLabel}</span>}
              </div>
              <div className="w-9 h-9 rounded-full bg-page-bg border border-line flex items-center justify-center text-sm font-medium text-navy">
                {getInitials(userName)}
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1200px] w-full">{children}</div>
        </div>
      </div>
    </div>
  )
}
