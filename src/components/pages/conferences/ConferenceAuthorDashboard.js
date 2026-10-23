// src/components/pages/conferences/ConferenceAuthorDashboard.js
import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Upload, 
  CheckCircle2, 
  RefreshCw, 
  ExternalLink, 
  MessageSquare, 
  FileText, 
  Award, 
  Clock, 
  Quote, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { API_BASE_URL, STATIC_ASSETS_BASE_URL } from '../../../utils/constants';
import { AuthContext } from '../../../context/AuthContext';
import LatexRenderer from '../../common/LatexRenderer';
import ConferenceWorkflowStepper from './common/ConferenceWorkflowStepper';
import PresentationCertificateModal from './common/PresentationCertificateModal';
import CitationModal from './common/CitationModal';
import ConferencePageHeader from './common/ConferencePageHeader'; // 🌟 Navigation header

const cleanHtml = (text) => text ? text.replace(/<[^>]*>?/gm, '').trim() : '';

const STATUS_CONFIG = {
  submitted: { label: 'Submitted', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  under_review: { label: 'Under Review', badge: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  reviews_completed: { label: 'Reviews Completed', badge: 'bg-purple-50 text-purple-700 border-purple-200' },
  accepted_oral: { label: 'Accepted (Oral)', badge: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold' },
  accepted_poster: { label: 'Accepted (Poster)', badge: 'bg-teal-50 text-teal-800 border-teal-300 font-bold' },
  revisions_required: { label: 'Revisions Required', badge: 'bg-amber-50 text-amber-800 border-amber-300 font-bold' },
  rejected: { label: 'Declined', badge: 'bg-rose-50 text-rose-800 border-rose-200' },
  withdrawn: { label: 'Withdrawn', badge: 'bg-slate-100 text-slate-500 border-slate-200' }
};

const ConferenceAuthorDashboard = () => {
  const { authToken } = useContext(AuthContext);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal States
  const [uploadingPaperId, setUploadingPaperId] = useState(null);
  const [cameraReadyFile, setCameraReadyFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [certPaper, setCertPaper] = useState(null);
  const [citingPaper, setCitingPaper] = useState(null);
  const fileInputRef = useRef(null);

  const fetchMyPapers = async () => {
    if (!authToken) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/conference-papers/author/my-papers`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setPapers(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load submissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPapers();
  }, [authToken]);

  const handleUploadCameraReady = async (e) => {
    e.preventDefault();
    if (!cameraReadyFile) return toast.warn('Select a valid PDF.');
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('file', cameraReadyFile);

    try {
      await axios.put(`${API_BASE_URL}/conference-papers/${uploadingPaperId}/camera-ready`, formData, {
        headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Camera-Ready PDF uploaded successfully!');
      setUploadingPaperId(null);
      setCameraReadyFile(null);
      fetchMyPapers();
    } catch (err) {
      toast.error('Upload failed. Please ensure file is a valid PDF under 15MB.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter papers based on active tab
  const filteredPapers = papers.filter((p) => {
    const isAccepted = ['accepted_oral', 'accepted_poster'].includes(p.status);
    if (activeTab === 'action_needed') {
      return (isAccepted || p.status === 'revisions_required') && !p.camera_ready_file_url;
    }
    if (activeTab === 'accepted') {
      return isAccepted;
    }
    return true;
  });

  // Pagination slicing
  const totalPages = Math.ceil(filteredPapers.length / itemsPerPage) || 1;
  const paginatedPapers = filteredPapers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      
      {/* 🌟 1. BREADCRUMBS & BACK BUTTON HEADER 🌟 */}
      <ConferencePageHeader
        title="Conference Author Hub"
        subtitle="Track peer review progress, view reviewer scores, and deposit camera-ready editions."
        backUrl="/conferences"
        breadcrumbs={[{ label: 'Author Hub' }]}
        actions={
          <button 
            onClick={fetchMyPapers} 
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition shadow-sm"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        }
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Tab Navigation Filters */}
        <div className="flex border-b border-slate-200 gap-6">
          <button
            onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
            className={`pb-3 text-xs font-bold border-b-2 transition uppercase tracking-wider ${
              activeTab === 'all'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            All Submissions ({papers.length})
          </button>
          <button
            onClick={() => { setActiveTab('action_needed'); setCurrentPage(1); }}
            className={`pb-3 text-xs font-bold border-b-2 transition uppercase tracking-wider ${
              activeTab === 'action_needed'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Action Needed: Camera-Ready (
            {
              papers.filter(
                (p) =>
                  ['accepted_oral', 'accepted_poster', 'revisions_required'].includes(p.status) &&
                  !p.camera_ready_file_url
              ).length
            }
            )
          </button>
          <button
            onClick={() => { setActiveTab('accepted'); setCurrentPage(1); }}
            className={`pb-3 text-xs font-bold border-b-2 transition uppercase tracking-wider ${
              activeTab === 'accepted'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Accepted Presentations (
            {papers.filter((p) => ['accepted_oral', 'accepted_poster'].includes(p.status)).length}
            )
          </button>
        </div>

        {/* Papers List */}
        {loading ? (
          <div className="py-24 text-center text-slate-500 font-bold animate-pulse text-sm">
            Retrieving submissions...
          </div>
        ) : filteredPapers.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-slate-300 space-y-2">
            <FileText className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="text-base font-bold text-slate-800">No Submissions Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You do not have any papers matching this filter. Submit a manuscript via the Call for Papers tab.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {paginatedPapers.map((paper) => {
              const statusCfg = STATUS_CONFIG[paper.status] || STATUS_CONFIG.submitted;
              const isAccepted = ['accepted_oral', 'accepted_poster'].includes(paper.status);

              return (
                <div key={paper.id} className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm hover:border-slate-300 transition">
                  
                  {/* Paper Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 mb-4 gap-2">
                    <div>
                      <span className="text-[10px] font-black uppercase text-indigo-600 block tracking-wider">
                        CONF-{paper.id} • {paper.conference_title}
                      </span>
                      <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                        <LatexRenderer content={cleanHtml(paper.title)} />
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Track: <span className="font-semibold text-slate-700">{paper.track_name || 'General Mathematical Sciences'}</span>
                      </p>
                    </div>
                    <span className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold uppercase self-start md:self-auto ${statusCfg.badge}`}>
                      {statusCfg.label}
                    </span>
                  </div>

                  {/* Workflow Stepper */}
                  <ConferenceWorkflowStepper status={paper.status} hasCameraReady={Boolean(paper.camera_ready_file_url)} />
                  
                  {/* Accepted Paper Actions & Certificate Banner */}
                  {isAccepted && (
                    <div className="my-6 p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h4 className="text-xs font-black uppercase text-emerald-950">
                          Format: {paper.presentation_type === 'oral' ? 'Oral Lecture Presentation (20 Mins)' : 'Interactive Poster Session'}
                        </h4>
                        <p className="text-xs text-emerald-800 mt-0.5">
                          {paper.scheduled_session_time 
                            ? `Scheduled: ${new Date(paper.scheduled_session_time).toLocaleString()} (${paper.scheduled_room || 'Main Hall'})` 
                            : 'Presentation scheduling in progress by committee.'}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Cite / BibTeX Button */}
                        <button
                          onClick={() => setCitingPaper(paper)}
                          className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs border border-slate-200 transition shadow-sm"
                          title="Generate BibTeX, APA, or MLA Citation"
                        >
                          <Quote size={13} className="text-blue-600" /> Cite
                        </button>

                        {/* Certificate Button */}
                        {paper.certificate_approved ? (
                          <button
                            onClick={() => setCertPaper(paper)}
                            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-xl text-xs transition shadow-sm animate-pulse"
                          >
                            <Award size={14} /> Download Certificate
                          </button>
                        ) : (
                          <span className="text-[11px] font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1">
                            <Clock size={12} className="text-slate-400" /> Certificate unlocks after presentation
                          </span>
                        )}

                        {/* Camera-Ready Upload CTA */}
                        {!paper.camera_ready_file_url ? (
                          <button 
                            onClick={() => setUploadingPaperId(paper.id)} 
                            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
                          >
                            <Upload size={14} /> Upload Camera-Ready PDF
                          </button>
                        ) : (
                          <div className="text-emerald-800 font-bold text-xs flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-emerald-300">
                            <CheckCircle2 size={15} className="text-emerald-600" /> Final V2 Deposited
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Version Comparison */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-black uppercase text-slate-400 block">Version 1 (Blind Draft)</span>
                        <span className="text-xs font-bold text-slate-700">Initial Review Document</span>
                      </div>
                      <a href={`${STATIC_ASSETS_BASE_URL}${paper.manuscript_file_url}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                        <ExternalLink size={14} /> View
                      </a>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-black uppercase text-slate-400 block">Version 2 (Camera-Ready)</span>
                        <span className="text-xs font-bold text-slate-700">{paper.camera_ready_file_url ? 'Final Publication Ready' : 'Pending Upload'}</span>
                      </div>
                      {paper.camera_ready_file_url ? (
                        <a href={`${STATIC_ASSETS_BASE_URL}${paper.camera_ready_file_url}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1">
                          <ExternalLink size={14} /> View
                        </a>
                      ) : <span className="text-xs text-slate-400 italic">Not uploaded</span>}
                    </div>
                  </div>

                  {/* Reviewer Feedback Section */}
                  {paper.reviews?.length > 0 && (
                    <div className="mt-6 border-t pt-6 space-y-3">
                      <h4 className="text-xs font-black uppercase text-slate-400 flex items-center gap-2">
                        <MessageSquare size={14} /> Anonymized Reviewer Feedback
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {paper.reviews.map((rev, idx) => (
                          <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                            <div className="font-bold text-slate-600 border-b border-slate-200 pb-2 flex justify-between items-center">
                              <span>Report #{idx + 1}</span>
                              <span className="text-blue-600 font-black">Score: {rev.overall_score}/5.0</span>
                            </div>
                            <div className="text-slate-700 italic leading-relaxed">
                              <LatexRenderer content={cleanHtml(rev.comments_for_author || 'No specific text commentary provided.')} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

        {/* 🌟 2. DASHBOARD PAGINATION CONTROLS 🌟 */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center pt-4 border-t border-slate-200">
            <span className="text-xs text-slate-500 font-bold">
              Showing Page {currentPage} of {totalPages} ({filteredPapers.length} total manuscripts)
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition"
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
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Camera-Ready Modal */}
      {uploadingPaperId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900">Upload Final Camera-Ready PDF</h3>
            <p className="text-xs text-slate-500 mt-1">Please ensure your camera-ready manuscript incorporates reviewer revisions and includes full author names and affiliations.</p>
            <form onSubmit={handleUploadCameraReady} className="mt-6 space-y-4">
              <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center cursor-pointer hover:border-blue-500">
                <Upload className="mx-auto h-8 w-8 text-blue-600 mb-2" />
                <span className="text-xs font-bold block">{cameraReadyFile ? cameraReadyFile.name : 'Select PDF (Max 15MB)'}</span>
                <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={e => setCameraReadyFile(e.target.files[0])} />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => { setUploadingPaperId(null); setCameraReadyFile(null); }} className="px-4 py-2 text-xs font-bold text-slate-600">Cancel</button>
                <button type="submit" disabled={isSubmitting || !cameraReadyFile} className="px-5 py-2 text-xs font-bold bg-blue-600 text-white rounded-xl disabled:opacity-50">
                  {isSubmitting ? 'Uploading...' : 'Confirm Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {certPaper && (
        <PresentationCertificateModal 
          paper={certPaper} 
          conferenceTitle={certPaper.conference_title} 
          onClose={() => setCertPaper(null)} 
        />
      )}

      {/* Citation Modal */}
      {citingPaper && (
        <CitationModal
          paper={citingPaper}
          conferenceTitle={citingPaper.conference_title}
          onClose={() => setCitingPaper(null)}
        />
      )}

    </div>
  );
};

export default ConferenceAuthorDashboard;