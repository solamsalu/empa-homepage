// import React, { useState, useEffect, useContext, useCallback } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../../../../context/AuthContext';
// import { API_BASE_URL } from '../../../../utils/constants';
// import { UserPlus, X, Search, CheckCircle, UserCheck, User } from 'lucide-react'; // Added User icon
// import LatexRenderer from '../../../common/LatexRenderer';

// const AssignReviewerModal = ({ paper, mode = 'reviewer', onClose, onAssignmentComplete }) => {
//     const { authToken } = useContext(AuthContext);
//     const [candidates, setCandidates] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [invitedIds, setInvitedIds] = useState([]); // Tracks session-specific invites

//     const isAssocMode = mode === 'associate';
//     const isProdMode = mode === 'production';
//     const isReviewerMode = mode === 'reviewer';

//     const title = isProdMode ? "Assign Production Staff" : (isAssocMode ? "Assign Associate Editor" : "Invite Peer Reviewer");
//     const apiEndpoint = isProdMode ? 'assign-production' : (isAssocMode ? 'assign-associate' : 'assign-reviewer');
//     const payloadKey = isProdMode ? 'productionId' : (isAssocMode ? 'associateId' : 'reviewerId');

//     const [dueDate, setDueDate] = useState('');

//     const fetchUsers = useCallback(async () => {
//         if (!authToken) return;
//         setLoading(true);
//         try {
//             let res;
//             if (isReviewerMode) {
//                 // ✅ CALL NEW COMBINED ENDPOINT FOR REVIEWERS
//                 res = await axios.get(`${API_BASE_URL}/journal-papers/potential-reviewers`, {
//                     headers: { 'Authorization': `Bearer ${authToken}` }
//                 });
//             } else {
//                 // KEEP OLD ENDPOINT FOR STAFF (AE/PRODUCTION)
//                 res = await axios.get(`${API_BASE_URL}/members`, {
//                     headers: { 'Authorization': `Bearer ${authToken}` }
//                 });
//             }

//             const userData = res.data?.data || res.data || [];

//             if (isReviewerMode) {
//                 // For reviewers, we use the combined list directly
//                 setCandidates(userData);
//             } else {
//                 // For AE/Production, we filter members by role as before
//                 const filtered = userData.filter(u => {
//                     const rawRole = u.role || "";
//                     const userRole = String(rawRole).toLowerCase().trim();
//                     if (mode === 'production') return userRole.includes('production');
//                     if (mode === 'associate') return userRole.includes('associate') && userRole.includes('editor');
//                     return false;
//                 });
//                 setCandidates(filtered);
//             }
//         } catch (err) {
//             console.error("Failed to load users:", err);
//         } finally {
//             setLoading(false);
//         }
//     }, [authToken, isReviewerMode, mode]);

//     useEffect(() => {
//         fetchUsers();
//     }, [fetchUsers]);

//     const handleAssign = async (user) => {
//         if (!authToken) return;

//         // ✅ FIX: Determine the correct ID and Type
//         // Members from /potential-reviewers have 'original_id'
//         // Members from /members have 'id'
//         const reviewerId = user.original_id || user.id;
//         const reviewerType = user.reviewer_type || 'MEMBER';

//         // Determine Paper ID (ensure your paper object has an 'id' or 'paper_id')
//         const paperId = paper.id || paper.paper_id;

//         let payload = {};
//         if (isReviewerMode) {
//             payload = {
//                 reviewer_id: reviewerId,
//                 reviewer_type: reviewerType,
//                 // Provide a default due date (3 weeks from now) if none selected
//                 due_date: dueDate || new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
//             };
//         } else {
//             payload = { [payloadKey]: user.id };
//         }

//         try {
//             // Log for debugging if it fails again
//             console.log("Assigning to Paper:", paperId);
//             console.log("Payload being sent:", payload);

