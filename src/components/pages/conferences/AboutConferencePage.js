
// import React, { useContext } from 'react';
// import { Link } from 'react-router-dom';
// import { Users, BookOpen, Target, Calendar, HelpCircle, AlertTriangle, CheckCircle } from 'lucide-react';
// import { AuthContext } from '../../../context/AuthContext'; // Adjust path to AuthContext

// const AboutConferencePage = () => {
//     const { isSubmissionOpen, isConferenceStatusLoading } = useContext(AuthContext);

//     return (
//         <div className="p-4 sm:p-6 lg:p-8 bg-white rounded-lg shadow-xl prose-lg max-w-none mx-auto font-sans">
//             <h2 className="text-4xl font-extrabold text-blue-900 mb-8 text-center leading-tight">About Our Annual Conference</h2>
//             <p className="text-xl text-gray-700 leading-relaxed text-center max-w-3xl mx-auto mb-12">
//                 The Ethiopian Mathematical Professionals Association (EMPA) annually hosts a premier gathering for the mathematical community, designed to foster innovation, collaboration, and advancement in the field.
//             </p>

//             <section className="mb-10 p-6 rounded-xl shadow-md border text-center">
//                 {isConferenceStatusLoading ? (
//                     <div className="flex items-center justify-center text-lg text-gray-700 animate-pulse">
//                         Loading submission status...
//                     </div>
//                 ) : isSubmissionOpen ? (
//                     <div className="bg-green-50 border-green-200 text-green-800 p-4 rounded-lg">
//                         <h3 className="text-2xl font-bold mb-2 flex items-center">
//                             <CheckCircle className="w-8 h-8 mr-3 text-green-600" />
//                             Submissions Are Currently Open!
//                         </h3>
//                         <p className="text-lg">
//                             We are actively accepting paper submissions for the upcoming conference. Don't miss this opportunity to share your research!
//                         </p>
//                         <Link
//                             to="/submit-paper" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-md">
//                             Submit Your Paper Now
//                             <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
//                         </Link>
//                     </div>

//                 ) : (
//                     <div className="bg-red-50 border-red-200 text-red-800 p-4 rounded-lg flex items-center">
//                         <AlertTriangle className="w-8 h-8 mr-4 text-red-600" />
//                         <div>
//                             <h3 className="text-2xl font-bold mb-2">Submissions Are Closed</h3>
//                             <p className="text-lg">
//                                 Thank you for your interest. The submission period is currently closed. Please check back later for future announcements.
//                             </p>
//                         </div>
//                     </div>
//                 )}
//             </section>



//             {/* --- End Conference Submission Status Display --- */}

//             <section className="mb-10 p-6 bg-blue-50 rounded-xl shadow-md border border-blue-200">
//                 <h3 className="text-3xl font-bold text-blue-800 mb-6 flex items-center">
//                     <Target className="w-8 h-8 mr-3 text-blue-600" /> Our Vision & Mission
//                 </h3>
//                 <p className="text-gray-800 text-lg leading-relaxed mb-4">
//                     Our annual conference is a cornerstone event for advancing mathematical sciences and promoting research excellence in Ethiopia and beyond. We aim to create a vibrant platform where innovative ideas flourish and collaborations ignite.
//                 </p>
//                 <p className="text-gray-800 text-lg leading-relaxed">
//                     We are dedicated to highlighting significant contributions in both pure and applied mathematics, addressing contemporary challenges, and exploring emerging trends that shape the future of the discipline.
//                 </p>
//             </section>

