
// src/components/pages/conferences/ConferenceList.js

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Utility & Context Imports
import { API_BASE_URL } from '../../../utils/constants';
import { AuthContext } from '../../../context/AuthContext';

// Component Imports
import ConferenceCard, { ConferenceCardSkeleton } from '../../common/ConferenceCard';
import ConfirmModal from '../../common/ConfirmModal';
import { TrashIcon } from '../../common/icons/TrashIcon';

const ConferenceList = ({ onConferenceDeleted }) => {
    const { userRole, authToken } = useContext(AuthContext);
    const isAdmin = userRole === 'admin';
    const navigate = useNavigate();

    // State Management
    const [conferences, setConferences] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [itemToDelete, setItemToDelete] = useState(null);

    // Fetch Conferences on Mount
    useEffect(() => {
        const fetchConferences = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/conferences`);
                const conferenceData = response.data.data || [];
                
                // Filter for upcoming/ongoing and sort by date
                const upcoming = conferenceData
                    .filter(conf => new Date(conf.date) >= new Date())
                    .sort((a, b) => new Date(a.date) - new Date(b.date));
                    
                setConferences(upcoming);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load upcoming conferences.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchConferences();
    }, []);

    // Handle Deletion
    const handleDelete = async () => {
        // Find whichever ID property your backend uses
        const targetId = itemToDelete?.id || itemToDelete?.conference_id;
        if (!targetId) return;

        try {
            await axios.delete(`${API_BASE_URL}/conferences/${targetId}`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            
            // Filter using the same ID logic to remove it from the UI immediately
            setConferences(prev => prev.filter(c => (c.id || c.conference_id) !== targetId));
            
            // Trigger parent refresh if provided
            if (onConferenceDeleted) onConferenceDeleted();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete conference.');
        } finally {
            setItemToDelete(null); // Always close the modal
        }
    };

    // Conditional Rendering for Loading & Errors
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {[...Array(4)].map((_, i) => <ConferenceCardSkeleton key={i} />)}
            </div>
        );
    }

    if (error) {
        return <div className="text-red-600 text-center py-10">{error}</div>;
    }

    if (conferences.length === 0) {
        return <div className="text-center text-gray-600 py-10">No upcoming conferences found.</div>;
    }

    return (
        <div>
            <h2 className="text-4xl font-extrabold text-blue-900 mb-8 text-center leading-tight">
                Upcoming Conferences
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {conferences.map((conference) => {
                    // Identify a clean ID for the key and detail view
                    const cid = conference.id || conference.conference_id;
                    
                    return (
                        <div key={cid} className="relative">
                            <ConferenceCard 
                                conference={conference} 
                                onViewDetails={() => navigate(`/conferences/${cid}`)} 
                            />
                            
                            {isAdmin && (
                                <button 
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault(); 
                                        e.stopPropagation(); // Prevents click from bubbling to the card
                                        setItemToDelete(conference);
                                    }} 
                                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 z-10"
                                    aria-label="Delete conference"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Strict Modal Logic to prevent accidental popups */}
            {itemToDelete && (
            <ConfirmModal 
                show={Boolean(itemToDelete && (itemToDelete.id || itemToDelete.conference_id))} 
                message={`Delete "${itemToDelete?.title || itemToDelete?.name || 'this conference'}"?`} 
                onConfirm={handleDelete} 
                onCancel={() => setItemToDelete(null)} 
            />
            )}
        </div>
    );
};

export default ConferenceList;