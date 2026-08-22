import React, { useState, useEffect, useContext, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { API_BASE_URL, STATIC_ASSETS_BASE_URL } from '../../../utils/constants';
import { Shield, Calendar, BookOpen, HelpCircle, Info, ArrowDownCircle, Trash2, Download, Lock, ChevronDown, PlusCircle, Archive } from 'lucide-react';

// Import external components (ensure these paths are correct)
import AddOlympiadEvent from './AddOlympiadEvent';
import AddOlympiadResource from './AddOlympiadResource';
import PrimaryButton from '../../common/PrimaryButton';
import ConfirmModal from '../../common/ConfirmModal';
import ImageContainer from '../../common/ImageContainer';




const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const TrophyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;



// ===================================================================================
// SUB-COMPONENTS - Defined here for clarity and self-containment
// ===================================================================================

const OlympiadEventCard = ({ event, isAdmin, onDelete }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden relative group transition-all hover:shadow-2xl hover:-translate-y-1">
        <ImageContainer src={event.image_url ? `${STATIC_ASSETS_BASE_URL}${event.image_url}` : null} alt={event.title} fallbackText="Olympiad Event" />
        <div className="p-6">
            <p className="text-sm font-semibold text-blue-600">{new Date(event.event_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
            <h3 className="text-xl font-bold text-gray-900 mt-1">{event.title}</h3>
            <p className="text-gray-500 text-sm mt-1">{event.location}</p>
            <div className="prose prose-sm mt-2 text-gray-600 line-clamp-3" dangerouslySetInnerHTML={{ __html: event.description }} />
            <div className="mt-4 flex gap-2">
                {event.registrationLink && <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-white bg-blue-600 px-3 py-1 rounded-md hover:bg-blue-700">Register</a>}
                {event.resultsLink && <a href={event.resultsLink} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-800 bg-blue-100 px-3 py-1 rounded-md hover:bg-blue-200">Results</a>}
            </div>
        </div>
        {isAdmin && <button onClick={onDelete} className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={18} /></button>}
    </div>
);

const ResourceCard = ({ resource, onDownload, isAdmin, onDelete }) => {
    const { userRole } = useContext(AuthContext);
    const isMemberOrAdmin = userRole === 'admin' || userRole === 'member';
    const isLocked = resource.access_level === 'Members Only' && !isMemberOrAdmin;
    const getFileIcon = (url = '') => {
        const ext = url.split('.').pop().toLowerCase();
        if (['pdf'].includes(ext)) return '📄';
        if (['doc', 'docx'].includes(ext)) return '📝';
        if (['ppt', 'pptx'].includes(ext)) return '📊';
        return '📁';
    };
    return (
        <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200 flex flex-col justify-between transition-all hover:shadow-2xl hover:-translate-y-1">
            <div className="flex-grow flex items-start gap-4">
                <div className="text-4xl">{getFileIcon(resource.file_url)}</div>
                <div>
                    <h3 className="text-lg font-bold text-blue-900">{resource.title}</h3>
                    <div className="prose prose-sm text-gray-600 mt-1 line-clamp-2" dangerouslySetInnerHTML={{ __html: resource.description }} />
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${resource.access_level === 'Free' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>{resource.access_level}</span>
                <div className="flex items-center gap-2">
                    {isAdmin && <button onClick={onDelete} className="p-2 text-red-600 hover:bg-red-100 rounded-full"><Trash2 size={18} /></button>}
                    <button onClick={() => onDownload(resource)} disabled={isLocked} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 disabled:bg-gray-400">
                        {isLocked ? <Lock size={16} /> : <Download size={16} />}<span>{isLocked ? 'Members Only' : 'Download'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

const FAQItem = ({ faq, isOpen, onToggle }) => (
    <div className="py-5 border-b border-gray-200">
        <button onClick={onToggle} className="w-full flex justify-between items-center text-left text-lg font-semibold text-gray-800">
            <span>{faq.question}</span>
            <ChevronDown className={`w-5 h-5 text-indigo-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
            {isOpen && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="mt-2 text-gray-600 pr-8">{faq.answer}</p></motion.div>}
        </AnimatePresence>
    </div>
);


// ===================================================================================
// MAIN PAGE COMPONENT
// ===================================================================================

const OlympiadPage = () => {
    const { userRole, authToken, isAuthReady } = useContext(AuthContext);
    const isAdmin = userRole === 'admin';
    const [activeTab, setActiveTab] = useState('about');
    const [events, setEvents] = useState([]);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionMessage, setActionMessage] = useState('');
    const [openFAQ, setOpenFAQ] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isAddSectionVisible, setAddSectionVisible] = useState(false);
    const contentRef = useRef(null);
    const [[currentSlide, direction], setSlide] = useState([0, 0]);

    const heroSlides = [
        { id: 'about', imageUrl: '/images/olympiad1.jpg', title: "National Mathematics Olympiad", description: "Cultivating the next generation of mathematical talent through prestigious national competitions.", buttonText: "Learn About the Program", targetTab: 'about' },
        { id: 'events', imageUrl: '/images/olympiad_21.jpg', title: "Competitions & Results", description: "Explore upcoming competition dates, locations, and view archives of past results and achievements.", buttonText: "View Events", targetTab: 'events' },
        { id: 'resources', imageUrl: '/images/seminar21.jpg', title: "Preparation Resources", description: "Access a rich library of past papers, study guides, and expert materials to excel in the competition.", buttonText: "Browse Resources", targetTab: 'resources' },
        { id: 'community', imageUrl: '/images/conference7.jpg', title: "Join a Vibrant Community", description: "Connect with peers, mentors, and leading mathematicians who share your passion for problem-solving.", buttonText: "Explore Membership", targetTab: 'faq' },
    ];
    const tabs = [
        { id: 'about', label: 'About', icon: <Info size={20} /> },
        { id: 'events', label: 'Events', icon: <Calendar size={20} /> },
        { id: 'resources', label: 'Resources', icon: <BookOpen size={20} /> },
        { id: 'faq', label: 'FAQs', icon: <HelpCircle size={20} /> },
        ...(isAdmin ? [{ id: 'admin', label: 'Admin Panel', icon: <Shield size={20} /> }] : []),
    ];
    const faqs = [
        { question: "What is the National Mathematics Olympiad?", answer: "The National Mathematics Olympiad is an annual competition for high school students, designed to foster mathematical talent, encourage problem-solving skills, and identify promising young mathematicians in Ethiopia." },
        { question: "Who is eligible to participate?", answer: "It's open to Ethiopian students enrolled in recognized High schools. Specific age and grade requirements are announced for each competition." },
        { question: "How can I register for the Olympiad?", answer: "Registration details, including dates, and procedures, are published on this page under the 'Upcoming Events' section when available. An online registration link will be provided." },
        { question: "What topics are covered in the Olympiad?", answer: "The Olympiad covers a range of mathematical topics including Algebra, Number Theory, Geometry, and Combinatorics, with a focus on problem-solving rather than rote memorization. Specific syllabi are released prior to each competition." },
        { question: "Are there resources available for preparation?", answer: "Yes, we provide a variety of preparation resources including past papers, practice problems, and recommended textbooks in the 'Preparation Resources' section of this page. We also organize workshops and training camps for registered participants." },
        { question: "When are the results announced?", answer: "Results are typically announced a few days after the competition. They will be published on this page under 'Past Archives' and also communicated via email to participants." }
    ];

    const fetchData = useCallback(async () => {
        setLoading(true); setError('');
        try {
            const [eventsRes, resourcesRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/olympiad/events`),
                axios.get(`${API_BASE_URL}/olympiad/resources`)
            ]);
            setEvents(eventsRes.data.data || []);
            setResources(resourcesRes.data.data || []);
        } catch (err) { setError('Failed to load Olympiad data.'); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { if (isAuthReady) fetchData(); }, [isAuthReady, fetchData]);

    const { upcomingEvents, pastEvents } = useMemo(() => ({
        upcomingEvents: events.filter(e => new Date(e.event_date) >= new Date()).sort((a, b) => new Date(a.event_date) - new Date(b.event_date)),
        pastEvents: events.filter(e => new Date(e.event_date) < new Date()).sort((a, b) => new Date(b.event_date) - new Date(a.event_date)),
    }), [events]);

    const nextSlide = useCallback(() => setSlide(([prev]) => [(prev + 1) % heroSlides.length, 1]), [heroSlides.length]);
    useEffect(() => { const interval = setInterval(nextSlide, 8000); return () => clearInterval(interval); }, [nextSlide]);

    const handleHeroAction = (targetTab) => {
        setActiveTab(targetTab);
        contentRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDelete = async () => {
        if (!itemToDelete || !authToken) return;

        const { type, id } = itemToDelete;
        const url = `${API_BASE_URL}/olympiad/${type}s/${id}`; // Dynamically builds the URL, e.g., /olympiad/events/1

        try {
            await axios.delete(url, { headers: { 'Authorization': `Bearer ${authToken}` } });

            // Remove the item from the correct state array
            if (type === 'event') {
                setEvents(prev => prev.filter(item => item.id !== id));
            } else if (type === 'resource') {
                setResources(prev => prev.filter(item => item.id !== id));
            }
        } catch (err) {
            setError(`Failed to delete ${type}. Please try again.`);
        } finally {
            setItemToDelete(null); // Close the modal
        }
    };

    const handleDownload = (resource) => {
        const isMemberOrAdmin = userRole === 'admin' || userRole === 'member';
        if (resource.access_level === 'Members Only' && !isMemberOrAdmin) {
            alert('This resource is for members only.');
            return;
        }
        window.open(`${STATIC_ASSETS_BASE_URL}${resource.file_url}`, '_blank');
    };

    const renderContent = () => {
        if (loading) return <div className="grid grid-cols-1 md:grid-cols-2 gap-8">{[...Array(4)].map((_, i) => <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>)}</div>;
        if (error) return <div className="text-center text-red-500 py-10 font-semibold">{error}</div>;
        switch (activeTab) {
            case 'about':
                return (
                    <div className="space-y-16">
                        {/* --- Section 1: Introduction --- */}
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="prose prose-lg max-w-none text-gray-700">
                                <h2 className="text-3xl font-bold text-blue-900">What is the National Mathematics Olympiad?</h2>
                                <p>
                                    The Ethiopian Mathematics Professionals Association (EMPA) proudly organizes the National Mathematics Olympiad, a prestigious annual competition aimed at identifying, nurturing, and celebrating exceptional mathematical talent among students across Ethiopia.
                                </p>
                                <p>
                                    This event serves as a vital platform for young minds to challenge themselves, deepen their understanding of complex mathematical concepts, and connect with a community of peers and mentors who share their passion for the subject.
                                </p>
                            </div>
                            <div className="rounded-xl overflow-hidden shadow-2xl">
                                <ImageContainer
                                    src="/images/olympiad_21.jpg" // A compelling photo of students engaged in an exam or event
                                    alt="Students participating in a mathematics competition"
                                    className="aspect-video"
                                />
                            </div>
                        </div>

                        {/* --- Section 2: Core Objectives --- */}
                        <div>
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-blue-900">Our Core Objectives</h2>
                                <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                                    Our program is designed to achieve three primary goals that foster a vibrant mathematical ecosystem.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Objective Card 1 */}
                                <div className="bg-blue-600 text-white p-8 rounded-xl shadow-lg text-center transform hover:-translate-y-2 transition-transform">
                                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-white/10 mb-6">
                                        <SearchIcon />
                                    </div>
                                    <h3 className="text-2xl font-bold">Identify Talent</h3>
                                    <p className="mt-2 text-blue-200">
                                        To discover and recognize the most promising young mathematicians from all corners of the nation.
                                    </p>
                                </div>
                                {/* Objective Card 2 */}
                                <div className="bg-purple-600 text-white p-8 rounded-xl shadow-lg text-center transform hover:-translate-y-2 transition-transform">
                                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-white/10 mb-6">
                                        <TrophyIcon />
                                    </div>
                                    <h3 className="text-2xl font-bold">Foster Excellence</h3>
                                    <p className="mt-2 text-purple-200">
                                        To promote creative problem-solving and prepare students for the rigors of international competitions.
                                    </p>
                                </div>
                                {/* Objective Card 3 */}
                                <div className="bg-amber-500 text-white p-8 rounded-xl shadow-lg text-center transform hover:-translate-y-2 transition-transform">
                                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-white/10 mb-6">
                                        <UsersIcon />
                                    </div>
                                    <h3 className="text-2xl font-bold">Build Community</h3>
                                    <p className="mt-2 text-amber-100">
                                        To create a strong network of future scientists, researchers, and innovators driven by a shared passion for mathematics.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );


            case 'events':
                return (
                    <div className="space-y-16">
                        {/* Upcoming Events Section */}
                        <div>
                            <h2 className="text-3xl font-bold text-blue-900 mb-8 border-b-2 border-blue-200 pb-2">Upcoming Events</h2>
                            {upcomingEvents.length > 0 ? (
                                <div className="grid md:grid-cols-2 gap-8">
                                    {upcomingEvents.map(e => <OlympiadEventCard key={e.id} event={e} isAdmin={isAdmin} onDelete={() => setItemToDelete({ id: e.id, title: e.title, type: 'event' })} />)}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-gray-50 rounded-lg">
                                    <Calendar size={48} className="mx-auto text-gray-400" />
                                    <h3 className="mt-4 text-xl font-semibold text-gray-700">No Upcoming Events</h3>
                                    <p className="mt-2 text-gray-500">Please check back soon for announcements on our next Olympiad.</p>
                                </div>
                            )}
                        </div>
                        {/* Past Event Archives */}
                        <div>
                            <h2 className="text-3xl font-bold text-blue-900 mb-8 border-b-2 border-blue-200 pb-2">Past Event Archives</h2>
                            {pastEvents.length > 0 ? (
                                <div className="grid md:grid-cols-2 gap-8">
                                    {pastEvents.map(e => <OlympiadEventCard key={e.id} event={e} isAdmin={isAdmin} onDelete={() => setItemToDelete({ id: e.id, title: e.title, type: 'event' })} />)}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-gray-50 rounded-lg">
                                    <Archive size={48} className="mx-auto text-gray-400" />
                                    <h3 className="mt-4 text-xl font-semibold text-gray-700">Archive is Empty</h3>
                                    <p className="mt-2 text-gray-500">Results from past events will be available here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'resources':
                return (
                    <div>
                        <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">Preparation Resources</h2>
                        {resources.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {resources.map(r => <ResourceCard key={r.id} resource={r} onDownload={handleDownload} isAdmin={isAdmin} onDelete={() => setItemToDelete({ id: r.id, title: r.title, type: 'resource' })} />)}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-gray-50 rounded-lg">
                                <BookOpen size={48} className="mx-auto text-gray-400" />
                                <h3 className="mt-4 text-xl font-semibold text-gray-700">No Resources Available</h3>
                                <p className="mt-2 text-gray-500">Our team is currently curating preparation materials. Please check back soon.</p>
                            </div>
                        )}
                    </div>
                );

            case 'faq':
                return (
                    <div>
                        <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">Frequently Asked Questions</h2>
                        <div>{faqs.map((faq, i) => <FAQItem key={i} faq={faq} isOpen={openFAQ === i} onToggle={() => setOpenFAQ(openFAQ === i ? null : i)} />)}</div>
                    </div>
                );
            case 'admin': return isAdmin ? (
                <div>
                    <h2 className="text-2xl font-bold text-blue-900 mb-6 border-b-2 border-blue-200 pb-2">Admin Management</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <AddOlympiadEvent onActionComplete={msg => { setActionMessage(msg); fetchData(); }} />
                        <AddOlympiadResource onActionComplete={msg => { setActionMessage(msg); fetchData(); }} />
                    </div>
                </div>
            ) : null;
            default: return null;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden">
                <AnimatePresence>
                    <motion.div key={currentSlide} className="absolute inset-0">
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroSlides[currentSlide].imageUrl})` }}></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                    </motion.div>
                </AnimatePresence>
                <div className="relative z-10 max-w-4xl mx-auto px-4 text-white">
                    <motion.h1 className="text-5xl font-extrabold">{heroSlides[currentSlide].title}</motion.h1>
                    <motion.p className="mt-4 text-lg text-blue-100">{heroSlides[currentSlide].description}</motion.p>
                    {heroSlides[currentSlide].targetTab && <motion.div className="mt-8"><PrimaryButton onClick={() => handleHeroAction(heroSlides[currentSlide].targetTab)}>{heroSlides[currentSlide].buttonText || 'Explore'}</PrimaryButton></motion.div>}
                </div>
                <button onClick={() => contentRef.current?.scrollIntoView({ behavior: 'smooth' })} className="absolute bottom-8 z-20 text-white animate-bounce"><ArrowDownCircle size={48} /></button>
            </header>
            <div ref={contentRef} className="max-w-7xl mx-auto py-12 px-4">
                <div className="sticky top-[var(--navbar-height)] bg-gray-50/90 backdrop-blur-sm z-20 py-4 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-2 flex flex-wrap justify-center gap-2">
                        {tabs.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 font-semibold px-4 py-2.5 rounded-lg ${activeTab === tab.id ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-blue-50'}`}>{tab.icon} {tab.label}</button>)}
                    </div>
                </div>
                {actionMessage && <div className="text-center py-3 mb-6 bg-green-100 text-green-700 rounded-lg">{actionMessage}</div>}
                <div className="bg-white p-8 rounded-xl shadow-xl border">
                    <AnimatePresence mode="wait"><motion.div key={activeTab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>{renderContent()}</motion.div></AnimatePresence>
                </div>
            </div>
            {itemToDelete && (
            <ConfirmModal show={!!itemToDelete} title="Confirm Deletion" message={`Delete "${itemToDelete?.title}"?`} onConfirm={handleDelete} onCancel={() => setItemToDelete(null)} />
            )}
        </div>
    );
};

export default OlympiadPage;