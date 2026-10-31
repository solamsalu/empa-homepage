// // src/components/common/ConferenceCard.js
// import React from 'react';
// import { 
//   MapPin, 
//   Calendar, 
//   ArrowRight, 
//   Award, 
//   Mic, 
//   BookOpen, 
//   Wrench, 
//   Globe, 
//   Clock 
// } from 'lucide-react';
// import { STATIC_ASSETS_BASE_URL } from '../../utils/constants';

// // Professional styling configuration per event type
// const EVENT_TYPE_THEME = {
//   annual_conference: {
//     label: 'Annual Conference',
//     badge: 'bg-blue-900 text-white border-blue-700/60',
//     dotColor: 'bg-amber-400',
//     icon: <Award size={13} className="text-amber-300" />,
//     accentBorder: 'group-hover:border-blue-500/50'
//   },
//   public_lecture: {
//     label: 'Public Lecture',
//     badge: 'bg-purple-950 text-purple-200 border-purple-800/60',
//     dotColor: 'bg-purple-400',
//     icon: <Mic size={13} className="text-purple-300" />,
//     accentBorder: 'group-hover:border-purple-500/50'
//   },
//   seminar: {
//     label: 'Research Seminar',
//     badge: 'bg-emerald-950 text-emerald-200 border-emerald-800/60',
//     dotColor: 'bg-emerald-400',
//     icon: <BookOpen size={13} className="text-emerald-300" />,
//     accentBorder: 'group-hover:border-emerald-500/50'
//   },
//   workshop: {
//     label: 'Interactive Workshop',
//     badge: 'bg-amber-950 text-amber-200 border-amber-800/60',
//     dotColor: 'bg-amber-400',
//     icon: <Wrench size={13} className="text-amber-300" />,
//     accentBorder: 'group-hover:border-amber-500/50'
//   },
//   symposium: {
//     label: 'Academic Symposium',
//     badge: 'bg-teal-950 text-teal-200 border-teal-800/60',
//     dotColor: 'bg-teal-400',
//     icon: <Globe size={13} className="text-teal-300" />,
//     accentBorder: 'group-hover:border-teal-500/50'
//   }
// };

// const cleanText = (str) => (str ? str.replace(/<[^>]*>?/gm, '').trim() : '');

// const ConferenceCard = ({ conference, onViewDetails }) => {
//   const rawType = conference.event_type || 'annual_conference';
//   const theme = EVENT_TYPE_THEME[rawType] || EVENT_TYPE_THEME.annual_conference;

//   // Date & Time formatting
//   const dateObj = new Date(conference.date || conference.start_date);
//   const isValidDate = !isNaN(dateObj.getTime());

//   const formattedDate = isValidDate
//     ? dateObj.toLocaleDateString('en-US', {
//         weekday: 'short',
//         month: 'short',
//         day: 'numeric',
//         year: 'numeric'
//       })
//     : 'Date to be Announced';

//   const formattedTime = isValidDate
//     ? dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
//     : null;

//   const imageUrl = conference.images?.length > 0 
//     ? `${STATIC_ASSETS_BASE_URL}${conference.images[0].image_url}` 
//     : null;

//   const rawTitle = conference.title || 'Untitled Gathering';
//   const cleanTitle = cleanText(rawTitle);
//   const cleanDesc = cleanText(conference.description || '');

//   return (
//     <article 
//       onClick={onViewDetails}
//       className={`group bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col h-full overflow-hidden font-sans cursor-pointer relative ${theme.accentBorder}`}
//     >
//       {/* 🌟 1. COVER HERO AREA (16:9 Proportion) */}
//       <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
        
//         {/* Floating Category Pill */}
//         <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-1.5">
//           <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border shadow-md backdrop-blur-md ${theme.badge}`}>
//             <span className={`w-1.5 h-1.5 rounded-full ${theme.dotColor} animate-pulse`} />
//             {theme.icon}
//             <span>{theme.label}</span>
//           </span>
//         </div>

//         {/* Live Status Indicator */}
//         <div className="absolute top-3.5 right-3.5 z-20">
//           <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-slate-800 shadow-md border border-white/40 backdrop-blur-md">
//             Upcoming
//           </span>
//         </div>

//         {imageUrl ? (
//           <>
//             <img 
//               src={imageUrl} 
//               alt={cleanTitle} 
//               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
//             />
//             {/* Subtle Gradient Vignette */}
//             <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
//           </>
//         ) : (
//           /* 🌟 PRESTIGIOUS MATHEMATICAL CANVAS (When no image is uploaded) */
//           <div className="w-full h-full relative flex flex-col justify-between p-6 bg-gradient-to-br from-[#0a192f] via-[#0d233f] to-[#1e1b4b] text-white overflow-hidden">
//             {/* Geometric Mathematical Watermark */}
//             <div className="absolute -right-4 -bottom-8 opacity-10 select-none pointer-events-none font-serif text-[130px] font-black leading-none text-white">
//               ∫dx
//             </div>
//             <div className="absolute left-8 top-12 opacity-5 select-none pointer-events-none font-serif text-[90px] font-black leading-none text-white">
//               ∑
//             </div>

//             {/* Subtle Grid Overlay */}
//             <div 
//               className="absolute inset-0 opacity-[0.06] pointer-events-none" 
//               style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} 
//             />

//             <div className="relative z-10 pt-8">
//               <span className="text-[9px] font-black uppercase tracking-[0.25em] text-blue-300/80 block">
//                 የኢትዮጵያ ማቲማቲክስ ባለሙያዎች ማህበር
//               </span>
//             </div>

//             <div className="relative z-10 border-l-2 border-amber-400/80 pl-3 my-auto">
//               <p className="text-xs font-serif italic text-amber-200 font-bold">
//                 EMPA Scientific Gathering
//               </p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* 🌟 2. CARD CONTENT BODY */}
//       <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
//         <div className="space-y-3">
          
//           {/* Main Title */}
//           <h3 
//             className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug"
//             title={cleanTitle}
//           >
//             {cleanTitle}
//           </h3>

//           {/* Location & Time Timeline Strip */}
//           <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
//             <p className="flex items-center gap-2 font-medium text-slate-700">
//               <Calendar size={13} className="text-blue-600 shrink-0" />
//               <span>{formattedDate}</span>
//               {formattedTime && <span className="text-slate-400">• {formattedTime} EAT</span>}
//             </p>
//             <p className="flex items-center gap-2">
//               <MapPin size={13} className="text-rose-500 shrink-0" />
//               <span className="line-clamp-1 text-slate-600">
//                 {conference.location || conference.venue || 'Addis Ababa, Ethiopia'}
//               </span>
//             </p>
//           </div>

//           {/* Description Excerpt */}
//           {cleanDesc && (
//             <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
//               {cleanDesc}
//             </p>
//           )}
//         </div>

//         {/* 🌟 3. BOTTOM CTA BUTTON */}
//         <div className="pt-3 border-t border-slate-100">
//           <div className="w-full py-2.5 px-4 rounded-xl bg-slate-50 group-hover:bg-blue-600 text-slate-700 group-hover:text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-between border border-slate-200/80 group-hover:border-blue-600 shadow-sm">
//             <span>Explore Event & Schedule</span>
//             <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
//           </div>
//         </div>

//       </div>
//     </article>
//   );
// };

// export const ConferenceCardSkeleton = () => (
//   <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden flex flex-col h-full animate-pulse shadow-sm font-sans">
//     <div className="aspect-[16/9] w-full bg-slate-200" />
//     <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
//       <div className="space-y-3">
//         <div className="h-5 bg-slate-200 rounded-xl w-3/4" />
//         <div className="h-14 bg-slate-200 rounded-2xl w-full" />
//         <div className="h-4 bg-slate-200 rounded-xl w-4/5" />
//       </div>
//       <div className="pt-3 border-t border-slate-100">
//         <div className="h-9 bg-slate-200 rounded-xl w-full" />
//       </div>
//     </div>
//   </div>
// );

