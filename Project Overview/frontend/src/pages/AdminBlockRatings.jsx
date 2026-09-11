import { useEffect, useState } from "react";
import { apiFetch } from "../api";
export function AdminBlockRatings() {
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        apiFetch('/api/admin/block-ratings')
            .then(r => r.json())
            .then(data => { setBlocks(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);
    const ratingColor = (r) => {
        if (r >= 80)
            return "text-[#16A34A]";
        if (r >= 70)
            return "text-[#D97706]";
        return "text-[#DC2626]";
    };
    const ratingBg = (r) => {
        if (r >= 80)
            return "bg-[#DCFCE7]";
        if (r >= 70)
            return "bg-[#FEF3C7]";
        return "bg-[#FEE2E2]";
    };
    const monthLabel = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    const lowRating = blocks.filter(b => b.final_rating < 70);
    return (<div className="flex flex-col min-w-0 max-w-full">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-[18px] font-semibold text-[#1C2333] font-inter">Block Performance</h2>
          <p className="text-[13px] text-[#6B7280] font-inter font-normal mt-1">Ratings reset monthly. Based on resolution rate and timeliness.</p>
        </div>
        <span className="text-[13px] text-[#6B7280] font-inter">{monthLabel}</span>
      </div>

      {/* Formula */}
      <div className="bg-white rounded-[10px] border border-[#E2E6EF] p-4 flex items-center gap-8 mb-5 overflow-x-auto">
        <span className="text-[11px] font-medium text-[#6B7280] font-inter tracking-[0.06em] whitespace-nowrap">HOW RATINGS ARE CALCULATED</span>
        <div className="flex items-center gap-3 whitespace-nowrap">
          <span className="text-[14px] font-semibold text-[#1C2333] font-inter">50% Resolution Rate</span>
          <span className="text-[#6B7280]">+</span>
          <span className="text-[14px] font-semibold text-[#1C2333] font-inter">50% Timeliness Score</span>
        </div>
        <span className="text-[13px] font-medium text-[#6B7280] font-inter whitespace-nowrap">= Rating out of 100</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[10px] border border-[#E2E6EF] overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E2E6EF]">
                {['Rank', 'Block', 'Incharge', 'Resolution Rate', 'Timeliness Score', 'Rating', 'Reports', 'Overdue'].map(h => (<th key={h} className="h-[48px] px-3 text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.04em]">{h}</th>))}
              </tr>
            </thead>
            <tbody>
              {loading ? (<tr><td colSpan={8} className="py-10 text-center text-sm text-[#6B7280]">Loading…</td></tr>) : blocks.length === 0 ? (<tr><td colSpan={8} className="py-10 text-center text-sm text-[#6B7280]">No reports this month yet.</td></tr>) : (blocks.map((row, i) => (<tr key={row.block_id} className="border-b border-[#E2E6EF] h-[72px]">
                    <td className="px-3 text-[16px] font-bold text-[#9CA3AF] font-inter">{i + 1}</td>
                    <td className="px-3 text-[14px] font-semibold text-[#1C2333] font-inter">{row.block_name}</td>
                    <td className="px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#DBEAFE] flex items-center justify-center text-[10px] font-bold text-[#1A2B4A]">
                          {row.staff_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="text-[14px] text-[#1C2333] font-inter">{row.staff_name}</span>
                      </div>
                    </td>
                    <td className={`px-3 text-[14px] font-semibold font-inter ${ratingColor(row.resolution_rate * 100)}`}>
                      {Math.round(row.resolution_rate * 100)}%
                    </td>
                    <td className={`px-3 text-[14px] font-semibold font-inter ${ratingColor(row.timeliness_score * 100)}`}>
                      {Math.round(row.timeliness_score * 100)}%
                    </td>
                    <td className="px-3">
                      <span className={`inline-block px-3 py-1 rounded text-[16px] font-bold font-inter ${ratingBg(row.final_rating)} ${ratingColor(row.final_rating)}`}>
                        {Math.round(row.final_rating)}
                      </span>
                    </td>
                    <td className="px-3 text-[14px] text-[#1C2333] font-inter">{row.total_reports}</td>
                    <td className="px-3">
                      {row.overdue_count > 0
                ? <span className="text-[13px] font-semibold text-[#DC2626]">{row.overdue_count} overdue</span>
                : <span className="text-[13px] text-[#16A34A]">None</span>}
                    </td>
                  </tr>)))}
            </tbody>
          </table>
        </div>
      </div>

      {lowRating.length > 0 && (<div className="bg-white border border-[#FCA5A5] rounded-[10px] py-4 px-5">
          <p className="text-[13px] text-[#DC2626] font-inter">
            {lowRating.map(b => b.block_name).join(', ')} {lowRating.length === 1 ? 'is' : 'are'} below the 70-point threshold.
            Consider a review with their incharges.
          </p>
        </div>)}
    </div>);
}
