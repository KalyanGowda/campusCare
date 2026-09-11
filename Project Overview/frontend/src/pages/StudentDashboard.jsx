import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Plus, Clock } from "lucide-react";
import { clsx } from "clsx";
import { apiFetch } from "../api";
export function StudentDashboard() {
    const [reports, setReports] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        Promise.all([
            apiFetch('/api/auth/me').then(r => r.json()),
            apiFetch('/api/reports/my').then(r => r.json()),
        ]).then(([userData, reportsData]) => {
            setUser(userData);
            setReports(Array.isArray(reportsData) ? reportsData : []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);
    const open = reports.filter(r => r.status === 'Open').length;
    const inProgress = reports.filter(r => r.status === 'In Progress').length;
    const resolved = reports.filter(r => r.status === 'Resolved').length;
    const recent = reports.slice(0, 5);
    const formatLocation = (r) => {
        const room = r.room_number ? `, Room ${r.room_number}` : r.landmark_name ? `, ${r.landmark_name}` : '';
        return `${r.block_name}${room}`;
    };
    const formatDate = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const getStatusClasses = (status) => {
        switch (status) {
            case "Open": return "bg-open-grey/10 text-open-grey";
            case "Acknowledged": return "bg-info/10 text-info";
            case "In Progress": return "bg-warning/20 text-warning";
            case "Resolved": return "bg-success/20 text-success";
            case "Rejected": return "bg-danger/10 text-danger";
            default: return "bg-page-bg text-ink";
        }
    };
    return (<div className="flex gap-8">
      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Welcome Banner */}
        <div className="w-full bg-navy rounded-xl p-6 text-white shadow-sm flex flex-col gap-2">
          <h2 className="text-xl font-semibold">
            {loading ? 'Welcome back.' : `Good ${getGreeting()}, ${user?.name?.split(' ')[0] ?? 'there'}.`}
          </h2>
          <p className="text-white/80">
            {loading ? '…' : open === 0 ? 'No open reports right now.' : `You have ${open} open report${open !== 1 ? 's' : ''}.`}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Open Reports", count: open },
            { label: "In Progress", count: inProgress },
            { label: "Resolved", count: resolved },
        ].map((stat, i) => (<div key={i} className="bg-white rounded-[10px] p-5 shadow-sm border border-line flex flex-col gap-1">
              <span className="font-bold text-[28px] text-navy leading-none">{loading ? '–' : stat.count}</span>
              <span className="text-sm font-medium text-ink-muted">{stat.label}</span>
            </div>))}
        </div>

        {/* Recent Reports table */}
        <div className="bg-white rounded-xl shadow-sm border border-line overflow-hidden mt-2">
          <div className="p-5 border-b border-line flex justify-between items-center bg-white">
            <h3 className="font-semibold text-ink text-[15px]">My Recent Reports</h3>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-line bg-page-bg/50">
                <th className="py-3 px-5 text-xs font-semibold text-ink-muted uppercase tracking-wider">Location</th>
                <th className="py-3 px-5 text-xs font-semibold text-ink-muted uppercase tracking-wider">Category</th>
                <th className="py-3 px-5 text-xs font-semibold text-ink-muted uppercase tracking-wider">Status</th>
                <th className="py-3 px-5 text-xs font-semibold text-ink-muted uppercase tracking-wider">Date Submitted</th>
                <th className="py-3 px-5 text-xs font-semibold text-ink-muted uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (<tr><td colSpan={5} className="py-10 text-center text-sm text-ink-muted">Loading…</td></tr>) : recent.length === 0 ? (<tr><td colSpan={5} className="py-10 text-center text-sm text-ink-muted">No reports yet. Submit your first one!</td></tr>) : (recent.map((report) => (<tr key={report.id} className="hover:bg-page-bg/30 transition-colors">
                    <td className="py-3 px-5 text-sm font-medium text-ink">{formatLocation(report)}</td>
                    <td className="py-3 px-5 text-sm text-ink-muted">{report.sub_type}</td>
                    <td className="py-3 px-5">
                      <span className={clsx("px-2 py-1 rounded-[4px] text-[12px] font-medium leading-none inline-block", getStatusClasses(report.status))}>
                        {report.status}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-sm text-ink-muted">{formatDate(report.created_at)}</td>
                    <td className="py-3 px-5 text-right">
                      <Link to="/student/reports" className="text-sm font-medium text-navy hover:underline">View</Link>
                    </td>
                  </tr>)))}
            </tbody>
          </table>

          <div className="p-4 bg-page-bg/30 border-t border-line text-center">
            <Link to="/student/reports" className="text-sm font-semibold text-navy hover:underline">
              View all reports →
            </Link>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-[320px] flex flex-col gap-6 shrink-0">
        <div className="bg-navy rounded-xl p-6 text-white shadow-sm flex flex-col items-center text-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
            <Plus className="w-6 h-6 text-accent"/>
          </div>
          <p className="text-sm font-medium text-white/90">Tap to report a new issue.</p>
          <Link to="/student/report" className="w-full bg-accent hover:bg-[#D98E16] text-navy font-semibold py-2.5 rounded-md transition-colors">
            Report Problem
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-line p-5">
          <h3 className="font-semibold text-ink text-[15px] mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-ink-muted"/> Recent Activity
          </h3>

          {loading ? (<p className="text-sm text-ink-muted">Loading…</p>) : reports.length === 0 ? (<p className="text-sm text-ink-muted">No activity yet.</p>) : (<div className="flex flex-col gap-4 relative">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-line"></div>
              {reports.slice(0, 4).map((r) => (<div key={r.id} className="flex gap-3 relative z-10">
                  <div className="w-3.5 h-3.5 rounded-full bg-page-bg border-2 border-white shadow-sm mt-0.5 shrink-0"></div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm text-ink">{r.sub_type} — {r.status}</p>
                    <span className="text-[11px] text-ink-muted">{formatDate(r.created_at)}</span>
                  </div>
                </div>))}
            </div>)}
        </div>
      </div>
    </div>);
}
function getGreeting() {
    const h = new Date().getHours();
    if (h < 12)
        return 'morning';
    if (h < 17)
        return 'afternoon';
    return 'evening';
}
