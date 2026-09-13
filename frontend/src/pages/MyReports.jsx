import { useEffect, useState } from "react";
import { Filter, Search, ChevronRight, MessageSquare } from "lucide-react";
import { clsx } from "clsx";
import { apiFetch } from "../api";
export function MyReports() {
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [search, setSearch] = useState("");
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [drawerReport, setDrawerReport] = useState(null);
    const [drawerLoading, setDrawerLoading] = useState(false);
    useEffect(() => {
        apiFetch('/api/reports/my')
            .then(r => r.json())
            .then(data => { setReports(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);
    const openDrawer = async (report) => {
        setDrawerReport(report);
        setDrawerLoading(true);
        const res = await apiFetch(`/api/reports/${report.id}`);
        const data = await res.json();
        setDrawerReport(data);
        setDrawerLoading(false);
    };
    const cancelReport = async (id) => {
        if (!confirm('Cancel this report?'))
            return;
        await apiFetch(`/api/reports/${id}/cancel`, { method: 'DELETE' });
        setReports(prev => prev.filter(r => r.id !== id));
        setDrawerReport(null);
    };
    const formatLocation = (r) => {
        const room = r.room_number ? `, Room ${r.room_number}` : r.landmark_name ? `, ${r.landmark_name}` : '';
        return `${r.block_name}${room}`;
    };
    const formatDate = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const formatDateTime = (iso) => new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    const getStatusClasses = (status) => {
        switch (status) {
            case "Open": return "bg-open-grey/10 text-open-grey border-l-open-grey";
            case "Acknowledged": return "bg-info/10 text-info border-l-info";
            case "In Progress": return "bg-warning/20 text-warning border-l-warning";
            case "Resolved": return "bg-success/20 text-success border-l-success";
            case "Rejected": return "bg-danger/10 text-danger border-l-danger";
            default: return "bg-page-bg text-ink border-l-transparent";
        }
    };
    const statusDotColor = (status) => {
        switch (status) {
            case "Open": return "bg-open-grey";
            case "Acknowledged": return "bg-info";
            case "In Progress": return "bg-warning";
            case "Resolved": return "bg-success";
            case "Rejected": return "bg-danger";
            default: return "bg-line";
        }
    };
    const filtered = reports.filter(r => {
        const matchStatus = selectedStatus === "All" || r.status === selectedStatus;
        const matchSearch = search === "" || r.sub_type.toLowerCase().includes(search.toLowerCase()) || formatLocation(r).toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });
    return (<div className="flex flex-col gap-6 w-full max-w-4xl relative">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-line shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto">
          {["All", "Open", "Acknowledged", "In Progress", "Resolved", "Rejected"].map((s) => (<button key={s} onClick={() => setSelectedStatus(s)} className={clsx("px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap", selectedStatus === s ? "bg-navy text-white" : "bg-page-bg text-ink-muted hover:bg-line")}>
              {s}
            </button>))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2"/>
            <input type="text" placeholder="Search reports..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 pr-4 py-1.5 border border-line rounded-md text-sm outline-none focus:border-navy"/>
          </div>
          <button className="p-1.5 border border-line rounded-md text-ink-muted hover:bg-page-bg">
            <Filter className="w-4 h-4"/>
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="flex flex-col gap-4">
        {loading ? (<p className="text-center text-sm text-ink-muted py-10">Loading…</p>) : filtered.length === 0 ? (<div className="bg-white rounded-xl border border-line p-12 text-center">
            <p className="text-ink font-medium">No reports found.</p>
            <p className="text-ink-muted text-sm mt-1">
              {reports.length === 0 ? "You haven't submitted any reports yet." : "Try a different filter."}
            </p>
          </div>) : (filtered.map((report) => {
            const borderClass = getStatusClasses(report.status).split(" ").find(c => c.startsWith("border-l-")) ?? "";
            const badgeClasses = getStatusClasses(report.status).split(" ").filter(c => !c.startsWith("border-l-")).join(" ");
            return (<div key={report.id} onClick={() => openDrawer(report)} className={clsx("bg-white rounded-xl shadow-sm border border-line overflow-hidden border-l-4 cursor-pointer hover:shadow-md transition-shadow", borderClass)}>
                <div className="p-5 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-ink text-base">{formatLocation(report)}</h3>
                      <p className="text-ink-muted text-sm mt-0.5">{report.sub_type}</p>
                    </div>
                    <span className={clsx("px-2.5 py-1 rounded-[4px] text-xs font-semibold uppercase tracking-wide", badgeClasses)}>
                      {report.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2 border-t border-line pt-3">
                    <div className="flex items-center gap-4 text-xs text-ink-muted">
                      <span>Submitted {formatDate(report.created_at)}</span>
                      {parseInt(String(report.confirmation_count)) > 0 && (<span className="flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-line"></span>
                          {report.confirmation_count} others confirmed this
                        </span>)}
                    </div>
                    {report.status === "Open" && (<button onClick={e => { e.stopPropagation(); cancelReport(report.id); }} className="text-danger text-xs font-medium hover:underline">
                        Cancel report
                      </button>)}
                    {report.status === "Resolved" && (<button className="text-success text-xs font-medium flex items-center gap-1 hover:underline">
                        <MessageSquare className="w-3 h-3"/> Leave feedback
                      </button>)}
                  </div>
                </div>
              </div>);
        }))}
      </div>

      {/* Detail Drawer */}
      {drawerReport && (<div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-navy/20 backdrop-blur-sm" onClick={() => setDrawerReport(null)}/>
          <div className="w-[480px] bg-white h-full shadow-2xl relative z-10 flex flex-col animate-in slide-in-from-right">
            <div className="p-6 border-b border-line flex justify-between items-center bg-page-bg">
              <div>
                <p className="text-sm text-ink-muted font-medium">Report #{drawerReport.id}</p>
                <h2 className="text-xl font-semibold text-navy mt-1">{formatLocation(drawerReport)}</h2>
              </div>
              <button onClick={() => setDrawerReport(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-line text-ink">
                <ChevronRight className="w-5 h-5"/>
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
              {drawerLoading ? (<p className="text-sm text-ink-muted">Loading details…</p>) : (<>
                  <div>
                    <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2">Category</h3>
                    <p className="text-ink font-medium">{drawerReport.sub_type}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2">Description</h3>
                    <p className="text-ink text-sm leading-relaxed">{drawerReport.description}</p>
                  </div>
                  {drawerReport.rejection_reason && (<div className="bg-danger/5 border border-danger/20 rounded-lg p-4">
                      <h3 className="text-xs font-semibold text-danger uppercase tracking-wider mb-1">Rejection Reason</h3>
                      <p className="text-sm text-ink">{drawerReport.rejection_reason}</p>
                    </div>)}
                  {drawerReport.status_history && drawerReport.status_history.length > 0 && (<div>
                      <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-4">Status History</h3>
                      <div className="flex flex-col relative ml-2">
                        <div className="absolute left-[3px] top-2 bottom-6 w-px bg-line"/>
                        {[...drawerReport.status_history].reverse().map((h, i) => (<div key={i} className="flex gap-4 relative z-10 pb-6">
                            <div className={clsx("w-2 h-2 rounded-full ring-4 ring-white mt-1.5 shrink-0", statusDotColor(h.new_status))}/>
                            <div>
                              <p className="text-sm font-semibold text-ink">{h.new_status}</p>
                              <p className="text-xs text-ink-muted mt-0.5">{formatDateTime(h.changed_at)}</p>
                            </div>
                          </div>))}
                      </div>
                    </div>)}
                  <div className="bg-page-bg p-4 rounded-lg flex items-center justify-between">
                    <span className="text-sm font-medium text-ink">
                      {parseInt(String(drawerReport.confirmation_count)) === 0
                    ? 'No other confirmations yet.'
                    : `${drawerReport.confirmation_count} student${parseInt(String(drawerReport.confirmation_count)) !== 1 ? 's' : ''} confirmed this`}
                    </span>
                  </div>
                </>)}
            </div>
          </div>
        </div>)}
    </div>);
}
