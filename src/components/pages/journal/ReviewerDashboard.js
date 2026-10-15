
// import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../../../context/AuthContext';
// import { API_BASE_URL, STATIC_ASSETS_BASE_URL } from '../../../utils/constants';
// import {
//     Clock, CheckCircle, ChevronDown, FileText, Calendar,
//     AlertCircle, Inbox, RefreshCw, XCircle, CheckSquare, Download
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import SubmitReviewModal from './Reviewer/SubmitReviewModal';
// import LatexRenderer from '../../common/LatexRenderer';

// // --- Reusable Card Component ---
// const ReviewAssignmentCard = ({ assignment, onStartReview, onStatusUpdate }) => {
//     const { authToken } = useContext(AuthContext);
//     const [isExpanded, setIsExpanded] = useState(false);
//     const [isUpdating, setIsUpdating] = useState(false);
//     const [pendingAction, setPendingAction] = useState(null); // 'ACCEPTED' | 'DECLINED' | null

//     const isOverdue = new Date(assignment.due_date) < new Date() && !assignment.is_completed;
//     const isRevision = !!assignment.author_revision_notes;

//     const handleInvitation = async (status) => {
//         // Removed window.confirm because our smart modal handles the confirmation now!
//         setIsUpdating(true);
//         try {
//             await axios.patch(
//                 `${API_BASE_URL}/journal-papers/reviews/${assignment.review_id}/invitation`,
//                 { status },
//                 { headers: { Authorization: `Bearer ${authToken}` } }
//             );
//             onStatusUpdate();
//         } catch (err) {
//             alert(err.response?.data?.message || "Failed to update invitation status.");
//         } finally {
//             setIsUpdating(false);
//         }
//     };

//     return (
//         <div className={`bg-white border rounded-xl shadow-sm overflow-hidden transition-all ${isOverdue ? 'border-red-200' : 'border-gray-200'} ${isRevision && !assignment.is_completed ? 'ring-2 ring-amber-100 border-amber-200' : ''}`}>
//             <div
//                 onClick={() => setIsExpanded(!isExpanded)}
//                 className="w-full p-5 flex justify-between items-center text-left cursor-pointer hover:bg-gray-50/80"
//             >
//                 <div className="flex-grow pr-4">
                    
//                     <div className="flex items-center gap-2 mb-1">
//                         {assignment.is_completed ? (
//                             <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">Completed</span>
//                         ) : (
//                             <div className="flex gap-1.5">
//                                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${isOverdue ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
//                                     {assignment.invitation_status === 'PENDING' ? 'New Invitation' : (isOverdue ? 'Overdue' : 'Action Required')}
//                                 </span>
//                                 {isRevision && (
//                                     <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
//                                         <RefreshCw size={10} /> Revision
//                                     </span>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                     <h4 className="font-bold text-lg text-blue-900 leading-tight">
//                         <LatexRenderer content={assignment.title} />
//                     </h4>
//                     <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 font-medium">
//                         <span className="flex items-center gap-1"><Calendar size={12} /> Due: {new Date(assignment.due_date || Date.now()).toLocaleDateString()}</span>
//                         <span>•</span>
//                         <span>Ref: #REV-{assignment.review_id}</span>
//                     </div>
//                 </div>
//                 <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
//             </div>

//             <AnimatePresence>
//                 {isExpanded && (
//                     <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-gray-50/50">
//                         <div className="px-6 pb-6 pt-2 border-t border-gray-100 space-y-5">

//                             {/* Manuscript File Download Section */}
//                             <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
//                                 <div className="flex items-center gap-3">
//                                     <div className="p-2.5 bg-indigo-600 text-white rounded-lg shadow-indigo-100 shadow-lg">
//                                         <FileText size={20} />
//                                     </div>
//                                     <div>
//                                         <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Manuscript PDF</p>
//                                         <p className="text-xs text-slate-500">Download file for technical evaluation</p>
//                                     </div>
//                                 </div>
//                                 <a
//                                     // href={`${STATIC_ASSETS_BASE_URL}/uploads/${assignment.file_path}`}
//                                     href={`${STATIC_ASSETS_BASE_URL}/uploads/${(assignment.file_path || '').replace(/^(\/?uploads\/)/, "")}`}
//                                     target="_blank"
//                                     rel="noreferrer noopener"
//                                     className="px-4 py-2 bg-white text-indigo-600 border border-indigo-100 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2 shadow-sm"
//                                 >
//                                     <Download size={14} /> Download File
//                                 </a>
//                             </div>

