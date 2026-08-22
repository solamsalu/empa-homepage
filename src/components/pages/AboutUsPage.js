
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '../common/icons/CheckCircleIcon';
import { ArrowRightIcon } from '../common/icons/ArrowRightIcon';
import ImageContainer from '../common/ImageContainer';

// --- Reusable Sub-components ---
const TeamCard = ({ name, title, university, email, photoUrl }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:-translate-y-2 flex flex-col items-center p-6 text-center border-t-4 border-blue-500">
        <div className="w-32 h-32 rounded-full mb-4 border-4 border-white shadow-xl overflow-hidden">
             <ImageContainer
                src={photoUrl}
                alt={`${name}'s Profile`}
                className="aspect-square"
                imageClassName="object-top" 
                fallbackText={name.split(' ').map(n => n[0]).join('')}
            />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
        <p className="text-blue-700 font-medium text-sm leading-tight">{title}</p>
        <p className="text-gray-500 text-xs mt-1">{university}</p>
        <a href={`mailto:${email}`} className="text-blue-600 text-sm hover:underline mt-2 block break-all">{email}</a>
    </div>
);

// const TimelineItem = ({ year, title, location, isLast = false }) => (
//     <div className="flex justify-center">
//         <div className="relative pl-8 sm:pl-10 py-6 group w-full max-w-2xl">
//             {!isLast && <div className="absolute top-5 left-0 -ml-px w-0.5 h-full bg-gray-300 group-hover:bg-blue-500 transition-colors"></div>}
//             <div className="absolute top-5 left-0 -ml-3 h-6 w-6 rounded-full bg-blue-600 border-4 border-white group-hover:bg-amber-500 transition-colors"></div>
//             <div className="pl-4">
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
//                     <time className="text-sm font-semibold uppercase text-blue-600 mb-1 sm:mb-0">{year}</time>
//                     <div className="text-xl font-bold text-gray-800">{title}</div>
//                 </div>
//                 <div className="text-gray-600 mt-1">{location}</div>
//             </div>
//         </div>
//     </div>
// );
const TimelineItem = ({ year, title, location, forthcoming, isLast = false }) => (
  <div className="flex justify-center">
    <div className="relative pl-8 sm:pl-10 py-6 group w-full max-w-2xl">
      {!isLast && (
        <div className="absolute top-5 left-0 -ml-px w-0.5 h-full bg-gray-300 group-hover:bg-blue-500 transition-colors"></div>
      )}
      <div className="absolute top-5 left-0 -ml-3 h-6 w-6 rounded-full bg-blue-600 border-4 border-white group-hover:bg-amber-500 transition-colors"></div>
      <div className="pl-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
          <time className="text-sm font-semibold uppercase text-blue-600 mb-1 sm:mb-0">{year}</time>
          <div className="text-xl font-bold text-gray-800 flex items-center">
            {title}
            {forthcoming && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                Forthcoming
              </span>
            )}
          </div>
        </div>
        <div className="text-gray-600 mt-1">{location}</div>
      </div>
    </div>
  </div>
);


/**
 * A final, modern, professional, and comprehensive About Us page.
 */
