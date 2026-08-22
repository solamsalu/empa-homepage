import React from 'react';

// Standard Globe Alt Icon component using SVG
export const GlobeAltIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    {...props} // Allows passing Tailwind classes like 'w-6 h-6'
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 21l-6-6m0 0l6-6m-6 6h12m6 0l-6 6m0 0l6-6m-6 6a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
