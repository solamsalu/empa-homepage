
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon } from '../common/icons/ArrowRightIcon';

// --- Icon Components for Benefits (You can create these in your /icons folder) ---
// These are examples. You can use any suitable icons from a library like Heroicons.

const JournalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const NetworkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const GrowthIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);


/**
 * A modern, professional, and comprehensive MembershipSection component.
 * It features a dynamic background, clearly lists membership benefits, and provides a compelling call to action.
 */
const MembershipSection = () => {
    const navigate = useNavigate();

    const benefits = [
        {
            icon: <JournalIcon />,
            title: 'Exclusive Access',
            description: 'Gain members-only access to our journals, research papers, and resources.'
        },
        {
            icon: <NetworkIcon />,
            title: 'Professional Network',
            description: 'Connect with a vibrant community of mathematicians, academics, and industry professionals across Ethiopia.'
        },
        {
            icon: <GrowthIcon />,
            title: 'Career Growth',
            description: 'Enhance your career through conference participation, publication opportunities, and workshops.'
        }
    ];

    return (
        // --- 1. Visually Rich Background ---
        // A subtle, animated gradient gives a premium, modern feel.
        <section 
            id="membership-section" 
            className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800 text-white overflow-hidden animate-gradient"
        >
            {/* Optional: Add a subtle pattern overlay for more texture */}
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>

            <div className="relative max-w-7xl mx-auto py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    
                    {/* --- 2. Benefit-Oriented Content (Left Column) --- */}
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                            Advance Your Career with EMPA
                        </h2>
                        <p className="mt-4 text-lg leading-relaxed text-blue-200">
                            Join a network of professionals dedicated to advancing mathematics. Unlock a world of resources, collaboration, and opportunity.
                        </p>

                        {/* --- 3. Enhanced Call-to-Action (CTA) --- */}
                        <div className="mt-10">
                            <button
                                onClick={() => navigate('/register')}
                                className="text-blue-900 bg-amber-400 hover:bg-amber-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-bold py-4 px-10 rounded-full transition-all duration-300 inline-flex items-center justify-center text-lg"
                            >
                                Become a Member Today
                                <ArrowRightIcon className="w-6 h-6 ml-2" />
                            </button>
                        </div>
                    </div>
                    
                    {/* --- 4. Benefits List (Right Column) --- */}
                    <div className="space-y-8">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="flex items-start">
                                <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-white/10 rounded-lg">
                                    {benefit.icon}
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-bold text-white">{benefit.title}</h3>
                                    <p className="mt-1 text-base text-blue-200">{benefit.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default MembershipSection;