const AboutUsPage = () => {
    const navigate = useNavigate();

    const executiveCommittee = [
        { name: "Dr. Samuel Asefa", title: "President", university: "Addis Ababa University", email: "samuel.asefa@aau.edu.et", photoUrl: "/images/Picture1.png" },
        { name: "Dr. Wondwosen Zemene", title: "Vice President & Coordinator", university: "University of Gondar", email: "wondwosen.zemene1@uog.edu.et", photoUrl: "/images/Picture2.jpg" },
        { name: "Dr. Tesfaye Aga", title: "Accountant & Coordinator", university: "Jimma University", email: "tesfaye.aga@ju.edu.et", photoUrl: "/images/Picture3.png" },
        { name: "Mrs. Tsehay Alemayehu", title: "Treasurer & Coordinator", university: "Kotebe University of Education", email: "tsehaybater@gmail.com", photoUrl: "/images/Picture4.png" },
        { name: "Dr. Wondwosen Gebeyaw", title: "Coordinator for Olympiad/Seminar", university: "Dilla University", email: "wondoseng@du.edu.et", photoUrl: "/images/Picture5.png" },
        { name: "Dr. Gosa Gadissa", title: "Coordinator for Training & Fellowship", university: "Wollega University", email: "gosag@wollegauniversity.edu.edu", photoUrl: "/images/Picture6.png" },
        { name: "Dr. Yenealem Ayalew", title: "Secretary & Coordinator for Web/Social", university: "Kotebe University of Education", email: "yenealem.ayalew@kue.edu.et", photoUrl: "/images/Picture7.png" },
    ];

    const strategicObjectives = [
        "Creating Collaboration & Partnerships", "Involvement in curriculum assessment and review", "Participation in accreditation and standard setting",
        "Supporting professional development for educators", "Enhancing the value of the mathematics profession", "Popularizing mathematics through community forums",
        "Improving the quality of research and publication", "Establishing a professional journal", "Recognizing outstanding researchers", "Enhancing member benefits and services",
    ];
    
    const conferenceHistory = [
        { year: "2028", title: "26th International Conference on Mathematics and Mathematics Education and 16th Ethiopian National Mathematics Olympiad", location: "Bahir Dar University", forthcoming:true},
        { year: "2027", title: "25th International Conference on Mathematics and Mathematics Education and 15th Ethiopian National Mathematics Olympiad", location: "Wolkite University", forthcoming:true},
        { year: "2026", title: "9th International Conference on Mathematics and Mathematics Education and Ethiopian National Mathematics Olympiad", location: "Wollo University", forthcoming:false },
        { year: "2025", title: "8th International Conference on Mathematics and Mathematics Education and Ethiopian National Mathematics Olympiad", location: "Dilla University", forthcoming:false },
        { year: "2024", title: "7th International Conference on Mathematics and Mathematics Education and Ethiopian National Mathematics Olympiad", location: "Kotebe University of Education", forthcoming:false },
        { year: "2023", title: "6th National Conference", location: "Adama Science and Technology University", forthcoming:false },
        { year: "2022", title: "5th National Conference", location: "Haramaya University", forthcoming:false },
        { year: "2021", title: "4th National Conference", location: "Addis Ababa University", forthcoming:false},
        { year: "2020", title: "3rd National Conference", location: "Arbaminch University", forthcoming:false },
        { year: "2019", "title": "2nd National Conference", location: "Addis Ababa Science and Technology University", forthcoming:false },
        { year: "2018", title: "1st National Conference", location: "Adama Science and Technology University", forthcoming:false },
    ];

    return (
        <div className="bg-gray-50 font-sans">
            {/* --- THE FIX --- */}
            {/* Header Section with the consistent gradient */}
            <section className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 py-20 px-4 text-white text-center">
                <div className="max-w-4xl mx-auto z-10 relative">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold">About EMPA</h1>
                    <p className="mt-4 text-lg sm:text-xl text-blue-200">
                        Dedicated to expanding research, fostering idea exchange, and supporting the development of mathematics professionals in Ethiopia.
                    </p>
                </div>
                {/* Optional: Pattern overlay */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 6V5zm1 6v-1L0 0h1z\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
            </section>

            {/* Our Purpose: Vision & Mission Section */}
            <section className="py-16 sm:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                         <h2 className="text-3xl font-bold text-blue-900">Our Purpose</h2>
                         <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">We are driven by a clear vision and a dedicated mission to elevate mathematics in Ethiopia.</p>
                    </div>
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
                        <div className="bg-blue-50 p-8 rounded-xl shadow-lg border border-blue-100">
                            <h3 className="text-2xl font-bold text-blue-800">Our Vision</h3>
                            <p className="mt-4 text-gray-700 leading-relaxed text-lg">To be a leading professional association that ensures the value and development of Mathematics and Mathematics Education as a critical driver of national progress.</p>
                        </div>
                        <div className="bg-purple-50 p-8 rounded-xl shadow-lg border border-purple-100">
                            <h3 className="text-2xl font-bold text-purple-800">Our Mission</h3>
                            <p className="mt-4 text-gray-700 leading-relaxed text-lg">To promote and enhance the quality of Mathematics, Mathematics Education, and Research through collaboration, support, and advocacy.</p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Strategic Objectives Section */}
            <section className="py-16 sm:py-24 bg-gray-50 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-blue-900 text-center mb-12">Strategic Objectives</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {strategicObjectives.map((objective, index) => (
                             <div key={index} className="flex items-center p-4 bg-white rounded-lg shadow-md border-l-4 border-blue-500">
                                <CheckCircleIcon className="text-blue-500 w-8 h-8 flex-shrink-0" />
                                <p className="ml-4 text-gray-700 font-medium">{objective}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* History Timeline Section
            <section className="py-16 sm:py-24 bg-white px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-blue-900 text-center mb-16">History of Conferences and Ethiopian National Mathematics Olympiad</h2>
                    <div className="max-w-4xl mx-auto">
                        {conferenceHistory.map((item, index) => (
                            <TimelineItem key={index} year={item.year} title={item.title} location={item.location} isLast={index === conferenceHistory.length - 1} />
                        ))}
                    </div>
                </div>
            </section> */}
            {/* History Timeline Section */}
<section className="py-16 sm:py-24 bg-white px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-3xl font-bold text-blue-900 text-center mb-6">
      History of Conferences & Ethiopian National Mathematics Olympiad
    </h2>
    <p className="text-center text-gray-600 max-w-2xl mx-auto mb-16">
      A chronological journey showcasing our national and international conferences, 
      highlighting milestones in mathematics education and Olympiad achievements.
    </p>
    <div className="max-w-4xl mx-auto">
      {conferenceHistory.map((item, index) => (
        <TimelineItem
          key={index}
          year={item.year}
          title={item.title}
          location={item.location}
          forthcoming={item.forthcoming} 
          isLast={index === conferenceHistory.length - 1}
        />
      ))}
    </div>
  </div>
</section>

            {/* Executive Committee Section */}
            <section className="py-16 sm:py-24 bg-gray-50 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-blue-900 mb-12">Executive Committee (July 2024 - June 2026)</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {executiveCommittee.map(member => <TeamCard key={member.name} {...member} />)}
                    </div>
                </div>
            </section>

            {/* Final Call to Action Section */}
            <section className="bg-blue-800">
                <div className="max-w-4xl mx-auto text-center py-16 sm:py-20 px-4">
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Join Our Growing Community!</h2>
                    <p className="mt-4 text-lg leading-6 text-blue-200">Become a part of EMPA and contribute to the advancement of mathematics in Ethiopia.</p>
                    <div className="mt-8">
                        <button
                            onClick={() => navigate('/membership')}
                            className="bg-amber-500 hover:bg-amber-400 text-blue-900 font-bold py-3 px-8 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center"
                        >
                            Learn More About Membership
                            <ArrowRightIcon className="w-5 h-5 ml-2" />
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUsPage;