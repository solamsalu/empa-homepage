// // import React, { useState, useContext } from 'react';
// // import axios from 'axios';
// // import { AuthContext } from '../../../../context/AuthContext';
// // import { API_BASE_URL, STATIC_ASSETS_BASE_URL } from '../../../../utils/constants';
// // import { X, Send, Download, CheckSquare, AlertCircle } from 'lucide-react';
// // import PrimaryButton from '../../../common/PrimaryButton';
// // import LatexEditor from '../../../common/LatexEditor';
// // import LatexRenderer from '../../../common/LatexRenderer';

// // // Extracted outside the main component to prevent unmounting/remounting on every keystroke
// // const ScorePicker = ({ label, value, onChange }) => (
// //     <div className="flex flex-col gap-2">
// //         <span className="text-sm font-bold text-gray-700">{label}</span>
// //         <div className="flex gap-2">
// //             {[1, 2, 3, 4, 5].map((num) => (
// //                 <button
// //                     key={num}
// //                     type="button"
// //                     onClick={() => onChange(num)}
// //                     className={`w-10 h-10 rounded border text-sm font-bold transition-all ${value === num
// //                         ? 'bg-blue-600 text-white border-blue-600 shadow-inner'
// //                         : 'bg-white text-gray-600 hover:border-blue-400'
// //                         }`}
// //                 >
// //                     {num}
// //                 </button>
// //             ))}
// //         </div>
// //     </div>
// // );

// // const SubmitReviewModal = ({ assignment, onClose, onReviewSubmitted }) => {
// //     const { authToken } = useContext(AuthContext);

// //     const [recommendation, setRecommendation] = useState('');
// //     const [originalityScore, setOriginalityScore] = useState(3);
// //     const [rigorScore, setRigorScore] = useState(3);
// //     const [commentsForEditor, setCommentsForEditor] = useState('');
// //     const [commentsForAuthor, setCommentsForAuthor] = useState('');
// //     const [error, setError] = useState('');
// //     const [isSubmitting, setIsSubmitting] = useState(false);

    
// //     const fileUrl = assignment?.file_path || '';

// //     const cleanPath = fileUrl.startsWith('/') ? fileUrl.substring(1) : fileUrl;
// //     const pdfUrl = `${STATIC_ASSETS_BASE_URL}/uploads/${cleanPath}`;

// //     const handleSubmit = async () => {
// //         setError(''); // Clear previous errors

// //         if (!recommendation) return setError('Please select a final recommendation.');
// //         if (commentsForAuthor.length < 50) return setError('Please provide more substantial feedback for the author (min. 50 chars).');
// //         if (!authToken) return setError("Authentication error. Please log out and log in again.");

// //         setIsSubmitting(true);

// //         try {
// //             await axios.post(
// //                 `${API_BASE_URL}/journal-papers/reviews/${assignment.review_id}`,
// //                 {
// //                     recommendation,
// //                     originality_score: originalityScore,
// //                     rigor_score: rigorScore,
// //                     comments_for_editor: commentsForEditor,
// //                     comments_for_author: commentsForAuthor
// //                 },
// //                 { headers: { 'Authorization': `Bearer ${authToken}` } }
// //             );
// //             onReviewSubmitted();
// //         } catch (err) {
// //             console.error("Review Submit Error:", err);
// //             setError(err.response?.data?.message || 'Failed to submit review.');
// //         } finally {
// //             setIsSubmitting(false);
// //         }
// //     };

// //     return (
// //         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
// //             <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] overflow-hidden">
// //                 <div className="p-4 border-b flex justify-between items-center bg-gray-50 flex-shrink-0">
// //                     <div className="flex items-center gap-2">
// //                         <CheckSquare className="text-blue-600" size={20} />
// //                         <h3 className="text-xl font-bold text-blue-900">Peer Review Submission</h3>
// //                     </div>
// //                     <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
// //                         <X size={24} className="text-gray-500" />
// //                     </button>
// //                 </div>

// //                 <div className="p-6 space-y-8 overflow-y-auto flex-grow">
// //                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-blue-50/50 border border-blue-100 rounded-lg">
// //                         <div className="max-w-xl">
// //                             <p className="text-xs uppercase tracking-wider text-blue-600 font-bold mb-1">Manuscript Title</p>
// //                             <h4 className="font-bold text-gray-800"><LatexRenderer content={assignment?.title || 'Unknown Title'} /></h4>
// //                         </div>

// //                         <a
// //                             href={pdfUrl}
// //                             target="_blank"
// //                             rel="noopener noreferrer"
// //                             className="flex-shrink-0 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-md border border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white transition-all font-semibold shadow-sm text-sm"
// //                         >
// //                             <Download size={16} /> Open PDF
// //                         </a>
// //                     </div>

// //                     <div className="grid md:grid-cols-3 gap-8">
// //                         <div>
// //                             <label className="block text-base font-bold text-gray-800 mb-2">Recommendation *</label>
// //                             <select
// //                                 value={recommendation}
// //                                 onChange={e => setRecommendation(e.target.value)}
// //                                 className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
// //                             >
// //                                 <option value="">Select...</option>
// //                                 <option value="Accept">Accept</option>
// //                                 <option value="Minor Revisions">Minor Revisions</option>
// //                                 <option value="Major Revisions">Major Revisions</option>
// //                                 <option value="Reject">Reject</option>
// //                             </select>
// //                         </div>
// //                         <ScorePicker label="Mathematical Originality (1-5)" value={originalityScore} onChange={setOriginalityScore} />
// //                         <ScorePicker label="Technical Rigor (1-5)" value={rigorScore} onChange={setRigorScore} />
// //                     </div>

// //                     <hr className="border-gray-100" />

// //                     <div className="grid md:grid-cols-2 gap-8">
// //                         {/* Confidential Comments Section */}
// //                         <div className="space-y-4">
// //                             <div>
// //                                 <label className="block text-base font-bold text-gray-800">Confidential Comments for Editor</label>
// //                                 <p className="text-xs text-gray-500 mb-2 italic">Not shared with authors.</p>
// //                                 <div className="border border-gray-200 rounded-md overflow-hidden focus-within:border-blue-500 transition-colors">
// //                                     <LatexEditor
// //                                         value={commentsForEditor}
// //                                         onChange={setCommentsForEditor}
// //                                         placeholder="Private notes for the EIC..."
// //                                     />
// //                                 </div>
// //                                 {/* LIVE PREVIEW FOR EDITOR COMMENTS */}
// //                                 {commentsForEditor && (
// //                                     <div className="mt-3 p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
// //                                         <p className="text-[9px] font-black text-indigo-500 uppercase mb-2 tracking-widest">Confidential Preview</p>
// //                                         <div className="text-sm text-slate-700">
// //                                             <LatexRenderer content={commentsForEditor} />
// //                                         </div>
// //                                     </div>
// //                                 )}
// //                             </div>
// //                         </div>

// //                         {/* Feedback for Author Section */}
// //                         <div className="space-y-4">
// //                             <div>
// //                                 <label className="block text-base font-bold text-gray-800">Constructive Feedback for Author</label>
// //                                 <p className="text-xs text-gray-500 mb-2 italic">Anonymous feedback used to improve the work.</p>
// //                                 <div className="border border-gray-200 rounded-md overflow-hidden focus-within:border-blue-500 transition-colors">
// //                                     <LatexEditor
// //                                         value={commentsForAuthor}
// //                                         onChange={setCommentsForAuthor}
// //                                         placeholder="Explain proofs, notations, or logical gaps..."
// //                                     />
// //                                 </div>
// //                                 {/* LIVE PREVIEW FOR AUTHOR FEEDBACK */}
// //                                 {commentsForAuthor && (
// //                                     <div className="mt-3 p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
// //                                         <p className="text-[9px] font-black text-blue-500 uppercase mb-2 tracking-widest">Author Feedback Preview</p>
// //                                         <div className="text-sm text-slate-700">
// //                                             <LatexRenderer content={commentsForAuthor} />
// //                                         </div>
// //                                     </div>
// //                                 )}
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>

