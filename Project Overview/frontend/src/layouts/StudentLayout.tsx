import { Outlet, useLocation } from "react-router"
import { Home, PlusCircle, ListTodo, Bell, Settings } from "lucide-react"
import { DashboardShell } from "../components/DashboardShell"

export function StudentLayout() {
  const location = useLocation()

  const getPageTitle = () => {
    if (location.pathname === "/student/report") return "Report a Problem"
    if (location.pathname === "/student/reports") return "My Reports"
    if (location.pathname === "/student/notifications") return "Notifications"
    if (location.pathname === "/student/settings") return "Settings"
    return "Dashboard"
  }

  return (
    <DashboardShell
      role="Student"
      userName="Arjun Kumar"
      pageTitle={getPageTitle()}
      navItems={[
        { label: "Dashboard", icon: Home, path: "/student" },
        {
          label: "Report a Problem",
          icon: PlusCircle,
          path: "/student/report",
          highlight: true,
        },
        { label: "My Reports", icon: ListTodo, path: "/student/reports" },
        { label: "Notifications", icon: Bell, path: "/student/notifications" },
        { label: "Settings", icon: Settings, path: "/student/settings" },
      ]}
    >
      <Outlet />
    </DashboardShell>
  )
}
