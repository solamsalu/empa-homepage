import React from 'react';
import { CheckCircle2, BarChart3, Fingerprint, Quote, Download } from 'lucide-react';
import LatexRenderer from '../../common/LatexRenderer';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';


const PublicationDetails = ({ paper }) => {
    // We prepare the citation. Note: We use the raw title here because 
    // we will render the math version in the JSX below.
    const citationDate = new Date(paper.published_at || Date.now()).getFullYear();
    const doi = `10.66894/jempa.${paper.id}`;

    // const fullCitation = `${paper.author_name} (${citationDate}). "${paper.title}". JEMPA Journal. DOI: ${doi}`;
    // const fullCitation = `${paper.author_name} (${citationDate}). ${paper.title}. JEMPA Journal, Vol. ${paper.volume_number}, Issue ${paper.issue_number}. DOI: ${doi}`;


    return (
        <div className="mt-8 animate-in fade-in zoom-in duration-500">
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl overflow-hidden shadow-sm">
                {/* Header */}
                <div className="bg-emerald-600 p-4 text-white flex items-center gap-2">
                    <CheckCircle2 size={20} />
                    <span className="font-black text-xs uppercase tracking-widest">Official Publication Details</span>
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
                                {/* <LatexRenderer content={fullCitation} /> */}
                                <div className="bg-white/80 border border-emerald-100 p-4 rounded-xl text-xs text-slate-700 font-serif leading-relaxed shadow-inner">
                                    {paper.author_name} ({citationDate}). 
                                    <LatexRenderer content={paper.title} />. 
                                    <em>JEMPA Journal</em>, Vol. {paper.volume_number}, Issue {paper.issue_number}. 
                                    DOI: {doi}
                                </div>

                            </div>

                        </div>
                    </div>

                    {/* Right Column: Metrics */}
                    <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase mb-6 tracking-widest">
                            <BarChart3 size={14} /> Impact Metrics
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-3xl font-black text-emerald-600">{paper.views || 0}</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase"><LatexRenderer content={paper.abstract} /></p>
                            </div>
                            <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-3xl font-black text-emerald-600">{paper.downloads || 0}</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase">PDF Downloads</p>
                            </div>
                        </div>

                        <p className="mt-6 text-[10px] text-center text-slate-400 italic">
                            Metrics are updated every 24 hours.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicationDetails;