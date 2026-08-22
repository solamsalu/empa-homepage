
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- Icon Imports (Assuming these are in your project) ---
const ArrowLeftIcon = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const ArrowRightIcon = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;

// --- PrimaryButton (Example - use your actual component) ---
const PrimaryButton = ({ children, onClick, className }) => <button onClick={onClick} className={`bg-amber-500 hover:bg-amber-400 text-white font-bold py-3 px-8 rounded-full shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 ring-2 ring-transparent hover:ring-white ${className}`}>{children}</button>;


// --- 1. CONSOLIDATED SLIDE CONFIGURATION ---
// This makes it easy to add, remove, or reorder slides in one place.
const heroCarouselSlides = [
    {
        type: 'welcome',
        imageUrl: '/images/conference2.jpg', // A welcoming, professional image
        title: "Ethiopian Mathematics Professionals Association",
        subtitle: "Advancing Mathematical Sciences in Ethiopia",
        description: "Empowering our community through collaboration, research, and educational excellence. Join us in shaping the future.",
    },
    {
        type: 'activity',
        imageUrl: '/images/conference15.jpg',
        title: 'Annual Mathematics Conference',
        description: 'Join leading mathematicians for our flagship conference. Explore breakthroughs and network with peers.',
        buttonText: "Explore Events",
        buttonPath: '/events',
    },
    {
        type: 'activity',
        imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2874&auto=format&fit=crop',
        title: 'JEMPA: The EMPA Journal',
        description: 'Explore cutting-edge research in our peer-reviewed journal. Now accepting submissions.',
        buttonText: "View Journals",
        buttonPath: '/journals',
    },
    {
        type: 'activity',
        imageUrl: '/images/olympiad1.jpg',
        title: 'National Mathematics Olympiad',
        description: 'We are proud to mentor the next generation of mathematical talent for national and international competitions.',
        buttonText: "Discover Olympiad",
        buttonPath: '/olympiad',
    },
];

// --- 2. ANIMATION VARIANTS (Tweaked for professional feel) ---
const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction) => ({ zIndex: 0, x: direction < 0 ? '100%' : '-100%', opacity: 0 }),
};

const contentContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delayChildren: 0.3, staggerChildren: 0.2 } },
};

const contentItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};


// --- HERO SECTION COMPONENT ---
const HeroSection = ({ navbarHeight }) => {
    const [[currentSlideIndex, direction], setSlide] = useState([0, 0]);
    const navigate = useNavigate();

    const nextSlide = useCallback(() => {
        setSlide([ (currentSlideIndex + 1) % heroCarouselSlides.length, 1 ]);
    }, [currentSlideIndex]);

    const prevSlide = () => {
        setSlide([ (currentSlideIndex - 1 + heroCarouselSlides.length) % heroCarouselSlides.length, -1 ]);
    };
    
    const goToSlide = (index) => {
        setSlide([index, index > currentSlideIndex ? 1 : -1]);
    }

    useEffect(() => {
        const interval = setInterval(nextSlide, 8000); // Auto-slide every 8 seconds
        return () => clearInterval(interval);
    }, [nextSlide]);

    const currentSlide = heroCarouselSlides[currentSlideIndex];

    return (
        <div
            id="hero-section"
            className="relative h-screen flex items-center justify-center text-center overflow-hidden"
            // --- 3. ROBUST NAVBAR HEIGHT HANDLING ---
            // The content container inside will use this to add top padding,
            // but the main hero section should always be full screen height.
            style={{ paddingTop: `${navbarHeight}px` }} 
        >
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentSlideIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                    className="absolute inset-0 w-full h-full"
                >
                    {/* 4. ENHANCED VISUALS: KEN BURNS EFFECT & GRADIENT --- */}
                    <div className="absolute inset-0 overflow-hidden">
                        <motion.div
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${currentSlide.imageUrl})` }}
                            // The Ken Burns (pan & zoom) effect
                            initial={{ scale: 1.1, x: 0 }}
                            animate={{ scale: 1, x: 0 }}
                            transition={{ duration: 15, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
                        />
                    </div>
                    {/* Richer gradient for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                </motion.div>
            </AnimatePresence>
            
            <motion.div
                key={`content-${currentSlideIndex}`}
                className="relative z-10 w-full flex flex-col items-center justify-center max-w-5xl mx-auto px-4 text-white"
                variants={contentContainerVariants}
                initial="hidden"
                animate="visible"
            >
                {currentSlide.type === 'welcome' && (
                    <motion.div variants={contentItemVariants} className="mb-4">
                        <img
                            src="/images/empa_logo.jpg" // Assuming this is your logo
                            alt="EMPA Logo"
                            className="mx-auto h-20 sm:h-24 object-contain drop-shadow-lg"
                        />
                    </motion.div>
                )}
                {/* 5. IMPROVED READABILITY with text-shadow */}
                <motion.h1 variants={contentItemVariants} className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white [text-shadow:_0_2px_4px_rgb(0_0_0_/_50%)]">
                    {currentSlide.title}
                </motion.h1>
                {currentSlide.subtitle && (
                    <motion.h2 variants={contentItemVariants} className="mt-4 text-xl sm:text-2xl text-blue-200 [text-shadow:_0_1px_2px_rgb(0_0_0_/_40%)]">
                        {currentSlide.subtitle}
                    </motion.h2>
                )}
                <motion.p variants={contentItemVariants} className="mt-6 max-w-3xl mx-auto text-lg text-blue-50 leading-relaxed [text-shadow:_0_1px_2px_rgb(0_0_0_/_40%)]">
                    {currentSlide.description}
                </motion.p>
                {currentSlide.buttonText && (
                    <motion.div variants={contentItemVariants} className="mt-10">
                        <PrimaryButton onClick={() => navigate(currentSlide.buttonPath)}>
                            {currentSlide.buttonText}
                            <ArrowRightIcon className="inline-block h-5 w-5 ml-2" />
                        </PrimaryButton>
                    </motion.div>
                )}
            </motion.div>

            {/* 6. ENHANCED CONTROLS with backdrop-blur */}
            <button
                onClick={prevSlide}
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white z-20"
                aria-label="Previous slide"
            >
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white z-20"
                aria-label="Next slide"
            >
                <ArrowRightIcon className="w-6 h-6" />
            </button>

            {/* 7. ENHANCED INDICATORS with smoother animation */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3 z-20">
                {heroCarouselSlides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => goToSlide(idx)}
                        className={`h-2.5 w-2.5 rounded-full transition-all duration-500 ease-out ${
                            currentSlideIndex === idx ? 'bg-white scale-125 w-6' : 'bg-white/40 hover:bg-white/70'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroSection;