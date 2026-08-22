
import React from 'react';
import { CalendarIcon } from './icons/CalendarIcon';
import ImageContainer from './ImageContainer';
import { STATIC_ASSETS_BASE_URL, truncateHTML } from '../../utils/constants';

/**
 * A modern, professional, and reusable card component for displaying news items.
 * It supports a standard layout and a larger "featured" layout variant.
 * @param {object} item - The news item object.
 * @param {function} onReadMore - The function to call when the card is clicked.
 * @param {boolean} [isFeatured=false] - If true, renders the card in a prominent, horizontal layout.
 */
const NewsCard = ({ item, onReadMore, isFeatured = false }) => {
  // Defensive check for item
  if (!item) return null;

  // --- 1. FEATURED CARD LAYOUT ---
  if (isFeatured) {
    return (
      <div 
        onClick={() => onReadMore(item.news_id)} 
        className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 group cursor-pointer overflow-hidden"
      >
        {/* The ImageContainer takes up the left column */}
        <ImageContainer 
          src={item.image_url ? `${STATIC_ASSETS_BASE_URL}${item.image_url}` : null} 
          alt={item.title || 'Featured news story'} 
          className="aspect-video h-full" // Ensure it fills the height of the grid cell
          fallbackText="EMPA News" 
        />
        {/* The content takes up the right column */}
        <div className="p-6 sm:p-8">
          <div className="text-sm text-gray-500 flex items-center mb-2">
            <CalendarIcon className="w-4 h-4 mr-2" />
            <time dateTime={item.date}>{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          </div>
          <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
            {item.title}
          </h3>
          {/* Show more content for the featured article */}
          <div 
            className="mt-3 text-base text-gray-600 line-clamp-4 prose max-w-none" 
            dangerouslySetInnerHTML={{ __html: truncateHTML(item.content, 300) }} 
          />
          <div className="mt-6">
            <span className="font-semibold text-amber-600 text-lg group-hover:text-amber-500">
              Read full story →
            </span>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. STANDARD CARD LAYOUT (Your existing excellent card) ---
  return (
    <div
      onClick={() => onReadMore(item.news_id)}
      className="flex flex-col rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden group cursor-pointer bg-white h-full"
    >
      <ImageContainer
        src={item.image_url ? `${STATIC_ASSETS_BASE_URL}${item.image_url}` : null}
        alt={item.image_alt_text || `News image for ${item.title}`}
        fallbackText="EMPA News"
      />
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div className="flex-1">
          <div className="text-sm text-gray-500 flex items-center space-x-1 mb-2">
            <CalendarIcon className="w-4 h-4" />
            <time dateTime={item.date}>{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-200 line-clamp-2">
            {item.title}
          </h3>
          <div
            className="mt-3 text-base text-gray-600 prose max-w-none line-clamp-3"
            dangerouslySetInnerHTML={{ __html: truncateHTML(item.content, 150) }}
          />
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="text-base font-semibold text-amber-600 group-hover:text-amber-500 transition-colors duration-200">
            Read more →
          </span>
        </div>
      </div>
    </div>
  );
};

// --- 3. UPDATED SKELETON COMPONENT ---
export const NewsCardSkeleton = ({ isFeatured = false }) => {
    // Skeleton for the featured layout
    if (isFeatured) {
        return (
            <div className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-lg shadow-lg animate-pulse">
                <div className="w-full aspect-video bg-gray-300 rounded-l-lg"></div>
                <div className="p-6 sm:p-8">
                    <div className="h-4 w-1/3 bg-gray-300 rounded mb-4"></div>
                    <div className="h-8 w-full bg-gray-300 rounded mb-3"></div>
                    <div className="h-4 w-full bg-gray-200 rounded mt-4"></div>
                    <div className="h-4 w-full bg-gray-200 rounded mt-2"></div>
                    <div className="h-4 w-2/3 bg-gray-200 rounded mt-2"></div>
                </div>
            </div>
        );
    }

    // Skeleton for the standard layout
    return (
      <div className="flex flex-col rounded-lg shadow-md overflow-hidden animate-pulse bg-white">
        <div className="w-full aspect-video bg-gray-300"></div>
        <div className="flex-1 bg-white p-6">
          <div className="h-4 w-1/3 bg-gray-300 rounded mb-4"></div>
          <div className="h-6 w-full bg-gray-300 rounded mb-2"></div>
          <div className="mt-4 space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
};

export default NewsCard;