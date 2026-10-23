// src/components/pages/conferences/SubmissionGuidelinesPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  ShieldCheck, 
  Layers, 
  Calendar, 
  Download, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  Code2, 
  Scale, 
  Cpu, 
  BookOpen, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import PrimaryButton from '../../common/PrimaryButton';

const SubmissionGuidelinesPage = () => {
    return (
        <div className="font-sans space-y-12 max-w-6xl mx-auto py-6">
            
            {/* 1. Header Section */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest text-blue-700 bg-blue-50 border border-blue-200">
                    <BookOpen size={13} className="text-blue-600" />
                    EMPA Annual Conference Guidelines
                </span>
                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                    Conference Paper Submission Guidelines
                </h1>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                    Please carefully review these instructions before submitting your manuscript. Strict compliance ensures an efficient double-blind peer review and seamless indexing in the official conference proceedings.
                </p>
            </div>

            {/* 2. Quick Standards Snapshot Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Manuscript Format", value: "PDF Only (LaTeX Preferred)", icon: <Code2 size={16} className="text-blue-600" /> },
                    { label: "Review Protocol", value: "Double-Blind (2 Reviewers)", icon: <ShieldCheck size={16} className="text-emerald-600" /> },
                    { label: "Page & Size Limit", value: "8–10 Pages (Max 15MB)", icon: <Layers size={16} className="text-indigo-600" /> },
                    { label: "Proceedings Output", value: "Indexed EMPA Proceedings", icon: <CheckCircle2 size={16} className="text-amber-500" /> }
                ].map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-1">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                            {item.icon}
                            <span>{item.label}</span>
                        </div>
                        <span className="text-sm font-black text-slate-900">{item.value}</span>
                    </div>
                ))}
            </div>

            {/* 3. Core Guidelines Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Section 1: Paper Format & Technical Specs */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-blue-300 transition">
                    <div className="flex items-center gap-3 text-slate-900 font-bold text-lg">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
                            <Code2 size={20} />
                        </div>
                        <h3>1. Technical Formatting & Length</h3>
                    </div>
                    <ul className="text-xs sm:text-sm text-slate-600 space-y-2.5 leading-relaxed">
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-blue-600 shrink-0 mt-0.5" />
                            <span><strong>Language:</strong> Papers must be prepared exclusively in English with clear mathematical notation.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-blue-600 shrink-0 mt-0.5" />
                            <span><strong>Document Engine:</strong> Authors are strongly encouraged to use standard <strong className="text-slate-800">LaTeX</strong> (<code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700">amsart</code> or EMPA template). Manuscripts must be compiled into a single PDF.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-blue-600 shrink-0 mt-0.5" />
                            <span><strong>Length & Limits:</strong> Full papers should range between <strong className="text-slate-800">8 to 10 pages</strong> (including figures, tables, and bibliography). File size must not exceed <strong className="text-slate-800">15MB</strong>.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-blue-600 shrink-0 mt-0.5" />
                            <span><strong>Page Setup:</strong> Standard A4 format with 1-inch (2.54 cm) margins on all sides and 11pt or 12pt standard typeface.</span>
                        </li>
                    </ul>
                </div>

                {/* Section 2: Strict Double-Blind Anonymization */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-emerald-300 transition">
                    <div className="flex items-center gap-3 text-slate-900 font-bold text-lg">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
                            <ShieldCheck size={20} />
                        </div>
                        <h3>2. Double-Blind Anonymization Protocol</h3>
                    </div>
                    <ul className="text-xs sm:text-sm text-slate-600 space-y-2.5 leading-relaxed">
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                            <span><strong>Version 1 (Initial Blind Draft):</strong> Remove all author names, institutional affiliations, contact emails, and personal headers from the PDF draft.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                            <span><strong>Self-Citations:</strong> Reference your own prior publications in the third person (e.g., cite as <em>"In [4], Kebede demonstrated..."</em> rather than <em>"In our previous paper [4]..."</em>).</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                            <span><strong>Acknowledgments:</strong> Omit university research grant numbers or funding credits in the review draft. These are added during the final Camera-Ready phase.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                            <span><strong>Document Metadata:</strong> Clear author properties from PDF metadata properties before uploading.</span>
                        </li>
                    </ul>
                </div>

                {/* Section 3: Paper Structure & Nomenclature */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-indigo-300 transition">
                    <div className="flex items-center gap-3 text-slate-900 font-bold text-lg">
                        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
                            <Layers size={20} />
                        </div>
                        <h3>3. Academic Structure & Classification</h3>
                    </div>
                    <ul className="text-xs sm:text-sm text-slate-600 space-y-2.5 leading-relaxed">
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                            <span><strong>Title & Abstract:</strong> Title should be informative and concise. The abstract (200–300 words) must outline the problem statement, analytical methods, core theorems, and significance.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                            <span><strong>MSC 2020 Codes:</strong> Authors must provide primary and secondary <strong className="text-slate-800">Mathematics Subject Classification</strong> codes alongside 4–6 relevant keywords.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                            <span><strong>Standard Sections:</strong> Introduction $\rightarrow$ Theoretical Framework / Methodology $\rightarrow$ Main Results & Proofs $\rightarrow$ Numerical Experiments (if applicable) $\rightarrow$ Conclusion $\rightarrow$ References.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                            <span><strong>Bibliography:</strong> Citations should follow standard AMS/BibTeX convention with full journal titles and DOIs where available.</span>
                        </li>
                    </ul>
                </div>

                {/* Section 4: Ethics, Originality & AI Policy */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-amber-300 transition">
                    <div className="flex items-center gap-3 text-slate-900 font-bold text-lg">
                        <div className="p-2.5 bg-amber-50 text-amber-600 rounded-2xl">
                            <Scale size={20} />
                        </div>
                        <h3>4. Publication Ethics & AI Policy</h3>
                    </div>
                    <ul className="text-xs sm:text-sm text-slate-600 space-y-2.5 leading-relaxed">
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-amber-600 shrink-0 mt-0.5" />
                            <span><strong>Originality:</strong> All submissions must report original, previously unpublished research. Simultaneous submission to other conferences or journals is strictly prohibited.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-amber-600 shrink-0 mt-0.5" />
                            <span><strong>Similarity Index:</strong> Manuscripts are systematically verified with plagiarism detection software. Overlapping content exceeding 15% will be rejected automatically.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-amber-600 shrink-0 mt-0.5" />
                            <span><strong>Generative AI (LLMs):</strong> Generative AI tools (e.g., ChatGPT, Claude) do not meet the criteria for authorship and cannot be credited as authors. Use of AI for grammar refinement must be disclosed.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-amber-600 shrink-0 mt-0.5" />
                            <span><strong>Author Consent:</strong> Submission implies that all co-authors have reviewed and approved the manuscript contents and agreed to presentation.</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* 4. Submission & Peer-Review Lifecycle Workflow */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block">
                        Evaluation Protocol
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                        Review Process & Proceedings Publication
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                        <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Stage 1</span>
                        <h4 className="text-sm font-bold text-slate-900">Technical Triage</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Submissions are checked for scope, track assignment, formatting adherence, and complete anonymity.
                        </p>
                    </div>

                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                        <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">Stage 2</span>
                        <h4 className="text-sm font-bold text-slate-900">Double-Blind Review</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Evaluated by at least <strong>two independent referees</strong> scoring Originality, Methodology, Significance, and Clarity.
                        </p>
                    </div>

                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                        <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Stage 3</span>
                        <h4 className="text-sm font-bold text-slate-900">Chair Decision</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Official notice issued: <em>Accepted for Oral Lecture</em>, <em>Accepted for Poster</em>, <em>Revisions Required</em>, or <em>Declined</em>.
                        </p>
                    </div>

                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                        <span className="text-xs font-black text-amber-600 uppercase tracking-widest">Stage 4</span>
                        <h4 className="text-sm font-bold text-slate-900">Camera-Ready & Proceedings</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Authors upload Version 2 (author names restored). Published in official indexed proceedings with verifiable presentation certificates.
                        </p>
                    </div>
                </div>
            </div>

            {/* 5. Downloads, Templates & Portal Navigation Card */}
            <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 p-8 sm:p-12 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-3 text-center md:text-left max-w-xl">
                    <span className="text-xs font-black uppercase tracking-widest text-blue-300">
                        Official Author Package
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        Download LaTeX Templates & Guides
                    </h3>
                    <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                        Download the official EMPA Conference LaTeX package (including class file, sample article structure, and BibTeX style) or consult the comprehensive PDF handbook.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
                    <a
                        href="/downloads/JEMPA_Template.zip"
                        download
                        className="w-full sm:w-auto px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                    >
                        <Download size={16} /> Download LaTeX Package (.zip)
                    </a>
                    
                    <Link
                        to="/submit-paper"
                        className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2"
                    >
                        <span>Go to Submission Portal</span>
                        <ArrowRight size={15} />
                    </Link>
                </div>
            </div>

            {/* 6. Help & Inquiries Footer Card */}
            <div className="p-8 bg-slate-50 border border-slate-200 rounded-3xl text-center space-y-3">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto border border-blue-100">
                    <HelpCircle size={24} />
                </div>
                <h4 className="text-xl font-bold text-slate-900">
                    Questions Regarding Conference Guidelines?
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                    If you have questions regarding thematic track alignment, formatting questions, or special presentation accommodations, please reach out to the Program Committee Secretariat.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-xs font-bold text-slate-700 pt-2">
                    <p>Email: <a href="mailto:conference@eth-math.org" className="text-blue-600 hover:underline">conference@eth-math.org</a></p>
                    <span className="hidden sm:inline text-slate-300">|</span>
                    <p>Phone: <a href="tel:+251111239461" className="text-blue-600 hover:underline">+251-111-239461</a></p>
                    <span className="hidden sm:inline text-slate-300">|</span>
                    <Link to="/contact" className="text-blue-600 hover:underline">Contact Support Desk</Link>
                </div>
            </div>

        </div>
    );
};

export default SubmissionGuidelinesPage;