//                             {isRevision && (
//                                 <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
//                                     <p className="text-[10px] font-bold text-amber-800 uppercase mb-1">Author's Response to Previous Round</p>
//                                     <div className="text-sm text-amber-900 italic">
//                                         <LatexRenderer content={assignment.author_revision_notes} />
//                                     </div>
//                                 </div>
//                             )}

//                             <div>
//                                 <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Abstract</h5>
//                                 <div className="p-4 border bg-white rounded-lg text-sm text-gray-700 shadow-sm leading-relaxed">
//                                     <LatexRenderer content={assignment.abstract} />
//                                 </div>
//                             </div>

//                             <div className="flex justify-end items-center gap-3 pt-2">
//                                 {assignment.invitation_status === 'PENDING' ? (
//                                     <div className="flex gap-3">
//                                         <button
//                                             disabled={isUpdating}
//                                             onClick={(e) => { e.stopPropagation(); setPendingAction('DECLINED'); }}
//                                             className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                                         >
//                                             <XCircle size={16} /> Decline Request
//                                         </button>
//                                         <button
//                                             disabled={isUpdating}
//                                             onClick={(e) => { e.stopPropagation(); setPendingAction('ACCEPTED'); }}
//                                             className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-md transition-all active:scale-95"
//                                         >
//                                             <CheckSquare size={16} /> Accept & Proceed
//                                         </button>
//                                     </div>
//                                 ) : !assignment.is_completed && (
//                                     <button
//                                         onClick={(e) => { e.stopPropagation(); onStartReview(assignment); }}
//                                         className={`px-6 py-2 ${isRevision ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-900 hover:bg-blue-800'} text-white text-sm font-bold rounded-lg shadow-lg flex items-center gap-2 transition-all active:scale-95`}
//                                     >
//                                         <FileText size={16} /> {isRevision ? 'Start Round 2 Review' : 'Submit Technical Evaluation'}
//                                     </button>
//                                 )}
//                             </div>
//                         </div>
//                     </motion.div>
//                 )}
//             </AnimatePresence>

//             {/* SMART CONFIRMATION MODAL */}
//             <AnimatePresence>
//                 {pendingAction && (
//                     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
//                         <motion.div 
//                             initial={{ opacity: 0, scale: 0.95, y: 10 }}
//                             animate={{ opacity: 1, scale: 1, y: 0 }}
//                             exit={{ opacity: 0, scale: 0.95, y: 10 }}
//                             className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-100"
//                         >
//                             <div className={`p-6 ${pendingAction === 'ACCEPTED' ? 'bg-blue-50' : 'bg-red-50'}`}>
//                                 <div className="flex items-center gap-4 mb-2">
//                                     <div className={`p-3 rounded-full ${pendingAction === 'ACCEPTED' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
//                                         {pendingAction === 'ACCEPTED' ? <CheckSquare size={24} /> : <XCircle size={24} />}
//                                     </div>
//                                     <h3 className="text-lg font-bold text-slate-800">
//                                         {pendingAction === 'ACCEPTED' ? 'Accept Invitation?' : 'Decline Invitation?'}
//                                     </h3>
//                                 </div>
//                                 <p className="text-sm text-slate-600 mt-2">
//                                     {pendingAction === 'ACCEPTED' 
//                                         ? "You are about to accept this review assignment. You will be expected to complete the technical evaluation within the allotted timeframe."
//                                         : "Are you sure you want to decline? You will be removed from this assignment, and the editor will be notified."}
//                                 </p>
//                             </div>

