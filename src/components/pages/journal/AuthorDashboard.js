import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { API_BASE_URL, STATIC_ASSETS_BASE_URL } from '../../../utils/constants';
import { ARTICLE_TYPES, SPECIALIZATIONS, MANUSCRIPT_STATUS } from '../../../utils/workflowConstants';

// Components
import WorkflowStepper from './common/WorkflowStepper';
import PrimaryButton from '../../common/PrimaryButton';
import LatexEditor from '../../common/LatexEditor';
import LatexRenderer from '../../common/LatexRenderer';
import PublicationDetails from './PublicationDetails';

// FIX #1: Corrected the import path to point to the Author's Revision Modal
import SubmitRevisionModal from './Author/SubmitReviewModal';

import {
    FilePlus2, AlertTriangle, Upload, ClipboardCheck,
    History, Loader2, CheckCircle2, FileText, X, MessageSquare,
    ExternalLink, Bell, Download, CheckCircle, RefreshCw, Edit3
} from 'lucide-react';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const AuthorDashboard = () => {
    const { authToken, isSubmissionOpen, userName } = useContext(AuthContext);

    // --- State Management ---
    const [submissions, setSubmissions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormVisible, setFormVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [revisionTarget, setRevisionTarget] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '', abstract: '', keywords: '',
        articleType: ARTICLE_TYPES[0], specialization: SPECIALIZATIONS[0], file: null
    });

    const [declarations, setDeclarations] = useState({
        isOriginal: false, notSubmittedElsewhere: false, allAuthorsAgreed: false, noConflictInterest: false
    });

    // --- Helper: Status Normalizer ---
    const normalize = (status) => String(status || '').toUpperCase().replace(/[\s_]+/g, '');

    const fetchSubmissions = useCallback(async () => {
        if (!authToken) return;
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/journal-papers/my-submissions`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            setSubmissions(res.data.data || []);
        } catch (e) {
            console.error("Dashboard Fetch Error:", e);
        } finally {
            setIsLoading(false);
        }
    }, [authToken]);

    useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf' && selectedFile.size <= MAX_FILE_SIZE) {
            setFormData(prev => ({ ...prev, file: selectedFile }));
        } else {
            alert("Please upload a valid PDF under 10MB.");
            e.target.value = null; // Clears the bad file from the input
        }
    };

    const getFriendlyStatus = (status) => {
        const s = String(status || '').toUpperCase().replace(/[\s_]+/g, '');
        const mapping = {
            'SUBMITTED': 'Manuscript Submitted',
            'WITHASSOCIATEEDITOR': 'Revision Under Evaluation',
            'UNDERREVIEW': 'Under Peer Review',
            'REVISIONREQUIRED': 'Revisions Required',
            'DECISIONPENDING': 'Editorial Decision Pending',
            'PROOFREADING': 'Galley Proof Review',
            'PUBLISHED': 'Published'
        };
        return mapping[s] || status;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const fd = new FormData();
        fd.append('title', formData.title);
        fd.append('abstract', formData.abstract);
        fd.append('keywords', formData.keywords);
        fd.append('article_type', formData.articleType);
        fd.append('specialization', formData.specialization);
        fd.append('author_declarations', JSON.stringify(declarations));
        fd.append('manuscript', formData.file);

        try {
            await axios.post(`${API_BASE_URL}/journal-papers`, fd, {
                headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'multipart/form-data' }
            });
            setFormVisible(false);
            setFormData({ title: '', abstract: '', keywords: '', articleType: ARTICLE_TYPES[0], specialization: SPECIALIZATIONS[0], file: null });
            fetchSubmissions();
            alert("Manuscript successfully submitted.");
        } catch (err) {
            alert(err.response?.data?.message || "Submission failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-8 animate-in fade-in duration-500">

            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b pb-8">
                <div className="space-y-1">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none uppercase">Author Portal</h2>
                    <p className="text-slate-500 text-lg">Welcome, {userName}. Monitor your research lifecycle.</p>
                </div>

                <div className="flex items-center gap-4">
                        <PrimaryButton onClick={() => setFormVisible(true)} className="flex items-center gap-2 px-8 py-3.5 rounded-2xl shadow-lg">
                            <FilePlus2 size={20} /> <span className="font-bold uppercase tracking-wider text-xs">New Submission</span>
                        </PrimaryButton>
                </div>
            </header>

            {/* Submission Form Section */}
            {isFormVisible && (
                <main className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-top-8 duration-500 mb-12">
                    <div className="bg-slate-900 p-4 text-white flex items-center gap-3">
                        <ClipboardCheck size={20} className="text-blue-400" />
                        <span className="font-bold text-xs uppercase tracking-widest">Metadata Entry</span>
                        <button onClick={() => setFormVisible(false)} className="ml-auto hover:text-red-400"><X size={20} /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400">Article Type</label>
                                <select className="w-full border-2 border-slate-50 p-3.5 rounded-2xl bg-slate-50/50 outline-none focus:border-blue-400" value={formData.articleType} onChange={e => setFormData({ ...formData, articleType: e.target.value })}>
                                    {ARTICLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400">Specialization</label>
                                <select className="w-full border-2 border-slate-50 p-3.5 rounded-2xl bg-slate-50/50 outline-none focus:border-blue-400" value={formData.specialization} onChange={e => setFormData({ ...formData, specialization: e.target.value })}>
                                    {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400">Manuscript Title</label>
                            <LatexEditor
                                value={formData.title}
                                onChange={(val) => setFormData({ ...formData, title: val })}
                                placeholder="e.g. Analysis of $\beta$-particles in $\mathbb{R}^n$..."
                            />
                            {/* LIVE PREVIEW FOR TITLE */}
                            {formData.title && (
                                <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                                    <p className="text-[9px] font-black text-blue-500 uppercase mb-2 tracking-widest">Title Preview</p>
                                    <div className="text-xl font-bold text-slate-800">
                                        <LatexRenderer content={formData.title} />
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Abstract Section */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400">Abstract</label>
                            <LatexEditor
                                value={formData.abstract}
                                onChange={(val) => setFormData({ ...formData, abstract: val })}
                                placeholder="Enter abstract with LaTeX..."
                            />
                            {/* LIVE PREVIEW FOR ABSTRACT */}
                            {formData.abstract && (
                                <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                                    <p className="text-[9px] font-black text-blue-500 uppercase mb-2 tracking-widest">Abstract Preview</p>
                                    <div className="text-sm text-slate-600 leading-relaxed">
                                        <LatexRenderer content={formData.abstract} />
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* <div className="space-y-6">
                            <LatexEditor value={formData.title} onChange={(val) => setFormData({ ...formData, title: val })} placeholder="Manuscript Title..." />
                            <LatexEditor value={formData.abstract} onChange={(val) => setFormData({ ...formData, abstract: val })} placeholder="Abstract..." />
                        </div> */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 bg-slate-900 border-2 border-dashed border-slate-700 rounded-3xl p-10 relative text-center">
                                <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                {formData.file ? (
                                    <div className="text-blue-400 flex flex-col items-center gap-2"><FileText size={48} /><span className="font-bold">{formData.file.name}</span></div>
                                ) : (
                                    <div className="text-slate-500 flex flex-col items-center gap-2"><Upload size={48} /><span className="font-bold tracking-tight uppercase text-xs">Select Manuscript PDF</span></div>
                                )}
                            </div>
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ethical Checks</h4>
                                {Object.keys(declarations).map(key => (
                                    <label key={key} className="flex gap-3 items-center cursor-pointer">
                                        <input type="checkbox" className="h-4 w-4 rounded text-blue-600" checked={declarations[key]} onChange={e => setDeclarations({ ...declarations, [key]: e.target.checked })} />
                                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{key.replace(/([A-Z])/g, ' $1')}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <PrimaryButton type="submit" disabled={!formData.file || isSubmitting} className="w-full py-5 rounded-2xl shadow-xl shadow-blue-100 text-lg uppercase tracking-widest font-black">
                            {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : "Transmit to Journal"}
                        </PrimaryButton>
                    </form>
                </main>
            )}

            {/* Submissions List */}
            <section className="space-y-10">
                {isLoading ? (
                    <div className="py-20 text-center flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin h-10 w-10 text-slate-900" />
                        <p className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Loading Research Records...</p>
                    </div>
                ) : submissions.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-slate-200">
                        <Edit3 className="mx-auto text-blue-100 mb-6" size={80} />
                        <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Ready to Contribute?</h3>
                        <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                            You haven't submitted any manuscripts to JEMPA yet. Click the button above to start your first submission.
                        </p>
                        <button
                            onClick={() => setFormVisible(true)}
                            className="mt-8 px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:bg-blue-700 transition-all"
                        >
                            Start New Submission
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-12">
                        {submissions.map(p => (
                            <div key={p.id} className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all overflow-hidden border-t-4 border-t-slate-900">
                                <div className="p-8 md:p-12 space-y-8">
                                    <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
                                        <div className="flex-1 space-y-6">
                                            <div className="flex flex-wrap items-center gap-4">
                                                <span className="bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded-lg font-black tracking-widest uppercase shadow-sm">ID: #{p.id}</span>
                                                <span className="bg-blue-50 text-blue-700 text-[10px] px-3 py-1.5 rounded-lg font-black uppercase tracking-widest border border-blue-100">
                                                    {getFriendlyStatus(p.status)}
                                                </span>
                                            </div>

                                            <h4 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">
                                                <LatexRenderer content={p.title} />
                                            </h4>

                                            {/* Action Bar */}
                                            <div className="flex flex-wrap gap-3 pt-4">
                                                {p.production_file_url || p.manuscript_file_url ? (
                                                    <a
                                                        // FIX #2: Implemented the safe URL regex generator to prevent app crashes and double-folder bugs
                                                        href={`${STATIC_ASSETS_BASE_URL}/uploads/${(p.production_file_url || p.manuscript_file_url || '').replace(/^(\/?uploads\/)/, "")}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`flex items-center justify-center gap-2 px-6 py-3 border-2 font-black text-xs rounded-xl uppercase tracking-widest transition-all ${p.production_file_url
                                                            ? "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
                                                            : "border-slate-100 text-slate-600 hover:bg-slate-50"
                                                            }`}
                                                    >
                                                        <Download size={16} />
                                                        {p.production_file_url ? "Download Galley Proof" : "Download Manuscript"}
                                                    </a>
                                                ) : (
                                                    <div className="px-6 py-3 border-2 border-dashed border-slate-100 text-slate-400 text-xs rounded-xl italic">
                                                        No file attached
                                                    </div>
                                                )}

                                                {(normalize(p.status) === 'REVISIONREQUIRED' || normalize(p.status) === 'REVISIONSREQUIRED') && (
                                                    <button
                                                        onClick={() => setRevisionTarget({ paper: p, type: 'revision' })} className="px-8 py-3 bg-blue-600 text-white font-black text-xs rounded-xl hover:bg-blue-700 shadow-lg uppercase tracking-widest flex items-center gap-2"
                                                    >
                                                        <RefreshCw size={16} /> Submit Revision & Response
                                                    </button>
                                                )}

                                                {(normalize(p.status) === 'PRODUCTIONSTARTED' || normalize(p.status) === 'INPRODUCTION') && (
                                                    <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl w-full">
                                                        <p className="text-xs text-emerald-800 font-bold mb-3 uppercase tracking-tight">
                                                            Production has started. Please upload your camera-ready files.
                                                        </p>
                                                        <button
                                                            onClick={() => setRevisionTarget({ paper: p, type: 'production' })} className="w-full py-3 bg-emerald-600 text-white font-black text-xs rounded-xl hover:bg-emerald-700 shadow-lg uppercase tracking-widest flex items-center justify-center gap-2"
                                                        >
                                                            <Upload size={16} /> Upload Final Production Files
                                                        </button>
                                                    </div>
                                                )}

                                                {p.status === 'Proof Reading' && (
                                                    <div className="mt-6 p-6 bg-orange-50 border-2 border-orange-200 rounded-3xl shadow-inner w-full">
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <div className="p-2 bg-orange-600 text-white rounded-lg">
                                                                <MessageSquare size={18} />
                                                            </div>
                                                            <h5 className="font-black text-orange-900 uppercase text-xs tracking-widest">
                                                                Production Editor's Instructions
                                                            </h5>
                                                        </div>

                                                        <div className="bg-white p-5 rounded-2xl border border-orange-100 mb-6 shadow-sm">
                                                            {p.production_notes ? (
                                                                <div className="text-sm text-slate-700 leading-relaxed italic">
                                                                    <LatexRenderer content={p.production_notes} />
                                                                </div>
                                                            ) : (
                                                                <p className="text-xs text-slate-400 italic">No specific instructions provided. Please review the attached galley proof for final publication.</p>
                                                            )}
                                                        </div>

                                                        <button
                                                            onClick={() => setRevisionTarget({ paper: p, type: 'production' })} className="w-full py-4 bg-orange-600 text-white font-black text-xs rounded-2xl uppercase tracking-widest shadow-lg hover:bg-orange-700 transition-all active:scale-95"
                                                        >
                                                            Upload Final Corrected PDF
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Feedback Integration */}
                                            {(normalize(p.status).includes('REJECT') || normalize(p.status).includes('REVISION')) && (
                                                <div className="mt-8 p-8 bg-slate-50 border border-slate-200 rounded-[2rem] space-y-8 shadow-inner">
                                                    <div className="flex items-center gap-3 text-blue-900 font-black uppercase tracking-widest text-xs"><ClipboardCheck size={20} /> Evaluation Report</div>
                                                    <div className="space-y-4">
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block">Managing Editor Note</span>
                                                        <div className="p-6 bg-white rounded-2xl border border-slate-100 text-slate-800 leading-relaxed shadow-sm italic"><LatexRenderer content={p.editor_decision_notes || "Decision pending summary."} /></div>
                                                    </div>
                                                    {p.reviews && p.reviews.length > 0 && (
                                                        <div className="grid gap-4">
                                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block">Technical Peer Feedback</span>
                                                            {p.reviews.map((rev, idx) => (
                                                                <div key={idx} className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                                                                    <div className="flex items-center gap-2 mb-3"><MessageSquare size={14} className="text-blue-400" /><span className="text-[10px] font-black text-blue-600 uppercase">Reviewer {idx + 1}</span></div>
                                                                    <div className="text-sm text-slate-700 leading-relaxed"><LatexRenderer content={rev.comments_for_author} /></div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Published Stats Side */}
                                        {normalize(p.status) === 'PUBLISHED' && (
                                            <div className="lg:w-80 flex flex-col gap-4 shrink-0">
                                                <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 text-center space-y-4">
                                                    <CheckCircle size={32} className="mx-auto text-emerald-600" />
                                                    <p className="text-[10px] font-black text-emerald-800 uppercase tracking-[0.2em]">Record Published</p>
                                                    <a href={`/journals/articles/${p.id}`} className="block w-full py-3 bg-emerald-600 text-white font-black text-[10px] rounded-xl hover:bg-emerald-700 transition-all uppercase tracking-widest">Article Record Link</a>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Timeline Tracker */}
                                    <div className="pt-12 border-t border-slate-100">
                                        <WorkflowStepper currentStatus={p.status} />
                                    </div>

                                    {/* Detailed Stats for Published Papers */}
                                    {normalize(p.status) === 'PUBLISHED' && (
                                        <PublicationDetails paper={p} />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {revisionTarget && (
                <SubmitRevisionModal
                    paper={revisionTarget.paper}
                    uploadType={revisionTarget.type}
                    onClose={() => setRevisionTarget(null)}
                    onRevisionSubmitted={() => { setRevisionTarget(null); fetchSubmissions(); }}
                />
            )}
        </div>
    );
};

export default AuthorDashboard;