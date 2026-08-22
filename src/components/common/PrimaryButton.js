
import React from 'react';

const PrimaryButton = ({ href, children, className = "", onClick, type, disabled }) => {
    // Modify this line: If type is 'submit', it *must* render a button.
    // Otherwise, use the original logic (render button if onClick is provided and no href, else render anchor).
    const shouldRenderButton = (type === "submit") || (onClick && (href === "javascript:void(0);" || !href));

    if (shouldRenderButton) {
        return (
            <button
                onClick={onClick} // Keep onClick here, as it might be used for other button types (like "button")
                className={`
                    inline-flex items-center justify-center gap-2 
                    bg-blue-800 text-white font-semibold text-base px-6 py-3 rounded-md
                    hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    transition-colors duration-200 shadow-md transform hover:scale-105
                    ${className}
                `}
                type={type || "button"} // Default to "button" if type isn't explicitly provided
                disabled={disabled}
            >
                {children} 
            </button>
        );
    }
    return (
        <a
            href={href || "#"} 
            onClick={onClick} // Keep onClick for anchor too if needed, though less common for anchors
            className={`
                inline-flex items-center justify-center gap-2 
                bg-blue-800 text-white font-semibold text-base px-6 py-3 rounded-md
                hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                transition-colors duration-200 shadow-md transform hover:scale-105
                ${className}
            `}
        >
            {children}
        </a>
    );
};

export default PrimaryButton;