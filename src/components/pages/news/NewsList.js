import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for programmatic navigation
import axios from 'axios'; // Import axios
import { safeJwtDecode, truncateHTML } from '../../../utils/constants'; // Keep these imports
import PrimaryButton from '../../common/PrimaryButton';
import { CalendarIcon } from '../../common/icons/CalendarIcon';
import { API_BASE_URL, STATIC_ASSETS_BASE_URL } from '../../../utils/constants';

/**
 * NewsList Component
 * Displays a paginated list of news items, with options for viewing details
 * and (for admins) deleting items. Features a lightbox for images.
 */
const NewsList = () => {
    // useNavigate hook for programmatic navigation within the component
    const navigate = useNavigate();

    const [news, setNews] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [userRole, setUserRole] = useState('');
    const [lightboxImage, setLightboxImage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const newsPerPage = 6; // Number of news items to display per page

    // Effect to fetch news items and decode user role on component mount
    useEffect(() => {
        const fetchNews = async () => {
            try {
                // Use axios for fetching news
                const response = await axios.get(`${API_BASE_URL}/news`);
                // Axios wraps the response data in .data
                const data = response.data.data; // Assuming backend returns { success: true, data: [...] }

                // Sort news by date in descending order (newest first)
                const sortedNews = Array.isArray(data) ?
                    data.sort((a, b) => new Date(b.date) - new Date(a.date)) :
                    [];
                setNews(sortedNews);
                setErrorMessage(''); // Clear error on successful fetch
            } catch (error) {
                console.error('Failed to fetch news:', error.response?.data || error.message);
                setErrorMessage('Error fetching news. Please try again later.');
            }
        };

        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = safeJwtDecode(token);
                setUserRole(decodedToken.role);
            } catch (err) {
                console.error('Failed to decode token:', err);
                setUserRole(''); // Clear role if token is invalid or decoding fails
            }
        } else {
            setUserRole(''); // Ensure role is cleared if no token
        }

        fetchNews(); // Call the news fetching function
    }, [API_BASE_URL]); // Add API_BASE_URL to dependencies to re-run if it changes

    /**
     * Handles the deletion of a news item (admin functionality).
     * IMPORTANT: In a production environment, replace window.confirm with a custom modal UI.
     * @param {string} news_id - The ID of the news item to delete.
     */
    const handleDelete = async (news_id) => {
        if (!window.confirm("Are you sure you want to delete this news item?")) {
            return; // Exit if user cancels deletion
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setErrorMessage('Authentication required to delete news.');
            return;
        }

        try {
            // Use axios for deleting news, including authorization header
            const response = await axios.delete(`${API_BASE_URL}/news/${news_id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 204 || response.data.success) { // Assuming 204 No Content or success flag
                console.log('News deleted successfully');
                // Update the news list state by filtering out the deleted item
                setNews(news.filter((item) => item.news_id !== news_id));
                setErrorMessage(''); // Clear any previous errors
            } else {
                setErrorMessage(response.data.message || 'Failed to delete news.');
            }
        } catch (error) {
            console.error('Error deleting news:', error.response?.data || error.message);
            if (error.response?.status === 401 || error.response?.status === 403) {
                 setErrorMessage('You are not authorized to delete this news item or your session has expired.');
            } else {
                 setErrorMessage(error.response?.data?.message || 'Error deleting news. Please try again later.');
            }
        }
    };

    /**
     * Closes the image lightbox.
     */
    const closeLightbox = () => setLightboxImage(null);

    // Pagination logic: calculate indices and current items to display
    const indexOfLastNews = currentPage * newsPerPage;
    const indexOfFirstNews = indexOfLastNews - newsPerPage;
    const currentNews = news.slice(indexOfFirstNews, indexOfLastNews);
    const totalPages = Math.ceil(news.length / newsPerPage);

    /**
     * Handles pagination button clicks, updating the current page and scrolling to the top.
     * @param {number} page - The page number to navigate to.
     */
    const handleClick = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Smoothly scroll to the top of the page
    };

    /**
     * Handles navigation to a specific news detail page using React Router's navigate function.
     * @param {string} newsId - The ID of the news item to navigate to.
     */
    const handleViewNewsDetail = (newsId) => {
        navigate(`/news/${newsId}`); // Navigates to the news detail route
    };


    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            {/* Display error message if present */}
            {errorMessage && <p className="text-red-600 text-center mb-4">{errorMessage}</p>}

            {/* Grid layout for news cards */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-x-8 lg:gap-y-12">
                {currentNews.length > 0 ? (
                    currentNews.map((item) => (
                        <div key={item.news_id} className="bg-gray-50 rounded-lg shadow-md overflow-hidden flex flex-col transition-shadow duration-300 hover:shadow-xl">
                            {/* Image container, clickable to open lightbox */}
                            <div
                                onClick={() =>
                                    item.image_url && setLightboxImage(item.image_url) // Use item.image_url directly for lightbox
                                }
                                className="w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer"
                            >
                                {item.image_url ? ( // Check for item.image_url directly
                                    <img
                                        src={`${STATIC_ASSETS_BASE_URL}${item.image_url}`} 
                                        alt={item.image_alt_text || `Image for ${item.title}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x450/cccccc/333333?text=Image+Not+Found"; }}
                                    />
                                ) : (
                                    <img src="https://placehold.co/800x450/cccccc/333333?text=No+Image" alt="Default news" className="w-full h-full object-cover" />
                                )}
                            </div>

                            {/* News item content area */}
                            <div className="p-4 flex-grow">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-tight">{item.title}</h3>
                                {/* Date with Calendar Icon */}
                                <p className="text-sm text-gray-600 mb-3 flex items-center space-x-1">
                                    <CalendarIcon className="w-4 h-4" /> {/* Added class for consistent icon sizing */}
                                    <span>{new Date(item.date).toLocaleDateString()}</span>
                                </p>

                                {/* Truncated HTML content of the news item */}
                                <div
                                    className="text-gray-700 text-base leading-relaxed mb-4"
                                    dangerouslySetInnerHTML={{ __html: truncateHTML(item.content, 250) }}
                                ></div>

                                {/* "Read more" button now uses the navigate function */}
                                <button
                                    onClick={() => handleViewNewsDetail(item.news_id)}
                                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                                >
                                    Read more
                                    {/* SVG for arrow icon */}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>

                                {/* Admin-only delete button */}
                                {userRole === 'admin' && (
                                    <button
                                        onClick={() => handleDelete(item.news_id)}
                                        className="mt-3 ml-auto px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-600 py-10">No news found.</p>
                )}
            </div>

            {/* Pagination controls, visible only if there's more than one page */}
            {totalPages > 1 && (
                <div
                    className="flex justify-center mt-10 space-x-2"
                    aria-label="Pagination Navigation"
                >
                    <button
                        className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        disabled={currentPage === 1}
                        onClick={() => handleClick(currentPage - 1)}
                        aria-label="Previous Page"
                    >
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                                currentPage === index + 1
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                            }`}
                            onClick={() => handleClick(index + 1)}
                            aria-current={currentPage === index + 1 ? "page" : undefined}
                            aria-label={`Page ${index + 1}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        disabled={currentPage === totalPages}
                        onClick={() => handleClick(currentPage + 1)}
                        aria-label="Next Page"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Lightbox component for viewing images in full size */}
            {lightboxImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                    onClick={closeLightbox} // Close lightbox when clicking outside the image
                    role="dialog"
                    aria-modal="true"
                    aria-label="Image Lightbox"
                >
                    <img
                        src={`${STATIC_ASSETS_BASE_URL}${lightboxImage}`} 
                        alt="Full-size news view"
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()} // Prevent closing on image click itself
                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x450/cccccc/333333?text=Image+Not+Found"; }}
                    />
                    <button
                        className="absolute top-4 right-4 text-white text-3xl font-bold p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 focus:outline-none"
                        onClick={closeLightbox}
                        aria-label="Close Lightbox"
                    >
                        &times;
                    </button>
                </div>
            )}
        </div>
    );
};


