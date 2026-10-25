// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import axios from 'axios';
// import { API_BASE_URL, STATIC_ASSETS_BASE_URL } from '../../../utils/constants';
// import { Download, Book, Eye, Quote, Share2, Calendar, FileText } from 'lucide-react';
// import HtmlContentRenderer from '../../common/HtmlContentRenderer';
// import LatexRenderer from '../../common/LatexRenderer';
// import { generateDoi } from '../../../utils/doiHelper';
// import { toast } from 'react-toastify';
// import { Helmet } from 'react-helmet-async';

// const ArticleDetailPage = () => {
//     const { paperId } = useParams();
//     const [paper, setPaper] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState('');

//     // 1. ANALYTICS: Track a "View" when the page opens
//     const trackView = useCallback(async () => {
//         try {
//             await axios.post(`${API_BASE_URL}/journal-papers/public/${paperId}/view`);
//         } catch (e) {
//             console.error("Analytics Error (View)");
//         }
//     }, [paperId]);

//     // 2. ANALYTICS: Track a "Download" when the button is clicked
//     const handleDownload = async () => {
//         try {
//             // Trigger the increment on the backend
//             await axios.post(`${API_BASE_URL}/journal-papers/public/${paperId}/download`);

//             // Open the actual PDF file in a new tab
//             const fileUrl = `${STATIC_ASSETS_BASE_URL}${paper.production_file_url || paper.pdf_url}`;
//             window.open(fileUrl, '_blank');
//         } catch (e) {
//             console.error("Analytics Error (Download)");
//             toast.info("Could not process download. Please try again.");
//         }
//     };

//     useEffect(() => {
//         const fetchPaper = async () => {
//             if (!paperId) return;
//             setIsLoading(true);
//             try {
//                 const response = await axios.get(`${API_BASE_URL}/journal-papers/public/${paperId}`);
//                 setPaper(response.data.data);

//                 // Once data is loaded, track the view
//                 trackView();
//             } catch (err) {
//                 setError(err.response?.data?.message || 'Could not load the article.');
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchPaper();
//     }, [paperId, trackView]);

//     if (isLoading) return (
//         <div className="flex flex-col items-center justify-center min-h-screen text-slate-400">
//             <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
//             <p className="font-bold uppercase tracking-widest text-xs">Retrieving Article...</p>
//         </div>
//     );

//     if (error) return <div className="text-center p-20 text-red-600 font-bold">{error}</div>;
//     if (!paper) return <div className="text-center p-20">Article not found.</div>;

//     const pubYear = paper.publication_date ? new Date(paper.publication_date).getFullYear() : new Date().getFullYear();
//     // const citation = `${paper.author_name} (${pubYear}). "${paper.title.replace(/<[^>]+>/g, '')}". JEMPA, Vol ${paper.volume_number}(${paper.issue_number}). DOI: 10.66894/jempa.${paper.id}`;
//     // const doi = `10.66894/jempa.${paper.id}`;
//     const doi = generateDoi(paper);

//     return (
//         <div className="bg-[#f8fafc] min-h-screen pb-10 pt-14 md:pt-22">
//             {/* Header / Breadcrumbs */}
//             <div className="bg-white border-b border-slate-200">
//                 <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
//                     <Link to="/journals" className="text-blue-600 font-bold text-sm flex items-center gap-2 hover:underline">
//                         <Book size={16} /> Journal Archive
//                     </Link>
//                     <div className="flex items-center gap-4 text-slate-400">
//                         <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="hover:text-blue-600 transition-colors" title="Copy Link"><Share2 size={18} /></button>
//                     </div>
//                 </div>
//             </div>

//             <header className="bg-white border-b border-slate-100 py-12 shadow-sm">
//                 <div className="max-w-4xl mx-auto px-6">
//                     <div className="flex flex-wrap items-center gap-3 mb-4">
//                         <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
//                             Volume {paper.volume_number}, Issue {paper.issue_number}
//                         </span>
//                         <span className="flex items-center gap-1 text-slate-400 text-xs font-bold uppercase">
//                             <Calendar size={14} /> {pubYear}
//                         </span>
//                     </div>

//                     <h1 className="text-3xl lg:text-5xl font-black text-slate-900 leading-tight mb-6">
//                         {/* <HtmlContentRenderer  htmlContent={paper.title}/> */}
//                         <LatexRenderer content={paper.title} />

//                     </h1>

//                     <div className="flex items-center gap-4">
//                         <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-100">
//                             {paper.author_name?.charAt(0)}
//                         </div>
//                         <div>
//                             <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Lead Author</p>
//                             <p className="text-lg font-bold text-slate-800">{paper.author_name}</p>
//                         </div>
//                     </div>
//                 </div>
//             </header>

//             <main className="max-w-5xl mx-auto py-12 px-6 grid lg:grid-cols-3 gap-12">

