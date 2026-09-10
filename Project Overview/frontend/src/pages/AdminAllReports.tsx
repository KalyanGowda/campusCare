import { useEffect, useState } from "react"
import { Search, Download, ChevronDown } from "lucide-react"
import { clsx } from "clsx"
import { apiFetch } from "../api"

interface Report {
  id: number
  location_type: string
  room_number: string | null
  landmark_name: string | null
  block_name: string
  sub_type: string
  reporter_name: string
  staff_name: string | null
  status: string
  created_at: string
  sla_target_hours: number
}

export function AdminAllReports() {
  const [reports, setReports] = useState<Report[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [blockFilter, setBlockFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [search, setSearch] = useState("")
  const [escalated, setEscalated] = useState(0)

  const fetchReports = (p = 1) => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(p) })
    if (blockFilter)  params.set('block', blockFilter)
    if (statusFilter) params.set('status', statusFilter)
    if (search)       params.set('category', search)
    Promise.all([
      apiFetch(`/api/admin/reports?${params}`).then(r => r.json()),
      apiFetch('/api/admin/escalated').then(r => r.json()),
    ]).then(([data, esc]) => {
      setReports(Array.isArray(data.reports) ? data.reports : [])
      setTotal(data.total ?? 0)
      setPages(data.pages ?? 1)
      setEscalated(Array.isArray(esc) ? esc.length : 0)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { fetchReports(1); setPage(1) }, [blockFilter, statusFilter, search])
  useEffect(() => { fetchReports(page) }, [page])

  const formatLocation = (r: Report) => r.room_number ? `Room ${r.room_number}` : r.landmark_name ?? r.location_type
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Open":         return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Open</span>
      case "Acknowledged": return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Acknowledged</span>
      case "In Progress":  return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">In Progress</span>
      case "Resolved":     return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Resolved</span>
      case "Rejected":     return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>
      default: return null
    }
  }

  return (
    <div className="flex flex-col min-w-0 max-w-full">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-[18px] font-semibold text-[#1C2333] font-inter">All Reports</h2>
          <p className="text-[13px] text-[#6B7280] font-inter font-normal mt-1">
            {loading ? '…' : `${total} total reports`}
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-transparent border border-[#E2E6EF] text-[#1C2333] text-[13px] font-medium font-inter rounded-md hover:bg-gray-50">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-[10px] border border-[#E2E6EF] p-4 flex gap-3 mb-4 items-center flex-wrap xl:flex-nowrap">
        <div className="relative w-[160px]">
          <select value={blockFilter} onChange={e => setBlockFilter(e.target.value)}
            className="appearance-none w-full h-[38px] px-3 pr-8 rounded-md border border-[#E2E6EF] text-[13px] bg-white focus:outline-none focus:border-navy">
            <option value="">All Blocks</option>
            {['Block A','Block B','Block C','Block D','Block E','Block F','Campus'].map(b => <option key={b}>{b}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative w-[160px]">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="appearance-none w-full h-[38px] px-3 pr-8 rounded-md border border-[#E2E6EF] text-[13px] bg-white focus:outline-none focus:border-navy">
            <option value="">All Statuses</option>
            {['Open','Acknowledged','In Progress','Resolved','Rejected'].map(s => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative flex-grow min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input type="text" placeholder="Search by category" value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-[38px] pl-9 pr-3 rounded-md border border-[#E2E6EF] text-[13px] bg-white focus:outline-none focus:border-navy" />
        </div>
      </div>

      {escalated > 0 && (
        <div className="bg-[#FFF5F5] border border-[#FCA5A5] rounded-lg px-5 py-[14px] flex justify-between items-center mb-4">
          <span className="text-[14px] font-semibold text-[#DC2626] font-inter">
            ⚠ {escalated} report{escalated !== 1 ? 's' : ''} have breached SLA.
          </span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-[10px] border border-[#E2E6EF] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E2E6EF]">
                {['ID','Location','Block','Category','Reported By','Status','Date','Assigned To'].map(h => (
                  <th key={h} className="h-[48px] px-3 text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.04em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="py-10 text-center text-sm text-[#6B7280]">Loading…</td></tr>
              ) : reports.length === 0 ? (
                <tr><td colSpan={8} className="py-10 text-center text-sm text-[#6B7280]">No reports found.</td></tr>
              ) : reports.map((row) => (
                <tr key={row.id} className="border-b border-[#E2E6EF] hover:bg-gray-50 h-[60px]">
                  <td className="px-3 text-sm text-gray-900">#{row.id}</td>
                  <td className="px-3 text-sm text-gray-900">{formatLocation(row)}</td>
                  <td className="px-3 text-sm text-gray-900">{row.block_name}</td>
                  <td className="px-3 text-sm text-gray-900">{row.sub_type}</td>
                  <td className="px-3 text-sm text-gray-500">{row.reporter_name}</td>
                  <td className="px-3">{getStatusBadge(row.status)}</td>
                  <td className="px-3 text-sm text-gray-500">{formatDate(row.created_at)}</td>
                  <td className="px-3 text-sm text-gray-900">{row.staff_name ?? 'Admin'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="h-[48px] bg-[#F9FAFB] px-5 flex items-center justify-between">
          <span className="text-[13px] text-[#6B7280]">Showing {reports.length} of {total}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-2 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-40">Previous</button>
            {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={clsx("w-7 h-7 rounded-md text-sm font-medium flex items-center justify-center",
                  page === p ? "bg-[#1A2B4A] text-white" : "text-gray-600 hover:bg-gray-100")}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="px-2 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-40">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
