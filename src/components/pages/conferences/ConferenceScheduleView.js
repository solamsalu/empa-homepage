// src/components/pages/conferences/ConferenceScheduleView.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  Layers, 
  Search, 
  ChevronDown, 
  CalendarPlus, 
  Quote, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Printer, 
  BookOpen, 
  Award, 
  ShieldCheck, 
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { API_BASE_URL } from '../../../utils/constants';
import LatexRenderer from '../../common/LatexRenderer';
import CitationModal from './common/CitationModal';

const cleanHtml = (text) => text ? text.replace(/<[^>]*>?/gm, '').trim() : '';

const ConferenceScheduleView = ({ conferenceId, onBack }) => {
  const [schedule, setSchedule] = useState([]);
  const [conferenceInfo, setConferenceInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('all');
  const [expandedPaperId, setExpandedPaperId] = useState(null);
  const [citingPaper, setCitingPaper] = useState(null);

  // Pagination for web screen
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchProgramAndInfo = async () => {
      setLoading(true);
      try {
        const id = conferenceId || 10;
        
        // 1. Fetch presentations
        const resProg = await axios.get(`${API_BASE_URL}/conference-papers/public/program/${id}`);
        setSchedule(resProg.data.data || []);

        // 2. Fetch conference details
        try {
          const resConf = await axios.get(`${API_BASE_URL}/conferences/${id}`);
          setConferenceInfo(resConf.data.data || null);
        } catch (e) {
          // Fallback gracefully
        }
      } catch (err) {
        console.error('Failed to load conference schedule:', err);
        setSchedule([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProgramAndInfo();
  }, [conferenceId]);

  // Google Calendar Integration
  const generateGoogleCalendarUrl = (paper) => {
    if (!paper.scheduled_session_time) return '#';
    const startTime = new Date(paper.scheduled_session_time);
    const endTime = new Date(startTime.getTime() + 25 * 60 * 1000);

    const toGCalDate = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const title = encodeURIComponent(`[EMPA] ${cleanHtml(paper.title)}`);
    const details = encodeURIComponent(
      `Format: ${paper.presentation_type === 'oral' ? 'Oral Lecture (20 Mins)' : 'Poster Session'}\n` +
      `Authors: ${paper.authors_list}\n\nAbstract:\n${cleanHtml(paper.abstract)}`
    );
    const location = encodeURIComponent(paper.scheduled_room || 'Main Auditorium, Addis Ababa, Ethiopia');

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${toGCalDate(startTime)}/${toGCalDate(endTime)}&details=${details}&location=${location}`;
  };

  // Screen Filters
  const filteredSchedule = schedule.filter(paper => {
    const q = search.toLowerCase();
    const matchesSearch = 
      cleanHtml(paper.title).toLowerCase().includes(q) ||
      (paper.authors_list && paper.authors_list.toLowerCase().includes(q));
    const matchesTrack = selectedTrack === 'all' || (paper.track_name || 'General') === selectedTrack;
    return matchesSearch && matchesTrack;
  });

  const totalPages = Math.ceil(filteredSchedule.length / itemsPerPage) || 1;
  const paginatedPapers = filteredSchedule.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Group current page items for interactive screen
  const groupedByDate = paginatedPapers.reduce((acc, curr) => {
    const dateKey = curr.scheduled_session_time 
      ? new Date(curr.scheduled_session_time).toLocaleDateString('en-US', { 
          weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' 
        })
      : 'Program Sessions';

    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(curr);
    return acc;
  }, {});

  // Group ALL presentations for print monograph
  const printGroupedByDate = filteredSchedule.reduce((acc, curr) => {
    const dateKey = curr.scheduled_session_time 
      ? new Date(curr.scheduled_session_time).toLocaleDateString('en-US', { 
          weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' 
        })
      : 'Program Sessions';

    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(curr);
    return acc;
  }, {});

  const tracks = ['all', ...new Set(schedule.map(s => s.track_name || 'General').filter(Boolean))];

  // Dynamic Titles
  const rawConfTitle = conferenceInfo?.title || 'Annual National Conference on Mathematical Sciences';
  const confTitle = /^\d+$/.test(rawConfTitle.trim()) 
    ? `The ${rawConfTitle} Annual National Conference on Mathematical Sciences` 
    : rawConfTitle;

  const confVenue = conferenceInfo?.location || conferenceInfo?.venue || 'Addis Ababa University, Science Campus';
  const confHost = conferenceInfo?.host_institution || 'Addis Ababa University';
  const confSponsors = conferenceInfo?.sponsors_text || 'Ministry of Innovation & Technology (MInT) • African Mathematical Union (AMU) • ICTP';
  const confYear = conferenceInfo?.start_date ? new Date(conferenceInfo.start_date).getFullYear() : new Date().getFullYear();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* 🌟 PRECISE A4 PRINT STYLESHEET (NO OVERFLOW, STRICT COLOR RETENTION) 🌟 */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm 10mm 12mm 10mm;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          body * {
            visibility: hidden !important;
          }
          #academic-book-of-abstracts, #academic-book-of-abstracts * {
            visibility: visible !important;
          }
          #academic-book-of-abstracts {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            display: block !important;
            background: #ffffff !important;
          }
          /* Strictly lock cover page to 255mm so it NEVER spills onto Page 2 */
          .print-cover-page {
            height: 255mm !important;
            max-height: 255mm !important;
            box-sizing: border-box !important;
            padding: 8mm !important;
            margin: 0 !important;
            page-break-after: always !important;
            break-after: page !important;
            overflow: hidden !important;
          }
          .print-page-break {
            page-break-after: always !important;
            break-after: page !important;
          }
          .avoid-break {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />

      {/* 🌟 WEB SCREEN: CONTROLS & NAVIGATION BAR 🌟 */}
      <div className="no-print flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-600 hover:text-blue-600 transition px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm shrink-0"
          >
            <ArrowLeft size={14} /> Back to Events
          </button>
        )}

        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search lectures, authors, or topics..." 
            value={search} 
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" 
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
            <Filter size={14} className="text-slate-400" />
            <select 
              value={selectedTrack} 
              onChange={(e) => { setSelectedTrack(e.target.value); setCurrentPage(1); }} 
              className="bg-transparent text-xs font-bold text-slate-700 outline-none"
            >
              {tracks.map(t => <option key={t} value={t}>{t === 'all' ? 'All Scientific Tracks' : t}</option>)}
            </select>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-lg shadow-blue-950/20 shrink-0 active:scale-95 border border-blue-800/40"
            title="Export full-color Book of Abstracts with Cover Page, Table of Contents, and Timetable"
          >
            <BookOpen size={15} className="text-amber-400" />
            <span>Export Book of Abstracts (PDF)</span>
          </button>
        </div>
      </div>

      {/* 🌟 WEB SCREEN: INTERACTIVE SESSIONS VIEW 🌟 */}
      {loading ? (
        <div className="no-print py-24 text-center text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">
          Compiling Scientific Timetable...
        </div>
      ) : filteredSchedule.length === 0 ? (
        <div className="no-print bg-white rounded-3xl p-16 text-center border border-dashed border-slate-200 space-y-2">
          <Calendar className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="text-base font-bold text-slate-800">No Scheduled Sessions Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Accepted presentations are currently being organized into the timetable by the program committee.
          </p>
        </div>
      ) : (
        <div className="no-print space-y-8">
          {Object.entries(groupedByDate).map(([dateLabel, items]) => (
            <div key={dateLabel} className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <Calendar className="text-blue-600" size={18} />
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">
                  {dateLabel}
                </h3>
                <span className="text-xs text-slate-400 font-bold ml-auto">
                  {items.length} Lectures Scheduled
                </span>
              </div>

              <div className="grid gap-3">
                {items.map(paper => {
                  const isExpanded = expandedPaperId === paper.id;
                  const sessionTime = paper.scheduled_session_time 
                    ? new Date(paper.scheduled_session_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                    : 'Time TBA';

                  return (
                    <div 
                      key={paper.id} 
                      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-blue-400 transition"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1.5 flex-grow">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-100">
                              <Clock size={12} /> {sessionTime}
                            </span>
                            <span className="flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                              <MapPin size={12} /> {paper.scheduled_room || 'Main Hall'}
                            </span>
                            <span className="text-[10px] font-black uppercase text-slate-500 bg-slate-50 px-2 py-0.5 rounded border">
                              {paper.presentation_type === 'poster' ? 'Poster Session' : 'Oral Lecture (20 Mins)'}
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-slate-900 leading-snug">
                            <LatexRenderer content={cleanHtml(paper.title)} />
                          </h4>

                          <p className="text-xs text-slate-600 flex items-center gap-1.5">
                            <User size={13} className="text-slate-400 shrink-0" />
                            <span className="font-semibold text-slate-700">{paper.authors_list}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
                          {paper.scheduled_session_time && (
                            <a
                              href={generateGoogleCalendarUrl(paper)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 px-3 py-1.5 rounded-xl border border-slate-200 transition"
                            >
                              <CalendarPlus size={13} className="text-blue-600" />
                              <span className="hidden sm:inline">Add to Calendar</span>
                            </a>
                          )}

                          <button
                            onClick={() => setCitingPaper(paper)}
                            className="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 px-3 py-1.5 rounded-xl border border-slate-200 transition"
                          >
                            <Quote size={13} className="text-blue-600" />
                            <span>Cite</span>
                          </button>

                          <button 
                            onClick={() => setExpandedPaperId(isExpanded ? null : paper.id)} 
                            className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-blue-600 transition px-2.5 py-1.5 rounded-xl bg-slate-50"
                          >
                            <span>Abstract</span>
                            <ChevronDown size={14} className={`transform transition duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50 p-4 rounded-xl text-xs text-slate-700 leading-relaxed font-serif">
                          <LatexRenderer content={cleanHtml(paper.abstract)} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Web Screen Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center pt-6 border-t border-slate-200">
              <span className="text-xs text-slate-500 font-bold">
                Page {currentPage} of {totalPages} ({filteredSchedule.length} total presentations)
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition shadow-sm"
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition ${
                        currentPage === i + 1 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition shadow-sm"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          🌟 100% PRECISE A4 ACADEMIC PROCEEDINGS & BOOK OF ABSTRACTS (PRINT ONLY) 🌟
          ========================================================================= */}
      <div id="academic-book-of-abstracts" className="hidden print:block font-serif text-slate-900 leading-relaxed bg-white">
        
        {/* --- 🌟 PAGE 1: LUXURY FULL-COLOR COVER PAGE (EXACT 255mm HEIGHT) 🌟 --- */}
        <div className="print-cover-page">
          <div className="relative w-full h-full border-[5px] border-[#0d233f] p-6 flex flex-col justify-between text-center overflow-hidden bg-[#fffefb]">
            
            {/* Inner Gold Frame */}
            <div className="absolute inset-1.5 border-2 border-amber-500/80 pointer-events-none" />

            {/* Centered Mathematical Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none select-none z-0">
              <span className="text-[240px] font-black text-[#0d233f]">∑</span>
            </div>

            {/* Top Seals Header */}
            <div className="relative z-10 flex items-center justify-between border-b-2 border-amber-500/40 pb-4 px-2">
              <div className="flex items-center gap-2.5 text-left">
                <div className="w-14 h-14 rounded-full border-2 border-[#0d233f] bg-white flex flex-col items-center justify-center shadow-sm">
                  <span className="font-serif font-black text-lg text-[#0d233f] leading-none">EMPA</span>
                  <span className="text-[7px] font-mono uppercase tracking-widest text-amber-700 mt-0.5">1978</span>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0d233f] block">
                    የኢትዮጵያ ማቲማቲክስ ባለሙያዎች ማህበር
                  </span>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">
                    Ethiopian Mathematical Professionals Association
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-right">
                <div>
                  <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 block">
                    Academic Host
                  </span>
                  <span className="text-[9px] font-bold text-slate-800">{confHost}</span>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-slate-300 bg-slate-50 flex items-center justify-center shadow-sm">
                  <GraduationCap size={20} className="text-blue-900" />
                </div>
              </div>
            </div>

            {/* Main Title Center Block */}
            <div className="relative z-10 my-auto py-4 space-y-4">
              <div className="inline-block px-4 py-1 rounded-full bg-[#0d233f] text-amber-300 text-[9px] font-black uppercase tracking-[0.25em] font-sans shadow-sm">
                Official Proceedings & Program Monograph
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wide text-[#0d233f] leading-tight max-w-xl mx-auto">
                {confTitle}
              </h1>
              
              <p className="text-base font-serif italic text-amber-900 font-bold max-w-md mx-auto">
                Book of Abstracts & Scientific Timetable
              </p>

              <div className="w-32 h-0.5 bg-amber-500 mx-auto" />

              {/* Mathematical Identity Banner */}
              <div className="text-[10px] font-mono py-2 px-4 text-slate-800 bg-amber-50/80 border border-amber-300/80 rounded-xl max-w-md mx-auto font-bold tracking-wider shadow-sm">
                {"∇ · B = 0   |   χ(M) = 1/(2π) ∫_M K dA   |   e^(iπ) + 1 = 0"}
              </div>
            </div>

            {/* Venue & Publication Colophon */}
            <div className="relative z-10 pt-4 border-t-2 border-amber-500/40 text-[11px] text-slate-700 space-y-1">
              <p className="font-bold text-slate-900 text-xs">
                Venue: {confVenue}
              </p>
              <p className="text-blue-950 font-semibold text-[10px]">
                Conducted in Academic Partnership with {confHost}
              </p>
              <p className="text-[9px] text-slate-500 uppercase tracking-wider">
                Patrons & Sponsors: {confSponsors}
              </p>
              <div className="pt-2 text-[8px] font-mono text-slate-400">
                Published by EMPA Academic Press • ISSN 2789-2158 • © {confYear} All Rights Reserved
              </div>
            </div>

          </div>
        </div>

        {/* --- 🌟 PAGE 2: WELCOME ADDRESS & SCIENTIFIC COMMITTEES (RICH FRONT-MATTER) 🌟 --- */}
        <div className="print-page-break p-6 space-y-5 text-xs leading-relaxed">
          <div className="border-b-2 border-[#0d233f] pb-2 flex justify-between items-end">
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-amber-700 block">
                Official Welcome & Council
              </span>
              <h2 className="text-lg font-black uppercase tracking-wider text-[#0d233f]">
                Scientific Leadership & Foreword
              </h2>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Preliminaries</span>
          </div>

          {/* Welcome Address */}
          <div className="p-4 rounded-xl bg-[#faf8f4] border border-amber-200/80 space-y-2 text-justify">
            <h3 className="font-bold text-xs text-[#0d233f] flex items-center gap-2">
              <Award size={14} className="text-amber-600" /> Welcome Address from the Leadership
            </h3>
            <p className="text-[10px] text-slate-700 leading-relaxed font-serif">
              On behalf of the Executive Committee of the Ethiopian Mathematical Professionals Association (EMPA) and our host, {confHost}, we warmly welcome all researchers, educators, and students to this annual scientific gathering. Mathematics remains the cornerstone of modern engineering, computing, and technological advancement across Africa.
            </p>
            <p className="text-[10px] text-slate-700 leading-relaxed font-serif">
              This monograph compiles peer-reviewed contributions across pure mathematics, applied modeling, optimization, and statistical sciences. We express our sincere gratitude to the referees whose meticulous scrutiny upholds our scholarly rigor.
            </p>
            <div className="pt-1 flex justify-between items-center text-[9px] font-bold text-slate-800 font-sans">
              <span>Prof. Berhanu Guta, President</span>
              <span>Scientific Program Committee Chair</span>
            </div>
          </div>

          {/* Committees Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/80 space-y-1.5">
              <h4 className="font-bold text-[11px] text-[#0d233f] border-b border-blue-200 pb-1">
                Executive Leadership
              </h4>
              <ul className="space-y-1 text-[10px] text-slate-800">
                <li>• <strong>President:</strong> Prof. Berhanu Guta (AAU)</li>
                <li>• <strong>Vice President:</strong> Dr. Tilahun Abebe (AAU)</li>
                <li>• <strong>Secretary General:</strong> Dr. Endalcachew Chekole (BDU)</li>
                <li>• <strong>Managing Editor, JEMPA:</strong> Editorial Directorate</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-1.5">
              <h4 className="font-bold text-[11px] text-emerald-950 border-b border-emerald-200 pb-1">
                Thematic Review Sections
              </h4>
              <ul className="space-y-0.5 text-[10px] text-slate-800">
                <li>• <strong>Section I:</strong> Pure Mathematics & Analysis</li>
                <li>• <strong>Section II:</strong> Applied Math & Modeling</li>
                <li>• <strong>Section III:</strong> Statistics & Data Science</li>
                <li>• <strong>Section IV:</strong> Pedagogy & Education</li>
              </ul>
            </div>
          </div>

          {/* Participant Information */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <h4 className="font-bold text-[10px] uppercase tracking-wider text-slate-800">
              Information for Presenters & Participants
            </h4>
            <ul className="text-[10px] text-slate-600 space-y-0.5">
              <li>• <strong>Oral Lectures:</strong> 15 minutes of presentation followed by 5 minutes of discussion and Q&A.</li>
              <li>• <strong>Poster Sessions:</strong> Dedicated display and interactive question period during designated coffee intervals.</li>
              <li>• <strong>Proceedings Archive:</strong> Extended versions will be archived in the permanent EMPA repository.</li>
            </ul>
          </div>

          {/* Integrity Note */}
          <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/70 text-[9px] text-slate-600 flex items-start gap-2">
            <ShieldCheck size={14} className="text-emerald-600 shrink-0 mt-0.5" />
            <p>
              <strong>Double-Blind Peer Review Certification:</strong> All recorded abstracts were evaluated by independent referees appointed by the EMPA Scientific Committee under standard COPE publication ethics.
            </p>
          </div>
        </div>

        {/* --- 🌟 PAGE 3: TIMETABLE & ABSTRACTS (FLOWS NATURALLY TOGETHER) 🌟 --- */}
        <div className="p-6 space-y-6 text-xs">
          
          {/* Section Heading: Timetable */}
          <div className="border-b-2 border-[#0d233f] pb-2 flex justify-between items-end avoid-break">
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-blue-700 block">
                Session Index
              </span>
              <h2 className="text-base font-black uppercase tracking-wider text-[#0d233f]">
                Scientific Timetable & Schedule Matrix
              </h2>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Timetable</span>
          </div>

          {/* Timetable Table */}
          <div className="space-y-4 avoid-break">
            {Object.entries(printGroupedByDate).map(([dateLabel, items]) => (
              <div key={`toc-${dateLabel}`} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-[#0d233f] text-white px-3 py-1.5 font-bold text-xs flex justify-between items-center">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-amber-400" /> {dateLabel}
                  </span>
                  <span className="text-[9px] uppercase font-mono tracking-wider text-amber-300">
                    {items.length} Parallel Presentations
                  </span>
                </div>

                <table className="w-full text-left border-collapse text-[11px]">
                  <thead className="bg-slate-100 text-[9px] uppercase font-mono text-slate-600 border-b">
                    <tr>
                      <th className="py-1.5 px-3 w-24">Slot Time</th>
                      <th className="py-1.5 px-3 w-32">Hall / Room</th>
                      <th className="py-1.5 px-3">Presentation Title & Presenter</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((p, i) => (
                      <tr key={`toc-row-${p.id}`} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <td className="py-1.5 px-3 font-mono font-bold text-indigo-700 text-[10px] align-top">
                          {p.scheduled_session_time ? new Date(p.scheduled_session_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBA'}
                        </td>
                        <td className="py-1.5 px-3 font-semibold text-slate-800 text-[10px] align-top">
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-slate-700">
                            {p.scheduled_room || 'Main Hall'}
                          </span>
                        </td>
                        <td className="py-1.5 px-3 align-top space-y-0.5">
                          <span className="font-bold text-slate-900 block leading-tight">{cleanHtml(p.title)}</span>
                          <span className="text-slate-500 italic text-[10px] block">{p.authors_list}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          {/* Section Heading: Full Abstracts */}
          <div className="border-b-2 border-[#0d233f] pb-2 pt-4 flex justify-between items-end avoid-break">
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-700 block">
                Technical Summaries
              </span>
              <h2 className="text-base font-black uppercase tracking-wider text-[#0d233f]">
                Contributed & Plenary Research Abstracts
              </h2>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Abstracts</span>
          </div>

          {/* Mathematical Abstracts Cards */}
          <div className="space-y-5">
            {Object.entries(printGroupedByDate).map(([dateLabel, items]) => (
              <div key={`abstracts-${dateLabel}`} className="space-y-4">
                <div className="bg-slate-900 text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg flex justify-between items-center avoid-break">
                  <span>Session Date: {dateLabel}</span>
                  <span className="text-[9px] text-amber-300 font-mono">EMPA-{confYear}</span>
                </div>

                <div className="space-y-4">
                  {items.map((paper, idx) => (
                    <div 
                      key={`full-paper-${paper.id}`} 
                      className="avoid-break border-2 border-slate-200 rounded-xl p-4 space-y-2.5 bg-[#fffefb] shadow-sm relative overflow-hidden"
                    >
                      {/* Left Colored Accent Bar */}
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-700" />

                      {/* Header Badge Row */}
                      <div className="flex justify-between items-center text-[10px] font-mono pb-1 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                          <span className="bg-indigo-100 text-indigo-900 font-bold px-2 py-0.5 rounded">
                            {paper.scheduled_session_time ? new Date(paper.scheduled_session_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBA'}
                          </span>
                          <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded border border-slate-200">
                            {paper.scheduled_room || 'Main Hall'}
                          </span>
                        </div>
                        <span className="font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full text-[9px]">
                          {paper.presentation_type === 'poster' ? 'Poster Contribution' : 'Oral Lecture (20 Mins)'}
                        </span>
                      </div>

                      {/* Presentation Title */}
                      <h3 className="text-sm font-bold text-[#0d233f] leading-snug">
                        {idx + 1}. {cleanHtml(paper.title)}
                      </h3>

                      {/* Authors */}
                      <p className="text-xs italic text-slate-800 font-serif">
                        <User size={11} className="inline mr-1 text-slate-400" />
                        {paper.authors_list}
                      </p>

                      {/* Abstract Container */}
                      <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-justify leading-relaxed font-serif text-slate-800 shadow-sm">
                        <span className="font-sans text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                          Abstract Summary:
                        </span>
                        {cleanHtml(paper.abstract)}
                      </div>

                      {/* Metadata Footer */}
                      <div className="pt-1.5 border-t border-slate-200 flex justify-between text-[9px] text-slate-500 font-mono">
                        <span className="text-blue-900 font-bold">Track: {paper.track_name || 'General Mathematical Sciences'}</span>
                        <span className="text-slate-400">Ref: CONF-{paper.id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Colophon Sign-off */}
          <div className="pt-6 text-center text-[10px] text-slate-500 border-t-2 border-slate-300 space-y-1 font-sans avoid-break">
            <p className="font-bold uppercase tracking-wider text-slate-800">
              Ethiopian Mathematical Professionals Association (EMPA)
            </p>
            <p>Secretariat: Science Campus, Addis Ababa University • Tel: +251-111-239461 • Email: conference@eth-math.org</p>
            <p className="text-[9px] italic text-slate-400">Official conference repository: www.eth-math.org</p>
          </div>

        </div>

      </div>

      {/* Citation Modal */}
      {citingPaper && (
        <CitationModal 
          paper={citingPaper} 
          onClose={() => setCitingPaper(null)} 
        />
      )}

    </div>
  );
};

export default ConferenceScheduleView;