// export default ConferenceCard;



// src/components/common/ConferenceCard.js
import React from 'react';
import { 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Award, 
  Mic, 
  BookOpen, 
  Wrench, 
  Globe, 
  Clock 
} from 'lucide-react';
import { STATIC_ASSETS_BASE_URL } from '../../utils/constants';

// Professional styling configuration per event type
const EVENT_TYPE_THEME = {
  annual_conference: {
    label: 'Annual Conference',
    badge: 'bg-blue-600 text-white border-blue-500 shadow-blue-500/20',
    dotColor: 'bg-amber-300',
    icon: <Award size={13} className="text-amber-200" />,
    accentBorder: 'group-hover:border-blue-500/50'
  },
  public_lecture: {
    label: 'Public Lecture',
    badge: 'bg-purple-600 text-white border-purple-500 shadow-purple-500/20',
    dotColor: 'bg-purple-200',
    icon: <Mic size={13} className="text-purple-100" />,
    accentBorder: 'group-hover:border-purple-500/50'
  },
  seminar: {
    label: 'Research Seminar',
    badge: 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/20',
    dotColor: 'bg-emerald-200',
    icon: <BookOpen size={13} className="text-emerald-100" />,
    accentBorder: 'group-hover:border-emerald-500/50'
  },
  workshop: {
    label: 'Interactive Workshop',
    badge: 'bg-amber-600 text-white border-amber-500 shadow-amber-500/20',
    dotColor: 'bg-amber-100',
    icon: <Wrench size={13} className="text-amber-100" />,
    accentBorder: 'group-hover:border-amber-500/50'
  },
  symposium: {
    label: 'Academic Symposium',
    badge: 'bg-teal-600 text-white border-teal-500 shadow-teal-500/20',
    dotColor: 'bg-teal-200',
    icon: <Globe size={13} className="text-teal-100" />,
    accentBorder: 'group-hover:border-teal-500/50'
  }
};

const cleanText = (str) => (str ? str.replace(/<[^>]*>?/gm, '').trim() : '');

