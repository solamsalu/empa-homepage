import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import axios from "axios";
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import ConfirmModal from '../common/ConfirmModal'; // Make sure this is used if you need it!
import {
    CheckCircle, XCircle, Trash2, Search,
    Edit, Users, CreditCard, ShieldCheck, Clock,
    Filter, Download, AlertCircle, GraduationCap, Building2, ChevronLeft, ChevronRight
} from 'lucide-react';
import { API_BASE_URL } from "../../utils/constants";
import { motion, AnimatePresence } from "framer-motion";

const AdminDashboard = () => {
    const { authToken: token, userRole, handleLogout, isAuthReady } = useContext(AuthContext);

    // --- State ---
    const [members, setMembers] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [page, setPage] = useState(1);

    const rowsPerPage = 15;

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({ message: '', action: null });

    // --- Data Fetching ---
    const fetchData = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get(`${API_BASE_URL}/members`, config);
            setMembers(res.data.data || []);
        } catch (err) {
            setError("Database connection failed.");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (isAuthReady && token && userRole === 'admin') fetchData();
    }, [isAuthReady, token, userRole, fetchData]);

    // --- Stats ---
    const stats = useMemo(() => ({
        total: members.length,
        pending: members.filter(m => m.membership_application_status === 'pending').length,
        unpaid: members.filter(m => m.annual_payment_status === 'Unpaid').length,
        active: members.filter(m => m.membership_status === 'Active').length
    }), [members]);

    // --- Sorting & Filtering Logic ---
    const processedMembers = useMemo(() => {
        // 1. Filter by Search & Role
        let filtered = members.filter(m => {
            const term = searchTerm.toLowerCase();
            const matchesSearch = (m.full_name || '').toLowerCase().includes(term) ||
                (m.email || '').toLowerCase().includes(term);
            const matchesRole = filterRole === 'all' || m.role === filterRole;
            return matchesSearch && matchesRole;
        });

        // 2. Complex Sort: (Approved/Rejected first A-Z) -> (Pending last A-Z)
        return filtered.sort((a, b) => {
            if (a.membership_application_status === 'pending' && b.membership_application_status !== 'pending') return 1;
            if (a.membership_application_status !== 'pending' && b.membership_application_status === 'pending') return -1;
            return (a.full_name || "").localeCompare(b.full_name || "");
        });
    }, [members, searchTerm, filterRole]);

    // --- Pagination ---
    const paginatedMembers = processedMembers.slice((page - 1) * rowsPerPage, page * rowsPerPage);
    const totalPages = Math.ceil(processedMembers.length / rowsPerPage);

    // --- Action Handlers (Moved OUT of useMemo) ---
    const handleTogglePayment = async (memberId, currentStatus) => {
        const newStatus = currentStatus === 'Paid' ? 'Unpaid' : 'Paid';
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`${API_BASE_URL}/members/${memberId}/toggle-payment`, { annual_payment_status: newStatus }, config);
            setSuccess(`Payment marked as ${newStatus}`);
            fetchData();
        } catch (err) {
            setError("Failed to update payment status.");
        }
    };

    const handleRoleChange = async (id, newRole) => {
        try {
            await axios.patch(`${API_BASE_URL}/members/${id}/role`, { role: newRole }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess("System access updated.");
            fetchData();
        } catch (err) { setError("Role update failed."); }
    };

    const handleApplication = async (id, action) => {
        try {
            await axios.put(`${API_BASE_URL}/members/${id}/${action}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess(`Application ${action}ed successfully.`);
            fetchData();
        } catch (err) { setError("Action failed."); }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/members/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSuccess("Member permanently removed.");
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || "Delete failed.");
        }
    };

    const exportToCSV = () => {
        const headers = ["Name", "Email", "Institution", "Status", "Payment"];
        const rows = processedMembers.map(m => [m.full_name, m.email, m.institution, m.membership_application_status, m.annual_payment_status]);
        const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `EMPA_Directory.csv`;
        link.click();
    };

    // --- Early Return for Loading State ---
    if (!isAuthReady || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // --- Main JSX Return ---
    return (
        <div className="bg-[#f8fafc] min-h-screen pb-20 pt-40">
            <header className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-slate-200 shadow-sm">
                <div className="bg-slate-900 px-8 py-2 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70">
                            Ethiopian Mathematics Professionals Association
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            Administrator: <span className="text-blue-400">{userRole}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 text-[10px] font-black uppercase text-rose-400 hover:text-rose-300 transition-colors"
                        >
                            <XCircle size={12} /> Sign Out
                        </button>
                    </div>
                </div>

                <div className="px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
                            <ShieldCheck className="text-white w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">
                                DIRECTORY CONTROL
                            </h1>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                                System Master Dashboard
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            to="/"
                            className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
                        >
                            View Website
                        </Link>
                        <div className="h-6 w-[1px] bg-slate-200"></div>
                        <button
                            onClick={exportToCSV}
                            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-slate-200 active:scale-95"
                        >
                            <Download size={16} /> Export CSV
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard icon={<Users />} label="Total Members" value={stats.total} color="blue" />
                    <StatCard icon={<Clock />} label="Unapproved (Bottom)" value={stats.pending} color="amber" />
                    <StatCard icon={<CreditCard />} label="Unpaid Dues" value={stats.unpaid} color="red" />
                    <StatCard icon={<CheckCircle />} label="Active Accounts" value={stats.active} color="green" />
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center justify-between">
                    <div className="relative flex-grow max-w-md">
                        <Search className="absolute left-4 top-3 text-slate-400 w-4 h-4" />
                        <input type="text" placeholder="Search alphabetically..." className="w-full pl-12 pr-4 py-2.5 bg-slate-50 rounded-xl text-sm outline-none" onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} />
                    </div>
                    <select className="bg-slate-50 text-sm font-bold text-slate-600 rounded-xl px-4 py-2.5 outline-none" onChange={(e) => { setFilterRole(e.target.value); setPage(1); }}>
                        <option value="all">All System Roles</option>
                        {['admin', 'member', 'managing_editor', 'associate_editor', 'editor_in_chief', 'production_staff'].map(r => (
                            <option key={r} value={r}>{r.replace('_', ' ').toUpperCase()}</option>
                        ))}
                    </select>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Name & Contact</th>
                                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Organization & Rank</th>
                                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Permissions</th>
                                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">App Status</th>
                                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Annual Payment</th>
                                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paginatedMembers.map((member) => (
                                <tr key={member.id} className={`transition-colors group ${member.membership_application_status === 'pending' ? 'bg-amber-50/30' : 'hover:bg-blue-50/30'}`}>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-slate-800">{member.full_name}</div>
                                        <div className="text-[10px] text-slate-400 font-medium">{member.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs text-slate-600 font-medium">{member.institution || 'N/A'}</div>
                                        <div className="text-[10px] text-blue-500 font-bold mt-1 uppercase">{member.academic_rank || 'No Rank'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={member.role}
                                            onChange={(e) => handleRoleChange(member.id, e.target.value)}
                                            className="text-[10px] font-black uppercase border border-slate-200 rounded px-2 py-1 bg-white"
                                        >
                                            {['admin', 'member', 'managing_editor', 'associate_editor', 'editor_in_chief', 'production_staff'].map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={member.membership_application_status} />
                                        <div className="text-[9px] font-black text-slate-400 mt-1 uppercase">
                                            {member.membership_type}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleTogglePayment(member.id, member.annual_payment_status)}
                                            className={`flex items-center gap-2 text-[10px] font-black uppercase px-4 py-2 rounded-xl border transition-all active:scale-95 shadow-sm ${member.annual_payment_status === 'Paid'
                                                ? 'bg-green-600 text-white border-green-700'
                                                : 'bg-white text-red-600 border-red-200 hover:bg-red-50'
                                                }`}
                                        >
                                            <CreditCard size={12} />
                                            {member.annual_payment_status}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {member.membership_application_status === 'pending' && (
                                                <button onClick={() => handleApplication(member.id, 'approve')} className="p-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-600 hover:text-white transition-all shadow-sm" title="Approve Member">
                                                    <CheckCircle size={18} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => {
                                                    setConfirmConfig({
                                                        message: `Permanently delete ${member.full_name}? This cannot be undone.`,
                                                        action: () => handleDelete(member.id)
                                                    });
                                                    setShowConfirmModal(true);
                                                }}
                                                className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition shadow-sm"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg flex items-center justify-between">
                    <div className="text-sm font-bold text-slate-400">
                        Page <span className="text-slate-900">{page}</span> of {totalPages || 1}
                        <span className="ml-4 text-xs font-medium italic">({processedMembers.length} members found)</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white"
                        >
                            <ChevronLeft size={18} /> Previous
                        </button>

                        <div className="flex gap-1">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setPage(i + 1)}
                                    className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${page === i + 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:bg-slate-50'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage(page + 1)}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-30"
                        >
                            Next <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </main>

            <AnimatePresence>
                {(success || error) && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
                        className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 rounded-2xl shadow-2xl text-white font-bold z-50 flex items-center gap-3 ${success ? 'bg-green-600' : 'bg-red-600'}`}
                    >
                        {success ? <CheckCircle /> : <AlertCircle />}
                        {success || error}
                    </motion.div>
                )}
            </AnimatePresence>
            {showConfirmModal && (
                <ConfirmModal
                    message={confirmConfig.message}
                    onConfirm={() => {
                        if (confirmConfig.action) confirmConfig.action();
                        setShowConfirmModal(false);
                    }}
                    onCancel={() => setShowConfirmModal(false)}
                />
            )}
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => {
    const colors = { blue: "bg-blue-50 text-blue-600", amber: "bg-amber-50 text-amber-600", red: "bg-red-50 text-red-600", green: "bg-green-50 text-green-600" };
    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5">
            <div className={`p-4 rounded-2xl ${colors[color]}`}>{icon}</div>
            <div>
                <p className="text-xs font-black uppercase text-slate-400 mb-1">{label}</p>
                <p className="text-2xl font-black text-slate-800 tracking-tight">{value}</p>
            </div>
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const map = { pending: "bg-amber-100 text-amber-700", approved: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700" };
    return <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border border-current ${map[status] || "bg-slate-100"}`}>{status}</span>;
};

export default AdminDashboard;
