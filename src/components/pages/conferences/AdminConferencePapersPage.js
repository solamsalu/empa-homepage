
import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { format, isValid } from 'date-fns';
import { API_BASE_URL, STATIC_ASSETS_BASE_URL } from '../../../utils/constants';
import { AuthContext } from '../../../context/AuthContext';
import LatexEditor from '../../common/LatexEditor';
import LatexRenderer from '../../common/LatexRenderer';
import { toast } from 'react-toastify';

// --- ICONS ---
const DownloadIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>);
const ArrowLeftIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>);
const TrashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>);
const EditIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>);

const safeFormatDate = (dateInput, formatString = 'MMM dd, yyyy') => {
    if (!dateInput) return 'N/A';
    const date = new Date(dateInput);
    return isValid(date) ? format(date, formatString) : 'Invalid Date';
};

const PAPER_STATUS_OPTIONS = ['submitted', 'under_review', 'accepted', 'rejected', 'revisions_required'];
const STATUS_DISPLAY_MAP = {
    submitted: 'Submitted',
    under_review: 'Under Review',
    accepted: 'Accepted',
    rejected: 'Rejected',
    revisions_required: 'Revisions Required'
};

const EditPaperModal = ({ paper, onClose, onSave }) => {
    const [formData, setFormData] = useState({ title: paper.title || '', abstract: paper.abstract || '', authors: paper.authors || '', keywords: paper.keywords || '' });
    const [isSaving, setIsSaving] = useState(false);
    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(paper.id, formData);
            toast.success('Paper details updated successfully!');
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save changes.');
        } finally {
            setIsSaving(false);
        }
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
                <div className="p-6 border-b"><h3 className="text-xl font-semibold text-gray-800">Edit Paper Details</h3></div>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div><label className="block text-sm font-medium text-gray-700">Title</label><LatexEditor value={formData.title} onChange={(val) => handleChange({ target: { name: 'title', value: val } })} /></div>
                    <div><label className="block text-sm font-medium text-gray-700">Abstract</label><LatexEditor value={formData.abstract} onChange={(val) => handleChange({ target: { name: 'abstract', value: val } })} /></div>
                    <div><label className="block text-sm font-medium text-gray-700">Authors</label><input type="text" name="authors" value={formData.authors} onChange={handleChange} className="mt-1 block w-full border p-2 rounded-md" /></div>
                    <div><label className="block text-sm font-medium text-gray-700">Keywords</label><input type="text" name="keywords" value={formData.keywords} onChange={handleChange} className="mt-1 block w-full border p-2 rounded-md" /></div>
                </div>
                <div className="p-4 bg-gray-50 border-t flex justify-end space-x-3">
                    <button onClick={onClose} disabled={isSaving} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                    <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{isSaving ? 'Saving...' : 'Save Changes'}</button>
                </div>
            </div>
        </div>
    );
};

const AdminConferencePapersPage = () => {
    const { conferenceId } = useParams();
    const navigate = useNavigate();
    const { authToken, userRole, isAuthReady } = useContext(AuthContext); 

    const [conferenceDetail, setConferenceDetail] = useState(null);
    const [papers, setPapers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingPaper, setEditingPaper] = useState(null);

    const fetchConferenceAndPapers = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.get(`${API_BASE_URL}/papers/submission/${conferenceId}`, { headers: { Authorization: `Bearer ${authToken}` } });

            // For debugging: see exactly what the API returns
            console.log('API Response for papers:', res.data);

            // ==========================================================
            // THE FIX: Check for the correct property in the API response.
            // Your controller sends { conference: {...}, papers: [...] } for this route.
            // Other routes might use 'data'. This handles both gracefully.
            // ==========================================================
            setConferenceDetail(res.data.conference || null);
            setPapers(res.data.papers || res.data.data || []); // Prioritize 'papers', fallback to 'data'

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Server error loading data.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [conferenceId, authToken]);

    useEffect(() => {
        fetchConferenceAndPapers();
    }, [fetchConferenceAndPapers]);

    const handleStatusChange = async (paperId, newStatus) => {
        const originalPapers = [...papers];
        setPapers(papers.map(p => p.id === paperId ? { ...p, status: newStatus } : p));
        try {
            await axios.put(`${API_BASE_URL}/papers/${paperId}`, { status: newStatus }, { headers: { Authorization: `Bearer ${authToken}` } });
            toast.success('Paper status updated. An email notification has been sent.');
        } catch (error) {
            toast.error('Failed to update status. Reverting changes.');
            setPapers(originalPapers);
        }
    };

    const handleSavePaper = async (paperId, updatedData) => {
        await axios.put(`${API_BASE_URL}/papers/${paperId}`, updatedData, { headers: { Authorization: `Bearer ${authToken}` } });
        fetchConferenceAndPapers();
    };

    const handleDeletePaper = async (paperId) => {
        if (window.confirm('Are you sure you want to permanently delete this paper?')) {
            try {
                await axios.delete(`${API_BASE_URL}/papers/${paperId}`, { headers: { Authorization: `Bearer ${authToken}` } });
                setPapers(papers.filter(p => p.id !== paperId));
                toast.success('Paper deleted successfully.');
            } catch (error) {
                toast.error('Failed to delete paper.');
            }
        }
    };

    if (loading) return <div className="p-8 text-center font-semibold text-lg">Loading Conference Papers...</div>;
    if (error) return <div className="p-8 text-center text-red-500 font-semibold text-lg">{error}</div>;

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            {editingPaper && <EditPaperModal paper={editingPaper} onClose={() => setEditingPaper(null)} onSave={handleSavePaper} />}

            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate('/admin/conferences')}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-6">
                    <ArrowLeftIcon /> Back to All Submission Windows
                </button>

                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">{conferenceDetail?.title || 'Conference Papers'}</h1>
                    <p className="text-gray-600 mt-1">Managing Submitted Papers</p>
                </div>

                {papers.length === 0 ? <p className="text-center text-gray-500 py-8">No papers submitted for this conference yet.</p> : (
                    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paper Details</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitter</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {papers.map(paper => (
                                    <tr key={paper.id}>
                                        <td className="px-6 py-4 max-w-md">
                                            <div className="text-sm font-semibold text-gray-900"><LatexRenderer content={paper.title} /></div>
                                            <div className="text-xs text-gray-500">By: {paper.authors}</div>
                                            <div className="text-xs text-gray-500 mt-1">Submitted: {safeFormatDate(paper.submitted_at)}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{paper.submitter_full_name}</div>
                                            <div className="text-xs text-gray-500">{paper.submitter_email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select value={paper.status} onChange={(e) => handleStatusChange(paper.id, e.target.value)}
                                                className="block w-full p-2 border border-gray-300 rounded-md text-sm shadow-sm">
                                                {PAPER_STATUS_OPTIONS.map(status => <option key={status} value={status}>{STATUS_DISPLAY_MAP[status]}</option>)}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-1">
                                                <a href={`${STATIC_ASSETS_BASE_URL}${paper.file_path}`} target="_blank" rel="noopener noreferrer" title="Download Paper" className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-50"><DownloadIcon /></a>
                                                <button onClick={() => setEditingPaper(paper)} title="Edit Details" className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50"><EditIcon /></button>
                                                <button onClick={() => handleDeletePaper(paper.id)} title="Delete Paper" className="text-red-600 hover:red-800 p-2 rounded-full hover:bg-red-50"><TrashIcon /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminConferencePapersPage;