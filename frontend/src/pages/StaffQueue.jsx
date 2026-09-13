import { useEffect, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { clsx } from "clsx";
import { apiFetch } from "../api";
import { useNavigate } from "react-router";
export function StaffQueue() {
    const [activeTab, setActiveTab] = useState("All");
    const [sort, setSort] = useState("newest");
    const [reports, setReports] = useState([]);
    const [rating, setRating] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const fetchQueue = () => {
        setLoading(true);
        const params = new URLSearchParams({ sort });
        if (activeTab !== "All")
            params.set("status", activeTab);
        // Fetch queue and rating independently so a rating failure doesn't blank the list
        apiFetch(`/api/staff/queue?${params}`)
            .then(r => r.json())
            .then(q => { setReports(Array.isArray(q) ? q : []); })
            .catch(() => { setReports([]); })
            .finally(() => setLoading(false));
        apiFetch('/api/staff/block-rating')
            .then(r => r.json())
            .then(r => { if (r && typeof r.final_rating === 'number')
            setRating(r); })
            .catch(() => { });
    };
    useEffect(() => { fetchQueue(); }, [activeTab, sort]);
    const formatLocation = (r) => {
        const room = r.room_number ? `, Room ${r.room_number}` : r.landmark_name ? `, ${r.landmark_name}` : '';
        return `${r.block_name}${room}`;
    };
    const formatDate = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const slaLabel = (r) => {
        if (r.sla_status === 'overdue')
            return '🔴 Overdue';
        if (r.sla_status === 'warning')
            return `🟡 ${Math.round(r.hours_remaining)}h left`;
        return `🟢 ${Math.round(r.hours_remaining)}h left`;
    };
    const slaColor = (r) => {
        if (r.sla_status === 'overdue')
            return 'text-[#DC2626]';
        if (r.sla_status === 'warning')
            return 'text-[#D97706]';
        return 'text-[#16A34A]';
    };
    const getStatusBadge = (status) => {
        switch (status) {
            case "Open": return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Open</span>;
            case "Acknowledged": return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Acknowledged</span>;
            case "In Progress": return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">In Progress</span>;
            case "Resolved": return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Resolved</span>;
            default: return null;
        }
    };
    const allCount = reports.length;
    const filtered = search
        ? reports.filter(r => formatLocation(r).toLowerCase().includes(search.toLowerCase()) || r.sub_type.toLowerCase().includes(search.toLowerCase()))
        : reports;
    const tabs = ["All", "Open", "Acknowledged", "In Progress", "Resolved"];
    return (<div className="flex flex-col gap-6 lg:flex-row lg:items-start max-w-[1200px]">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-[18px] font-semibold text-[#1C2333] font-inter">
              {rating ? `Block Reports` : 'Your Queue'}
            </h2>
            <p className="text-[13px] text-[#6B7280] font-inter font-normal">
              {loading ? '…' : `${allCount} total report${allCount !== 1 ? 's' : ''}`}
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
            <input type="text" placeholder="Search by location or category" value={search} onChange={e => setSearch(e.target.value)} className="w-[240px] h-[38px] pl-9 pr-3 rounded-md border border-[#E2E6EF] text-sm focus:outline-none focus:border-navy"/>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            {tabs.map((tab) => (<button key={tab} onClick={() => setActiveTab(tab)} className={clsx("px-[14px] py-1.5 rounded-md text-[13px] font-medium font-inter transition-colors", activeTab === tab ? "bg-[#1A2B4A] text-white" : "bg-white text-[#6B7280] border border-[#E2E6EF] hover:bg-gray-50")}>
                {tab}
              </button>))}
          </div>
          <div className="relative">
            <select value={sort} onChange={e => setSort(e.target.value)} className="appearance-none w-[160px] h-[38px] px-3 pr-8 rounded-md border border-[#E2E6EF] text-sm text-gray-700 bg-white focus:outline-none focus:border-navy">
              <option value="newest">Sort by: Newest</option>
              <option value="oldest">Sort by: Oldest</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"/>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[10px] border border-[#E2E6EF] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-[#E2E6EF]">
                  <th className="h-[48px] px-5 text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.04em]">Location</th>
                  <th className="h-[48px] px-2 text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.04em]">Category</th>
                  <th className="h-[48px] px-2 text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.04em]">Confirmed By</th>
                  <th className="h-[48px] px-2 text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.04em]">Status</th>
                  <th className="h-[48px] px-2 text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.04em]">Date</th>
                  <th className="h-[48px] px-2 text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.04em]">SLA</th>
                  <th className="h-[48px] px-5 text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.04em]">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (<tr><td colSpan={7} className="py-10 text-center text-sm text-[#6B7280]">Loading…</td></tr>) : filtered.length === 0 ? (<tr><td colSpan={7} className="py-10 text-center text-sm text-[#6B7280]">No reports found.</td></tr>) : (filtered.map((row) => (<tr key={row.id} className="border-b border-[#E2E6EF] hover:bg-[#EFF6FF] h-[64px]">
                      <td className="px-5 text-sm text-gray-900">{formatLocation(row)}</td>
                      <td className="px-2 text-sm text-gray-900">{row.sub_type}</td>
                      <td className="px-2 text-[13px] font-medium" style={{ color: parseInt(String(row.confirmation_count)) > 0 ? '#E8A020' : '#6B7280' }}>
                        {parseInt(String(row.confirmation_count)) > 0 ? `${row.confirmation_count} student${row.confirmation_count !== 1 ? 's' : ''}` : '—'}
                      </td>
                      <td className="px-2">{getStatusBadge(row.status)}</td>
                      <td className="px-2 text-sm text-gray-500">{formatDate(row.created_at)}</td>
                      <td className={clsx("px-2 text-[12px] font-medium", slaColor(row))}>{slaLabel(row)}</td>
                      <td className="px-5">
                        <button onClick={() => navigate(`/staff/report/${row.id}`)} className="text-[13px] font-semibold text-[#1A2B4A] hover:underline">View</button>
                      </td>
                    </tr>)))}
              </tbody>
            </table>
          </div>
          <div className="h-[48px] bg-[#F9FAFB] px-5 flex items-center">
            <span className="text-[13px] text-[#6B7280]">Showing {filtered.length} report{filtered.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Right Panel — Block Rating */}
      <div className="w-full lg:w-[300px] flex-shrink-0">
        <div className="bg-white rounded-[10px] border border-[#E2E6EF] p-5">
          <h3 className="text-[15px] font-semibold text-[#1C2333]">Block Performance</h3>
          <p className="text-[12px] text-[#6B7280] mt-0.5 mb-4">This month</p>

          {!rating ? (<p className="text-sm text-[#6B7280]">Loading…</p>) : (<>
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-[48px] font-bold text-[#1A2B4A] leading-none">{Math.round(rating.final_rating)}</span>
                  <span className="text-[16px] text-[#6B7280]">/ 100</span>
                </div>
                <p className="text-[12px] text-[#6B7280] mt-1">Current Rating</p>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[13px] font-medium text-[#6B7280]">Resolution Rate</span>
                    <span className="text-[13px] font-semibold text-[#1C2333]">{Math.round(rating.resolution_rate * 100)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#E2E6EF] rounded-full overflow-hidden">
                    <div className="h-full bg-[#16A34A] rounded-full" style={{ width: `${rating.resolution_rate * 100}%` }}/>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[13px] font-medium text-[#6B7280]">Timeliness Score</span>
                    <span className="text-[13px] font-semibold text-[#1C2333]">{Math.round(rating.timeliness_score * 100)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#E2E6EF] rounded-full overflow-hidden">
                    <div className="h-full bg-[#E8A020] rounded-full" style={{ width: `${rating.timeliness_score * 100}%` }}/>
                  </div>
                </div>
              </div>

              {rating.overdue_count > 0 && (<>
                  <div className="h-px bg-[#E2E6EF] my-4"/>
                  <div className="bg-[#FFF5F5] border border-[#FCA5A5] rounded-md p-3">
                    <p className="text-[13px] font-semibold text-[#DC2626]">⚠ {rating.overdue_count} report{rating.overdue_count !== 1 ? 's' : ''} overdue</p>
                    <p className="text-[12px] text-[#6B7280] mt-0.5">Act on these first to protect your rating.</p>
                  </div>
                </>)}
            </>)}
        </div>
      </div>
    </div>);
}
