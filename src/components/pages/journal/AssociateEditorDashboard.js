import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { API_BASE_URL, STATIC_ASSETS_BASE_URL } from '../../../utils/constants';
import WorkflowStepper from './common/WorkflowStepper';
import AssignReviewerModal from './Editor/AssignReviewerModal';
import MakeDecisionModal from './Editor/MakeDecisionModal';
import EditorialContactModal from './Editor/EditorialContactModal';
import { 
    Download, UserPlus, FileCheck, MessageSquare, Microscope, 
    History, AlertCircle, Users, Clock, CheckCircle2, XCircle, Mail 
} from 'lucide-react';
import LatexRenderer from '../../common/LatexRenderer';

const AssociateEditorDashboard = () => {
    const { authToken, userRole, isAuthReady } = useContext(AuthContext);
    const [papers, setPapers] = useState([]);
    const [activeTab, setActiveTab] = useState('technicalCheck');
    const [loading, setLoading] = useState(true);
    const [modalState, setModalState] = useState({ type: null, paper: null });

    // State for the Contact Modal (Reviewer communication)
    const [contactTarget, setContactTarget] = useState(null);

    const normalizedRole = useMemo(() => {
        return userRole?.toUpperCase().replace(/[\s_]+/g, '_').trim() || "";
    }, [userRole]);

    const fetchPapers = useCallback(async () => {
        if (!authToken) return;
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/journal-papers/editor-queue`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            setPapers(res.data.data || []);
        } catch (e) {
            console.error("Dashboard Fetch Error:", e);
        } finally {
            setLoading(false);
        }
    }, [authToken]);

    useEffect(() => {
        if (isAuthReady && authToken) fetchPapers();
    }, [isAuthReady, authToken, fetchPapers]);

    // --- TAB FILTERING & WORKFLOW ROUTING ---
    const filteredPapers = useMemo(() => {
        const categories = {
            technicalCheck: [],
            writeRecommendation: [],
            archive: []
        };

        papers.forEach(p => {
            const s = String(p.status || '').toUpperCase().replace(/[\s_]+/g, '');
            // Only count actual completed reviews (is_completed = 1)
            const completedReviewsCount = p.reviews 
                ? p.reviews.filter(r => r.is_completed == 1 || r.is_completed === true).length 
                : 0;

            const isHandedOffOrFinished = [
                'DECISIONPENDING', 'ACCEPTED', 'PRODUCTION', 'INPRODUCTION',
                'LANGUAGEEDITION', 'COPYLAYOUTEDITION', 'PROOFREADING',
                'READYTOPUBLISH', 'PUBLISHED', 'REJECTED', 'REJECT'
            ].includes(s);

            // 1. Handed off to ME or final decisions go to Archive
            if (isHandedOffOrFinished) {
                categories.archive.push(p);
                return;
            }

            // 2. CHECK COMPLETED REVIEWS FIRST:
            // If reviews are done (status is REVIEWCOMPLETED or count >= 2), advance to Recommendation!
            if (s === 'REVIEWCOMPLETED' || s === 'REVIEWSRECEIVED' || completedReviewsCount >= 2) {
                categories.writeRecommendation.push(p);
                return;
            }

            // 3. Otherwise, paper remains in Assigned Tasks (Technical Check / In Review)
            categories.technicalCheck.push(p);
        });

        return categories;
    }, [papers]);

    const tabs = [
        { id: 'technicalCheck', label: 'Assigned Tasks', icon: <Microscope size={16} />, count: filteredPapers.technicalCheck.length },
        { id: 'writeRecommendation', label: 'Ready for Recommendation', icon: <FileCheck size={16} />, count: filteredPapers.writeRecommendation.length },
        { id: 'archive', label: 'Handed-off Archive', icon: <History size={16} />, count: filteredPapers.archive.length },
    ];

    // Status badge formatter for peer reviews
    const getReviewStatusBadge = (rev) => {
        if (rev.is_completed == 1) {
            return (
                <span className="flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                    <CheckCircle2 size={12} /> Completed ({rev.recommendation || 'Evaluated'})
                </span>
            );
        }
        if (rev.invitation_status === 'DECLINED') {
            return (
                <span className="flex items-center gap-1 bg-rose-100 text-rose-700 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                    <XCircle size={12} /> Declined
                </span>
            );
        }
        if (rev.invitation_status === 'ACCEPTED') {
            return (
                <span className="flex items-center gap-1 bg-blue-100 text-blue-700 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                    <Clock size={12} /> In Review
                </span>
            );
        }
        return (
            <span className="flex items-center gap-1 bg-amber-100 text-amber-700 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                <Clock size={12} /> Invitation Sent
            </span>
        );
    };

    return (
        <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Associate Editor Workspace</h2>
                        <p className="text-slate-500 font-medium">Technical Review Oversight & Reviewer Management</p>
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl border border-indigo-100 shadow-sm">
                        Operator: {normalizedRole}
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex bg-slate-200/50 p-1.5 rounded-2xl w-fit border border-slate-200 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 py-2.5 px-6 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                                activeTab === tab.id
                                    ? 'bg-white text-indigo-700 shadow-md ring-1 ring-slate-200'
                                    : 'text-slate-500 hover:text-indigo-600 hover:bg-white/50'
                            }`}
                        >
                            {tab.icon} {tab.label}
                            {tab.count > 0 && (
                                <span className={`ml-1 px-2 py-0.5 rounded-lg text-[10px] ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'bg-slate-300 text-slate-700'}`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Queue Content Area */}
                {loading ? (
                    <div className="p-20 text-center flex flex-col items-center gap-4">
                        <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
                        <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Syncing queue...</p>
                    </div>
                ) : filteredPapers[activeTab].length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                        <AlertCircle className="mx-auto text-slate-200 mb-4" size={64} />
                        <h3 className="text-xl font-bold text-slate-400 uppercase tracking-tighter">Queue Clear</h3>
                        <p className="text-slate-400 text-sm mt-1">No manuscripts are currently in this phase.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredPapers[activeTab].map(p => {
                            const normalizedStatus = String(p.status || '').toUpperCase().replace(/[\s_]+/g, '');

                            return (
                                <div key={p.id} className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-all group">
                                    <div className="flex flex-col lg:flex-row justify-between items-start gap-8">

                                        {/* ======================================================== */}
                                        {/* LEFT COLUMN: METADATA, VERSION COMPARISON, & REVIEWERS   */}
                                        {/* ======================================================== */}
                                        <div className="flex-1 space-y-4">
                                            {/* Badges */}
                                            <div className="flex flex-wrap items-center gap-3">
                                                <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-lg tracking-widest uppercase shadow-sm">
                                                    ID: #{p.id}
                                                </span>

                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase border ${
                                                    p.status === 'Accepted' ? 'bg-green-100 text-green-700 border-green-200' :
                                                    p.status === 'Rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                                                    p.status === 'Under Review' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                                    p.status === 'Revisions Required' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                                    p.status === 'Revision Submitted' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' :
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

                                            {/* Title */}
                                            <h4 className="font-black text-2xl text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
                                                <LatexRenderer content={p.title} />
                                            </h4>

                                            {/* Author & Email Badge */}
                                            <div className="text-sm font-medium text-slate-600 flex items-center gap-2.5 flex-wrap">
                                                <span>Author: <strong className="text-slate-900 font-black">{p.author_name || "N/A"}</strong></span>
                                                {p.author_email && (
                                                    <span className="text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-lg font-mono">
                                                        {p.author_email}
                                                    </span>
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
                                                            Revision Round
                                                        </span>
                                                    </div>

                                                    {/* Side-by-Side Comparison Grid */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {/* Version 1: Original */}
                                                        <div className="p-4 bg-white rounded-2xl border border-amber-200 shadow-sm flex flex-col justify-between space-y-2">
                                                            <div>
                                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                                                                    Version 1 — Original Submission
                                                                </span>
                                                                <p className="text-xs text-slate-500 mt-0.5">Initial version evaluated in Round 1</p>
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
                                                                <span className="text-xs text-slate-400 italic">Original file path not archived.</span>
                                                            )}
                                                        </div>

                                                        {/* Version 2: Revised */}
                                                        <div className="p-4 bg-white rounded-2xl border border-emerald-300 shadow-sm flex flex-col justify-between space-y-2 bg-emerald-50/30">
                                                            <div>
                                                                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest block">
                                                                    Version 2 — Revised Manuscript
                                                                </span>
                                                                <p className="text-xs text-slate-500 mt-0.5">Updated PDF incorporating revisions</p>
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

                                                    {/* Author Point-by-Point Rebuttal */}
                                                    {p.author_revision_notes && (
                                                        <div className="p-4 bg-white rounded-2xl border border-amber-200 text-xs text-slate-800 leading-relaxed font-serif">
                                                            <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest block mb-1">
                                                                Author's Response / Summary of Changes:
                                                            </span>
                                                            <LatexRenderer content={p.author_revision_notes} />
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* ======================================================== */}
                                            {/* --- ASSIGNED REVIEWERS & TRACKING CONTAINER ---          */}
                                            {/* ======================================================== */}
                                            <div className="mt-4 p-4 bg-slate-50/80 border border-slate-200 rounded-2xl">
                                                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                                                    <div className="flex items-center gap-2">
                                                        <Users size={16} className="text-indigo-600" />
                                                        <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                                                            Assigned Reviewers ({p.reviews?.length || 0})
                                                        </span>
                                                    </div>

                                                    {activeTab !== 'archive' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setModalState({ type: 'invite-reviewer', paper: p })}
                                                            className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 shadow-sm transition-all active:scale-95"
                                                        >
                                                            <UserPlus size={13} />
                                                            <span>Add Reviewer</span>
                                                        </button>
                                                    )}
                                                </div>

                                                {/* ✅ Reviewers Loop */}
                                                {p.reviews && p.reviews.length > 0 ? (
                                                    <div className="space-y-2.5 mt-3">
                                                        {p.reviews.map((rev, idx) => (
                                                            <div 
                                                                key={rev.id || rev.review_id || idx} 
                                                                className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-sm hover:border-indigo-200 transition-colors"
                                                            >
                                                                <div className="flex items-center gap-3 min-w-0">
                                                                    <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-black shrink-0">
                                                                        {idx + 1}
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <div className="flex items-center gap-2 flex-wrap">
                                                                            <p className="text-xs font-bold text-slate-900 truncate">
                                                                                {rev.reviewer_name || `Reviewer #${idx + 1}`}
                                                                            </p>
                                                                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                                                                                Round {rev.round_number || 1}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 mt-0.5 font-medium">
                                                                            {(rev.reviewer_email || rev.email) && <span>{rev.reviewer_email || rev.email}</span>}
                                                                            {(rev.assignment_date || rev.created_at) && (
                                                                                <span>
                                                                                    • Assigned: {new Date(rev.assignment_date || rev.created_at).toLocaleDateString()}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Status Badge + Prominent Contact Reviewer Button */}
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    {getReviewStatusBadge(rev)}

                                                                    {/* ✅ CLEAR, LABELED CONTACT REVIEWER BUTTON */}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setContactTarget({
                                                                            type: 'reviewer',
                                                                            paper: p,
                                                                            name: rev.reviewer_name || `Reviewer #${idx + 1}`,
                                                                            email: rev.reviewer_email || rev.email || '',
                                                                            endpoint: `${API_BASE_URL}/journal-papers/reviews/${rev.id || rev.review_id}/contact`
                                                                        })}
                                                                        className="px-2.5 py-1 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
                                                                        title="Send direct email to this reviewer"
                                                                    >
                                                                        <Mail size={12} className="text-indigo-600" />
                                                                        <span>Contact Reviewer</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="py-4 text-center">
                                                        <p className="text-xs text-slate-400 italic mb-2">No reviewers assigned to this paper yet.</p>
                                                        {activeTab !== 'archive' && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setModalState({ type: 'invite-reviewer', paper: p })}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-indigo-200 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-all"
                                                            >
                                                                <UserPlus size={13} />
                                                                <span>Invite First Reviewer</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Completed Review Intelligence (for Recommendation phase) */}
                                            {activeTab === 'writeRecommendation' && (
                                                <div className="mt-4 p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-4">
                                                    <div className="flex items-center gap-2 border-b border-indigo-100 pb-2">
                                                        <MessageSquare className="text-indigo-600" size={16} />
                                                        <h5 className="font-black text-indigo-900 text-xs uppercase tracking-widest">
                                                            Reviewer Intelligence (Action Required)
                                                        </h5>
                                                    </div>

                                                    {p.reviews?.filter(r => r.is_completed == 1).map((rev, idx) => (
                                                        <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-2">
                                                            <div className="flex justify-between items-center mb-1 flex-wrap gap-2">
                                                                <span className="font-bold text-indigo-900 text-xs">
                                                                    Reviewer: {rev.reviewer_name || `Expert #${idx + 1}`} (Round {rev.round_number || 1})
                                                                </span>
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                                                                        rev.recommendation?.toLowerCase().includes('reject')
                                                                            ? 'bg-rose-100 text-rose-600'
                                                                            : 'bg-emerald-100 text-emerald-600'
                                                                    }`}>
                                                                        {rev.recommendation}
                                                                    </span>

                                                                    {/* Direct Contact Button in Intelligence Box */}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setContactTarget({
                                                                            type: 'reviewer',
                                                                            paper: p,
                                                                            name: rev.reviewer_name || `Reviewer #${idx + 1}`,
                                                                            email: rev.reviewer_email || rev.email || '',
                                                                            endpoint: `${API_BASE_URL}/journal-papers/reviews/${rev.id || rev.review_id}/contact`
                                                                        })}
                                                                        className="px-2 py-0.5 bg-slate-50 hover:bg-indigo-50 text-indigo-600 border border-slate-200 rounded-md text-[11px] font-bold transition-all flex items-center gap-1"
                                                                    >
                                                                        <Mail size={11} />
                                                                        <span>Message</span>
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {rev.comments_for_editor && (
                                                                <div className="p-3 bg-amber-50/70 rounded-xl border border-dotted border-amber-200">
                                                                    <span className="text-[9px] font-black text-amber-700 uppercase block mb-1">
                                                                        Confidential Note to AE:
                                                                    </span>
                                                                    <div className="text-xs text-amber-900 italic">
                                                                        <LatexRenderer content={rev.comments_for_editor} />
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {rev.comments_for_author && (
                                                                <div className="p-2.5 bg-slate-50 rounded-lg">
                                                                    <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">
                                                                        Public Feedback for Author:
                                                                    </span>
                                                                    <div className="text-xs text-slate-600">
                                                                        <LatexRenderer content={rev.comments_for_author} />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* ======================================================== */}
                                        {/* RIGHT COLUMN: ACTION BUTTONS                             */}
                                        {/* ======================================================== */}
                                        <div className="lg:w-64 w-full flex flex-col gap-3 shrink-0">
                                            {/* Download Current PDF */}
                                            <a
                                                href={`${STATIC_ASSETS_BASE_URL}/uploads/${(p.manuscript_file_url || '').replace(/^(\/?uploads\/)/, "")}`}
                                                target="_blank" rel="noreferrer"
                                                className="flex items-center justify-center gap-2 w-full py-3 border-2 border-slate-100 text-slate-600 font-bold text-sm rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
                                            >
                                                <Download size={18} /> View PDF
                                            </a>

                                            {/* Technical Check Tab Actions */}
                                            {activeTab === 'technicalCheck' && (
                                                (normalizedStatus === 'REVISIONREQUIRED' || normalizedStatus === 'REVISIONSREQUIRED') ? (
                                                    <div className="flex items-center justify-center gap-2 w-full py-3.5 bg-slate-100 text-slate-400 font-bold text-xs rounded-2xl border border-dashed border-slate-300">
                                                        <History size={16} /> Waiting for Author
                                                    </div>
                                                ) : normalizedStatus === 'REVISIONSUBMITTED' ? (
                                                    <div className="flex flex-col gap-2">
                                                        <button
                                                            onClick={() => setModalState({ type: 'make-decision', paper: p })}
                                                            className="flex items-center justify-center gap-2 w-full py-3.5 bg-emerald-600 text-white font-black text-xs rounded-2xl hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all active:scale-95 uppercase tracking-widest"
                                                        >
                                                            <FileCheck size={18} /> Make Recommendation
                                                        </button>
                                                        <button
                                                            onClick={() => setModalState({ type: 'invite-reviewer', paper: p })}
                                                            className="flex items-center justify-center gap-2 w-full py-2.5 border-2 border-indigo-100 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-xl hover:bg-indigo-100 transition-all"
                                                        >
                                                            <UserPlus size={16} /> Round 2 Review
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col gap-2">
                                                        {/* Standard Invite Reviewer Button */}
                                                        <button
                                                            onClick={() => setModalState({ type: 'invite-reviewer', paper: p })}
                                                            className="flex items-center justify-center gap-2 w-full py-3.5 bg-indigo-600 text-white font-black text-sm rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95"
                                                        >
                                                            <UserPlus size={18} /> Invite Reviewer
                                                        </button>

                                                        {p.reviews && p.reviews.length > 0 && (
                                                            <div className="flex items-center justify-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 py-2 rounded-xl border border-slate-100">
                                                                <Users size={12} /> {p.reviews.length} Assigned
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            )}

                                            {/* Ready for Recommendation Tab Actions */}
                                            {activeTab === 'writeRecommendation' && (
                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        onClick={() => setModalState({ type: 'make-decision', paper: p })}
                                                        className="flex items-center justify-center gap-2 w-full py-3.5 bg-emerald-600 text-white font-black text-sm rounded-2xl hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all active:scale-95"
                                                    >
                                                        <FileCheck size={18} /> Recommend to ME
                                                    </button>

                                                    <button
                                                        onClick={() => setModalState({ type: 'invite-reviewer', paper: p })}
                                                        className="flex items-center justify-center gap-2 w-full py-2 border-2 border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all"
                                                    >
                                                        <UserPlus size={14} /> Invite Tie-Breaker
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Workflow Stepper */}
                                    <div className="mt-8 pt-6 border-t border-slate-50">
                                        <WorkflowStepper currentStatus={p.status} role="ASSOCIATE_EDITOR" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* --- MODALS --- */}
            {modalState.type === 'invite-reviewer' && (
                <AssignReviewerModal
                    paper={modalState.paper}
                    mode="reviewer"
                    onClose={() => setModalState({ type: null, paper: null })}
                    onAssignmentComplete={() => {
                        setModalState({ type: null, paper: null });
                        fetchPapers();
                    }}
                />
            )}

            {modalState.type === 'make-decision' && (
                <MakeDecisionModal
                    paper={modalState.paper}
                    onClose={() => setModalState({ type: null, paper: null })}
                    onDecisionMade={() => {
                        setModalState({ type: null, paper: null });
                        fetchPapers();
                    }}
                />
            )}

            {/* ✅ EDITORIAL CONTACT MODAL: Direct Messaging to Reviewers */}
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
    );
};

export default AssociateEditorDashboard;










// import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../../../context/AuthContext';
// import { API_BASE_URL, STATIC_ASSETS_BASE_URL } from '../../../utils/constants';
// import WorkflowStepper from './common/WorkflowStepper';
// import AssignReviewerModal from './Editor/AssignReviewerModal';
// import MakeDecisionModal from './Editor/MakeDecisionModal';
// import { 
//     Download, UserPlus, FileCheck, MessageSquare, Microscope, 
//     History, AlertCircle, Users, Clock, CheckCircle2, XCircle 
// } from 'lucide-react';
// import LatexRenderer from '../../common/LatexRenderer';
// import EditorialContactModal from './Editor/EditorialContactModal';
// import { Mail } from 'lucide-react'; 

// const AssociateEditorDashboard = () => {
//     const { authToken, userRole, isAuthReady } = useContext(AuthContext);
//     const [papers, setPapers] = useState([]);
//     const [activeTab, setActiveTab] = useState('technicalCheck');
//     const [loading, setLoading] = useState(true);
//     const [modalState, setModalState] = useState({ type: null, paper: null });

//     const [contactTarget, setContactTarget] = useState(null);

//     const normalizedRole = useMemo(() => {
//         return userRole?.toUpperCase().replace(/[\s_]+/g, '_').trim() || "";
//     }, [userRole]);

//     const fetchPapers = useCallback(async () => {
//         if (!authToken) return;
//         setLoading(true);
//         try {
//             const res = await axios.get(`${API_BASE_URL}/journal-papers/editor-queue`, {
//                 headers: { 'Authorization': `Bearer ${authToken}` }
//             });
//             setPapers(res.data.data || []);
//         } catch (e) {
//             console.error("Dashboard Fetch Error:", e);
//         } finally {
//             setLoading(false);
//         }
//     }, [authToken]);

//     useEffect(() => {
//         if (isAuthReady && authToken) fetchPapers();
//     }, [isAuthReady, authToken, fetchPapers]);

//     // --- TAB FILTERING & WORKFLOW ROUTING ---
//     const filteredPapers = useMemo(() => {
//         const categories = {
//             technicalCheck: [],
//             writeRecommendation: [],
//             archive: []
//         };

//         papers.forEach(p => {
//             const s = String(p.status || '').toUpperCase().replace(/[\s_]+/g, '');
//             // Only count actual completed reviews (is_completed = 1)
//             const completedReviewsCount = p.reviews 
//                 ? p.reviews.filter(r => r.is_completed == 1 || r.is_completed === true).length 
//                 : 0;

//             const isHandedOffOrFinished = [
//                 'DECISIONPENDING', 'ACCEPTED', 'PRODUCTION', 'INPRODUCTION',
//                 'LANGUAGEEDITION', 'COPYLAYOUTEDITION', 'PROOFREADING',
//                 'READYTOPUBLISH', 'PUBLISHED', 'REJECTED', 'REJECT'
//             ].includes(s);

//             // 1. Handed off to ME or final decisions go to Archive
//             if (isHandedOffOrFinished) {
//                 categories.archive.push(p);
//                 return;
//             }

//             // 2. CHECK COMPLETED REVIEWS FIRST:
//             // If reviews are done (status is REVIEWCOMPLETED or count >= 2), advance to Recommendation!
//             if (s === 'REVIEWCOMPLETED' || s === 'REVIEWSRECEIVED' || completedReviewsCount >= 2) {
//                 categories.writeRecommendation.push(p);
//                 return;
//             }

//             // 3. Otherwise, paper remains in Assigned Tasks (Technical Check / In Review)
//             categories.technicalCheck.push(p);
//         });

//         return categories;
//     }, [papers]);

//     const tabs = [
//         { id: 'technicalCheck', label: 'Assigned Tasks', icon: <Microscope size={16} />, count: filteredPapers.technicalCheck.length },
//         { id: 'writeRecommendation', label: 'Ready for Recommendation', icon: <FileCheck size={16} />, count: filteredPapers.writeRecommendation.length },
//         { id: 'archive', label: 'Handed-off Archive', icon: <History size={16} />, count: filteredPapers.archive.length },
//     ];

//     // Status badge formatter for peer reviews
//     const getReviewStatusBadge = (rev) => {
//         if (rev.is_completed == 1) {
//             return (
//                 <span className="flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
//                     <CheckCircle2 size={12} /> Completed ({rev.recommendation || 'Evaluated'})
//                 </span>
//             );
//         }
//         if (rev.invitation_status === 'DECLINED') {
//             return (
//                 <span className="flex items-center gap-1 bg-rose-100 text-rose-700 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
//                     <XCircle size={12} /> Declined
//                 </span>
//             );
//         }
//         if (rev.invitation_status === 'ACCEPTED') {
//             return (
//                 <span className="flex items-center gap-1 bg-blue-100 text-blue-700 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
//                     <Clock size={12} /> In Review
//                 </span>
//             );
//         }
//         return (
//             <span className="flex items-center gap-1 bg-amber-100 text-amber-700 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
//                 <Clock size={12} /> Invitation Sent
//             </span>
//         );
//     };

//     return (
//         <div className="bg-[#f8fafc] min-h-screen p-4 md:p-8">
//             <div className="max-w-7xl mx-auto space-y-6">

//                 {/* Header */}
//                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
//                     <div>
//                         <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Associate Editor Workspace</h2>
//                         <p className="text-slate-500 font-medium">Technical Review Oversight & Reviewer Management</p>
//                     </div>
//                     <div className="text-[10px] font-black uppercase tracking-[0.2em] bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl border border-indigo-100 shadow-sm">
//                         Operator: {normalizedRole}
//                     </div>
//                 </div>

//                 {/* Tab Navigation */}
//                 <div className="flex bg-slate-200/50 p-1.5 rounded-2xl w-fit border border-slate-200 overflow-x-auto">
//                     {tabs.map(tab => (
//                         <button
//                             key={tab.id}
//                             onClick={() => setActiveTab(tab.id)}
//                             className={`flex items-center gap-3 py-2.5 px-6 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
//                                 activeTab === tab.id
//                                     ? 'bg-white text-indigo-700 shadow-md ring-1 ring-slate-200'
//                                     : 'text-slate-500 hover:text-indigo-600 hover:bg-white/50'
//                             }`}
//                         >
//                             {tab.icon} {tab.label}
//                             {tab.count > 0 && (
//                                 <span className={`ml-1 px-2 py-0.5 rounded-lg text-[10px] ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'bg-slate-300 text-slate-700'}`}>
//                                     {tab.count}
//                                 </span>
//                             )}
//                         </button>
//                     ))}
//                 </div>

//                 {/* Queue Content Area */}
//                 {loading ? (
//                     <div className="p-20 text-center flex flex-col items-center gap-4">
//                         <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
//                         <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Syncing queue...</p>
//                     </div>
//                 ) : filteredPapers[activeTab].length === 0 ? (
//                     <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
//                         <AlertCircle className="mx-auto text-slate-200 mb-4" size={64} />
//                         <h3 className="text-xl font-bold text-slate-400 uppercase tracking-tighter">Queue Clear</h3>
//                         <p className="text-slate-400 text-sm mt-1">No manuscripts are currently in this phase.</p>
//                     </div>
//                 ) : (
//                     <div className="grid gap-6">
//                         {filteredPapers[activeTab].map(p => {
//                             const normalizedStatus = String(p.status || '').toUpperCase().replace(/[\s_]+/g, '');

//                             return (
//                                 <div key={p.id} className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-all group">
//                                     <div className="flex flex-col lg:flex-row justify-between items-start gap-8">

//                                         {/* ======================================================== */}
//                                         {/* LEFT COLUMN: METADATA, VERSION COMPARISON, & REVIEWERS   */}
//                                         {/* ======================================================== */}
//                                         <div className="flex-1 space-y-4">
//                                             {/* Badges */}
//                                             <div className="flex flex-wrap items-center gap-3">
//                                                 <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-lg tracking-widest uppercase shadow-sm">
//                                                     ID: #{p.id}
//                                                 </span>

//                                                 <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase border ${
//                                                     p.status === 'Accepted' ? 'bg-green-100 text-green-700 border-green-200' :
//                                                     p.status === 'Rejected' ? 'bg-red-100 text-red-700 border-red-200' :
//                                                     p.status === 'Under Review' ? 'bg-amber-100 text-amber-700 border-amber-200' :
//                                                     p.status === 'Revisions Required' ? 'bg-orange-100 text-orange-700 border-orange-200' :
//                                                     p.status === 'Revision Submitted' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' :
//                                                     'bg-blue-100 text-blue-700 border-blue-200'
//                                                 }`}>
//                                                     {p.status}
//                                                 </span>

//                                                 <span className="bg-purple-100 text-purple-700 border border-purple-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
//                                                     {p.specialization}
//                                                 </span>

//                                                 <span className="bg-teal-100 text-teal-700 border border-teal-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
//                                                     {p.article_type}
//                                                 </span>
//                                             </div>

//                                             {/* Title */}
//                                             <h4 className="font-black text-2xl text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
//                                                 <LatexRenderer content={p.title} />
//                                             </h4>

//                                             {/* Author */}
//                                             {/* <div className="text-sm font-bold text-slate-500">
//                                                 Author: <span className="text-slate-900 font-black">{p.author_name || "N/A"}</span>
//                                             </div> */}

//                                             <div className="text-sm font-medium text-slate-600 flex items-center gap-2.5 flex-wrap">
//                                                 <span>Author: <strong className="text-slate-900 font-black">{p.author_name || "N/A"}</strong></span>
//                                                 {p.author_email && (
//                                                     <span className="text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-lg font-mono">
//                                                         {p.author_email}
//                                                     </span>
//                                                 )}
//                                             </div>

//                                             {/* ========================================================================= */}
//                                             {/* --- VERSION COMPARISON BOX: ORIGINAL PDF VS REVISED PDF ---              */}
//                                             {/* ========================================================================= */}
//                                             {(p.author_revision_notes || p.previous_manuscript_file_url || normalizedStatus === 'REVISIONSUBMITTED') && (
//                                                 <div className="mt-4 p-5 bg-amber-50/80 border-2 border-amber-200 rounded-3xl space-y-4 shadow-sm">
//                                                     <div className="flex items-center justify-between border-b border-amber-200 pb-2.5">
//                                                         <div className="flex items-center gap-2">
//                                                             <History size={18} className="text-amber-700" />
//                                                             <span className="text-xs font-black text-amber-900 uppercase tracking-wider">
//                                                                 Manuscript Version Comparison & Rebuttal
//                                                             </span>
//                                                         </div>
//                                                         <span className="text-[10px] font-bold uppercase bg-amber-200 text-amber-800 px-2.5 py-0.5 rounded-full">
//                                                             Revision Round
//                                                         </span>
//                                                     </div>

//                                                     {/* Side-by-Side Comparison Grid */}
//                                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                                                         {/* Version 1: Original */}
//                                                         <div className="p-4 bg-white rounded-2xl border border-amber-200 shadow-sm flex flex-col justify-between space-y-2">
//                                                             <div>
//                                                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
//                                                                     Version 1 — Original Submission
//                                                                 </span>
//                                                                 <p className="text-xs text-slate-500 mt-0.5">Initial version evaluated in Round 1</p>
//                                                             </div>
//                                                             {p.previous_manuscript_file_url ? (
//                                                                 <a
//                                                                     href={`${STATIC_ASSETS_BASE_URL}/uploads/${p.previous_manuscript_file_url.replace(/^(\/?uploads\/)/, "")}`}
//                                                                     target="_blank"
//                                                                     rel="noopener noreferrer"
//                                                                     className="inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
//                                                                 >
//                                                                     <Download size={14} /> Download Original PDF
//                                                                 </a>
//                                                             ) : (
//                                                                 <span className="text-xs text-slate-400 italic">Original file path not archived.</span>
//                                                             )}
//                                                         </div>

//                                                         {/* Version 2: Revised */}
//                                                         <div className="p-4 bg-white rounded-2xl border border-emerald-300 shadow-sm flex flex-col justify-between space-y-2 bg-emerald-50/30">
//                                                             <div>
//                                                                 <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest block">
//                                                                     Version 2 — Revised Manuscript
//                                                                 </span>
//                                                                 <p className="text-xs text-slate-500 mt-0.5">Updated PDF incorporating revisions</p>
//                                                             </div>
//                                                             <a
//                                                                 href={`${STATIC_ASSETS_BASE_URL}/uploads/${(p.manuscript_file_url || '').replace(/^(\/?uploads\/)/, "")}`}
//                                                                 target="_blank"
//                                                                 rel="noopener noreferrer"
//                                                                 className="inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
//                                                             >
//                                                                 <Download size={14} /> Download Revised PDF
//                                                             </a>
//                                                         </div>
//                                                     </div>

//                                                     {/* Author Point-by-Point Rebuttal */}
//                                                     {p.author_revision_notes && (
//                                                         <div className="p-4 bg-white rounded-2xl border border-amber-200 text-xs text-slate-800 leading-relaxed font-serif">
//                                                             <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest block mb-1">
//                                                                 Author's Response / Summary of Changes:
//                                                             </span>
//                                                             <LatexRenderer content={p.author_revision_notes} />
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             )}

//                                             {/* ======================================================== */}
//                                             {/* --- ASSIGNED REVIEWERS & TRACKING LIST ---               */}
//                                             {/* ======================================================== */}
//                                             <div className="mt-4 p-4 bg-slate-50/80 border border-slate-200 rounded-2xl">
//                                                 <div className="flex items-center justify-between pb-3 border-b border-slate-200">
//                                                     <div className="flex items-center gap-2">
//                                                         <Users size={16} className="text-indigo-600" />
//                                                         <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
//                                                             Assigned Reviewers ({p.reviews?.length || 0})
//                                                         </span>
//                                                     </div>

//                                                     {activeTab !== 'archive' && (
//                                                         <button
//                                                             onClick={() => setModalState({ type: 'invite-reviewer', paper: p })}
//                                                             className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 shadow-sm transition-all active:scale-95"
//                                                         >
//                                                             <UserPlus size={13} />
//                                                             <span>Add Reviewer</span>
//                                                         </button>
//                                                     )}
//                                                 </div>

//                                                 {/* Reviewers List */}
//                                                 {p.reviews && p.reviews.length > 0 ? (
//                                                     <div className="space-y-2.5 mt-3">
//                                                         {p.reviews.map((rev, idx) => (
//                                                             <div 
//                                                                 key={rev.id || idx} 
//                                                                 className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 shadow-sm"
//                                                             >
//                                                                 <div className="flex items-center gap-3 min-w-0">
//                                                                     <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-black shrink-0">
//                                                                         {idx + 1}
//                                                                     </div>
//                                                                     <div className="min-w-0">
//                                                                         <div className="flex items-center gap-2">
//                                                                             <p className="text-xs font-bold text-slate-900 truncate">
//                                                                                 {rev.reviewer_name || `Reviewer #${idx + 1}`}
//                                                                             </p>
//                                                                             <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
//                                                                                 Round {rev.round_number || 1}
//                                                                             </span>
//                                                                         </div>
//                                                                         <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 mt-0.5">
//                                                                             {rev.reviewer_email && <span>{rev.reviewer_email}</span>}
//                                                                             {(rev.assignment_date || rev.created_at) && (
//                                                                                 <span>
//                                                                                     • Assigned: {new Date(rev.assignment_date || rev.created_at).toLocaleDateString()}
//                                                                                 </span>
//                                                                             )}
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>

//                                                                 <div>
//                                                                     {getReviewStatusBadge(rev)}
//                                                                 </div>
//                                                             </div>
//                                                         ))}
//                                                     </div>
//                                                 ) : (
//                                                     <div className="py-4 text-center">
//                                                         <p className="text-xs text-slate-400 italic mb-2">No reviewers assigned to this paper yet.</p>
//                                                         {activeTab !== 'archive' && (
//                                                             <button
//                                                                 onClick={() => setModalState({ type: 'invite-reviewer', paper: p })}
//                                                                 className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-indigo-200 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-all"
//                                                             >
//                                                                 <UserPlus size={13} />
//                                                                 <span>Invite First Reviewer</span>
//                                                             </button>
//                                                         )}
//                                                     </div>
//                                                 )}
//                                             </div>

//                                             {/* Completed Review Intelligence (for Recommendation phase) */}
//                                             {activeTab === 'writeRecommendation' && (
//                                                 <div className="mt-4 p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-4">
//                                                     <div className="flex items-center gap-2 border-b border-indigo-100 pb-2">
//                                                         <MessageSquare className="text-indigo-600" size={16} />
//                                                         <h5 className="font-black text-indigo-900 text-xs uppercase tracking-widest">
//                                                             Reviewer Intelligence (Action Required)
//                                                         </h5>
//                                                     </div>
                                                    
//                                                     {p.reviews?.filter(r => r.is_completed == 1).map((rev, idx) => (
//                                                         <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-2">
//                                                             <div className="flex justify-between items-center mb-1">
//                                                                 <span className="font-bold text-indigo-900 text-xs">
//                                                                     Reviewer: {rev.reviewer_name || `Expert #${idx + 1}`} (Round {rev.round_number || 1})
//                                                                 </span>
//                                                                 <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
//                                                                     rev.recommendation?.toLowerCase().includes('reject') 
//                                                                         ? 'bg-rose-100 text-rose-600' 
//                                                                         : 'bg-emerald-100 text-emerald-600'
//                                                                 }`}>
//                                                                     {rev.recommendation}
//                                                                 </span>
//                                                             </div>

//                                                             {rev.comments_for_editor && (
//                                                                 <div className="p-3 bg-amber-50/70 rounded-xl border border-dotted border-amber-200">
//                                                                     <span className="text-[9px] font-black text-amber-700 uppercase block mb-1">
//                                                                         Confidential Note to AE:
//                                                                     </span>
//                                                                     <div className="text-xs text-amber-900 italic">
//                                                                         <LatexRenderer content={rev.comments_for_editor} />
//                                                                     </div>
//                                                                 </div>
//                                                             )}

//                                                             {rev.comments_for_author && (
//                                                                 <div className="p-2.5 bg-slate-50 rounded-lg">
//                                                                     <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">
//                                                                         Public Feedback for Author:
//                                                                     </span>
//                                                                     <div className="text-xs text-slate-600">
//                                                                         <LatexRenderer content={rev.comments_for_author} />
//                                                                     </div>
//                                                                 </div>
//                                                             )}
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                             )}
//                                         </div>

//                                         {/* ======================================================== */}
//                                         {/* RIGHT COLUMN: ACTION BUTTONS                             */}
//                                         {/* ======================================================== */}
//                                         <div className="lg:w-64 w-full flex flex-col gap-3 shrink-0">
//                                             {/* Download Current PDF */}
//                                             <a
//                                                 href={`${STATIC_ASSETS_BASE_URL}/uploads/${(p.manuscript_file_url || '').replace(/^(\/?uploads\/)/, "")}`}
//                                                 target="_blank" rel="noreferrer"
//                                                 className="flex items-center justify-center gap-2 w-full py-3 border-2 border-slate-100 text-slate-600 font-bold text-sm rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
//                                             >
//                                                 <Download size={18} /> View PDF
//                                             </a>

//                                             {/* Technical Check Tab Actions */}
//                                             {activeTab === 'technicalCheck' && (
//                                                 (normalizedStatus === 'REVISIONREQUIRED' || normalizedStatus === 'REVISIONSREQUIRED') ? (
//                                                     <div className="flex items-center justify-center gap-2 w-full py-3.5 bg-slate-100 text-slate-400 font-bold text-xs rounded-2xl border border-dashed border-slate-300">
//                                                         <History size={16} /> Waiting for Author
//                                                     </div>
//                                                 ) : normalizedStatus === 'REVISIONSUBMITTED' ? (
//                                                     <div className="flex flex-col gap-2">
//                                                         <button
//                                                             onClick={() => setModalState({ type: 'make-decision', paper: p })}
//                                                             className="flex items-center justify-center gap-2 w-full py-3.5 bg-emerald-600 text-white font-black text-xs rounded-2xl hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all active:scale-95 uppercase tracking-widest"
//                                                         >
//                                                             <FileCheck size={18} /> Make Recommendation
//                                                         </button>
//                                                         <button
//                                                             onClick={() => setModalState({ type: 'invite-reviewer', paper: p })}
//                                                             className="flex items-center justify-center gap-2 w-full py-2.5 border-2 border-indigo-100 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-xl hover:bg-indigo-100 transition-all"
//                                                         >
//                                                             <UserPlus size={16} /> Round 2 Review
//                                                         </button>
//                                                     </div>
//                                                 ) : (
//                                                     <div className="flex flex-col gap-2">
//                                                         {/* Standard Invite Reviewer Button */}
//                                                         <button
//                                                             onClick={() => setModalState({ type: 'invite-reviewer', paper: p })}
//                                                             className="flex items-center justify-center gap-2 w-full py-3.5 bg-indigo-600 text-white font-black text-sm rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95"
//                                                         >
//                                                             <UserPlus size={18} /> Invite Reviewer
//                                                         </button>

//                                                         {p.reviews && p.reviews.length > 0 && (
//                                                             <div className="flex items-center justify-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 py-2 rounded-xl border border-slate-100">
//                                                                 <Users size={12} /> {p.reviews.length} Assigned
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                 )
//                                             )}

//                                             {/* Ready for Recommendation Tab Actions */}
//                                             {activeTab === 'writeRecommendation' && (
//                                                 <div className="flex flex-col gap-2">
//                                                     <button
//                                                         onClick={() => setModalState({ type: 'make-decision', paper: p })}
//                                                         className="flex items-center justify-center gap-2 w-full py-3.5 bg-emerald-600 text-white font-black text-sm rounded-2xl hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all active:scale-95"
//                                                     >
//                                                         <FileCheck size={18} /> Recommend to ME
//                                                     </button>

//                                                     <button
//                                                         onClick={() => setModalState({ type: 'invite-reviewer', paper: p })}
//                                                         className="flex items-center justify-center gap-2 w-full py-2 border-2 border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all"
//                                                     >
//                                                         <UserPlus size={14} /> Invite Tie-Breaker
//                                                     </button>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>

//                                     {/* Workflow Stepper */}
//                                     <div className="mt-8 pt-6 border-t border-slate-50">
//                                         <WorkflowStepper currentStatus={p.status} role="ASSOCIATE_EDITOR" />
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 )}
//             </div>

//             {/* --- MODALS --- */}
//             {modalState.type === 'invite-reviewer' && (
//                 <AssignReviewerModal
//                     paper={modalState.paper}
//                     mode="reviewer"
//                     onClose={() => setModalState({ type: null, paper: null })}
//                     onAssignmentComplete={() => {
//                         setModalState({ type: null, paper: null });
//                         fetchPapers();
//                     }}
//                 />
//             )}

//             {modalState.type === 'make-decision' && (
//                 <MakeDecisionModal
//                     paper={modalState.paper}
//                     onClose={() => setModalState({ type: null, paper: null })}
//                     onDecisionMade={() => {
//                         setModalState({ type: null, paper: null });
//                         fetchPapers();
//                     }}
//                 />
//             )}
//         </div>
//     );
// };

// export default AssociateEditorDashboard;