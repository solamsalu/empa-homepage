import React from 'react';
import { GraduationCap, Award, ExternalLink } from 'lucide-react';

const SPEAKERS = [
  {
    name: "Prof. Wandera Ogana",
    title: "Distinguished Professor of Applied Mathematics",
    institution: "University of Nairobi / African Mathematical Union (AMU)",
    topic: "Boundary Element Methods in Aerodynamics and Fluid Mechanics",
    imageUrl: "/images/speakers/speaker1.jpg", // Replace with your speaker photo
    flag: "🇰🇪"
  },
  {
    name: "Dr. Tilahun Abebe",
    title: "Associate Professor of Pure Mathematics",
    institution: "Addis Ababa University (AAU)",
    topic: "Recent Advances in Non-Linear Operator Theory and Fixed Point Iterations",
    imageUrl: "/images/speakers/speaker2.jpg",
    flag: "🇪🇹"
  },
  {
    name: "Prof. Giulia Rossi",
    title: "Senior Research Fellow",
    institution: "International Centre for Theoretical Physics (ICTP), Trieste",
    topic: "Mathematical Epidemiology: Modeling Vector-Borne Diseases in Sub-Saharan Africa",
    imageUrl: "/images/speakers/speaker3.jpg",
    flag: "🇮🇹"
  }
];

const KeynoteSpeakersSection = () => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-8 font-sans">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-black uppercase tracking-widest text-blue-600">
          Distinguished Guests
        </span>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Plenary & Keynote Speakers
        </h2>
        <p className="text-slate-500 text-sm">
          Hear from renowned international and national leaders in pure mathematics, applied computing, and mathematical biology.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SPEAKERS.map((spk, idx) => (
          <div 
            key={idx} 
            className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition group"
          >
            <div className="space-y-4">
              {/* Speaker Avatar / Photo */}
              <div className="w-20 h-20 rounded-2xl bg-slate-200 overflow-hidden mx-auto border-2 border-white shadow-md">
                <img 
                  src={spk.imageUrl} 
                  alt={spk.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  onError={(e) => {
                    // Fallback avatar icon if image not yet uploaded
                    e.target.style.display = 'none';
                    e.target.parentNode.classList.add('flex', 'items-center', 'justify-center', 'text-slate-400');
                    e.target.parentNode.innerHTML = '👤';
                  }}
                />
              </div>

              {/* Bio info */}
              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-slate-900 flex items-center justify-center gap-1.5">
                  <span>{spk.name}</span>
                  <span className="text-sm">{spk.flag}</span>
                </h3>
                <p className="text-[11px] font-semibold text-blue-600">{spk.title}</p>
                <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
                  <GraduationCap size={13} className="text-slate-400" />
                  <span>{spk.institution}</span>
                </p>
              </div>

              {/* Plenary Lecture Topic */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
                <span className="text-[10px] font-black uppercase text-slate-400 block mb-0.5">
                  Plenary Address:
                </span>
                <p className="font-bold text-slate-800 leading-snug">
                  "{spk.topic}"
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeynoteSpeakersSection;