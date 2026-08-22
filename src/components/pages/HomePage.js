

// // src/components/pages/HomePage.js
// import React from 'react';

// // Import Homepage Sections (no changes to imports needed)
// import HeroSection from '../home/HeroSection.js';
// import CountersSection from '../home/CountersSection.js'; // Moved up
// import ConferenceSection from '../home/ConferenceSection.js';
// import NewsSection from '../home/NewsSection.js';
// import OlympiadSection from '../home/OlympiadSection.js';
// import JournalSection from '../home/JournalSection.js';
// import PartnersSection from '../home/PartnersSection.js';
// import MembershipSection from '../home/MembershipSection.js';
// import MissionSection from '../home/MissionSection.js'


// const HomePage = () => {
//     return (
//         <>
//             {/* 1. The Hook: Grab attention immediately */}
//             <HeroSection />
//             <MissionSection/>
//             {/* 2. The Credibility Builder: Show impact and scale right away */}
//             <CountersSection />

//             {/* 3. The Core Activities: "What do you do?" - Ordered by user action */}
//             <ConferenceSection />      {/* Most time-sensitive and action-oriented */}
//             <NewsSection />        {/* Shows the organization is current and active */}
//             <OlympiadSection />    {/* Highlights a key, prestigious program */}
//             <JournalSection />     {/* Showcases academic and research focus */}

//             {/* 4. The Social Proof: "Who trusts you?" */}
//             <PartnersSection />

//             {/* 5. The Final Call to Action: "Join us." */}
//             <MembershipSection />
//         </>
//     );
// };

// export default HomePage;


import React from 'react';

// Import Homepage Sections
import HeroSection from '../home/HeroSection.js';
import CountersSection from '../home/CountersSection.js'; 
import ConferenceSection from '../home/ConferenceSection.js';
import NewsSection from '../home/NewsSection.js';
import OlympiadSection from '../home/OlympiadSection.js';
import JournalSection from '../home/JournalSection.js';
import PartnersSection from '../home/PartnersSection.js';
import MembershipSection from '../home/MembershipSection.js';
import MissionSection from '../home/MissionSection.js';

// --- ADD THIS IMPORT ---
import TrendingSection from './journal/TrendingSection'; 

const HomePage = () => {
    return (
        <>
            <HeroSection />
            <MissionSection/>
            <CountersSection />

            <ConferenceSection />      
            <NewsSection />        
            <OlympiadSection />    

            {/* --- GROUP RESEARCH CONTENT TOGETHER --- */}
            <JournalSection />     
            <div className="max-w-7xl mx-auto px-4 pb-12">
                <TrendingSection />
            </div>

            <PartnersSection />
            <MembershipSection />
        </>
    );
};

export default HomePage;