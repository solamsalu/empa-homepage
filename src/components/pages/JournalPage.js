import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, ChevronDown, Archive, Info, FileText, Send } from 'lucide-react';
import { API_BASE_URL } from '../../utils/constants';
import { AuthContext } from '../../context/AuthContext';
// import AddJournalEdition from '../admin/AddJournalEdition';
import PrimaryButton from '../common/PrimaryButton';
import ConfirmModal from '../common/ConfirmModal';

// Import the new, clean sub-components
import AboutJournalSection from './journal/AboutJournalSection';
import ArchiveSection from './journal/ArchiveSection';
import SubmissionGuidelinesSection from './journal/SubmissionGuidelinesSection';
import { TrendingUp } from 'lucide-react'; // Add TrendingUp icon
import TrendingSection from './journal/TrendingSection'; // Import the component


const JournalPage = () => {
    const { userRole, isLoggedIn, authToken } = useContext(AuthContext);
    const isAdminOrEditor = userRole === 'admin' || userRole === 'editor';
    const navigate = useNavigate();

    const [editions, setEditions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAddFormVisible, setAddFormVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('archive');
    const [itemToDelete, setItemToDelete] = useState(null);
    const [actionMessage, setActionMessage] = useState({ text: '', type: '' });

    const contentRef = useRef(null);

    const fetchEditions = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/journals`);
            setEditions(response.data.data || []);
        } catch (error) {
            setError("Could not load journal editions.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchEditions(); }, [fetchEditions]);

    // const handlePortalClick = () => {
    //     navigate('/jempa-portal');
    // };
    const handlePortalClick = () => {
        navigate(isLoggedIn ? '/jempa-portal' : '/submit-journal-paper', {
            state: { message: 'Please log in to access the submission portal.' }
        });
    };

    // const handleEditionAdded = () => {
    //     setActionMessage({ text: 'New edition uploaded successfully!', type: 'success' });
    //     setAddFormVisible(false);
    //     fetchEditions();
    //     setTimeout(() => setActionMessage({ text: '', type: '' }), 5000);
    // };

    const handleDeleteConfirmed = async () => {
        if (!itemToDelete) return;
        try {
            await axios.delete(`${API_BASE_URL}/journals/${itemToDelete.id}`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            setEditions(prev => prev.filter(ed => ed.id !== itemToDelete.id));
            setActionMessage({ text: 'Edition deleted successfully.', type: 'success' });
        } catch (error) {
            setActionMessage({ text: error.response?.data?.message || "Failed to delete edition.", type: 'error' });
        } finally {
            setItemToDelete(null);
            setTimeout(() => setActionMessage({ text: '', type: '' }), 5000);
        }
    };

    const currentIssue = editions.length > 0 ? editions[0] : null;
    const archiveIssues = editions.length > 1 ? editions.slice(1) : [];

    const tabs = [
        { id: 'about', label: 'About JEMPA', icon: <Info size={20} /> },
        { id: 'trending', label: 'Trending', icon: <TrendingUp size={20} /> }, 
        { id: 'archive', label: 'Current & Archive', icon: <Archive size={20} /> },
        { id: 'guidelines', label: 'Author Guidelines', icon: <FileText size={20} /> },
        { id: 'portal', label: 'Submission Portal', icon: <Send size={20} /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'about': return <AboutJournalSection onTabChange={setActiveTab} />;
            case 'trending': return <TrendingSection />; 
            case 'archive': return <ArchiveSection isLoading={isLoading} error={error} currentIssue={currentIssue} archiveIssues={archiveIssues} isAdminOrEditor={isAdminOrEditor} onDeleteClick={setItemToDelete} />;
            case 'guidelines': return <SubmissionGuidelinesSection />;
            case 'portal':
                return (
                    <div className="text-center bg-blue-50 p-12 rounded-lg border border-blue-200">
                        <h3 className="text-2xl font-bold text-blue-900">JEMPA Submission Portal</h3>
                        <p className="mt-2 text-lg text-gray-700 max-w-2xl mx-auto">{isLoggedIn ? "Manage your submissions, review assigned papers, or access editor tools." : "We welcome original research. Please log in or register to begin the submission process."}</p>
                        <div className="mt-6"><PrimaryButton onClick={handlePortalClick}>{isLoggedIn ? 'Go to Your Dashboard' : 'Login / Register to Submit'}</PrimaryButton></div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <header className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 py-20 px-4 text-white text-center">
                <h1 className="text-5xl font-extrabold">JEMPA </h1>
                <p className="mt-4 text-xl text-blue-200">The Journal of the Ethiopian Mathematics Professionals Association</p>
            </header>

            <div className="max-w-7xl mx-auto py-12 px-4 space-y-12">
                <div className="sticky top-[var(--navbar-height)] bg-gray-100/90 backdrop-blur-sm z-20 py-4">
                    <div className="bg-white rounded-xl shadow-md p-2 flex flex-wrap items-center justify-center gap-2">
                        {tabs.map((tab) => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-x-2.5 font-semibold text-base px-4 py-2.5 rounded-lg transition-all duration-300 ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'}`}>
                                {tab.icon}<span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {actionMessage.text && <div className={`p-4 rounded-md text-center font-semibold ${actionMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{actionMessage.text}</div>}

                <div ref={contentRef} className="bg-white p-6 sm:p-8 rounded-xl shadow-xl border">
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {itemToDelete && (
                <ConfirmModal
                    title="Confirm Deletion"
                    message={`Are you sure you want to permanently delete "${itemToDelete.title} - Vol ${itemToDelete.volume_number}, Iss ${itemToDelete.issue_number}"?`}
                    onConfirm={handleDeleteConfirmed}
                    onCancel={() => setItemToDelete(null)}
                    confirmButtonText="Delete"
                    confirmButtonVariant="danger"
                />
            )}
        </div>
    );
};

export default JournalPage;