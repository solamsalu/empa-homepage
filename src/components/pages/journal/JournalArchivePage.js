import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ArchiveSection from './ArchiveSection';
import ConfirmModal from '../../common/ConfirmModal';
import EditEditionModal from './EditEditionModal';
import { useAuth } from '../../../hooks/useAuth'; // Replace with your auth logic

const JournalArchivePage = () => {
    const { user } = useAuth();
    const [editions, setEditions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal States
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedEdition, setSelectedEdition] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const isAdminOrEditor = user && ['admin', 'managing_editor'].includes(user.role);

    useEffect(() => {
        fetchEditions();
    }, []);

    const fetchEditions = async () => {
        try {
            const res = await axios.get('/api/journals');
            setEditions(res.data.data);
        } catch (err) {
            setError("Failed to load archive.");
        } finally {
            setLoading(false);
        }
    };

    // --- DELETE LOGIC ---
    const triggerDelete = (edition) => {
        setSelectedEdition(edition);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        setIsProcessing(true);
        try {
            await axios.delete(`/api/journals/editions/${selectedEdition.id}`);
            setEditions(prev => prev.filter(e => e.id !== selectedEdition.id));
            setShowDeleteModal(false);
        } catch (err) {
            alert("Delete failed.");
        } finally {
            setIsProcessing(false);
        }
    };

    // --- EDIT LOGIC ---
    const triggerEdit = (edition) => {
        setSelectedEdition(edition);
        setShowEditModal(true);
    };

    const handleSaveEdit = async (updatedData) => {
        setIsProcessing(true);
        try {
            await axios.put(`/api/journals/editions/${selectedEdition.id}`, updatedData);
            setEditions(prev => prev.map(e => e.id === selectedEdition.id ? { ...e, ...updatedData } : e));
            setShowEditModal(false);
        } catch (err) {
            alert("Update failed.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <ArchiveSection 
                isLoading={loading}
                error={error}
                currentIssue={editions[0]}
                archiveIssues={editions.slice(1)}
                isAdminOrEditor={isAdminOrEditor}
                onDeleteClick={triggerDelete}
                onEditClick={triggerEdit}
            />

            {/* DELETE MODAL */}
            <ConfirmModal 
                show={showDeleteModal}
                message={`Delete "${selectedEdition?.title}"? This cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowDeleteModal(false)}
            />

            {/* EDIT MODAL */}
            <EditEditionModal 
                isOpen={showEditModal}
                edition={selectedEdition}
                onClose={() => setShowEditModal(false)}
                onSave={handleSaveEdit}
                isSaving={isProcessing}
            />
        </div>
    );
};

export default JournalArchivePage;