// //                 <div className="p-4 bg-gray-50 border-t flex justify-between items-center flex-shrink-0">
// //                     <div className="max-w-[50%]">
// //                         {error && <p className="text-red-600 text-xs font-bold animate-pulse flex items-center gap-1"><AlertCircle size={14} /> {error}</p>}
// //                     </div>
// //                     <div className="flex gap-4">
// //                         <button onClick={onClose} className="px-6 py-2 text-gray-600 font-semibold hover:text-gray-900 transition-colors">Cancel</button>
// //                         <PrimaryButton onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 px-8">
// //                             {isSubmitting ? 'Processing...' : 'Submit Final Review'}
// //                             {!isSubmitting && <Send size={16} />}
// //                         </PrimaryButton>
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };

// // export default SubmitReviewModal;


// import React, { useState, useContext } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../../../../context/AuthContext';
// import { API_BASE_URL, STATIC_ASSETS_BASE_URL } from '../../../../utils/constants';
// import { X, Send, Lock, Eye, CheckCircle2, ShieldCheck, Loader2, Download, AlertCircle } from 'lucide-react';
// import PrimaryButton from '../../../common/PrimaryButton';
// import LatexEditor from '../../../common/LatexEditor';
// import LatexRenderer from '../../../common/LatexRenderer';
// import { toast } from 'react-toastify';

// const SubmitReviewModal = ({ assignment, onClose, onReviewSubmitted }) => {
//     const { authToken } = useContext(AuthContext);

//     const paperId = assignment?.paper_id || assignment?.paperId || assignment?.id || '';
//     const paperTitle = (assignment?.title || assignment?.paper_title || 'Manuscript').replace(/<[^>]+>/g, '').trim();

//     // Reviewer Text Fields
//     const [recommendation, setRecommendation] = useState('');
//     const [commentsForEditor, setCommentsForEditor] = useState('');
//     const [commentsForAuthor, setCommentsForAuthor] = useState('');

//     // Reviewer Rubric Scores (1-5 scale)
//     const [scores, setScores] = useState({
//         originality: 3,
//         methodology: 3,
//         clarity: 3,
//         significance: 3
//     });

//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [error, setError] = useState('');

//     const handleScoreChange = (field, value) => {
//         setScores(prev => ({ ...prev, [field]: parseInt(value, 10) }));
//     };

//     const calculateOverallScore = () => {
//         const total = scores.originality + scores.methodology + scores.clarity + scores.significance;
//         return (total / 4).toFixed(1);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//         if (!recommendation) {
//             toast.warn("Please select a final recommendation.");
//             return;
//         }

//         if (!commentsForAuthor.trim()) {
//             toast.warn("Constructive comments for the author are required.");
//             return;
//         }

//         setIsSubmitting(true);
//         setError('');

//         try {
//             // Bundle scores for backend storage
//             const payload = {
//                 recommendation,
//                 comments_for_editor: commentsForEditor,
//                 comments_for_author: commentsForAuthor,
//                 rubric_scores: {
//                     ...scores,
//                     overall_score: parseFloat(calculateOverallScore())
//                 }
//             };

//             await axios.post(
//                 `${API_BASE_URL}/journal-papers/reviews/${assignment.review_id}`,
//                 payload,
//                 { headers: { Authorization: `Bearer ${authToken}` } }
//             );
            
//             toast.success("Peer review evaluation submitted successfully!");
//             onReviewSubmitted();
//         } catch (err) {
//             const msg = err.response?.data?.message || "Failed to submit review.";
//             toast.error(msg);
//             setError(msg);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
//             <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden animate-in zoom-in duration-200">
                
//                 {/* Header */}
//             <div className="p-6 border-b flex justify-between items-center bg-slate-50">
//                 <div className="flex items-center gap-4">
//                     <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-lg">
//                         <ShieldCheck size={24} />
//                     </div>
//                     <div>
//                         <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Submit Technical Evaluation</h3>
//                         <p className="text-xs text-slate-500 font-medium truncate max-w-xl mt-0.5">
//                             Manuscript <span className="font-mono font-bold text-slate-800">#ID-{paperId}</span>: {paperTitle}
//                         </p>
//                     </div>
//                 </div>
                
//                     <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
//                         <X size={24} className="text-slate-400" />
//                     </button>
//                 </div>

//                 <div className="flex-grow overflow-hidden flex flex-col lg:flex-row">
                    
