// src/components/pages/conferences/ConferenceDetailsPage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL, STATIC_ASSETS_BASE_URL } from '../../../utils/constants';
import PrimaryButton from '../../common/PrimaryButton';
import { BackArrowIcon } from '../../common/icons/BackArrowIcon';
import { ArrowRightIcon } from '../../common/icons/ArrowRightIcon';
import { CalendarIcon } from '../../common/icons/CalendarIcon';
import { LocationIcon } from '../../common/icons/LocationIcon';
import ImageContainer from '../../common/ImageContainer';

const ConferenceDetailsSkeleton = () => (
    <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-gray-200 animate-pulse">
        <div className="h-8 w-48 bg-gray-300 rounded-md mb-8"></div>
        <div className="h-10 w-3/4 bg-gray-300 rounded-lg mb-6 border-b pb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="h-6 w-1/2 bg-gray-300 rounded"></div>
            <div className="h-6 w-1/2 bg-gray-300 rounded"></div>
        </div>
        <div className="w-full aspect-video bg-gray-300 rounded-lg mb-8"></div>
        <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
        </div>
    </div>
);

const ConferenceDetailsPage = () => {
    // FIX: Rename variable for clarity
    const { conferenceId } = useParams();
    const navigate = useNavigate();

    const [conference, setConference] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!conferenceId) {
            setError("Conference ID is missing from the URL.");
            setLoading(false);
            return;
        }
        const fetchConferenceDetails = async () => {
            setLoading(true);
            try {
                // FIX: Point to the correct, unified endpoint
                const response = await axios.get(`${API_BASE_URL}/conferences/${conferenceId}`);
                if (response.data.success && response.data.data) {
                    setConference(response.data.data);
                } else {
                    throw new Error("Invalid response structure from server.");
                }
            } catch (err) {
                console.error('Failed to fetch conference details:', err);
                setError(err.response?.data?.message || err.message || "An unknown error occurred.");
            } finally {
                setLoading(false);
            }
        };
        fetchConferenceDetails();
    }, [conferenceId]);

    const formatDateTime = (isoDateString) => {
        if (!isoDateString) return 'Date not specified';
        return new Date(isoDateString).toLocaleString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    if (loading) return <div className="bg-gray-100 min-h-screen py-8 sm:py-12 px-4"><ConferenceDetailsSkeleton /></div>;

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
                <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg mb-8 shadow-md">
                    <p className="text-2xl font-semibold mb-4">Failed to Load Conference</p>
                    <p className="text-lg">{error}</p>
                </div>
                {/* FIX: Navigate to the correct route */}
                <PrimaryButton onClick={() => navigate('/conferences')}><BackArrowIcon className="mr-2" /> Back to Conferences</PrimaryButton>
            </div>
        );
    }

    if (!conference) return null; // Or a more specific 'not found' component

    return (
        <div className="bg-gray-100 min-h-screen py-8 sm:py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-gray-200">
                <button onClick={() => navigate('/conferences')} className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-8">
                    <BackArrowIcon className="w-5 h-5 mr-2" /> Back to All Conferences
                </button>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-6 border-b pb-4">{conference.title}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-gray-700">
                    <p className="flex items-center text-base"><CalendarIcon className="w-5 h-5 mr-2" /><strong>Date:</strong> {formatDateTime(conference.date)}</p>
                    <p className="flex items-center text-base"><LocationIcon className="w-5 h-5 mr-2" /><strong>Location:</strong> {conference.location || 'N/A'}</p>
                </div>
                {conference.images && conference.images.length > 0 && (
                     <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
                        <ImageContainer
                           src={`${STATIC_ASSETS_BASE_URL}${conference.images[0].image_url}`}
                           alt={conference.images[0].image_alt_text || conference.title}
                           className="aspect-video"
                        />
                     </div>
                )}
                <div className="prose prose-lg max-w-none text-gray-800 mb-8 p-4 bg-gray-50 rounded-md">
                    <div dangerouslySetInnerHTML={{ __html: conference.description || '' }} />
                </div>
                {conference.registration_link && (
                    <PrimaryButton href={conference.registration_link} target="_blank" rel="noopener noreferrer">
                        Register Now <ArrowRightIcon className="w-5 h-5" />
                    </PrimaryButton>
                )}
            </div>
        </div>
    );
};

export default ConferenceDetailsPage;