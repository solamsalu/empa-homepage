// src/components/pages/conferences/ConferenceReviewerDashboard.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  FileText, 
  Clock, 
  Award, 
  ChevronLeft, 
  ChevronRight, 
  Lock,
  MessageSquare,
  Shield
} from 'lucide-react';
import { API_BASE_URL, STATIC_ASSETS_BASE_URL } from '../../../utils/constants';
import { AuthContext } from '../../../context/AuthContext';
import LatexRenderer from '../../common/LatexRenderer';
import ConferencePageHeader from './common/ConferencePageHeader'; // 🌟 Unified Navigation Header

const cleanHtml = (text) => text ? text.replace(/<[^>]*>?/gm, '').trim() : '';

const ConferenceReviewerDashboard = () => {
  const { authToken } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // 'pending' | 'active'

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Evaluation Form Modal State
  const [selectedReview, setSelectedReview] = useState(null);
  const [evalData, setEvalData] = useState({ 
    originalityScore: 3, 
    methodologyScore: 3, 
    clarityScore: 3, 
    significanceScore: 3, 
    recommendation: 'accept_oral', 
    commentsForAuthor: '', 
    confidentialCommentsChair: '' 
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchAssignments = async () => {
    if (!authToken) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/conference-papers/reviewer/assigned`, { 
        headers: { Authorization: `Bearer ${authToken}` } 
      });
      setAssignments(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load review assignments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchAssignments(); 
  }, [authToken]);

  const handleRespond = async (id, response) => {
    try {
      await axios.put(`${API_BASE_URL}/conference-papers/reviewer/respond/${id}`, { response }, { 
        headers: { Authorization: `Bearer ${authToken}` } 
      });
      toast.success(`Invitation successfully ${response}.`); 
      fetchAssignments();
    } catch (err) {
      toast.error('Failed to update invitation status.');
    }
  };

  const handleEvaluate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.put(`${API_BASE_URL}/conference-papers/reviewer/submit-evaluation/${selectedReview.review_id}`, evalData, { 
        headers: { Authorization: `Bearer ${authToken}` } 
      });
      toast.success('Evaluation report submitted securely to the Program Committee.'); 
      setSelectedReview(null); 
      fetchAssignments();
    } catch (err) {
      toast.error('Failed to submit evaluation.');
    } finally {
      setSubmitting(false);
    }
  };

  // Grouping
  const pending = assignments.filter(a => a.review_status === 'invited');
  const active = assignments.filter(a => ['accepted', 'completed'].includes(a.review_status));

  // Pagination for the active tab list
  const activeList = activeTab === 'pending' ? pending : active;
  const totalPages = Math.ceil(activeList.length / itemsPerPage) || 1;
  const paginatedList = activeList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Live composite score calculation
  const calculatedAverage = (
    (Number(evalData.originalityScore) +
     Number(evalData.methodologyScore) +
     Number(evalData.clarityScore) +
     Number(evalData.significanceScore)) / 4
  ).toFixed(1);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      
      {/* 🌟 1. BREADCRUMBS & BACK BUTTON NAVIGATION 🌟 */}
      <ConferencePageHeader
        title="Scientific Committee Reviewer Desk"
        subtitle="Confidential double-blind peer review of assigned research manuscripts."
        backUrl="/conferences"
        breadcrumbs={[{ label: 'Reviewer Desk' }]}
        actions={
          <button 
            onClick={fetchAssignments}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition shadow-sm"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        }
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">

        {/* 🌟 2. TABBED QUEUE SELECTOR 🌟 */}
        <div className="flex border-b border-slate-200 gap-6">
          <button
            onClick={() => { setActiveTab('active'); setCurrentPage(1); }}
            className={`pb-3 text-xs font-bold border-b-2 transition uppercase tracking-wider flex items-center gap-2 ${
              activeTab === 'active'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <span>Assigned Workload</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
              activeTab === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
            }`}>
              {active.length}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('pending'); setCurrentPage(1); }}
            className={`pb-3 text-xs font-bold border-b-2 transition uppercase tracking-wider flex items-center gap-2 ${
              activeTab === 'pending'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <span>Pending Invitations</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
              activeTab === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
            }`}>
              {pending.length}
            </span>
          </button>
        </div>

        {/* 🌟 3. MANUSCRIPTS CONTENT LIST 🌟 */}
        {loading ? (
          <div className="py-24 text-center text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">
            Loading Evaluation Assignments...
          </div>
        ) : activeList.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-slate-300 space-y-2">
            <Shield className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="text-base font-bold text-slate-800">
              {activeTab === 'pending' ? 'No Pending Invitations' : 'No Active Manuscripts'}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {activeTab === 'pending' 
                ? 'You do not have any invitations awaiting your response.' 
                : 'Your peer-review queue is currently empty.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedList.map(item => {
              const isInvited = item.review_status === 'invited';
              const isCompleted = item.review_status === 'completed';

              return (
                <div 
                  key={item.review_id} 
                  className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm hover:border-slate-300 transition space-y-4"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      CONF-{item.paper_id} • {item.conference_title || 'Annual Conference'}
                    </span>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase self-start sm:self-auto ${
                      isCompleted 
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                        : isInvited 
                        ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}>
                      {item.review_status}
                    </span>
                  </div>

                  {/* Title & LaTeX */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-snug">
                      <LatexRenderer content={cleanHtml(item.title)} />
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 mt-2 font-serif leading-relaxed">
                      {cleanHtml(item.abstract)}
                    </p>
                  </div>

                  {/* Target Deadline */}
                  {item.due_date && (
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                      <Clock size={13} className="text-blue-500" />
                      <span>Target Evaluation Deadline: <strong className="text-slate-800">{new Date(item.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong></span>
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t border-slate-100">
                    <a 
                      href={`${STATIC_ASSETS_BASE_URL}${item.manuscript_file_url}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 transition flex items-center gap-1.5 hover:underline"
                    >
                      <ExternalLink size={13} /> Download Blind Manuscript (PDF)
                    </a>

                    {isInvited ? (
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleRespond(item.review_id, 'declined')} 
                          className="px-4 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 rounded-xl text-xs font-bold transition"
                        >
                          Decline
                        </button>
                        <button 
                          onClick={() => handleRespond(item.review_id, 'accepted')} 
                          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                        >
                          Accept Invitation
                        </button>
                      </div>
                    ) : isCompleted ? (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                        <CheckCircle2 size={14} className="text-emerald-600" />
                        <span>Report Submitted ({item.overall_score}/5.0 • {item.recommendation?.replace('_', ' ').toUpperCase()})</span>
                      </span>
                    ) : (
                      <button 
                        onClick={() => setSelectedReview(item)} 
                        className="px-5 py-2.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition shadow-md flex items-center gap-1.5"
                      >
                        <FileText size={14} /> Conduct Evaluation Form
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 🌟 4. PAGINATION CONTROLS 🌟 */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center pt-4 border-t border-slate-200">
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

      {/* 🌟 5. EVALUATION REPORT MODAL 🌟 */}
      {selectedReview && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl border border-slate-100">
            <div className="border-b pb-4 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-600 block">
                  Confidential Peer Review • CONF-{selectedReview.paper_id}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  <LatexRenderer content={cleanHtml(selectedReview.title)} />
                </h3>
              </div>
              <button 
                onClick={() => setSelectedReview(null)} 
                className="text-slate-400 hover:text-slate-600 text-base font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEvaluate} className="space-y-5 text-xs">
              
              {/* Scoring Matrix */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                    Technical Scoring Criteria (1 = Weak, 5 = Outstanding)
                  </span>
                  <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                    Live Score: {calculatedAverage} / 5.0
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'originalityScore', label: '1. Originality & Novelty' },
                    { key: 'methodologyScore', label: '2. Scientific Methodology' },
                    { key: 'clarityScore', label: '3. Clarity of Exposition' },
                    { key: 'significanceScore', label: '4. Mathematical Significance' }
                  ].map(crit => (
                    <div key={crit.key} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                      <label className="font-bold block text-slate-700">{crit.label}</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="5" 
                        value={evalData[crit.key]} 
                        onChange={e => setEvalData({...evalData, [crit.key]: e.target.value})} 
                        className="w-full p-2 border rounded-lg bg-white font-bold text-center text-sm focus:ring-1 focus:ring-blue-500 outline-none" 
                        required 
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendation Dropdown */}
              <div>
                <label className="font-bold block mb-1 text-slate-700 uppercase text-[10px]">
                  Formal Recommendation Verdict *
                </label>
                <select 
                  value={evalData.recommendation} 
                  onChange={e => setEvalData({...evalData, recommendation: e.target.value})} 
                  className="w-full p-2.5 border rounded-xl bg-slate-50 font-bold focus:ring-1 focus:ring-blue-500 outline-none" 
                  required
                >
                  <option value="accept_oral">Accept for Oral Lecture Presentation</option>
                  <option value="accept_poster">Accept for Interactive Poster Session</option>
                  <option value="revisions_required">Revision Required Before Decision</option>
                  <option value="reject">Decline / Reject Submission</option>
                </select>
              </div>

              {/* Comments for Author */}
              <div>
                <label className="font-bold block mb-1 text-slate-700 uppercase text-[10px]">
                  Feedback for Authors (LaTeX Supported • Anonymized) *
                </label>
                <p className="text-[10px] text-slate-400 mb-1.5">
                  These comments will be forwarded to the author. Do not include your name or institution.
                </p>
                <textarea 
                  placeholder="Detail suggestions, notation corrections, proof assessments..." 
                  rows="4" 
                  value={evalData.commentsForAuthor} 
                  onChange={e => setEvalData({...evalData, commentsForAuthor: e.target.value})} 
                  className="w-full p-3 border rounded-xl bg-slate-50 font-mono text-xs focus:ring-1 focus:ring-blue-500 outline-none" 
                  required 
                />
              </div>

              {/* Private Notes to Chair */}
              <div>
                <label className="font-bold block mb-1 text-slate-700 uppercase text-[10px] flex items-center gap-1">
                  <Lock size={12} className="text-amber-600" /> Confidential Notes for Conference Chair
                </label>
                <p className="text-[10px] text-slate-400 mb-1.5">
                  Private assessment strictly viewed by the Program Committee Chairs.
                </p>
                <textarea 
                  placeholder="Confidential rationale regarding scientific validity, ethical concerns, or session suitability..." 
                  rows="2" 
                  value={evalData.confidentialCommentsChair} 
                  onChange={e => setEvalData({...evalData, confidentialCommentsChair: e.target.value})} 
                  className="w-full p-2.5 border rounded-xl bg-slate-50 font-mono text-xs focus:ring-1 focus:ring-blue-500 outline-none" 
                />
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button 
                  type="button" 
                  onClick={() => setSelectedReview(null)} 
                  className="px-4 py-2 font-bold text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Transmitting Report...' : 'Submit Evaluation Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ConferenceReviewerDashboard;