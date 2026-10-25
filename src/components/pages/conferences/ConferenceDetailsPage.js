// src/components/pages/conferences/ConferenceDetailsPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowRight, 
  ExternalLink, 
  FileText, 
  Award, 
  Layers 
} from 'lucide-react';
import { API_BASE_URL, STATIC_ASSETS_BASE_URL } from '../../../utils/constants';
import PrimaryButton from '../../common/PrimaryButton';
import ConferencePageHeader from './common/ConferencePageHeader';
import ConferenceScheduleView from './ConferenceScheduleView';

const ConferenceDetailsPage = () => {
    const { conferenceId } = useParams();
    const navigate = useNavigate();

    const [conference, setConference] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!conferenceId) {
            setError("Conference ID is missing.");
            setLoading(false);
            return;
        }

        const fetchConferenceDetails = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/conferences/${conferenceId}`);
                if (response.data.success && response.data.data) {
                    setConference(response.data.data);
                } else {
                    throw new Error("Unable to retrieve conference record.");
                }
            } catch (err) {
                setError(err.response?.data?.message || "Conference event not found.");
            } finally {
                setLoading(false);
            }
        };
        fetchConferenceDetails();
    }, [conferenceId]);

    const formatDateTime = (isoDateString) => {
        if (!isoDateString) return 'Date to be confirmed';
        return new Date(isoDateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
                <div className="animate-pulse space-y-3 text-center">
                    <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Loading Event Details...</p>
                </div>
            </div>
        );
    }

    if (error || !conference) {
        return (
            <div className="min-h-screen bg-slate-50 py-20 px-4 font-sans text-center space-y-4">
                <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-3">
                    <h2 className="text-xl font-bold text-slate-900">Event Not Found</h2>
                    <p className="text-xs text-slate-500">{error || "The requested conference is not available."}</p>
                    <PrimaryButton onClick={() => navigate('/conferences')} className="w-full justify-center">
                        Return to All Events
                    </PrimaryButton>
                </div>
            </div>
        );
    }

    const bannerImage = conference.images?.length > 0 
        ? `${STATIC_ASSETS_BASE_URL}${conference.images[0].image_url}` 
        : null;

    return (
        <div className="bg-slate-50 min-h-screen pb-20 font-sans">
            
            {/* 🌟 UNIFIED BACK BUTTON & BREADCRUMB HEADER 🌟 */}
            <ConferencePageHeader 
                title={conference.title}
                subtitle={`${conference.location || 'Addis Ababa'} • ${new Date(conference.date || conference.start_date).getFullYear()}`}
                backUrl="/conferences"
                breadcrumbs={[{ label: conference.title }]}
                actions={
                  conference.registration_link && (
                    <a
                      href={conference.registration_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-sm inline-flex items-center gap-1.5"
                    >
                      <span>Register / RSVP</span>
                      <ExternalLink size={13} />
                    </a>
                  )
                }
            />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
                
                {/* Event Main Banner Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
                    
                    {/* Cover Photo */}
                    {bannerImage && (
                        <div className="rounded-2xl overflow-hidden aspect-video max-h-96 w-full shadow-inner bg-slate-100">
                            <img 
                                src={bannerImage} 
                                alt={conference.title} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Metadata Chips */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                        <div className="flex items-center gap-2.5">
                            <Calendar size={18} className="text-blue-600 shrink-0" />
                            <div>
                                <span className="font-bold text-slate-800 block">Date & Starting Time</span>
                                <span className="text-slate-500">{formatDateTime(conference.date || conference.start_date)}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                            <MapPin size={18} className="text-rose-500 shrink-0" />
                            <div>
                                <span className="font-bold text-slate-800 block">Venue Location</span>
                                <span className="text-slate-500">{conference.location || conference.venue || 'Addis Ababa University'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Description HTML Body */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">
                            About this Gathering
                        </h3>
                        <div 
                            className="prose prose-sm max-w-none text-slate-700 leading-relaxed space-y-2"
                            dangerouslySetInnerHTML={{ __html: conference.description || '<p>No description provided.</p>' }} 
                        />
                    </div>
                </div>

                {/* 🌟 EMBEDDED PROGRAM / SCHEDULE VIEW 🌟 */}
                {/* <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
                    <div className="border-b border-slate-100 pb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block">
                            Scientific Timetable
                        </span>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                            Presentations & Lecture Schedule
                        </h2>
                    </div>

                    <ConferenceScheduleView 
                        conferenceId={conference.conference_id || conference.id} 
                    />
                </div> */}

            </div>
        </div>
    );
};

export default ConferenceDetailsPage;

