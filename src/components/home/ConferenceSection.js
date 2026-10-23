
// // import React, { useState, useEffect } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import axios from 'axios';
// // import { API_BASE_URL } from '../../utils/constants';
// // import PrimaryButton from '../common/PrimaryButton';
// // import { ArrowRightIcon } from '../common/icons/ArrowRightIcon';

// // // 1. IMPORT THE NEW, REUSABLE CARD AND SKELETON COMPONENTS
// // import ConferenceCard, { ConferenceCardSkeleton } from '../common/ConferenceCard';

// // /**
// //  * A modern, professional, and comprehensive conferencesSection component for the homepage.
// //  * It displays a curated list of upcoming conferences, handles loading/error states gracefully,
// //  * and uses reusable components for a clean, maintainable structure.
// //  */
// // const ConferenceSection = () => {
// //     const navigate = useNavigate();

// //     const [conferences, setConferences] = useState([]);
// //     const [errorMessage, setErrorMessage] = useState('');
// //     const [isLoading, setIsLoading] = useState(true); // Add a dedicated loading state

// //     useEffect(() => {
// //         const fetchConferences = async () => {
// //             setIsLoading(true);
// //             setErrorMessage('');
// //             try {
// //                 const response = await axios.get(`${API_BASE_URL}/conferences`);
// //                 const data = response.data.data || [];
// //                 const now = new Date();

// //                 // Refined Logic: Filter for upcoming, sort by soonest, then take top 3
// //                 const upcomingConferences = Array.isArray(data)
// //                     ? data
// //                         .filter(conf => new Date(conf.date) >= now)
// //                         .sort((a, b) => new Date(a.date) - new Date(b.date))
// //                         .slice(0, 3)
// //                     : [];

// //                 setConferences(upcomingConferences);
// //             } catch (error) {
// //                 console.error('Failed to fetch conferences for homepage:', error.response?.data || error.message);
// //                 setErrorMessage('Error loading latest conferences. Please try again later.');
// //             } finally {
// //                 setIsLoading(false);
// //             }
// //         };
// //         fetchConferences();
// //     }, []);

// //     const handleViewConferenceDetails = (conferenceId) => {
// //         navigate(`/conferences/${conferenceId}`);
// //     };

// //     const handleSeeAllConferences = () => {
// //         navigate('/conferences');
// //     };

// //     /**
// //      * Renders the main content grid, handling loading, error, and data states.
// //      */
// //     const renderContent = () => {
// //         if (isLoading) {
// //             // Display 3 skeleton loaders for a smooth loading experience
// //             return (
// //                 <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
// //                     {[...Array(3)].map((_, index) => (
// //                         <ConferenceCardSkeleton key={index} />
// //                     ))}
// //                 </div>
// //             );
// //         }

// //         if (errorMessage) {
// //             return <p className="text-red-600 text-center mt-12">{errorMessage}</p>;
// //         }

// //         if (conferences.length === 0) {
// //             return <p className="text-gray-600 text-center mt-12">No upcoming conferences available at the moment.</p>;
// //         }

// //         return (
// //             <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
// //                 {conferences.map(conf => (
// //                     // Use the reusable ConferenceCard component
// //                     <ConferenceCard
// //                         key={conf.conference_id} // Ensure key is unique, e.g., 'id' or 'conference_id'
// //                         conference={conf}
// //                         onViewDetails={() => handleViewConferenceDetails(conf.conference_id)}
// //                     />
// //                 ))}
// //             </div>
// //         );
// //     };

// //     return (
// //         <section id="conferences-section" className="bg-white py-20 sm:py-28">
// //             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //                 {/* Section header */}
// //                 <div className="text-center">
// //                     <h2 className="text-3xl font-bold text-blue-900">Upcoming EMPA Conferences</h2>
// //                     <p className="mt-4 text-lg text-gray-600">Join our conferences, workshops, and competitions.</p>
// //                 </div>

// //                 {renderContent()}

// //                 {/* "See All conferences" button - only show if there wasn't a major error */}
// //                 {!errorMessage && (
// //                     <div className="text-center mt-16">
// //                         <PrimaryButton onClick={handleSeeAllConferences}>
// //                             See All conferences <ArrowRightIcon />
// //                         </PrimaryButton>
// //                     </div>
// //                 )}
// //             </div>
// //         </section>
// //     );
// // };

// // export default ConferenceSection;



