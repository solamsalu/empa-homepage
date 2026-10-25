import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, FileText, BookOpen, Info, Shield, ArrowDownCircle, PlusCircle, ChevronDown, Award } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext';
import { API_BASE_URL } from '../../../utils/constants';
import PrimaryButton from '../../common/PrimaryButton';
import ConferenceList from './ConferenceList';
import SubmitPaperPage from './SubmitPaperPage';
import SubmissionGuidelinesPage from './SubmissionGuidelinesPage';
import AboutConferencePage from './AboutConferencePage';
import AddConferenceForm from './AddConferenceForm';
import ConferenceScheduleView from './ConferenceScheduleView';
// import KeynoteSpeakersSection from './KeynoteSpeakersSection';


const heroSlides = [
  { type: 'welcome', imageUrl: '/images/conference1.jpg', title: 'EMPA Events & Conferences', description: 'Fostering mathematical research, technological innovation, and international academic collaboration.', buttonText: 'Explore Events', targetTab: 'conferences' },
  { type: 'activity', imageUrl: '/images/conference14.jpg', title: 'Call for Papers', description: 'Submit your manuscript for double-blind peer review by the Scientific Program Committee.', targetTab: 'submitPaper', buttonText: 'Submit Your Research' },
  { type: 'activity', imageUrl: '/images/conference_21.jpg', title: 'Conference Program', description: 'Explore presentation schedules, lecture rooms, and distinguished sessions.', targetTab: 'schedule', buttonText: 'View Timetable' }
];

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: (dir) => ({ zIndex: 0, x: dir < 0 ? '100%' : '-100%', opacity: 0 })
};

const ConferencesPage = () => {
  const { userRole, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const role = userRole?.toLowerCase().trim() || '';
  const isAdmin = role === 'admin' || role === 'conference_manager';

  const [activeTab, setActiveTab] = useState('conferences');
  const [activeConferenceId, setActiveConferenceId] = useState(null); // 🌟 Tracks the active conference for schedule
  const [[currentSlide, direction], setSlide] = useState([0, 0]);
  const [isAddFormVisible, setAddFormVisible] = useState(false);
  const contentRef = useRef(null);

  // 1. Fetch active conference ID for the schedule view
  useEffect(() => {
    const fetchActiveConf = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/submissions/active`);
        if (res.data.data?.length > 0) {
          const first = res.data.data[0];
          setActiveConferenceId(first.conference_id || first.id);
        }
      } catch (err) {
        console.error("Failed to fetch active conference for timetable.");
      }
    };
    fetchActiveConf();
  }, []);

  const nextSlide = useCallback(() => setSlide(([prev]) => [(prev + 1) % heroSlides.length, 1]), []);
  useEffect(() => { const timer = setInterval(nextSlide, 8000); return () => clearInterval(timer); }, [nextSlide]);

  const handleHeroAction = (targetTab) => {
    setActiveTab(targetTab);
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 🌟 2. Added 'Program Timetable' to the tabs list
  const tabs = [
    { id: 'conferences', label: 'Upcoming Events', icon: <Calendar size={18} /> },
    { id: 'schedule', label: 'Program Timetable', icon: <Clock size={18} /> }, // 🌟 NEW TAB
    { id: 'submitPaper', label: 'Call for Papers', icon: <FileText size={18} /> },
    { id: 'guidelines', label: 'Author Guidelines', icon: <BookOpen size={18} /> },
    { id: 'about', label: 'About', icon: <Info size={18} /> }
  ];

  // 🌟 3. Render content for the schedule tab
  const renderContent = () => {
    switch (activeTab) {
      case 'conferences': return <ConferenceList />;
      case 'schedule': return <ConferenceScheduleView conferenceId={activeConferenceId} />; // 🌟 RENDERS SCHEDULE
      case 'submitPaper': return <SubmitPaperPage />;
      case 'guidelines': return <SubmissionGuidelinesPage />;
      case 'about': return <AboutConferencePage />;
      default: return <ConferenceList />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Hero Section */}
      <div className="relative h-[80vh] flex flex-col items-center justify-center text-center overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div key={currentSlide} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.8 }} className="absolute inset-0">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroSlides[currentSlide].imageUrl})` }} />
            <div className="absolute inset-0 bg-slate-900/70" />
          </motion.div>
        </AnimatePresence>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-white">
          <motion.h1 key={`title-${currentSlide}`} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-6xl font-black uppercase tracking-tight">{heroSlides[currentSlide].title}</motion.h1>
          <motion.p key={`desc-${currentSlide}`} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-4 text-lg text-blue-100">{heroSlides[currentSlide].description}</motion.p>
          <motion.div key={`btn-${currentSlide}`} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-8">
            <PrimaryButton onClick={() => handleHeroAction(heroSlides[currentSlide].targetTab)}>{heroSlides[currentSlide].buttonText}</PrimaryButton>
          </motion.div>
        </div>
        <button onClick={() => contentRef.current?.scrollIntoView({ behavior: 'smooth' })} className="absolute bottom-8 z-20 text-white/70 hover:text-white animate-bounce"><ArrowDownCircle size={36} /></button>
      </div>

      <div ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* --- Authenticated Workspaces Banner --- */}
        {isLoggedIn && (
          <div className="bg-white p-6 rounded-3xl border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 font-sans">
            <div>
              <span className="text-[10px] font-black uppercase text-indigo-600 block">Authenticated Workspaces</span>
              <h3 className="text-base font-bold text-slate-800">Direct Portal Links</h3>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* 1. Author Hub */}
              <button 
                onClick={() => navigate('/conferences/author/dashboard')} 
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition"
              >
                <FileText size={14} className="text-blue-600" /> My Author Hub
              </button>

              {/* 2. Reviewer Desk */}
              <button 
                onClick={() => navigate('/conferences/reviewer/dashboard')} 
                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-xl text-xs font-bold transition border border-indigo-200"
              >
                <Award size={14} className="text-indigo-600" /> Reviewer Desk
              </button>

              {/* 3. Chair Command */}
              {isAdmin && (
                <button 
                  onClick={() => navigate('/conferences/manager/dashboard')} 
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  <Shield size={14} className="text-amber-400" /> Chair Command
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="sticky top-20 bg-slate-50/90 backdrop-blur-md z-30 py-3">
          <div className="bg-white rounded-2xl shadow-sm border p-1.5 flex flex-wrap justify-center gap-1">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>
                {tab.icon}<span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Admin Event Creation Accordion */}
        {isAdmin && (
          <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
            <button onClick={() => setAddFormVisible(!isAddFormVisible)} className="w-full p-5 flex justify-between items-center text-sm font-extrabold text-slate-800 hover:bg-slate-50">
              <span className="flex items-center gap-2"><PlusCircle className="text-emerald-500" size={18} /> Create New Event</span>
              <ChevronDown className={`transform transition duration-300 ${isAddFormVisible ? 'rotate-180' : ''}`} size={18} />
            </button>
            <AnimatePresence>
              {isAddFormVisible && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t">
                  <div className="p-6"><AddConferenceForm onConferenceAdded={() => { setAddFormVisible(false); setActiveTab('conferences'); }} /></div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Active Content */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.2 }}>
            {renderContent()}
          </motion.div>
        </AnimatePresence>
        {/* <div className="pt-8">
          <KeynoteSpeakersSection />
        </div> */}

      </div>
      
    </div>
  );
};

export default ConferencesPage;
