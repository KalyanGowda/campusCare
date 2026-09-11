import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter, Navigate } from "react-router";
import "./index.css";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { StudentLayout } from "./layouts/StudentLayout";
import { StudentDashboard } from "./pages/StudentDashboard";
import { ReportProblem } from "./pages/ReportProblem";
import { MyReports } from "./pages/MyReports";
import { Notifications } from "./pages/Notifications";
import { Settings } from "./pages/Settings";
import { StaffLayout } from "./layouts/StaffLayout";
import { StaffDashboard } from "./pages/StaffDashboard";
import { StaffQueue } from "./pages/StaffQueue";
import { StaffReportDetail } from "./pages/StaffReportDetail";
import { StaffReports } from "./pages/StaffReports";
import { StaffSettings } from "./pages/StaffSettings";
import { AdminLayout } from "./layouts/AdminLayout";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminAllReports } from "./pages/AdminAllReports";
import { AdminReportDetail } from "./pages/AdminReportDetail";
import { AdminBlockRatings } from "./pages/AdminBlockRatings";
import { AdminStaffManagement } from "./pages/AdminStaffManagement";
import { AdminAnalytics } from "./pages/AdminAnalytics";
import { AdminSettings } from "./pages/AdminSettings";
const router = createBrowserRouter([
    { path: "/", element: <Landing /> },
    { path: "/login", element: <Login /> },
    {
        path: "/student",
        element: <StudentLayout />,
        children: [
            { index: true, element: <StudentDashboard /> },
            { path: "report", element: <ReportProblem /> },
            { path: "reports", element: <MyReports /> },
            { path: "notifications", element: <Notifications /> },
            { path: "settings", element: <Settings /> },
        ],
    },
    {
        path: "/staff",
        element: <StaffLayout />,
        children: [
            { index: true, element: <StaffDashboard /> },
            { path: "queue", element: <StaffQueue /> },
            { path: "reports", element: <StaffReports /> },
            { path: "report/:id", element: <StaffReportDetail /> },
            { path: "settings", element: <StaffSettings /> }
        ],
    },
    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            { index: true, element: <AdminDashboard /> },
            { path: "reports", element: <AdminAllReports /> },
            { path: "reports/:id", element: <AdminReportDetail /> },
            { path: "ratings", element: <AdminBlockRatings /> },
            { path: "staff", element: <AdminStaffManagement /> },
            { path: "analytics", element: <AdminAnalytics /> },
            { path: "settings", element: <AdminSettings /> }
        ],
    },
]);
createRoot(document.getElementById("root")).render(<StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>);