//                             <div className="p-4 bg-white flex justify-end gap-3 border-t border-slate-100">
//                                 <button
//                                     onClick={() => setPendingAction(null)}
//                                     disabled={isUpdating}
//                                     className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     onClick={() => {
//                                         handleInvitation(pendingAction);
//                                         setPendingAction(null);
//                                     }}
//                                     disabled={isUpdating}
//                                     className={`flex items-center gap-2 px-5 py-2 text-sm font-bold text-white rounded-lg transition-all shadow-sm disabled:opacity-70 ${
//                                         pendingAction === 'ACCEPTED' 
//                                             ? 'bg-blue-600 hover:bg-blue-700' 
//                                             : 'bg-red-600 hover:bg-red-700'
//                                     }`}
//                                 >
//                                     {isUpdating && <RefreshCw size={14} className="animate-spin" />}
//                                     {pendingAction === 'ACCEPTED' ? 'Yes, Accept' : 'Yes, Decline'}
//                                 </button>
//                             </div>
//                         </motion.div>
//                     </div>
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// };

// const ReviewerDashboard = () => {
//     const { authToken, isAuthReady } = useContext(AuthContext);
//     const [allAssignments, setAllAssignments] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [activeTab, setActiveTab] = useState('invitations');
//     const [reviewingAssignment, setReviewingAssignment] = useState(null);

//     const fetchAssignments = useCallback(async () => {
//         if (!authToken) return;
//         setIsLoading(true);
//         try {
//             const response = await axios.get(`${API_BASE_URL}/journal-papers/review-assignments`, {
//                 headers: { Authorization: `Bearer ${authToken}` }
//             });
//             const data = response.data.data || response.data;
//             setAllAssignments(Array.isArray(data) ? data : []);
//             setError('');
//         } catch (err) {
//             setError('Unable to load assignments.');
//         } finally {
//             setIsLoading(false);
//         }
//     }, [authToken]);

//     const { invitations, activeReviews, completedHistory } = useMemo(() => ({
//         invitations: allAssignments.filter(a => a.invitation_status === 'PENDING'),
//         activeReviews: allAssignments.filter(a => a.invitation_status === 'ACCEPTED' && !a.is_completed),
        
//         // Filter for completed tasks AND sort them descending (newest first)
//         completedHistory: allAssignments
//             .filter(a => a.is_completed)
//             .sort((a, b) => {
//                 // If you have a specific date field for when it was completed (like 'updated_at'), use that.
//                 // Otherwise, 'due_date' or just falling back to 'review_id' works perfectly!
//                 const dateA = new Date(a.updated_at || a.due_date).getTime();
//                 const dateB = new Date(b.updated_at || b.due_date).getTime();
                
//                 // If timestamps aren't working, fallback to sorting by the highest review_id
//                 if (isNaN(dateA) || isNaN(dateB)) {
//                      return b.review_id - a.review_id; 
//                 }
                
//                 return dateB - dateA;
//             }),
//     }), [allAssignments]);

//     const tabs = [
//         { id: 'invitations', label: 'Invitations', icon: <Inbox size={18} />, count: invitations.length },
//         { id: 'pending', label: 'Active Tasks', icon: <Clock size={18} />, count: activeReviews.length },
//         { id: 'completed', label: 'History', icon: <CheckCircle size={18} />, count: completedHistory.length },
//     ];

//     useEffect(() => {
//         if (isAuthReady && authToken) fetchAssignments();
//     }, [authToken, isAuthReady, fetchAssignments]);

//     const renderContent = () => {
//         let reviewsToDisplay = [];
//         if (activeTab === 'invitations') reviewsToDisplay = invitations;
//         else if (activeTab === 'pending') reviewsToDisplay = activeReviews;
//         else reviewsToDisplay = completedHistory;

//         if (isLoading) return (
//             <div className="p-20 text-center">
//                 <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
//                 <p className="text-gray-500 font-medium italic">Loading your reviewer queue...</p>
//             </div>
//         );

//         if (error) return (
//             <div className="p-12 text-center text-red-500 bg-red-50 rounded-xl border border-red-100 flex items-center gap-2 justify-center">
//                 <AlertCircle size={20} /><p className="font-bold">{error}</p>
//             </div>
//         );

//         if (reviewsToDisplay.length === 0) {
//             return (
//                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
//                     <FileText size={48} className="mx-auto text-gray-300 mb-4" />
//                     <h3 className="font-bold text-gray-800 text-lg uppercase tracking-tighter">No {activeTab} found</h3>
//                     <p className="text-gray-500 mt-2">New manuscripts will appear here when you are invited for review.</p>
//                 </motion.div>
//             );
//         }