const ConferenceCard = ({ conference, onViewDetails }) => {
  const rawType = conference.event_type || 'annual_conference';
  const theme = EVENT_TYPE_THEME[rawType] || EVENT_TYPE_THEME.annual_conference;

  // Date & Time formatting (Interprets local time cleanly without shifting hours)
  const dateStr = conference.date || conference.start_date;
  const dateObj = dateStr ? new Date(dateStr) : null;
  const isValidDate = dateObj && !isNaN(dateObj.getTime());

  const formattedDate = isValidDate
    ? dateObj.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Date to be Announced';

  const formattedTime = isValidDate
    ? dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    : null;

  const imageUrl = conference.images?.length > 0 
    ? `${STATIC_ASSETS_BASE_URL}${conference.images[0].image_url}` 
    : null;

  const rawTitle = conference.title || 'Untitled Gathering';
  const cleanTitle = cleanText(rawTitle);
  const cleanDesc = cleanText(conference.description || '');

  return (
    <article 
      onClick={onViewDetails}
      className={`group bg-white rounded-[2rem] border border-slate-200/95 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col h-full overflow-hidden cursor-pointer relative font-sans ${theme.accentBorder}`}
    >
      {/* 🌟 1. HERO COVER CONTAINER (Clean Proportions) */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
        
        {/* Floating Category Pill */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5">
          <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-md backdrop-blur-md ${theme.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${theme.dotColor} animate-pulse`} />
            {theme.icon}
            <span>{theme.label}</span>
          </span>
        </div>

        {/* Live Status Indicator */}
        <div className="absolute top-4 right-4 z-20">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-900/80 text-amber-300 shadow-md border border-white/15 backdrop-blur-md">
            Upcoming
          </span>
        </div>

        {imageUrl ? (
          <>
            <img 
              src={imageUrl} 
              alt={cleanTitle} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
            />
            {/* Cinematic Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />
          </>
        ) : (
          /* 🌟 PRESTIGIOUS MATHEMATICAL CANVAS (When no image is uploaded) */
          <div className="w-full h-full relative flex flex-col justify-between p-6 bg-gradient-to-br from-slate-900 via-[#0d233f] to-slate-950 text-white overflow-hidden">
            {/* Geometric Mathematical Watermark */}
            <div className="absolute -right-2 -bottom-6 opacity-15 select-none pointer-events-none font-serif text-[120px] font-black leading-none text-white">
              ∫dx
            </div>
            <div className="absolute left-6 top-10 opacity-10 select-none pointer-events-none font-serif text-[80px] font-black leading-none text-white">
              ∑
            </div>

            {/* Subtle Grid Overlay */}
            <div 
              className="absolute inset-0 opacity-[0.05] pointer-events-none" 
              style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} 
            />

            <div className="relative z-10 pt-6">
              <span className="text-[8px] font-black uppercase tracking-[0.25em] text-blue-300/80 block">
                Ethiopian Mathematical Professionals Association
              </span>
            </div>

            <div className="relative z-10 border-l-2 border-amber-400 pl-3 my-auto">
              <p className="text-xs font-serif italic text-amber-200 font-bold">
                EMPA Scientific Gathering
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 🌟 2. CARD CONTENT BODY */}
      <div className="p-6 sm:p-7 flex flex-col flex-grow justify-between space-y-4">
        <div className="space-y-3">
          
          {/* Main Title (Safeguarded with line-clamp-2 so it never breaks card height) */}
          <h3 
            className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug tracking-tight"
            title={cleanTitle}
          >
            {cleanTitle}
          </h3>

          {/* Location & Time Structured Capsule */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100/80 space-y-1.5 text-xs text-slate-600">
            <p className="flex items-center gap-2 font-semibold text-slate-800">
              <Calendar size={13} className="text-blue-600 shrink-0" />
              <span>{formattedDate}</span>
              {formattedTime && <span className="text-slate-400 font-normal">• {formattedTime} EAT</span>}
            </p>
            <p className="flex items-center gap-2">
              <MapPin size={13} className="text-rose-500 shrink-0" />
              <span className="line-clamp-1 font-medium text-slate-600">
                {conference.location || conference.venue || 'Addis Ababa, Ethiopia'}
              </span>
            </p>
          </div>

          {/* Description Excerpt with top spacing */}
          {cleanDesc && (
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed pt-0.5">
              {cleanDesc}
            </p>
          )}
        </div>

        {/* 🌟 3. BOTTOM CTA BUTTON */}
        <div className="pt-3 border-t border-slate-100 mt-auto">
          <div className="w-full py-2.5 px-4 rounded-xl bg-slate-50 group-hover:bg-blue-600 text-slate-800 group-hover:text-white font-black text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-between border border-slate-200/80 group-hover:border-blue-600 shadow-sm">
            <span>Explore Event & Schedule</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>
    </article>
  );
};

export const ConferenceCardSkeleton = () => (
  <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden flex flex-col h-full animate-pulse shadow-sm font-sans">
    <div className="aspect-[16/10] w-full bg-slate-200" />
    <div className="p-7 flex flex-col flex-grow justify-between space-y-5">
      <div className="space-y-3.5">
        <div className="h-6 bg-slate-200 rounded-xl w-3/4" />
        <div className="h-16 bg-slate-200 rounded-2xl w-full" />
        <div className="h-4 bg-slate-200 rounded-xl w-4/5" />
      </div>
      <div className="pt-4 border-t border-slate-100">
        <div className="h-11 bg-slate-200 rounded-2xl w-full" />
      </div>
    </div>
  </div>
);

export default ConferenceCard;