// src/components/pages/conferences/common/ConferencePageHeader.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, ChevronRight } from 'lucide-react';

const ConferencePageHeader = ({ 
  title, 
  subtitle, 
  breadcrumbs = [], 
  backUrl, 
  actions 
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backUrl) {
      navigate(backUrl);
    } else {
      navigate(-1); // Native browser history back
    }
  };

  return (
    <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 py-4 font-sans mb-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Side: Back Button & Title / Trail */}
        <div className="space-y-1.5">
          {/* Breadcrumb Trail */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <button 
              onClick={() => navigate('/')} 
              className="hover:text-blue-600 flex items-center gap-1 transition"
            >
              <Home size={12} /> Home
            </button>
            <ChevronRight size={12} className="text-slate-300" />
            <button 
              onClick={() => navigate('/conferences')} 
              className="hover:text-blue-600 transition"
            >
              Conferences
            </button>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight size={12} className="text-slate-300" />
                <span className={idx === breadcrumbs.length - 1 ? 'text-slate-700 font-bold' : ''}>
                  {crumb.label}
                </span>
              </React.Fragment>
            ))}
          </nav>

          {/* Heading + Back Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition active:scale-95 shadow-sm"
              title="Return to previous page"
              aria-label="Go back"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                {title}
              </h1>
              {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
            </div>
          </div>
        </div>

        {/* Right Side: Action Slots (e.g., Export, Refresh, Add Event) */}
        {actions && (
          <div className="flex items-center gap-2.5 shrink-0">
            {actions}
          </div>
        )}

      </div>
    </div>
  );
};

export default ConferencePageHeader;