//             await axios.post(
//                 `${API_BASE_URL}/journal-papers/${paperId}/${apiEndpoint}`,
//                 payload,
//                 { headers: { 'Authorization': `Bearer ${authToken}` } }
//             );

//             if (isReviewerMode) {
//                 // Use unique_key if available, otherwise fallback to id
//                 const identifier = user.unique_key || user.id;
//                 setInvitedIds(prev => [...prev, identifier]);
//                 if (onAssignmentComplete) onAssignmentComplete();
//             } else {
//                 if (onAssignmentComplete) onAssignmentComplete();
//                 onClose();
//             }
//         } catch (err) {
//             const errorMsg = err.response?.data?.message || "Internal Server Error";
//             alert(`Failed to assign: ${errorMsg}`);
//         }
//     };

//     const displayList = candidates.filter(u =>
//         (u.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (u.email || "").toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[85vh] border border-slate-200">

//                 {/* Header */}
//                 <div className="p-5 border-b flex justify-between items-center bg-slate-50 rounded-t-xl">
//                     <div>
//                         <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
//                         <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Manuscript Selection</p>
//                     </div>
//                     <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
//                         <X size={24} />
//                     </button>
//                 </div>

//                 {/* Search */}
//                 <div className="p-5 border-b bg-white">
//                     <div className="relative">
//                         <Search className="absolute left-3 top-3 text-slate-400" size={18} />
//                         <input
//                             type="text"
//                             placeholder={`Search candidates...`}
//                             value={searchTerm}
//                             onChange={e => setSearchTerm(e.target.value)}
//                             className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
//                         />
//                     </div>
//                 </div>

//                 {/* List */}
//                 <div className="overflow-y-auto flex-grow p-5 space-y-3 bg-slate-50/30">
//                     {loading ? (
//                         <div className="text-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div>
//                     ) : displayList.length === 0 ? (
//                         <div className="text-center py-12 text-slate-400">No candidates found.</div>
//                     ) : (
//                         displayList.map(user => {
//                             // Use unique_key for reviewers, id for others
//                             const identifier = isReviewerMode ? user.unique_key : user.id;
//                             const isInvited = invitedIds.includes(identifier);

//                             return (
//                                 <div key={identifier} className={`flex justify-between items-center p-4 border rounded-xl transition-all bg-white hover:shadow-sm ${isInvited ? 'bg-emerald-50 border-emerald-200' : 'border-slate-200'}`}>
//                                     <div className="flex gap-3 items-center">
//                                         <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
//                                             {user.full_name?.charAt(0)}
//                                         </div>
//                                         <div>
//                                             <div className="flex items-center gap-2">
//                                                 <p className="font-bold text-sm text-slate-800">{user.full_name}</p>
//                                                 {/* ✅ SHOW BADGE FOR REVIEWER TYPE */}
//                                                 {isReviewerMode && (
//                                                     <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase ${user.reviewer_type === 'MEMBER' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
//                                                         {user.reviewer_type === 'AUTHOR' ? 'Author' : 'Member'}
//                                                     </span>
//                                                 )}
//                                             </div>
//                                             <p className="text-xs text-slate-500">{user.email}</p>
//                                             <p className="text-[10px] text-slate-400 italic">{user.affiliation || user.institution}</p>
//                                         </div>
//                                     </div>

//                                     <button
//                                         onClick={() => handleAssign(user)}
//                                         disabled={isInvited}
//                                         className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${isInvited
//                                             ? 'bg-emerald-600 text-white'
//                                             : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'}`}
//                                     >
//                                         {isInvited ? <><UserCheck size={14} /> Invited</> : <><UserPlus size={14} /> Invite</>}
//                                     </button>
//                                 </div>
//                             );
//                         })
//                     )}
//                 </div>

