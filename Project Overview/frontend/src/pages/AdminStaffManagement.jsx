import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { apiFetch } from "../api";
export function AdminStaffManagement() {
    const [staff, setStaff] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '', block_id: '' });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const fetchStaff = () => {
        Promise.all([
            apiFetch('/api/admin/staff').then(r => r.json()),
        ]).then(([s]) => {
            setStaff(Array.isArray(s) ? s : []);
            setLoading(false);
        }).catch(() => setLoading(false));
    };
    useEffect(() => {
        fetchStaff();
        // Also fetch blocks for the dropdown
        apiFetch('/api/admin/block-ratings').then(r => r.json()).then(data => {
            if (Array.isArray(data)) {
                setBlocks(data.map((b) => ({ id: b.block_id, name: b.block_name })));
            }
        });
    }, []);
    const handleAdd = async () => {
        setError('');
        if (!form.name || !form.email || !form.password || !form.block_id) {
            setError('All fields are required.');
            return;
        }
        setSubmitting(true);
        const res = await apiFetch('/api/admin/staff', {
            method: 'POST',
            body: JSON.stringify({ ...form, block_id: parseInt(form.block_id) }),
        });
        const data = await res.json();
        setSubmitting(false);
        if (!res.ok) {
            setError(data.error ?? 'Failed to create account.');
            return;
        }
        setIsModalOpen(false);
        setForm({ name: '', email: '', password: '', block_id: '' });
        fetchStaff();
    };
    const handleRemove = async (id, name) => {
        if (!confirm(`Remove ${name}'s account? This cannot be undone.`))
            return;
        await apiFetch(`/api/admin/staff/${id}`, { method: 'DELETE' });
        setStaff(prev => prev.filter(s => s.id !== id));
    };
    const formatDate = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    return (<div className="flex flex-col min-w-0 max-w-full">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-[18px] font-semibold text-[#1C2333] font-inter">Block Staff Accounts</h2>
          <p className="text-[13px] text-[#6B7280] font-inter font-normal mt-1">
            {loading ? '…' : `${staff.length} staff account${staff.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-[#1A2B4A] text-white text-[13px] font-semibold font-inter rounded-md hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4"/> Add Staff Account
        </button>
      </div>

      <div className="bg-white rounded-[10px] border border-[#E2E6EF] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E2E6EF]">
                {['Name', 'Email', 'Assigned Block', 'Reports Handled', 'Account Created', 'Actions'].map(h => (<th key={h} className="h-[48px] px-4 text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.04em]">{h}</th>))}
              </tr>
            </thead>
            <tbody>
              {loading ? (<tr><td colSpan={6} className="py-10 text-center text-sm text-[#6B7280]">Loading…</td></tr>) : staff.length === 0 ? (<tr><td colSpan={6} className="py-10 text-center text-sm text-[#6B7280]">No staff accounts yet.</td></tr>) : staff.map((row) => (<tr key={row.id} className="border-b border-[#E2E6EF] hover:bg-gray-50 h-[68px]">
                  <td className="px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#DBEAFE] flex items-center justify-center text-[12px] font-bold text-[#1A2B4A]">
                        {row.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="text-[14px] font-semibold text-[#1C2333] font-inter">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-4 text-[13px] text-[#6B7280] font-inter">{row.email}</td>
                  <td className="px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[12px] font-medium font-inter bg-[#EEF2FF] text-[#3730A3]">
                      {row.block_name}
                    </span>
                  </td>
                  <td className="px-4 text-[14px] text-gray-900">{row.reports_handled}</td>
                  <td className="px-4 text-[13px] text-[#6B7280] font-inter">{formatDate(row.created_at)}</td>
                  <td className="px-4 text-[13px] font-inter">
                    <button onClick={() => handleRemove(row.id, row.name)} className="text-[#DC2626] font-semibold hover:underline">Remove</button>
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {isModalOpen && (<div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[12px] shadow-2xl w-full max-w-[480px] p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[18px] font-semibold text-[#1C2333] font-inter">Add Staff Account</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#6B7280] hover:text-gray-900">
                <X className="w-5 h-5"/>
              </button>
            </div>
            <div className="h-px bg-[#E2E6EF] mb-6"/>

            {error && <p className="text-sm text-danger mb-4">{error}</p>}

            <div className="flex flex-col gap-4">
              {[
                { label: 'Full Name', key: 'name', type: 'text', placeholder: 'e.g. Priya Sharma' },
                { label: 'College Email', key: 'email', type: 'email', placeholder: 'e.g. priya.s@bmsit.in' },
                { label: 'Temporary Password', key: 'password', type: 'password', placeholder: '••••••••' },
            ].map(f => (<div key={f.key}>
                  <label className="block text-[13px] font-medium text-[#6B7280] font-inter mb-1.5">{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} className="w-full h-[40px] px-3 rounded-md border border-[#E2E6EF] text-[14px] bg-white focus:outline-none focus:border-navy"/>
                </div>))}
              <div>
                <label className="block text-[13px] font-medium text-[#6B7280] font-inter mb-1.5">Assign Block</label>
                <select value={form.block_id} onChange={e => setForm(prev => ({ ...prev, block_id: e.target.value }))} className="w-full h-[40px] px-3 rounded-md border border-[#E2E6EF] text-[14px] bg-white focus:outline-none focus:border-navy appearance-none">
                  <option value="">Select a block</option>
                  {blocks.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            </div>

            <div className="h-px bg-[#E2E6EF] my-6"/>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 border border-[#E2E6EF] text-[#6B7280] text-[13px] font-medium font-inter rounded-md hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleAdd} disabled={submitting} className="px-5 py-2.5 bg-[#1A2B4A] text-white text-[13px] font-medium font-inter rounded-md hover:opacity-90 disabled:opacity-50">
                {submitting ? 'Creating…' : 'Create Account'}
              </button>
            </div>
          </div>
        </div>)}
    </div>);
}
