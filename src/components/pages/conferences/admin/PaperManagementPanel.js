// src/components/pages/events/admin/PaperManagementPanel.js
import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { format, isValid } from 'date-fns';
import { AuthContext } from '../../../../context/AuthContext';
import { API_BASE_URL, STATIC_ASSETS_BASE_URL } from '../../../../utils/constants';
import { Edit, Trash2, Download, FileText, User, Calendar, MessageSquare, Check, X } from 'lucide-react';
import PrimaryButton from '../../../common/PrimaryButton';

// A sub-component for managing a single paper, making the list cleaner.
const PaperCard = ({ paper, onUpdateStatus, onEdit, onDelete }) => {
    const PAPER_STATUS_OPTIONS = ['Submitted', 'Under Review', 'Accepted', 'Rejected', 'Revisions Required'];
    const [status, setStatus] = useState(paper.status);
    const [comments, setComments] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleStatusChange = async (newStatus) => {
        setIsSaving(true);
        setStatus(newStatus);
        await onUpdateStatus(paper.id, newStatus, comments);
        setIsSaving(false);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Column 1: Paper & Author Info */}
                <div className="md:col-span-1">
                    <p className="font-bold text-blue-800 flex items-start gap-2"><FileText size={18} className="mt-1" /><span>{paper.title}</span></p>
                    <p className="text-sm text-gray-600 mt-2 flex items-start gap-2"><User size={18} /><span>by {paper.displaySubmitterName}</span></p>
                    <p className="text-xs text-gray-500 mt-1 flex items-start gap-2"><Calendar size={14} /><span>Submitted: {format(new Date(paper.submitted_at), 'MMM dd, yyyy')}</span></p>
                </div>

                {/* Column 2: Status & Comments */}
                <div className="md:col-span-1">
                    <label className="text-sm font-semibold text-gray-700">Status</label>
                    <select
                        value={status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        disabled={isSaving}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm"
                    >
                        {PAPER_STATUS_OPTIONS.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
                    </select>
                    <label className="text-sm font-semibold text-gray-700 mt-2 block">Comments for Author</label>
                    <textarea
                        placeholder="Optional feedback for the author..."
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
                        rows="2"
                    />
                </div>

                {/* Column 3: Actions */}
                <div className="md:col-span-1 flex flex-row md:flex-col items-start justify-start gap-2">
                    <a href={`${STATIC_ASSETS_BASE_URL}${paper.file_path}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700"><Download size={16} />Download</a>
                    <button onClick={onEdit} className="flex items-center gap-1 px-3 py-1.5 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600"><Edit size={16} />Edit</button>
                    <button onClick={onDelete} className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"><Trash2 size={16} />Delete</button>
                </div>
            </div>
        </div>
    );
};

// Main Panel Component
const PaperManagementPanel = ({ conference, onPaperUpdate }) => {
    const { authToken } = useContext(AuthContext);
    const [papers, setPapers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    // You would add state and handlers for the Edit Modal here
    // const [editingPaper, setEditingPaper] = useState(null);

    // const fetchPapers = useCallback(async () => {
    //     setIsLoading(true);
    //     try {
    //         const res = await axios.get(`${API_BASE_URL}/papers/conference/${conference.id}`, { headers: { Authorization: `Bearer ${authToken}` } });
    //         setPapers(res.data.data || []);
    //     } catch (err) {
    //         setError("Failed to fetch papers for this conference.");
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }, [conference.id, authToken]);

    const fetchPapers = useCallback(async () => {
        setIsLoading(true);
        try {
            // --- The API endpoint for this is different from what's in your controller ---
            // Your controller expects /papers/conference/:id, but your AdminDashboard navigates to /admin/conference-papers/:id
            // Let's assume the API endpoint is correct as /papers/conference/:id
            const res = await axios.get(`${API_BASE_URL}/papers/conference/${conference.id}`, { headers: { Authorization: `Bearer ${authToken}` } });

            // --- THE FIX ---
            // Your backend returns the array in the 'papers' property for this specific endpoint.
            setPapers(res.data.papers || []);
        } catch (err) {
            setError("Failed to fetch papers for this conference.");
        } finally {
            setIsLoading(false);
        }
    }, [conference.id, authToken]);


    useEffect(() => {
        fetchPapers();
    }, [fetchPapers]);

    const handleUpdateStatus = async (paperId, newStatus, comments) => {
        try {
            const paperToUpdate = papers.find(p => p.id === paperId);
            if (!paperToUpdate) return;

            const payload = { ...paperToUpdate, status: newStatus, comments };
            await axios.put(`${API_BASE_URL}/papers/${paperId}`, payload, { headers: { Authorization: `Bearer ${authToken}` } });
            // Optionally, show a success toast/message
            onPaperUpdate(); // Notify parent to potentially refresh counts
        } catch (err) {
            alert(`Error updating status: ${err.response?.data?.message || err.message}`);
            fetchPapers(); // Revert optimistic update on failure
        }
    };

    const handleDeletePaper = async (paperId) => {
        if (window.confirm("Are you sure you want to permanently delete this paper?")) {
            try {
                await axios.delete(`${API_BASE_URL}/papers/${paperId}`, { headers: { Authorization: `Bearer ${authToken}` } });
                setPapers(prev => prev.filter(p => p.id !== paperId));
                onPaperUpdate();
            } catch (err) {
                alert(`Error deleting paper: ${err.response?.data?.message || err.message}`);
            }
        }
    };

    if (isLoading) return <div className="text-center p-8">Loading papers...</div>;
    if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

    return (
        <div className="space-y-4">
            {papers.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <FileText size={48} className="mx-auto text-gray-400" />
                    <h3 className="mt-2 font-semibold text-lg text-gray-700">No Submissions Yet</h3>
                    <p className="text-gray-500">No papers have been submitted to this conference.</p>
                </div>
            ) : (
                papers.map(paper => (
                    <PaperCard
                        key={paper.id}
                        paper={paper}
                        onUpdateStatus={handleUpdateStatus}
                        onEdit={() => alert(`Editing paper ID: ${paper.id}`)}
                        onDelete={() => handleDeletePaper(paper.id)}
                    />
                ))
            )}
        </div>
    );
};

export default PaperManagementPanel;