import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../../context/AuthContext';
import { API_BASE_URL } from '../../../../utils/constants';
import { ROLES, MANUSCRIPT_STATUS } from '../../../../utils/workflowConstants';
import { X, Send, ShieldCheck, MessageSquare, Info, AlertCircle } from 'lucide-react';
import PrimaryButton from '../../../common/PrimaryButton';
import LatexEditor from '../../../common/LatexEditor';
import LatexRenderer from '../../../common/LatexRenderer';

const MakeDecisionModal = ({ paper, onClose, onDecisionMade }) => {
    const { authToken, userRole } = useContext(AuthContext);
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [decision, setDecision] = useState('');
    const [editorNotes, setEditorNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Determine if the person logged in is an AE (recommending) or ME/EIC (deciding)
    const isRecommendation = userRole?.toUpperCase() === 'ASSOCIATE_EDITOR';

    const title = isRecommendation ? "Submit Recommendation to EIC" : "Final Editorial Decision";
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
            alert("Please select a recommendation.");
            return;
        }

        const roleIsAE = userRole?.toLowerCase().includes('associate');
        setIsSubmitting(true);
        setError('');

        try {
            const response = await axios.put(
                `${API_BASE_URL}/journal-papers/${paper.id}/make-decision`,
                {
                    status: decision,
                    editor_notes: editorNotes,
                    is_recommendation: roleIsAE
                },
                { headers: { 'Authorization': `Bearer ${authToken}` } }
            );

            // --- THE FIX: Robust closing logic ---
            if (response.data.status === 'success' || response.status === 200) {
                console.log("Decision successful, closing modal...");
                onDecisionMade(); // This tells the dashboard to refresh and set modalState to null
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
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in duration-200">

                {/* Header */}
                <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${isRecommendation ? 'bg-indigo-600' : 'bg-blue-900'} text-white shadow-lg`}>
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{title}</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Manuscript #ID-{paper.id}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={24} className="text-slate-400" />
                    </button>
                </div>

                <div className="flex-grow overflow-hidden flex flex-col lg:flex-row">

                    {/* LEFT PANEL: Reviewer & AE Feedback (Reading Area) */}
                    <div className="lg:w-1/2 bg-slate-50 border-r overflow-y-auto p-6 space-y-6">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-2">Intelligence Briefing</h4>

                        {/* If ME is deciding, show what the AE said */}
                        {!isRecommendation && paper.ae_recommendation && (
                            <div className="p-5 bg-indigo-600 rounded-2xl text-white shadow-xl">
                                <div className="flex items-center gap-2 mb-2 opacity-80">
                                    <MessageSquare size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Associate Editor Recommendation</span>
                                </div>
                                <p className="text-lg font-bold mb-2">Verdict: {paper.ae_recommendation}</p>
                                <div className="text-sm bg-white/10 p-3 rounded-xl italic leading-relaxed">
                                    <LatexRenderer content={paper.internal_workflow_notes} />
                                </div>
                            </div>
                        )}

                        {/* Reviewer Reports */}
                        <div className="space-y-4">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expert Peer Reports</span>
                            {reviews.map((r, i) => (
                                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="font-bold text-slate-800 text-sm">Reviewer {i + 1}</span>
                                        <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-slate-100 text-slate-600">{r.recommendation}</span>
                                    </div>
                                    <div className="text-sm text-slate-600 leading-relaxed border-t pt-3">
                                        <LatexRenderer content={r.comments_for_author} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT PANEL: The Decision Form (Action Area) */}
                    <div className="lg:w-1/2 p-8 overflow-y-auto space-y-8 bg-white">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-black text-slate-700 uppercase tracking-tight mb-3">1. Select Final Status</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {['Accepted', 'Revision Required', 'Rejected'].map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => setDecision(opt)}
                                            className={`p-4 rounded-xl border-2 font-bold text-left transition-all flex justify-between items-center ${decision === opt ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-500 hover:border-slate-200'
                                                }`}
                                        >
                                            {opt}
                                            {decision === opt && <Send size={16} />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col flex-grow">
                                <label className="block text-sm font-black text-slate-700 uppercase tracking-tight mb-3">2. Formal Letter to Author</label>
                                {/* <div className="flex-grow min-h-[300px] border-2 border-slate-100 rounded-2xl overflow-hidden focus-within:border-blue-600 transition-colors">
                                    <LatexEditor
                                        value={editorNotes}
                                        onChange={setEditorNotes}
                                        placeholder="Dear Author, We are pleased/sorry to inform you..."
                                    />
                                </div> */}

                                {/* <div className="flex flex-col gap-4"> */}
                                    {/* Editor Input Area */}
                                    {/* <div className="flex-grow min-h-[300px] border-2 border-slate-100 rounded-2xl overflow-hidden focus-within:border-blue-600 transition-colors">
                                        <LatexEditor
                                            value={editorNotes}
                                            onChange={setEditorNotes}
                                            placeholder="Dear Author, We are pleased/sorry to inform you..."
                                        />
                                    </div> */}

                                    {/* LIVE LATEX PREVIEW AREA */}
                                    {/* {editorNotes && (
                                        <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                                            <div className="flex items-center justify-between mb-4">
                                                <p className="text-[10px] font-black uppercase text-blue-600 tracking-[0.2em]">
                                                    Live Decision Preview
                                                </p>
                                                <span className="text-[9px] font-medium text-slate-400 italic">
                                                    Rendering LaTeX in real-time
                                                </span>
                                            </div>

                                            <div className="prose prose-slate max-w-none text-slate-800">
                                                <LatexRenderer content={editorNotes} />
                                            </div>
                                            
                                        </div>
                                    )}
                                </div> */}
                                <div className="flex flex-col gap-4 flex-grow">
  {/* Editor Input Area */}
  <div className="flex-1 border-2 border-slate-100 rounded-2xl overflow-hidden focus-within:border-blue-600 transition-colors">
    <LatexEditor
      value={editorNotes}
      onChange={setEditorNotes}
      placeholder="Dear Author, We are pleased/sorry to inform you..."
    />
  </div>

  {/* Live Preview */}
  {editorNotes && (
    <div className="flex-1 p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-black uppercase text-blue-600 tracking-[0.2em]">
          Live Decision Preview
        </p>
        <span className="text-[9px] font-medium text-slate-400 italic">
          Rendering LaTeX in real-time
        </span>
      </div>
      <div className="prose prose-slate max-w-none text-slate-800">
        <LatexRenderer content={editorNotes} />
      </div>
      <p className="text-[11px] text-slate-500 italic mt-4">
        Use <code>f(x)</code> for math symbols (e.g., <code>\alpha</code>, <code>\sum</code>).
      </p>
    </div>
  )}
</div>

                                <p className="text-[10px] text-slate-400 mt-2 italic">Note: Author will see this message in their dashboard.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50 border-t flex justify-end items-center gap-4">
                    <button onClick={onClose} className="px-6 py-2 font-bold text-slate-400 hover:text-slate-600">Cancel</button>
                    <PrimaryButton
                        onClick={handleSubmit}
                        disabled={isSubmitting || !decision}
                        className="bg-blue-900 shadow-xl px-10"
                    >
                        {isSubmitting ? 'Syncing...' : btnLabel}
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
};

export default MakeDecisionModal;