//         return (
//             <div className="space-y-4">
//                 {reviewsToDisplay.map(assignment => (
//                     <ReviewAssignmentCard
//                         key={assignment.review_id}
//                         assignment={assignment}
//                         onStartReview={setReviewingAssignment}
//                         onStatusUpdate={fetchAssignments}
//                     />
//                 ))}
//             </div>
//         );
//     };

//     return (
//         <div className="max-w-5xl mx-auto space-y-6 animate-fade-in mb-20">
//             {/* Simplified Header */}
//             <header className="mb-8">
//                 <div className="flex items-center gap-3 mb-2">
//                     <div className="h-8 w-1 bg-blue-600 rounded-full" />
//                     <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Reviewer Workspace</h2>
//                 </div>
//                 <p className="text-slate-500 font-medium">Manage your technical evaluations and peer feedback queue.</p>
//             </header>

//             {/* Unified Navigation & Stats Area */}
//             <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm mb-8">
//                 {/* Tabs as the primary navigation */}
//                 <div className="flex bg-slate-100/80 p-1 rounded-xl border border-slate-200/50">
//                     {tabs.map(tab => (
//                         <button
//                             key={tab.id}
//                             onClick={() => setActiveTab(tab.id)}
//                             className={`flex items-center gap-2 py-2.5 px-6 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${activeTab === tab.id
//                                 ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200/50'
//                                 : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/40'
//                                 }`}
//                         >
//                             {tab.icon} {tab.label}
//                             {tab.count > 0 && (
//                                 <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-600'
//                                     }`}>
//                                     {tab.count}
//                                 </span>
//                             )}
//                         </button>
//                     ))}
//                 </div>

//                 {/* Quick Stat Summary on the right (Optional/Streamlined) */}
//                 <div className="hidden lg:flex items-center gap-6 px-4 border-l border-slate-100">
//                     <div className="text-center">
//                         <p className="text-[9px] font-black text-slate-400 uppercase">Total Completed</p>
//                         <p className="text-lg font-black text-emerald-600">{completedHistory.length}</p>
//                     </div>
//                     <div className="text-center">
//                         <p className="text-[9px] font-black text-slate-400 uppercase">Pending</p>
//                         <p className="text-lg font-black text-amber-600">{activeReviews.length}</p>
//                     </div>
//                 </div>
//             </div>

//             <div className="mt-8">
//                 {renderContent()}
//             </div>

//             {reviewingAssignment && (
//                 <SubmitReviewModal
//                     assignment={reviewingAssignment}
//                     onClose={() => setReviewingAssignment(null)}
//                     onReviewSubmitted={() => {
//                         setReviewingAssignment(null);
//                         fetchAssignments();
//                     }}
//                 />
//             )}
//         </div>
//     );
// };

// export default ReviewerDashboard; 























