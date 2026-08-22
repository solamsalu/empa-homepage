// src/components/common/ImageContainer.js

import React from 'react';

/**
 * A professional, reusable image container that solves aspect ratio and fitting issues.
 * It creates a shaped "frame" and ensures the image fills it without distortion.
 *
 * @param {string} src - The source URL for the image.
 * @param {string} alt - The alt text for accessibility.
 * @param {string} [className='aspect-video'] - Tailwind CSS classes to control the container's shape and other styles.
 *   Examples: 'aspect-video' (16:9), 'aspect-square' (1:1), 'h-48' (fixed height).
 * @param {string} [imageClassName=''] - Optional classes to apply directly to the <img> tag if needed.
 */
const ImageContainer = ({ src, alt, className = 'aspect-video', imageClassName = '' }) => {
  // Default classes for the container: enforces shape, hides overflow for rounded corners.
  const containerClasses = `w-full bg-gray-200 overflow-hidden ${className}`;

  // Default classes for the image: ensures it fills the container and crops correctly.
  const imgClasses = `w-full h-full object-cover object-center transition-transform duration-300 ease-in-out group-hover:scale-105 ${imageClassName}`;

  return (
    <div className={containerClasses}>
      <img
        src={src}
        alt={alt}
        className={imgClasses}
        // Fallback for broken images, displays a clean placeholder.
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = `https://placehold.co/600x400/e2e8f0/475569?text=Image+Not+Found`;
        }}
      />
    </div>
  );
};

export default ImageContainer;