import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../../context/AuthContext';
import { API_BASE_URL } from '../../../../utils/constants';
import { UserPlus, X, Search, CheckCircle, UserCheck, User } from 'lucide-react'; // Added User icon
import LatexRenderer from '../../../common/LatexRenderer';

const AssignReviewerModal = ({ paper, mode = 'reviewer', onClose, onAssignmentComplete }) => {
    const { authToken } = useContext(AuthContext);
    const [candidates, setCandidates] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [invitedIds, setInvitedIds] = useState([]); // Tracks session-specific invites

    const isAssocMode = mode === 'associate';
    const isProdMode = mode === 'production';
    const isReviewerMode = mode === 'reviewer';

    const title = isProdMode ? "Assign Production Staff" : (isAssocMode ? "Assign Associate Editor" : "Invite Peer Reviewer");
    const apiEndpoint = isProdMode ? 'assign-production' : (isAssocMode ? 'assign-associate' : 'assign-reviewer');
    const payloadKey = isProdMode ? 'productionId' : (isAssocMode ? 'associateId' : 'reviewerId');

    const [dueDate, setDueDate] = useState('');

    const fetchUsers = useCallback(async () => {
        if (!authToken) return;
        setLoading(true);
        try {
            let res;
            if (isReviewerMode) {
                // ✅ CALL NEW COMBINED ENDPOINT FOR REVIEWERS
                res = await axios.get(`${API_BASE_URL}/journal-papers/potential-reviewers`, {
                    headers: { 'Authorization': `Bearer ${authToken}` }
                });
            } else {
                // KEEP OLD ENDPOINT FOR STAFF (AE/PRODUCTION)
                res = await axios.get(`${API_BASE_URL}/members`, {
                    headers: { 'Authorization': `Bearer ${authToken}` }
                });
            }

            const userData = res.data?.data || res.data || [];

            if (isReviewerMode) {
                // For reviewers, we use the combined list directly
                setCandidates(userData);
            } else {
                // For AE/Production, we filter members by role as before
                const filtered = userData.filter(u => {
                    const rawRole = u.role || "";
                    const userRole = String(rawRole).toLowerCase().trim();
                    if (mode === 'production') return userRole.includes('production');
                    if (mode === 'associate') return userRole.includes('associate') && userRole.includes('editor');
                    return false;
                });
                setCandidates(filtered);
            }
        } catch (err) {
            console.error("Failed to load users:", err);
        } finally {
            setLoading(false);
        }
    }, [authToken, isReviewerMode, mode]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleAssign = async (user) => {
        if (!authToken) return;

        // ✅ FIX: Determine the correct ID and Type
        // Members from /potential-reviewers have 'original_id'
        // Members from /members have 'id'
        const reviewerId = user.original_id || user.id;
        const reviewerType = user.reviewer_type || 'MEMBER';

        // Determine Paper ID (ensure your paper object has an 'id' or 'paper_id')
        const paperId = paper.id || paper.paper_id;

        let payload = {};
        if (isReviewerMode) {
            payload = {
                reviewer_id: reviewerId,
                reviewer_type: reviewerType,
                // Provide a default due date (3 weeks from now) if none selected
                due_date: dueDate || new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            };
        } else {
            payload = { [payloadKey]: user.id };
        }

        try {
            // Log for debugging if it fails again
            console.log("Assigning to Paper:", paperId);
            console.log("Payload being sent:", payload);

            await axios.post(
                `${API_BASE_URL}/journal-papers/${paperId}/${apiEndpoint}`,
                payload,
                { headers: { 'Authorization': `Bearer ${authToken}` } }
            );

            if (isReviewerMode) {
                // Use unique_key if available, otherwise fallback to id
                const identifier = user.unique_key || user.id;
                setInvitedIds(prev => [...prev, identifier]);
                if (onAssignmentComplete) onAssignmentComplete();
            } else {
                if (onAssignmentComplete) onAssignmentComplete();
                onClose();
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Internal Server Error";
            alert(`Failed to assign: ${errorMsg}`);
        }
    };

    const displayList = candidates.filter(u =>
        (u.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[85vh] border border-slate-200">

                {/* Header */}
                <div className="p-5 border-b flex justify-between items-center bg-slate-50 rounded-t-xl">
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
                        <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Manuscript Selection</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                        <X size={24} />
                    </button>
                </div>

                {/* Search */}
                <div className="p-5 border-b bg-white">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder={`Search candidates...`}
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="overflow-y-auto flex-grow p-5 space-y-3 bg-slate-50/30">
                    {loading ? (
                        <div className="text-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div>
                    ) : displayList.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">No candidates found.</div>
                    ) : (
                        displayList.map(user => {
                            // Use unique_key for reviewers, id for others
                            const identifier = isReviewerMode ? user.unique_key : user.id;
                            const isInvited = invitedIds.includes(identifier);

                            return (
                                <div key={identifier} className={`flex justify-between items-center p-4 border rounded-xl transition-all bg-white hover:shadow-sm ${isInvited ? 'bg-emerald-50 border-emerald-200' : 'border-slate-200'}`}>
                                    <div className="flex gap-3 items-center">
                                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                                            {user.full_name?.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-sm text-slate-800">{user.full_name}</p>
                                                {/* ✅ SHOW BADGE FOR REVIEWER TYPE */}
                                                {isReviewerMode && (
                                                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase ${user.reviewer_type === 'MEMBER' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                                                        {user.reviewer_type === 'AUTHOR' ? 'Author' : 'Member'}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500">{user.email}</p>
                                            <p className="text-[10px] text-slate-400 italic">{user.affiliation || user.institution}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleAssign(user)}
                                        disabled={isInvited}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${isInvited
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'}`}
                                    >
                                        {isInvited ? <><UserCheck size={14} /> Invited</> : <><UserPlus size={14} /> Invite</>}
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="p-4 border-t bg-white flex justify-end">
                    <button onClick={onClose} className="px-6 py-2 bg-slate-800 text-white text-sm font-bold rounded-lg hover:bg-slate-900 transition-colors">
                        {isReviewerMode && invitedIds.length > 0 ? "Done" : "Cancel"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignReviewerModal;