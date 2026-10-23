import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar } from 'lucide-react';
import { API_BASE_URL } from '../../../utils/constants';
import ConferenceCard, { ConferenceCardSkeleton } from '../../common/ConferenceCard';

const ConferenceList = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get(`${API_BASE_URL}/conferences`);
                const allEvents = res.data.data || [];
                
                // Compare dates at midnight so same-day events do not disappear
                const todayMidnight = new Date();
                todayMidnight.setHours(0, 0, 0, 0);
                
                const upcoming = allEvents
                    .filter(ev => {
                        const evDate = new Date(ev.date || ev.start_date);
                        return !isNaN(evDate.getTime()) && evDate >= todayMidnight;
                    })
                    .sort((a, b) => new Date(a.date || a.start_date) - new Date(b.date || b.start_date));
                    
                setEvents(upcoming);
            } catch (err) {
                console.error("Failed to load events list.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvents();
    }, []);

    // Filter Logic (Case-insensitive)
    const filteredEvents = events.filter(event => {
        const type = (event.event_type || 'annual_conference').toLowerCase().trim();
        const matchesFilter = activeFilter === 'all' || type === activeFilter;
        
        const q = searchQuery.toLowerCase();
        const matchesSearch = 
            (event.title && event.title.toLowerCase().includes(q)) ||
            (event.location && event.location.toLowerCase().includes(q)) ||
            (event.description && event.description.toLowerCase().includes(q));
            
        return matchesFilter && matchesSearch;
    });

    // Real-time counts for each category
    const counts = {
        all: events.length,
        annual_conference: events.filter(e => (e.event_type || 'annual_conference') === 'annual_conference').length,
        public_lecture: events.filter(e => e.event_type === 'public_lecture').length,
        seminar: events.filter(e => e.event_type === 'seminar').length,
        workshop: events.filter(e => e.event_type === 'workshop').length,
        symposium: events.filter(e => e.event_type === 'symposium').length,
    };

    const categories = [
        { id: 'all', label: 'All Gatherings', count: counts.all },
        { id: 'annual_conference', label: 'Annual Conferences', count: counts.annual_conference },
        { id: 'public_lecture', label: 'Public Lectures', count: counts.public_lecture },
        { id: 'seminar', label: 'Research Seminars', count: counts.seminar },
        { id: 'workshop', label: 'Workshops', count: counts.workshop },
        { id: 'symposium', label: 'Symposia', count: counts.symposium }
    ];

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => <ConferenceCardSkeleton key={i} />)}
            </div>
        );
    }

    return (
        <div className="space-y-8 font-sans">
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-blue-600">
                    EMPA Scientific Calendar
                </span>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                    Upcoming Events & Gatherings
                </h2>
                <p className="text-slate-500 text-sm">
                    Browse our peer-reviewed annual conferences, distinguished guest public lectures, mathematical seminars, and training workshops.
                </p>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
                {/* 🌟 Category Pills: ALWAYS VISIBLE SO ALL EVENT TYPES CAN BE FILTERED 🌟 */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    {categories.map(cat => (
                        <button 
                            key={cat.id} 
                            onClick={() => setActiveFilter(cat.id)} 
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                                activeFilter === cat.id 
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            <span>{cat.label}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-black ${
                                activeFilter === cat.id ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
                            }`}>
                                {cat.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Search Box */}
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search events, venue, topics..." 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                </div>
            </div>

            {/* Event Cards Grid */}
            {filteredEvents.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 space-y-2">
                    <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
                    <p className="text-slate-700 font-bold text-sm">No scheduled events match your current filter.</p>
                    <p className="text-slate-400 text-xs">Try selecting "All Gatherings" or checking back for new announcements.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredEvents.map(event => (
                        <ConferenceCard 
                            key={event.conference_id || event.id} 
                            conference={event} 
                            onViewDetails={() => navigate(`/conferences/${event.conference_id || event.id}`)} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ConferenceList;