
// src/components/sections/CountersSection.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/constants';
import AnimatedCounter from '../common/AnimatedCounter';
import VisitorCounter from '../common/VisitorCounter';

// --- Icon Components ---
const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const CalendarCheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);
const DocumentTextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);
const GlobeAltIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m0 0a9 9 0 019-9m-9 9a9 9 0 009 9" />
    </svg>
);

const CountersSection = () => {
    const [stats, setStats] = useState({ members: 0, conferences: 0, journal_papers: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/statistics`);
                if (response.data.success) {
                    setStats(response.data.data);
                } else {
                    throw new Error('Invalid data format from statistics API.');
                }
            } catch (err) {
                console.error('Error fetching statistics:', err);
                setError('Could not load impact numbers.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const counterCards = [
        { icon: <UsersIcon />, value: stats.members, label: 'Active Members', suffix: '+' },
        { icon: <CalendarCheckIcon />, value: stats.conferences, label: 'Events Organized', suffix: '+' },
        { icon: <DocumentTextIcon />, value: stats.journal_papers, label: 'Research Publications', suffix: '+' }
    ];

    const renderCard = (card) => (
        <div key={card.label} className="p-6 bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out border-t-4 border-transparent hover:border-blue-500 flex flex-col items-center text-center">
            <div className="mb-4">{card.icon}</div>
            {isLoading ? (
                <div className="h-12 w-24 bg-gray-300 rounded-md animate-pulse"></div>
            ) : error ? (
                <div className="text-red-500 text-lg">Error</div>
            ) : (
                <AnimatedCounter value={card.value} suffix={card.suffix} />
            )}
            <p className="mt-2 text-lg text-gray-600 font-medium">{card.label}</p>
        </div>
    );

    return (
        <section className="bg-gray-50 py-20 sm:py-28 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 w-96 h-96 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-96 h-96 bg-purple-100 rounded-full opacity-50 blur-3xl"></div>

            <div className="max-w-6xl mx-auto px-4 relative z-10">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-blue-900 sm:text-4xl">Our Impact in Numbers</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Quantifying our commitment to advancing mathematics through community, events, and research.
                    </p>
                </div>

                <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {counterCards.map(card => renderCard(card))}

                    {/* Dynamic Visitor Counter Card */}
                    <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out border-t-4 border-transparent hover:border-blue-500 flex flex-col items-center text-center">
                        <div className="mb-4">
                            <GlobeAltIcon />
                        </div>
                        <VisitorCounter />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CountersSection;
