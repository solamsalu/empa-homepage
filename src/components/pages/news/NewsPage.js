import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { API_BASE_URL } from '../../../utils/constants';
import { Trash2, PlusCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '../../common/ConfirmModal';
import axios from 'axios';
import AddNews from './AddNews';
import NewsCard, { NewsCardSkeleton } from '../../common/NewsCard';

/**
 * A modern, professional NewsList component with a featured article layout.
 */
const NewsList = ({ onNewsUpdated }) => {
    const navigate = useNavigate();
   // const { userRole, isAuthReady, authToken } = useContext(AuthContext);
   const { userRole, isAuthReady, authToken } = useContext(AuthContext); 
   const isAdmin = userRole === 'admin';

    const [news, setNews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemToDelete, setItemToDelete] = useState(null);

    const newsPerPage = 7; // 1 featured + 6 regular

    useEffect(() => {
        const fetchNews = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/news`);
                const data = response.data.data || [];
                setNews(Array.isArray(data) ? data.sort((a, b) => new Date(b.date) - new Date(a.date)) : []);
            } catch (error) {
                setErrorMessage('Error fetching news. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        if (isAuthReady) {
            fetchNews();
        }
    }, [isAuthReady, onNewsUpdated]);

    const handleDeleteConfirmed = async () => {
        if (!itemToDelete) return;
        try {
            await axios.delete(`${API_BASE_URL}/news/${itemToDelete.news_id}`, { headers: { 'Authorization': `Bearer ${authToken}` } });
            setNews(prev => prev.filter(item => item.news_id !== itemToDelete.news_id));
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Error deleting news item.');
        } finally {
            setItemToDelete(null);
        }
    };

    const handleViewNewsDetail = (newsId) => navigate(`/news/${newsId}`);

    // --- Pagination Logic ---
    const featuredArticle = news.length > 0 ? news[0] : null;
    const regularArticles = news.length > 1 ? news.slice(1) : [];
    const indexOfLastRegular = currentPage * newsPerPage - 1;
    const indexOfFirstRegular = indexOfLastRegular - (newsPerPage - 1);
    const currentRegularNews = regularArticles.slice(indexOfFirstRegular, indexOfLastRegular);
    const totalPages = Math.ceil(regularArticles.length / (newsPerPage - 1));

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };


    const renderContent = () => {
        if (isLoading) {
            return (
                <div>
                    {/* Skeleton for Featured Article */}
                    <div className="mb-12"><NewsCardSkeleton isFeatured={true} /></div>
                    {/* Skeletons for Regular Articles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, index) => <NewsCardSkeleton key={index} />)}
                    </div>
                </div>
            );
        }
        if (errorMessage) return <p className="text-center text-red-600 py-10">{errorMessage}</p>;
        if (!featuredArticle) return <p className="text-center text-gray-600 py-10">No news articles have been published yet.</p>;

        return (
            <div>
                {/* Featured Article Section */}
                <div className="mb-12 relative">
                    <h2 className="text-2xl font-bold text-blue-800 mb-4 border-b-2 border-amber-400 pb-2">Featured Story</h2>
                    <NewsCard item={featuredArticle} onReadMore={() => handleViewNewsDetail(featuredArticle.news_id)} isFeatured={true} />
                    {isAdmin && (
                        <button onClick={() => setItemToDelete(featuredArticle)} className="absolute top-14 right-2 p-2 bg-red-600 text-white rounded-full shadow-lg z-10"><Trash2 size={20} /></button>
                    )}
                </div>

                {/* Regular Articles Grid */}
                {currentRegularNews.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {currentRegularNews.map((item) => (
                            <div key={item.news_id} className="relative">
                                <NewsCard item={item} onReadMore={() => handleViewNewsDetail(item.news_id)} />
                                {isAdmin && (
                                    <button onClick={() => setItemToDelete(item)} className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full shadow-lg z-10"><Trash2 size={18} /></button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-gray-200">
            {renderContent()}
            {totalPages > 1 && !isLoading && (
                <div className="flex justify-center mt-12 space-x-2">
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50">Previous</button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button key={i + 1} onClick={() => paginate(i + 1)} className={`px-4 py-2 rounded-md ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border'}`}>{i + 1}</button>
                    ))}
                    <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50">Next</button>
                </div>
            )}
            {itemToDelete && (
                <ConfirmModal 
                    title="Confirm Deletion" 
                    message={`Are you sure you want to delete "${itemToDelete.title}"?`} 
                    onConfirm={handleDeleteConfirmed} 
                    onCancel={() => setItemToDelete(null)} 
                />
            )}
            {/* ConfirmModal show={!!itemToDelete} title="Confirm Deletion" message={`Are you sure you want to delete "${itemToDelete?.title}"?`} onConfirm={handleDeleteConfirmed} onCancel={() => setItemToDelete(null)} /> */}
        </div>
    );
};

/**
 * The main container component for the entire News page.
 */
const NewsPage = () => {
    const { userRole, isAuthReady } = useContext(AuthContext);
    const [updateTrigger, setUpdateTrigger] = useState(0);
    const [isAddNewsVisible, setIsAddNewsVisible] = useState(false);

    const handleNewsUpdate = () => {
        setUpdateTrigger(prev => prev + 1);
        setIsAddNewsVisible(false); // Close the form after successful submission
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <section className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 py-20 px-4 text-white text-center">
                <div className="max-w-4xl mx-auto z-10 relative">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold">News & Updates</h1>
                    <p className="mt-4 text-lg sm:text-xl text-blue-200">Stay informed about our community's developments and announcements.</p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto space-y-12 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
                {isAuthReady && userRole === 'admin' && (
                    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
                        <button
                            onClick={() => setIsAddNewsVisible(!isAddNewsVisible)}
                            className="w-full p-4 flex justify-between items-center text-left text-xl font-bold text-blue-900 hover:bg-gray-50 rounded-t-lg"
                        >
                            <span><PlusCircle className="inline-block mr-3 h-7 w-7 text-green-500" />Add New News Item</span>
                            <ChevronDown className={`h-6 w-6 transition-transform duration-300 ${isAddNewsVisible ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {isAddNewsVisible && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-6 border-t border-gray-200">
                                        <AddNews onNewsAdded={handleNewsUpdate} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {isAuthReady ? (
                    <NewsList key={updateTrigger} onNewsUpdated={handleNewsUpdate} />
                ) : (
                    <div className="text-center py-20"><p className="text-xl text-blue-700">Initializing News Page...</p></div>
                )}
            </div>
        </div>
    );
};

export default NewsPage;