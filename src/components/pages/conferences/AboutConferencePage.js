// src/components/pages/conferences/AboutConferencePage.js
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    Users,
    BookOpen,
    Target,
    Calendar,
    HelpCircle,
    CheckCircle2,
    Clock,
    ArrowRight,
    Info
} from 'lucide-react';
import { API_BASE_URL } from '../../../utils/constants';
import { AuthContext } from '../../../context/AuthContext'; // 🌟 1. Consume AuthContext
import KeynoteSpeakersSection from './KeynoteSpeakersSection';

const AboutConferencePage = () => {
    // 🌟 2. Retrieve isSubmissionOpen from AuthContext
    const { isSubmissionOpen } = useContext(AuthContext);

    const [activeConference, setActiveConference] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const formatDateTime = (dateInput) => {
        if (!dateInput) return '';
        return new Date(dateInput).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    useEffect(() => {
        const checkActiveSubmission = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get(`${API_BASE_URL}/submissions/active`);
                const rawList = res.data.data || [];

                const nowMs = Date.now();

                const trulyActive = rawList.filter(conf => {
                    if (!conf.submission_end_date) return false;
                    const startMs = conf.submission_start_date ? new Date(conf.submission_start_date).getTime() : 0;
                    const endMs = new Date(conf.submission_end_date).getTime();

                    return (nowMs >= startMs - 120000) && (nowMs <= endMs);
                });

                if (trulyActive.length > 0) {
                    setActiveConference(trulyActive[0]);
                } else {
                    setActiveConference(null);
                }
            } catch (err) {
                setActiveConference(null);
            } finally {
                setIsLoading(false);
            }
        };
        checkActiveSubmission();
    }, []);

    // 🌟 TRIPLE-CHECK: Closed if AuthContext says false OR no active conference within date window
    const isClosed = activeConference === null;

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-white rounded-3xl shadow-xl max-w-none mx-auto font-sans space-y-10">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
                <span className="text-xs font-black uppercase tracking-widest text-blue-600">
                    EMPA Annual Gathering
                </span>
                <h2 className="text-4xl font-extrabold text-blue-900 leading-tight">
                    About Our Annual Conference
                </h2>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                    The Ethiopian Mathematical Professionals Association (EMPA) annually hosts a premier gathering for the mathematical community to foster innovation, research collaboration, and scientific advancement.
                </p>
            </div>

            {/* 🌟 SUBMISSION STATUS DISPLAY 🌟 */}
            <section className="rounded-3xl overflow-hidden border transition-all">
                {isLoading ? (
                    <div className="p-8 text-center text-xs font-bold uppercase tracking-widest text-slate-400 animate-pulse bg-slate-50">
                        Checking Call for Papers Status...
                    </div>
                ) : !isClosed ? (
                    /* --- SUBMISSIONS ARE OPEN --- */
                    <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 p-8 text-center rounded-3xl space-y-4">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
                            <CheckCircle2 size={15} /> Call for Papers Open
                        </div>

                        <div className="space-y-1 max-w-2xl mx-auto">
                            <h3 className="text-2xl font-black text-emerald-950">
                                Submissions Are Currently Open!
                            </h3>
                            <p className="text-sm text-emerald-800">
                                We are actively accepting paper submissions for <strong>{activeConference.title}</strong>. Share your research with the national and international mathematical community.
                            </p>
                        </div>

                        {activeConference.submission_end_date && (
                            <p className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1.5">
                                <Clock size={14} /> Submission Deadline: {formatDateTime(activeConference.submission_end_date)}
                            </p>
                        )}

                        <div className="pt-2">
                            <Link
                                to="/submit-paper"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20 active:scale-95"
                            >
                                <span>Submit Your Paper Now</span>
                                <ArrowRight size={15} />
                            </Link>
                        </div>
                    </div>
                ) : (
                    /* --- SUBMISSIONS ARE CLOSED (EXACT WORDING REQUESTED) --- */
                    <div className="bg-slate-50 border border-slate-200 p-8 text-center rounded-3xl space-y-3">
                        <div className="w-12 h-12 bg-slate-200/60 rounded-2xl flex items-center justify-center mx-auto text-slate-500">
                            <Info size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">
                            Submissions Are Currently Closed
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                            Thank you for your interest. The submission window is closed. Please review our upcoming schedule or check back for our next call for papers.
                        </p>
                        <div className="pt-2">
                            <Link
                                to="/conferences"
                                className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
                            >
                                <span>View Upcoming Events & Schedule</span>
                                <ArrowRight size={13} />
                            </Link>
                        </div>
                    </div>
                )}
            </section>

            {/* Vision & Mission */}
            <section className="p-8 bg-blue-50/70 rounded-3xl border border-blue-200 space-y-4">
                <h3 className="text-2xl font-bold text-blue-900 flex items-center gap-2.5">
                    <Target className="w-6 h-6 text-blue-600" /> Our Vision & Mission
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                    Our annual conference is a cornerstone event for advancing mathematical sciences and promoting research excellence in Ethiopia and across the continent. We aim to create a vibrant platform where innovative ideas flourish and collaborations ignite.
                </p>
                <p className="text-gray-700 text-sm leading-relaxed">
                    We are dedicated to highlighting significant contributions in both pure and applied mathematics, addressing contemporary challenges, and exploring emerging trends that shape the future of the discipline.
                </p>
            </section>

            {/* Keynote & Plenary Speakers Section */}
            <KeynoteSpeakersSection />

            {/* Key Themes & Topics */}
            <section className="p-8 bg-emerald-50/60 rounded-3xl border border-emerald-200 space-y-4">
                <h3 className="text-2xl font-bold text-emerald-900 flex items-center gap-2.5">
                    <BookOpen className="w-6 h-6 text-emerald-600" /> Key Thematic Tracks
                </h3>
                <p className="text-gray-700 text-sm mb-4">
                    Each year, our conference delves into impactful research tracks reflecting the dynamic landscape of mathematical sciences and computational applications:
                </p>
                <ul className="grid sm:grid-cols-2 gap-3 text-gray-700 text-xs font-medium">
                    <li className="bg-white p-3 rounded-xl border border-emerald-100 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> Pure Mathematics: Algebra, Analysis, Topology, Geometry
                    </li>
                    <li className="bg-white p-3 rounded-xl border border-emerald-100 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> Applied Mathematics & Mathematical Modeling
                    </li>
                    <li className="bg-white p-3 rounded-xl border border-emerald-100 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> Optimization, Scientific Computing & Numerical Methods
                    </li>
                    <li className="bg-white p-3 rounded-xl border border-emerald-100 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> Statistics, Probability & Data Science
                    </li>
                    <li className="bg-white p-3 rounded-xl border border-emerald-100 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> Mathematics Education & Pedagogical Innovations
                    </li>
                    <li className="bg-white p-3 rounded-xl border border-emerald-100 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> Financial Mathematics, Cryptography & Computer Science
                    </li>
                </ul>
            </section>

            {/* Who Should Attend */}
            <section className="p-8 bg-amber-50/60 rounded-3xl border border-amber-200 space-y-4">
                <h3 className="text-2xl font-bold text-amber-900 flex items-center gap-2.5">
                    <Users className="w-6 h-6 text-amber-600" /> Who Should Attend?
                </h3>
                <p className="text-gray-700 text-sm">
                    The EMPA Annual Conference brings together a diverse and engaged academic community:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 text-gray-700 text-xs">
                    <li>University faculty, research fellows, and post-doctoral scholars</li>
                    <li>Graduate and undergraduate students in mathematics and related disciplines</li>
                    <li>Mathematics educators at primary, secondary, and tertiary levels</li>
                    <li>Industry professionals applying mathematical algorithms in data, finance, and engineering</li>
                </ul>
            </section>

            {/* History & Impact */}
            <section className="p-8 bg-purple-50/60 rounded-3xl border border-purple-200 space-y-4">
                <h3 className="text-2xl font-bold text-purple-900 flex items-center gap-2.5">
                    <Calendar className="w-6 h-6 text-purple-600" /> History & Scientific Impact
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                    Our conferences have consistently served as vital incubators for intellectual exchange, significantly contributing to the dynamism of mathematical sciences in Ethiopia. These events have sparked lasting international research collaborations and led to publications in high-impact scholarly journals.
                </p>
            </section>

            {/* Contact & Inquiry Card */}
            <div className="p-8 bg-slate-900 rounded-3xl text-white text-center shadow-lg space-y-4">
                <h3 className="text-2xl font-bold flex items-center justify-center gap-2 text-white">
                    <HelpCircle className="w-6 h-6 text-blue-400" /> Get Involved with EMPA
                </h3>
                <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
                    Whether as an attendee, a distinguished presenter, or a volunteer, your participation is invaluable to our collective growth.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-xs font-semibold pt-2">
                    <p>Email: <a href="mailto:conference@eth-math.org" className="text-blue-400 hover:underline">conference@eth-math.org</a></p>
                    <span className="hidden sm:inline text-slate-600">|</span>
                    <p>Phone: <a href="tel:+251111239461" className="text-blue-400 hover:underline">+251-111-239461</a></p>
                </div>
            </div>
        </div>
    );
};

export default AboutConferencePage;