//                     {/* LEFT PANEL: Rubric Scoring */}
//                     <div className="lg:w-1/3 bg-slate-50 border-r overflow-y-auto p-6 space-y-6">
//                         <div>
//                             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
//                                 Evaluation Rubric
//                             </h4>
//                             <p className="text-[11px] text-slate-500 mb-6 italic leading-relaxed">
//                                 Rate the manuscript across the following dimensions (1 = Poor, 5 = Excellent). This data helps editors synthesize decisions.
//                             </p>

//                             <div className="space-y-6">
//                                 {/* Originality */}
//                                 <div className="space-y-2">
//                                     <label className="text-xs font-bold text-slate-700 flex justify-between">
//                                         <span>Originality & Novelty</span>
//                                         <span className="text-indigo-600 font-black">{scores.originality}/5</span>
//                                     </label>
//                                     <input 
//                                         type="range" min="1" max="5" step="1" 
//                                         value={scores.originality} 
//                                         onChange={(e) => handleScoreChange('originality', e.target.value)} 
//                                         className="w-full accent-indigo-600 cursor-pointer"
//                                     />
//                                 </div>

//                                 {/* Mathematical Rigor */}
//                                 <div className="space-y-2">
//                                     <label className="text-xs font-bold text-slate-700 flex justify-between">
//                                         <span>Mathematical Rigor & Proofs</span>
//                                         <span className="text-indigo-600 font-black">{scores.methodology}/5</span>
//                                     </label>
//                                     <input 
//                                         type="range" min="1" max="5" step="1" 
//                                         value={scores.methodology} 
//                                         onChange={(e) => handleScoreChange('methodology', e.target.value)} 
//                                         className="w-full accent-indigo-600 cursor-pointer"
//                                     />
//                                 </div>

//                                 {/* Clarity */}
//                                 <div className="space-y-2">
//                                     <label className="text-xs font-bold text-slate-700 flex justify-between">
//                                         <span>Clarity of Presentation</span>
//                                         <span className="text-indigo-600 font-black">{scores.clarity}/5</span>
//                                     </label>
//                                     <input 
//                                         type="range" min="1" max="5" step="1" 
//                                         value={scores.clarity} 
//                                         onChange={(e) => handleScoreChange('clarity', e.target.value)} 
//                                         className="w-full accent-indigo-600 cursor-pointer"
//                                     />
//                                 </div>

//                                 {/* Significance */}
//                                 <div className="space-y-2">
//                                     <label className="text-xs font-bold text-slate-700 flex justify-between">
//                                         <span>Significance to the Field</span>
//                                         <span className="text-indigo-600 font-black">{scores.significance}/5</span>
//                                     </label>
//                                     <input 
//                                         type="range" min="1" max="5" step="1" 
//                                         value={scores.significance} 
//                                         onChange={(e) => handleScoreChange('significance', e.target.value)} 
//                                         className="w-full accent-indigo-600 cursor-pointer"
//                                     />
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Overall Computed Score Display */}
//                         <div className="mt-8 p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-sm">
//                             <span className="text-xs font-black uppercase text-slate-500">Computed Rating:</span>
//                             <span className="text-lg font-black text-indigo-700">{calculateOverallScore()} / 5.0</span>
//                         </div>
//                     </div>

//                     {/* RIGHT PANEL: Written Feedback & Final Verdict */}
//                     <form onSubmit={handleSubmit} className="lg:w-2/3 p-8 overflow-y-auto space-y-6 bg-white flex flex-col justify-between">
//                         <div className="space-y-6">
                            
//                             {error && (
//                                 <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-medium">
//                                     <AlertCircle size={16} /> <span>{error}</span>
//                                 </div>
//                             )}

//                             {/* 1. Final Recommendation */}
//                             <div>
//                                 <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2.5">
//                                     1. Formal Recommendation *
//                                 </label>
//                                 <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
//                                     {['Accept', 'Minor Revision', 'Major Revision', 'Reject'].map(opt => (
//                                         <button
//                                             key={opt}
//                                             type="button"
//                                             onClick={() => setRecommendation(opt)}
//                                             className={`p-3 rounded-xl border-2 font-bold text-xs text-center transition-all flex flex-col items-center justify-center gap-1 ${
//                                                 recommendation === opt 
//                                                     ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' 
//                                                     : 'border-slate-100 text-slate-600 hover:border-slate-300'
//                                             }`}
//                                         >
//                                             <span>{opt}</span>
//                                             {recommendation === opt && <CheckCircle2 size={14} className="text-indigo-600 mt-1" />}
//                                         </button>
//                                     ))}
//                                 </div>
//                             </div>

