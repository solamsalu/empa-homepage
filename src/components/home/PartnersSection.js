
import React from 'react';


const staticPartners = [
    
    // {
    //     id: 2,
    //     name: "Bit Company",
    //     logoUrl: "/images/bit.png",
    //     link: "#"
    // },
    
    // {
    //     id: 4,
    //     name: "Hel Company",
    //     logoUrl: "/images/hel.jpg",
    //     link: "#"
    // },
    // {
    //     id: 5,
    //     name: "St. Mary's University",
    //     logoUrl: "/images/smu.png",
    //     link: "#"
    // },
    {
        id: 6,
        name: "Africa Olympiad Academy",
        logoUrl: "/images/aoa.png",
        link: "https://www.aoa.school/"
    },
    {
        id: 7,
        name: "Global Talent Fund",
        logoUrl: "/images/global-talent.jfif",
        link: "https://www.globtalent.org/"
    },
    {
        id: 8,
        name: "Ministry of Innovation and Technology",
        logoUrl: "/images/mint.jpeg",
        link: "http://www.mint.gov.et/"
    },
    {
        id: 3,
        name: "Dia Company",
        logoUrl: "/images/dia.JPG",
        link: "#"
    },
    {
        id: 9,
        name: "STEMpower",
        logoUrl: "/images/stem-power.png",
        link: "https://www.stempower.org/"
    },
    {
        id: 1,
        name: "Ast Company",
        logoUrl: "/images/ast.webp",
        link: "https://asternega.com/"
    },
        // Add more partners here as needed

];

/**
 * A modern, professional, and comprehensive STATIC PartnersSection component.
 * It uses a local data array and displays partner logos with clean, interactive styling.
 */
const PartnersSection = () => {
    return (
        <section id="partners-section" className="bg-white py-20 sm:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-blue-900">Our Esteemed Partners</h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Collaborating with leading institutions to advance mathematics in Ethiopia.
                    </p>
                </div>

                {/* --- 2. RENDER THE STATIC DATA --- */}
                {/* The grid now maps over our `staticPartners` array. */}
                <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-12 items-center">
                    {staticPartners.map((partner) => (
                        <a
                            key={partner.id}
                            href={partner.link || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex justify-center items-center p-4 group"
                            aria-label={`Visit the website of our partner, ${partner.name}`}
                        >
                            {/* --- 3. APPLY PROFESSIONAL STYLING --- */}
                            {/* This uses the grayscale-to-color and zoom-on-hover effects. */}
                            <img
                                className="h-20 max-w-full object-contain grayscale opacity-70 transition-all duration-300 ease-in-out group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110"
                                src={partner.logoUrl}
                                alt={`${partner.name} Logo`}
                                // A simple fallback for broken images
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x80/cccccc/ffffff?text=Logo"; }}
                            />
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PartnersSection;