import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { API_BASE_URL, STATIC_ASSETS_BASE_URL } from '../../../utils/constants';
import { MANUSCRIPT_STATUS, ROLES } from '../../../utils/workflowConstants';
import WorkflowStepper from './common/WorkflowStepper';
import AssignReviewerModal from './Editor/AssignReviewerModal';
import MakeDecisionModal from './Editor/MakeDecisionModal';
import { Download, ArrowRight, UserPlus, XCircle, FileCheck, MessageSquare } from 'lucide-react';
import LatexRenderer from '../../common/LatexRenderer';
import UploadProductionModal from './Editor/UploadProductionModal';

const EditorDashboard = () => {
    const authContext = useContext(AuthContext);
    const [papers, setPapers] = useState([]);
    const [activeTab, setActiveTab] = useState('triage');
    const [loading, setLoading] = useState(true);
    const [modalState, setModalState] = useState({ type: null, paper: null });

    const { authToken, userRole, isAuthReady } = authContext || {};
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
            console.error("Failed to fetch papers:", e);
        } finally {
            setLoading(false);
        }
    }, [authToken]);

    useEffect(() => {
        if (isAuthReady && authToken) {
            if (normalizedRole === ROLES.ASSOCIATE_EDITOR) {
                setActiveTab('review');
            } else {
                setActiveTab('triage');
            }
            fetchPapers();
        }
    }, [isAuthReady, authToken, normalizedRole, fetchPapers]);

    const filteredPapers = useMemo(() => {
        const categories = { triage: [], review: [], decision: [], production: [], archive: [] };
        const toUC = (val) => String(val || '').toUpperCase().trim();

        papers.forEach(p => {
            const s = toUC(p.status);
            const ARCHIVE_LIST = ['REJECTED', 'REJECT', 'REJECTED_INITIAL', 'REJECTED_FINAL', 'PUBLISHED'];
            const DECISION_LIST = ['DECISION_PENDING', 'REVIEW_COMPLETED', 'DECISION PENDING', 'REVIEW COMPLETED'];
            const REVIEW_LIST = ['UNDER_REVIEW', 'UNDER REVIEW', 'REVISION_REQUIRED', 'REVISIONS REQUIRED', 'TECHNICAL_ASSESSMENT', 'WITH_ASSOCIATE_EDITOR'];
            const TRIAGE_LIST = ['SUBMITTED', 'INITIAL_CHECK', 'WITH_MANAGING_EDITOR'];
            const PRODUCTION_LIST = ['ACCEPTED', 'PRODUCTION', 'IN_PRODUCTION', 'COPY_EDITING', 'TYPESETTING'];

            if (ARCHIVE_LIST.includes(s)) categories.archive.push(p);
            else if (PRODUCTION_LIST.includes(s) || s.includes('PRODUCTION')) categories.production.push(p);
            else if (DECISION_LIST.includes(s)) categories.decision.push(p);
            else if (REVIEW_LIST.includes(s)) categories.review.push(p);
            else if (TRIAGE_LIST.includes(s)) categories.triage.push(p);
            else categories.triage.push(p);
        });
        return categories;
    }, [papers]);

    const canAccess = (tab) => {
        if (!normalizedRole) return false;
        const role = normalizedRole.toUpperCase().trim();
        if (['ADMIN', 'EIC', 'EDITOR_IN_CHIEF', 'MANAGING_EDITOR'].includes(role)) return true;
        if (role === 'ASSOCIATE_EDITOR') return ['review', 'decision', 'archive'].includes(tab);
        if ((role === 'PRODUCTION' || role === 'PRODUCTION_STAFF') && tab === 'production') return true;
        return false;
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow border min-h-[600px]">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-900">Editorial Workflow</h2>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">
                    Role: {normalizedRole}
                </div>
            </div>

            <div className="flex border-b mb-6 overflow-x-auto scrollbar-hide">
                {['triage', 'review', 'decision', 'production', 'archive'].map(tab => (
                    canAccess(tab) && (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium transition-all whitespace-nowrap
                            ${activeTab === tab ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
                            <span className="capitalize">{tab}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs ml-2 ${activeTab === tab ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-700'}`}>
                                {filteredPapers[tab]?.length || 0}
                            </span>
                        </button>
                    )
                ))}
            </div>

            {loading ? (
                <div className="p-20 text-center text-gray-500 flex flex-col items-center gap-4">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                    <p className="font-medium">Refreshing manuscript queue...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredPapers[activeTab]?.length === 0 ? (
                        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                            <p className="text-gray-400 font-medium">No manuscripts currently in the {activeTab} stage.</p>
                        </div>
                    ) : (
                        filteredPapers[activeTab].map(p => (
                            <div key={p.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-200">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 pr-4">
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <span className="bg-purple-100 text-purple-800 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-tight">{p.article_type}</span>
                                            <span className="bg-teal-100 text-teal-800 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-tight">{p.specialization}</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-tight ${p.reviewer_count > 0 ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                                                {(p.reviewer_count ?? p.reviews?.length ?? 0)} Reviewers Invited
                                            </span>
                                            <span className="ml-auto text-[10px] text-gray-400 font-mono">Status: {p.status}</span>
                                        </div>
                                        <h4 className="font-bold text-lg text-gray-900 leading-snug mb-2">
                                            <LatexRenderer content={p.title} />
                                        </h4>
                                        <div className="text-sm text-gray-500 mb-2">
                                            Author: <span className="text-gray-800 font-semibold">{p.author_name}</span>
                                        </div>

                                        {/* --- START: PRIVACY-AWARE REVIEW SUMMARY --- */}
                                        {activeTab === 'decision' && (
                                            <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                                <div className="flex items-center gap-2 mb-3 border-b border-slate-200 pb-2">
                                                    <MessageSquare className="text-indigo-600" size={16} />
                                                    <h5 className="font-bold text-slate-700 text-xs uppercase tracking-wider">AE Recommendation & Reviewer Feedback</h5>
                                                </div>

                                                {p.ae_recommendation && (
                                                    <div className="mb-4">
                                                        <span className="text-[10px] font-black text-indigo-500 uppercase">Associate Editor Rec:</span>
                                                        <div className="text-sm font-semibold text-slate-900 bg-indigo-50 p-2 rounded mt-1 border border-indigo-100">
                                                            {p.ae_recommendation}
                                                        </div>
                                                        {p.internal_workflow_notes && (
                                                            <div className="text-xs text-slate-600 mt-2 italic bg-white p-2 rounded border border-dotted border-slate-300">
                                                                <strong>AE Private Notes:</strong> <LatexRenderer content={p.internal_workflow_notes} />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="space-y-4"> {/* Increased spacing between different reviewers */}
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                        Cumulative Peer Review Feedback:
                                                    </span>

                                                    {p.reviews && p.reviews.length > 0 ? (
                                                        p.reviews.map((rev, idx) => (
                                                            <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-l-blue-500 border border-slate-200">
                                                                <div className="flex justify-between items-center mb-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="bg-blue-600 text-white text-[10px] h-5 w-5 flex items-center justify-center rounded-full font-bold">
                                                                            {idx + 1}
                                                                        </div>
                                                                        <span className="font-bold text-sm text-slate-800">Reviewer {idx + 1}</span>
                                                                    </div>
                                                                    <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                                                                        {rev.completed_at ? new Date(rev.completed_at).toLocaleDateString() : 'N/A'}
                                                                    </span>
                                                                </div>

                                                                {/* 1. Comments for the Author */}
                                                                <div className="text-sm text-slate-700 mb-3 bg-slate-50/50 p-2 rounded">
                                                                    <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Feedback for Author:</span>
                                                                    <LatexRenderer content={rev.comments_for_author} />
                                                                </div>

                                                                {/* 2. Confidential Comments (Only for Associate Editor) */}
                                                                {(normalizedRole === 'ASSOCIATE_EDITOR' || normalizedRole === 'ADMIN') && rev.comments_for_editor && (
                                                                    <div className="pt-3 border-t border-amber-100 bg-amber-50 p-3 rounded-md">
                                                                        <span className="text-[9px] font-bold text-amber-600 uppercase block mb-1">Confidential Note to Editor:</span>
                                                                        <div className="text-sm text-amber-900 italic">
                                                                            <LatexRenderer content={rev.comments_for_editor} />
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                <div className="mt-2 text-[11px]">
                                                                    <span className="font-bold text-slate-500">Recommendation: </span>
                                                                    <span className={`font-bold ${rev.recommendation?.toLowerCase().includes('reject') ? 'text-red-600' : 'text-green-600'}`}>
                                                                        {rev.recommendation}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                                            <p className="text-xs text-slate-400 italic">Waiting for reviewers to complete assignments...</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {/* --- END: PRIVACY-AWARE REVIEW SUMMARY --- */}
                                    </div>

                                    <div className="flex flex-col gap-3 items-end">
                                        <a href={`${STATIC_ASSETS_BASE_URL}${p.manuscript_file_url}`} target="_blank" rel="noreferrer"
                                            className="text-blue-600 text-xs font-bold flex gap-1.5 items-center hover:bg-blue-50 px-3 py-1.5 rounded-md border border-blue-100 transition-colors">
                                            <Download size={14} /> View PDF
                                        </a>
                                        <div className="flex flex-wrap gap-2 justify-end">
                                            {activeTab === 'triage' && ['MANAGING_EDITOR', 'ADMIN', 'EIC', 'EDITOR_IN_CHIEF'].includes(normalizedRole) && (
                                                <>
                                                    <button onClick={() => setModalState({ type: 'make-decision', paper: p })}
                                                        className="bg-white text-red-600 border border-red-200 px-3 py-1.5 rounded text-sm font-bold hover:bg-red-600 hover:text-white flex items-center gap-1 transition-all">
                                                        <XCircle size={14} /> Desk Reject
                                                    </button>
                                                    <button onClick={() => setModalState({ type: 'assign-associate', paper: p })}
                                                        className="bg-green-600 text-white px-3 py-1.5 rounded text-sm font-bold hover:bg-green-700 flex items-center gap-1 shadow-sm transition-all">
                                                        <ArrowRight size={14} /> Assign Associate
                                                    </button>
                                                </>
                                            )}

                                            {activeTab === 'review' && ['ASSOCIATE_EDITOR', 'MANAGING_EDITOR', 'ADMIN', 'EIC', 'EDITOR_IN_CHIEF'].includes(normalizedRole) && (
                                                <button onClick={() => setModalState({ type: 'invite-reviewer', paper: p })}
                                                    className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-bold hover:bg-blue-700 flex items-center gap-2 shadow-sm">
                                                    <UserPlus size={16} /> Invite Reviewer
                                                </button>
                                            )}

                                            {activeTab === 'decision' && ['ASSOCIATE_EDITOR', 'MANAGING_EDITOR', 'ADMIN', 'EIC', 'EDITOR_IN_CHIEF'].includes(normalizedRole) && (
                                                <button onClick={() => setModalState({ type: 'make-decision', paper: p })}
                                                    className="bg-indigo-600 text-white px-5 py-2 rounded text-sm font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-md transition-all transform hover:scale-105">
                                                    <FileCheck size={18} />
                                                    {normalizedRole === 'ASSOCIATE_EDITOR' ? 'Submit Recommendation' : 'Publish Decision'}
                                                </button>
                                            )}

                                            {activeTab === 'production' && ['MANAGING_EDITOR', 'ADMIN', 'EDITOR_IN_CHIEF', 'EIC', 'PRODUCTION_STAFF'].includes(normalizedRole) && (
                                                <div className="flex gap-2">
                                                    {p.status.toUpperCase() === 'ACCEPTED' ? (
                                                        <button onClick={() => setModalState({ type: 'assign-production', paper: p })}
                                                            className="bg-emerald-600 text-white px-4 py-1.5 rounded text-sm font-bold hover:bg-emerald-700 flex items-center gap-2 shadow-sm transition-all">
                                                            <UserPlus size={16} /> Assign to Production
                                                        </button>
                                                    ) : (
                                                        <button onClick={() => setModalState({ type: 'upload-production', paper: p })}
                                                            className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-bold hover:bg-blue-700 flex items-center gap-2 shadow-sm transition-all">
                                                            <FileCheck size={16} /> Upload Final Files & Publish
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 pt-4 border-t border-gray-50">
                                    <WorkflowStepper currentStatus={p.status} />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Modals */}
            {modalState.type === 'upload-production' && (
                <UploadProductionModal
                    paper={modalState.paper}
                    onClose={() => setModalState({ type: null, paper: null })}
                    onUploadComplete={() => { setModalState({ type: null, paper: null }); fetchPapers(); }}
                />
            )}

            {(modalState.type === 'assign-associate' || modalState.type === 'invite-reviewer' || modalState.type === 'assign-production') && (
                <AssignReviewerModal
                    paper={modalState.paper}
                    mode={modalState.type === 'assign-production' ? 'production' : (modalState.type === 'assign-associate' ? 'associate' : 'reviewer')}
                    onClose={() => setModalState({ type: null, paper: null })}
                    onAssignmentComplete={() => { setModalState({ type: null, paper: null }); fetchPapers(); }}
                />
            )}

            {modalState.type === 'make-decision' && (
                <MakeDecisionModal
                    paper={modalState.paper}
                    onClose={() => setModalState({ type: null, paper: null })}
                    onDecisionMade={() => { setModalState({ type: null, paper: null }); fetchPapers(); }}
                />
            )}
        </div>
    );
};

export default EditorDashboard;