//                             {/* 2. Public Comments to Author */}
//                             <div className="space-y-2">
//                                 <label className="block text-xs font-black text-slate-700 uppercase tracking-wider flex items-center justify-between">
//                                     <span className="flex items-center gap-1.5 text-blue-700">
//                                         <Eye size={14} /> 2. Constructive Feedback for Author *
//                                     </span>
//                                 </label>
//                                 <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-600">
//                                     <LatexEditor
//                                         value={commentsForAuthor}
//                                         onChange={setCommentsForAuthor}
//                                         placeholder="Provide detailed, constructive critique (LaTeX formulas supported)..."
//                                     />
//                                 </div>
//                                 {commentsForAuthor && (
//                                     <div className="mt-3 p-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-xs text-slate-700">
//                                         <span className="text-[9px] font-black uppercase text-blue-600 block mb-1">Author Preview:</span>
//                                         <LatexRenderer content={commentsForAuthor} />
//                                     </div>
//                                 )}
//                             </div>

//                             {/* 3. Confidential Comments to Editor */}
//                             <div className="space-y-2">
//                                 <label className="block text-xs font-black text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
//                                     <Lock size={14} /> 3. Confidential Note to Editor (Optional)
//                                 </label>
//                                 <div className="border border-amber-200 rounded-xl overflow-hidden focus-within:border-amber-500 bg-amber-50/20">
//                                     <LatexEditor
//                                         value={commentsForEditor}
//                                         onChange={setCommentsForEditor}
//                                         placeholder="Any private concerns regarding plagiarism, ethics, or overall quality..."
//                                     />
//                                 </div>
//                                 {commentsForEditor && (
//                                     <div className="mt-3 p-3 bg-amber-50 border border-dashed border-amber-200 rounded-xl text-xs text-amber-900">
//                                         <span className="text-[9px] font-black uppercase text-amber-700 block mb-1">Confidential Preview:</span>
//                                         <LatexRenderer content={commentsForEditor} />
//                                     </div>
//                                 )}
//                                 <p className="text-[10px] text-slate-400 italic">This note will strictly be visible only to the handling Associate Editor and Managing Editor.</p>
//                             </div>

//                         </div>

//                         {/* Footer */}
//                         <div className="pt-4 border-t border-slate-100 flex justify-end items-center gap-3">
//                             <button 
//                                 type="button"
//                                 onClick={onClose} 
//                                 className="px-5 py-2.5 font-bold text-xs text-slate-400 hover:text-slate-600 rounded-xl"
//                             >
//                                 Cancel
//                             </button>
//                             <PrimaryButton
//                                 type="submit"
//                                 disabled={isSubmitting || !recommendation || !commentsForAuthor.trim()}
//                                 className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-xl text-xs uppercase tracking-wider font-black shadow-lg flex items-center gap-2"
//                             >
//                                 {isSubmitting ? (
//                                     <><Loader2 size={16} className="animate-spin" /> Transmitting...</>
//                                 ) : (
//                                     <><Send size={15} /> Submit Evaluation</>
//                                 )}
//                             </PrimaryButton>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SubmitReviewModal;




