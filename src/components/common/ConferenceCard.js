// src/components/common/ConferenceCard.js

import React from 'react';
import ImageContainer from './ImageContainer';
import { CalendarIcon } from './icons/CalendarIcon';
import { LocationIcon } from './icons/LocationIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { truncateHTML, STATIC_ASSETS_BASE_URL } from '../../utils/constants';

/**
 * Main reusable card component for displaying conference information.
 */
const ConferenceCard = ({ conference, onViewDetails }) => {
    if (!conference) return null;

    const conferenceId = conference.id || conference.conference_id;
    const { title, date, location, description, image_url } = conference;
    const fullImageSrc = image_url ? `${STATIC_ASSETS_BASE_URL}${image_url}` : null;

    return (
        <div
            onClick={() => onViewDetails(conferenceId)}
            className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden flex flex-col h-full border border-gray-200 group cursor-pointer"
        >
            <ImageContainer
                src={fullImageSrc}
                alt={title || 'Conference image'}
                fallbackText="EMPA Event"
            />
            <div className="p-6 flex-grow flex flex-col">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-blue-900 mb-2 leading-tight group-hover:text-blue-700 transition-colors">
                        {title || 'Untitled Conference'}
                    </h3>
                    <div className="flex flex-wrap items-center text-sm text-gray-600 mb-4 gap-x-4 gap-y-1">
                        {date && (
                            <div className="flex items-center">
                                <CalendarIcon className="w-4 h-4 mr-1.5 text-gray-500" />
                                <span>{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                        )}
                        {location && (
                            <div className="flex items-center">
                                <LocationIcon className="w-4 h-4 mr-1.5 text-gray-500" />
                                <span>{location}</span>
                            </div>
                        )}
                    </div>
                    {description && (
                        <div
                            className="text-gray-700 text-base leading-relaxed line-clamp-3 prose max-w-none"
                            dangerouslySetInnerHTML={{ __html: truncateHTML(description, 120) }}
                        />
                    )}
                </div>
                <div className="pt-4 mt-auto">
                    <span className="inline-flex items-center gap-2 text-blue-600 font-semibold text-base group-hover:text-blue-800 transition-colors">
                        View Details
                        <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </span>
                </div>
            </div>
        </div>
    );
};


/**
 * A skeleton loader component to provide a better loading experience for ConferenceCards.
 * FIX: Added the 'export' keyword to make it a named export.
 */
export const ConferenceCardSkeleton = () => (
    <div className="flex flex-col rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="w-full aspect-video bg-gray-300"></div>
      <div className="flex-1 bg-white p-6">
        <div className="h-6 w-3/4 bg-gray-300 rounded mb-4"></div>
        <div className="h-4 w-1/2 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
      </div>
    </div>
);


export default ConferenceCard;