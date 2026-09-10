import { useEffect, useState } from "react"
import { ChevronLeft } from "lucide-react"
import { useNavigate, useParams } from "react-router"
import { clsx } from "clsx"
import { API, apiFetch } from "../api"

interface StatusHistory {
  old_status: string | null
  new_status: string
  changed_at: string
  changed_by_name: string | null
}

interface Report {
  id: number
  sub_type: string
  report_type: string
  description: string
  photo_url: string | null
  status: string
  rejection_reason: string | null
  sla_target_hours: number
  created_at: string
  resolved_at: string | null
  block_name: string
  location_type: string
  room_number: string | null
  landmark_name: string | null
  floor_wing: string | null
  confirmation_count: number
  status_history: StatusHistory[]
}

// Which status transitions are allowed per current status
const ALLOWED_NEXT: Record<string, string> = {
  "Open":         "Acknowledged",
  "Acknowledged": "In Progress",
  "In Progress":  "Resolved",
}

const STATUS_DOT: Record<string, string> = {
  "Open":         "bg-open-grey",
  "Acknowledged": "bg-info",
  "In Progress":  "bg-warning",
  "Resolved":     "bg-success",
  "Rejected":     "bg-danger",
}

export function StaffReportDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Status update
  const [updating, setUpdating] = useState(false)
  const [updateMsg, setUpdateMsg] = useState("")

  // Reject
  const [rejecting, setRejecting] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [rejectError, setRejectError] = useState("")

  const fetchReport = () => {
    apiFetch(`/api/reports/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(data.error); setLoading(false); return }
        setReport(data)
        setLoading(false)
      })
      .catch(() => { setError("Failed to load report."); setLoading(false) })
  }

  useEffect(() => { fetchReport() }, [id])

  const handleStatusUpdate = async () => {
    if (!report) return
    const next = ALLOWED_NEXT[report.status]
    if (!next) return
    setUpdating(true)
    setUpdateMsg("")
    const res = await apiFetch(`/api/staff/reports/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ new_status: next }),
    })
    const data = await res.json()
    setUpdating(false)
    if (!res.ok) { setUpdateMsg(data.error ?? "Update failed."); return }
    setUpdateMsg(`Moved to ${next}.`)
    fetchReport()
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) { setRejectError("A reason is required."); return }
    setRejecting(true)
    setRejectError("")
    const res = await apiFetch(`/api/staff/reports/${id}/reject`, {
      method: "PATCH",
      body: JSON.stringify({ rejection_reason: rejectReason.trim() }),
    })
    const data = await res.json()
    setRejecting(false)
    if (!res.ok) { setRejectError(data.error ?? "Rejection failed."); return }
    fetchReport()
  }

  const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })

  const formatLocation = (r: Report) => {
    const detail = r.room_number
      ? `Room ${r.room_number}`
      : r.landmark_name ?? r.location_type
    const wing = r.floor_wing ? `, ${r.floor_wing}` : ""
    return `${r.block_name}, ${detail}${wing}`
  }

  if (loading) return <div className="p-8 text-sm text-ink-muted">Loading…</div>
  if (error || !report) return <div className="p-8 text-sm text-danger">{error || "Report not found."}</div>

  const nextStatus = ALLOWED_NEXT[report.status]
  const canAct = !!nextStatus && report.status !== "Rejected"

  return (
    <div className="max-w-[1200px] flex flex-col">
      <button onClick={() => navigate("/staff/queue")}
        className="inline-flex items-center text-[13px] font-medium text-[#1A2B4A] hover:underline mb-4">
        <ChevronLeft className="w-4 h-4 mr-0.5" /> Back to My Queue
      </button>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* LEFT COLUMN */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">

          {/* Report info card */}
          <div className="bg-white rounded-[10px] border border-[#E2E6EF] p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[13px] font-semibold text-[#6B7280]">Report #{report.id}</span>
              <span className={clsx(
                "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold",
                report.status === "Open"         && "bg-gray-100 text-gray-800",
                report.status === "Acknowledged" && "bg-blue-100 text-blue-800",
                report.status === "In Progress"  && "bg-yellow-100 text-yellow-800",
                report.status === "Resolved"     && "bg-green-100 text-green-800",
                report.status === "Rejected"     && "bg-red-100 text-red-800",
              )}>
                {report.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["Location",      formatLocation(report)],
                ["Space Type",    report.location_type.charAt(0).toUpperCase() + report.location_type.slice(1)],
                ["Category",      `${report.report_type.charAt(0).toUpperCase() + report.report_type.slice(1)} — ${report.sub_type}`],
                ["Date Reported", formatDateTime(report.created_at)],
                ...(report.resolved_at ? [["Resolved At", formatDateTime(report.resolved_at)]] : []),
                ["SLA Target",    `${report.sla_target_hours} hours`],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-[13px] font-medium text-[#6B7280] mb-0.5">{label}</p>
                  <div className="text-[14px] text-[#1C2333]">{value}</div>
                </div>
              ))}
            </div>

            <div className="h-px bg-[#E2E6EF] my-4" />
            <div>
              <p className="text-[13px] font-semibold text-[#6B7280] mb-1.5">Description</p>
              <p className="text-[14px] text-[#1C2333] leading-[1.6]">{report.description}</p>
            </div>

            {report.photo_url && (
              <>
                <div className="h-px bg-[#E2E6EF] my-4" />
                <div>
                  <p className="text-[13px] font-semibold text-[#6B7280] mb-2">Photo</p>
                  <img
                    src={`${API}${report.photo_url}`}
                    alt="Report photo"
                    className="rounded-lg max-h-64 object-cover border border-[#E2E6EF]"
                  />
                </div>
              </>
            )}

            {report.rejection_reason && (
              <>
                <div className="h-px bg-[#E2E6EF] my-4" />
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-[13px] font-semibold text-[#DC2626] mb-1">Rejection Reason</p>
                  <p className="text-[14px] text-[#1C2333]">{report.rejection_reason}</p>
                </div>
              </>
            )}

            <div className="h-px bg-[#E2E6EF] my-4" />
            <div>
              <p className="text-[13px] font-semibold text-[#6B7280] mb-1.5">Student Confirmations</p>
              <p className="text-[14px] font-medium" style={{ color: parseInt(String(report.confirmation_count)) > 0 ? "#E8A020" : "#6B7280" }}>
                {parseInt(String(report.confirmation_count)) === 0
                  ? "No confirmations yet"
                  : `${report.confirmation_count} student${parseInt(String(report.confirmation_count)) !== 1 ? "s" : ""} confirmed this issue`}
              </p>
            </div>
          </div>

          {/* Status history timeline */}
          <div className="bg-white rounded-[10px] border border-[#E2E6EF] p-6">
            <h3 className="text-[15px] font-semibold text-[#1C2333] mb-4">Status History</h3>
            <div className="h-px bg-[#E2E6EF] mb-4" />

            {report.status_history.length === 0 ? (
              <p className="text-sm text-[#6B7280]">No history yet.</p>
            ) : (
              <div className="relative pl-4 space-y-6">
                <div className="absolute left-5 top-2 bottom-2 w-px bg-[#E2E6EF]" />
                {report.status_history.map((h, i) => (
                  <div key={i} className="relative flex items-start pl-6">
                    <div className={clsx("absolute left-[-5px] top-1.5 w-[10px] h-[10px] rounded-full z-10 ring-4 ring-white", STATUS_DOT[h.new_status] ?? "bg-line")} />
                    <div>
                      <p className="text-[14px] font-semibold text-[#1C2333]">{h.new_status}</p>
                      <p className="text-[12px] text-[#6B7280] mt-0.5">{formatDateTime(h.changed_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full lg:w-[340px] flex flex-col gap-4 flex-shrink-0">

          {/* Update Status card */}
          {canAct && (
            <div className="bg-white rounded-[10px] border border-[#E2E6EF] p-5">
              <h3 className="text-[15px] font-semibold text-[#1C2333] mb-4">Update Status</h3>
              <div className="h-px bg-[#E2E6EF] mb-4" />

              <div className="mb-4">
                <p className="text-[12px] font-medium text-[#6B7280] mb-2">Current status</p>
                <span className={clsx(
                  "inline-flex items-center px-4 py-2 rounded-full text-sm font-medium",
                  report.status === "Open"         && "bg-gray-100 text-gray-800",
                  report.status === "Acknowledged" && "bg-blue-100 text-blue-800",
                  report.status === "In Progress"  && "bg-yellow-100 text-yellow-800",
                )}>
                  {report.status}
                </span>
              </div>

              <div className="mb-4 bg-page-bg rounded-lg px-4 py-3 text-[13px] text-[#6B7280]">
                → Will move to <strong className="text-[#1C2333]">{nextStatus}</strong>
              </div>

              {updateMsg && <p className="text-sm text-success mb-3">{updateMsg}</p>}

              <button onClick={handleStatusUpdate} disabled={updating}
                className="w-full bg-[#1A2B4A] text-white text-[14px] font-semibold py-[11px] rounded-md hover:opacity-90 transition-opacity disabled:opacity-50">
                {updating ? "Updating…" : `Move to ${nextStatus}`}
              </button>
            </div>
          )}

          {/* Resolved / Rejected status display */}
          {!canAct && (
            <div className="bg-white rounded-[10px] border border-[#E2E6EF] p-5">
              <h3 className="text-[15px] font-semibold text-[#1C2333] mb-2">Status</h3>
              <p className="text-sm text-[#6B7280]">
                This report is <strong>{report.status.toLowerCase()}</strong> and requires no further action.
              </p>
            </div>
          )}

          {/* Reject card — only shown if report is still actionable and not already rejected */}
          {canAct && report.status !== "Resolved" && (
            <div className="bg-white rounded-[10px] border border-[#FCA5A5] p-5">
              <h3 className="text-[14px] font-semibold text-[#DC2626] mb-3">Mark as Invalid</h3>
              <div className="h-px bg-[#FCA5A5] mb-3" />
              <p className="text-[12px] text-[#6B7280] leading-[1.5] mb-3">
                Use this only if the issue cannot be verified. Your reason is logged and visible to admin.
              </p>
              <label className="block mb-3">
                <span className="block text-[13px] font-medium text-[#6B7280] mb-1.5">Reason for rejection</span>
                <textarea
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  className="w-full h-[96px] rounded-md border border-[#E2E6EF] p-3 text-[13px] resize-none focus:outline-none focus:border-red-400"
                  placeholder="e.g. Visited Room 204 — issue not reproducible."
                />
              </label>
              {rejectError && <p className="text-xs text-danger mb-2">{rejectError}</p>}
              <button onClick={handleReject} disabled={rejecting}
                className="w-full bg-transparent border border-[#DC2626] text-[#DC2626] text-[13px] font-semibold py-[10px] rounded-md hover:bg-red-50 transition-colors disabled:opacity-50">
                {rejecting ? "Rejecting…" : "Reject Report"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
