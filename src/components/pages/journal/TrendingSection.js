import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../utils/constants';
import { TrendingUp, Download, Eye, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import LatexRenderer from '../../common/LatexRenderer';

/**
 * TrendingSection displays the most popular articles based on a combined
 * score of views and downloads.
 */
const TrendingSection = () => {
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                // Fetch the top 3-5 articles from the backend analytics engine
                const res = await axios.get(`${API_BASE_URL}/journal-papers/public/trending`);
                setPapers(res.data.data || []);
            } catch (err) {
                console.error("Failed to load trending papers:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTrending();
    }, []);

    // If the data is still loading or there are no papers, hide the section entirely
    if (loading || papers.length === 0) return null;

    return (
        <div className="py-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-rose-600 text-white rounded-2xl shadow-lg shadow-rose-100">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Most Popular Research</h2>
                        <p className="text-sm text-slate-500 font-medium italic">Based on total downloads and community interest</p>
                    </div>
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {papers.map((paper, index) => (
                    <Link 
                        to={`/journals/articles/${paper.id}`} 
                        key={paper.id}
                        className="group relative bg-white p-7 rounded-[2rem] border border-slate-200 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300"
                    >
                        {/* Rank Badge */}
                        <div className="absolute -top-3 -right-3 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg group-hover:bg-blue-600 transition-colors z-10">
                            {index === 0 ? <Award size={20} /> : <span className="font-black text-xs">#{index + 1}</span>}
                        </div>

                        <div className="flex flex-col h-full">
                            {/* Metrics Area */}
                            <div className="flex gap-4 mb-6 border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-1.5 text-slate-400">
                                    <Eye size={14} className="group-hover:text-blue-500 transition-colors" />
                                    <span className="text-xs font-black uppercase tracking-widest">{paper.view_count || 0}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-400">
                                    <Download size={14} className="group-hover:text-emerald-500 transition-colors" />
                                    <span className="text-xs font-black uppercase tracking-widest text-emerald-600">{paper.download_count || 0}</span>
                                </div>
                            </div>

                            {/* Math Title Area */}
                            <div className="flex-grow">
                                <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2 min-h-[3rem]">
                                    <LatexRenderer content={paper.title} />
                                </h3>
                                
                                <div className="mt-4 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
                                        {paper.author_name?.charAt(0) || 'A'}
                                    </div>
                                    <p className="text-xs text-slate-500 font-black uppercase tracking-tighter">
                                        {paper.author_name}
                                    </p>
                                </div>
                            </div>

                            {/* Tags / Footer */}
                            <div className="mt-8 pt-4 border-t border-slate-50 flex items-center justify-between">
                                <span className="bg-blue-50 text-blue-700 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100">
                                    {paper.specialization || "General Math"}
                                </span>
                                <span className="text-[10px] font-bold text-slate-300 uppercase group-hover:text-blue-500 transition-colors">
                                    View Abstract →
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default TrendingSection;