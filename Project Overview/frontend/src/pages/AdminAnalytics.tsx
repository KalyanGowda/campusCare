import { useEffect, useState } from "react"
import { apiFetch } from "../api"

interface Analytics {
  by_block:    { block_name: string; count: number }[]
  by_category: { sub_type: string; count: number }[]
  by_status:   { open: number; acknowledged: number; in_progress: number; resolved: number; rejected: number }
  total_this_month: number
  avg_resolution_hours: number
  escalated_count: number
}

export function AdminAnalytics() {
  const [data, setData] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch('/api/admin/analytics')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-sm text-ink-muted p-6">Loading analytics…</p>
  if (!data)   return <p className="text-sm text-danger p-6">Failed to load analytics.</p>

  const total     = data.total_this_month || 0
  const resolved  = data.by_status.resolved || 0
  const active    = (data.by_status.open || 0) + (data.by_status.acknowledged || 0) + (data.by_status.in_progress || 0)
  const rejected  = data.by_status.rejected || 0
  const avgDays   = data.avg_resolution_hours ? (data.avg_resolution_hours / 24).toFixed(1) + ' days' : '—'

  const maxBlock    = Math.max(...data.by_block.map(b => b.count), 1)
  const maxCategory = Math.max(...data.by_category.map(c => c.count), 1)

  const now = new Date()
  const monthLabel = now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  return (
    <div className="flex flex-col min-w-0 max-w-full gap-5">
      <div className="flex justify-between items-center mb-1">
        <div>
          <h2 className="text-[18px] font-semibold text-[#1C2333] font-inter">Campus Analytics</h2>
          <p className="text-[13px] text-[#6B7280] font-inter font-normal mt-1">BMSIT&M · {monthLabel}</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Reports",         count: total },
          { label: "Resolved",              count: resolved },
          { label: "Avg Resolution Time",   count: avgDays },
          { label: "SLA Breaches",          count: data.escalated_count },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-[10px] p-5 shadow-sm border border-line flex flex-col gap-1">
            <span className="font-bold text-[28px] text-navy leading-none">{stat.count}</span>
            <span className="text-sm font-medium text-ink-muted mt-1">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-1">
        {/* Most Reported Block */}
        <div className="bg-white rounded-[10px] border border-[#E2E6EF] p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[15px] font-semibold text-[#1C2333] font-inter">Most Reported Block</h3>
          </div>
          {data.by_block.length === 0 ? (
            <p className="text-sm text-[#6B7280]">No data yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {data.by_block.map(row => (
                <div key={row.block_name} className="flex items-center">
                  <div className="w-[80px] flex-shrink-0 text-[13px] font-medium text-[#1C2333]">{row.block_name}</div>
                  <div className="flex-grow">
                    <div className="h-[28px] bg-[#1A2B4A] rounded-[4px]" style={{ width: `${(row.count / maxBlock) * 100}%` }} />
                  </div>
                  <div className="w-[40px] flex-shrink-0 text-right text-[13px] font-semibold text-[#1C2333]">{row.count}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Most Reported Category */}
        <div className="bg-white rounded-[10px] border border-[#E2E6EF] p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[15px] font-semibold text-[#1C2333] font-inter">Most Reported Category</h3>
          </div>
          {data.by_category.length === 0 ? (
            <p className="text-sm text-[#6B7280]">No data yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {data.by_category.map(row => (
                <div key={row.sub_type} className="flex items-center">
                  <div className="w-[130px] flex-shrink-0 text-[13px] font-medium text-[#1C2333] truncate pr-2">{row.sub_type || 'Other'}</div>
                  <div className="flex-grow">
                    <div className="h-[28px] bg-[#E8A020] rounded-[4px]" style={{ width: `${(row.count / maxCategory) * 100}%` }} />
                  </div>
                  <div className="w-[40px] flex-shrink-0 text-right text-[13px] font-semibold text-[#1C2333]">{row.count}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Breakdown */}
        <div className="bg-white rounded-[10px] border border-[#E2E6EF] p-5 lg:col-span-2">
          <div className="mb-6">
            <h3 className="text-[15px] font-semibold text-[#1C2333] font-inter">Report Status Breakdown — {monthLabel}</h3>
            <p className="text-[13px] text-[#6B7280] font-inter mt-1">{total} total reports this month</p>
          </div>
          {total === 0 ? (
            <p className="text-sm text-[#6B7280]">No reports this month yet.</p>
          ) : (
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="w-[200px] h-[200px] rounded-full relative flex-shrink-0 flex items-center justify-center"
                style={{
                  background: total > 0
                    ? `conic-gradient(#16A34A 0% ${resolved/total*100}%, #1A2B4A ${resolved/total*100}% ${(resolved+active)/total*100}%, #DC2626 ${(resolved+active)/total*100}% 100%)`
                    : '#E2E6EF'
                }}>
                <div className="w-[140px] h-[140px] bg-white rounded-full flex flex-col items-center justify-center">
                  <span className="text-[28px] font-bold text-[#1C2333] leading-tight">{total}</span>
                  <span className="text-[12px] text-[#6B7280]">reports</span>
                </div>
              </div>
              <div className="flex-grow w-full max-w-md">
                <div className="flex flex-col gap-6">
                  {[
                    { color: "bg-[#16A34A]", label: "Resolved",     count: resolved, pct: total ? Math.round(resolved/total*100) : 0 },
                    { color: "bg-[#1A2B4A]", label: "Open / Active", count: active,  pct: total ? Math.round(active/total*100) : 0 },
                    { color: "bg-[#DC2626]", label: "Rejected",      count: rejected, pct: total ? Math.round(rejected/total*100) : 0 },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-[2px] ${row.color}`} />
                        <span className="text-[14px] text-[#1C2333] font-inter w-[120px]">{row.label}</span>
                      </div>
                      <div className="flex items-center gap-8">
                        <span className="text-[20px] font-semibold font-inter w-[30px] text-right text-[#1C2333]">{row.count}</span>
                        <span className="text-[14px] text-[#1C2333] font-inter w-[40px] text-right">{row.pct}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
