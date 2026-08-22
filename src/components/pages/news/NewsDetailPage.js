
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import PrimaryButton from '../../common/PrimaryButton';
import { BackArrowIcon } from '../../common/icons/BackArrowIcon';
import { API_BASE_URL, STATIC_ASSETS_BASE_URL } from '../../../utils/constants';

/**
 * NewsDetailPage Component
 * Displays the detailed information for a single news item based on the newsId from the URL.
 */
const NewsDetailPage = () => {
    // useParams hook extracts the newsId from the URL path, e.g., /news/123 -> newsId = "123"
    const { newsId } = useParams();
    // useNavigate hook provides a function for programmatic navigation
    const navigate = useNavigate();

    // State to hold the fetched news item data
    const [newsItem, setNewsItem] = useState(null);
    // State to hold associated images
    const [images, setImages] = useState([]);
    // State to indicate if data is currently being loaded
    const [loading, setLoading] = useState(true);
    // State to hold any error messages during data fetching
    const [error, setError] = useState(null);
    // State for the lightbox image URL
    const [lightboxImage, setLightboxImage] = useState(null);
    // State for zoom level in the lightbox
    const [zoomLevel, setZoomLevel] = useState(1);

   

    // Effect hook to fetch news details when the component mounts or newsId changes
    useEffect(() => {
        // Clear any previous errors or news item data when starting a new fetch
        setError(null);
        setNewsItem(null);
        setImages([]);

        // Validate if newsId is present in the URL
        if (!newsId) {
            setError("No news ID provided. Cannot fetch news details.");
            setLoading(false);
            return; // Exit early if no newsId
        }

        // Asynchronous function to fetch news data from the API
        const fetchNewsDetail = async () => {
            try {
                setLoading(true); // Set loading to true before starting the fetch
                // Construct the API URL using the base URL and the specific newsId
                // Using axios for the GET request
                const response = await axios.get(`${API_BASE_URL}/news/${newsId}`);

                // Axios wraps the response data in the 'data' property
                const data = response.data;
                
                if (data.news) { // Assuming your backend returns { success: true, news: {...}, images: [...] }
                    setNewsItem(data.news); // Update the news item state with the fetched data
                    setImages(data.images || []); // Update images state, default to empty array if no images
                } else {
                    // If 'news' key is missing in response data, throw an error
                    throw new Error('News item not found in response or unexpected data structure.');
                }
            } catch (err) {
                // Catch and log any errors during the fetch operation
                console.error('Failed to fetch news detail:', err.response?.data || err.message);
                // Set a user-friendly error message based on Axios error structure
                if (err.response && err.response.data && err.response.data.message) {
                    setError(`Error fetching news details: ${err.response.data.message}`);
                } else {
                    setError(`Error fetching news details: ${err.message}. Please try again later.`);
                }
            } finally {
                setLoading(false); // Set loading to false once the fetch operation completes (success or failure)
            }
        };

        fetchNewsDetail(); // Call the fetch function
    }, [newsId, API_BASE_URL]); // Re-run this effect whenever the newsId or API_BASE_URL changes

    /**
     * Toggles the lightbox display for an image. If the image is already
     * in the lightbox, it closes. Otherwise, it opens it with the new image.
     * @param {string} imageUrl - The URL of the image to display in the lightbox.
     */
    const toggleImageSize = (imageUrl) => {
        if (lightboxImage === imageUrl && zoomLevel === 1) {
            setLightboxImage(null); // Close lightbox if same image is clicked and not zoomed
            setZoomLevel(1); // Reset zoom
        } else {
            setLightboxImage(imageUrl); // Open lightbox with new image
            setZoomLevel(1); // Reset zoom for new image
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <p className="text-xl text-gray-700 animate-pulse">Loading news details...</p>
            </div>
        );
    }

    // Show an error message if fetching failed
    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
                <p className="text-2xl text-red-600 font-semibold mb-6">{error}</p>
                {/* Button to navigate back to the news list using useNavigate */}
                <PrimaryButton
                    onClick={() => navigate('/news')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
                >
                    <BackArrowIcon className="inline-block mr-2" /> Back to News
                </PrimaryButton>
            </div>
        );
    }

    // Show a "not found" message if no news item data is available after loading
    if (!newsItem) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
                <p className="text-2xl text-gray-700 font-semibold mb-6">News item not found.</p>
                {/* Button to navigate back to the news list using useNavigate */}
                <PrimaryButton
                    onClick={() => navigate('/news')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
                >
                    <BackArrowIcon className="inline-block mr-2" /> Back to News
                </PrimaryButton>
            </div>
        );
    }

    // Format the news item date for better readability
    const formattedDate = newsItem.date
        ? new Date(newsItem.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })
        : 'Unknown Date';

    // --- Main News Detail Layout ---
    return (
        <div className="bg-gray-100 min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-gray-200">
                {/* Back button, styled for a modern look */}
                <button
                    onClick={() => navigate('/news')} // Programmatic navigation to the news list
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-8 transition-colors duration-200
                               transform hover:-translate-x-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                    aria-label="Back to all news"
                >
                    <BackArrowIcon className="w-5 h-5 mr-2" /> Back to All News
                </button>

                {/* News Title */}
                <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-4 leading-tight border-b pb-4 border-gray-200">
                    {newsItem.title}
                </h1>
                {/* Publication Date and Author */}
                <p className="text-sm text-gray-600 mb-6">
                    Published on <time dateTime={newsItem.date}>{formattedDate}</time> by {newsItem.author || 'Unknown Author'}
                </p>

                {/* Image Gallery Section */}
                <section className="space-y-6 mb-8">
                    {images.length > 0 ? (
                        images.map((image, index) => (
                            <figure key={index} className="news-detail-image-container flex flex-col items-center">
                                <img
                                    alt={image.image_alt_text || `News image ${index + 1}`}
                                    className="w-full h-auto object-cover rounded-lg shadow-md max-h-[500px] cursor-pointer
                                               transition-transform duration-200 hover:scale-[1.02]"
                                    src={`${STATIC_ASSETS_BASE_URL}${image.image_url}`} // Use ASSET_BASE_URL for images
                                    onClick={() => toggleImageSize(`${STATIC_ASSETS_BASE_URL}${image.image_url}`)} // Use ASSET_BASE_URL for lightbox
                                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x450/cccccc/333333?text=Image+Not+Found"; }}
                                />
                                {image.comment && <figcaption className="text-center text-gray-500 text-sm mt-2">{image.comment}</figcaption>}
                            </figure>
                        ))
                    ) : (
                        <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg border border-gray-300">
                            <p className="text-lg">No images available for this news item.</p>
                        </div>
                    )}
                </section>

                {/* News Content Section */}
                <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed mb-8 p-4 bg-gray-50 rounded-md border border-gray-100">
                    {newsItem.content ? (
                        // Render HTML content safely if present
                        <div dangerouslySetInnerHTML={{ __html: newsItem.content }}></div>
                    ) : (
                        <p className="italic text-gray-600">No content available for this news item.</p>
                    )}
                </div>

            </div>

            {/* Lightbox with Zoom Controls (Conditionally Rendered) */}
            {lightboxImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                    onClick={() => {
                        setLightboxImage(null); // Close lightbox on background click
                        setZoomLevel(1); // Reset zoom
                    }}
                >
                    <div
                        className="relative bg-white rounded-lg p-2 max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
                        onClick={(e) => e.stopPropagation()} // Prevent closing lightbox when clicking image container
                    >
                        <img
                            src={lightboxImage}
                            alt="Full-size view"
                            className="block max-w-full max-h-[calc(90vh-80px)] object-contain transition-transform duration-100 ease-out"
                            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
                            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x450/cccccc/333333?text=Image+Not+Found"; }}
                        />
                        {/* Zoom controls for the lightbox image */}
                        <div className="flex justify-center space-x-3 p-4 bg-gray-100 rounded-b-lg mt-auto">
                            <button
                                onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.1))}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                            >
                                Zoom Out
                            </button>
                            {/* Max zoom level comment moved to a separate line above the button */}
                            <button
                                onClick={() => setZoomLevel(prev => Math.min(3.0, prev + 0.1))}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                            >
                                Zoom In
                            </button>
                            <button
                                onClick={() => setZoomLevel(1)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors duration-200"
                            >
                                Reset Zoom
                            </button>
                        </div>
                    </div>
                    {/* Close button for the lightbox */}
                    <button
                        className="absolute top-4 right-4 text-white text-3xl font-bold p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 focus:outline-none"
                        onClick={() => {
                            setLightboxImage(null); // Close lightbox
                            setZoomLevel(1); // Reset zoom
                        }}
                        aria-label="Close image lightbox"
                    >
                        &times;
                    </button>
                </div>
            )}
        </div>
    );
};

export default NewsDetailPage;
