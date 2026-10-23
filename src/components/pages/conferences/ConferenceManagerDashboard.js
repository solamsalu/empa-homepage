// src/components/pages/conferences/ConferenceManagerDashboard.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Search, 
  Clock, 
  ExternalLink, 
  PlusCircle, 
  Lock, 
  Award, 
  FileText, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { API_BASE_URL, STATIC_ASSETS_BASE_URL } from '../../../utils/constants';
import { AuthContext } from '../../../context/AuthContext';
import LatexRenderer from '../../common/LatexRenderer';
import ConferencePageHeader from './common/ConferencePageHeader'; // 🌟 Navigation Header

const cleanHtml = (text) => text ? text.replace(/<[^>]*>?/gm, '').trim() : '';

const ConferenceManagerDashboard = () => {
  const { authToken } = useContext(AuthContext);
  const [conferences, setConferences] = useState([]);
  const [selectedConfId, setSelectedConfId] = useState('');
  const [papers, setPapers] = useState([]);

  // 2-Review Requirement Override State
  const [override2Reviews, setOverride2Reviews] = useState(false);

  // Search & Pagination States
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal Control States
  const [assigningPaper, setAssigningPaper] = useState(null);
  const [decidingPaper, setDecidingPaper] = useState(null);
  const [schedulingPaper, setSchedulingPaper] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Forms
  const [revForm, setRevForm] = useState({ email: '', fullName: '', affiliation: '', dueDate: '' });
  const [decForm, setDecForm] = useState({ decision: 'accepted_oral', presentationType: 'oral', chairRemarks: '' });
  const [schedForm, setSchedForm] = useState({ scheduledSessionTime: '', scheduledRoom: '' });

  // New Conference Form with Host and Certificate Branding
  const [newConf, setNewConf] = useState({
    title: '', 
    acronym: '', 
    theme: '', 
    description: '',
    venue: 'Main Auditorium', 
    city: 'Addis Ababa',
    host_institution: 'Addis Ababa University (AAU)',
    host_logo_url: '/images/aau_logo.png',
    sponsors_text: 'Ministry of Innovation & Technology (MInT), African Mathematical Union (AMU)',
    certificate_theme: 'navy_gold',
    signatory_chair_name: 'Scientific Program Committee Chair',
    signatory_president_name: 'Prof. Berhanu Guta (President, EMPA)',
    startDate: '', 
    endDate: '', 
    submissionStartDate: '',
    submissionEndDate: '', 
    cameraReadyDeadline: '', 
    tracks: 'Pure Mathematics, Applied Mathematics'
  });
  const [isCreating, setIsCreating] = useState(false);

  // 1. Fetch all conferences for the dropdown selector
  const fetchConferences = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/submissions`, { headers: { Authorization: `Bearer ${authToken}` } });
      const confs = res.data.data || [];
      setConferences(confs);
      if (confs.length > 0 && !selectedConfId) {
        setSelectedConfId(confs[0].id.toString());
      }
    } catch (err) {
      toast.error('Failed to load conferences.');
    }
  };

  useEffect(() => { fetchConferences(); }, [authToken]);

  // 2. Fetch all papers submitted to the SELECTED conference
  const fetchPapers = async () => {
    if (!selectedConfId) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/conference-papers/manager/overview/${selectedConfId}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setPapers(res.data.data || []);
      setCurrentPage(1); // Reset to page 1 on conference switch
    } catch (err) {
      toast.error('Failed to load papers for this conference.');
    }
  };

  useEffect(() => { fetchPapers(); }, [selectedConfId]);

  // Handle Creating a New Conference Event
  const handleCreateConference = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/conference-papers/manager/create-event`, newConf, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      toast.success('New Annual Conference created successfully!');
      setShowCreateModal(false);
      setNewConf({
        title: '', acronym: '', theme: '', description: '', venue: 'Main Auditorium', city: 'Addis Ababa',
        host_institution: 'Addis Ababa University (AAU)', host_logo_url: '/images/aau_logo.png',
        sponsors_text: 'Ministry of Innovation & Technology (MInT), African Mathematical Union (AMU)',
        certificate_theme: 'navy_gold', signatory_chair_name: 'Scientific Program Committee Chair',
        signatory_president_name: 'Prof. Berhanu Guta (President, EMPA)',
        startDate: '', endDate: '', submissionStartDate: '', submissionEndDate: '',
        cameraReadyDeadline: '', tracks: 'Pure Mathematics, Applied Mathematics'
      });
      await fetchConferences();
      if (res.data.data?.id) setSelectedConfId(res.data.data.id.toString());
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating conference.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/conference-papers/manager/assign-reviewer`, {
        paperId: assigningPaper.id, ...revForm
      }, { headers: { Authorization: `Bearer ${authToken}` } });
      toast.success('Reviewer assigned and invited.');
      setAssigningPaper(null);
      setRevForm({ email: '', fullName: '', affiliation: '', dueDate: '' });
      fetchPapers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error assigning reviewer.');
    }
  };

  const handleDecision = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/conference-papers/manager/decision/${decidingPaper.id}`, {
        ...decForm,
        overrideReviewRequirement: override2Reviews
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      toast.success('Decision dispatched to author.');
      setDecidingPaper(null);
      setOverride2Reviews(false);
      fetchPapers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to dispatch decision.');
    }
  };

  const handleTogglePresentation = async (paperId, currentStatus) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/conference-papers/manager/verify-presentation/${paperId}`, {
        isPresented: !currentStatus
      }, { headers: { Authorization: `Bearer ${authToken}` } });
      toast.success(res.data.message);
      fetchPapers();
    } catch (err) {
      toast.error('Failed to update presentation verification.');
    }
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/conference-papers/manager/schedule/${schedulingPaper.id}`, schedForm, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      toast.success('Presentation schedule updated.');
      setSchedulingPaper(null);
      fetchPapers();
    } catch (err) {
      toast.error('Failed to update schedule.');
    }
  };

  const sendBatchReminders = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/conference-papers/manager/remind-camera-ready/${selectedConfId}`, {}, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      toast.info(res.data.message);
    } catch (err) {
      toast.error('Failed to send alerts.');
    }
  };

  const currentConferenceTitle = conferences.find(c => c.id.toString() === selectedConfId)?.title || 'Conference';

  // Filter papers for search query
  const filteredPapers = papers.filter(p => {
    const q = search.toLowerCase();
    return cleanHtml(p.title).toLowerCase().includes(q) ||
           (p.author_name && p.author_name.toLowerCase().includes(q)) ||
           (p.author_email && p.author_email.toLowerCase().includes(q));
  });

  // Pagination slicing
  const totalPages = Math.ceil(filteredPapers.length / itemsPerPage) || 1;
  const paginatedPapers = filteredPapers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Helper: Filter reviews that are completed for the decision modal
  const completedReviewsForDecidingPaper = decidingPaper?.reviews?.filter(r => r.status === 'completed') || [];

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      
      {/* 🌟 1. BREADCRUMBS & BACK BUTTON HEADER 🌟 */}
      <ConferencePageHeader
        title="Chair Command Hub"
        subtitle={`Managing scientific submissions and schedule for: ${currentConferenceTitle}`}
        backUrl="/conferences"
        breadcrumbs={[{ label: 'Chair Hub' }]}
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Conference Selector Dropdown */}
            <select
              value={selectedConfId}
              onChange={e => setSelectedConfId(e.target.value)}
              className="bg-white border border-slate-300 text-slate-800 p-2 rounded-xl text-xs font-bold outline-none shadow-sm"
            >
              {conferences.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>

            {/* Launch Conference Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition shadow"
            >
              <PlusCircle size={15} /> New Conference
            </button>

            {/* Batch Reminder Alerts */}
            <button
              onClick={sendBatchReminders}
              className="bg-amber-500 hover:bg-amber-600 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-900 flex items-center gap-1.5 transition shadow"
            >
              <Clock size={14} /> Send V2 Alerts
            </button>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">

        {/* Search Bar */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, author, or email..."
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <span className="text-xs font-bold text-slate-400 shrink-0">
            {filteredPapers.length} Submissions Found
          </span>
        </div>

        {/* Papers Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
          {filteredPapers.length === 0 ? (
            <div className="py-20 text-center text-slate-400 font-bold text-sm">
              No submissions found for this conference matching your criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="p-4">Paper & Manuscript</th>
                    <th className="p-4">Submitting Author</th>
                    <th className="p-4">Review Progress</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-slate-100">
                  {paginatedPapers.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-4 max-w-sm">
                        <span className="text-[10px] font-black uppercase text-indigo-600 block tracking-wider">
                          CONF-{p.id} • {p.track_name || 'General Track'}
                        </span>
                        <div className="font-bold text-slate-900 mt-0.5 line-clamp-2">
                          <LatexRenderer content={cleanHtml(p.title)} />
                        </div>
                        <div className="flex gap-2 mt-2">
                          <a href={`${STATIC_ASSETS_BASE_URL}${p.manuscript_file_url}`} target="_blank" rel="noreferrer" className="text-blue-600 font-bold flex items-center gap-1 hover:underline">
                            <ExternalLink size={12} /> V1 Draft
                          </a>
                          {p.camera_ready_file_url && (
                            <a href={`${STATIC_ASSETS_BASE_URL}${p.camera_ready_file_url}`} target="_blank" rel="noreferrer" className="text-emerald-600 font-bold flex items-center gap-1 hover:underline">
                              <ExternalLink size={12} /> V2 Camera-Ready
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-800">{p.author_name}</div>
                        <div className="text-[10px] text-slate-400">{p.author_email}</div>
                      </td>
                      <td className="p-4 font-bold">
                        <span className="text-slate-800">
                          {p.reviews?.filter(r => r.status === 'completed').length} / {p.reviews?.length || 0}
                        </span>
                        <span className="text-slate-400 font-normal ml-1">Completed</span>
                      </td>
                      <td className="p-4 font-bold uppercase text-[10px]">
                        <span className={`px-2.5 py-1 rounded-lg ${p.status.includes('accepted') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-600'}`}>
                          {p.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                        <button 
                          onClick={() => setAssigningPaper(p)} 
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-[10px] font-bold text-slate-700 transition"
                        >
                          + Reviewer
                        </button>
                        
                        <button 
                          onClick={() => {
                            setDecidingPaper(p);
                            setDecForm({ decision: 'accepted_oral', presentationType: 'oral', chairRemarks: '' });
                            setOverride2Reviews(false);
                          }} 
                          className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold shadow-sm transition"
                        >
                          Decision
                        </button>

                        {['accepted_oral', 'accepted_poster'].includes(p.status) && (
                          <button 
                            onClick={() => setSchedulingPaper(p)} 
                            className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-[10px] font-bold transition"
                          >
                            Schedule
                          </button>
                        )}

                        {['accepted_oral', 'accepted_poster'].includes(p.status) && (
                          <button
                            onClick={() => handleTogglePresentation(p.id, p.certificate_approved)}
                            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition inline-flex items-center gap-1 ${
                              p.certificate_approved
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            }`}
                            title={p.certificate_approved ? "Revoke certificate" : "Verify presentation to unlock certificate"}
                          >
                            <Award size={12} />
                            {p.certificate_approved ? '✓ Presented' : 'Verify'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 🌟 2. TABLE PAGINATION CONTROLS 🌟 */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center p-4 border-t border-slate-100 bg-slate-50/50">
              <span className="text-xs text-slate-500 font-bold">
                Page {currentPage} of {totalPages}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition"
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
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
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL 1: CREATE NEW ANNUAL CONFERENCE --- */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto font-sans">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Create New Annual Conference</h3>
            <p className="text-xs text-slate-500 mb-6">Configure the title, deadlines, university host, and certificate themes.</p>

            <form onSubmit={handleCreateConference} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Conference Title *</label>
                  <input type="text" required placeholder="e.g., 35th Annual EMPA National Conference" value={newConf.title} onChange={e => setNewConf({ ...newConf, title: e.target.value })} className="w-full p-2.5 border rounded-xl" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Acronym / Short Name</label>
                  <input type="text" placeholder="e.g., EMPA-2027" value={newConf.acronym} onChange={e => setNewConf({ ...newConf, acronym: e.target.value })} className="w-full p-2.5 border rounded-xl" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Conference Theme</label>
                  <input type="text" placeholder="e.g., Mathematics for Sustainable Development" value={newConf.theme} onChange={e => setNewConf({ ...newConf, theme: e.target.value })} className="w-full p-2.5 border rounded-xl" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Submission Window Opens *</label>
                  <input type="datetime-local" required value={newConf.submissionStartDate} onChange={e => setNewConf({ ...newConf, submissionStartDate: e.target.value })} className="w-full p-2.5 border rounded-xl" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Submission Deadline (Closes) *</label>
                  <input type="datetime-local" required value={newConf.submissionEndDate} onChange={e => setNewConf({ ...newConf, submissionEndDate: e.target.value })} className="w-full p-2.5 border rounded-xl" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Conference Start Date *</label>
                  <input type="date" required value={newConf.startDate} onChange={e => setNewConf({ ...newConf, startDate: e.target.value })} className="w-full p-2.5 border rounded-xl" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Conference End Date *</label>
                  <input type="date" required value={newConf.endDate} onChange={e => setNewConf({ ...newConf, endDate: e.target.value })} className="w-full p-2.5 border rounded-xl" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Camera-Ready Final Deadline</label>
                  <input type="datetime-local" value={newConf.cameraReadyDeadline} onChange={e => setNewConf({ ...newConf, cameraReadyDeadline: e.target.value })} className="w-full p-2.5 border rounded-xl" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Venue & City</label>
                  <input type="text" placeholder="AAU Science Campus, Addis Ababa" value={newConf.venue} onChange={e => setNewConf({ ...newConf, venue: e.target.value })} className="w-full p-2.5 border rounded-xl" />
                </div>

                {/* Host Institution, Logo, and Theme Customization */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Host Institution *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Addis Ababa University (AAU)"
                    value={newConf.host_institution}
                    onChange={e => setNewConf({ ...newConf, host_institution: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Host Logo Path</label>
                  <input
                    type="text"
                    placeholder="/images/aau_logo.png"
                    value={newConf.host_logo_url}
                    onChange={e => setNewConf({ ...newConf, host_logo_url: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Certificate Theme Style</label>
                  <select
                    value={newConf.certificate_theme}
                    onChange={e => setNewConf({ ...newConf, certificate_theme: e.target.value })}
                    className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                  >
                    <option value="navy_gold">Classic Navy & Gold (Default)</option>
                    <option value="emerald_gold">Imperial Emerald & Gold</option>
                    <option value="burgundy_bronze">Royal Burgundy & Bronze</option>
                    <option value="slate_platinum">Modern Slate & Platinum</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Conference Sponsors (Displayed on Certificate)</label>
                  <input
                    type="text"
                    placeholder="Ministry of Innovation & Technology (MInT), UNESCO, CIMPA"
                    value={newConf.sponsors_text}
                    onChange={e => setNewConf({ ...newConf, sponsors_text: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Research Tracks (Comma-separated)</label>
                  <input type="text" placeholder="Pure Mathematics, Applied Mathematics, Optimization, Data Science" value={newConf.tracks} onChange={e => setNewConf({ ...newConf, tracks: e.target.value })} className="w-full p-2.5 border rounded-xl" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 font-bold text-slate-500">Cancel</button>
                <button type="submit" disabled={isCreating} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl font-bold transition disabled:opacity-50">
                  {isCreating ? 'Creating Conference...' : 'Launch Annual Conference'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: ASSIGN REVIEWER --- */}
      {assigningPaper && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl w-full max-w-md space-y-4">
            <h3 className="font-bold text-slate-900">Appoint Reviewer for CONF-{assigningPaper.id}</h3>
            <form onSubmit={handleAssign} className="space-y-3 text-xs">
              <input type="email" placeholder="Institutional Email *" value={revForm.email} onChange={e => setRevForm({ ...revForm, email: e.target.value })} className="w-full p-2.5 border rounded-xl" required />
              <input type="text" placeholder="Full Name (For auto-generated accounts)" value={revForm.fullName} onChange={e => setRevForm({ ...revForm, fullName: e.target.value })} className="w-full p-2.5 border rounded-xl" />
              <input type="date" value={revForm.dueDate} onChange={e => setRevForm({ ...revForm, dueDate: e.target.value })} className="w-full p-2.5 border rounded-xl" />
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setAssigningPaper(null)} className="px-3 py-1 font-bold text-slate-500">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-1.5 rounded-xl font-bold">Assign & Send Invitation</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: DISPATCH DECISION --- */}
      {decidingPaper && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto font-sans space-y-6">

            <div className="border-b pb-4 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-600 block">
                  Scientific Decision • CONF-{decidingPaper.id}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  <LatexRenderer content={cleanHtml(decidingPaper.title)} />
                </h3>
              </div>
              <button onClick={() => setDecidingPaper(null)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
            </div>

            {/* Reviewer Reports Display */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <FileText size={15} className="text-indigo-600" />
                  Reviewer Evaluation Reports ({completedReviewsForDecidingPaper.length})
                </h4>

                {completedReviewsForDecidingPaper.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const combined = completedReviewsForDecidingPaper.map((r, i) =>
                        `[Reviewer #${i + 1} Assessment (${r.recommendation?.replace('_', ' ').toUpperCase()}) - Score: ${r.overall_score}/5.0]:\n${r.comments_for_author || 'No written text.'}`
                      ).join('\n\n-----------------------------\n\n');

                      setDecForm(prev => ({ ...prev, chairRemarks: combined }));
                      toast.info('Reviewer comments copied to Chair remarks!');
                    }}
                    className="text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    + Copy comments to Author Remarks
                  </button>
                )}
              </div>

              {completedReviewsForDecidingPaper.length === 0 ? (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 italic text-center">
                  ⚠️ No reviewers have submitted completed evaluation reports for this paper yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {completedReviewsForDecidingPaper.map((rev, idx) => (
                    <div key={rev.id || idx} className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-sm">
                      <div className="flex flex-wrap justify-between items-center text-xs font-bold border-b border-slate-100 pb-2">
                        <span className="text-slate-800 flex items-center gap-1.5">
                          <CheckCircle2 size={14} className="text-emerald-500" />
                          {rev.reviewer_name || `Reviewer #${idx + 1}`}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600 font-extrabold text-sm">
                            Score: {rev.overall_score}/5.0
                          </span>
                          <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {rev.recommendation?.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-500 font-semibold bg-slate-50 p-2 rounded-lg text-center">
                        <div>Originality: <strong className="text-slate-800">{rev.originality_score}/5</strong></div>
                        <div>Methodology: <strong className="text-slate-800">{rev.methodology_score}/5</strong></div>
                        <div>Clarity: <strong className="text-slate-800">{rev.clarity_score}/5</strong></div>
                        <div>Significance: <strong className="text-slate-800">{rev.significance_score}/5</strong></div>
                      </div>

                      <div>
                        <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                          Comments for Author:
                        </span>
                        <div className="bg-slate-50/80 p-3 rounded-lg text-xs text-slate-700 font-serif leading-relaxed italic border">
                          <LatexRenderer content={cleanHtml(rev.comments_for_author || 'No written text commentary.')} />
                        </div>
                      </div>

                      {rev.confidential_comments_chair && (
                        <div className="bg-amber-50/80 border border-amber-200 p-3 rounded-lg text-xs text-amber-900">
                          <span className="text-[10px] font-black uppercase text-amber-800 flex items-center gap-1 mb-0.5">
                            <Lock size={11} /> Confidential Note to Chair (Private):
                          </span>
                          <p className="italic leading-relaxed">{rev.confidential_comments_chair}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Chair Decision Form */}
            <form onSubmit={handleDecision} className="space-y-4 text-xs pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Official Decision Verdict *</label>
                  <select
                    value={decForm.decision}
                    onChange={e => setDecForm({ ...decForm, decision: e.target.value })}
                    className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                  >
                    <option value="accepted_oral">Accept for Oral Lecture (Presentation)</option>
                    <option value="accepted_poster">Accept for Interactive Poster Session</option>
                    <option value="revisions_required">Revisions Required Before Acceptance</option>
                    <option value="rejected">Decline / Reject Submission</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Presentation Format *</label>
                  <select
                    value={decForm.presentationType}
                    onChange={e => setDecForm({ ...decForm, presentationType: e.target.value })}
                    className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                  >
                    <option value="oral">Oral Lecture (20 Mins)</option>
                    <option value="poster">Interactive Poster</option>
                    <option value="undecided">Undecided</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Remarks Communicated to the Author (LaTeX Supported)
                </label>
                <textarea
                  placeholder="Provide instructions for camera-ready revision, session presentation details, or rationale..."
                  value={decForm.chairRemarks}
                  onChange={e => setDecForm({ ...decForm, chairRemarks: e.target.value })}
                  className="w-full p-3 border rounded-xl font-serif text-xs bg-slate-50"
                  rows="4"
                />
              </div>

              {/* 2-Review Requirement & Override */}
              {completedReviewsForDecidingPaper.length < 2 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-2">
                  <div className="font-bold flex items-center gap-1.5">
                    <Clock size={14} className="text-amber-600" />
                    <span>Review Requirement: Only {completedReviewsForDecidingPaper.length}/2 completed reviews received.</span>
                  </div>
                  <p className="text-[11px] text-amber-700">
                    EMPA policy requires at least two independent referee reports before rendering a decision.
                  </p>
                  <label className="flex items-center gap-2 pt-1 font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={override2Reviews}
                      onChange={(e) => setOverride2Reviews(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-[11px]">Chair Executive Override: Render decision without 2 reviews</span>
                  </label>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button type="button" onClick={() => setDecidingPaper(null)} className="px-4 py-2 font-bold text-slate-500">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={completedReviewsForDecidingPaper.length < 2 && !override2Reviews}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-md shadow-blue-500/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Dispatch Formal Decision Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 4: SCHEDULE PRESENTATION --- */}
      {schedulingPaper && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl w-full max-w-md space-y-4 font-sans">
            <h3 className="font-bold text-slate-900">Schedule Presentation Slot</h3>
            <form onSubmit={handleSchedule} className="space-y-3 text-xs">
              <input type="datetime-local" value={schedForm.scheduledSessionTime} onChange={e => setSchedForm({ ...schedForm, scheduledSessionTime: e.target.value })} className="w-full p-2.5 border rounded-xl" required />
              <input type="text" placeholder="Auditorium / Room *" value={schedForm.scheduledRoom} onChange={e => setSchedForm({ ...schedForm, scheduledRoom: e.target.value })} className="w-full p-2.5 border rounded-xl" required />
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setSchedulingPaper(null)} className="px-3 py-1 font-bold text-slate-500">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-1.5 rounded-xl font-bold">Save to Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ConferenceManagerDashboard;