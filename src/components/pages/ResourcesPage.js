
import React, { useState, useEffect, useContext, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { API_BASE_URL, STATIC_ASSETS_BASE_URL } from '../../utils/constants';
import { Download, Trash2, PlusCircle, ChevronDown, Search, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '../common/ConfirmModal';
import AddResource from './AddResource'; 
import { toast } from 'react-toastify';

// --- Reusable Sub-component for a single Resource Card ---
const ResourceCard = ({ resource, onDownload, onDelete, isAdmin }) => {
    const { userRole } = useContext(AuthContext);
    const isMemberOrAdmin = userRole === 'admin' || userRole === 'member';
    const isLocked = resource.access_level === 'Members Only' && !isMemberOrAdmin;

    // A map to get file type icons (you can expand this)
    const getFileIcon = (url) => {
        const extension = url.split('.').pop().toLowerCase();
        switch (extension) {
            case 'pdf': return '📄'; // PDF Icon
            case 'doc':
            case 'docx': return '📝'; // Word Doc Icon
            case 'ppt':
            case 'pptx': return '📊'; // PowerPoint Icon
            default: return '📁'; // Generic File Icon
        }
    };
    
    return (
        <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="flex-grow">
                <div className="flex items-start gap-4">
                    <div className="text-4xl">{getFileIcon(resource.file_url)}</div>
                    <div>
                        <h3 className="text-lg font-bold text-blue-900">{resource.title}</h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{resource.description}</p>
                    </div>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    resource.access_level === 'Free' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                }`}>
                    {resource.access_level}
                </span>
                <div className="flex items-center gap-2">
                    {isAdmin && (
                        <button onClick={() => onDelete(resource)} className="p-2 text-red-600 hover:bg-red-100 rounded-full"><Trash2 size={18} /></button>
                    )}
                    <button
                        onClick={() => onDownload(resource)}
                        disabled={isLocked}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isLocked ? <Lock size={16} /> : <Download size={16} />}
                        <span>{isLocked ? 'Members Only' : 'Download'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Reusable Skeleton Loader for the Resource Card ---
const ResourceCardSkeleton = () => (
    <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200 animate-pulse">
        <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gray-300 rounded-md"></div>
            <div className="flex-grow">
                <div className="h-6 w-3/4 bg-gray-300 rounded"></div>
                <div className="h-4 w-full bg-gray-200 rounded mt-2"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded mt-1"></div>
            </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
            <div className="h-6 w-20 bg-gray-300 rounded-full"></div>
            <div className="h-10 w-32 bg-gray-300 rounded-md"></div>
        </div>
    </div>
);

/**
 * A final, modern, professional, and comprehensive Resources Page.
 */
const ResourcesPage = () => {
    const { userRole, isLoggedIn, isAuthReady } = useContext(AuthContext);
    const isAdmin = userRole === 'admin';

    const [allResources, setAllResources] = useState([]);
    const [filteredResources, setFilteredResources] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isAddFormVisible, setAddFormVisible] = useState(false);

    // Fetch all resources once on component mount
    useEffect(() => {
        const fetchResources = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/resources`);
                const data = response.data.data || [];
                setAllResources(Array.isArray(data) ? data : []);
            } catch (err) {
                setError('Failed to load resources. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        if (isAuthReady) {
            fetchResources();
        }
    }, [isAuthReady]);

    // This effect handles filtering and searching whenever the source data or filters change
    useEffect(() => {
        let results = allResources;

        if (searchTerm) {
            results = results.filter(r => 
                r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                r.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (activeFilter !== 'All') {
            results = results.filter(r => r.access_level === activeFilter);
        }
        
        setFilteredResources(results);
    }, [searchTerm, activeFilter, allResources]);

    const handleDownload = (resource) => {
        const isMemberOrAdmin = userRole === 'admin' || userRole === 'member';
        if (resource.access_level === 'Members Only' && !isMemberOrAdmin) {
            toast.success('This resource is for members only. Please log in to download.');
            return;
        }
        window.open(`${STATIC_ASSETS_BASE_URL}${resource.file_url}`, '_blank');
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        try {
            await axios.delete(`${API_BASE_URL}/resources/${itemToDelete.resource_id}`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
            setAllResources(prev => prev.filter(r => r.resource_id !== itemToDelete.resource_id));
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete resource.");
        } finally {
            setItemToDelete(null);
        }
    };
    
    const handleResourceAdded = (newResource) => {
        setAllResources(prev => [newResource, ...prev]);
        setAddFormVisible(false);
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => <ResourceCardSkeleton key={i} />)}
                </div>
            );
        }
        if (error) return <p className="text-center text-red-600 py-10">{error}</p>;
        if (filteredResources.length === 0) {
            return (
                <div className="text-center py-16 px-6 bg-gray-50 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-800">No Resources Found</h3>
                    <p className="mt-2 text-gray-600">
                        {searchTerm ? "Try adjusting your search or filter criteria." : "There are no resources matching the current filter."}
                    </p>
                </div>
            );
        }
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredResources.map(resource => (
                    <ResourceCard key={resource.resource_id} resource={resource} onDownload={handleDownload} onDelete={setItemToDelete} isAdmin={isAdmin} />
                ))}
            </div>
        );
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 py-20 px-4 text-white text-center">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold">Academic Resources</h1>
                <p className="mt-4 text-lg sm:text-xl text-blue-200 max-w-3xl mx-auto">
                    A curated library of research papers, educational materials, and professional guides to support your work.
                </p>
            </section>

            <div className="max-w-7xl mx-auto space-y-12 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
                {/* Admin "Add Resource" Accordion */}
                {isAdmin && (
                     <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                        <button
                            onClick={() => setAddFormVisible(!isAddFormVisible)}
                            className="w-full p-4 flex justify-between items-center text-left text-xl font-bold text-blue-900 hover:bg-gray-50 rounded-t-xl"
                        >
                            <span><PlusCircle className="inline-block mr-3 h-7 w-7 text-green-500" />Add New Resource</span>
                            <ChevronDown className={`h-6 w-6 transition-transform duration-300 ${isAddFormVisible ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {isAddFormVisible && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                    <div className="p-6 border-t border-gray-200"><AddResource onResourceAdded={handleResourceAdded} /></div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
                
                {/* Main Content: Filters and Resource List */}
                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl border border-gray-200">
                    {/* Filter and Search Controls */}
                    <div className="flex flex-col md:flex-row gap-4 mb-8 pb-6 border-b border-gray-200">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search resources by title or description..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="flex-shrink-0 flex items-center gap-2">
                            {['All', 'Free', 'Members Only'].map(filter => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                                        activeFilter === filter ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>
                    {renderContent()}
                </div>
            </div>
            {itemToDelete && (
            <ConfirmModal show={!!itemToDelete} title="Confirm Deletion" message={`Are you sure you want to delete "${itemToDelete?.title}"?`} onConfirm={handleDelete} onCancel={() => setItemToDelete(null)} />
            )}
        </div>
    );
};

export default ResourcesPage;