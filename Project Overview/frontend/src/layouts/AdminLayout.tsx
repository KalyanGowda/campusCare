import { Outlet, useLocation } from "react-router"
import { Home, List, BarChart3, Users, PieChart, Settings } from "lucide-react"
import { DashboardShell } from "../components/DashboardShell"

export function AdminLayout() {
  const location = useLocation()

  const getPageTitle = () => {
    return "Dashboard"
  }

  return (
    <DashboardShell
      role="Admin"
      userName="Admin"
      userLabel="BMSIT&M"
      pageTitle={getPageTitle()}
      navItems={[
        { label: "Dashboard", icon: Home, path: "/admin" },
        { label: "All Reports", icon: List, path: "/admin/reports" },
        { label: "Block Ratings", icon: BarChart3, path: "/admin/ratings" },
        { label: "Staff Management", icon: Users, path: "/admin/staff" },
        { label: "Analytics", icon: PieChart, path: "/admin/analytics" },
        { label: "Settings", icon: Settings, path: "/admin/settings" },
      ]}
    >
      <Outlet />
    </DashboardShell>
  )
}