//             <section className="mb-10 p-6 bg-green-50 rounded-xl shadow-md border border-green-200">
//                 <h3 className="text-3xl font-bold text-green-800 mb-6 flex items-center">
//                     <BookOpen className="w-8 h-8 mr-3 text-green-600" /> Key Themes & Topics
//                 </h3>
//                 <p className="text-gray-800 text-lg mb-4">
//                     Each year, our conference delves into a selection of impactful themes that reflect the dynamic landscape of mathematical research and its applications. Recurring areas of interest typically include:
//                 </p>
//                 <ul className="list-disc pl-8 space-y-3 text-gray-800 text-lg">
//                     <li>Pure Mathematics: Algebra, Analysis, Geometry, Topology, Number Theory</li>
//                     <li>Applied Mathematics: Mathematical Modeling, Optimization, Numerical Analysis, Scientific Computing</li>
//                     <li>Statistics & Probability: Data Science, Machine Learning, Biostatistics, Econometrics</li>
//                     <li>Mathematics Education: Pedagogical Innovations, Curriculum Development, Technology in Education</li>
//                     <li>Interdisciplinary Applications: Financial Mathematics, Cryptography, Operations Research, Theoretical Computer Science</li>
//                 </ul>
//                 <p className="text-gray-800 text-lg leading-relaxed mt-4">
//                     We encourage submissions that align with these broad themes, as well as groundbreaking research in other relevant mathematical domains.
//                 </p>
//             </section>

//             <section className="mb-10 p-6 bg-yellow-50 rounded-xl shadow-md border border-yellow-200">
//                 <h3 className="text-3xl font-bold text-yellow-800 mb-6 flex items-center">
//                     <Users className="w-8 h-8 mr-3 text-yellow-600" /> Who Should Attend?
//                 </h3>
//                 <p className="text-gray-800 text-lg leading-relaxed">
//                     The EMPA Annual Conference is tailored for a diverse and engaged audience, including:
//                 </p>
//                 <ul className="list-disc pl-8 space-y-3 text-gray-800 text-lg">
//                     <li>University faculty, researchers, and post-doctoral fellows</li>
//                     <li>Graduate and advanced undergraduate students in mathematics and related disciplines</li>
//                     <li>Mathematics educators at all levels (K-12, university)</li>
//                     <li>Professionals applying mathematical methods in industry, government, and finance</li>
//                     <li>Anyone with a profound interest in the advancement and application of mathematical sciences</li>
//                 </ul>
//             </section>

//             <section className="mb-10 p-6 bg-purple-50 rounded-xl shadow-md border border-purple-200">
//                 <h3 className="text-3xl font-bold text-purple-800 mb-6 flex items-center">
//                     <Calendar className="w-8 h-8 mr-3 text-purple-600" /> Conference History & Impact
//                 </h3>
//                 <p className="text-gray-800 text-lg leading-relaxed mb-4">
//                     Our conferences have consistently served as crucial incubators for intellectual exchange, significantly contributing to the growth and dynamism of the mathematical community in Ethiopia. These events have sparked numerous research collaborations and led to the publication of high-impact scholarly works.
//                 </p>
//                 <p className="text-gray-800 text-lg leading-relaxed">
//                     We take pride in inspiring countless students to pursue challenging and rewarding careers in mathematics, fostering a legacy of excellence and a vibrant intellectual environment for generations to come.
//                 </p>
//             </section>

//             <div className="mt-12 p-8 bg-blue-100 rounded-2xl border border-blue-300 text-gray-800 text-center shadow-lg">
//                 <h3 className="text-3xl font-bold text-blue-900 mb-4 flex items-center justify-center">
//                     <HelpCircle className="w-9 h-9 mr-3 text-blue-700" /> Get Involved with EMPA
//                 </h3>
//                 <p className="text-xl mb-6">
//                     We warmly invite you to become a part of our thriving mathematical community. Your participation, whether as an attendee, a distinguished presenter, or a dedicated volunteer, is invaluable to our collective growth.
//                 </p>
//                 <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-lg font-medium">
//                     <p>Email us: <a href="mailto:conference@empa.org" className="text-blue-700 hover:underline transition-colors duration-200">conference@eth-math.org</a></p>
//                     <span className="hidden sm:block text-gray-500">|</span>
//                     <p>Call us: <a href="tel:+251111239461" className="text-blue-700 hover:underline transition-colors duration-200">+251-111239461</a></p>
//                 </div>
//                 <div className="mt-6">
//                     <Link to="/contact" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-lg text-white
//                         bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
//                         transition-all duration-300 shadow-md">
//                         Contact Our Team
//                         <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AboutConferencePage;

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Target, Calendar, HelpCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext'; // Adjust path to AuthContext if needed

