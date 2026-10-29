import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { API_BASE_URL, STATIC_ASSETS_BASE_URL } from '../../../utils/constants';
import { ARTICLE_TYPES, SPECIALIZATIONS } from '../../../utils/workflowConstants';

// Components
import WorkflowStepper from './common/WorkflowStepper';
import PrimaryButton from '../../common/PrimaryButton';
import LatexEditor from '../../common/LatexEditor';
import LatexRenderer from '../../common/LatexRenderer';
import PublicationDetails from './PublicationDetails';
import SubmitRevisionModal from './Author/SubmitReviewModal';
import { toast } from 'react-toastify';
import RubricScoreDisplay from './common/RubricScoreDisplay';

import {
    FilePlus2, Upload, ClipboardCheck,
    Loader2, FileText, X, MessageSquare,
    Download, CheckCircle, RefreshCw, Edit3, CheckCircle2
} from 'lucide-react';

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

const AuthorDashboard = () => {
    const { authToken, userName } = useContext(AuthContext);

    // --- State Management ---
    const [submissions, setSubmissions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormVisible, setFormVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [revisionTarget, setRevisionTarget] = useState(null);

    // Form State (Defaults to empty strings for mandatory selection)
    const [formData, setFormData] = useState({
        title: '',
        abstract: '',
        keywords: '',
        articleType: '',
        specialization: '',
        file: null
    });

    // Ethical Declarations
    const [declarations, setDeclarations] = useState({
        isOriginal: false,
        notSubmittedElsewhere: false,
        allAuthorsAgreed: false,
        noConflictInterest: false
    });

    // Check if all ethical requirements are met
    const allDeclarationsChecked = useMemo(() => {
        return Object.values(declarations).every(val => val === true);
    }, [declarations]);

    // --- Helper: Status Normalizer ---
    const normalize = useCallback((status) => {
        return String(status || '').toUpperCase().replace(/[\s_]+/g, '');
    }, []);

    // --- Fetch Author's Submissions ---
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

    useEffect(() => {
        fetchSubmissions();
    }, [fetchSubmissions]);

    // --- Handle File Upload ---
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf' && selectedFile.size <= MAX_FILE_SIZE) {
            setFormData(prev => ({ ...prev, file: selectedFile }));
            toast.info(`Attached: ${selectedFile.name}`);
        } else {
            toast.error("Please upload a valid compiled PDF under 15MB.");
            e.target.value = null;
        }
    };

    // --- Friendly Status Label ---
    const getFriendlyStatus = (status) => {
        const s = String(status || '').toUpperCase().replace(/[\s_]+/g, '');
        const mapping = {
            'SUBMITTED': 'Manuscript Submitted',
            'WITHASSOCIATEEDITOR': 'Under Evaluation',
            'UNDERREVIEW': 'Under Peer Review',
            'REVIEWCOMPLETED': 'Review Completed',
            'REVISIONREQUIRED': 'Revisions Required',
            'REVISIONSREQUIRED': 'Revisions Required',
            'REVISIONSUBMITTED': 'Revision Submitted',
            'DECISIONPENDING': 'Editorial Decision Pending',
            'PROOFREADING': 'Galley Proof Review',
            'READYTOPUBLISH': 'Ready for Publication',
            'PUBLISHED': 'Published',
            'REJECTED': 'Declined'
        };
        return mapping[s] || status;
    };

    // --- Handle Submission ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.articleType) {
            toast.warn("Please select an Article Type.");
            return;
        }
        if (!formData.specialization) {
            toast.warn("Please select a Specialization.");
            return;
        }
        if (!allDeclarationsChecked) {
            toast.warn("You must confirm all mandatory ethical statements before submitting.");
            return;
        }

        setIsSubmitting(true);
        const cleanTitle = (formData.title || '')
            .replace(/^<p>/i, '')
            .replace(/<\/p>$/i, '')
            .trim();

        const fd = new FormData();
        fd.append('title', cleanTitle);
        fd.append('abstract', formData.abstract);
        fd.append('keywords', formData.keywords);
        fd.append('article_type', formData.articleType);
        fd.append('specialization', formData.specialization);
        fd.append('author_declarations', JSON.stringify(declarations));
        fd.append('manuscript', formData.file);

        try {
            await axios.post(`${API_BASE_URL}/journal-papers`, fd, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setFormVisible(false);
            setFormData({ title: '', abstract: '', keywords: '', articleType: '', specialization: '', file: null });
            setDeclarations({ isOriginal: false, notSubmittedElsewhere: false, allAuthorsAgreed: false, noConflictInterest: false });
            fetchSubmissions();
            toast.success("Manuscript successfully submitted for editorial review.");
        } catch (err) {
            toast.error(err.response?.data?.message || "Submission failed. Please check your data.");
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
                    <p className="text-slate-500 text-lg">Welcome, {userName}. Monitor your research submissions and editorial progress.</p>
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton onClick={() => setFormVisible(true)} className="flex items-center gap-2 px-8 py-3.5 rounded-2xl shadow-lg">
                        <FilePlus2 size={20} />
                        <span className="font-bold uppercase tracking-wider text-xs">New Submission</span>
                    </PrimaryButton>
                </div>
            </header>

            {/* Submission Form Section */}
            {isFormVisible && (
                <main className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-top-6 duration-300 mb-12">
                    <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ClipboardCheck size={20} className="text-blue-400" />
                            <div>
                                <h3 className="font-bold text-sm uppercase tracking-wider">New Manuscript Submission</h3>
                                <p className="text-[11px] text-slate-400">Please provide complete metadata adhering to JEMPA author guidelines.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setFormVisible(false)}
                            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {/* Classification Dropdowns */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                    Article Type <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    required
                                    className="w-full border border-slate-200 p-3.5 rounded-xl bg-slate-50 font-medium text-sm text-slate-800 outline-none focus:border-blue-600 focus:bg-white transition-all"
                                    value={formData.articleType}
                                    onChange={e => setFormData({ ...formData, articleType: e.target.value })}
                                >
                                    <option value="" disabled>-- Select Article Type --</option>
                                    {ARTICLE_TYPES.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                    Mathematical Specialization <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    required
                                    className="w-full border border-slate-200 p-3.5 rounded-xl bg-slate-50 font-medium text-sm text-slate-800 outline-none focus:border-blue-600 focus:bg-white transition-all"
                                    value={formData.specialization}
                                    onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                                >
                                    <option value="" disabled>-- Select Specialization --</option>
                                    {SPECIALIZATIONS.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Title Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex justify-between">
                                <span>Manuscript Title <span className="text-rose-500">*</span></span>
                                <span className="text-[11px] text-slate-400 font-normal lowercase">
                                    {"(LaTeX formulas supported, e.g. $\\beta$, $\\mathbb{R}^n$)"}
                                </span>
                            </label>
                            <LatexEditor
                                value={formData.title}
                                onChange={(val) => setFormData({ ...formData, title: val })}
                                placeholder="Enter full academic manuscript title..."
                            />
                            {formData.title && (
                                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Title Preview</p>
                                    <div className="text-lg font-bold text-slate-800">
                                        <LatexRenderer content={formData.title} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Abstract Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex justify-between">
                                <span>Abstract <span className="text-rose-500">*</span></span>
                                <span className="text-[11px] text-slate-400 font-normal lowercase">(background, theorems, and main results)</span>
                            </label>
                            <LatexEditor
                                value={formData.abstract}
                                onChange={(val) => setFormData({ ...formData, abstract: val })}
                                placeholder="Enter abstract with LaTeX mathematical formatting..."
                            />
                            {formData.abstract && (
                                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Abstract Preview</p>
                                    <div className="text-sm text-slate-700 leading-relaxed font-serif">
                                        <LatexRenderer content={formData.abstract} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Keywords Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                Keywords <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Topology, Functional Analysis, Operator Theory (separated by commas)"
                                value={formData.keywords}
                                onChange={e => setFormData({ ...formData, keywords: e.target.value })}
                                className="w-full border border-slate-200 p-3.5 rounded-xl bg-slate-50 text-sm outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
                            />
                        </div>

                        {/* File Upload and Mandatory Declarations */}
                        <div className="grid md:grid-cols-5 gap-6 items-start">
                            {/* Upload Box */}
                            <div className="md:col-span-2 bg-slate-900 border-2 border-dashed border-slate-700 rounded-2xl p-8 relative text-center hover:border-blue-500 transition-colors">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    required
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                {formData.file ? (
                                    <div className="text-blue-400 flex flex-col items-center gap-2">
                                        <FileText size={40} />
                                        <span className="font-bold text-xs text-white max-w-[200px] truncate">{formData.file.name}</span>
                                        <span className="text-[10px] text-emerald-400 font-bold uppercase">PDF Attached</span>
                                    </div>
                                ) : (
                                    <div className="text-slate-400 flex flex-col items-center gap-2">
                                        <Upload size={36} className="text-blue-400" />
                                        <span className="font-bold text-xs uppercase tracking-wider text-white">Upload Manuscript PDF</span>
                                        <span className="text-[10px] text-slate-500">Compiled LaTeX document (max 15MB)</span>
                                    </div>
                                )}
                            </div>

                            {/* Mandatory Ethical Compliance Box */}
                            <div className="md:col-span-3 bg-amber-50/60 p-5 rounded-2xl border border-amber-200 space-y-3">
                                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-amber-700" />
                                        <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider">
                                            Mandatory Ethical Declarations
                                        </h4>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase bg-amber-200/80 text-amber-800 px-2 py-0.5 rounded">
                                        All Required
                                    </span>
                                </div>

                                <div className="space-y-2.5 pt-1">
                                    <label className="flex items-start gap-2.5 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            required
                                            className="mt-0.5 h-4 w-4 rounded border-amber-300 text-blue-600 focus:ring-blue-500"
                                            checked={declarations.isOriginal}
                                            onChange={e => setDeclarations({ ...declarations, isOriginal: e.target.checked })}
                                        />
                                        <span className="text-xs font-medium text-slate-800 leading-snug">
                                            <strong>Originality:</strong> The manuscript represents original academic research and contains no plagiarized material.
                                        </span>
                                    </label>

                                    <label className="flex items-start gap-2.5 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            required
                                            className="mt-0.5 h-4 w-4 rounded border-amber-300 text-blue-600 focus:ring-blue-500"
                                            checked={declarations.notSubmittedElsewhere}
                                            onChange={e => setDeclarations({ ...declarations, notSubmittedElsewhere: e.target.checked })}
                                        />
                                        <span className="text-xs font-medium text-slate-800 leading-snug">
                                            <strong>Exclusive Submission:</strong> This work is not currently under consideration or published in another journal.
                                        </span>
                                    </label>

                                    <label className="flex items-start gap-2.5 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            required
                                            className="mt-0.5 h-4 w-4 rounded border-amber-300 text-blue-600 focus:ring-blue-500"
                                            checked={declarations.allAuthorsAgreed}
                                            onChange={e => setDeclarations({ ...declarations, allAuthorsAgreed: e.target.checked })}
                                        />
                                        <span className="text-xs font-medium text-slate-800 leading-snug">
                                            <strong>Author Consent:</strong> All co-authors have reviewed and approved the submitted version of the paper.
                                        </span>
                                    </label>

                                    <label className="flex items-start gap-2.5 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            required
                                            className="mt-0.5 h-4 w-4 rounded border-amber-300 text-blue-600 focus:ring-blue-500"
                                            checked={declarations.noConflictInterest}
                                            onChange={e => setDeclarations({ ...declarations, noConflictInterest: e.target.checked })}
                                        />
                                        <span className="text-xs font-medium text-slate-800 leading-snug">
                                            <strong>Conflict of Interest:</strong> All financial and personal competing interests have been fully declared.
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <PrimaryButton
                            type="submit"
                            disabled={
                                !formData.file ||
                                !formData.articleType ||
                                !formData.specialization ||
                                !allDeclarationsChecked ||
                                isSubmitting
                            }
                            className="w-full py-4 rounded-xl shadow-lg shadow-blue-200 text-sm uppercase tracking-widest font-black disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    <span>Submitting to Editorial Board...</span>
                                </>
                            ) : (
                                <span>Submit Manuscript</span>
                            )}
                        </PrimaryButton>

                        {!allDeclarationsChecked && (
                            <p className="text-[11px] text-center text-amber-700 italic font-medium -mt-4">
                                * Please confirm all mandatory ethical statements and select both Article Type and Specialization to submit.
                            </p>
                        )}
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
                                                <span className="bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded-lg font-black tracking-widest uppercase shadow-sm">
                                                    ID: #{p.id}
                                                </span>
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
                                                        href={`${STATIC_ASSETS_BASE_URL}/uploads/${(p.production_file_url || p.manuscript_file_url || '').replace(/^(\/?uploads\/)/, "")}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`flex items-center justify-center gap-2 px-6 py-3 border-2 font-black text-xs rounded-xl uppercase tracking-widest transition-all ${
                                                            p.production_file_url
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
                                                        onClick={() => setRevisionTarget({ paper: p, type: 'revision' })}
                                                        className="px-8 py-3 bg-blue-600 text-white font-black text-xs rounded-xl hover:bg-blue-700 shadow-lg uppercase tracking-widest flex items-center gap-2"
                                                    >
                                                        <RefreshCw size={16} /> Submit Revision & Response
                                                    </button>
                                                )}

                                                {(normalize(p.status) === 'PRODUCTIONSTARTED' || normalize(p.status) === 'INPRODUCTION') && (
                                                    <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl w-full">
                                                        <p className="text-xs text-emerald-800 font-bold mb-3 uppercase tracking-tight">
                                                            Production has started. Please upload camera-ready final files.
                                                        </p>
                                                        <button
                                                            onClick={() => setRevisionTarget({ paper: p, type: 'production' })}
                                                            className="w-full py-3 bg-emerald-600 text-white font-black text-xs rounded-xl hover:bg-emerald-700 shadow-lg uppercase tracking-widest flex items-center justify-center gap-2"
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
                                                                Production Editor Instructions
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
                                                            onClick={() => setRevisionTarget({ paper: p, type: 'production' })}
                                                            className="w-full py-4 bg-orange-600 text-white font-black text-xs rounded-2xl uppercase tracking-widest shadow-lg hover:bg-orange-700 transition-all active:scale-95"
                                                        >
                                                            Upload Final Corrected PDF
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* ========================================================================= */}
                                            {/* --- ANONYMOUS EDITORIAL & REVIEWER EVALUATION REPORT ---                  */}
                                            {/* REMOVED AFTER PUBLICATION: Only displays while active or in revision      */}
                                            {/* ========================================================================= */}
                                            {normalize(p.status) !== 'PUBLISHED' && 
                                             (normalize(p.status).includes('REJECT') || 
                                              normalize(p.status).includes('REVISION') || 
                                              normalize(p.status) === 'REVISIONSUBMITTED' || 
                                              p.editor_decision_notes || 
                                              p.ae_comments_for_author || 
                                              (p.reviews && p.reviews.length > 0)) && (
                                                <div className="mt-8 p-6 md:p-8 bg-slate-50 border border-slate-200 rounded-3xl space-y-6 shadow-inner">
                                                    <div className="flex items-center gap-2 text-indigo-900 font-black uppercase tracking-wider text-xs border-b border-slate-200 pb-3">
                                                        <ClipboardCheck size={18} className="text-indigo-600" />
                                                        <span>Official Peer Review & Editorial Evaluation Report</span>
                                                    </div>

                                                    {/* 1. Managing Editor / Editorial Committee Directive */}
                                                    {p.editor_decision_notes && (
                                                        <div className="space-y-2">
                                                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block">
                                                                Managing Editor Decision & Instructions:
                                                            </span>
                                                            <div className="p-5 bg-white rounded-2xl border border-indigo-100 text-slate-800 leading-relaxed shadow-sm font-serif">
                                                                <LatexRenderer content={p.editor_decision_notes} />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* 2. Handling Associate Editor Comments to Author */}
                                                    {/* {(p.ae_comments_for_author || p.ae_recommendation) && (
                                                        <div className="space-y-2">
                                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">
                                                                Handling Associate Editor Remarks:
                                                            </span>
                                                            <div className="p-5 bg-white rounded-2xl border border-blue-100 text-slate-800 leading-relaxed shadow-sm font-serif">
                                                                {p.ae_recommendation && (
                                                                    <p className="font-bold text-xs text-blue-900 mb-1.5">
                                                                        Status Recommendation: {p.ae_recommendation}
                                                                    </p>
                                                                )}
                                                                {p.ae_comments_for_author ? (
                                                                    <LatexRenderer content={p.ae_comments_for_author} />
                                                                ) : (
                                                                    <p className="text-xs text-slate-500 italic">Editorial recommendation forwarded to Managing Editor.</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )} */}

                                                    {/* Handling Associate Editor Remarks (Visible to Author) */}
                                                    {(p.ae_comments_for_author || p.ae_recommendation) && (
                                                        <div className="space-y-2">
                                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">
                                                                Handling Associate Editor Remarks:
                                                            </span>
                                                            <div className="p-5 bg-white rounded-2xl border border-blue-100 text-slate-800 leading-relaxed shadow-sm font-serif space-y-2">
                                                                {p.ae_recommendation && (
                                                                    <p className="font-bold text-xs text-blue-900">
                                                                        Editorial Verdict Recommendation: <span className="underline">{p.ae_recommendation}</span>
                                                                    </p>
                                                                )}
                                                                {p.ae_comments_for_author ? (
                                                                    <LatexRenderer content={p.ae_comments_for_author} />
                                                                ) : (
                                                                    <p className="text-xs text-slate-500 italic">The Associate Editor has submitted their recommendation to the Managing Editor.</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* 3. Anonymous Technical Reviewer Feedback */}
                                                    {/* {p.reviews && p.reviews.length > 0 ? (
                                                        <div className="space-y-4">
                                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                                                                Blind Expert Reviewer Feedback:
                                                            </span>
                                                            <div className="grid gap-4">
                                                                {p.reviews.map((rev, idx) => (
                                                                    <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                                                                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                                                            <div className="flex items-center gap-2">
                                                                                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                                                                                    R{idx + 1}
                                                                                </div>
                                                                                <span className="text-xs font-bold text-slate-800">
                                                                                    Anonymous Reviewer {idx + 1}
                                                                                </span>
                                                                            </div>
                                                                            {rev.recommendation && (
                                                                                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                                                                                    rev.recommendation.toLowerCase().includes('reject')
                                                                                        ? 'bg-rose-100 text-rose-700'
                                                                                        : rev.recommendation.toLowerCase().includes('revision')
                                                                                            ? 'bg-amber-100 text-amber-700'
                                                                                            : 'bg-emerald-100 text-emerald-700'
                                                                                }`}>
                                                                                    Recommendation: {rev.recommendation}
                                                                                </span>
                                                                            )}
                                                                        </div>

                                                                        <div className="text-sm text-slate-700 leading-relaxed font-serif pt-1">
                                                                            <LatexRenderer content={rev.comments_for_author || "No specific author comments provided."} />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="text-xs text-slate-400 italic">Peer reviewer reports will be visible here once compiled.</p>
                                                    )} */}
                                                    {/* In AuthorDashboard.js inside the reviews.map loop: */}

                                                    {p.reviews && p.reviews.length > 0 ? (
                                                        <div className="space-y-4">
                                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                                                                Blind Expert Reviewer Feedback:
                                                            </span>
                                                            <div className="grid gap-4">
                                                                {p.reviews.map((rev, idx) => (
                                                                    <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                                                                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                                                            <div className="flex items-center gap-2">
                                                                                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                                                                                    R{idx + 1}
                                                                                </div>
                                                                                <span className="text-xs font-bold text-slate-800">
                                                                                    Anonymous Reviewer {idx + 1} (Round {rev.round_number || 1})
                                                                                </span>
                                                                            </div>
                                                                            {rev.recommendation && (
                                                                                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                                                                                    rev.recommendation.toLowerCase().includes('reject')
                                                                                        ? 'bg-rose-100 text-rose-700'
                                                                                        : rev.recommendation.toLowerCase().includes('revision')
                                                                                            ? 'bg-amber-100 text-amber-700'
                                                                                            : 'bg-emerald-100 text-emerald-700'
                                                                                }`}>
                                                                                    Recommendation: {rev.recommendation}
                                                                                </span>
                                                                            )}
                                                                        </div>

                                                                        {/* ✅ RENDER REVIEWER RUBRICS ON AUTHOR DASHBOARD */}
                                                                        <RubricScoreDisplay rawScores={rev.rubric_scores} />

                                                                        <div className="text-sm text-slate-700 leading-relaxed font-serif pt-1">
                                                                            <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Reviewer Comments:</span>
                                                                            <LatexRenderer content={rev.comments_for_author || "No specific author comments provided."} />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="text-xs text-slate-400 italic">Peer reviewer reports will be visible here once compiled by the editorial office.</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Published Badge Side */}
                                        {normalize(p.status) === 'PUBLISHED' && (
                                            <div className="lg:w-80 flex flex-col gap-4 shrink-0">
                                                <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 text-center space-y-4">
                                                    <CheckCircle size={32} className="mx-auto text-emerald-600" />
                                                    <p className="text-[10px] font-black text-emerald-800 uppercase tracking-[0.2em]">Record Published</p>
                                                    <a
                                                        href={`/journals/articles/${p.id}`}
                                                        className="block w-full py-3 bg-emerald-600 text-white font-black text-[10px] rounded-xl hover:bg-emerald-700 transition-all uppercase tracking-widest"
                                                    >
                                                        View Article Record
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Workflow Timeline Stepper */}
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

            {/* Revision Modal */}
            {revisionTarget && (
                <SubmitRevisionModal
                    paper={revisionTarget.paper}
                    uploadType={revisionTarget.type}
                    onClose={() => setRevisionTarget(null)}
                    onRevisionSubmitted={() => {
                        setRevisionTarget(null);
                        fetchSubmissions();
                    }}
                />
            )}
        </div>
    );
};

export default AuthorDashboard;