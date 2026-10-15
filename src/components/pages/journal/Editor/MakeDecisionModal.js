import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../../context/AuthContext';
import { API_BASE_URL } from '../../../../utils/constants';
import { X, Send, ShieldCheck, MessageSquare, Lock, Eye, AlertCircle } from 'lucide-react';
import PrimaryButton from '../../../common/PrimaryButton';
import LatexEditor from '../../../common/LatexEditor';
import LatexRenderer from '../../../common/LatexRenderer';

const MakeDecisionModal = ({ paper, onClose, onDecisionMade }) => {
    const { authToken, userRole } = useContext(AuthContext);
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [decision, setDecision] = useState('');
    
    // Notes states
    const [editorNotes, setEditorNotes] = useState(''); // ME/EIC Decision Letter
    const [aeCommentsForAuthor, setAeCommentsForAuthor] = useState(''); // AE comments to Author
    const [internalNotes, setInternalNotes] = useState(''); // AE private note to ME/EIC
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Determine if the user is an Associate Editor (recommending) or ME/EIC (final decision)
    const normalizedRole = userRole?.toUpperCase().replace(/[\s_]+/g, '_') || '';
    const isRecommendation = normalizedRole === 'ASSOCIATE_EDITOR';

    const title = isRecommendation ? "Submit Recommendation to Managing Editor" : "Final Editorial Decision";
    const btnLabel = isRecommendation ? "Submit Recommendation" : "Finalize & Publish Decision";

    useEffect(() => {
        const fetchReviews = async () => {
            if (!authToken) return;
            setIsLoading(true);
            try {
                const res = await axios.get(`${API_BASE_URL}/journal-papers/${paper.id}/reviews`, {
                    headers: { 'Authorization': `Bearer ${authToken}` }
                });
                setReviews(res.data.data || []);
            } catch (err) {
                setError("Could not load reviewer reports.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchReviews();
    }, [paper.id, authToken]);

    const handleSubmit = async () => {
        if (!decision) {
            alert(isRecommendation ? "Please select an editorial recommendation." : "Please select a final decision status.");
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // Build payload based on role
            const payload = isRecommendation ? {
                status: decision,
                editor_notes: internalNotes,              // Stored as internal_workflow_notes (confidential to ME)
                ae_comments_for_author: aeCommentsForAuthor, // Stored as ae_comments_for_author (visible to author)
                is_recommendation: true
            } : {
                status: decision,
                editor_notes: editorNotes,                // Stored as editor_decision_notes (formal decision letter)
                is_recommendation: false
            };

            const response = await axios.put(
                `${API_BASE_URL}/journal-papers/${paper.id}/make-decision`,
                payload,
                { headers: { 'Authorization': `Bearer ${authToken}` } }
            );

            if (response.data.status === 'success' || response.status === 200) {
                onDecisionMade();
            } else {
                setError("Server saved data but returned unexpected status.");
            }
        } catch (err) {
            console.error("Decision Error:", err);
            setError(err.response?.data?.message || "Failed to submit decision.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden animate-in zoom-in duration-200">

                {/* Header */}
                <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${isRecommendation ? 'bg-indigo-600' : 'bg-blue-900'} text-white shadow-lg`}>
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{title}</h3>
                            
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                                Manuscript #ID-{paper.id}: {paper.title}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={24} className="text-slate-400" />
                    </button>
                </div>

                <div className="flex-grow overflow-hidden flex flex-col lg:flex-row">

                    {/* ======================================================== */}
                    {/* LEFT PANEL: Reviewer & AE Feedback (Intelligence Area)   */}
                    {/* ======================================================== */}
                    <div className="lg:w-1/2 bg-slate-50 border-r overflow-y-auto p-6 space-y-6">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-2">
                            Intelligence Briefing & Peer Review Reports
                        </h4>

                        {/* If ME/EIC is deciding: Show the Associate Editor's Evaluation */}
                        {!isRecommendation && (paper.ae_recommendation || paper.internal_workflow_notes || paper.ae_comments_for_author) && (
                            <div className="p-5 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-3 shadow-sm">
                                <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                                    <div className="flex items-center gap-2 text-indigo-700">
                                        <MessageSquare size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Handling Associate Editor</span>
                                    </div>
                                    {paper.ae_email && (
                                        <span className="text-xs font-bold text-indigo-900">
                                            {paper.ae_name} &lt;{paper.ae_email}&gt;
                                        </span>
                                    )}
                                </div>

                                <p className="text-base font-bold text-indigo-900">
                                    Verdict Recommendation: <span className="underline">{paper.ae_recommendation || 'Pending'}</span>
                                </p>

                                {paper.internal_workflow_notes && (
                                    <div className="p-3 bg-white rounded-xl border border-indigo-100 text-xs text-indigo-900 italic leading-relaxed">
                                        <strong className="block text-[9px] uppercase tracking-wider text-indigo-500 mb-1">Confidential Rationale to ME/EIC:</strong>
                                        <LatexRenderer content={paper.internal_workflow_notes} />
                                    </div>
                                )}

                                {paper.ae_comments_for_author && (
                                    <div className="p-3 bg-white rounded-xl border border-indigo-100 text-xs text-slate-700 leading-relaxed">
                                        <strong className="block text-[9px] uppercase tracking-wider text-slate-400 mb-1">AE Remarks for Author:</strong>
                                        <LatexRenderer content={paper.ae_comments_for_author} />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Reviewer Reports */}
                        <div className="space-y-4">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                                Expert Peer Review Reports ({reviews.length})
                            </span>

                            {isLoading ? (
                                <p className="text-xs text-slate-400 italic">Loading reviewer reports...</p>
                            ) : reviews.length === 0 ? (
                                <p className="text-xs text-slate-400 italic">No completed reviews recorded for this paper yet.</p>
                            ) : (
                                reviews.map((r, i) => (
                                    <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                            <div>
                                                <span className="font-bold text-slate-800 text-sm block">
                                                    {r.reviewer_name || `Reviewer ${i + 1}`}
                                                </span>
                                                {r.reviewer_email && (
                                                    <span className="text-[11px] text-slate-400">{r.reviewer_email}</span>
                                                )}
                                            </div>
                                            <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                                                r.recommendation?.toLowerCase().includes('reject')
                                                    ? 'bg-rose-100 text-rose-700'
                                                    : r.recommendation?.toLowerCase().includes('revision')
                                                        ? 'bg-amber-100 text-amber-700'
                                                        : 'bg-emerald-100 text-emerald-700'
                                            }`}>
                                                {r.recommendation}
                                            </span>
                                        </div>

                                        {/* Confidential comments to Editor */}
                                        {r.comments_for_editor && (
                                            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-100 text-xs text-amber-900 italic leading-relaxed">
                                                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-amber-700 mb-1">
                                                    <Lock size={12} /> Confidential Note to Editor (Not shared with Author):
                                                </div>
                                                <LatexRenderer content={r.comments_for_editor} />
                                            </div>
                                        )}

                                        {/* Public comments for Author */}
                                        <div className="text-xs text-slate-600 leading-relaxed pt-1">
                                            <span className="text-[9px] font-black uppercase text-slate-400 block mb-1">
                                                Comments for Author:
                                            </span>
                                            <LatexRenderer content={r.comments_for_author || "No specific author comments provided."} />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* ======================================================== */}
                    {/* RIGHT PANEL: Decision / Recommendation Form             */}
                    {/* ======================================================== */}
                    <div className="lg:w-1/2 p-8 overflow-y-auto space-y-6 bg-white flex flex-col justify-between">
                        <div className="space-y-6">
                            {error && (
                                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                                    <AlertCircle size={16} className="shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* 1. Status Selection */}
                            <div>
                                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2.5">
                                    {isRecommendation ? "1. Select Editorial Recommendation" : "1. Select Final Decision Status"}
                                </label>
                                <div className="grid grid-cols-3 gap-2.5">
                                    {['Accepted', 'Revision Required', 'Rejected'].map(opt => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setDecision(opt)}
                                            className={`p-3 rounded-xl border-2 font-bold text-xs text-center transition-all flex flex-col items-center justify-center gap-1 ${
                                                decision === opt 
                                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' 
                                                    : 'border-slate-100 text-slate-600 hover:border-slate-300'
                                            }`}
                                        >
                                            <span>{opt}</span>
                                            {decision === opt && <Send size={12} className="text-indigo-600" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* ======================================================== */}
                            {/* CASE A: ASSOCIATE EDITOR RECOMMENDATION FORM             */}
                            {/* ======================================================== */}
                            {isRecommendation ? (
                                <div className="space-y-5">
                                    {/* 2. Comments for the Author */}
                                    <div className="space-y-2">
                                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider flex items-center justify-between">
                                            <span className="flex items-center gap-1.5 text-blue-700">
                                                <Eye size={14} /> 2. Technical Comments for Author (Visible to Author)
                                            </span>
                                        </label>
                                        <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-600">
                                            <LatexEditor
                                                value={aeCommentsForAuthor}
                                                onChange={setAeCommentsForAuthor}
                                                placeholder="Enter technical summary and revision instructions for the author..."
                                            />
                                        </div>

                                        {aeCommentsForAuthor && (
                                            <div className="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-xs text-slate-700">
                                                <span className="text-[9px] font-black uppercase text-blue-600 block mb-1">Author Preview:</span>
                                                <LatexRenderer content={aeCommentsForAuthor} />
                                            </div>
                                        )}
                                    </div>

                                    {/* 3. Confidential Rationale to EIC / ME */}
                                    <div className="space-y-2">
                                        <label className="block text-xs font-black text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                                            <Lock size={14} /> 3. Confidential Rationale to Managing Editor (Not Visible to Author)
                                        </label>
                                        <div className="border border-amber-200 rounded-xl overflow-hidden focus-within:border-amber-500 bg-amber-50/20">
                                            <LatexEditor
                                                value={internalNotes}
                                                onChange={setInternalNotes}
                                                placeholder="Explain your technical justification and verdict for the Managing Editor & EIC..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* ======================================================== */
                                /* CASE B: MANAGING EDITOR / EIC FINAL DECISION FORM         */
                                /* ======================================================== */
                                <div className="space-y-3">
                                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                                        2. Formal Decision Letter / Remarks to Author
                                    </label>
                                    
                                    <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:border-blue-600">
                                        <LatexEditor
                                            value={editorNotes}
                                            onChange={setEditorNotes}
                                            placeholder="Dear Author, We write to inform you that following peer review..."
                                        />
                                    </div>

                                    {editorNotes && (
                                        <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-xs text-slate-700 max-h-40 overflow-y-auto">
                                            <span className="text-[9px] font-black uppercase text-blue-600 block mb-1">Live Decision Preview:</span>
                                            <LatexRenderer content={editorNotes} />
                                        </div>
                                    )}

                                    <p className="text-[11px] text-slate-400 italic">
                                        * This letter will be transmitted to the author and recorded in their Author Workspace.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="pt-4 border-t border-slate-100 flex justify-end items-center gap-3">
                            <button 
                                type="button"
                                onClick={onClose} 
                                className="px-5 py-2.5 font-bold text-xs text-slate-400 hover:text-slate-600 rounded-xl"
                            >
                                Cancel
                            </button>
                            <PrimaryButton
                                onClick={handleSubmit}
                                disabled={isSubmitting || !decision}
                                className={`${isRecommendation ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-900 hover:bg-blue-800'} px-8 py-3 rounded-xl text-xs uppercase tracking-wider font-black shadow-lg`}
                            >
                                {isSubmitting ? 'Submitting...' : btnLabel}
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MakeDecisionModal;