// src/components/pages/journal/Reviewer/SubmitReviewModal.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../../context/AuthContext';
import { API_BASE_URL } from '../../../../utils/constants';
import { X, Send, Lock, Eye, CheckCircle2, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import PrimaryButton from '../../../common/PrimaryButton';
import LatexEditor from '../../../common/LatexEditor';
import LatexRenderer from '../../../common/LatexRenderer';
import { toast } from 'react-toastify';

const SubmitReviewModal = ({ assignment, onClose, onReviewSubmitted }) => {
    const { authToken } = useContext(AuthContext);

    // ✅ FULLY SAFE optional chaining to prevent undefined crashes
    const paperId = assignment?.paper_id || assignment?.paperId || assignment?.id || 'N/A';
    const reviewId = assignment?.review_id || assignment?.id || '';
    const paperTitle = (assignment?.title || assignment?.paper_title || 'Manuscript').replace(/<[^>]+>/g, '').trim();

    // Reviewer Text Fields
    const [recommendation, setRecommendation] = useState('');
    const [commentsForEditor, setCommentsForEditor] = useState('');
    const [commentsForAuthor, setCommentsForAuthor] = useState('');

    // Reviewer Rubric Scores (1-5 scale)
    const [scores, setScores] = useState({
        originality: 3,
        methodology: 3,
        clarity: 3,
        significance: 3
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleScoreChange = (field, value) => {
        setScores(prev => ({ ...prev, [field]: parseInt(value, 10) }));
    };

    const calculateOverallScore = () => {
        const total = scores.originality + scores.methodology + scores.clarity + scores.significance;
        return (total / 4).toFixed(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!recommendation) {
            toast.warn("Please select a final recommendation.");
            return;
        }

        if (!commentsForAuthor.trim()) {
            toast.warn("Constructive comments for the author are required.");
            return;
        }

        if (!reviewId) {
            toast.error("Review Assignment ID is missing.");
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const payload = {
                recommendation,
                comments_for_editor: commentsForEditor,
                comments_for_author: commentsForAuthor,
                rubric_scores: {
                    ...scores,
                    overall_score: parseFloat(calculateOverallScore())
                }
            };

            await axios.post(
                `${API_BASE_URL}/journal-papers/reviews/${reviewId}`,
                payload,
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            
            toast.success("Peer review evaluation submitted successfully!");
            if (onReviewSubmitted) onReviewSubmitted();
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to submit review.";
            toast.error(msg);
            setError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full h-[92vh] flex flex-col overflow-hidden animate-in zoom-in duration-200">
                
                {/* Header */}
                <div className="p-6 border-b flex justify-between items-center bg-slate-50 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-lg">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Submit Technical Evaluation</h3>
                            <p className="text-xs text-slate-500 font-medium truncate max-w-xl mt-0.5">
                                Manuscript <span className="font-mono font-bold text-slate-800">#ID-{paperId}</span>: {paperTitle}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={24} className="text-slate-400" />
                    </button>
                </div>

                <div className="flex-grow overflow-hidden flex flex-col lg:flex-row">
                    
                    {/* LEFT PANEL: Rubric Scoring */}
                    <div className="lg:w-1/3 bg-slate-50 border-r overflow-y-auto p-6 space-y-6">
                        <div>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                                Evaluation Rubric
                            </h4>
                            <p className="text-[11px] text-slate-500 mb-6 italic leading-relaxed">
                                Rate the manuscript across the following dimensions (1 = Poor, 5 = Excellent). This data helps editors synthesize decisions.
                            </p>

                            <div className="space-y-6">
                                {/* Originality */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 flex justify-between">
                                        <span>Originality & Novelty</span>
                                        <span className="text-indigo-600 font-black">{scores.originality}/5</span>
                                    </label>
                                    <input 
                                        type="range" min="1" max="5" step="1" 
                                        value={scores.originality} 
                                        onChange={(e) => handleScoreChange('originality', e.target.value)} 
                                        className="w-full accent-indigo-600 cursor-pointer"
                                    />
                                </div>

                                {/* Mathematical Rigor */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 flex justify-between">
                                        <span>Mathematical Rigor & Proofs</span>
                                        <span className="text-indigo-600 font-black">{scores.methodology}/5</span>
                                    </label>
                                    <input 
                                        type="range" min="1" max="5" step="1" 
                                        value={scores.methodology} 
                                        onChange={(e) => handleScoreChange('methodology', e.target.value)} 
                                        className="w-full accent-indigo-600 cursor-pointer"
                                    />
                                </div>

                                {/* Clarity */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 flex justify-between">
                                        <span>Clarity of Presentation</span>
                                        <span className="text-indigo-600 font-black">{scores.clarity}/5</span>
                                    </label>
                                    <input 
                                        type="range" min="1" max="5" step="1" 
                                        value={scores.clarity} 
                                        onChange={(e) => handleScoreChange('clarity', e.target.value)} 
                                        className="w-full accent-indigo-600 cursor-pointer"
                                    />
                                </div>

                                {/* Significance */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 flex justify-between">
                                        <span>Significance to the Field</span>
                                        <span className="text-indigo-600 font-black">{scores.significance}/5</span>
                                    </label>
                                    <input 
                                        type="range" min="1" max="5" step="1" 
                                        value={scores.significance} 
                                        onChange={(e) => handleScoreChange('significance', e.target.value)} 
                                        className="w-full accent-indigo-600 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Overall Computed Score Display */}
                        <div className="mt-8 p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-sm">
                            <span className="text-xs font-black uppercase text-slate-500">Computed Rating:</span>
                            <span className="text-lg font-black text-indigo-700">{calculateOverallScore()} / 5.0</span>
                        </div>
                    </div>

                    {/* RIGHT PANEL: Written Feedback & Final Verdict */}
                    <form onSubmit={handleSubmit} className="lg:w-2/3 p-8 overflow-y-auto space-y-6 bg-white flex flex-col justify-between">
                        <div className="space-y-6">
                            
                            {error && (
                                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-medium">
                                    <AlertCircle size={16} /> <span>{error}</span>
                                </div>
                            )}

                            {/* 1. Final Recommendation */}
                            <div>
                                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2.5">
                                    1. Formal Recommendation *
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                                    {['Accept', 'Minor Revision', 'Major Revision', 'Reject'].map(opt => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setRecommendation(opt)}
                                            className={`p-3 rounded-xl border-2 font-bold text-xs text-center transition-all flex flex-col items-center justify-center gap-1 ${
                                                recommendation === opt 
                                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' 
                                                    : 'border-slate-100 text-slate-600 hover:border-slate-300'
                                            }`}
                                        >
                                            <span>{opt}</span>
                                            {recommendation === opt && <CheckCircle2 size={14} className="text-indigo-600 mt-1" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 2. Public Comments to Author */}
                            <div className="space-y-2">
                                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 text-blue-700">
                                        <Eye size={14} /> 2. Constructive Feedback for Author *
                                    </span>
                                </label>
                                <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-600">
                                    <LatexEditor
                                        value={commentsForAuthor}
                                        onChange={setCommentsForAuthor}
                                        placeholder="Provide detailed, constructive critique (LaTeX formulas supported)..."
                                    />
                                </div>
                                {commentsForAuthor && (
                                    <div className="mt-3 p-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-xs text-slate-700">
                                        <span className="text-[9px] font-black uppercase text-blue-600 block mb-1">Author Preview:</span>
                                        <LatexRenderer content={commentsForAuthor} />
                                    </div>
                                )}
                            </div>

                            {/* 3. Confidential Comments to Editor */}
                            <div className="space-y-2">
                                <label className="block text-xs font-black text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                                    <Lock size={14} /> 3. Confidential Note to Editor (Optional)
                                </label>
                                <div className="border border-amber-200 rounded-xl overflow-hidden focus-within:border-amber-500 bg-amber-50/20">
                                    <LatexEditor
                                        value={commentsForEditor}
                                        onChange={setCommentsForEditor}
                                        placeholder="Any private concerns regarding plagiarism, ethics, or overall quality..."
                                    />
                                </div>
                                {commentsForEditor && (
                                    <div className="mt-3 p-3 bg-amber-50 border border-dashed border-amber-200 rounded-xl text-xs text-amber-900">
                                        <span className="text-[9px] font-black uppercase text-amber-700 block mb-1">Confidential Preview:</span>
                                        <LatexRenderer content={commentsForEditor} />
                                    </div>
                                )}
                                <p className="text-[10px] text-slate-400 italic">This note will strictly be visible only to the handling Associate Editor and Managing Editor.</p>
                            </div>

                        </div>

                        {/* Footer */}
                        <div className="pt-4 border-t border-slate-100 flex justify-end items-center gap-3 flex-shrink-0">
                            <button 
                                type="button"
                                onClick={onClose} 
                                className="px-5 py-2.5 font-bold text-xs text-slate-400 hover:text-slate-600 rounded-xl"
                            >
                                Cancel
                            </button>
                            <PrimaryButton
                                type="submit"
                                disabled={isSubmitting || !recommendation || !commentsForAuthor.trim()}
                                className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-xl text-xs uppercase tracking-wider font-black shadow-lg flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <><Loader2 size={16} className="animate-spin" /> Transmitting...</>
                                ) : (
                                    <><Send size={15} /> Submit Evaluation</>
                                )}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SubmitReviewModal;