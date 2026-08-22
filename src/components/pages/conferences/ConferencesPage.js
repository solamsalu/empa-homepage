// src/components/pages/conferences/ConferencesPage.js

import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, ChevronDown, Calendar, FileText, BookOpen, Info, Shield, ArrowDownCircle } from 'lucide-react';

// --- Component Imports (with new names) ---
import PrimaryButton from '../../common/PrimaryButton';
import AddConferenceForm from './AddConferenceForm'; // Formerly AddEvent
import SubmitPaperPage from './SubmitPaperPage';
import SubmissionGuidelinesPage from './SubmissionGuidelinesPage';
import AboutConferencePage from './AboutConferencePage';
import AdminConferenceDashboard from './AdminConferenceDashboard';
import ConferenceList from './ConferenceList'; // Formerly EventList

// --- Context ---
import { AuthContext } from '../../../context/AuthContext';

const heroSlides = [
    { type: 'welcome', imageUrl: '/images/conference1.jpg', title: "EMPA Conferences & Events", description: "Discover a world of knowledge and networking opportunities through our curated list of conferences, workshops, and seminars." },
    { type: 'activity', imageUrl: '/images/conference14.jpg', title: 'Submit Your Research', description: 'Contribute to our growing body of knowledge by submitting your paper to an upcoming conference.', targetTab: 'submitPaper', buttonText: 'Start Submission' },
    { type: 'activity', imageUrl: '/images/conference_21.jpg', title: 'Learn Submission Guidelines', description: 'Ensure your paper meets our standards for acceptance.', targetTab: 'guidelines', buttonText: 'View Guidelines' },
    { type: 'welcome', imageUrl: '/images/conference-2026.jpg', title: "EMPA Conferences & Events", description: "Discover a world of knowledge and networking opportunities through our curated list of conferences, workshops, and seminars." },
    { type: 'activity', imageUrl: '/images/conference12.jpg', title: 'About Our Conferences', description: 'Learn about the vision, impact, and history of EMPA conferences.', targetTab: 'about', buttonText: 'Discover Our Story' },
];

const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction) => ({ zIndex: 0, x: direction < 0 ? '100%' : '-100%', opacity: 0 }),
};

const ConferencesPage = () => {
    const { userRole } = useContext(AuthContext);
    const isAdmin = userRole === 'admin';
    const [activeTab, setActiveTab] = useState('about');
    const [[currentSlide, direction], setSlide] = useState([0, 0]);
    const [isAddFormVisible, setAddFormVisible] = useState(false);

    const contentRef = useRef(null);
    const navigate = useNavigate();

    const tabs = [
        { id: 'about', label: 'About Our Conferences', icon: <Info size={20} /> },
        { id: 'conferences', label: 'Upcoming Conferences', icon: <Calendar size={20} /> },
        { id: 'guidelines', label: 'Submission Guidelines', icon: <BookOpen size={20} /> },
        { id: 'submitPaper', label: 'Submit a Paper', icon: <FileText size={20} /> },
        ...(isAdmin ? [{ id: 'adminDashboard', label: 'Admin Dashboard', icon: <Shield size={20} /> }] : []),
    ];

    const nextSlide = useCallback(() => setSlide(([prev]) => [(prev + 1) % heroSlides.length, 1]), []);

    const handleHeroAction = (targetTab) => {
        setActiveTab(targetTab);
        if (contentRef.current) {
            contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    useEffect(() => {
        const interval = setInterval(nextSlide, 8000);
        return () => clearInterval(interval);
    }, [nextSlide]);

    const renderContentForTab = () => {
        switch (activeTab) {
            case 'conferences': return <ConferenceList />; // Use renamed component
            case 'submitPaper': return <SubmitPaperPage />;
            case 'guidelines': return <SubmissionGuidelinesPage />;
            case 'about': return <AboutConferencePage />;
            case 'adminDashboard': return isAdmin ? <AdminConferenceDashboard /> : null;
            default: return <p>Please select a section.</p>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <div id="conferences-hero-section" className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div key={currentSlide} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" className="absolute inset-0">
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroSlides[currentSlide].imageUrl})` }}></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                    </motion.div>
                </AnimatePresence>

                <div className="relative z-10 max-w-4xl mx-auto px-4 text-white">
                    <motion.h1 key={`title-${currentSlide}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-4xl sm:text-5xl font-extrabold">{heroSlides[currentSlide].title}</motion.h1>
                    <motion.p key={`desc-${currentSlide}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-4 text-lg text-blue-100">{heroSlides[currentSlide].description}</motion.p>

                    {heroSlides[currentSlide].targetTab && (
                        <motion.div key={`button-${currentSlide}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-8">
                            <PrimaryButton onClick={() => handleHeroAction(heroSlides[currentSlide].targetTab)}>
                                {heroSlides[currentSlide].buttonText || 'Learn More'}
                            </PrimaryButton>
                        </motion.div>
                    )}
                </div>
                <button onClick={() => contentRef.current?.scrollIntoView({ behavior: 'smooth' })} className="absolute bottom-8 z-20 text-white animate-bounce" aria-label="Scroll to content">
                    <ArrowDownCircle size={48} strokeWidth={1.5} />
                </button>
            </div>

            <div ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="sticky top-[var(--navbar-height)] bg-gray-100/80 backdrop-blur-md z-30 py-4 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-2 flex flex-wrap items-center justify-center gap-2">
                        {tabs.map((tab) => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-x-2.5 font-semibold text-base px-4 py-2.5 rounded-lg transition-all duration-300 ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'}`}>
                                {tab.icon}<span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {isAdmin && (
                    <div className="mb-8 bg-white rounded-xl shadow-lg border border-gray-200">
                        <button onClick={() => setAddFormVisible(!isAddFormVisible)} className="w-full p-4 flex justify-between items-center text-left text-xl font-bold text-blue-900 hover:bg-gray-50 rounded-t-xl">
                            <span><PlusCircle className="inline-block mr-3 h-7 w-7 text-green-500" />Add New Conference</span>
                            <ChevronDown className={`h-6 w-6 transition-transform duration-300 ${isAddFormVisible ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {isAddFormVisible && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                    <div className="p-6 border-t border-gray-200">
                                        <AddConferenceForm onConferenceAdded={() => {
                                            setAddFormVisible(false);
                                            // Optional: Add logic to refresh the conference list if it's visible
                                        }} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                <div>
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
                            {renderContentForTab()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ConferencesPage;