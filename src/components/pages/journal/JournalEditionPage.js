import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../utils/constants';
import ArchiveSection from './ArchiveSection';
import ConfirmModal from '../../common/ConfirmModal';
import EditEditionModal from './EditEditionModal';
import { AuthContext } from '../../../context/AuthContext'; // Using your AuthContext

/**
 * The main landing page for the Journal.
 * Displays the current issue and the archive, with Admin controls for Edit/Delete.
 */
const JournalEditionPage = () => {
    const { user, isLoggedIn, authToken } = useContext(AuthContext);
    const [editions, setEditions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal & Action States
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedEdition, setSelectedEdition] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Permission Check
    const isAdminOrEditor = isLoggedIn && 
        ['admin', 'editor', 'managing_editor', 'eic'].includes(user?.role?.toLowerCase());

    useEffect(() => {
        fetchEditions();
    }, []);

    const fetchEditions = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/journals`);
            // Assuming the backend returns an array of editions sorted by date
            setEditions(res.data.data || []);
            setError(null);
        } catch (err) {
            console.error("Fetch Error:", err);
            setError("Unable to load the journal archive. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // --- Delete Handlers ---
    const openDeleteModal = (edition) => {
        setSelectedEdition(edition);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        setIsProcessing(true);
        try {
            await axios.delete(`${API_BASE_URL}/journals/${selectedEdition.id}`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            
            // Remove from local state to update UI immediately
            setEditions(prev => prev.filter(e => e.id !== selectedEdition.id));
            setShowDeleteModal(false);
        } catch (err) {
            alert("Failed to delete the edition.");
        } finally {
            setIsProcessing(false);
        }
    };

    // --- Edit Handlers ---
    const openEditModal = (edition) => {
        setSelectedEdition(edition);
        setShowEditModal(true);
    };

    const handleSaveEdit = async (updatedData) => {
        setIsProcessing(true);
        try {
            await axios.put(`${API_BASE_URL}/journals/editions/${selectedEdition.id}`, updatedData);
            // Update local state with the new data
            setEditions(prev => prev.map(e => 
                e.id === selectedEdition.id ? { ...e, ...updatedData } : e
            ));
            setShowEditModal(false);
        } catch (err) {
            alert("Failed to update edition details.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero / Banner section could go here */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                
                <ArchiveSection 
                    isLoading={loading}
                    error={error}
                    currentIssue={editions[0]} // Most recent
                    archiveIssues={editions.slice(1)} // Everything else
                    isAdminOrEditor={isAdminOrEditor}
                    onDeleteClick={openDeleteModal}
                    onEditClick={openEditModal}
                />

                {/* Administration Modals */}
                {showDeleteModal && selectedEdition && (
                    <ConfirmModal 
                        title="Delete Edition"
                        message={`Are you sure you want to delete "${selectedEdition.title}"? This will unassign any papers linked to this edition.`}
                        onConfirm={handleConfirmDelete}
                        onCancel={() => setShowDeleteModal(false)}
                    />
                )}

                <EditEditionModal 
                    isOpen={showEditModal}
                    edition={selectedEdition}
                    onClose={() => setShowEditModal(false)}
                    onSave={handleSaveEdit}
                    isSaving={isProcessing}
                />
            </div>
        </div>
    );
};

export default JournalEditionPage;