/**
 * NewsPage Component
 * Main page component for displaying news, including a list of news items
 * and an admin section for adding new news.
 */
const NewsPage = () => {
    // Consume AuthContext for user role and authentication readiness
    const { userRole, isAuthReady } = useContext(AuthContext);
    const [updateTrigger, setUpdateTrigger] = useState(0); // State to force NewsList re-fetch

    // Debugging: Log the role whenever it changes or the component re-renders
    useEffect(() => {
        console.log('NewsPage: Current userRole from AuthContext:', userRole);
    }, [userRole]);

    // Function to re-fetch news data in NewsList when a new item is added or deleted
    const handleNewsUpdate = () => {
        console.log('NewsPage: handleNewsUpdate called. Triggering NewsList re-fetch.');
        setUpdateTrigger(prev => prev + 1); // Increment trigger to force NewsList useEffect re-run
    };

    // No longer need a separate storage listener here as AuthContext handles global auth changes

    return (
        <div className="bg-gray-100 min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-blue-900 leading-tight">Latest News & Updates</h2>
                    <p className="mt-4 text-lg text-gray-600">Stay informed about our community's developments and announcements.</p>
                </div>

                
                {isAuthReady ? (
                    <NewsList key={updateTrigger} onNewsUpdated={handleNewsUpdate} />
                ) : (
                    <div className="flex items-center justify-center min-h-60 bg-blue-50 rounded-lg shadow-md">
                        <p className="text-xl text-blue-700">Loading news list...</p>
                    </div>
                )}


                {/* Admin-only section for adding news */}
                {isAuthReady && userRole === 'admin' && (
                    <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-200 mt-12">
                        <h3 className="text-2xl font-bold text-blue-900 mb-6 text-center">Add New News Item (Admin Panel)</h3>
                        {/* Render the AddNews component, passing the callback */}
                        <AddNews onNewsAdded={handleNewsUpdate} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsPage;
