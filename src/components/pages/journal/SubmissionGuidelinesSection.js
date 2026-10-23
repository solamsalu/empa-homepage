// import React from 'react';
// import PrimaryButton from '../../common/PrimaryButton';
// import { Download, AlertCircle } from 'lucide-react';

// const SubmissionGuidelinesSection = () => (
//     <div>
//         <div className="text-center">
//             <h2 className="text-4xl font-extrabold text-blue-900 mb-4">Author Guidelines</h2>
//             <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-12">
//                 Adherence to JEMPA policies is mandatory for review.
//             </p>
//         </div>

//         <div className="space-y-6 bg-blue-50 p-8 rounded-xl border border-blue-200">
//             <h3 className="text-2xl font-bold text-blue-800">Submission Requirements</h3>
//             <ul className="list-decimal pl-8 space-y-4 text-lg text-gray-800">
//                 <li><strong>Format:</strong> All manuscripts must be prepared using the official JEMPA <span className="font-mono bg-blue-100 px-1">LaTeX</span> template.</li>
//                 <li><strong>File Type:</strong> Submit only the compiled PDF for initial review. Source files are required upon acceptance.</li>
//                 <li><strong>Anonymity:</strong> For double-blind review, remove author names and affiliations from the manuscript PDF.</li>
//                 <li><strong>Declarations:</strong> You must declare that the work is original, not submitted elsewhere, and free of undisclosed conflicts of interest.</li>
//                 <li><strong>AI Policy:</strong> Use of AI for grammar checking is permitted but must be disclosed. AI cannot be an author.</li>
//             </ul>
//         </div>

//         <div className="mt-8 flex justify-center gap-4">
//             <PrimaryButton onClick={() => window.open("/downloads/JEMPA_Template.zip")}>
//                 <Download className="mr-2" size={18} /> Download LaTeX Template
//             </PrimaryButton>
//             <PrimaryButton 
//     onClick={() => window.open("/downloads/JEMPA_full_guidelines.pdf")}
//     className="!bg-white !text-gray-700 border border-gray-300 hover:!bg-gray-50 !shadow-none"
// >
//     <AlertCircle className="mr-2" size={18}/> View Full Author Guide
// </PrimaryButton>
//         </div>
//     </div>
// );

// export default SubmissionGuidelinesSection;


import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle, 
  Code2, 
  BookOpen, 
  Cpu, 
  Copy, 
  Check, 
  ExternalLink,
  Scale,
  Sparkles,
  Layers
} from 'lucide-react';
import PrimaryButton from '../../common/PrimaryButton';

