// import React from 'react';
// import { CheckCircle2, BarChart3, Fingerprint, Quote, Download } from 'lucide-react';
// import LatexRenderer from '../../common/LatexRenderer';
// import 'katex/dist/katex.min.css';
// import { InlineMath, BlockMath } from 'react-katex';
// import { generateDoi } from '../../../utils/doiHelper';

// const PublicationDetails = ({ paper }) => {
//     if (!paper) return null;

//     const vol = paper.volume_number || 1;
//     const iss = paper.issue_number || 1;
//     const pg = paper.page_order || paper.id || 1;

//     const citationDate = paper.published_at 
//         ? new Date(paper.published_at).getFullYear() 
//         : new Date().getFullYear();

//     // ✅ New DOI format
//     const doi = generateDoi(paper);

//     const viewCount = paper.view_count ??  0;
//     const downloadCount = paper.download_count ?? 0;

//     return (
//         <div className="mt-8 animate-in fade-in zoom-in duration-500">
//             <div className="bg-emerald-50 border border-emerald-200 rounded-3xl overflow-hidden shadow-sm">
//                 {/* Header */}
//                 <div className="bg-emerald-600 p-4 text-white flex items-center gap-2">
//                     <CheckCircle2 size={20} />
//                     <span className="font-black text-xs uppercase tracking-widest">
//                         Official Publication Details & Impact
//                     </span>
//                 </div>

//                 <div className="p-6 grid md:grid-cols-2 gap-8">
//                     {/* Left Column: Citation & DOI */}
//                     <div className="space-y-6">
//                         <div>
//                             <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-2 uppercase tracking-tighter">
//                                 <Fingerprint size={14} /> Registered DOI
//                             </div>
//                             <p className="bg-white border border-emerald-100 p-3 rounded-xl font-mono text-sm text-blue-600 shadow-inner">
//                                 https://doi.org/{doi}
//                             </p>
//                         </div>

//                         <div>
//                             <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-2 uppercase tracking-tighter">
//                                 <Quote size={14} /> Recommended Citation
//                             </div>
//                             <div className="bg-white/80 border border-emerald-100 p-4 rounded-xl text-xs text-slate-700 font-serif leading-relaxed shadow-inner">
//                                 {paper.author_name} ({citationDate}).{' '}
//                                 <LatexRenderer content={paper.title} />.{' '}
//                                 <em>Hissab (JEMPA)</em>, Vol. {paper.volume_number || '1'}, Issue {paper.issue_number || '1'}.{' '}
//                                 DOI: {doi}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Right Column: Metrics */}
//                     <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm flex flex-col justify-between">
//                         <div>
//                             <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase mb-4 tracking-widest">
//                                 <BarChart3 size={14} /> Real-Time Impact Metrics
//                             </div>

//                             <div className="grid grid-cols-2 gap-4">
//                                 <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
//                                     <p className="text-3xl font-black text-blue-600">{viewCount}</p>
//                                     <p className="text-[10px] font-black text-slate-400 uppercase mt-1">Total Views</p>
//                                 </div>
//                                 <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
//                                     <p className="text-3xl font-black text-emerald-600">{downloadCount}</p>
//                                     <p className="text-[10px] font-black text-slate-400 uppercase mt-1">PDF Downloads</p>
//                                 </div>
//                             </div>
//                         </div>

//                         <p className="mt-4 text-[10px] text-center text-slate-400 italic">
//                             Statistics update automatically as readers access your paper.
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PublicationDetails;


// src/components/pages/journal/PublicationDetails.js
import React from 'react';
import { CheckCircle2, BarChart3, Fingerprint, Quote } from 'lucide-react';
import LatexRenderer from '../../common/LatexRenderer';
import { generateDoi } from '../../../utils/doiHelper';

const PublicationDetails = ({ paper }) => {
    if (!paper) return null;

    // 🔍 DEBUG: Log the exact paper object to F12 Console
    // console.log("📊 PUBLICATION DETAILS PAPER OBJECT:", paper);

    const citationDate = paper.published_at 
        ? new Date(paper.published_at).getFullYear() 
        : new Date().getFullYear();

    const doi = generateDoi(paper);

    // ✅ Check EVERY possible property name MySQL or Express might have returned:
    const viewCount = 
        paper.view_count ?? 
        paper.views ?? 
        paper.views_count ?? 
        paper.total_views ?? 
        0;

    const downloadCount = 
        paper.download_count ?? 
        paper.downloads ?? 
        paper.downloads_count ?? 
        paper.total_downloads ?? 
        0;

    return (
        <div className="mt-8 animate-in fade-in zoom-in duration-500">
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="bg-emerald-600 p-4 text-white flex items-center gap-2">
                    <CheckCircle2 size={20} />
                    <span className="font-black text-xs uppercase tracking-widest">
                        Official Publication Details & Impact
                    </span>
                </div>

                <div className="p-6 grid md:grid-cols-2 gap-8">
                    {/* Left Column: Citation & DOI */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-2 uppercase tracking-tighter">
                                <Fingerprint size={14} /> Registered DOI
                            </div>
                            <p className="bg-white border border-emerald-100 p-3 rounded-xl font-mono text-sm text-blue-600 shadow-inner">
                                https://doi.org/{doi}
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-2 uppercase tracking-tighter">
                                <Quote size={14} /> Recommended Citation
                            </div>
                            <div className="bg-white/80 border border-emerald-100 p-4 rounded-xl text-xs text-slate-700 font-serif leading-relaxed shadow-inner">
                                {paper.author_name} ({citationDate}).{' '}
                                <LatexRenderer content={paper.title} />.{' '}
                                <em>Hissab (JEMPA)</em>, Vol. {paper.volume_number || '1'}, Issue {paper.issue_number || '1'}.{' '}
                                DOI: {doi}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Metrics */}
                    <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase mb-4 tracking-widest">
                                <BarChart3 size={14} /> Real-Time Impact Metrics
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-3xl font-black text-blue-600">{Number(viewCount)}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mt-1">Total Views</p>
                                </div>
                                <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-3xl font-black text-emerald-600">{Number(downloadCount)}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mt-1">PDF Downloads</p>
                                </div>
                            </div>
                        </div>

                        <p className="mt-4 text-[10px] text-center text-slate-400 italic">
                            Statistics update automatically as readers access your paper.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicationDetails;