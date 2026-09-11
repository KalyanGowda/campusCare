import { useEffect, useState } from "react";
import { apiFetch } from "../api";
export function StaffDashboard() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        apiFetch('/api/staff/queue')
            .then(r => r.json())
            .then(data => { setReports(Array.isArray(data) ? data : []); })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);
    const count = (status) => reports.filter(r => r.status === status).length;
    return (<div className="flex flex-col gap-6">
      <div className="w-full bg-navy rounded-xl p-6 text-white shadow-sm flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Staff Dashboard</h2>
        <p className="text-white/80">Manage your block's queue and resolve issues.</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
            { label: "Open", value: loading ? '–' : count('Open') },
            { label: "Acknowledged", value: loading ? '–' : count('Acknowledged') },
            { label: "In Progress", value: loading ? '–' : count('In Progress') },
            { label: "Resolved this month", value: loading ? '–' : count('Resolved') },
        ].map((stat, i) => (<div key={i} className="bg-white rounded-[10px] p-5 shadow-sm border border-line flex flex-col gap-1">
            <span className="font-bold text-[28px] text-navy leading-none">{stat.value}</span>
            <span className="text-sm font-medium text-ink-muted">{stat.label}</span>
          </div>))}
      </div>
    </div>);
}