// // import React, { useState, useEffect } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import axios from 'axios';
// // import { API_BASE_URL } from '../../utils/constants';
// // import PrimaryButton from '../common/PrimaryButton';
// // import { ArrowRightIcon } from '../common/icons/ArrowRightIcon';

// // // 1. IMPORT THE NEW, REUSABLE CARD AND SKELETON COMPONENTS
// // import ConferenceCard, { ConferenceCardSkeleton } from '../common/ConferenceCard';


// // const ConferenceSection = () => {
// //     const navigate = useNavigate();
// //     const [events, setEvents] = useState([]);
// //     const [isLoading, setIsLoading] = useState(true);

// //     useEffect(() => {
// //         const fetchEvents = async () => {
// //             try {
// //                 const res = await axios.get(`${API_BASE_URL}/conferences`);
// //                 const upcoming = (res.data.data || [])
// //                     .filter(ev => new Date(ev.date || ev.start_date) >= new Date())
// //                     .sort((a, b) => new Date(a.date || a.start_date) - new Date(b.date || b.start_date))
// //                     .slice(0, 3);
// //                 setEvents(upcoming);
// //             } catch (err) {
// //                 console.error('Failed to load events:', err);
// //             } finally {
// //                 setIsLoading(false);
// //             }
// //         };
// //         fetchEvents();
// //     }, []);

// //     return (
// //         <section className="bg-slate-50 py-20 sm:py-28">
// //             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //                 <div className="text-center mb-16">
// //                     <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Upcoming EMPA Events</h2>
// //                     <p className="mt-4 text-lg text-slate-600">Join our conferences, public lectures, and seminars.</p>
// //                 </div>
// //                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
// //                     {isLoading ? [...Array(3)].map((_, i) => <ConferenceCardSkeleton key={i} />) 
// //                     : events.length === 0 ? <p className="col-span-full text-center text-slate-500 font-bold">No upcoming events scheduled.</p>
// //                     : events.map(ev => <ConferenceCard key={ev.conference_id || ev.id} conference={ev} onViewDetails={() => navigate(`/conferences/${ev.conference_id || ev.id}`)} />)}
// //                 </div>
// //                 {!isLoading && events.length > 0 && (
// //                     <div className="text-center mt-12">
// //                         <PrimaryButton onClick={() => navigate('/conferences')}>See All Events <ArrowRightIcon className="ml-2 w-4 h-4" /></PrimaryButton>
// //                     </div>
// //                 )}
// //             </div>
// //         </section>
// //     );
// // };

// // export default ConferenceSection;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { API_BASE_URL } from '../../utils/constants';
// import PrimaryButton from '../common/PrimaryButton';
// import { ArrowRightIcon } from '../common/icons/ArrowRightIcon';
// import ConferenceCard, { ConferenceCardSkeleton } from '../common/ConferenceCard';

// const ConferenceSection = () => {
//     const navigate = useNavigate();
//     const [events, setEvents] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         const fetchEvents = async () => {
//             try {
//                 const res = await axios.get(`${API_BASE_URL}/conferences`);
//                 const upcoming = (res.data.data || [])
//                     .filter(ev => new Date(ev.date || ev.start_date) >= new Date())
//                     .sort((a, b) => new Date(a.date || a.start_date) - new Date(b.date || b.start_date))
//                     .slice(0, 3);
//                 setEvents(upcoming);
//             } catch (err) {
//                 console.error('Failed to load events for homepage:', err);
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchEvents();
//     }, []);

//     return (
//         <section className="bg-slate-50 py-20 sm:py-28 font-sans border-t border-slate-200">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 {/* Section Header */}
//                 <div className="text-center mb-16 space-y-2">
//                     <span className="text-xs font-black uppercase tracking-widest text-blue-600">
//                         EMPA Calendar of Events
//                     </span>
//                     <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase">
//                         Upcoming Scientific Gatherings
//                     </h2>
//                     <p className="mt-2 text-base text-slate-600 max-w-2xl mx-auto">
//                         Participate in national conferences, distinguished guest lectures, research seminars, and student workshops.
//                     </p>
//                 </div>

//                 {/* 3 Featured Cards */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                     {isLoading ? (
//                         [...Array(3)].map((_, i) => <ConferenceCardSkeleton key={i} />)
//                     ) : events.length === 0 ? (
//                         <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-dashed text-slate-400 font-bold text-sm">
//                             No upcoming events scheduled at the moment.
//                         </div>
//                     ) : (
//                         events.map(ev => (
//                             <ConferenceCard 
//                                 key={ev.conference_id || ev.id} 
//                                 conference={ev} 
//                                 onViewDetails={() => navigate(`/conferences/${ev.conference_id || ev.id}`)} 
//                             />
//                         ))
//                     )}
//                 </div>