//                 <div className="p-4 border-t bg-white flex justify-end">
//                     <button onClick={onClose} className="px-6 py-2 bg-slate-800 text-white text-sm font-bold rounded-lg hover:bg-slate-900 transition-colors">
//                         {isReviewerMode && invitedIds.length > 0 ? "Done" : "Cancel"}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AssignReviewerModal;


import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../../context/AuthContext';
import { API_BASE_URL } from '../../../../utils/constants';
import { X, Search, UserPlus, Users, Mail, Calendar, Loader2, CheckCircle2 } from 'lucide-react';

const AssignReviewerModal = ({ paper, mode = 'reviewer', onClose, onAssignmentComplete }) => {
    const { authToken } = useContext(AuthContext);

    // Tab state (only applies when mode === 'reviewer')
    const [activeTab, setActiveTab] = useState('existing'); // 'existing' | 'external'

    // Form inputs
    const [reviewersList, setReviewersList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedReviewer, setSelectedReviewer] = useState(null);
    const [dueDate, setDueDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() + 21); // Default to 3 weeks
        return d.toISOString().split('T')[0];
    });

    // External reviewer fields
    const [externalName, setExternalName] = useState('');
    const [externalEmail, setExternalEmail] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch existing candidates
    useEffect(() => {
        const fetchCandidates = async () => {
            setIsLoading(true);
            try {
                let endpoint = `${API_BASE_URL}/journal-papers/potential-reviewers`;
                if (mode === 'associate') {
                    endpoint = `${API_BASE_URL}/members/role/associate_editor`;
                } else if (mode === 'production') {
                    endpoint = `${API_BASE_URL}/members/role/production_staff`;
                }

                const res = await axios.get(endpoint, {
                    headers: { Authorization: `Bearer ${authToken}` }
                });
                setReviewersList(res.data.data || []);
            } catch (err) {
                setErrorMessage('Failed to load candidate list.');
            } finally {
                setIsLoading(false);
            }
        };

        if (authToken) fetchCandidates();
    }, [authToken, mode]);

    // Filter existing candidate list
    const filteredCandidates = reviewersList.filter(c => {
        const query = searchQuery.toLowerCase();
        return (
            c.full_name?.toLowerCase().includes(query) ||
            c.email?.toLowerCase().includes(query) ||
            c.affiliation?.toLowerCase().includes(query)
        );
    });

    // Handle Submit
    const handleAssign = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setIsSubmitting(true);

        try {
            if (mode === 'associate') {
                await axios.post(
                    `${API_BASE_URL}/journal-papers/${paper.id}/assign-associate`,
                    { associateId: selectedReviewer.id },
                    { headers: { Authorization: `Bearer ${authToken}` } }
                );
            } else if (mode === 'production') {
                await axios.post(
                    `${API_BASE_URL}/journal-papers/${paper.id}/assign-production`,
                    { productionId: selectedReviewer.id },
                    { headers: { Authorization: `Bearer ${authToken}` } }
                );
            } else {
                // REVIEWER MODE
                const payload = activeTab === 'external' ? {
                    is_external: true,
                    external_name: externalName,
                    external_email: externalEmail,
                    due_date: dueDate
                } : {
                    reviewer_id: selectedReviewer.original_id || selectedReviewer.id,
                    reviewer_type: selectedReviewer.reviewer_type || 'MEMBER',
                    due_date: dueDate
                };

                await axios.post(
                    `${API_BASE_URL}/journal-papers/${paper.id}/assign-reviewer`,
                    payload,
                    { headers: { Authorization: `Bearer ${authToken}` } }
                );
            }

            onAssignmentComplete();
        } catch (err) {
            setErrorMessage(err.response?.data?.message || 'Assignment failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in duration-200">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                            {mode === 'associate' ? 'Assign Associate Editor' :
                             mode === 'production' ? 'Assign Production Staff' :
                             'Invite Peer Reviewer'}
                        </h3>
                        <p className="text-xs text-slate-500 truncate max-w-sm">
                            Manuscript: <span className="font-bold text-slate-700">#{paper.id} - {paper.title}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* Tab Switcher for Reviewers */}
                {mode === 'reviewer' && (
                    <div className="flex p-2 bg-slate-100 border-b border-slate-200">
                        <button
                            type="button"
                            onClick={() => { setActiveTab('existing'); setErrorMessage(''); }}
                            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                                activeTab === 'existing' 
                                    ? 'bg-white text-indigo-700 shadow-sm' 
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <Users size={14} /> Registered Database
                        </button>
                        <button
                            type="button"
                            onClick={() => { setActiveTab('external'); setErrorMessage(''); }}
                            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                                activeTab === 'external' 
                                    ? 'bg-white text-indigo-700 shadow-sm' 
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <UserPlus size={14} /> External Reviewer
                        </button>
                    </div>
                )}

                {errorMessage && (
                    <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleAssign} className="p-6 space-y-4">
                    {/* --- TAB 1: EXISTING / REGISTERED USERS --- */}
                    {activeTab === 'existing' || mode !== 'reviewer' ? (
                        <>
                            {/* Search Bar */}
                            <div className="relative">
                                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or institution..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600 transition-all font-medium"
                                />
                            </div>

                            {/* Candidate List */}
                            <div className="max-h-56 overflow-y-auto space-y-1.5 border border-slate-100 rounded-2xl p-2 bg-slate-50/50">
                                {isLoading ? (
                                    <div className="py-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                                        <Loader2 size={16} className="animate-spin" /> Loading candidates...
                                    </div>
                                ) : filteredCandidates.length === 0 ? (
                                    <div className="py-8 text-center text-slate-400 text-xs">
                                        No candidates found matching your search.
                                    </div>
                                ) : (
                                    filteredCandidates.map((c) => {
                                        const isSelected = selectedReviewer?.id === c.id;
                                        return (
                                            <div
                                                key={c.unique_key || c.id}
                                                onClick={() => setSelectedReviewer(c)}
                                                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                                                    isSelected
                                                        ? 'bg-indigo-50 border-indigo-400 shadow-sm'
                                                        : 'bg-white border-slate-100 hover:border-slate-300'
                                                }`}
                                            >
                                                <div className="min-w-0 pr-2">
                                                    <p className="text-xs font-bold text-slate-900 truncate">{c.full_name}</p>
                                                    <p className="text-[10px] text-slate-400 truncate">{c.email} • {c.affiliation || 'EMPA'}</p>
                                                </div>
                                                {isSelected && <CheckCircle2 size={16} className="text-indigo-600 shrink-0" />}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </>
                    ) : (
                        /* --- TAB 2: EXTERNAL / NEW REVIEWER --- */
                        <div className="space-y-3.5">
                            <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl text-[11px] text-indigo-900 leading-relaxed">
                                💡 <strong>Invite external scholars:</strong> An author/reviewer account will be generated automatically, and an invitation email will be delivered to their inbox.
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                                    Reviewer Full Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Prof. Mengistu Taye"
                                    value={externalName}
                                    onChange={(e) => setExternalName(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-indigo-600"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                                    Reviewer Email Address *
                                </label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        required
                                        placeholder="e.g. m.taye@cambridge.ac.uk"
                                        value={externalEmail}
                                        onChange={(e) => setExternalEmail(e.target.value)}
                                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-indigo-600"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Due Date (For Reviewers) */}
                    {mode === 'reviewer' && (
                        <div>
                            <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                                Review Completion Deadline
                            </label>
                            <div className="relative">
                                <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="date"
                                    required
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-indigo-600"
                                />
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="pt-2 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                (activeTab === 'existing' && !selectedReviewer && mode === 'reviewer') ||
                                (activeTab === 'external' && (!externalName || !externalEmail) && mode === 'reviewer')
                            }
                            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-100 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                mode === 'associate' ? 'Confirm Assignment' : 'Send Invitation'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignReviewerModal;