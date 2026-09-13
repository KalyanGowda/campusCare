import { Outlet, useLocation } from "react-router";
import { Home, LayoutList, FileText, Settings } from "lucide-react";
import { DashboardShell } from "../components/DashboardShell";
export function StaffLayout() {
    const location = useLocation();
    const getPageTitle = () => {
        if (location.pathname.startsWith("/staff/queue"))
            return "My Queue";
        if (location.pathname.startsWith("/staff/reports"))
            return "Report Detail";
        if (location.pathname === "/staff/settings")
            return "Settings";
        return "Dashboard";
    };
    return (<DashboardShell role="Staff" userName="Ravi Kumar" userLabel="Block B Incharge" pageTitle={getPageTitle()} navItems={[
            { label: "Dashboard", icon: Home, path: "/staff" },
            { label: "My Queue", icon: LayoutList, path: "/staff/queue" },
            { label: "Report Detail", icon: FileText, path: "/staff/reports" },
            { label: "Settings", icon: Settings, path: "/staff/settings" },
        ]}>
      <Outlet />
    </DashboardShell>);
}
