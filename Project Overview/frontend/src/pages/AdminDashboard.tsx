import { useEffect, useState } from "react"
import { apiFetch } from "../api"

interface Analytics {
  total_this_month: number
  by_status: { resolved: number; open: number; in_progress: number }
  escalated_count: number
  avg_resolution_hours: number
}

export function AdminDashboard() {
  const [data, setData] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch('/api/admin/analytics')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const fmt = (n: number | undefined) => loading || n === undefined ? '–' : String(n)

  const avgDays = data ? (data.avg_resolution_hours / 24).toFixed(1) + 'd' : '–'

  return (
    <div className="flex flex-col gap-6">
      <div className="w-full bg-navy rounded-xl p-6 text-white shadow-sm flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Admin Dashboard</h2>
        <p className="text-white/80">Campus-wide overview and analytics.</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Open Reports",      value: fmt(data?.by_status?.open) },
          { label: "Resolved This Month",     value: fmt(data?.by_status?.resolved) },
          { label: "Currently Escalated",     value: fmt(data?.escalated_count) },
          { label: "Avg. Resolution Time",    value: loading ? '–' : avgDays },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-[10px] p-5 shadow-sm border border-line flex flex-col gap-1">
            <span className="font-bold text-[28px] text-navy leading-none">{stat.value}</span>
            <span className="text-sm font-medium text-ink-muted">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
