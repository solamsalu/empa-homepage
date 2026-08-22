
import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
// Bring back STATIC_ASSETS_BASE_URL for clarity, even if it's the same as API_BASE_URL for now
import { API_BASE_URL, STATIC_ASSETS_BASE_URL } from '../../../utils/constants';
import { Download, Edit, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { format, isValid } from 'date-fns';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast for notifications

import ConfirmModal from '../../common/ConfirmModal';
import LatexRenderer from '../../common/LatexRenderer';

// Define status options in a central place for consistency
const PAPER_STATUS_OPTIONS = {
    'submitted': 'Submitted',
    'under_review': 'Under Review',
    'accepted': 'Accepted',
    'rejected': 'Rejected',
    'revisions_required': 'Revisions Required'
};


const AdminSubmissionsPage = () => {
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { authToken, userRole } = useContext(AuthContext); // Renamed userRoles to userRole for clarity
    const isAdmin = userRole === 'admin';

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [confirmAction, setConfirmAction] = useState(null);

    const openConfirmModal = (message, action) => {
        setConfirmMessage(message);
        setConfirmAction(() => action);
        setShowConfirmModal(true);
    };

    const handleConfirm = () => {
        if (confirmAction) confirmAction();
        setShowConfirmModal(false);
    };

    const fetchAllPapers = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`${API_BASE_URL}/papers`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            setPapers(response.data.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch papers.');
        } finally {
            setLoading(false);
        }
    }, [authToken]);

    useEffect(() => {
        if (isAdmin) {
            fetchAllPapers();
        } else {
            setError('You do not have permission to view this page.');
            setLoading(false);
        }
    }, [isAdmin, fetchAllPapers]);


    const handleStatusChange = async (paperId, newStatus) => {
        const originalPapers = [...papers]; // For optimistic UI rollback

        // Optimistically update UI
        setPapers(prevPapers => prevPapers.map(paper =>
            paper.id === paperId ? { ...paper, status: newStatus } : paper
        ));

        try {
            await axios.put(
                `${API_BASE_URL}/papers/${paperId}`,
                { status: newStatus },
                { headers: { 'Authorization': `Bearer ${authToken}` } }
            );
            toast.success(`Paper status updated to '${PAPER_STATUS_OPTIONS[newStatus]}'.`);
        } catch (err) {
            toast.error('Failed to update status. Reverting changes.');
            setPapers(originalPapers); // Rollback on error
        }
    };

    const deletePaper = async (paperId) => {
        try {
            await axios.delete(`${API_BASE_URL}/papers/${paperId}`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            setPapers(prev => prev.filter(paper => paper.id !== paperId));
            toast.success('Paper deleted successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete paper.');
        }
    };

    const handleDeleteClick = (paper) => {
        openConfirmModal(
            `Are you sure you want to delete the paper "${paper.title}"? This action cannot be undone.`,
            () => deletePaper(paper.id)
        );
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'under_review': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'revisions_required': return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'accepted': return 'bg-green-100 text-green-800 border-green-300';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
                <div className="bg-white rounded-lg shadow-lg p-10 text-center border border-gray-200">
                    <h1 className="text-3xl font-bold text-red-700 mb-4">Access Denied</h1>
                    <p className="text-gray-600 text-lg">You must be an administrator to view this page.</p>
                    <Link to="/" className="text-blue-600 hover:underline mt-6 inline-block">Go to Homepage</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-screen-2xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">All Paper Submissions</h1>

                {loading && (
                    <div className="text-center py-10 text-xl text-gray-700">Loading...</div>
                )}

                {error && !loading && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg" role="alert">
                        <strong className="font-bold">Error:</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                    </div>
                )}

                {!loading && !error && papers.length === 0 && (
                    <div className="text-center py-10 text-gray-500">No papers found.</div>
                )}

                {!loading && !error && papers.length > 0 && (
                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Paper Info</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Conference</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitter</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {papers.map((paper) => (
                                    <tr key={paper.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 max-w-sm">
                                            <div className="text-sm font-semibold text-gray-800"><LatexRenderer content={paper.title} /></div>
                                            <div className="text-xs text-gray-500 mt-1">Authors: {paper.authors || 'N/A'}</div>
                                            <div className="text-xs text-gray-500">Submitted: {paper.submitted_at ? format(new Date(paper.submitted_at), 'MMM dd, yyyy') : 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {paper.conference_title || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{paper.submitter_name || 'N/A'}</div>
                                            <div className="text-xs text-gray-500">{paper.submitter_email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select value={paper.status} onChange={(e) => handleStatusChange(paper.id, e.target.value)}
                                                className={`py-1 px-2 border rounded-md text-sm font-medium ${getStatusBadgeClass(paper.status)}`}
                                            >
                                                {Object.entries(PAPER_STATUS_OPTIONS).map(([key, value]) => (
                                                    <option key={key} value={key}>{value}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center space-x-2">
                                                {paper.file_path && (
                                                    <a href={`${STATIC_ASSETS_BASE_URL}${paper.file_path}`} target="_blank" rel="noopener noreferrer" title="Download Paper" className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50">
                                                        <Download className="h-5 w-5" />
                                                    </a>
                                                )}
                                                <button onClick={() => toast.info('Edit functionality is not yet implemented.')} title="Edit Paper" className="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-50">
                                                    <Edit className="h-5 w-5" />
                                                </button>
                                                <button onClick={() => handleDeleteClick(paper)} title="Delete Paper" className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50">
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <ConfirmModal
                show={showConfirmModal}
                message={confirmMessage}
                onConfirm={handleConfirm}
                onCancel={() => setShowConfirmModal(false)}
            />
        </div>
    );
};

export default AdminSubmissionsPage;