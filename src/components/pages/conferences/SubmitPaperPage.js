// src/components/pages/conferences/SubmitPaperPage.js
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Send, 
  UploadCloud, 
  AlertCircle, 
  Clock, 
  UserPlus, 
  LogIn, 
  Lock, 
  Mail, 
  User, 
  Sparkles,
  Calendar,
  MapPin,
  ArrowRight,
  BookOpen,
  FileText,
  Bell
} from 'lucide-react';
import { API_BASE_URL } from '../../../utils/constants';
import { AuthContext } from '../../../context/AuthContext';
import PrimaryButton from '../../common/PrimaryButton';
import LatexEditor from '../../common/LatexEditor';
import LatexRenderer from '../../common/LatexRenderer';

const SubmitPaperPage = () => {
  // 🌟 Consume isSubmissionOpen from AuthContext
  const { authToken, isLoggedIn, userName, handleLogin, isSubmissionOpen } = useContext(AuthContext);
  const navigate = useNavigate();

  // Conference & Track States
  const [openConferences, setOpenConferences] = useState([]);
  const [nextUpcomingConference, setNextUpcomingConference] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // Form Fields
  const [selectedConferenceId, setSelectedConferenceId] = useState('');
  const [selectedTrackId, setSelectedTrackId] = useState('');
  const [title, setTitle] = useState('');
  const [authorsList, setAuthorsList] = useState('');
  const [keywords, setKeywords] = useState('');
  const [abstract, setAbstract] = useState('');
  const [paperFile, setPaperFile] = useState(null);

  // Submission UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Fast-Track Auth States
  const [authTab, setAuthTab] = useState('register');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (isLoggedIn && userName) {
      setAuthorsList(prev => prev || userName);
    }
  }, [isLoggedIn, userName]);

  // 1. Fetch Active Conferences with Strict Date Validation
  useEffect(() => {
    const fetchConferencesData = async () => {
      setLoadingEvents(true);
      try {
        const activeRes = await axios.get(`${API_BASE_URL}/submissions/active`);
        const rawList = activeRes.data.data || [];
        
        // In src/components/pages/conferences/SubmitPaperPage.js:

    const nowMs = Date.now();

    const trulyActive = rawList.filter(conf => {
        if (!conf.submission_end_date) return false;
        const startMs = conf.submission_start_date ? new Date(conf.submission_start_date).getTime() : 0;
        const endMs = new Date(conf.submission_end_date).getTime();
        
        // Open if current time is after start time (with 2-min grace) and before end time
        return (nowMs >= startMs - 120000) && (nowMs <= endMs);
    });

    setOpenConferences(trulyActive);
    
        if (trulyActive.length > 0) {
          const firstConfId = trulyActive[0].conference_id || trulyActive[0].id;
          setSelectedConferenceId(firstConfId.toString());
        } else {
          // Submissions are closed: Fetch next upcoming conference for the announcement
          try {
            const allConfRes = await axios.get(`${API_BASE_URL}/conferences`);
            const allList = allConfRes.data.data || [];
            const upcoming = allList
              .filter(c => (c.event_type || 'annual_conference') === 'annual_conference')
              .sort((a, b) => new Date(a.date || a.start_date) - new Date(b.date || b.start_date));
            if (upcoming.length > 0) {
              setNextUpcomingConference(upcoming[0]);
            }
          } catch (e) {
            // Fallback gracefully
          }
        }
      } catch (err) {
        setOpenConferences([]);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchConferencesData();
  }, []);

  // 2. Fetch Tracks if an active conference exists
  useEffect(() => {
    const fetchConferenceTracks = async () => {
      if (!selectedConferenceId) return;
      try {
        const res = await axios.get(`${API_BASE_URL}/conference-papers/tracks/${selectedConferenceId}`);
        const trackList = res.data.data || [];
        setTracks(trackList);
        if (trackList.length > 0) setSelectedTrackId(trackList[0].id.toString());
      } catch (err) {
        setTracks([]);
      }
    };
    fetchConferenceTracks();
  }, [selectedConferenceId]);

  // Fast-Track Register
  const handleFastTrackRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/members/register-external-author`, {
        full_name: authName,
        email: authEmail,
        password: authPassword
      });
      const { authToken: token, data } = response.data;
      handleLogin(token, 'author', data.full_name, data.email);
      setAuthorsList(data.full_name);
      toast.success('Author account created! You can now submit your manuscript.');
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Quick Login
  const handleQuickLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/members/login`, {
        email: authEmail,
        password: authPassword
      });
      const { token, data } = response.data;
      handleLogin(token, data.role, data.full_name, data.email);
      setAuthorsList(data.full_name);
      toast.success(`Welcome back, ${data.full_name}!`);
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setAuthLoading(false);
    }
  };

  // PDF File Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      if (file.size > 15 * 1024 * 1024) {
        toast.error('PDF file size cannot exceed 15MB.');
        return;
      }
      setPaperFile(file);
    } else {
      setPaperFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      toast.error('Invalid document format. Only PDF files are accepted.');
    }
  };

  // Manuscript Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.warn('Please log in or create a free author account.');
      return;
    }
    if (!paperFile) {
      toast.warn('Please attach the blind PDF manuscript file.');
      return;
    }
    if (!selectedConferenceId || !title.trim() || !abstract.trim() || !authorsList.trim()) {
      toast.warn('Please complete all mandatory submission fields.');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('conferenceId', selectedConferenceId);
    formData.append('trackId', selectedTrackId || '');
    formData.append('title', title);
    formData.append('abstract', abstract);
    formData.append('authorsList', authorsList);
    formData.append('keywords', keywords);
    formData.append('file', paperFile);

    try {
      const response = await axios.post(`${API_BASE_URL}/conference-papers/submit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${authToken}` }
      });
      toast.success(response.data.message || 'Paper submitted successfully!');
      navigate('/conferences/author/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Server error while submitting paper.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading Screen
  if (loadingEvents) {
    return (
      <div className="py-24 text-center text-slate-500 font-bold text-sm animate-pulse font-sans">
        Checking Call for Papers Status...
      </div>
    );
  }

  // 🌟 TRIPLE-CHECK: Are submissions closed?
  // Closed if: AuthContext reports closed OR database has 0 active conferences
  const isSubmissionClosed = openConferences.length === 0;

  // =========================================================================
  // 🌟 CASE 1: SUBMISSIONS ARE CLOSED (FORM COMPLETELY DISAPPEARS) 🌟
  // =========================================================================
  if (isSubmissionClosed) {
    const nextDate = nextUpcomingConference?.date || nextUpcomingConference?.start_date;
    const formattedNextDate = nextDate 
      ? new Date(nextDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : 'Upcoming Academic Cycle';

    return (
      <div className="max-w-4xl mx-auto py-8 px-4 font-sans space-y-8 animate-in fade-in duration-300">
        
        {/* Closed Banner */}
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black uppercase tracking-wider">
            <Clock size={14} className="animate-pulse" /> Call for Papers Concluded
          </div>

          <div className="max-w-2xl mx-auto space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Submissions Are Currently Closed
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              The submission period for the current conference cycle has officially closed. All received manuscripts have advanced to double-blind peer review.
            </p>
          </div>

          {/* Link to Author Dashboard if logged in */}
          {isLoggedIn && (
            <div className="pt-2">
              <Link 
                to="/conferences/author/dashboard" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-blue-600/30"
              >
                <FileText size={16} /> Go to My Author Hub to Track Submissions
              </Link>
            </div>
          )}
        </div>

        {/* 🌟 ANNOUNCEMENT FOR NEXT ANNUAL CONFERENCE 🌟 */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-lg space-y-6">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
              <Bell size={22} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block">
                Official EMPA Announcement
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Looking Ahead: The Next Annual Conference
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
              <p>
                The Ethiopian Mathematical Professionals Association is actively preparing for its next flagship gathering:
              </p>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h3 className="text-base font-bold text-slate-900">
                  {nextUpcomingConference?.title || '35th Annual EMPA National Conference'}
                </h3>
                <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                  <p className="flex items-center gap-2">
                    <Calendar size={14} className="text-blue-600" />
                    <span>Target Date: <strong>{formattedNextDate}</strong></span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={14} className="text-rose-500" />
                    <span>Venue: <strong>{nextUpcomingConference?.location || 'Addis Ababa University, Ethiopia'}</strong></span>
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-500">
                The next Call for Papers window will be officially published here along with research tracks and formatting templates.
              </p>
            </div>

            <div className="space-y-3">
              <Link
                to="/conferences"
                className="w-full p-4 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 transition flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-xs font-bold text-blue-900">View Events & Program Timetable</h4>
                  <p className="text-[11px] text-blue-700 mt-0.5">Explore lectures, workshops, and scheduled talks</p>
                </div>
                <ArrowRight size={16} className="text-blue-600 group-hover:translate-x-1 transition" />
              </Link>

              <Link
                to="/conferences"
                className="w-full p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Review Author Submission Guidelines</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Prepare your manuscript formatting in advance</p>
                </div>
                <BookOpen size={16} className="text-slate-500 group-hover:translate-x-1 transition" />
              </Link>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <span className="font-bold block text-slate-800 mb-0.5">Inquiries regarding submissions:</span>
                Contact the Secretariat at <a href="mailto:conference@eth-math.org" className="text-blue-600 font-semibold hover:underline">conference@eth-math.org</a>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }

  // =========================================================================
  // 🌟 CASE 2: SUBMISSIONS ARE OPEN 🌟
  // =========================================================================
  return (
    <div className="font-sans space-y-8 max-w-4xl mx-auto py-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-8 rounded-3xl text-white shadow-xl text-center">
        <span className="text-xs uppercase font-extrabold tracking-widest text-blue-300">EMPA Conferences</span>
        <h1 className="text-3xl sm:text-4xl font-black mt-2">Submit Research Manuscript</h1>
        <p className="text-blue-100 text-sm max-w-2xl mx-auto mt-2 leading-relaxed">
          All papers undergo double-blind peer review. Please ensure author identities and affiliations are removed from the PDF manuscript body.
        </p>
      </div>

      {/* Fast-Track Author Authentication (Only if not logged in) */}
      {!isLoggedIn && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 block flex items-center gap-1">
                <Sparkles size={12} /> Instant Author Authentication
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                {authTab === 'register' ? 'Create Free Author Account' : 'Sign in to EMPA Account'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {authTab === 'register' 
                  ? 'No membership required. Automatically creates your author profile in the EMPA directory.' 
                  : 'Already registered as a member or author? Sign in to link your submission.'}
              </p>
            </div>

            <div className="flex bg-slate-200/70 p-1 rounded-xl shrink-0">
              <button
                type="button"
                onClick={() => { setAuthTab('register'); setAuthError(''); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${authTab === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Free Author Sign Up
              </button>
              <button
                type="button"
                onClick={() => { setAuthTab('login'); setAuthError(''); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${authTab === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Existing Login
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {authError && (
              <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-2">
                <AlertCircle size={16} /> {authError}
              </div>
            )}

            {authTab === 'register' ? (
              <form onSubmit={handleFastTrackRegister} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      required 
                      placeholder="Dr. Abebe Bikila" 
                      value={authName} 
                      onChange={e => setAuthName(e.target.value)} 
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <input 
                      type="email" 
                      required 
                      placeholder="author@university.edu" 
                      value={authEmail} 
                      onChange={e => setAuthEmail(e.target.value)} 
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <input 
                      type="password" 
                      required 
                      placeholder="••••••••" 
                      value={authPassword} 
                      onChange={e => setAuthPassword(e.target.value)} 
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none" 
                    />
                  </div>
                </div>

                <div className="sm:col-span-3 pt-2">
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {authLoading ? 'Setting up account...' : <><UserPlus size={16} /> Register Author & Unlock Submission Form</>}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleQuickLogin} className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email Address *</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="you@email.com" 
                    value={authEmail} 
                    onChange={e => setAuthEmail(e.target.value)} 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Password *</label>
                  <input 
                    type="password" 
                    required 
                    placeholder="••••••••" 
                    value={authPassword} 
                    onChange={e => setAuthPassword(e.target.value)} 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
                <div className="sm:col-span-2 pt-2">
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {authLoading ? 'Signing in...' : <><LogIn size={16} /> Sign In & Unlock Submission Form</>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Main Manuscript Submission Form */}
      <div className={`bg-white rounded-3xl border border-slate-200 shadow-sm p-8 transition-opacity duration-300 ${!isLoggedIn ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-slate-400 mb-2">Designated Conference *</label>
              <select 
                value={selectedConferenceId} 
                onChange={(e) => setSelectedConferenceId(e.target.value)} 
                required 
                className="w-full p-3 bg-slate-50 border rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {openConferences.map(c => <option key={c.conference_id || c.id} value={c.conference_id || c.id}>{c.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-slate-400 mb-2">Research Track</label>
              <select 
                value={selectedTrackId} 
                onChange={(e) => setSelectedTrackId(e.target.value)} 
                className="w-full p-3 bg-slate-50 border rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">General Mathematical Sciences</option>
                {tracks.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-400 mb-2">Paper Title (LaTeX Supported) *</label>
            <LatexEditor value={title} onChange={setTitle} placeholder="e.g., On the Stability of $\Delta u + \lambda u = 0$" required />
            {title.trim() && (
              <div className="mt-2 p-3 bg-slate-50 border rounded-xl">
                <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Preview:</span>
                <div className="text-sm font-bold text-blue-950"><LatexRenderer content={title} /></div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-400 mb-2">Author(s) & Institutional Affiliation *</label>
            <input 
              type="text" 
              required 
              placeholder="e.g., Dr. Abebe Kebede (AAU), Dr. Sara Hailu (ASTU)" 
              value={authorsList} 
              onChange={(e) => setAuthorsList(e.target.value)} 
              className="w-full p-3 bg-slate-50 border rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-400 mb-2">Abstract (250–350 Words) *</label>
            <LatexEditor value={abstract} onChange={setAbstract} placeholder="Provide a summary of the methodology, results, and conclusions..." required />
            {abstract.trim() && (
              <div className="mt-2 p-3 bg-slate-50 border rounded-xl">
                <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Preview:</span>
                <div className="text-xs text-slate-700 leading-relaxed font-serif"><LatexRenderer content={abstract} /></div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-400 mb-2">Keywords (Comma-separated) *</label>
            <input 
              type="text" 
              required 
              placeholder="e.g., Functional Analysis, Sobolev Spaces, PDE" 
              value={keywords} 
              onChange={(e) => setKeywords(e.target.value)} 
              className="w-full p-3 bg-slate-50 border rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-400 mb-2">Blind Manuscript (PDF Only, Max 15MB) *</label>
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
              <UploadCloud className="mx-auto h-10 w-10 text-blue-600 mb-2" />
              <span className="text-xs font-bold text-slate-800 block">{paperFile ? paperFile.name : 'Click to select PDF manuscript'}</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Please ensure all author names and affiliations are removed for double-blind review</span>
              <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
            </div>
          </div>

          <div className="pt-4 border-t">
            <PrimaryButton type="submit" disabled={isSubmitting || !isLoggedIn} className="w-full justify-center py-4">
              {isSubmitting ? (
                'Transmitting Manuscript...'
              ) : (
                <span className="flex items-center gap-2"><Send size={16} /> Submit Research Paper</span>
              )}
            </PrimaryButton>
          </div>
        </form>
      </div>

    </div>
  );
};

export default SubmitPaperPage;