const SubmissionGuidelinesSection = () => {
    const [copiedSnippet, setCopiedSnippet] = useState(false);

    const latexSamplePreamble = `% JEMPA / EMPA Standard Mathematical Article Preamble
\\documentclass[11pt,reqno]{jempa} % Based on amsart
\\usepackage{amsmath,amssymb,amsthm}
\\usepackage{mathrsfs,mathtools}
\\usepackage[colorlinks=true,citecolor=blue,linkcolor=blue]{hyperref}

\\subjclass[2020]{Primary 35J05, 47H10; Secondary 65N30}
\\keywords{Nonlinear operator theory, fixed point theorem, Sobolev spaces}

\\newtheorem{theorem}{Theorem}[section]
\\newtheorem{lemma}[theorem]{Lemma}
\\theoremstyle{definition}
\\newtheorem{definition}[theorem]{Definition}
\\theoremstyle{remark}
\\newtheorem{remark}[theorem]{Remark}`;

    const handleCopySnippet = () => {
        navigator.clipboard.writeText(latexSamplePreamble);
        setCopiedSnippet(true);
        setTimeout(() => setCopiedSnippet(false), 2000);
    };

    return (
        <div className="font-sans space-y-12 max-w-6xl mx-auto py-4">
            
            {/* 1. Header Section */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest text-blue-700 bg-blue-50 border border-blue-200">
                    <BookOpen size={13} className="text-blue-600" />
                    EMPA Academic Publishing Standards
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    Author Submission Guidelines
                </h2>
                <p className="text-base text-slate-600 leading-relaxed">
                    All manuscripts submitted to the <em>Journal of the Ethiopian Mathematics Professionals Association (JEMPA)</em> must strictly adhere to the following formatting, ethical, and peer-review requirements.
                </p>
            </div>

            {/* 2. Quick Requirements Snapshot Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Manuscript Class", value: "LaTeX (jempa.cls)", icon: <Code2 size={16} className="text-blue-600" /> },
                    { label: "Review Protocol", value: "Double-Blind Peer Review", icon: <ShieldCheck size={16} className="text-emerald-600" /> },
                    { label: "Classification", value: "MSC 2020 Required", icon: <Layers size={16} className="text-indigo-600" /> },
                    { label: "Publication Model", value: "Diamond Open Access (No APC)", icon: <Sparkles size={16} className="text-amber-500" /> }
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

            {/* 3. Core Guidelines Pillars (6 Comprehensive Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Pillar 1: LaTeX & Formatting */}
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-3 hover:border-blue-300 transition">
                    <div className="flex items-center gap-2.5 text-blue-900 font-bold text-lg">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                            <Code2 size={20} />
                        </div>
                        <h3>1. Manuscript Preparation & LaTeX</h3>
                    </div>
                    <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={15} className="text-blue-600 shrink-0 mt-0.5" />
                            <span>Manuscripts must be drafted exclusively in English using standard <strong className="text-slate-800">LaTeX</strong>. Submissions in Word, LibreOffice, or plain text cannot be processed.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={15} className="text-blue-600 shrink-0 mt-0.5" />
                            <span>Include an informative abstract (150–250 words), 4–6 relevant keywords, and primary/secondary <strong className="text-slate-800">MSC (Mathematics Subject Classification 2020)</strong> codes.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={15} className="text-blue-600 shrink-0 mt-0.5" />
                            <span>All mathematical equations, assertions, definitions, and proofs must be marked up using standard AMS-LaTeX environments (<code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700">amsmath</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700">amsthm</code>).</span>
                        </li>
                    </ul>
                </div>

                {/* Pillar 2: Double-Blind Anonymization */}
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-3 hover:border-emerald-300 transition">
                    <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                            <ShieldCheck size={20} />
                        </div>
                        <h3>2. Anonymization for Double-Blind Review</h3>
                    </div>
                    <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                            <span>For initial technical triage and referee evaluation, <strong className="text-slate-800">all author names, affiliations, email addresses, and institutional links</strong> must be omitted from the compiled PDF.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                            <span>Cite your own prior work in the third person (e.g., write <em>"In [3], Guta showed..."</em> rather than <em>"In our previous research [3]..."</em>).</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                            <span>Do not include specific grant numbers, university project codes, or personal acknowledgments in the initial draft; these are added in the camera-ready revision.</span>
                        </li>
                    </ul>
                </div>

                {/* Pillar 3: Ethics & Originality */}
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-3 hover:border-amber-300 transition">
                    <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                            <Scale size={20} />
                        </div>
                        <h3>3. Research Integrity & COPE Guidelines</h3>
                    </div>
                    <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={15} className="text-amber-600 shrink-0 mt-0.5" />
                            <span>Submissions must present genuine, original mathematical research that is neither published nor under review in any other journal, book, or peer-reviewed proceedings.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={15} className="text-amber-600 shrink-0 mt-0.5" />
                            <span>Manuscripts are screened for textual and structural similarity. Plagiarism, redundant publication, or fabricated proof lemmas result in immediate rejection and notification to the institution.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={15} className="text-amber-600 shrink-0 mt-0.5" />
                            <span>All listed co-authors must have made substantial contributions to the mathematical proofs or numerical computation and must consent to the submission.</span>
                        </li>
                    </ul>
                </div>

                {/* Pillar 4: AI & Machine Learning Policy */}
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-3 hover:border-indigo-300 transition">
                    <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                            <Cpu size={20} />
                        </div>
                        <h3>4. Generative AI & Large Language Models</h3>
                    </div>
                    <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={15} className="text-indigo-600 shrink-0 mt-0.5" />
                            <span><strong className="text-slate-800">Non-Authorship of AI:</strong> Artificial intelligence models (such as ChatGPT, Claude, or Copilot) do not satisfy authorship criteria and cannot be listed as an author or co-author.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={15} className="text-indigo-600 shrink-0 mt-0.5" />
                            <span>Authors may use AI tools solely for stylistic readability or proofreading, and must disclose this in the methodology or acknowledgments section.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={15} className="text-indigo-600 shrink-0 mt-0.5" />
                            <span>The primary corresponding author assumes full legal and academic accountability for the factual and mathematical validity of the published paper.</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* 4. Interactive LaTeX Preamble Code Snippet */}
            <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-4 shadow-xl border border-slate-800">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                            <Code2 size={16} /> Sample AMS-LaTeX Article Structure
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Standard template preamble compatible with the JEMPA editorial production pipeline.
                        </p>
                    </div>
                    <button
                        onClick={handleCopySnippet}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-white/10"
                    >
                        {copiedSnippet ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        <span>{copiedSnippet ? 'Copied' : 'Copy Preamble'}</span>
                    </button>
                </div>

                <pre className="text-xs font-mono bg-slate-950 p-4 rounded-2xl overflow-x-auto text-blue-100 leading-relaxed border border-slate-800/80">
                    {latexSamplePreamble}
                </pre>
            </div>

            {/* 5. Downloads & Action Hub */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 p-8 sm:p-10 rounded-3xl border border-blue-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left max-w-xl">
                    <h3 className="text-xl sm:text-2xl font-black text-blue-950">
                        Ready to Format Your Manuscript?
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        Download the official JEMPA LaTeX package (containing <code className="bg-white/80 px-1 py-0.5 rounded text-blue-800 font-bold">jempa.cls</code>, sample document, and BibTeX styles) or consult the complete editorial handbook.
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
                    <PrimaryButton 
                        onClick={() => window.open("/downloads/JEMPA_Template.zip")}
                        className="shadow-lg shadow-blue-600/20 px-5 py-3 text-xs font-bold uppercase tracking-wider"
                    >
                        <Download className="mr-2" size={16} /> Download LaTeX Package (.zip)
                    </PrimaryButton>
                    
                    <button 
                        onClick={() => window.open("/downloads/JEMPA_full_guidelines.pdf")}
                        className="px-5 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold rounded-xl text-xs uppercase tracking-wider transition flex items-center shadow-sm"
                    >
                        <FileText className="mr-2 text-slate-500" size={16} /> Full Editorial Guide (PDF)
                    </button>
                </div>
            </div>

        </div>
    );
};

export default SubmissionGuidelinesSection;