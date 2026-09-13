import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Search, FileText } from "lucide-react";
import { clsx } from "clsx";
import { apiFetch } from "../api";
export function StaffReports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        apiFetch('/api/staff/queue')
            .then(r => r.json())
            .then(data => {
            setReports(Array.isArray(data) ? data : []);
        })
            .catch(() => {
            setReports([]);
        })
            .finally(() => setLoading(false));
    }, []);
    const formatLocation = (r) => {
        const room = r.room_number ? `, Room ${r.room_number}` : r.landmark_name ? `, ${r.landmark_name}` : '';
        return `${r.block_name}${room}`;
    };
    const formatDate = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const getStatusBadge = (status) => {
        switch (status) {
            case "Open":
                return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Open</span>;
            case "Acknowledged":
                return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Acknowledged</span>;
            case "In Progress":
                return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">In Progress</span>;
            case "Resolved":
                return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Resolved</span>;
            case "Rejected":
                return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>;
            default:
                return null;
        }
    };
    const filtered = search
        ? reports.filter(r => formatLocation(r).toLowerCase().includes(search.toLowerCase()) ||
            r.sub_type.toLowerCase().includes(search.toLowerCase()) ||
            r.id.toString().includes(search))
        : reports;
    return (<div className="flex flex-col gap-6 max-w-[1200px]">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[18px] font-semibold text-[#1C2333] font-inter">Report Details</h2>
          <p className="text-[13px] text-[#6B7280] font-inter font-normal">
            {loading ? '…' : `${filtered.length} report${filtered.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
          <input type="text" placeholder="Search by ID, location or category" value={search} onChange={e => setSearch(e.target.value)} className="w-[280px] h-[38px] pl-9 pr-3 rounded-md border border-[#E2E6EF] text-sm focus:outline-none focus:border-navy"/>
        </div>
      </div>

      {/* Reports Grid */}
      {loading ? (<div className="text-center py-10 text-sm text-[#6B7280]">Loading reports…</div>) : filtered.length === 0 ? (<div className="bg-white rounded-[10px] border border-[#E2E6EF] p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3"/>
          <p className="text-sm text-[#6B7280]">No reports found.</p>
          {search && (<button onClick={() => setSearch("")} className="mt-2 text-sm text-[#1A2B4A] hover:underline">
              Clear search
            </button>)}
        </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((report) => (<div key={report.id} className="bg-white rounded-[10px] border border-[#E2E6EF] p-5 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/staff/report/${report.id}`)}>
              <div className="flex justify-between items-start mb-3">
                <span className="text-[13px] font-semibold text-[#6B7280]">Report #{report.id}</span>
                {getStatusBadge(report.status)}
              </div>

              <h3 className="text-[15px] font-semibold text-[#1C2333] mb-2">{report.sub_type}</h3>

              <div className="space-y-2 mb-3">
                <div className="flex items-start gap-2">
                  <span className="text-[12px] text-[#6B7280] min-w-[60px]">Location:</span>
                  <span className="text-[12px] text-[#1C2333] font-medium">{formatLocation(report)}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[12px] text-[#6B7280] min-w-[60px]">Date:</span>
                  <span className="text-[12px] text-[#1C2333]">{formatDate(report.created_at)}</span>
                </div>
              </div>

              <p className="text-[13px] text-[#6B7280] line-clamp-2 mb-3">{report.description}</p>

              {parseInt(String(report.confirmation_count)) > 0 && (<div className="flex items-center gap-1 text-[12px] font-medium text-[#E8A020] mb-3">
                  <span>✓</span>
                  <span>{report.confirmation_count} student{report.confirmation_count !== 1 ? 's' : ''} confirmed</span>
                </div>)}

              <button className="w-full text-[13px] font-semibold text-[#1A2B4A] hover:underline text-center" onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/staff/report/${report.id}`);
                }}>
                View Details →
              </button>
            </div>))}
        </div>)}
    </div>);
}
