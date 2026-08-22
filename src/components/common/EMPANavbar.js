
import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';

// --- CENTRALIZED NAVIGATION LINKS ---
const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/news', label: 'News' },
    { path: '/journals', label: 'Journals' },
    { path: '/conferences', label: 'Conferences' },
    { path: '/olympiad', label: 'Olympiad' },
    { path: '/membership', label: 'Membership' },
    { path: '/resources', label: 'Resources' },
    { path: '/contact', label: 'Contact' },
];

/**
 * A final, robust, simplified, and syntactically correct Navbar.
 * It uses a static two-row layout and the CSS variable method for layout,
 * ensuring cross-browser compatibility and reliability.
 */
// --- THE FIX: The component definition is now a proper constant assignment using React.forwardRef ---
const EMPANavbar = React.forwardRef((props, ref) => {
    // We get onHeightChange from the props object
    const { onHeightChange } = props;
    
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isLoggedIn, userName, handleLogout } = useContext(AuthContext);

    // This effect reliably measures the navbar's height and sets a global CSS variable.
    useEffect(() => {
        const updateNavbarHeight = () => {
            if (ref && ref.current) {
                const height = ref.current.offsetHeight;
                document.documentElement.style.setProperty('--navbar-height', `${height}px`);
            }
        };

        const resizeObserver = new ResizeObserver(updateNavbarHeight);
        if (ref && ref.current) {
            resizeObserver.observe(ref.current);
        }
        
        updateNavbarHeight(); // Initial measurement
        return () => {
            if (ref && ref.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                resizeObserver.unobserve(ref.current);
            }
        };
    }, [ref, onHeightChange, isMobileMenuOpen]);

    const activeLinkStyle = useMemo(() => ({
        color: '#f59e0b',
        fontWeight: '700',
    }), []);

    const handleMenuClose = () => setIsMobileMenuOpen(false);
    
    const mobileMenuVariants = {
        open: { opacity: 1, height: 'auto', transition: { type: 'spring', stiffness: 300, damping: 30 } },
        closed: { opacity: 0, height: 0, transition: { duration: 0.3 } },
    };

    return (
        <header
            ref={ref} // Use the forwarded ref here
            className="fixed top-0 z-50 w-full bg-gradient-to-r from-[#1b2a41] via-[#1e3d59] to-[#2b4c6a] shadow-lg"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* TOP ROW: LOGO & AUTH */}
                <div className="flex items-center justify-between h-20">
                    <Link to="/" onClick={handleMenuClose} className="flex-shrink-0 flex items-center gap-x-3 group">
                        <img src="/images/header_logo.jpg" alt="EMPA Logo" className="h-14 w-14 object-contain" />
                        <div className="flex max-md:hidden flex-col leading-tight">
                            <h1 className="text-xl font-extrabold text-white">የኢትዮጵያ ማቲማቲክስ ባለሙያዎች ማህበር</h1>
                            <h2 className="text-sm font-semibold text-white/90">Ethiopian Mathematics Professionals Association</h2>
                        </div>
                    </Link>

                    {/* Desktop Auth Section -- FIX APPLIED HERE */}
                    <div className="flex max-md:hidden items-center gap-2">
                        {isLoggedIn ? (
                            <div className="flex items-center gap-4">
                                <span className="text-amber-400 font-bold text-sm whitespace-nowrap">Welcome, {userName}!</span>
                                <button onClick={handleLogout} className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-md text-sm transition-all whitespace-nowrap">Sign Out</button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="text-white font-semibold py-2 px-4 rounded-md hover:bg-white/10 text-sm whitespace-nowrap">Login</Link>
                                <Link to="/register" className="bg-amber-500 hover:bg-amber-400 text-white font-bold py-2 px-4 rounded-md shadow-md text-sm whitespace-nowrap">Join EMPA</Link>
                            </>
                        )}
                    </div>
                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(o => !o)} className="text-white p-2" aria-label="Toggle menu">
                            {isMobileMenuOpen ? 
                                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg> : 
                                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                            }
                        </button>
                    </div>
                </div>

                {/* BOTTOM ROW: MAIN NAVIGATION -- FIX APPLIED HERE */}
                <div className="flex max-md:hidden items-center justify-center h-12 border-t border-white/10">
                    <ul className="flex items-baseline space-x-2">
                        {navLinks.map(link => (
                            <li key={link.path}>
                                <NavLink to={link.path} style={({ isActive }) => isActive ? activeLinkStyle : {}} className="text-white font-medium px-3 py-2 rounded-md hover:bg-white/10 transition-colors text-base whitespace-nowrap">
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* ANIMATED MOBILE MENU */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div initial="closed" animate="open" exit="closed" variants={mobileMenuVariants} className="md:hidden overflow-hidden bg-[#162233]">
                        <div className="pb-4 pt-2">
                            <ul className="flex flex-col items-center space-y-1">
                                {navLinks.map(link => (
                                     <li key={link.path} className="w-full">
                                         <NavLink to={link.path} onClick={handleMenuClose} style={({ isActive }) => isActive ? activeLinkStyle : {}} className="block text-white text-lg font-medium py-3 px-4 rounded-md w-full text-center hover:bg-white/10">
                                             {link.label}
                                         </NavLink>
                                     </li>
                                ))}
                            </ul>
                            <div className="mt-4 pt-4 border-t border-white/20 flex flex-col items-center gap-4 px-4">
                                {isLoggedIn ? (
                                    <div className="flex flex-col items-center gap-4 w-full">
                                        <span className="text-amber-400 font-bold text-lg">Welcome, {userName}!</span>
                                        <button onClick={() => { handleLogout(); handleMenuClose(); }} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-md">Sign Out</button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-4 w-full">
                                        <Link to="/login" onClick={handleMenuClose} className="w-full text-center bg-transparent text-white font-semibold py-3 rounded-md hover:bg-white/10 border border-white/50">Login</Link>
                                        <Link to="/register" onClick={handleMenuClose} className="w-full text-center bg-amber-500 hover:bg-amber-400 text-white font-bold py-3 rounded-md shadow-md">Join EMPA</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
});

export default EMPANavbar;