//                 {/* Main Content */}
//                 <div className="lg:col-span-2 space-y-12">
//                     <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
//                         <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 border-b pb-2">Abstract</h2>
//                         <div className="text-slate-700 leading-relaxed text-lg font-serif italic">
//                             {/* <HtmlContentRenderer  htmlContent={paper.abstract} /> */}
//                             <LatexRenderer content={paper.abstract} />
//                         </div>

//                         <div className="mt-8 flex flex-wrap gap-2">
//                             {paper.keywords?.split(',').map(kw => (
//                                 <span key={kw} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-medium lowercase">#{kw.trim()}</span>
//                             ))}
//                         </div>
//                     </section>

//                     {/* <section className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
//                         <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
//                             <Quote size={16}/> Suggested Citation
//                         </h3>
//                         <div className="text-sm font-mono leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/10">
//                             {citation}
//                         </div>
//                     </section> */}
//                     {/* <section className="bg-slate-100 text-slate-900 p-8 rounded-3xl shadow-xl">
//   <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
//     <Quote size={16}/> Suggested Citation
//   </h3>
//   <div className="text-sm font-mono leading-relaxed bg-white p-4 rounded-2xl border border-slate-200">
//     {paper.author_name} ({pubYear}). 
//     <LatexRenderer content={paper.title} />. 
//     <em>JEMPA</em>, Vol. {paper.volume_number}({paper.issue_number}). 
//     DOI: 10.66894/jempa.{paper.id}
//   </div>
// </section> */}

//                     {/* Suggested Citation Section */}
//                     <section className="bg-slate-100 text-slate-900 p-8 rounded-3xl shadow-xl">
//                         <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
//                             <Quote size={16} /> Suggested Citation
//                         </h3>
//                         <div className="text-sm font-mono leading-relaxed bg-white p-4 rounded-2xl border border-slate-200">
//                             {paper.author_name} ({pubYear}).{' '}
//                             <LatexRenderer content={paper.title} />.{' '}
//                             <em>Hissab (JEMPA)</em>, Vol. {paper.volume_number}({paper.issue_number}).{' '}
//                             DOI: {doi}
//                         </div>
//                     </section>
//                 </div>

//                 {/* Sidebar Actions */}
//                 <aside className="lg:col-span-1 space-y-6">
//                     <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-24">

//                         {/* 3. IMPACT METRICS DISPLAY */}
//                         <div className="grid grid-cols-2 gap-4 mb-8">
//                             <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
//                                 <p className="text-2xl font-black text-blue-600">{paper.view_count || 0}</p>
//                                 <div className="flex items-center justify-center gap-1 text-[9px] font-black text-slate-400 uppercase">
//                                     <Eye size={10} /> Views
//                                 </div>
//                             </div>
//                             <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
//                                 <p className="text-2xl font-black text-emerald-600">{paper.download_count || 0}</p>
//                                 <div className="flex items-center justify-center gap-1 text-[9px] font-black text-slate-400 uppercase">
//                                     <Download size={10} /> Downloads
//                                 </div>
//                             </div>
//                         </div>

//                         <button
//                             onClick={handleDownload}
//                             className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95 uppercase tracking-widest text-xs"
//                         >
//                             <FileText size={20} />
//                             Download Full PDF
//                         </button>

//                         <div className="mt-8 pt-6 border-t border-slate-100">
//                             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Indexing Information</h4>
//                             <div className="space-y-3">
//                                 <div className="flex justify-between text-xs">
//                                     <span className="text-slate-400">Article Type:</span>
//                                     <span className="font-bold text-slate-700">{paper.article_type}</span>
//                                 </div>
//                                 <div className="flex justify-between text-xs">
//                                     <span className="text-slate-400">Subject:</span>
//                                     <span className="font-bold text-slate-700">{paper.specialization}</span>
//                                 </div>
//                                 {/* <div className="flex justify-between text-xs">
//                                     <span className="text-slate-400">DOI:</span>
//                                     <span className="font-bold text-blue-600">10.66894/jempa.{paper.id}</span>
//                                 </div> */}
//                                 <div className="flex justify-between text-xs">
//                                     <span className="text-slate-400">DOI:</span>
//                                     <span className="font-bold text-blue-600">{doi}</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </aside>
//             </main>
//         </div>
//     );
// };

// export default ArticleDetailPage;


import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL, STATIC_ASSETS_BASE_URL } from '../../../utils/constants';
import { Download, Book, Eye, Quote, Share2, Calendar, FileText, BookOpen, Copy } from 'lucide-react';
import LatexRenderer from '../../common/LatexRenderer';
import { generateDoi } from '../../../utils/doiHelper';
import { toast } from 'react-toastify';
import CitationModal from './CitationModal';

