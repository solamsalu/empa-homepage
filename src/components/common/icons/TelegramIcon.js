import React from 'react';

// Standard Telegram Icon component using SVG
export const TelegramIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    {...props} // Allows passing Tailwind classes like 'w-5 h-5'
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.21 8.48-3.6 1.39-1.39 3.6c-.22.56-.84.72-1.39.46-.55-.26-.7-.88-.44-1.42l.83-2.12c.07-.17.07-.36 0-.53l-.83-2.12c-.26-.54-.1-1.16.44-1.42.55-.26 1.17-.1 1.39.44l3.6 1.39c.56.22.72.84.46 1.39-.26.55-.88.7-1.42.44z" />
  </svg>
);
