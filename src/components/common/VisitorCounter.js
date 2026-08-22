// src/components/common/VisitorCounter.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AnimatedCounter from './AnimatedCounter'; 
import { API_BASE_URL } from '../../utils/constants';
/**
 * VisitorCounter Component
 * Fetches and displays the current site visitor count using AnimatedCounter for consistent styling.
 */
const VisitorCounter = () => {
    const [visitorCount, setVisitorCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchVisitorCount = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${API_BASE_URL}/visitor-count`);
                if (
                    response.data.success &&
                    response.data.data &&
                    typeof response.data.data.visitorCount === 'number'
                ) {
                    setVisitorCount(response.data.data.visitorCount);
                } else {
                    setError('Unexpected response format from visitor count API.');
                }
            } catch (err) {
                console.error('Error fetching visitor count:', err);
                setError('Failed to load visitor count.');
            } finally {
                setLoading(false);
            }
        };

        fetchVisitorCount();
    }, [API_BASE_URL]);

    if (loading) {
        return <div className="h-12 w-24 bg-gray-300 rounded-md animate-pulse"></div>;
    }

    if (error) {
        return <p className="text-red-500 text-lg font-sans">{error}</p>;
    }

    return (
        <>
            <AnimatedCounter value={visitorCount} suffix="+" />
            <p className="mt-2 text-lg text-gray-600 font-medium">Total Visitors</p>
        </>
    );
};

export default VisitorCounter;
