import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../../context/AuthContext';
import { API_BASE_URL } from '../../../../utils/constants';
import { X, Search, UserPlus, Users, Mail, Calendar, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';

const AssignReviewerModal = ({ paper, mode = 'reviewer', onClose, onAssignmentComplete }) => {
    const { authToken } = useContext(AuthContext);

    // Tab switcher: 'existing' | 'external'
    const [activeTab, setActiveTab] = useState('existing');

    // Candidate list and search
    const [candidatesList, setCandidatesList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    // Due date (only for reviewers)
    const [dueDate, setDueDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() + 21);
        return d.toISOString().split('T')[0];
    });

    // External inputs
    const [externalName, setExternalName] = useState('');
    const [externalEmail, setExternalEmail] = useState('');
    const [institution, setInstitution] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchCandidates = async () => {
            setIsLoading(true);
            try {
                // Pass paperId so backend filters out the author
                let endpoint = `${API_BASE_URL}/journal-papers/potential-reviewers?paperId=${paper.id}`;
                if (mode === 'associate') {
                    endpoint = `${API_BASE_URL}/journal-papers/potential-associates?paperId=${paper.id}`;
                } else if (mode === 'production') {
                    endpoint = `${API_BASE_URL}/members/role/production_staff`;
                }

                const res = await axios.get(endpoint, {
                    headers: { Authorization: `Bearer ${authToken}` }
                });
                setCandidatesList(res.data.data || []);
            } catch (err) {
                setErrorMessage('Failed to load candidate list.');
            } finally {
                setIsLoading(false);
            }
        };

        if (authToken && paper?.id) fetchCandidates();
    }, [authToken, mode, paper?.id]);

    // Filter out Admin, ME, EIC, and own-review author conflicts
    const filteredCandidates = candidatesList.filter(c => {
        const role = (c.role || '').toLowerCase().trim();
        const email = (c.email || '').toLowerCase().trim();
        const name = (c.full_name || '').toLowerCase().trim();
        const authorName = (paper?.author_name || '').toLowerCase().trim();
        const authorEmail = (paper?.author_email || '').toLowerCase().trim();

        // 1. Exclude Admin, Managing Editor, and Editor-in-Chief
        if (['admin', 'managing_editor', 'editor_in_chief', 'eic'].includes(role)) {
            return false;
        }

        // 2. Exclude Own Review / Author Conflict of Interest
        if (authorEmail && email === authorEmail) return false;
        if (authorName && name === authorName) return false;
        if (paper?.member_author_id && c.user_type === 'MEMBER' && c.id === paper.member_author_id) return false;
        if (paper?.external_author_id && c.user_type === 'AUTHOR' && c.id === paper.external_author_id) return false;

        // 3. Search query filter
        const query = searchQuery.toLowerCase();
        return (
            name.includes(query) ||
            email.includes(query) ||
            (c.affiliation || '').toLowerCase().includes(query) ||
            role.includes(query)
        );
    });

    // Handle Form Submit
    const handleAssign = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setIsSubmitting(true);

        try {
            if (mode === 'associate') {
                const payload = activeTab === 'external' ? {
                    is_external: true,
                    external_name: externalName,
                    external_email: externalEmail,
                    institution: institution
                } : {
                    associateId: selectedCandidate.id,
                    candidate_type: selectedCandidate.user_type || 'MEMBER'
                };

                await axios.post(
                    `${API_BASE_URL}/journal-papers/${paper.id}/assign-associate`,
                    payload,
                    { headers: { Authorization: `Bearer ${authToken}` } }
                );
            } else if (mode === 'production') {
                await axios.post(
                    `${API_BASE_URL}/journal-papers/${paper.id}/assign-production`,
                    { productionId: selectedCandidate.id },
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
                    reviewer_id: selectedCandidate.original_id || selectedCandidate.id,
                    reviewer_type: selectedCandidate.reviewer_type || 'MEMBER',
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
            setErrorMessage(err.response?.data?.message || 'Assignment failed. Please verify the information.');
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
                        <p className="text-xs text-slate-500 truncate max-w-sm mt-0.5">
                            Manuscript: <span className="font-bold text-slate-700">#{paper.id} - {paper.title}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* Tab Switcher (Available for both Reviewers and Associate Editors) */}
                {mode !== 'production' && (
                    <div className="flex p-2 bg-slate-100 border-b border-slate-200">
                        <button
                            type="button"
                            onClick={() => { setActiveTab('existing'); setErrorMessage(''); }}
                            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'existing'
                                ? 'bg-white text-indigo-700 shadow-sm'
                                : 'text-slate-500 hover:text-slate-800'
                                }`}
                        >
                            <Users size={14} /> Registered Directory
                        </button>
                        <button
                            type="button"
                            onClick={() => { setActiveTab('external'); setErrorMessage(''); }}
                            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'external'
                                ? 'bg-white text-indigo-700 shadow-sm'
                                : 'text-slate-500 hover:text-slate-800'
                                }`}
                        >
                            <UserPlus size={14} /> {mode === 'associate' ? 'External Associate Editor' : 'External Reviewer'}
                        </button>
                    </div>
                )}

                {errorMessage && (
                    <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleAssign} className="p-6 space-y-4">
                    {/* --- TAB 1: EXISTING DIRECTORY --- */}
                    {activeTab === 'existing' || mode === 'production' ? (
                        <>
                            <div className="relative">
                                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, institution, or role..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600 transition-all font-medium"
                                />
                            </div>
                            {/* Candidate List with Hierarchical Ordering */}
                            <div className="max-h-60 overflow-y-auto space-y-2 border border-slate-100 rounded-2xl p-2 bg-slate-50/50">
                                {isLoading ? (
                                    <div className="py-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                                        <Loader2 size={16} className="animate-spin" /> Loading directory...
                                    </div>
                                ) : filteredCandidates.length === 0 ? (
                                    <div className="py-8 text-center text-slate-400 text-xs">
                                        No candidates match your search.
                                    </div>
                                ) : (
                                    filteredCandidates
                                        .sort((a, b) => (a.category_rank || 2) - (b.category_rank || 2))
                                        .map((c) => {
                                            const isSelected = selectedCandidate?.id === c.id;

                                            // ✅ FIXED: Check role directly from the members table!
                                            const role = (c.role || '').toLowerCase().trim();
                                            const isAE = role === 'associate_editor';
                                            const isReviewer = role === 'reviewer';
                                            const isAuthor = role === 'author';
                                            const isMember = role === 'member';

                                            return (
                                                <div
                                                    key={c.unique_key || c.id}
                                                    onClick={() => setSelectedCandidate(c)}
                                                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${isSelected
                                                            ? 'bg-indigo-50 border-indigo-400 shadow-sm ring-1 ring-indigo-400'
                                                            : isAE
                                                                ? 'bg-white border-indigo-100 hover:border-indigo-300'
                                                                : 'bg-white border-slate-100 hover:border-slate-300'
                                                        }`}
                                                >
                                                    <div className="min-w-0 pr-2">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <p className="text-xs font-bold text-slate-900 truncate">
                                                                {c.full_name}
                                                            </p>

                                                            {/* ✅ PROPER VISUAL BADGES BASED ON ROLE */}
                                                            {isReviewer && (
                                                                <span className="text-[9px] font-black uppercase tracking-tight px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                                                                    ★ Active Reviewer
                                                                </span>
                                                            )}
                                                            {isAE && (
                                                                <span className="text-[9px] font-black uppercase tracking-tight px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                                                                    Associate Editor
                                                                </span>
                                                            )}
                                                            {isAuthor && (
                                                                <span className="text-[9px] font-bold uppercase tracking-tight px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                                                    Registered Author
                                                                </span>
                                                            )}
                                                            {isMember && (
                                                                <span className="text-[9px] font-bold uppercase tracking-tight px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                                    EMPA Member
                                                                </span>
                                                            )}
                                                        </div>

                                                        <p className="text-[10px] text-slate-400 truncate mt-1">
                                                            {c.email} • {c.affiliation || 'EMPA'}
                                                        </p>
                                                    </div>

                                                    {isSelected && <CheckCircle2 size={18} className="text-indigo-600 shrink-0" />}
                                                </div>
                                            );
                                        })
                                )}
                            </div>
                        </>
                    ) : (
                        /* --- TAB 2: EXTERNAL / NEW SCHOLAR --- */
                        <div className="space-y-3.5">
                            <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-[11px] text-indigo-900 leading-relaxed flex items-start gap-2">
                                <ShieldCheck size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                                <div>
                                    <strong>Invite External Scholar:</strong> An Associate Editor account will be established automatically. They will receive an official appointment email with secure login credentials.
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                                    Full Name & Academic Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Assoc. Prof. Kassa Belay"
                                    value={externalName}
                                    onChange={(e) => setExternalName(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-indigo-600"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                                    Institutional Email Address *
                                </label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        required
                                        placeholder="e.g. kassa.belay@aau.edu.et"
                                        value={externalEmail}
                                        onChange={(e) => setExternalEmail(e.target.value)}
                                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-indigo-600"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                                    Affiliation / University (Optional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Addis Ababa University / Dept of Mathematics"
                                    value={institution}
                                    onChange={(e) => setInstitution(e.target.value)}
                                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-indigo-600"
                                />
                            </div>
                        </div>
                    )}

                    {/* Deadline (Only for Reviewer mode) */}
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

                    {/* Footer Buttons */}
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
                                (activeTab === 'existing' && !selectedCandidate) ||
                                (activeTab === 'external' && (!externalName || !externalEmail))
                            }
                            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-100 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                mode === 'associate' ? 'Confirm Appointment' :
                                    mode === 'production' ? 'Assign Staff' :
                                        'Send Invitation'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignReviewerModal;