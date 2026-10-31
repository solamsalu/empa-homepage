import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { API_BASE_URL, STATIC_ASSETS_BASE_URL } from '../../../utils/constants';
import WorkflowStepper from './common/WorkflowStepper';
import AssignReviewerModal from './Editor/AssignReviewerModal';
import MakeDecisionModal from './Editor/MakeDecisionModal';
import SendProofModal from './Editor/SendProofModal';
import { Link } from 'react-router-dom';
import UploadProductionModal from './Editor/UploadProductionModal';
import {
    Download, ArrowRight, UserPlus, XCircle, FileCheck, Archive,
    Landmark, MessageSquare, AlertTriangle, History, Search, CheckCircle, Loader2, X, Eye, Info, Layers, Mail, Send
} from 'lucide-react';
import LatexRenderer from '../../common/LatexRenderer';
import LatexEditor from '../../common/LatexEditor';
import AddArchivedEdition from './Editor/AddArchivedEdition';
import EditorialContactModal from './Editor/EditorialContactModal';
import RubricScoreDisplay from './common/RubricScoreDisplay';
import { toast } from 'react-toastify';

const ManagingEditorDashboard = () => {
    const { authToken, userRole, isAuthReady } = useContext(AuthContext);

    const [papers, setPapers] = useState([]);
    const [activeTab, setActiveTab] = useState('triage');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [modalState, setModalState] = useState({ type: null, paper: null });
    const [rejectModal, setRejectModal] = useState({ isOpen: false, paper: null });
    const [rejectReason, setRejectReason] = useState('');
    const [isRejecting, setIsRejecting] = useState(false);
    const [contactTarget, setContactTarget] = useState(null);

    const [showArchiveForm, setShowArchiveForm] = useState(false);

    const normalizedRole = useMemo(() =>
        userRole?.toUpperCase().replace(/[\s_]+/g, '_').trim() || "",
        [userRole]);

    const fetchPapers = useCallback(async () => {
        if (!authToken) return;
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/journal-papers/editor-queue`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            const incomingData = res.data.data || res.data;
            setPapers(Array.isArray(incomingData) ? incomingData : []);
        } catch (e) {
            console.error("Editorial Queue Fetch Error:", e);
        } finally {
            setLoading(false);
        }
    }, [authToken]);

    useEffect(() => {
        if (isAuthReady && authToken) fetchPapers();
    }, [isAuthReady, authToken, fetchPapers]);

    const updateStatus = async (paperId, newStatus) => {
        try {
            await axios.put(`${API_BASE_URL}/journal-papers/${paperId}/production-status`,
                { status: newStatus },
                { headers: { 'Authorization': `Bearer ${authToken}` } }
            );
            fetchPapers();
            toast.success("Manuscript stage updated.");
        } catch (err) {
            toast.error("Failed to update manuscript stage.");
        }
    };

    const openRejectModal = (paper) => {
        setRejectReason('');
        setRejectModal({ isOpen: true, paper });
    };

    const submitDeskReject = async () => {
        if (!rejectReason || rejectReason.length < 10) {
            toast.warn("Please provide a substantial reason for rejection (min 10 chars).");
            return;
        }
        setIsRejecting(true);
        try {
            await axios.post(
                `${API_BASE_URL}/journal-papers/${rejectModal.paper.id}/reject`,
                { reason: rejectReason },
                { headers: { 'Authorization': `Bearer ${authToken}` } }
            );
            setRejectModal({ isOpen: false, paper: null });
            fetchPapers();
            toast.success("Manuscript desk rejected and author notified.");
        } catch (error) {
            toast.error("Rejection failed.");
        } finally {
            setIsRejecting(false);
        }
    };

    const handleRevokeAE = async (paper) => {
        const confirmRevoke = window.confirm(
            `Are you sure you want to revoke the assignment from ${paper.ae_name || 'the current Associate Editor'}?\n\nThis manuscript will return to your Triage queue.`
        );
        if (!confirmRevoke) return;

        try {
            await axios.post(
                `${API_BASE_URL}/journal-papers/${paper.id}/revoke-associate`,
                {},
                { headers: { 'Authorization': `Bearer ${authToken}` } }
            );
            toast.info('Assignment revoked. Manuscript returned to Triage.');
            fetchPapers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to revoke Associate Editor.');
        }
    };

    const filteredPapers = useMemo(() => {
        const categories = { triage: [], monitoring: [], reviewerAlerts: [], decision: [], production: [], archive: [] };

        const searched = papers.filter(p => {
            if (!searchTerm.trim()) return true;

            const term = searchTerm.toLowerCase().trim();
            return (
                p.title?.toLowerCase().includes(term) ||
                p.author_name?.toLowerCase().includes(term) ||
                p.id.toString() === term
            );
        });

        searched.forEach(p => {
            const s = String(p.status || '').toUpperCase().replace(/[\s_]+/g, '');

            if (s === 'PUBLISHED' || s === 'REJECTED' || s === 'REJECT' || s === 'ARCHIVED') {
                categories.archive.push(p);
            }
            else if (['ACCEPTED', 'PRODUCTION', 'INPRODUCTION', 'LANGUAGEEDITION', 'COPYLAYOUTEDITION', 'PROOFREADING', 'READYTOPUBLISH'].includes(s)) {
                categories.production.push(p);
            }
            else if (s === 'DECISIONPENDING' || s === 'REVIEWSRECEIVED' || s === 'REVIEWCOMPLETED') {
                categories.decision.push(p);
            }
            else if (s === 'SUBMITTED' || s === 'INITIALCHECK') {
                categories.triage.push(p);
            }
            else if (s === 'WITHASSOCIATEEDITOR' || s === 'UNDERREVIEW' || s === 'TECHNICALASSESSMENT') {
                categories.monitoring.push(p);
            }
            else if (p.reviews?.some(rev => String(rev.invitation_status).toUpperCase() === 'DECLINED')) {
                categories.reviewerAlerts.push(p);
            }
        });
        return categories;
    }, [papers, searchTerm]);

    const tabs = [
        { id: 'triage', label: 'Triage', icon: <ArrowRight size={16} />, count: filteredPapers.triage.length },
        { id: 'monitoring', label: 'In Review', icon: <Eye size={16} />, count: filteredPapers.monitoring.length },
        { id: 'reviewerAlerts', label: 'Alerts', icon: <AlertTriangle size={16} />, count: filteredPapers.reviewerAlerts.length },
        { id: 'decision', label: 'Decision', icon: <FileCheck size={16} />, count: filteredPapers.decision.length },
        { id: 'production', label: 'Production', icon: <History size={16} />, count: filteredPapers.production.length },
        { id: 'archive', label: 'Archive', icon: <Search size={16} />, count: filteredPapers.archive.length },
    ];

    return (
        <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-xl"><Landmark size={28} /></div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Managing Editor</h2>
                            <p className="text-slate-500 font-medium">Global Manuscript Oversight</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 items-center">
                        <button
                            onClick={() => setShowArchiveForm(!showArchiveForm)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 ${showArchiveForm
                                ? 'bg-slate-800 text-white shadow-slate-200'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100'
                                }`}
                        >
                            <Archive size={18} />
                            {showArchiveForm ? 'Close Importer' : 'Import Legacy PDF'}
                        </button>

                        <Link
                            to="/admin/journal-compiler"
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-800 transition-all shadow-lg shadow-blue-100 active:scale-95"
                        >
                            <Layers size={18} />
                            Issue Compiler
                        </Link>

                        <div className="text-[10px] font-black uppercase tracking-[0.2em] bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl border border-indigo-100">
                            Role: {normalizedRole}
                        </div>
                    </div>
                </div>

                {showArchiveForm && (
                    <div className="mt-6 animate-in slide-in-from-top-4 duration-500">
                        <AddArchivedEdition
                            onEditionAdded={() => {
                                setShowArchiveForm(false);
                                fetchPapers();
                            }}
                        />
                    </div>
                )}

                {/* Search Bar */}
                <div className="relative max-w-2xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by ID, Title, or Author..."
                        className="w-full pl-12 pr-10 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            <X size={18} />
                        </button>
                    )}
                </div>

                {/* Tab Navigation */}
                <div className="flex bg-slate-200/50 p-1.5 rounded-2xl w-fit border border-slate-200 overflow-x-auto">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 py-2.5 px-6 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-blue-700 shadow-md' : 'text-slate-500 hover:text-blue-600'}`}>
                            {tab.icon} {tab.label}
                            <span className={`ml-1 px-2 py-0.5 rounded-lg text-[10px] ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-slate-400 text-white'}`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                {loading ? (
                    <div className="p-32 text-center flex flex-col items-center gap-4"><Loader2 className="animate-spin h-10 w-10 text-slate-900" /><p className="font-black text-slate-400 uppercase text-[10px]">Updating Queue...</p></div>
                ) : filteredPapers[activeTab].length === 0 ? (
                    <div className="p-24 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                        <MessageSquare size={48} className="mx-auto text-slate-200 mb-2" />
                        <p className="text-slate-400 font-bold uppercase text-xs">No manuscripts in {activeTab}</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredPapers[activeTab].map(p => {
                            const normalizedStatus = String(p.status || '').toUpperCase().replace(/[\s_]+/g, '');

                            return (
                                <div key={p.id} className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm transition-all hover:shadow-xl group overflow-hidden">
                                    <div className="flex flex-col lg:flex-row justify-between items-start gap-8 min-w-0 w-full">

                                        {/* ======================================================== */}
                                        {/* LEFT COLUMN: METADATA, VERSION COMPARISON & INTELLIGENCE */}
                                        {/* ======================================================== */}
                                        <div className="flex-1 space-y-5 min-w-0 w-full">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-lg tracking-widest uppercase shadow-sm">ID: #{p.id}</span>

                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase border ${p.status === 'Accepted' ? 'bg-green-100 text-green-700 border-green-200' :
                                                    p.status === 'Rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                                                        p.status === 'Under Review' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                                            p.status === 'Revisions Required' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                                                'bg-blue-100 text-blue-700 border-blue-200'
                                                    }`}>
                                                    {p.status}
                                                </span>

                                                <span className="bg-purple-100 text-purple-700 border border-purple-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                                    {p.specialization}
                                                </span>

                                                <span className="bg-teal-100 text-teal-700 border border-teal-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                                    {p.article_type}
                                                </span>
                                            </div>
                                            <h4 className="font-black text-2xl text-slate-800 leading-tight group-hover:text-blue-700 transition-colors break-words">
                                                <LatexRenderer content={p.title} />
                                            </h4>
                                            
                                            {/* Author & Direct Contact */}
                                            <div className="text-sm font-medium text-slate-600 flex items-center gap-3 flex-wrap">
                                                <span>Author: <strong className="text-slate-900 font-black">{p.author_name || "N/A"}</strong></span>
                                                
                                                {p.author_email && (
                                                    <span className="text-xs text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-lg font-mono flex items-center gap-1.5 shadow-sm">
                                                        <Mail size={12} className="text-blue-500" />
                                                        {p.author_email}
                                                    </span>
                                                )}

                                                {p.author_email && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setContactTarget({
                                                            type: 'author',
                                                            paper: p,
                                                            name: p.author_name,
                                                            email: p.author_email,
                                                            endpoint: `${API_BASE_URL}/journal-papers/${p.id}/contact-author`
                                                        })}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
                                                    >
                                                        <Mail size={12} />
                                                        <span>Contact Author</span>
                                                    </button>
                                                )}
                                            </div>

                                            {/* ========================================================================= */}
                                            {/* --- VERSION COMPARISON BOX: ORIGINAL PDF VS REVISED PDF ---              */}
                                            {/* ========================================================================= */}
                                            {(p.author_revision_notes || p.previous_manuscript_file_url || normalizedStatus === 'REVISIONSUBMITTED') && (
                                                <div className="mt-4 p-5 bg-amber-50/80 border-2 border-amber-200 rounded-3xl space-y-4 shadow-sm">
                                                    <div className="flex items-center justify-between border-b border-amber-200 pb-2.5">
                                                        <div className="flex items-center gap-2">
                                                            <History size={18} className="text-amber-700" />
                                                            <span className="text-xs font-black text-amber-900 uppercase tracking-wider">
                                                                Manuscript Version Comparison & Rebuttal
                                                            </span>
                                                        </div>
                                                        <span className="text-[10px] font-bold uppercase bg-amber-200 text-amber-800 px-2.5 py-0.5 rounded-full">
                                                            Revision Evaluation
                                                        </span>
                                                    </div>

                                                    {/* Compare PDFs Grid */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {/* Version 1: Original */}
                                                        <div className="p-4 bg-white rounded-2xl border border-amber-200 shadow-sm flex flex-col justify-between space-y-2">
                                                            <div>
                                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                                                                    Version 1 — Original Submission
                                                                </span>
                                                                <p className="text-xs text-slate-600 mt-0.5 font-medium">Initial submission before reviewer feedback</p>
                                                            </div>
                                                            {p.previous_manuscript_file_url ? (
                                                                <a
                                                                    href={`${STATIC_ASSETS_BASE_URL}/uploads/${p.previous_manuscript_file_url.replace(/^(\/?uploads\/)/, "")}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
                                                                >
                                                                    <Download size={14} /> Download Original PDF
                                                                </a>
                                                            ) : (
                                                                <span className="text-xs text-slate-400 italic">No prior version archived.</span>
                                                            )}
                                                        </div>

                                                        {/* Version 2: Revised */}
                                                        <div className="p-4 bg-white rounded-2xl border border-emerald-300 shadow-sm flex flex-col justify-between space-y-2 bg-emerald-50/30">
                                                            <div>
                                                                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest block">
                                                                    Version 2 — Revised Manuscript
                                                                </span>
                                                                <p className="text-xs text-slate-600 mt-0.5 font-medium">Updated submission addressing reviewer remarks</p>
                                                            </div>
                                                            <a
                                                                href={`${STATIC_ASSETS_BASE_URL}/uploads/${(p.manuscript_file_url || '').replace(/^(\/?uploads\/)/, "")}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                                                            >
                                                                <Download size={14} /> Download Revised PDF
                                                            </a>
                                                        </div>
                                                    </div>

                                                    {/* Author's Point-by-Point Rebuttal Notes */}
                                                    {p.author_revision_notes && (
                                                        <div className="p-4 bg-white rounded-2xl border border-amber-200 text-xs text-slate-800 leading-relaxed font-serif">
                                                            <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest block mb-1">
                                                                Author's Point-by-Point Response to Reviewers:
                                                            </span>
                                                            <LatexRenderer content={p.author_revision_notes} />
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* ASSIGNED ASSOCIATE EDITOR INFO */}
                                            {p.associate_editor_id && (
                                                <div className="mt-3 p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-center justify-between gap-3 flex-wrap">
                                                    <div className="flex items-center gap-3.5 min-w-0">
                                                        <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-black uppercase shadow-sm shrink-0">
                                                            {p.ae_name ? p.ae_name.charAt(0) : 'AE'}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none">
                                                                Assigned Associate Editor
                                                            </p>
                                                            <p className="text-sm font-bold text-slate-800 mt-1 truncate">
                                                                {p.ae_name || `ID #${p.associate_editor_id}`}
                                                            </p>
                                                            <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 mt-0.5 font-medium">
                                                                {p.ae_email && <span>{p.ae_email}</span>}
                                                                {p.ae_assigned_at && (
                                                                    <span>• Assigned: {new Date(p.ae_assigned_at).toLocaleDateString()}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Action buttons for AE */}
                                                    <div className="flex items-center gap-2">
                                                        {p.ae_email && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setContactTarget({
                                                                    type: 'associate',
                                                                    paper: p,
                                                                    name: p.ae_name,
                                                                    email: p.ae_email,
                                                                    endpoint: `${API_BASE_URL}/journal-papers/${p.id}/contact-associate`
                                                                })}
                                                                className="px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                                                            >
                                                                <Mail size={12} /> Contact AE
                                                            </button>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => setModalState({ type: 'assign-associate', paper: p })}
                                                            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-bold transition-all"
                                                        >
                                                            Reassign
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Decision Intelligence: ME sees AE Recommendation + Reviewer Notes */}
                                            {activeTab === 'decision' && (
                                                <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-2">
                                                    {/* 1. Associate Editor Details & Recommendation */}
                                                    <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 shadow-inner space-y-2">
                                                        <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                                                            <div className="flex items-center gap-2 text-indigo-700">
                                                                <MessageSquare size={18} />
                                                                <h5 className="text-[10px] font-black uppercase tracking-[0.2em]">Handling Associate Editor</h5>
                                                            </div>
                                                            {p.ae_email && (
                                                                <span className="text-xs font-semibold text-indigo-900">
                                                                    {p.ae_name} &lt;{p.ae_email}&gt;
                                                                </span>
                                                            )}
                                                        </div>
                                                        
                                                        <p className="text-xl font-bold text-indigo-900">
                                                            AE Recommendation: <span className="underline">{p.ae_recommendation || "Verdict Pending"}</span>
                                                        </p>

                                                        {p.internal_workflow_notes && (
                                                            <div className="text-sm text-indigo-800 italic border-t border-indigo-200 pt-3 mt-2 leading-relaxed">
                                                                <strong>Confidential Rationale to EIC:</strong> <LatexRenderer content={p.internal_workflow_notes} />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* 2. Reviewer Reports with Names & Emails Revealed */}
                                                    <div className="space-y-3">
                                                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                            <Info size={14} /> Peer Review Evaluations & Identity
                                                        </h5>

                                                        <div className="grid md:grid-cols-2 gap-4">
                                                            {p.reviews?.filter(r => r.is_completed).map((rev, idx) => (
                                                                <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm text-xs space-y-2.5">
                                                                    <div className="border-b border-slate-100 pb-2 flex justify-between items-center flex-wrap gap-2">
                                                                        <div>
                                                                            <span className="font-bold text-slate-900 block text-sm">
                                                                                {rev.reviewer_name || `Reviewer ${idx + 1}`} (Round {rev.round_number || 1})
                                                                            </span>
                                                                            <span className="text-[11px] text-slate-400">
                                                                                {rev.reviewer_email || 'Email unavailable'}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="inline-block font-black text-[10px] uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                                                                                Verdict: {rev.recommendation || 'N/A'}
                                                                            </span>
                                                                            
                                                                            {rev.reviewer_email && (
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => setContactTarget({
                                                                                        type: 'reviewer',
                                                                                        paper: p,
                                                                                        name: rev.reviewer_name || `Reviewer #${idx + 1}`,
                                                                                        email: rev.reviewer_email || '',
                                                                                        endpoint: `${API_BASE_URL}/journal-papers/reviews/${rev.id || rev.review_id}/contact`
                                                                                    })}
                                                                                    className="px-2 py-0.5 bg-slate-50 hover:bg-indigo-50 text-indigo-600 border border-slate-200 rounded-md text-[11px] font-bold transition-all flex items-center gap-1"
                                                                                >
                                                                                    <Mail size={11} />
                                                                                    <span>Message</span>
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    <RubricScoreDisplay rawScores={rev.rubric_scores} />

                                                                    {rev.comments_for_editor && (
                                                                        <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-100 text-amber-900 italic">
                                                                            <span className="font-black text-[9px] uppercase block mb-1 text-amber-700">Confidential Note to Editor:</span>
                                                                            <LatexRenderer content={rev.comments_for_editor} />
                                                                        </div>
                                                                    )}

                                                                    <div className="text-slate-600 leading-relaxed pt-1">
                                                                        <span className="font-black text-[9px] uppercase block mb-1 text-slate-400">Comments for Author:</span>
                                                                        <LatexRenderer content={rev.comments_for_author} />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* ======================================================== */}
                                        {/* RIGHT COLUMN: ACTION BUTTONS                             */}
                                        {/* ======================================================== */}
                                        <div className="lg:w-72 w-full flex flex-col gap-3 shrink-0 lg:sticky lg:top-4">
                                            <a
                                                href={`${STATIC_ASSETS_BASE_URL}/uploads/${(p.production_file_url || p.manuscript_file_url || '').replace(/^(\/?uploads\/)/, "")}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 w-full py-3 border-2 border-slate-100 text-slate-600 font-black text-xs rounded-2xl hover:bg-slate-50 uppercase tracking-widest"
                                            >
                                                <Download size={18} />
                                                {p.production_file_url ? "View Final Production" : "View Manuscript"}
                                            </a>

                                            {/* --- TRIAGE TAB ACTIONS --- */}
                                            {activeTab === 'triage' && (
                                                <div className="space-y-3">
                                                    <button onClick={() => setModalState({ type: 'assign-associate', paper: p })} className="w-full py-4 bg-blue-600 text-white font-black text-xs rounded-2xl hover:bg-blue-700 uppercase shadow-lg transition-all">Assign AE</button>
                                                    <button onClick={() => openRejectModal(p)} className="w-full py-3 border-2 border-rose-200 text-rose-600 font-black text-xs rounded-2xl hover:bg-rose-50 uppercase transition-all">Desk Reject</button>
                                                </div>
                                            )}

                                            {/* --- MONITORING / IN REVIEW ACTIONS --- */}
                                            {activeTab === 'monitoring' && ['MANAGING_EDITOR', 'ADMIN', 'EIC', 'EDITOR_IN_CHIEF'].includes(normalizedRole) && (
                                                <div className="space-y-2">
                                                    <button
                                                        onClick={() => setModalState({ type: 'assign-associate', paper: p })}
                                                        className="w-full py-3 bg-indigo-600 text-white font-black text-xs rounded-2xl hover:bg-indigo-700 uppercase tracking-wider shadow-md shadow-indigo-100 transition-all flex items-center justify-center gap-2 active:scale-95"
                                                    >
                                                        <UserPlus size={15} /> Reassign to New AE
                                                    </button>

                                                    <button
                                                        onClick={() => handleRevokeAE(p)}
                                                        className="w-full py-2.5 bg-white border-2 border-rose-200 text-rose-600 font-bold text-xs rounded-2xl hover:bg-rose-50 uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 active:scale-95"
                                                    >
                                                        <XCircle size={15} /> Revoke & Return to Triage
                                                    </button>

                                                    <p className="text-[10px] text-slate-400 text-center italic mt-1 leading-tight">
                                                        Use if Associate Editor is inactive or requires redirection.
                                                    </p>
                                                </div>
                                            )}

                                            {/* --- DECISION ACTIONS --- */}
                                            {activeTab === 'decision' && (
                                                <button 
                                                    onClick={() => setModalState({ type: 'make-decision', paper: p })} 
                                                    className="w-full py-4 bg-indigo-600 text-white font-black text-xs rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 uppercase tracking-widest flex items-center justify-center gap-2"
                                                >
                                                    <FileCheck size={18} /> Final Decision
                                                </button>
                                            )}

                                            {/* --- ARCHIVE STATUS --- */}
                                            {activeTab === 'archive' && (
                                                <div className="space-y-2">
                                                    <div className={`flex items-center justify-center gap-2 py-3 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest ${p.status?.toUpperCase() === 'PUBLISHED' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                                                        {p.status?.toUpperCase() === 'PUBLISHED' ? <CheckCircle size={14} /> : <XCircle size={14} />} {p.status}
                                                    </div>
                                                </div>
                                            )}

                                            {/* --- PRODUCTION TAB ACTIONS (RESTORED & BULLETPROOF) --- */}
                                            {activeTab === 'production' && (
                                                <div className="space-y-3">
                                                    {(() => {
                                                        const normalizedStatus = (p.status || '').toUpperCase().replace(/[\s_]+/g, '');
                                                        const isManager = ['MANAGING_EDITOR', 'EDITOR_IN_CHIEF', 'EIC', 'ADMIN'].includes(normalizedRole);

                                                        return (
                                                            <div className="space-y-2.5">
                                                                {/* 1. ASSIGN / REASSIGN STAFF BUTTON */}
                                                                {isManager && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setModalState({ type: 'assign-production', paper: p })}
                                                                        className={`w-full py-3.5 text-white font-black text-xs rounded-2xl uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 ${
                                                                            !p.production_staff_id 
                                                                                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100 ring-2 ring-emerald-400' 
                                                                                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
                                                                        }`}
                                                                    >
                                                                        <UserPlus size={16} />
                                                                        <span>{!p.production_staff_id ? 'Assign Production Staff' : 'Reassign Staff'}</span>
                                                                    </button>
                                                                )}

                                                                {/* 2. PRODUCTION PIPELINE STAGES */}
                                                                {normalizedStatus === 'PROOFREADING' ? (
                                                                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center shadow-inner">
                                                                        <Loader2 className="animate-spin mx-auto text-amber-600 mb-2" size={20} />
                                                                        <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest block">
                                                                            Awaiting Author Proofreading
                                                                        </span>
                                                                        <span className="text-[9px] text-amber-600">48–72h turnaround in progress</span>
                                                                    </div>
                                                                ) : (normalizedStatus === 'READYTOPUBLISH' || normalizedStatus === 'READYFORPUBLICATION') ? (
                                                                    isManager ? (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setModalState({ type: 'upload-production', paper: p })}
                                                                            className="w-full py-4 bg-blue-900 hover:bg-slate-900 text-white font-black text-xs rounded-2xl shadow-xl uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
                                                                        >
                                                                            <FileCheck size={16} /> Finalize & Publish
                                                                        </button>
                                                                    ) : (
                                                                        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                                                                            <CheckCircle className="mx-auto text-emerald-600 mb-1" size={18} />
                                                                            <span className="text-[10px] font-black text-emerald-800 uppercase">Pending EIC Publication</span>
                                                                        </div>
                                                                    )
                                                                ) : (normalizedStatus === 'COPYLAYOUTEDITION' || normalizedStatus === 'COPYLAYOUT') ? (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setModalState({ type: 'send-proof', paper: p })}
                                                                        className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs rounded-2xl uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2"
                                                                    >
                                                                        <Send size={15} /> Send Proof to Author
                                                                    </button>
                                                                ) : (normalizedStatus === 'LANGUAGEEDITION' || normalizedStatus === 'LANGUAGEEDITING') ? (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => updateStatus(p.id, 'Copy Layout Edition')}
                                                                        className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-2xl uppercase tracking-widest shadow-md transition-all"
                                                                    >
                                                                        Start Copy Layout
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => updateStatus(p.id, 'Language Edition')}
                                                                        className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-2xl uppercase tracking-widest shadow-md transition-all"
                                                                    >
                                                                        Start Language Editing
                                                                    </button>
                                                                )}

                                                                {/* Assigned Staff ID Badge */}
                                                                {p.production_staff_id && (
                                                                    <div className="px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-[9px] font-black text-slate-500">
                                                                        <span>STAFF ASSIGNED:</span>
                                                                        <span className="text-slate-800 font-bold uppercase font-mono">ID #{p.production_staff_id}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            )}
                                        </div>

                                    </div>

                                    {/* Workflow Stepper at bottom */}
                                    <div className="mt-10 pt-8 border-t border-slate-50">
                                        <WorkflowStepper currentStatus={p.status} role="MANAGING_EDITOR" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* --- MODALS --- */}
                {
                    modalState.type === 'send-proof' && (
                        <SendProofModal
                            paper={modalState.paper}
                            onClose={() => setModalState({ type: null, paper: null })}
                            onComplete={() => { fetchPapers(); setModalState({ type: null, paper: null }); }}
                        />
                    )
                }
                {
                    modalState.type === 'make-decision' && (
                        <MakeDecisionModal paper={modalState.paper} onClose={() => setModalState({ type: null, paper: null })} onDecisionMade={() => { setModalState({ type: null, paper: null }); fetchPapers(); }} />
                    )
                }

                {
                    modalState.type === 'upload-production' && (
                        <UploadProductionModal paper={modalState.paper} onClose={() => setModalState({ type: null, paper: null })} onUploadComplete={() => { fetchPapers(); setModalState({ type: null, paper: null }); }} />
                    )
                }

                {
                    (modalState.type === 'assign-associate' || modalState.type === 'invite-reviewer' || modalState.type === 'assign-production') && (
                        <AssignReviewerModal
                            paper={modalState.paper}
                            mode={modalState.type === 'assign-production' ? 'production' : (modalState.type === 'assign-associate' ? 'associate' : 'reviewer')}
                            onClose={() => setModalState({ type: null, paper: null })}
                            onAssignmentComplete={() => { fetchPapers(); setModalState({ type: null, paper: null }); }}
                        />
                    )
                }

                {
                    rejectModal.isOpen && (
                        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
                            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in duration-200">
                                <div className="p-6 border-b flex justify-between items-center bg-rose-50">
                                    <h3 className="text-lg font-black text-rose-900 uppercase">Confirm Desk Rejection</h3>
                                    <button onClick={() => setRejectModal({ isOpen: false, paper: null })}>
                                        <X size={24} className="text-rose-400" />
                                    </button>
                                </div>

                                <div className="p-8 space-y-4 overflow-y-auto flex-1">
                                    <LatexEditor
                                        value={rejectReason}
                                        onChange={setRejectReason}
                                        placeholder="e.g., Out of scope..."
                                    />
                                    <div className="p-3 bg-slate-50 rounded-xl border border-dotted border-slate-200">
                                        <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">
                                            Live LaTeX Preview:
                                        </span>
                                        <div className="text-sm text-slate-600">
                                            <LatexRenderer content={rejectReason} />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-slate-50 border-t flex justify-end gap-3">
                                    <button
                                        onClick={() => setRejectModal({ isOpen: false, paper: null })}
                                        className="px-6 py-2 font-bold text-slate-400"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={submitDeskReject}
                                        disabled={isRejecting}
                                        className="px-8 py-3 bg-rose-600 text-white font-black text-xs rounded-xl uppercase tracking-widest shadow-lg active:scale-95"
                                    >
                                        {isRejecting ? <Loader2 className="animate-spin" size={16} /> : "Confirm Reject"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* ✅ EDITORIAL CONTACT MODAL: Direct Messaging */}
                {contactTarget && (
                    <EditorialContactModal
                        recipientType={contactTarget.type}
                        recipientName={contactTarget.name}
                        recipientEmail={contactTarget.email}
                        paper={contactTarget.paper}
                        endpoint={contactTarget.endpoint}
                        onClose={() => setContactTarget(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default ManagingEditorDashboard;



// import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../../../context/AuthContext';
// import { API_BASE_URL, STATIC_ASSETS_BASE_URL } from '../../../utils/constants';
// import WorkflowStepper from './common/WorkflowStepper';
// import AssignReviewerModal from './Editor/AssignReviewerModal';
// import MakeDecisionModal from './Editor/MakeDecisionModal';
// import SendProofModal from './Editor/SendProofModal';
// import ContactAuthorModal from './Editor/ContactAuthorModal';
// import { Mail } from 'lucide-react'; 
// import EditorialContactModal from './Editor/EditorialContactModal';

// import { Link } from 'react-router-dom';

// import UploadProductionModal from './Editor/UploadProductionModal';
// import {
//     Download, ArrowRight, UserPlus, XCircle, FileCheck, Archive,
//     Landmark, MessageSquare, AlertTriangle, History, Search, CheckCircle, Loader2, X, Eye, Info, Layers
// } from 'lucide-react';
// import LatexRenderer from '../../common/LatexRenderer';
// import LatexEditor from '../../common/LatexEditor';
// import AddArchivedEdition from './Editor/AddArchivedEdition';
// import { toast } from 'react-toastify';

// import RubricScoreDisplay from './common/RubricScoreDisplay';

// // --- DYNAMIC PRODUCTION CONFIGURATION ---
// const PRODUCTION_STEPS = {
//     'ACCEPTED': { label: 'Assign Staff', icon: <UserPlus size={16} className="inline mr-2" />, color: 'bg-emerald-600 hover:bg-emerald-700', modal: 'assign-production' },
//     'INPRODUCTION': { label: 'Start Language Editing', color: 'bg-purple-600 hover:bg-purple-700', nextStatus: 'Language Edition' },
//     'PRODUCTION': { label: 'Start Language Editing', color: 'bg-purple-600 hover:bg-purple-700', nextStatus: 'Language Edition' },
//     'LANGUAGEEDITION': { label: 'Start Copy Layout', color: 'bg-indigo-600 hover:bg-indigo-700', nextStatus: 'Copy Layout Edition' },
//     'COPYLAYOUTEDITION': { label: 'Send Proof to Author', color: 'bg-orange-600 hover:bg-orange-700', modal: 'send-proof' },
// };

// const ManagingEditorDashboard = () => {
//     const { authToken, userRole, isAuthReady } = useContext(AuthContext);

//     // Core State
//     const [papers, setPapers] = useState([]);
//     const [activeTab, setActiveTab] = useState('triage');
//     const [loading, setLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState('');


//     const [contactTarget, setContactTarget] = useState(null); 

//     // Modal States
//     const [modalState, setModalState] = useState({ type: null, paper: null });
//     const [rejectModal, setRejectModal] = useState({ isOpen: false, paper: null });
//     const [rejectReason, setRejectReason] = useState('');
//     const [isRejecting, setIsRejecting] = useState(false);

//     const [showArchiveForm, setShowArchiveForm] = useState(false);

//     const normalizedRole = useMemo(() =>
//         userRole?.toUpperCase().replace(/[\s_]+/g, '_').trim() || "",
//         [userRole]);

//     // Data Fetching
//     const fetchPapers = useCallback(async () => {
//         if (!authToken) return;
//         setLoading(true);
//         try {
//             const res = await axios.get(`${API_BASE_URL}/journal-papers/editor-queue`, {
//                 headers: { 'Authorization': `Bearer ${authToken}` }
//             });
//             const incomingData = res.data.data || res.data;
//             setPapers(Array.isArray(incomingData) ? incomingData : []);
//         } catch (e) {
//             console.error("Editorial Queue Fetch Error:", e);
//         } finally {
//             setLoading(false);
//         }
//     }, [authToken]);

//     useEffect(() => {
//         if (isAuthReady && authToken) fetchPapers();
//     }, [isAuthReady, authToken, fetchPapers]);

//     // Production Status Updater
//     const updateStatus = async (paperId, newStatus) => {
//         try {
//             await axios.put(`${API_BASE_URL}/journal-papers/${paperId}/production-status`,
//                 { status: newStatus },
//                 { headers: { 'Authorization': `Bearer ${authToken}` } }
//             );
//             fetchPapers();
//         } catch (err) {
//             alert("Failed to update manuscript stage.");
//         }
//     };

//     // Desk Reject Handlers
//     const openRejectModal = (paper) => {
//         setRejectReason('');
//         setRejectModal({ isOpen: true, paper });
//     };

//     const submitDeskReject = async () => {
//         if (!rejectReason || rejectReason.length < 10) {
//             toast.warn("Please provide a substantial reason for rejection (min 10 characters).");
//             return;
//         }
//         setIsRejecting(true);
//         try {
//             await axios.post(
//                 `${API_BASE_URL}/journal-papers/${rejectModal.paper.id}/reject`,
//                 { reason: rejectReason },
//                 { headers: { 'Authorization': `Bearer ${authToken}` } }
//             );
//             setRejectModal({ isOpen: false, paper: null });
//             fetchPapers();
//             toast.success("Manuscript desk rejected and author notified by email.");
//         } catch (error) {
//             toast.error("Rejection failed. Please try again.");
//         } finally {
//             setIsRejecting(false);
//         }
//     };

//     const handleRevokeAE = async (paper) => {
//         const confirmRevoke = window.confirm(
//             `Are you sure you want to revoke the assignment from ${paper.ae_name || 'the current Associate Editor'}?\n\nThis manuscript will return to your Triage queue.`
//         );
//         if (!confirmRevoke) return;

//         try {
//             await axios.post(
//                 `${API_BASE_URL}/journal-papers/${paper.id}/revoke-associate`,
//                 {},
//                 { headers: { 'Authorization': `Bearer ${authToken}` } }
//             );
//             toast.info('Assignment revoked. Manuscript returned to Triage.');
//             fetchPapers();
//         } catch (err) {
//             toast.error(err.response?.data?.message || 'Failed to revoke Associate Editor.');
//         }
//     };

//     // --- SEARCH & FILTER LOGIC ---
//     const filteredPapers = useMemo(() => {
//         const categories = { triage: [], monitoring: [], reviewerAlerts: [], decision: [], production: [], archive: [] };

//         const searched = papers.filter(p => {
//             if (!searchTerm.trim()) return true;

//             const term = searchTerm.toLowerCase().trim();
//             return (
//                 p.title?.toLowerCase().includes(term) ||
//                 p.author_name?.toLowerCase().includes(term) ||
//                 p.id.toString() === term
//             );
//         });

//         searched.forEach(p => {
//             const s = String(p.status || '').toUpperCase().replace(/[\s_]+/g, '');

//             if (s === 'PUBLISHED' || s === 'REJECTED' || s === 'REJECT' || s === 'ARCHIVED') {
//                 categories.archive.push(p);
//             }
//             else if (['ACCEPTED', 'PRODUCTION', 'INPRODUCTION', 'LANGUAGEEDITION', 'COPYLAYOUTEDITION', 'PROOFREADING', 'READYTOPUBLISH'].includes(s)) {
//                 categories.production.push(p);
//             }
//             else if (s === 'DECISIONPENDING' || s === 'REVIEWSRECEIVED' || s === 'REVIEWCOMPLETED') {
//                 categories.decision.push(p);
//             }
//             else if (s === 'SUBMITTED' || s === 'INITIALCHECK') {
//                 categories.triage.push(p);
//             }
//             else if (s === 'WITHASSOCIATEEDITOR' || s === 'UNDERREVIEW' || s === 'TECHNICALASSESSMENT') {
//                 categories.monitoring.push(p);
//             }
//             else if (p.reviews?.some(rev => String(rev.invitation_status).toUpperCase() === 'DECLINED')) {
//                 categories.reviewerAlerts.push(p);
//             }
//         });
//         return categories;
//     }, [papers, searchTerm]);

//     const tabs = [
//         { id: 'triage', label: 'Triage', icon: <ArrowRight size={16} />, count: filteredPapers.triage.length },
//         { id: 'monitoring', label: 'In Review', icon: <Eye size={16} />, count: filteredPapers.monitoring.length },
//         { id: 'reviewerAlerts', label: 'Alerts', icon: <AlertTriangle size={16} />, count: filteredPapers.reviewerAlerts.length },
//         { id: 'decision', label: 'Decision', icon: <FileCheck size={16} />, count: filteredPapers.decision.length },
//         { id: 'production', label: 'Production', icon: <History size={16} />, count: filteredPapers.production.length },
//         { id: 'archive', label: 'Archive', icon: <Search size={16} />, count: filteredPapers.archive.length },
//     ];

//     return (
//         <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8">
//             <div className="max-w-7xl mx-auto space-y-6">

//                 {/* Dashboard Header */}
//                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
//                     <div className="flex items-center gap-4">
//                         <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-xl"><Landmark size={28} /></div>
//                         <div>
//                             <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Managing Editor</h2>
//                             <p className="text-slate-500 font-medium">Global Manuscript Oversight</p>
//                         </div>
//                     </div>

//                     <div className="flex flex-wrap gap-3 items-center">
//                         <button
//                             onClick={() => setShowArchiveForm(!showArchiveForm)}
//                             className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 ${showArchiveForm
//                                 ? 'bg-slate-800 text-white shadow-slate-200'
//                                 : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100'
//                                 }`}
//                         >
//                             <Archive size={18} />
//                             {showArchiveForm ? 'Close Importer' : 'Import Legacy PDF'}
//                         </button>

//                         <Link
//                             to="/admin/journal-compiler"
//                             className="flex items-center gap-2 px-5 py-2.5 bg-blue-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-800 transition-all shadow-lg shadow-blue-100 active:scale-95"
//                         >
//                             <Layers size={18} />
//                             Issue Compiler
//                         </Link>

//                         <div className="text-[10px] font-black uppercase tracking-[0.2em] bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl border border-indigo-100">
//                             Role: {normalizedRole}
//                         </div>
//                     </div>
//                 </div>

//                 {showArchiveForm && (
//                     <div className="mt-6 animate-in slide-in-from-top-4 duration-500">
//                         <AddArchivedEdition
//                             onEditionAdded={() => {
//                                 setShowArchiveForm(false);
//                                 fetchPapers();
//                             }}
//                         />
//                     </div>
//                 )}

//                 {/* Search Bar */}
//                 <div className="relative max-w-2xl">
//                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
//                     <input
//                         type="text"
//                         placeholder="Search by ID, Title, or Author..."
//                         className="w-full pl-12 pr-10 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                     {searchTerm && (
//                         <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
//                             <X size={18} />
//                         </button>
//                     )}
//                 </div>

//                 {/* Tab Navigation */}
//                 <div className="flex bg-slate-200/50 p-1.5 rounded-2xl w-fit border border-slate-200 overflow-x-auto">
//                     {tabs.map(tab => (
//                         <button key={tab.id} onClick={() => setActiveTab(tab.id)}
//                             className={`flex items-center gap-3 py-2.5 px-6 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-blue-700 shadow-md' : 'text-slate-500 hover:text-blue-600'}`}>
//                             {tab.icon} {tab.label}
//                             <span className={`ml-1 px-2 py-0.5 rounded-lg text-[10px] ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-slate-400 text-white'}`}>
//                                 {tab.count}
//                             </span>
//                         </button>
//                     ))}
//                 </div>

//                 {/* Main Content Area */}
//                 {loading ? (
//                     <div className="p-32 text-center flex flex-col items-center gap-4"><Loader2 className="animate-spin h-10 w-10 text-slate-900" /><p className="font-black text-slate-400 uppercase text-[10px]">Updating Queue...</p></div>
//                 ) : filteredPapers[activeTab].length === 0 ? (
//                     <div className="p-24 text-center bg-white rounded-3xl border border-dashed border-slate-200">
//                         <MessageSquare size={48} className="mx-auto text-slate-200 mb-2" />
//                         <p className="text-slate-400 font-bold uppercase text-xs">No manuscripts in {activeTab}</p>
//                     </div>
//                 ) : (
//                     <div className="space-y-6">
//                         {filteredPapers[activeTab].map(p => (
//                             <div key={p.id} className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm transition-all hover:shadow-xl group overflow-hidden">
//                                 <div className="flex flex-col lg:flex-row justify-between items-start gap-8 min-w-0 w-full">

//                                     {/* ======================================================== */}
//                                     {/* 1. LEFT COLUMN: MANUSCRIPT DETAILS & AE INFORMATION      */}
//                                     {/* ======================================================== */}
//                                     <div className="flex-1 space-y-5 min-w-0 w-full">
//                                         <div className="flex flex-wrap items-center gap-3">
//                                             <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-lg tracking-widest uppercase shadow-sm">ID: #{p.id}</span>

//                                             <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase border ${p.status === 'Accepted' ? 'bg-green-100 text-green-700 border-green-200' :
//                                                 p.status === 'Rejected' ? 'bg-red-100 text-red-700 border-red-200' :
//                                                     p.status === 'Under Review' ? 'bg-amber-100 text-amber-700 border-amber-200' :
//                                                         p.status === 'Revisions Required' ? 'bg-orange-100 text-orange-700 border-orange-200' :
//                                                             'bg-blue-100 text-blue-700 border-blue-200'
//                                                 }`}>
//                                                 {p.status}
//                                             </span>

//                                             <span className="bg-purple-100 text-purple-700 border border-purple-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
//                                                 {p.specialization}
//                                             </span>

//                                             <span className="bg-teal-100 text-teal-700 border border-teal-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
//                                                 {p.article_type}
//                                             </span>
//                                         </div>

//                                         <h4 className="font-black text-2xl text-slate-800 leading-tight group-hover:text-blue-700 transition-colors break-words">
//                                             <LatexRenderer content={p.title} />
//                                         </h4>
//                                         {/* <div className="text-sm font-bold text-slate-500">
//                                             Author: <span className="text-slate-900 font-black">{p.author_name || "N/A"}</span>
//                                         </div> */}

//                                         {/* Author row */}
//                                         <div className="text-sm font-medium text-slate-500 flex items-center gap-2.5 flex-wrap">
//                                             <span>Author: <strong className="text-slate-900 font-black">{p.author_name || "N/A"}</strong></span>
//                                             {p.author_email && (
//                                                 <span className="text-xs text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md font-mono">
//                                                     {p.author_email}
//                                                 </span>
//                                             )}
//                                             <button
//                                                 type="button"
//                                                 onClick={() => setContactTarget({
//                                                     type: 'author',
//                                                     paper: p,
//                                                     name: p.author_name,
//                                                     email: p.author_email,
//                                                     endpoint: `${API_BASE_URL}/journal-papers/${p.id}/contact-author`
//                                                 })}
//                                                 className="px-2.5 py-0.5 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-md text-xs font-bold transition-all inline-flex items-center gap-1"
//                                             >
//                                                 <Mail size={11} /> Contact Author
//                                             </button>
//                                         </div>
//                                         {/* --- CLEAN ASSIGNED ASSOCIATE EDITOR INFO BADGE --- */}
//                                         {/* {p.associate_editor_id && (
//                                             <div className="mt-3 p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-center gap-3.5">
//                                                 <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-black uppercase shadow-sm shrink-0">
//                                                     {p.ae_name ? p.ae_name.charAt(0) : 'AE'}
//                                                 </div>
//                                                 <div className="flex-1 min-w-0">
//                                                     <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none">
//                                                         Assigned Associate Editor
//                                                     </p>
//                                                     <p className="text-sm font-bold text-slate-800 mt-1 truncate">
//                                                         {p.ae_name || `ID #${p.associate_editor_id}`}
//                                                     </p>
//                                                     <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 mt-0.5 font-medium">
//                                                         {p.ae_email && <span>{p.ae_email}</span>}
//                                                         {p.ae_assigned_at && (
//                                                             <span>• Assigned: {new Date(p.ae_assigned_at).toLocaleDateString()}</span>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         )} */}

//                                         {/* In ManagingEditorDashboard.js inside p.associate_editor_id card: */}
//                                         {p.associate_editor_id && (
//                                             <div className="mt-3 p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-center justify-between gap-3 flex-wrap">
//                                                 <div className="flex items-center gap-3.5 min-w-0">
//                                                     <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-black uppercase shadow-sm shrink-0">
//                                                         {p.ae_name ? p.ae_name.charAt(0) : 'AE'}
//                                                     </div>
//                                                     <div className="min-w-0">
//                                                         <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none">
//                                                             Assigned Associate Editor
//                                                         </p>
//                                                         <p className="text-sm font-bold text-slate-800 mt-1 truncate">
//                                                             {p.ae_name || `ID #${p.associate_editor_id}`}
//                                                         </p>
//                                                         <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 mt-0.5 font-medium">
//                                                             {p.ae_email && <span>{p.ae_email}</span>}
//                                                             {p.ae_assigned_at && (
//                                                                 <span>• Assigned: {new Date(p.ae_assigned_at).toLocaleDateString()}</span>
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                                 {/* Action buttons for AE */}
//                                                 <div className="flex items-center gap-2">
//                                                     {/* ✅ Contact AE Button */}
//                                                     <button
//                                                         type="button"
//                                                         onClick={() => setContactTarget({
//                                                             type: 'associate',
//                                                             paper: p,
//                                                             name: p.ae_name,
//                                                             email: p.ae_email,
//                                                             endpoint: `${API_BASE_URL}/journal-papers/${p.id}/contact-associate`
//                                                         })}
//                                                         className="px-3 py-1 bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
//                                                     >
//                                                         <Mail size={12} /> Contact Associate Editor
//                                                     </button>
//                                                     {/* <button
//                                                         type="button"
//                                                         onClick={() => setModalState({ type: 'assign-associate', paper: p })}
//                                                         className="px-3 py-1 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-bold transition-all"
//                                                     >
//                                                         Reassign
//                                                     </button> */}
//                                                 </div>
//                                             </div>
//                                         )}

//                                         {/* --- DECISION INTELLIGENCE: AE & REVIEWER IDENTIFICATION --- */}
//                                         {activeTab === 'decision' && (
//                                             <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-2">
//                                                 {/* 1. Associate Editor Details & Recommendation */}
//                                                 <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 shadow-inner space-y-2">
//                                                     <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
//                                                         <div className="flex items-center gap-2 text-indigo-700">
//                                                             <MessageSquare size={18} />
//                                                             <h5 className="text-[10px] font-black uppercase tracking-[0.2em]">Handling Associate Editor</h5>
//                                                         </div>
//                                                         {p.ae_email && (
//                                                             <span className="text-xs font-semibold text-indigo-900">
//                                                                 {p.ae_name} &lt;{p.ae_email}&gt;
//                                                             </span>
//                                                         )}
//                                                     </div>

//                                                     <p className="text-xl font-bold text-indigo-900">
//                                                         AE Recommendation: <span className="underline">{p.ae_recommendation || "Verdict Pending"}</span>
//                                                     </p>

//                                                     {p.internal_workflow_notes && (
//                                                         <div className="text-sm text-indigo-800 italic border-t border-indigo-200 pt-3 mt-2 leading-relaxed">
//                                                             <strong>Confidential Rationale to EIC:</strong> <LatexRenderer content={p.internal_workflow_notes} />
//                                                         </div>
//                                                     )}
//                                                 </div>

//                                                 {/* 2. Reviewer Reports with Names & Emails Revealed */}
//                                                 <div className="space-y-3">
//                                                     <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                                                         <Info size={14} /> Peer Review Evaluations & Identity
//                                                     </h5>

//                                                     <div className="grid md:grid-cols-2 gap-4">
//                                                         {/* In ManagingEditorDashboard.js inside Decision Reviewer Reports: */}
//                                                         {p.reviews?.filter(r => r.is_completed).map((rev, idx) => (
//                                                             <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm text-xs space-y-3">
//                                                                 <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
//                                                                     <div>
//                                                                         <span className="font-bold text-slate-900 block text-sm">{rev.reviewer_name}</span>
//                                                                         <span className="text-[11px] text-slate-400">{rev.reviewer_email}</span>
//                                                                     </div>
//                                                                     <span className="badge">{rev.recommendation}</span>
//                                                                 </div>

//                                                                 {/* ✅ RENDER RUBRICS FOR MANAGING EDITOR & EIC */}
//                                                                 <RubricScoreDisplay rawScores={rev.rubric_scores} />

//                                                                 {rev.comments_for_editor && (
//                                                                     <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-100 text-amber-900 italic">
//                                                                         <span className="font-black text-[9px] uppercase block mb-1 text-amber-700">Confidential Note to Editor:</span>
//                                                                         <LatexRenderer content={rev.comments_for_editor} />
//                                                                     </div>
//                                                                 )}

//                                                                 <div className="text-slate-600 leading-relaxed pt-1">
//                                                                     <span className="font-black text-[9px] uppercase block mb-1 text-slate-400">Comments for Author:</span>
//                                                                     <LatexRenderer content={rev.comments_for_author} />
//                                                                 </div>
//                                                             </div>
//                                                         ))}
//                                                                                                                                                        </div>
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>

//                                     {/* ======================================================== */}
//                                     {/* 2. RIGHT COLUMN: ALL WORKFLOW ACTIONS                    */}
//                                     {/* ======================================================== */}
//                                     <div className="lg:w-72 w-full flex flex-col gap-3 shrink-0 lg:sticky lg:top-4">
//                                         <a
//                                             href={`${STATIC_ASSETS_BASE_URL}/uploads/${(p.production_file_url || p.manuscript_file_url || '').replace(/^(\/?uploads\/)/, "")}`}
//                                             target="_blank"
//                                             rel="noopener noreferrer"
//                                             className="flex items-center justify-center gap-2 w-full py-3 border-2 border-slate-100 text-slate-600 font-black text-xs rounded-2xl hover:bg-slate-50 uppercase tracking-widest"
//                                         >
//                                             <Download size={18} />
//                                             {p.production_file_url ? "View Final Production" : "View Manuscript"}
//                                         </a>

//                                         {/* --- TRIAGE TAB ACTIONS --- */}
//                                         {activeTab === 'triage' && (
//                                             <div className="space-y-3">
//                                                 <button onClick={() => setModalState({ type: 'assign-associate', paper: p })} className="w-full py-4 bg-blue-600 text-white font-black text-xs rounded-2xl hover:bg-blue-700 uppercase shadow-lg">Assign AE</button>
//                                                 <button onClick={() => openRejectModal(p)} className="w-full py-3 border-2 border-rose-200 text-rose-600 font-black text-xs rounded-2xl hover:bg-rose-50 uppercase">Desk Reject</button>

//                                                 {p.author_revision_notes && (
//                                                     <div className="mt-4 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-2xl shadow-inner">
//                                                         <div className="flex items-center gap-2 mb-1">
//                                                             <MessageSquare size={14} className="text-amber-600" />
//                                                             <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Author's Summary</span>
//                                                         </div>
//                                                         <div className="text-xs text-slate-700 leading-relaxed italic">
//                                                             <LatexRenderer content={p.author_revision_notes} />
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                                 {/* ========================================================================= */}
//                                                 {/* --- REVISION COMPARISON BOX: OLD MANUSCRIPT VS REVISED MANUSCRIPT ---      */}
//                                                 {/* ========================================================================= */}
//                                                 {(p.author_revision_notes || p.previous_manuscript_file_url) && (
//                                                     <div className="mt-4 p-5 bg-amber-50/80 border-2 border-amber-200 rounded-3xl space-y-4 shadow-sm">
//                                                         <div className="flex items-center justify-between border-b border-amber-200 pb-2.5">
//                                                             <div className="flex items-center gap-2">
//                                                                 <History size={18} className="text-amber-700" />
//                                                                 <span className="text-xs font-black text-amber-900 uppercase tracking-wider">
//                                                                     Manuscript Version Comparison & Rebuttal
//                                                                 </span>
//                                                             </div>
//                                                             <span className="text-[10px] font-bold uppercase bg-amber-200 text-amber-800 px-2.5 py-0.5 rounded-full">
//                                                                 Revision Evaluation
//                                                             </span>
//                                                         </div>

//                                                         {/* Side-by-Side Comparison */}
//                                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                                                             {/* Version 1: Original */}
//                                                             <div className="p-4 bg-white rounded-2xl border border-amber-200 shadow-sm flex flex-col justify-between space-y-2">
//                                                                 <div>
//                                                                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
//                                                                         Version 1 — Original Submission
//                                                                     </span>
//                                                                     <p className="text-xs text-slate-500 mt-0.5">Initial version before author revisions</p>
//                                                                 </div>
//                                                                 {p.previous_manuscript_file_url ? (
//                                                                     <a
//                                                                         href={`${STATIC_ASSETS_BASE_URL}/uploads/${p.previous_manuscript_file_url.replace(/^(\/?uploads\/)/, "")}`}
//                                                                         target="_blank"
//                                                                         rel="noopener noreferrer"
//                                                                         className="inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
//                                                                     >
//                                                                         <Download size={14} /> Download Original PDF
//                                                                     </a>
//                                                                 ) : (
//                                                                     <span className="text-xs text-slate-400 italic">Original file path not archived.</span>
//                                                                 )}
//                                                             </div>

//                                                             {/* Version 2: Revised */}
//                                                             <div className="p-4 bg-white rounded-2xl border border-emerald-300 shadow-sm flex flex-col justify-between space-y-2 bg-emerald-50/30">
//                                                                 <div>
//                                                                     <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest block">
//                                                                         Version 2 — Revised Manuscript
//                                                                     </span>
//                                                                     <p className="text-xs text-slate-500 mt-0.5">Updated PDF incorporating revisions</p>
//                                                                 </div>
//                                                                 <a
//                                                                     href={`${STATIC_ASSETS_BASE_URL}/uploads/${(p.manuscript_file_url || '').replace(/^(\/?uploads\/)/, "")}`}
//                                                                     target="_blank"
//                                                                     rel="noopener noreferrer"
//                                                                     className="inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
//                                                                 >
//                                                                     <Download size={14} /> Download Revised PDF
//                                                                 </a>
//                                                             </div>
//                                                         </div>

//                                                         {/* Author Point-by-Point Rebuttal */}
//                                                         {p.author_revision_notes && (
//                                                             <div className="p-4 bg-white rounded-2xl border border-amber-200 text-xs text-slate-800 leading-relaxed font-serif">
//                                                                 <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest block mb-1">
//                                                                     Author's Point-by-Point Response to Reviewers:
//                                                                 </span>
//                                                                 <LatexRenderer content={p.author_revision_notes} />
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                 )}
//                                             </div>


//                                         )}

//                                         {/* --- MONITORING / IN REVIEW ACTIONS (PLACED HERE ON RIGHT) --- */}
//                                         {activeTab === 'monitoring' && ['MANAGING_EDITOR', 'ADMIN', 'EIC', 'EDITOR_IN_CHIEF'].includes(normalizedRole) && (
//                                             <div className="space-y-2">
//                                                 <button
//                                                     onClick={() => setModalState({ type: 'assign-associate', paper: p })}
//                                                     className="w-full py-3 bg-indigo-600 text-white font-black text-xs rounded-2xl hover:bg-indigo-700 uppercase tracking-wider shadow-md shadow-indigo-100 transition-all flex items-center justify-center gap-2 active:scale-95"
//                                                 >
//                                                     <UserPlus size={15} /> Reassign to New AE
//                                                 </button>

//                                                 <button
//                                                     onClick={() => handleRevokeAE(p)}
//                                                     className="w-full py-2.5 bg-white border-2 border-rose-200 text-rose-600 font-bold text-xs rounded-2xl hover:bg-rose-50 uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 active:scale-95"
//                                                 >
//                                                     <XCircle size={15} /> Revoke & Return to Triage
//                                                 </button>

//                                                 <p className="text-[10px] text-slate-400 text-center italic mt-1 leading-tight">
//                                                     If Associate Editor is inactive, reassign or return manuscript to Triage.
//                                                 </p>
//                                             </div>
//                                         )}

//                                         {/* --- DECISION TAB ACTIONS --- */}
//                                         {activeTab === 'decision' && (
//                                             <button onClick={() => setModalState({ type: 'make-decision', paper: p })} className="w-full py-4 bg-indigo-600 text-white font-black text-xs rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 uppercase tracking-widest">
//                                                 <FileCheck size={20} className="mr-2 inline" /> Final Decision
//                                             </button>
//                                         )}

//                                         {/* --- ARCHIVE TAB --- */}
//                                         {activeTab === 'archive' && (
//                                             <div className="space-y-2">
//                                                 <div className={`flex items-center justify-center gap-2 py-3 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest ${p.status?.toUpperCase() === 'PUBLISHED' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
//                                                     {p.status?.toUpperCase() === 'PUBLISHED' ? <CheckCircle size={14} /> : <XCircle size={14} />} {p.status}
//                                                 </div>
//                                                 <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center text-[9px] font-bold text-slate-400">
//                                                     <span>DATE:</span> <span>{new Date(p.updated_at).toLocaleDateString()}</span>
//                                                 </div>
//                                             </div>
//                                         )}

//                                         {/* --- PRODUCTION TAB (Dynamic Mapping) --- */}
                //                         {activeTab === 'production' && (
                //                             <div className="space-y-3">
                //                                 {(() => {
                //                                     const s = (p.status || '').toUpperCase().replace(/\s+/g, '');
                //                                     const step = PRODUCTION_STEPS[s];
                //                                     const isManager = ['MANAGING_EDITOR', 'EDITOR_IN_CHIEF', 'ADMIN'].includes(normalizedRole);

                //                                     if (!p.production_staff_id) {
                //                                         return (
                //                                             <button onClick={() => setModalState({ type: 'assign-production', paper: p })} className="w-full py-4 bg-emerald-600 text-white font-black text-xs rounded-2xl hover:bg-emerald-700 shadow-lg flex items-center justify-center gap-2 uppercase tracking-widest">
                //                                                 <UserPlus size={16} /> Assign Staff
                //                                             </button>
                //                                         );
                //                                     }

                //                                     if (s === 'PROOFREADING') {
                //                                         return (
                //                                             <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center shadow-inner">
                //                                                 <Loader2 className="animate-spin mx-auto text-amber-600 mb-2" size={20} />
                //                                                 <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Awaiting Author</span>
                //                                             </div>
                //                                         );
                //                                     }

                //                                     if (s === 'READYTOPUBLISH' || s === 'READYFORPUBLICATION') {
                //                                         return isManager ? (
                //                                             <div className="space-y-4">
                //                                                 {p.author_revision_notes && (
                //                                                     <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-2xl text-xs italic">
                //                                                         <span className="font-black text-emerald-700 block mb-1">AUTHOR NOTE:</span>
                //                                                         <LatexRenderer content={p.author_revision_notes} />
                //                                                     </div>
                //                                                 )}
                //                                                 <button onClick={() => setModalState({ type: 'upload-production', paper: p })} className="w-full py-4 bg-blue-900 text-white font-black text-xs rounded-2xl shadow-xl hover:bg-slate-800 uppercase tracking-widest transition-all active:scale-95">
                //                                                     <FileCheck size={16} className="inline mr-2" /> Finalize & Publish
                //                                                 </button>
                //                                             </div>
                //                                         ) : (
                //                                             <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                //                                                 <CheckCircle className="mx-auto text-emerald-600 mb-1" size={20} />
                //                                                 <span className="text-[10px] font-black text-emerald-800 uppercase">Pending EIC Approval</span>
                //                                             </div>
                //                                         );
                //                                     }

                //                                     if (step) {
                //                                         return (
                //                                             <button
                //                                                 onClick={() => step.modal ? setModalState({ type: step.modal, paper: p }) : updateStatus(p.id, step.nextStatus)}
                //                                                 className={`w-full py-4 text-white font-black text-xs rounded-2xl uppercase shadow-md transition-all ${step.color}`}
                //                                             >
                //                                                 {step.icon} {step.label}
                //                                             </button>
                //                                         );
                //                                     }

                //                                     return null;
                //                                 })()}

                //                                 {p.production_staff_id && p.status !== 'Published' && (
                //                                     <div className="mt-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center text-[9px] font-black text-slate-400">
                //                                         <span>STAFF ASSIGNED:</span>
                //                                         <span className="text-slate-600 font-bold uppercase">ID #{p.production_staff_id}</span>
                //                                     </div>
                //                                 )}
                //                             </div>
                //                         )}
                //                     </div>
                //                 </div>
                //                 <div className="mt-10 pt-8 border-t border-slate-50"><WorkflowStepper currentStatus={p.status} role="MANAGING_EDITOR" /></div>
                //             </div>
                //         ))}
                //     </div>
                // )}

//                 {/* --- MODALS --- */}
//                 {
//                     modalState.type === 'send-proof' && (
//                         <SendProofModal
//                             paper={modalState.paper}
//                             onClose={() => setModalState({ type: null, paper: null })}
//                             onComplete={() => { fetchPapers(); setModalState({ type: null, paper: null }); }}
//                         />
//                     )
//                 }
//                 {
//                     modalState.type === 'make-decision' && (
//                         <MakeDecisionModal paper={modalState.paper} onClose={() => setModalState({ type: null, paper: null })} onDecisionMade={() => { setModalState({ type: null, paper: null }); fetchPapers(); }} />
//                     )
//                 }

//                 {
//                     modalState.type === 'upload-production' && (
//                         <UploadProductionModal paper={modalState.paper} onClose={() => setModalState({ type: null, paper: null })} onUploadComplete={() => { fetchPapers(); setModalState({ type: null, paper: null }); }} />
//                     )
//                 }

//                 {
//                     (modalState.type === 'assign-associate' || modalState.type === 'invite-reviewer' || modalState.type === 'assign-production') && (
//                         <AssignReviewerModal
//                             paper={modalState.paper}
//                             mode={modalState.type === 'assign-production' ? 'production' : (modalState.type === 'assign-associate' ? 'associate' : 'reviewer')}
//                             onClose={() => setModalState({ type: null, paper: null })}
//                             onAssignmentComplete={() => { fetchPapers(); setModalState({ type: null, paper: null }); }}
//                         />
//                     )
//                 }

//                 {
//                     rejectModal.isOpen && (
//                         <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
//                             <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in duration-200">
//                                 <div className="p-6 border-b flex justify-between items-center bg-rose-50">
//                                     <h3 className="text-lg font-black text-rose-900 uppercase">Confirm Desk Rejection</h3>
//                                     <button onClick={() => setRejectModal({ isOpen: false, paper: null })}>
//                                         <X size={24} className="text-rose-400" />
//                                     </button>
//                                 </div>

//                                 <div className="p-8 space-y-4 overflow-y-auto flex-1">
//                                     <LatexEditor
//                                         value={rejectReason}
//                                         onChange={setRejectReason}
//                                         placeholder="e.g., Out of scope..."
//                                     />
//                                     <div className="p-3 bg-slate-50 rounded-xl border border-dotted border-slate-200">
//                                         <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">
//                                             Live LaTeX Preview:
//                                         </span>
//                                         <div className="text-sm text-slate-600">
//                                             <LatexRenderer content={rejectReason} />
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="p-6 bg-slate-50 border-t flex justify-end gap-3">
//                                     <button
//                                         onClick={() => setRejectModal({ isOpen: false, paper: null })}
//                                         className="px-6 py-2 font-bold text-slate-400"
//                                     >
//                                         Cancel
//                                     </button>
//                                     <button
//                                         onClick={submitDeskReject}
//                                         disabled={isRejecting}
//                                         className="px-8 py-3 bg-rose-600 text-white font-black text-xs rounded-xl uppercase tracking-widest shadow-lg active:scale-95"
//                                     >
//                                         {isRejecting ? <Loader2 className="animate-spin" size={16} /> : "Confirm Reject"}
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     )
//                 }
//             </div>
//             {/* {contactTarget && (
//                 <ContactAuthorModal 
//                     paper={contactTarget}
//                     onClose={() => setContactTarget(null)}
//                 />
//             )} */}
//             {/* Render Contact Modal */}
//             {contactTarget && (
//                 <EditorialContactModal
//                     recipientType={contactTarget.type}
//                     recipientName={contactTarget.name}
//                     recipientEmail={contactTarget.email}
//                     paper={contactTarget.paper}
//                     endpoint={contactTarget.endpoint}
//                     onClose={() => setContactTarget(null)}
//                 />
//             )}
//         </div>
//     );
// };

// export default ManagingEditorDashboard;