import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { API_BASE_URL, STATIC_ASSETS_BASE_URL } from '../../../utils/constants';
import {
    Clock, CheckCircle, ChevronDown, FileText, Calendar,
    AlertCircle, Inbox, RefreshCw, XCircle, CheckSquare, Download, History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SubmitReviewModal from './Reviewer/SubmitReviewModal';
import LatexRenderer from '../../common/LatexRenderer';

// --- Reusable Card Component ---
const ReviewAssignmentCard = ({ assignment, onStartReview, onStatusUpdate }) => {
    const { authToken } = useContext(AuthContext);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [pendingAction, setPendingAction] = useState(null); // 'ACCEPTED' | 'DECLINED' | null

    const isOverdue = new Date(assignment.due_date) < new Date() && !assignment.is_completed;
    const isRevision = !!assignment.author_revision_notes || (assignment.round_number && assignment.round_number > 1) || !!assignment.previous_manuscript_file_url;

    const handleInvitation = async (status) => {
        setIsUpdating(true);
        try {
            await axios.patch(
                `${API_BASE_URL}/journal-papers/reviews/${assignment.review_id}/invitation`,
                { status },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            onStatusUpdate();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update invitation status.");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className={`bg-white border rounded-xl shadow-sm overflow-hidden transition-all ${isOverdue ? 'border-red-200' : 'border-gray-200'} ${isRevision && !assignment.is_completed ? 'ring-2 ring-amber-100 border-amber-200' : ''}`}>
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-5 flex justify-between items-center text-left cursor-pointer hover:bg-gray-50/80"
            >
                <div className="flex-grow pr-4">
                    
                    <div className="flex items-center gap-2 mb-1">
                        {assignment.is_completed ? (
                            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">Completed</span>
                        ) : (
                            <div className="flex gap-1.5 flex-wrap">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${isOverdue ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {assignment.invitation_status === 'PENDING' ? 'New Invitation' : (isOverdue ? 'Overdue' : 'Action Required')}
                                </span>
                                {isRevision && (
                                    <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                                        <RefreshCw size={10} /> Round {assignment.round_number || 2} Revision
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    <h4 className="font-bold text-lg text-blue-900 leading-tight">
                        <LatexRenderer content={assignment.title} />
                    </h4>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 font-medium">
                        <span className="flex items-center gap-1"><Calendar size={12} /> Due: {new Date(assignment.due_date || Date.now()).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Ref: #REV-{assignment.review_id}</span>
                    </div>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-gray-50/50">
                        <div className="px-6 pb-6 pt-2 border-t border-gray-100 space-y-5">

                            {/* ========================================================================= */}
                            {/* --- MANUSCRIPT FILE / REVISION VERSION COMPARISON ---                     */}
                            {/* ========================================================================= */}
                            {isRevision ? (
                                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <History size={16} className="text-amber-700" />
                                            <span className="text-xs font-black text-amber-900 uppercase tracking-wider">
                                                Manuscript Re-Review: Compare Versions
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-bold bg-amber-200 text-amber-800 px-2.5 py-0.5 rounded-full uppercase">
                                            Round {assignment.round_number || 2}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {/* Version 1: Original */}
                                        <div className="p-3 bg-white border border-slate-200 rounded-lg flex flex-col justify-between">
                                            <div>
                                                <span className="text-[10px] font-black text-slate-400 uppercase block">Version 1 — Original</span>
                                                <p className="text-[11px] text-slate-500 mt-0.5">Initial submission before revision</p>
                                            </div>
                                            {assignment.previous_manuscript_file_url ? (
                                                <a
                                                    href={`${STATIC_ASSETS_BASE_URL}/uploads/${assignment.previous_manuscript_file_url.replace(/^(\/?uploads\/)/, "")}`}
                                                    target="_blank"
                                                    rel="noreferrer noopener"
                                                    className="mt-2 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-all"
                                                >
                                                    <Download size={14} /> Download Original PDF (v1)
                                                </a>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic mt-2">Original file not archived.</span>
                                            )}
                                        </div>

                                        {/* Version 2: Revised */}
                                        <div className="p-3 bg-white border border-emerald-300 rounded-lg flex flex-col justify-between bg-emerald-50/30">
                                            <div>
                                                <span className="text-[10px] font-black text-emerald-700 uppercase block">Version 2 — Revised</span>
                                                <p className="text-[11px] text-slate-500 mt-0.5">Updated PDF with author corrections</p>
                                            </div>
                                            <a
                                                href={`${STATIC_ASSETS_BASE_URL}/uploads/${(assignment.file_path || '').replace(/^(\/?uploads\/)/, "")}`}
                                                target="_blank"
                                                rel="noreferrer noopener"
                                                className="mt-2 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
                                            >
                                                <Download size={14} /> Download Revised PDF (v2)
                                            </a>
                                        </div>
                                    </div>

                                    {/* Author's Response to Reviewers */}
                                    {assignment.author_revision_notes && (
                                        <div className="p-3 bg-white rounded-lg border border-amber-200 text-xs text-slate-800 leading-relaxed font-serif">
                                            <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest block mb-1">
                                                Author's Response / Rebuttal Notes:
                                            </span>
                                            <LatexRenderer content={assignment.author_revision_notes} />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Standard Single PDF Download for Round 1 */
                                <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-indigo-600 text-white rounded-lg shadow-indigo-100 shadow-lg">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Manuscript PDF</p>
                                            <p className="text-xs text-slate-500">Download document for technical evaluation</p>
                                        </div>
                                    </div>
                                    <a
                                        href={`${STATIC_ASSETS_BASE_URL}/uploads/${(assignment.file_path || '').replace(/^(\/?uploads\/)/, "")}`}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="px-4 py-2 bg-white text-indigo-600 border border-indigo-100 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2 shadow-sm"
                                    >
                                        <Download size={14} /> Download File
                                    </a>
                                </div>
                            )}

                            <div>
                                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Abstract</h5>
                                <div className="p-4 border bg-white rounded-lg text-sm text-gray-700 shadow-sm leading-relaxed">
                                    <LatexRenderer content={assignment.abstract} />
                                </div>
                            </div>

                            <div className="flex justify-end items-center gap-3 pt-2">
                                {assignment.invitation_status === 'PENDING' ? (
                                    <div className="flex gap-3">
                                        <button
                                            disabled={isUpdating}
                                            onClick={(e) => { e.stopPropagation(); setPendingAction('DECLINED'); }}
                                            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <XCircle size={16} /> Decline Request
                                        </button>
                                        <button
                                            disabled={isUpdating}
                                            onClick={(e) => { e.stopPropagation(); setPendingAction('ACCEPTED'); }}
                                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-md transition-all active:scale-95"
                                        >
                                            <CheckSquare size={16} /> Accept & Proceed
                                        </button>
                                    </div>
                                ) : !assignment.is_completed && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onStartReview(assignment); }}
                                        className={`px-6 py-2 ${isRevision ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-900 hover:bg-blue-800'} text-white text-sm font-bold rounded-lg shadow-lg flex items-center gap-2 transition-all active:scale-95`}
                                    >
                                        <FileText size={16} /> {isRevision ? `Start Round ${assignment.round_number || 2} Review` : 'Submit Technical Evaluation'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SMART CONFIRMATION MODAL */}
            <AnimatePresence>
                {pendingAction && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-100"
                        >
                            <div className={`p-6 ${pendingAction === 'ACCEPTED' ? 'bg-blue-50' : 'bg-red-50'}`}>
                                <div className="flex items-center gap-4 mb-2">
                                    <div className={`p-3 rounded-full ${pendingAction === 'ACCEPTED' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                                        {pendingAction === 'ACCEPTED' ? <CheckSquare size={24} /> : <XCircle size={24} />}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800">
                                        {pendingAction === 'ACCEPTED' ? 'Accept Invitation?' : 'Decline Invitation?'}
                                    </h3>
                                </div>
                                <p className="text-sm text-slate-600 mt-2">
                                    {pendingAction === 'ACCEPTED' 
                                        ? "You are about to accept this review assignment. You will be expected to complete the technical evaluation within the allotted timeframe."
                                        : "Are you sure you want to decline? You will be removed from this assignment, and the editor will be notified."}
                                </p>
                            </div>

                            <div className="p-4 bg-white flex justify-end gap-3 border-t border-slate-100">
                                <button
                                    onClick={() => setPendingAction(null)}
                                    disabled={isUpdating}
                                    className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        handleInvitation(pendingAction);
                                        setPendingAction(null);
                                    }}
                                    disabled={isUpdating}
                                    className={`flex items-center gap-2 px-5 py-2 text-sm font-bold text-white rounded-lg transition-all shadow-sm disabled:opacity-70 ${
                                        pendingAction === 'ACCEPTED' 
                                            ? 'bg-blue-600 hover:bg-blue-700' 
                                            : 'bg-red-600 hover:bg-red-700'
                                    }`}
                                >
                                    {isUpdating && <RefreshCw size={14} className="animate-spin" />}
                                    {pendingAction === 'ACCEPTED' ? 'Yes, Accept' : 'Yes, Decline'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ReviewerDashboard = () => {
    const { authToken, isAuthReady } = useContext(AuthContext);
    const [allAssignments, setAllAssignments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('invitations');
    const [reviewingAssignment, setReviewingAssignment] = useState(null);

    const fetchAssignments = useCallback(async () => {
        if (!authToken) return;
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/journal-papers/review-assignments`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            const data = response.data.data || response.data;
            setAllAssignments(Array.isArray(data) ? data : []);
            setError('');
        } catch (err) {
            setError('Unable to load assignments.');
        } finally {
            setIsLoading(false);
        }
    }, [authToken]);

    const { invitations, activeReviews, completedHistory } = useMemo(() => ({
        invitations: allAssignments.filter(a => a.invitation_status === 'PENDING'),
        activeReviews: allAssignments.filter(a => a.invitation_status === 'ACCEPTED' && !a.is_completed),
        
        // Filter for completed tasks AND sort them descending (newest first)
        completedHistory: allAssignments
            .filter(a => a.is_completed)
            .sort((a, b) => {
                const dateA = new Date(a.updated_at || a.due_date).getTime();
                const dateB = new Date(b.updated_at || b.due_date).getTime();
                
                if (isNaN(dateA) || isNaN(dateB)) {
                     return b.review_id - a.review_id; 
                }
                
                return dateB - dateA;
            }),
    }), [allAssignments]);

    const tabs = [
        { id: 'invitations', label: 'Invitations', icon: <Inbox size={18} />, count: invitations.length },
        { id: 'pending', label: 'Active Tasks', icon: <Clock size={18} />, count: activeReviews.length },
        { id: 'completed', label: 'History', icon: <CheckCircle size={18} />, count: completedHistory.length },
    ];

    useEffect(() => {
        if (isAuthReady && authToken) fetchAssignments();
    }, [authToken, isAuthReady, fetchAssignments]);

    const renderContent = () => {
        let reviewsToDisplay = [];
        if (activeTab === 'invitations') reviewsToDisplay = invitations;
        else if (activeTab === 'pending') reviewsToDisplay = activeReviews;
        else reviewsToDisplay = completedHistory;

        if (isLoading) return (
            <div className="p-20 text-center">
                <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500 font-medium italic">Loading your reviewer queue...</p>
            </div>
        );

        if (error) return (
            <div className="p-12 text-center text-red-500 bg-red-50 rounded-xl border border-red-100 flex items-center gap-2 justify-center">
                <AlertCircle size={20} /><p className="font-bold">{error}</p>
            </div>
        );

        if (reviewsToDisplay.length === 0) {
            return (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="font-bold text-gray-800 text-lg uppercase tracking-tighter">No {activeTab} found</h3>
                    <p className="text-gray-500 mt-2">New manuscripts will appear here when you are invited for review.</p>
                </motion.div>
            );
        }

        return (
            <div className="space-y-4">
                {reviewsToDisplay.map(assignment => (
                    <ReviewAssignmentCard
                        key={assignment.review_id}
                        assignment={assignment}
                        onStartReview={setReviewingAssignment}
                        onStatusUpdate={fetchAssignments}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in mb-20">
            {/* Header */}
            <header className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-1 bg-blue-600 rounded-full" />
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Reviewer Workspace</h2>
                </div>
                <p className="text-slate-500 font-medium">Manage your technical evaluations and peer feedback queue.</p>
            </header>

            {/* Navigation & Quick Stats */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm mb-8">
                <div className="flex bg-slate-100/80 p-1 rounded-xl border border-slate-200/50">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 py-2.5 px-6 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${activeTab === tab.id
                                ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200/50'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/40'
                                }`}
                        >
                            {tab.icon} {tab.label}
                            {tab.count > 0 && (
                                <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-600'
                                    }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="hidden lg:flex items-center gap-6 px-4 border-l border-slate-100">
                    <div className="text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase">Total Completed</p>
                        <p className="text-lg font-black text-emerald-600">{completedHistory.length}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase">Pending</p>
                        <p className="text-lg font-black text-amber-600">{activeReviews.length}</p>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                {renderContent()}
            </div>

            {reviewingAssignment && (
                <SubmitReviewModal
                    assignment={reviewingAssignment}
                    onClose={() => setReviewingAssignment(null)}
                    onReviewSubmitted={() => {
                        setReviewingAssignment(null);
                        fetchAssignments();
                    }}
                />
            )}
        </div>
    );
};

export default ReviewerDashboard;