const AboutConferencePage = () => {
    const { isSubmissionOpen, isConferenceStatusLoading } = useContext(AuthContext);

    // --- BUG FIX: Strict truthy check ---
    // This ensures that if AuthContext passes an empty array [], it evaluates to false.
    const hasActiveSubmissions = isSubmissionOpen === true || (Array.isArray(isSubmissionOpen) && isSubmissionOpen.length > 0);

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-white rounded-lg shadow-xl prose-lg max-w-none mx-auto font-sans">
            <h2 className="text-4xl font-extrabold text-blue-900 mb-8 text-center leading-tight">About Our Annual Conference</h2>
            <p className="text-xl text-gray-700 leading-relaxed text-center max-w-3xl mx-auto mb-12">
                The Ethiopian Mathematical Professionals Association (EMPA) annually hosts a premier gathering for the mathematical community, designed to foster innovation, collaboration, and advancement in the field.
            </p>

            <section className="mb-10 p-6 rounded-xl shadow-md border text-center">
                {isConferenceStatusLoading ? (
                    <div className="flex items-center justify-center text-lg text-gray-700 animate-pulse">
                        Loading submission status...
                    </div>
                ) : hasActiveSubmissions ? (
                    <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg">
                        <h3 className="text-2xl font-bold mb-2 flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 mr-3 text-green-600" />
                            Submissions Are Currently Open!
                        </h3>
                        <p className="text-lg mb-6">
                            We are actively accepting paper submissions for the upcoming conference. Don't miss this opportunity to share your research!
                        </p>
                        <Link
                            to="/submit-paper" 
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 shadow-md"
                        >
                            Submit Your Paper Now
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </Link>
                    </div>
                ) : (
                    <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-lg flex flex-col items-center justify-center text-center">
                        <AlertTriangle className="w-12 h-12 mb-3 text-red-600" />
                        <h3 className="text-2xl font-bold mb-2">Submissions Are Closed</h3>
                        <p className="text-lg max-w-2xl">
                            Thank you for your interest. The submission period is currently closed. Please check back later for future announcements regarding our next conference.
                        </p>
                    </div>
                )}
            </section>

            {/* --- End Conference Submission Status Display --- */}

            <section className="mb-10 p-6 bg-blue-50 rounded-xl shadow-md border border-blue-200">
                <h3 className="text-3xl font-bold text-blue-800 mb-6 flex items-center">
                    <Target className="w-8 h-8 mr-3 text-blue-600" /> Our Vision & Mission
                </h3>
                <p className="text-gray-800 text-lg leading-relaxed mb-4">
                    Our annual conference is a cornerstone event for advancing mathematical sciences and promoting research excellence in Ethiopia and beyond. We aim to create a vibrant platform where innovative ideas flourish and collaborations ignite.
                </p>
                <p className="text-gray-800 text-lg leading-relaxed">
                    We are dedicated to highlighting significant contributions in both pure and applied mathematics, addressing contemporary challenges, and exploring emerging trends that shape the future of the discipline.
                </p>
            </section>

            <section className="mb-10 p-6 bg-green-50 rounded-xl shadow-md border border-green-200">
                <h3 className="text-3xl font-bold text-green-800 mb-6 flex items-center">
                    <BookOpen className="w-8 h-8 mr-3 text-green-600" /> Key Themes & Topics
                </h3>
                <p className="text-gray-800 text-lg mb-4">
                    Each year, our conference delves into a selection of impactful themes that reflect the dynamic landscape of mathematical research and its applications. Recurring areas of interest typically include:
                </p>
                <ul className="list-disc pl-8 space-y-3 text-gray-800 text-lg">
                    <li>Pure Mathematics: Algebra, Analysis, Geometry, Topology, Number Theory</li>
                    <li>Applied Mathematics: Mathematical Modeling, Optimization, Numerical Analysis, Scientific Computing</li>
                    <li>Statistics & Probability: Data Science, Machine Learning, Biostatistics, Econometrics</li>
                    <li>Mathematics Education: Pedagogical Innovations, Curriculum Development, Technology in Education</li>
                    <li>Interdisciplinary Applications: Financial Mathematics, Cryptography, Operations Research, Theoretical Computer Science</li>
                </ul>
                <p className="text-gray-800 text-lg leading-relaxed mt-4">
                    We encourage submissions that align with these broad themes, as well as groundbreaking research in other relevant mathematical domains.
                </p>
            </section>

            <section className="mb-10 p-6 bg-yellow-50 rounded-xl shadow-md border border-yellow-200">
                <h3 className="text-3xl font-bold text-yellow-800 mb-6 flex items-center">
                    <Users className="w-8 h-8 mr-3 text-yellow-600" /> Who Should Attend?
                </h3>
                <p className="text-gray-800 text-lg leading-relaxed">
                    The EMPA Annual Conference is tailored for a diverse and engaged audience, including:
                </p>
                <ul className="list-disc pl-8 space-y-3 text-gray-800 text-lg">
                    <li>University faculty, researchers, and post-doctoral fellows</li>
                    <li>Graduate and advanced undergraduate students in mathematics and related disciplines</li>
                    <li>Mathematics educators at all levels (K-12, university)</li>
                    <li>Professionals applying mathematical methods in industry, government, and finance</li>
                    <li>Anyone with a profound interest in the advancement and application of mathematical sciences</li>
                </ul>
            </section>

            <section className="mb-10 p-6 bg-purple-50 rounded-xl shadow-md border border-purple-200">
                <h3 className="text-3xl font-bold text-purple-800 mb-6 flex items-center">
                    <Calendar className="w-8 h-8 mr-3 text-purple-600" /> Conference History & Impact
                </h3>
                <p className="text-gray-800 text-lg leading-relaxed mb-4">
                    Our conferences have consistently served as crucial incubators for intellectual exchange, significantly contributing to the growth and dynamism of the mathematical community in Ethiopia. These events have sparked numerous research collaborations and led to the publication of high-impact scholarly works.
                </p>
                <p className="text-gray-800 text-lg leading-relaxed">
                    We take pride in inspiring countless students to pursue challenging and rewarding careers in mathematics, fostering a legacy of excellence and a vibrant intellectual environment for generations to come.
                </p>
            </section>

            <div className="mt-12 p-8 bg-blue-100 rounded-2xl border border-blue-300 text-gray-800 text-center shadow-lg">
                <h3 className="text-3xl font-bold text-blue-900 mb-4 flex items-center justify-center">
                    <HelpCircle className="w-9 h-9 mr-3 text-blue-700" /> Get Involved with EMPA
                </h3>
                <p className="text-xl mb-6">
                    We warmly invite you to become a part of our thriving mathematical community. Your participation, whether as an attendee, a distinguished presenter, or a dedicated volunteer, is invaluable to our collective growth.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-lg font-medium">
                    <p>Email us: <a href="mailto:conference@eth-math.org" className="text-blue-700 hover:underline transition-colors duration-200">conference@eth-math.org</a></p>
                    <span className="hidden sm:block text-gray-500">|</span>
                    <p>Call us: <a href="tel:+251111239461" className="text-blue-700 hover:underline transition-colors duration-200">+251-111239461</a></p>
                </div>
                <div className="mt-6">
                    <Link to="/contact" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-lg text-white
                        bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                        transition-all duration-300 shadow-md">
                        Contact Our Team
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AboutConferencePage;