const ArticleDetailPage = () => {
    const { paperId } = useParams();
    const [paper, setPaper] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCitationModal, setShowCitationModal] = useState(false);

    // 1. ANALYTICS: Track a "View" when the page opens
    const trackView = useCallback(async () => {
        try {
            await axios.post(`${API_BASE_URL}/journal-papers/public/${paperId}/view`);
        } catch (e) {
            console.error("Analytics Error (View)");
        }
    }, [paperId]);

    // 2. DOWNLOAD: Track count & open PDF safely without popup-blocker issues
    const handleDownload = async () => {
        const targetFile = paper.production_file_url || paper.pdf_url || paper.manuscript_file_url;
        if (!targetFile) {
            toast.warn("The PDF for this article is not currently available.");
            return;
        }

        const cleanPath = targetFile.replace(/^\/?(uploads\/)?/, '');
        const fileUrl = `${STATIC_ASSETS_BASE_URL}/uploads/${cleanPath}`;

        // Open window synchronously to avoid browser popup blockers
        const downloadWindow = window.open('about:blank', '_blank');

        try {
            await axios.post(`${API_BASE_URL}/journal-papers/public/${paperId}/download`);
            if (downloadWindow) {
                downloadWindow.location.href = fileUrl;
            }
        } catch (e) {
            console.error("Analytics Error (Download)");
            // Still deliver file even if analytics logging fails
            if (downloadWindow) {
                downloadWindow.location.href = fileUrl;
            }
        }
    };

    useEffect(() => {
        const fetchPaper = async () => {
            if (!paperId) return;
            setIsLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/journal-papers/public/${paperId}`);
                setPaper(response.data.data);
                trackView();
            } catch (err) {
                setError(err.response?.data?.message || 'Could not load the article.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPaper();
    }, [paperId, trackView]);

    // =========================================================================
    // ✅ ZERO-DEPENDENCY GOOGLE SCHOLAR META TAGS INJECTION
    // =========================================================================
    useEffect(() => {
        if (!paper) return;

        const cleanTitle = (paper.title || '').replace(/<[^>]+>/g, '').trim();
        const pubYear = paper.publication_date ? new Date(paper.publication_date).getFullYear() : new Date().getFullYear();
        const doi = generateDoi(paper);
        const pdfUrl = `${STATIC_ASSETS_BASE_URL}/uploads/${(paper.production_file_url || paper.pdf_url || paper.manuscript_file_url || '').replace(/^(\/?uploads\/)/, '')}`;

        // 1. Update Tab Title
        document.title = `${cleanTitle} | JEMPA`;

        // 2. Highwire Press Meta Tags for Google Scholar
        const tags = [
            { name: 'citation_title', content: cleanTitle },
            { name: 'citation_author', content: paper.author_name },
            { name: 'citation_publication_date', content: paper.publication_date ? paper.publication_date.split('T')[0] : `${pubYear}/01/01` },
            { name: 'citation_journal_title', content: 'Hissab: Journal of the Ethiopian Mathematics Professionals Association (JEMPA)' },
            { name: 'citation_volume', content: String(paper.volume_number || '1') },
            { name: 'citation_issue', content: String(paper.issue_number || '1') },
            { name: 'citation_doi', content: doi },
            { name: 'citation_pdf_url', content: pdfUrl },
            { name: 'citation_language', content: 'en' }
        ];

        const createdElements = tags.map(({ name, content }) => {
            const meta = document.createElement('meta');
            meta.setAttribute('name', name);
            meta.setAttribute('content', content || '');
            document.head.appendChild(meta);
            return meta;
        });

        // Cleanup on unmount when user navigates away
        return () => {
            createdElements.forEach(meta => {
                if (meta.parentNode) meta.parentNode.removeChild(meta);
            });
        };
    }, [paper]);

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-screen text-slate-400">
            <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
            <p className="font-bold uppercase tracking-widest text-xs">Retrieving Article...</p>
        </div>
    );

    if (error) return <div className="text-center p-20 text-red-600 font-bold">{error}</div>;
    if (!paper) return <div className="text-center p-20">Article not found.</div>;

    const pubYear = paper.publication_date ? new Date(paper.publication_date).getFullYear() : new Date().getFullYear();
    const doi = generateDoi(paper);
    const cleanTitle = (paper.title || '').replace(/<[^>]+>/g, '').trim();
    
    // Quick Copy Citation String (APA Format)
    const citationText = `${paper.author_name} (${pubYear}). ${cleanTitle}. Hissab (JEMPA), ${paper.volume_number || 1}(${paper.issue_number || 1}). DOI: ${doi}`;

    const handleQuickCopyCitation = () => {
        navigator.clipboard.writeText(citationText);
        toast.success("Citation copied to clipboard (APA format)!");
    };

    return (
        <div className="bg-[#f8fafc] min-h-screen pb-10 pt-14 md:pt-22">
            {/* Header / Breadcrumbs */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/journals" className="text-blue-600 font-bold text-sm flex items-center gap-2 hover:underline">
                        <Book size={16} /> Journal Archive
                    </Link>
                    <div className="flex items-center gap-4 text-slate-400">
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                toast.success("Article link copied to clipboard!");
                            }} 
                            className="hover:text-blue-600 transition-colors p-1" 
                            title="Copy Article Link"
                        >
                            <Share2 size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <header className="bg-white border-b border-slate-100 py-12 shadow-sm">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                            Volume {paper.volume_number || 1}, Issue {paper.issue_number || 1}
                        </span>
                        <span className="flex items-center gap-1 text-slate-400 text-xs font-bold uppercase">
                            <Calendar size={14} /> {pubYear}
                        </span>
                    </div>

                    <h1 className="text-3xl lg:text-5xl font-black text-slate-900 leading-tight mb-6">
                        <LatexRenderer content={paper.title} />
                    </h1>

                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-100">
                            {paper.author_name?.charAt(0)}
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Lead Author</p>
                            <div className="flex items-center gap-2">
                                <p className="text-lg font-bold text-slate-800">{paper.author_name}</p>
                                {/* Optional: ORCID Badge */}
                                {paper.orcid_id && (
                                    <a 
                                        href={`https://orcid.org/${paper.orcid_id}`} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:underline bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200"
                                    >
                                        <img src="https://orcid.org/sites/default/files/images/orcid_16x16.png" alt="ORCID" className="w-3 h-3" />
                                        <span className="font-mono text-[10px] font-bold">{paper.orcid_id}</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto py-12 px-6 grid lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Abstract Section */}
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 border-b pb-2">Abstract</h2>
                        <div className="text-slate-700 leading-relaxed text-lg font-serif italic">
                            <LatexRenderer content={paper.abstract} />
                        </div>

                        <div className="mt-8 flex flex-wrap gap-2">
                            {paper.keywords?.split(',').map(kw => (
                                <span key={kw} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-medium lowercase">
                                    #{kw.trim()}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* Suggested Citation Section */}
                    <section className="bg-slate-100 text-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                            <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Quote size={16} /> Suggested Citation
                            </h3>
                            {/* Opens the Reference Exporter (.bib / .ris) */}
                            <button
                                onClick={() => setShowCitationModal(true)}
                                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-100 flex items-center gap-1.5 active:scale-95"
                            >
                                <Download size={13} />
                                <span>Export Citation (.bib / .ris)</span>
                            </button>
                        </div>
                        <div className="text-sm font-mono leading-relaxed bg-white p-5 rounded-2xl border border-slate-200">
                            {paper.author_name} ({pubYear}).{' '}
                            <LatexRenderer content={paper.title} />.{' '}
                            <em>Hissab (JEMPA)</em>, Vol. {paper.volume_number || 1}({paper.issue_number || 1}).{' '}
                            DOI: {doi}
                        </div>
                    </section>
                </div>

                {/* Sidebar Actions */}
                <aside className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-24">
                        {/* Impact Metrics */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-2xl font-black text-blue-600">{paper.view_count || 0}</p>
                                <div className="flex items-center justify-center gap-1 text-[9px] font-black text-slate-400 uppercase mt-1">
                                    <Eye size={10} /> Views
                                </div>
                            </div>
                            <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-2xl font-black text-emerald-600">{paper.download_count || 0}</p>
                                <div className="flex items-center justify-center gap-1 text-[9px] font-black text-slate-400 uppercase mt-1">
                                    <Download size={10} /> Downloads
                                </div>
                            </div>
                        </div>

                        {/* Download PDF Button */}
                        <button
                            onClick={handleDownload}
                            className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95 uppercase tracking-widest text-xs"
                        >
                            <FileText size={18} />
                            Download Full PDF
                        </button>

                        {/* 1-Click Sidebar Copy Button */}
                        <button
                            onClick={handleQuickCopyCitation}
                            className="w-full mt-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider active:scale-95 border border-slate-200/60"
                        >
                            <Copy size={15} className="text-slate-500" />
                            <span>Copy Citation</span>
                        </button>

                        {/* Indexing Metadata */}
                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Indexing Information</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">Article Type:</span>
                                    <span className="font-bold text-slate-700">{paper.article_type}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">Subject:</span>
                                    <span className="font-bold text-slate-700">{paper.specialization}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">DOI:</span>
                                    <a 
                                        href={`https://doi.org/${doi}`} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="font-bold text-blue-600 hover:underline"
                                    >
                                        {doi}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </main>

            {/* Citation Export Modal */}
            {showCitationModal && (
                <CitationModal
                    paper={paper}
                    doi={doi}
                    onClose={() => setShowCitationModal(false)}
                />
            )}
        </div>
    );
};

export default ArticleDetailPage;