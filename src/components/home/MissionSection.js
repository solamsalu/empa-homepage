
import React from 'react';

const TargetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
    </svg>
);
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.5 21.75l-.398-1.178a3.375 3.375 0 00-2.455-2.455L12.75 18l1.178-.398a3.375 3.375 0 002.455-2.455l.398-1.178.398 1.178a3.375 3.375 0 002.455 2.455l1.178.398-1.178.398a3.375 3.375 0 00-2.455 2.455z" />
    </svg>
);

/**
 * A modern, professional, and comprehensive MissionSection component.
 * It uses a visually engaging layout with a background image, icons, and distinct cards
 * to clearly communicate the organization's purpose.
 */
const MissionSection = () => {
    // We define the content here for easy updating
    const content = {
        mainTitle: "Our Guiding Principles",
        mainSubtitle: "EMPA is dedicated to promoting and enhancing the quality of mathematics, mathematics education, and research in Ethiopia.",
        mission: {
            title: "Our Mission",
            text: "To advance mathematical knowledge through research, support educators with professional development, and inspire the next generation of mathematicians.",
            icon: <TargetIcon />
        },
        vision: {
            title: "Our Vision",
            text: "To be a leading professional association that ensures the value of mathematics as a critical driver of national progress and innovation.",
            icon: <EyeIcon />
        },
        values: {
            title: "Our Core Values",
            text: "We are committed to Excellence, Collaboration, Integrity, and Community Engagement in all our endeavors.",
            icon: <SparklesIcon />
        }
    };

    return (
        <section 
            id="mission-section" 
            className="relative bg-gray-800 py-20 sm:py-28" // Changed background to dark for contrast
        >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 overflow-hidden">
                <img 
                    src="/images/mission-background.jpg" // A relevant, high-quality background image
                    alt="Abstract mathematical patterns" 
                    className="w-full h-full object-cover opacity-10" 
                />
            </div>
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Header */}
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                        {content.mainTitle}
                    </h2>
                    <p className="mt-4 text-lg text-blue-200 max-w-3xl mx-auto">
                        {content.mainSubtitle}
                    </p>
                </div>

                {/* Grid for Mission, Vision, and Values Cards */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Mission Card */}
                    <div className="text-center bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-blue-600">
                            {content.mission.icon}
                        </div>
                        <h3 className="mt-6 text-xl font-bold text-white">{content.mission.title}</h3>
                        <p className="mt-2 text-base text-blue-200">
                            {content.mission.text}
                        </p>
                    </div>

                    {/* Vision Card */}
                    <div className="text-center bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-purple-600">
                            {content.vision.icon}
                        </div>
                        <h3 className="mt-6 text-xl font-bold text-white">{content.vision.title}</h3>
                        <p className="mt-2 text-base text-blue-200">
                            {content.vision.text}
                        </p>
                    </div>
                    
                    {/* Values Card */}
                    <div className="text-center bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-amber-500">
                            {content.values.icon}
                        </div>
                        <h3 className="mt-6 text-xl font-bold text-white">{content.values.title}</h3>
                        <p className="mt-2 text-base text-blue-200">
                            {content.values.text}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MissionSection;