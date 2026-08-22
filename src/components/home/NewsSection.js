
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/constants';
import PrimaryButton from '../common/PrimaryButton';
import { ArrowRightIcon } from '../common/icons/ArrowRightIcon';

// Import our new, reusable components
import NewsCard, { NewsCardSkeleton } from '../common/NewsCard';

/**
 * A modern, professional, and comprehensive NewsSection component.
 * It displays the latest news items on the homepage, handles loading and error states gracefully,
 * and uses reusable components for a clean and maintainable structure.
 */
const NewsSection = () => {
    const navigate = useNavigate();

    const [fetchedNews, setFetchedNews] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLatestNews = async () => {
            setIsLoading(true);
            setErrorMessage('');
            try {
                const response = await axios.get(`${API_BASE_URL}/news`);
                const data = response.data.data || response.data;

                const sortedNews = Array.isArray(data)
                    ? data.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4)
                    : [];

                setFetchedNews(sortedNews);
            } catch (error) {
                console.error('Failed to fetch news for homepage:', error.response?.data || error.message);
                setErrorMessage(error.response?.data?.message || 'Error loading latest news. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchLatestNews();
    }, []);

    const handleViewNewsDetail = (newsId) => {
        navigate(`/news/${newsId}`);
    };

    const handleSeeMoreNews = () => {
        navigate('/news');
    };

    /**
     * Renders the main content grid, handling loading, error, and data states.
     */
    const renderContent = () => {
        if (isLoading) {
            // Display skeleton loaders to prevent layout shift and improve perceived performance
            return (
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
                    {[...Array(4)].map((_, index) => (
                        <NewsCardSkeleton key={index} />
                    ))}
                </div>
            );
        }

        if (errorMessage) {
            return <p className="text-red-600 text-center mt-12">{errorMessage}</p>;
        }

        if (fetchedNews.length === 0) {
            return <p className="text-gray-600 text-center mt-12">No news available at the moment.</p>;
        }

        return (
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
                {fetchedNews.map((item) => (
                    <NewsCard key={item.news_id} item={item} onReadMore={handleViewNewsDetail} />
                ))}
            </div>
        );
    };

    return (
        <section id="news-section" className="bg-white py-20 sm:py-28 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-blue-900">Latest News & Updates</h2>
                    <p className="mt-4 text-lg text-gray-600">Stay informed about our community's developments.</p>
                </div>

                {renderContent()}
                
                {/* "See More News" button - only show if there wasn't a major error */}
                {!errorMessage && (
                    <div className="text-center mt-16">
                        <PrimaryButton onClick={handleSeeMoreNews}>
                            See More News <ArrowRightIcon />
                        </PrimaryButton>
                    </div>
                )}
            </div>
        </section>
    );
};

export default NewsSection;