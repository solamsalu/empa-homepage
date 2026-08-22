
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PrimaryButton from '../common/PrimaryButton';
import { ArrowRightIcon } from '../common/icons/ArrowRightIcon';
import { CalendarIcon } from '../common/icons/CalendarIcon';
import { LocationIcon } from '../common/icons/LocationIcon';
import { BookOpenIcon } from '../common/icons/BookOpenIcon';
import { API_BASE_URL, STATIC_ASSETS_BASE_URL } from '../../utils/constants';

// 1. IMPORT THE NEW, PROFESSIONAL IMAGE COMPONENT
import ImageContainer from '../common/ImageContainer';

/**
 * OlympiadSection Component
 * Displays a curated section on the homepage with the next upcoming event,
 * the most recent past event, and a static link to resources.
 */
const OlympiadSection = () => {
    const navigate = useNavigate();

    // State to hold the two specific events we want to display
    const [upcomingEvent, setUpcomingEvent] = useState(null);
    const [pastEvent, setPastEvent] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAndProcessEvents = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/olympiad/events`);
                const allEvents = response.data.data || [];

                const now = new Date();
                const upcoming = allEvents.filter(event => new Date(event.event_date) >= now);
                const past = allEvents.filter(event => new Date(event.event_date) < now);

                if (upcoming.length > 0) {
                    setUpcomingEvent(upcoming.sort((a, b) => new Date(a.event_date) - new Date(b.event_date))[0]);
                }
                if (past.length > 0) {
                    setPastEvent(past.sort((a, b) => new Date(b.event_date) - new Date(a.event_date))[0]);
                }

            } catch (error) {
                console.error('Failed to fetch Olympiad events for homepage:', error.response?.data || error.message);
                setErrorMessage('Error loading latest Olympiad events.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAndProcessEvents();
    }, []);

    const handleNavigateToOlympiadPage = () => {
        navigate('/olympiad');
    };

    // A reusable card component for displaying event info
    const EventCard = ({ event, type }) => (
        <div className="flex flex-col rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden group">
            
            {/* 2. USE THE IMAGECONTAINER FOR DYNAMIC EVENTS */}
            {event.image_url && (
                <ImageContainer
                    src={`${STATIC_ASSETS_BASE_URL}${event.image_url}`}
                    alt={`Olympiad event: ${event.title}`}
                    // The default aspect ratio is 'aspect-video' (16:9), which is perfect.
                    // The component's internal styles handle object-fit and hover effects.
                />
            )}

            <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                <div className="flex-1">
                    <p className={`text-sm font-medium ${type === 'upcoming' ? 'text-blue-600' : 'text-purple-600'}`}>
                        {type === 'upcoming' ? 'Next Upcoming Event' : 'Most Recent Past Event'}
                    </p>
                    <div onClick={handleNavigateToOlympiadPage} className="block mt-2 text-left cursor-pointer">
                        <p className="text-xl font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{event.title}</p>
                        <div className="mt-3 text-base text-gray-600 prose max-w-none line-clamp-3" dangerouslySetInnerHTML={{ __html: event.description }}></div>
                    </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                    <CalendarIcon className="w-4 h-4 mr-1.5" />
                    <span>{new Date(event.event_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    {event.location && <><LocationIcon className="w-4 h-4 ml-4 mr-1.5" /><span>{event.location}</span></>}
                </div>
            </div>
        </div>
    );

    return (
        <section id="olympiad-section" className="bg-gray-100 py-20 sm:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-blue-900">National Mathematics Olympiad</h2>
                    <p className="mt-4 text-lg text-gray-600">Discover upcoming competitions, past results, and preparation resources.</p>
                </div>

                {/* Grid for the three cards */}
                <div className="mt-16 grid gap-12 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
                    {/* Box 1: Upcoming Event */}
                    {isLoading ? (<div className="text-center p-6 bg-white rounded-lg shadow-md">Loading...</div>) 
                     : upcomingEvent ? (<EventCard event={upcomingEvent} type="upcoming" />) 
                     : (<div className="text-center p-6 bg-white rounded-lg shadow-md flex items-center justify-center">No upcoming event scheduled.</div>)
                    }

                    {/* Box 2: Past Event */}
                    {isLoading ? (<div className="text-center p-6 bg-white rounded-lg shadow-md">Loading...</div>) 
                     : pastEvent ? (<EventCard event={pastEvent} type="past" />) 
                     : (<div className="text-center p-6 bg-white rounded-lg shadow-md flex items-center justify-center">No past events found.</div>)
                    }

                    {/* Box 3: Static Resources Card */}
                    <div className="flex flex-col rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden group">
                        
                        {/* 3. USE THE IMAGECONTAINER FOR THE STATIC CARD */}
                        <ImageContainer 
                            src="/images/olympiad1.jpg" // A generic image for resources
                            alt="Students studying mathematics"
                        />

                        <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-green-600">Preparation & Archives</p>
                                <div onClick={handleNavigateToOlympiadPage} className="block mt-2 text-left cursor-pointer">
                                    <p className="text-xl font-semibold text-gray-900 group-hover:text-green-700 transition-colors">Preparation Resources</p>
                                    <p className="mt-3 text-base text-gray-600">Access past papers, practice problems, and recommended materials to prepare for the Olympiad.</p>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-sm text-gray-500">
                                <BookOpenIcon className="w-4 h-4 mr-1.5" />
                                <span>Past Papers & Study Guides</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* "See All Olympiads" button */}
                <div className="text-center mt-16">
                    <PrimaryButton onClick={handleNavigateToOlympiadPage}>
                        Go to Full Olympiad Page <ArrowRightIcon />
                    </PrimaryButton>
                </div>
            </div>
        </section>
    );
};

export default OlympiadSection;