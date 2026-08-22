
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/constants';
import PrimaryButton from '../common/PrimaryButton';
import { ArrowRightIcon } from '../common/icons/ArrowRightIcon';

// 1. IMPORT THE NEW, REUSABLE CARD AND SKELETON COMPONENTS
import ConferenceCard, { ConferenceCardSkeleton } from '../common/ConferenceCard';

/**
 * A modern, professional, and comprehensive conferencesSection component for the homepage.
 * It displays a curated list of upcoming conferences, handles loading/error states gracefully,
 * and uses reusable components for a clean, maintainable structure.
 */
const ConferenceSection = () => {
    const navigate = useNavigate();

    const [conferences, setConferences] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true); // Add a dedicated loading state

    useEffect(() => {
        const fetchConferences = async () => {
            setIsLoading(true);
            setErrorMessage('');
            try {
                const response = await axios.get(`${API_BASE_URL}/conferences`);
                const data = response.data.data || [];
                const now = new Date();

                // Refined Logic: Filter for upcoming, sort by soonest, then take top 3
                const upcomingConferences = Array.isArray(data)
                    ? data
                        .filter(conf => new Date(conf.date) >= now)
                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                        .slice(0, 3)
                    : [];

                setConferences(upcomingConferences);
            } catch (error) {
                console.error('Failed to fetch conferences for homepage:', error.response?.data || error.message);
                setErrorMessage('Error loading latest conferences. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchConferences();
    }, []);

    const handleViewConferenceDetails = (conferenceId) => {
        navigate(`/conferences/${conferenceId}`);
    };

    const handleSeeAllConferences = () => {
        navigate('/conferences');
    };

    /**
     * Renders the main content grid, handling loading, error, and data states.
     */
    const renderContent = () => {
        if (isLoading) {
            // Display 3 skeleton loaders for a smooth loading experience
            return (
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(3)].map((_, index) => (
                        <ConferenceCardSkeleton key={index} />
                    ))}
                </div>
            );
        }

        if (errorMessage) {
            return <p className="text-red-600 text-center mt-12">{errorMessage}</p>;
        }

        if (conferences.length === 0) {
            return <p className="text-gray-600 text-center mt-12">No upcoming conferences available at the moment.</p>;
        }

        return (
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {conferences.map(conf => (
                    // Use the reusable ConferenceCard component
                    <ConferenceCard
                        key={conf.conference_id} // Ensure key is unique, e.g., 'id' or 'conference_id'
                        conference={conf}
                        onViewDetails={() => handleViewConferenceDetails(conf.conference_id)}
                    />
                ))}
            </div>
        );
    };

    return (
        <section id="conferences-section" className="bg-white py-20 sm:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-blue-900">Upcoming EMPA Conferences</h2>
                    <p className="mt-4 text-lg text-gray-600">Join our conferences, workshops, and competitions.</p>
                </div>

                {renderContent()}

                {/* "See All conferences" button - only show if there wasn't a major error */}
                {!errorMessage && (
                    <div className="text-center mt-16">
                        <PrimaryButton onClick={handleSeeAllConferences}>
                            See All conferences <ArrowRightIcon />
                        </PrimaryButton>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ConferenceSection;