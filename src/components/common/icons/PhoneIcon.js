import React from 'react';

// Standard Phone Icon component using SVG
export const PhoneIcon = (props) => (
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
      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25V14.25a2.25 2.25 0 00-2.25-2.25h-1.35a2.25 2.25 0 00-2.25 2.25v3.625a2.25 2.25 0 01-1.11 1.968c-.482.287-1.033.428-1.6.428-.567 0-1.118-.141-1.6-.428a2.25 2.25 0 01-1.11-1.968v-3.625a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v1.35a2.25 2.25 0 002.25 2.25h1.35c.567 0 1.118.141 1.6.428s.867.76 1.11 1.968a2.25 2.25 0 011.11 1.968v-3.625a2.25 2.25 0 002.25-2.25v-1.35a2.25 2.25 0 002.25-2.25H21.75"
    />
  </svg>
);
