
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/constants';
import JournalCover from '../common/JournalCover';
import PrimaryButton from '../common/PrimaryButton';
import { BookOpen } from 'lucide-react';

const JournalSection = () => {
    const [latestEdition, setLatestEdition] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLatest = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/journals`);
                if (response.data.data && response.data.data.length > 0) {
                    setLatestEdition(response.data.data[0]); 
                }
            } catch (error) {
                console.error("Failed to fetch latest journal:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLatest();
    }, []);

    if (loading) return <div className="py-20 bg-white text-center animate-pulse">Loading latest publication...</div>;

    if (!latestEdition) {
        return (
            <section className="bg-white py-20 text-center">
                <p className="text-gray-500">Journal publications coming soon.</p>
            </section>
        );
    }
    
    return (
        <section className="bg-white py-20 sm:py-28 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                {/* Visual Side */}
                <div className="flex justify-center md:justify-end">
                    <div 
                        className="cursor-pointer transition-transform hover:scale-105 duration-300"
                        onClick={() => navigate(`/journals/edition/${latestEdition.id}`)}
                    >
                        <JournalCover edition={latestEdition} />
                    </div>
                </div>

                {/* Content Side */}
                <div className="text-center md:text-left">
                    <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">New Release</span>
                    <h2 className="text-4xl font-extrabold text-blue-900 mt-2">Latest Publication</h2>
                    <h3 className="text-2xl font-semibold text-gray-700 mt-2">{latestEdition.title}</h3>
                    <p className="mt-2 text-gray-500 font-medium">
                        Volume {latestEdition.volume_number}, Issue {latestEdition.issue_number}
                    </p>
                    <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                        Explore the newest research and insights from the mathematical community in the latest issue of JEMPA. Download full papers or view the table of contents.
                    </p>
                    
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        {/* Primary Action: Go to specific edition */}
                        <PrimaryButton onClick={() => navigate(`/journals/edition/${latestEdition.id}`)}>
                           <div className="flex items-center gap-2">
                               <BookOpen size={20} /> Read Latest Issue
                           </div>
                        </PrimaryButton>

                        {/* Secondary Action: Go to full archive */}
                        <button 
                            onClick={() => navigate('/journals')}
                            className="px-6 py-3 text-blue-700 font-bold hover:bg-blue-50 rounded-lg transition-colors border border-blue-100"
                        >
                            View All Archive
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default JournalSection;