//                 {/* "See All Events" CTA */}
//                 {!isLoading && events.length > 0 && (
//                     <div className="text-center mt-12">
//                         <PrimaryButton onClick={() => navigate('/conferences')}>
//                             <span>Explore All Events & Seminars</span>
//                             <ArrowRightIcon className="ml-2 w-4 h-4 inline" />
//                         </PrimaryButton>
//                     </div>
//                 )}
//             </div>
//         </section>
//     );
// };

// export default ConferenceSection;


// src/components/pages/home/ConferenceSection.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/constants';
import PrimaryButton from '../common/PrimaryButton';
import { ArrowRight, Calendar, Sparkles, Compass } from 'lucide-react';
import ConferenceCard, { ConferenceCardSkeleton } from '../common/ConferenceCard';

const ConferenceSection = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get(`${API_BASE_URL}/conferences`);
                const allList = res.data.data || [];
                
                const now = new Date();
                now.setHours(0, 0, 0, 0);

                // Filter for upcoming/ongoing events, sorted closest date first, take top 3
                const upcoming = allList
                    .filter(ev => {
                        const evDate = new Date(ev.date || ev.start_date);
                        return !isNaN(evDate.getTime()) && evDate >= now;
                    })
                    .sort((a, b) => new Date(a.date || a.start_date) - new Date(b.date || b.start_date))
                    .slice(0, 3);

                setEvents(upcoming);
            } catch (err) {
                console.error('Failed to load events for homepage:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return (
        <section 
            id="conferences-section" 
            className="py-24 sm:py-32 bg-slate-50/70 border-t border-slate-200/80 font-sans relative overflow-hidden"
        >
            {/* Subtle Aesthetic Background Patterns */}
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white to-transparent pointer-events-none" />
            <div className="absolute -top-24 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
                
                {/* 🌟 Modern Header with EMPA Badge & Typography 🌟 */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-3 max-w-2xl">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest text-blue-700 bg-blue-100/80 border border-blue-200">
                            <Sparkles size={13} className="text-blue-600" />
                            Scientific Gatherings & Events
                        </span>
                        
                        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                            Upcoming Academic Conferences & Lectures
                        </h2>
                        
                        <p className="text-base text-slate-600 leading-relaxed">
                            Join mathematicians, research scholars, and students at our peer-reviewed national conferences, distinguished guest public lectures, and specialized research seminars.
                        </p>
                    </div>

                    {/* Desktop "Explore All" shortcut */}
                    <div className="hidden md:block shrink-0">
                        <button
                            onClick={() => navigate('/conferences')}
                            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-600 hover:text-blue-800 transition py-2 group"
                        >
                            <span>Explore Full Calendar</span>
                            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* 🌟 3 Featured Event Cards 🌟 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isLoading ? (
                        [...Array(3)].map((_, i) => <ConferenceCardSkeleton key={i} />)
                    ) : events.length === 0 ? (
                        <div className="col-span-full py-16 px-6 bg-white rounded-3xl border border-dashed border-slate-300 text-center space-y-3">
                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                                <Calendar size={24} />
                            </div>
                            <h3 className="text-base font-bold text-slate-800">
                                No Upcoming Events Scheduled
                            </h3>
                            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                                Our upcoming conference calls and public seminar schedules are currently being compiled by the program committee. Check back soon.
                            </p>
                        </div>
                    ) : (
                        events.map(ev => (
                            <ConferenceCard 
                                key={ev.conference_id || ev.id} 
                                conference={ev} 
                                onViewDetails={() => navigate(`/conferences/${ev.conference_id || ev.id}`)} 
                            />
                        ))
                    )}
                </div>

                {/* 🌟 Mobile / Centered CTA 🌟 */}
                {!isLoading && events.length > 0 && (
                    <div className="text-center pt-4">
                        <PrimaryButton 
                            onClick={() => navigate('/conferences')}
                            className="shadow-xl shadow-blue-600/10 px-8 py-3.5 text-xs font-black uppercase tracking-wider justify-center gap-2"
                        >
                            <Compass size={16} />
                            <span>View Full Scientific Calendar</span>
                            <ArrowRight size={15} />
                        </PrimaryButton>
                    </div>
                )}

            </div>
        </section>
    );
};

export default ConferenceSection;