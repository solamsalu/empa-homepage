// src/utils/constants.js

/**
 * URLs
 * .replace(/\/$/, '') ensures that if you accidentally add a slash in the .env file, 
 * it gets removed. This prevents the "double-slash" bug (e.g., https://api.com//v1)
 */
export const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1').replace(/\/$/, '');

export const STATIC_ASSETS_BASE_URL = (process.env.REACT_APP_STATIC_ASSETS_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

/**
 * JWT DECODER
 * A more robust version that handles Unicode characters safely.
 * Useful for Ethiopian names or mathematical symbols in the JWT payload.
 */
export const safeJwtDecode = (token) => {
    if (!token || typeof token !== 'string' || !token.includes('.')) return {};
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
            console.error("JWT Decode Error:", e);
        }
        return {};
    }
};

/**
 * HTML TRUNCATOR
 * Optimized for Rich Text (ReactQuill abstracts).
 * Uses a safer approach to strip tags and handles environment checks.
 */
export const truncateHTML = (htmlString, limit = 150) => {
    if (!htmlString) return "";

    // 1. Remove HTML tags using Regex (Faster than creating a DOM element for short strings)
    let textContent = htmlString.replace(/<[^>]*>?/gm, ' ');

    // 2. Clean up multiple spaces and entities
    textContent = textContent.replace(/&nbsp;/g, ' ').replace(/\s\s+/g, ' ').trim();

    if (textContent.length <= limit) return textContent;
    
    return textContent.substring(0, limit) + "...";
};

/**
 * HELPER: Asset URL Resolver
 * Use this in your components to prevent broken images/PDFs
 */
export const resolveAssetUrl = (path) => {
    if (!path) return "";
    if (path.startsWith('http')) return path;
    // Ensures there is exactly one slash between the base and the path
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${STATIC_ASSETS_BASE_URL}${cleanPath}`;
};

// export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1';

// export const STATIC_ASSETS_BASE_URL = process.env.REACT_APP_STATIC_ASSETS_BASE_URL || 'http://localhost:5000';

// export const safeJwtDecode = (token) => {
//     try {
//         const base64Url = token.split('.')[1];
//         const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//         const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
//             return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//         }).join(''));
//         return JSON.parse(jsonPayload);
//     } catch (e) {
//         console.error("Failed to decode JWT:", e);
//         return {};
//     }
// };

// export const truncateHTML = (htmlString, limit) => {
//     const tempDiv = document.createElement("div");
//     tempDiv.innerHTML = htmlString;
//     let textContent = tempDiv.textContent || tempDiv.innerText;
//     if (textContent.length > limit) {
//         textContent = textContent.substring(0, limit) + "...";
//     }
//     return textContent;
// };
