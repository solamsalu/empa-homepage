import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../../context/AuthContext';
import { API_BASE_URL, STATIC_ASSETS_BASE_URL } from '../../../../utils/constants';
import { X, Send, Download, CheckSquare, AlertCircle } from 'lucide-react';
import PrimaryButton from '../../../common/PrimaryButton';
import LatexEditor from '../../../common/LatexEditor';
import LatexRenderer from '../../../common/LatexRenderer';

// Extracted outside the main component to prevent unmounting/remounting on every keystroke
const ScorePicker = ({ label, value, onChange }) => (
    <div className="flex flex-col gap-2">
        <span className="text-sm font-bold text-gray-700">{label}</span>
        <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
                <button
                    key={num}
                    type="button"
                    onClick={() => onChange(num)}
                    className={`w-10 h-10 rounded border text-sm font-bold transition-all ${value === num
                        ? 'bg-blue-600 text-white border-blue-600 shadow-inner'
                        : 'bg-white text-gray-600 hover:border-blue-400'
                        }`}
                >
                    {num}
                </button>
            ))}
        </div>
    </div>
);

const SubmitReviewModal = ({ assignment, onClose, onReviewSubmitted }) => {
    const { authToken } = useContext(AuthContext);

    const [recommendation, setRecommendation] = useState('');
    const [originalityScore, setOriginalityScore] = useState(3);
    const [rigorScore, setRigorScore] = useState(3);
    const [commentsForEditor, setCommentsForEditor] = useState('');
    const [commentsForAuthor, setCommentsForAuthor] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    
    const fileUrl = assignment?.file_path || '';

    const cleanPath = fileUrl.startsWith('/') ? fileUrl.substring(1) : fileUrl;
    const pdfUrl = `${STATIC_ASSETS_BASE_URL}/uploads/${cleanPath}`;

    const handleSubmit = async () => {
        setError(''); // Clear previous errors

        if (!recommendation) return setError('Please select a final recommendation.');
        if (commentsForAuthor.length < 50) return setError('Please provide more substantial feedback for the author (min. 50 chars).');
        if (!authToken) return setError("Authentication error. Please log out and log in again.");

        setIsSubmitting(true);

        try {
            await axios.post(
                `${API_BASE_URL}/journal-papers/reviews/${assignment.review_id}`,
                {
                    recommendation,
                    originality_score: originalityScore,
                    rigor_score: rigorScore,
                    comments_for_editor: commentsForEditor,
                    comments_for_author: commentsForAuthor
                },
                { headers: { 'Authorization': `Bearer ${authToken}` } }
            );
            onReviewSubmitted();
        } catch (err) {
            console.error("Review Submit Error:", err);
            setError(err.response?.data?.message || 'Failed to submit review.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <CheckSquare className="text-blue-600" size={20} />
                        <h3 className="text-xl font-bold text-blue-900">Peer Review Submission</h3>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-8 overflow-y-auto flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-blue-50/50 border border-blue-100 rounded-lg">
                        <div className="max-w-xl">
                            <p className="text-xs uppercase tracking-wider text-blue-600 font-bold mb-1">Manuscript Title</p>
                            <h4 className="font-bold text-gray-800"><LatexRenderer content={assignment?.title || 'Unknown Title'} /></h4>
                        </div>

                        <a
                            href={pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-md border border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white transition-all font-semibold shadow-sm text-sm"
                        >
                            <Download size={16} /> Open PDF
                        </a>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <label className="block text-base font-bold text-gray-800 mb-2">Recommendation *</label>
                            <select
                                value={recommendation}
                                onChange={e => setRecommendation(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="">Select...</option>
                                <option value="Accept">Accept</option>
                                <option value="Minor Revisions">Minor Revisions</option>
                                <option value="Major Revisions">Major Revisions</option>
                                <option value="Reject">Reject</option>
                            </select>
                        </div>
                        <ScorePicker label="Mathematical Originality (1-5)" value={originalityScore} onChange={setOriginalityScore} />
                        <ScorePicker label="Technical Rigor (1-5)" value={rigorScore} onChange={setRigorScore} />
                    </div>

                    <hr className="border-gray-100" />

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Confidential Comments Section */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-base font-bold text-gray-800">Confidential Comments for Editor</label>
                                <p className="text-xs text-gray-500 mb-2 italic">Not shared with authors.</p>
                                <div className="border border-gray-200 rounded-md overflow-hidden focus-within:border-blue-500 transition-colors">
                                    <LatexEditor
                                        value={commentsForEditor}
                                        onChange={setCommentsForEditor}
                                        placeholder="Private notes for the EIC..."
                                    />
                                </div>
                                {/* LIVE PREVIEW FOR EDITOR COMMENTS */}
                                {commentsForEditor && (
                                    <div className="mt-3 p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                                        <p className="text-[9px] font-black text-indigo-500 uppercase mb-2 tracking-widest">Confidential Preview</p>
                                        <div className="text-sm text-slate-700">
                                            <LatexRenderer content={commentsForEditor} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Feedback for Author Section */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-base font-bold text-gray-800">Constructive Feedback for Author</label>
                                <p className="text-xs text-gray-500 mb-2 italic">Anonymous feedback used to improve the work.</p>
                                <div className="border border-gray-200 rounded-md overflow-hidden focus-within:border-blue-500 transition-colors">
                                    <LatexEditor
                                        value={commentsForAuthor}
                                        onChange={setCommentsForAuthor}
                                        placeholder="Explain proofs, notations, or logical gaps..."
                                    />
                                </div>
                                {/* LIVE PREVIEW FOR AUTHOR FEEDBACK */}
                                {commentsForAuthor && (
                                    <div className="mt-3 p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                                        <p className="text-[9px] font-black text-blue-500 uppercase mb-2 tracking-widest">Author Feedback Preview</p>
                                        <div className="text-sm text-slate-700">
                                            <LatexRenderer content={commentsForAuthor} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 border-t flex justify-between items-center flex-shrink-0">
                    <div className="max-w-[50%]">
                        {error && <p className="text-red-600 text-xs font-bold animate-pulse flex items-center gap-1"><AlertCircle size={14} /> {error}</p>}
                    </div>
                    <div className="flex gap-4">
                        <button onClick={onClose} className="px-6 py-2 text-gray-600 font-semibold hover:text-gray-900 transition-colors">Cancel</button>
                        <PrimaryButton onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 px-8">
                            {isSubmitting ? 'Processing...' : 'Submit Final Review'}
                            {!isSubmitting && <Send size={16} />}
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmitReviewModal;