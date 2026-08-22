import React from 'react';

// Standard Facebook Icon component using SVG
export const FacebookIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    {...props} // Allows passing Tailwind classes like 'w-5 h-5'
  >
    <path d="M12 2C6.477 2 2 6.477 2 12c0 5.011 3.657 9.121 8.441 9.876V14.62H8.082V12h2.359V9.75c0-2.316 1.41-3.582 3.48-3.582 1.026 0 1.913.077 2.169.111V8.4h-1.291c-1.144 0-1.365.544-1.365 1.34V12h2.691l-.441 2.62h-2.25V21.876C18.343 21.121 22 17.011 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);
