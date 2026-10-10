// // export default JournalCover;
// import React, { useRef, useState, useEffect } from 'react';
// import { STATIC_ASSETS_BASE_URL } from '../../utils/constants';
// import axios from 'axios';
// import { ImagePlus, Loader2, Globe, X, ZoomIn, Space } from 'lucide-react';
// import { JOURNAL_DISCIPLINES } from '../../utils/disciplines';

// const JournalCover = ({ edition, onUpdate, className = '', isAdmin = false }) => {
//     const fileInputRef = useRef(null);
//     const [isUploading, setIsUploading] = useState(false);
//     const [isZoomed, setIsZoomed] = useState(false);

//     // Close on Escape key
//     useEffect(() => {
//         const handleEsc = (e) => { if (e.key === 'Escape') setIsZoomed(false); };
//         window.addEventListener('keydown', handleEsc);
//         return () => window.removeEventListener('keydown', handleEsc);
//     }, []);

//     if (!edition) return <div className="w-48 aspect-[1/1.41] bg-slate-100 animate-pulse rounded-sm shadow-inner" />;

//     const { id, title, cover_image_url, volume_number, issue_number, year } = edition;

//     const hasImage = cover_image_url && 
//                      cover_image_url !== 'NULL' && 
//                      cover_image_url !== 'default.jpg' && 
//                      cover_image_url.trim() !== '';

//     const fullImageUrl = hasImage 
//         ? `${STATIC_ASSETS_BASE_URL}${cover_image_url.startsWith('/') ? '' : '/'}${cover_image_url}`
//         : null;

//     const handleFileChange = async (e) => {
//         const file = e.target.files[0];
//         if (!file) return;
//         setIsUploading(true);
//         const formData = new FormData();
//         formData.append('coverImage', file);

//         try {
//             const token = localStorage.getItem('token');
//             const res = await axios.patch(`${STATIC_ASSETS_BASE_URL}/api/v1/journals/${id}/cover`, formData, {
//                 headers: { 
//                     'Content-Type': 'multipart/form-data',
//                     'Authorization': `Bearer ${token}`
//                 }
//             });
//             if (res.data.status === 'success') { if (onUpdate) onUpdate(); }
//         } catch (err) {
//             console.error("Upload error", err);
//         } finally {
//             setIsUploading(false);
//         }
//     };

//     const mathPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='5' y='15' fill='%23000' font-family='serif' font-size='10' opacity='0.08'%3E∑%3C/text%3E%3Ctext x='35' y='25' fill='%23000' font-family='serif' font-size='8' opacity='0.08'%3Eπ%3C/text%3E%3Ctext x='15' y='45' fill='%23000' font-family='serif' font-size='12' opacity='0.08'%3E∫%3C/text%3E%3Ctext x='45' y='50' fill='%23000' font-family='serif' font-size='8' opacity='0.08'%3E∞%3C/text%3E%3Ctext x='5' y='55' fill='%23000' font-family='serif' font-size='6' opacity='0.08'%3E∆%3C/text%3E%3Ctext x='30' y='10' fill='%23000' font-family='serif' font-size='6' opacity='0.08'%3E√x%3C/text%3E%3C/svg%3E")`;

//     // Internal Component to render the content with dynamic sizing
//     const CoverContent = ({ isFull = false }) => (
//         <div 
//             className={`w-full h-full flex flex-col bg-white text-slate-900 relative shadow-inner ${isFull ? 'p-10 md:p-16' : 'p-4'}`}
//             style={{ backgroundImage: mathPattern }}
//         >
//             {/* Header */}
//             <div className={`flex justify-between items-start border-b border-slate-100 relative z-10 ${isFull ? 'pb-6 mb-8' : 'pb-2 mb-3'}`}>
//                 <div className="flex items-center gap-3 overflow-hidden">
//                     <div className={`${isFull ? 'w-16 h-16' : 'w-7 h-7'} flex-shrink-0 bg-white border border-slate-100 p-1 rounded shadow-sm`}>
//                         <img src="/empa_logo.jpg" alt="EMPA" className="w-full h-full object-contain" />
//                     </div>
//                     <div className="text-left leading-tight min-w-0">
//                         <p className={`${isFull ? 'text-xs' : 'text-[4px]'} font-bold text-slate-700 truncate`}>የኢትዮጵያ ማቲማቲክስ ባለሙያዎች ማህበር</p>
//                         <p className={`${isFull ? 'text-xl' : 'text-[4.5px]'} font-[900] uppercase text-slate-900 leading-none`}>Ethiopian Mathematics Professionals Association</p>
//                     </div>
//                 </div>
//                 <div className={`${isFull ? 'text-sm' : 'text-[3.5px]'} text-right text-slate-400 font-mono flex-shrink-0 ml-1`}>
//                     {/* <p>ISSN: 3135-2812</p> */}
//                     {isFull && <p>ISSN: 3135-2812</p>}
//                 </div>
//             </div>

//             {/* Peer Review Badge */}
//             <div className={`flex relative z-10 ${isFull ? 'mb-6' : 'mb-2'}`}>
//                 <span className={`${isFull ? 'text-[10px] px-4 py-1.5' : 'text-[3.2px] px-1.5 py-0.5'} font-black uppercase tracking-[0.15em] bg-slate-900 text-white rounded-[1px]`}>
//                     Peer-Reviewed International Journal
//                 </span>
//             </div>

//             {/* Title Block */}
//             <div className={`text-left border-l-4 border-slate-900 pl-4 relative z-10 ${isFull ? 'mb-10 py-2' : 'mb-1 py-1' }`}>
//                 <h2 className={`${isFull ? 'text-3xl mb-4' : 'text-[14px] mb-1'} font-medium text-blue-700 tracking-[0.4em] font-serif leading-none`}>JEMPA</h2>
//                 <h1 className={`${isFull ? 'text-5xl' : 'text-[13px]'} font-[950] leading-[0.85] tracking-tighter uppercase text-slate-950`}>
//                     Journal of<br/>Ethiopian<br/>Mathematics<br/>Professionals<br/>Association
//                 </h1>
//             </div>

//             {/* Research Context
//             <div className={`text-left relative z-10 ${isFull ? 'mb-10' : 'mb-2'}`}>
//                 <p className={`${isFull ? 'text-xs mb-2' : 'text-[3.2px]'} font-black uppercase text-slate-400 tracking-wider`}>Research Areas</p>
//                 <p className={`${isFull ? 'text-lg leading-relaxed' : 'text-[4.2px] leading-tight'} text-slate-600 italic font-medium`}>Applied Mathematics, Education, & Computational Sciences.</p>
//             </div> */}
//             {/* Research Context */}
//             <div className={`text-left relative z-10 ${isFull ? 'mb-10' : 'mb-2'}`}>
//                 <p className={`${isFull ? 'text-xs mb-2' : 'text-[3.2px]'} font-black uppercase text-slate-400 tracking-wider`}>
//                     Scope & Research Areas
//                 </p>
//                 <p className={`${isFull ? 'text-sm leading-relaxed' : 'text-[3.5px] leading-tight'} text-slate-600 italic font-medium`}>
//                     {/* This maps through your array and joins the main names with a comma */}
//                     {JOURNAL_DISCIPLINES.map(d => d.name).join(', ')}.
//                 </p>
//             </div>

//             {/* Info Grid */}
//             <div className={`grid grid-cols-2 gap-6 mt-auto relative z-10 ${isFull ? 'mb-10' : 'mb-2'}`}>
//                 <div className={`${isFull ? 'border-l-4' : 'border-l-2'} border-green-600 pl-4`}>
//                     <p className={`${isFull ? 'text-xs mb-1' : 'text-[3.5px] mb-0.5'} font-black uppercase text-green-700 tracking-wider`}>Mission</p>
//                     <p className={`${isFull ? 'text-sm' : 'text-[4px]'} text-slate-600 leading-tight italic`}>Promoting excellence in global mathematical research.</p>
//                 </div>
//                 <div className={`${isFull ? 'border-l-4' : 'border-l-2'} border-blue-600 pl-4`}>
//                     <p className={`${isFull ? 'text-xs mb-1' : 'text-[3.5px] mb-0.5'} font-black uppercase text-blue-800 tracking-wider`}>Website</p>
//                     <div className="flex items-center gap-1.5 text-blue-700">
//                         <Globe size={isFull ? 16 : 3} />
//                         <p className={`${isFull ? 'text-sm' : 'text-[4.2px]'} font-black underline decoration-blue-200 uppercase tracking-widest`}>www.eth-math.org</p>
//                     </div>
//                 </div>
//             </div>

//             {/* Footer */}
//             <div className={`flex justify-between items-end border-t border-slate-100 relative z-10 ${isFull ? 'pt-8 pb-4' : 'pt-2 pb-1'}`}>
//                 <div className={`flex ${isFull ? 'gap-10' : 'gap-2.5'}`}>
//                     <div><p className={`${isFull ? 'text-xs' : 'text-[3.5px]'} text-slate-400 font-bold uppercase mb-1`}>Volume</p><p className={`${isFull ? 'text-3xl' : 'text-[10px]'} font-black text-slate-950`}>{volume_number}</p></div>
//                     <div><p className={`${isFull ? 'text-xs' : 'text-[3.5px]'} text-slate-400 font-bold uppercase mb-1`}>Issue</p><p className={`${isFull ? 'text-3xl' : 'text-[10px]'} font-black text-slate-950`}>{issue_number || '01'}</p></div>
//                     <div><p className={`${isFull ? 'text-xs' : 'text-[3.5px]'} text-slate-400 font-bold uppercase mb-1`}>Year</p><p className={`${isFull ? 'text-3xl' : 'text-[10px]'} font-black text-slate-950`}>{year}</p></div>
//                 </div>
//                 <div className={`${isFull ? 'px-6 py-4 rounded-md' : 'px-1.5 py-1 rounded-[1px]'} bg-slate-50 border border-slate-200 text-right`}>
//                     <p className={`${isFull ? 'text-[10px] mb-1' : 'text-[2.5px] mb-0.5'} text-slate-400 uppercase font-black tracking-tighter`}>Digital Object Identifier</p>
//                     <p className={`${isFull ? 'text-lg' : 'text-[4px]'} text-slate-800 font-mono italic`}>doi.org/10.66894/jempa</p>
//                 </div>
//             </div>
//         </div>
//     );

//     return (
//         <div className={`flex flex-col items-center gap-4 ${className}`}>
//             {/* THUMBNAIL VIEW */}
//             <div 
//                 onClick={() => setIsZoomed(true)}
//                 className="relative w-48 aspect-[1/1.41] group cursor-zoom-in active:scale-95 transition-transform" 
//                 style={{ perspective: '1200px' }}
//             >
//                 <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors z-20 flex items-center justify-center">
//                     <ZoomIn className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
//                 </div>
//                 <div className="relative w-full h-full transition-transform duration-500 transform-style-3d group-hover:rotate-y-[-10deg] shadow-lg">
//                     <div className="absolute w-[18px] h-full bg-[#0f172a] left-0 origin-left -rotate-y-90 border-r border-white/10" />
//                     <div className="absolute inset-0 w-full h-full bg-white flex flex-col overflow-hidden border-l border-black/5 rounded-r-[1px]">
//                         {hasImage ? <img src={fullImageUrl} className="w-full h-full object-cover" alt="" /> : <CoverContent />}
//                     </div>
//                 </div>
//             </div>

//             {/* FULL-PAGE MODAL */}
//             {isZoomed && (
//                 <div 
//                     className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-4 md:p-8"
//                     onClick={() => setIsZoomed(false)}
//                 >
//                     <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
//                         <X size={32} />
//                     </button>
                    
//                     {/* The Full Page Container */}
//                     <div 
//                         className="relative w-full max-w-[800px] h-full max-h-[90vh] bg-white shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden rounded-sm"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         {hasImage ? (
//                             <img src={fullImageUrl} className="w-full h-full object-contain bg-slate-100" alt={title} />
//                         ) : (
//                             <div className="w-full h-full overflow-y-auto">
//                                 <CoverContent isFull={true} />
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}

//             {/* ADMIN */}
//             {isAdmin && (
//                 <div className="flex flex-col items-center">
//                     <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
//                     <button 
//                         onClick={() => fileInputRef.current.click()}
//                         disabled={isUploading}
//                         className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded text-xs font-bold hover:bg-slate-50 transition-all shadow-sm"
//                     >
//                         {isUploading ? <Loader2 className="animate-spin" size={12} /> : <ImagePlus size={14} />}
//                         Update Cover
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default JournalCover;

import React, { useRef, useState, useEffect } from 'react';
import { STATIC_ASSETS_BASE_URL } from '../../utils/constants';
import axios from 'axios';
import { ImagePlus, Loader2, Globe, X, ZoomIn } from 'lucide-react';
import { JOURNAL_DISCIPLINES } from '../../utils/disciplines';

const JournalCover = ({ edition, onUpdate, className = '', isAdmin = false }) => {
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e) => { if (e.key === 'Escape') setIsZoomed(false); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    if (!edition) return <div className="w-48 aspect-[1/1.41] bg-slate-100 animate-pulse rounded-sm shadow-inner" />;

    const { id, title, cover_image_url, volume_number, issue_number, year } = edition;

    // 2-digit zero-padded volume & issue for display and DOI
    const volPadded = String(volume_number || '1').padStart(2, '0');
    const issuePadded = String(issue_number || '1').padStart(2, '0');
    const issueDoi = `10.66894/hissab.${volPadded}${issuePadded}`;

    const hasImage = cover_image_url && 
                     cover_image_url !== 'NULL' && 
                     cover_image_url !== 'default.jpg' && 
                     !cover_image_url.endsWith('default.jpg') &&
                     cover_image_url.trim() !== '';

    const fullImageUrl = hasImage 
        ? `${STATIC_ASSETS_BASE_URL}${cover_image_url.startsWith('/') ? '' : '/'}${cover_image_url}`
        : null;

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsUploading(true);
        const formData = new FormData();
        formData.append('coverImage', file);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.patch(`${STATIC_ASSETS_BASE_URL}/api/v1/journals/${id}/cover`, formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.data.status === 'success') { if (onUpdate) onUpdate(); }
        } catch (err) {
            console.error("Upload error", err);
        } finally {
            setIsUploading(false);
        }
    };

    const mathPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='5' y='15' fill='%23000' font-family='serif' font-size='10' opacity='0.08'%3E∑%3C/text%3E%3Ctext x='35' y='25' fill='%23000' font-family='serif' font-size='8' opacity='0.08'%3Eπ%3C/text%3E%3Ctext x='15' y='45' fill='%23000' font-family='serif' font-size='12' opacity='0.08'%3E∫%3C/text%3E%3Ctext x='45' y='50' fill='%23000' font-family='serif' font-size='8' opacity='0.08'%3E∞%3C/text%3E%3Ctext x='5' y='55' fill='%23000' font-family='serif' font-size='6' opacity='0.08'%3E∆%3C/text%3E%3Ctext x='30' y='10' fill='%23000' font-family='serif' font-size='6' opacity='0.08'%3E√x%3C/text%3E%3C/svg%3E")`;

    // Internal Component to render the content with dynamic sizing
    const CoverContent = ({ isFull = false }) => (
        <div 
            className={`w-full h-full flex flex-col bg-white text-slate-900 relative shadow-inner ${isFull ? 'p-10 md:p-16' : 'p-4'}`}
            style={{ backgroundImage: mathPattern }}
        >
            {/* Header */}
            <div className={`flex justify-between items-start border-b border-slate-100 relative z-10 ${isFull ? 'pb-6 mb-8' : 'pb-2 mb-3'}`}>
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`${isFull ? 'w-16 h-16' : 'w-7 h-7'} flex-shrink-0 bg-white border border-slate-100 p-1 rounded shadow-sm`}>
                        <img src="/empa_logo.jpg" alt="EMPA" className="w-full h-full object-contain" />
                    </div>
                    <div className="text-left leading-tight min-w-0">
                        <p className={`${isFull ? 'text-xs' : 'text-[4px]'} font-bold text-slate-700 truncate`}>የኢትዮጵያ ማቲማቲክስ ባለሙያዎች ማህበር</p>
                        <p className={`${isFull ? 'text-xl' : 'text-[4.5px]'} font-[900] uppercase text-slate-900 leading-none`}>Ethiopian Mathematics Professionals Association</p>
                    </div>
                </div>
                <div className={`${isFull ? 'text-sm' : 'text-[3.5px]'} text-right text-slate-400 font-mono flex-shrink-0 ml-1`}>
                    {isFull && <p>ISSN: 3135-2812</p>}
                </div>
            </div>

            {/* Peer Review Badge */}
            <div className={`flex relative z-10 ${isFull ? 'mb-6' : 'mb-2'}`}>
                <span className={`${isFull ? 'text-[10px] px-4 py-1.5' : 'text-[3.2px] px-1.5 py-0.5'} font-black uppercase tracking-[0.15em] bg-slate-900 text-white rounded-[1px]`}>
                    Peer-Reviewed International Journal
                </span>
            </div>

            {/* Title Block: HISSAB (JEMPA) */}
            <div className={`text-left border-l-4 border-slate-900 pl-4 relative z-10 ${isFull ? 'mb-10 py-2' : 'mb-1 py-1' }`}>
                <div className="flex items-baseline gap-2">
                    <h2 className={`${isFull ? 'text-4xl mb-2' : 'text-[15px] mb-0.5'} font-black text-blue-700 tracking-[0.25em] font-serif leading-none`}>
                        HISSAB
                    </h2>
                    <span className={`${isFull ? 'text-lg font-bold' : 'text-[6px] font-semibold'} text-slate-400 tracking-[0.2em] font-mono`}>
                        (JEMPA)
                    </span>
                </div>
                <h1 className={`${isFull ? 'text-5xl' : 'text-[13px]'} font-[950] leading-[0.85] tracking-tighter uppercase text-slate-950 mt-1`}>
                    Journal of<br/>Ethiopian<br/>Mathematics<br/>Professionals<br/>Association
                </h1>
            </div>

            {/* Research Context / Disciplines */}
            <div className={`text-left relative z-10 ${isFull ? 'mb-10' : 'mb-2'}`}>
                <p className={`${isFull ? 'text-xs mb-2' : 'text-[3.2px]'} font-black uppercase text-slate-400 tracking-wider`}>
                    Scope & Research Areas
                </p>
                <p className={`${isFull ? 'text-sm leading-relaxed' : 'text-[3.5px] leading-tight'} text-slate-600 italic font-medium line-clamp-3`}>
                    {JOURNAL_DISCIPLINES && JOURNAL_DISCIPLINES.length > 0 
                        ? JOURNAL_DISCIPLINES.map(d => d.name).join(', ') + '.'
                        : 'Applied Mathematics, Pure Mathematics, Statistics, Education & Computational Sciences.'}
                </p>
            </div>

            {/* Info Grid (Mission & Website) */}
            <div className={`grid grid-cols-2 gap-6 mt-auto relative z-10 ${isFull ? 'mb-10' : 'mb-2'}`}>
                <div className={`${isFull ? 'border-l-4' : 'border-l-2'} border-green-600 pl-4`}>
                    <p className={`${isFull ? 'text-xs mb-1' : 'text-[3.5px] mb-0.5'} font-black uppercase text-green-700 tracking-wider`}>Mission</p>
                    <p className={`${isFull ? 'text-sm' : 'text-[4px]'} text-slate-600 leading-tight italic`}>Promoting excellence in global mathematical research.</p>
                </div>
                <div className={`${isFull ? 'border-l-4' : 'border-l-2'} border-blue-600 pl-4`}>
                    <p className={`${isFull ? 'text-xs mb-1' : 'text-[3.5px] mb-0.5'} font-black uppercase text-blue-800 tracking-wider`}>Website</p>
                    <div className="flex items-center gap-1.5 text-blue-700">
                        <Globe size={isFull ? 16 : 3} />
                        <p className={`${isFull ? 'text-sm' : 'text-[4.2px]'} font-black underline decoration-blue-200 uppercase tracking-widest`}>www.eth-math.org</p>
                    </div>
                </div>
            </div>

            {/* Footer: Volume, Issue, Year & Issue-Level DOI */}
            <div className={`flex justify-between items-end border-t border-slate-100 relative z-10 ${isFull ? 'pt-8 pb-4' : 'pt-2 pb-1'}`}>
                <div className={`flex ${isFull ? 'gap-10' : 'gap-2.5'}`}>
                    <div>
                        <p className={`${isFull ? 'text-xs' : 'text-[3.5px]'} text-slate-400 font-bold uppercase mb-1`}>Volume</p>
                        <p className={`${isFull ? 'text-3xl' : 'text-[10px]'} font-black text-slate-950`}>{volPadded}</p>
                    </div>
                    <div>
                        <p className={`${isFull ? 'text-xs' : 'text-[3.5px]'} text-slate-400 font-bold uppercase mb-1`}>Issue</p>
                        <p className={`${isFull ? 'text-3xl' : 'text-[10px]'} font-black text-slate-950`}>{issuePadded}</p>
                    </div>
                    <div>
                        <p className={`${isFull ? 'text-xs' : 'text-[3.5px]'} text-slate-400 font-bold uppercase mb-1`}>Year</p>
                        <p className={`${isFull ? 'text-3xl' : 'text-[10px]'} font-black text-slate-950`}>{year || new Date().getFullYear()}</p>
                    </div>
                </div>

                {/* Updated DOI Box (e.g. doi.org/10.66894/hissab.2901) */}
                <div className={`${isFull ? 'px-6 py-4 rounded-md' : 'px-1.5 py-1 rounded-[1px]'} bg-slate-50 border border-slate-200 text-right`}>
                    <p className={`${isFull ? 'text-[10px] mb-1' : 'text-[2.5px] mb-0.5'} text-slate-400 uppercase font-black tracking-tighter`}>
                        Digital Object Identifier
                    </p>
                    <p className={`${isFull ? 'text-base' : 'text-[4px]'} text-slate-800 font-mono italic`}>
                        doi.org/{issueDoi}
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <div className={`flex flex-col items-center gap-4 ${className}`}>
            {/* THUMBNAIL VIEW */}
            <div 
                onClick={() => setIsZoomed(true)}
                className="relative w-48 aspect-[1/1.41] group cursor-zoom-in active:scale-95 transition-transform" 
                style={{ perspective: '1200px' }}
            >
                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors z-20 flex items-center justify-center">
                    <ZoomIn className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="relative w-full h-full transition-transform duration-500 transform-style-3d group-hover:rotate-y-[-10deg] shadow-lg">
                    <div className="absolute w-[18px] h-full bg-[#0f172a] left-0 origin-left -rotate-y-90 border-r border-white/10" />
                    <div className="absolute inset-0 w-full h-full bg-white flex flex-col overflow-hidden border-l border-black/5 rounded-r-[1px]">
                        {hasImage ? (
                            <img src={fullImageUrl} className="w-full h-full object-cover" alt={title || "Journal Issue Cover"} />
                        ) : (
                            <CoverContent />
                        )}
                    </div>
                </div>
            </div>

            {/* FULL-PAGE MODAL (ZOOM VIEW) */}
            {isZoomed && (
                <div 
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-4 md:p-8"
                    onClick={() => setIsZoomed(false)}
                >
                    <button 
                        onClick={() => setIsZoomed(false)}
                        className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
                    >
                        <X size={32} />
                    </button>
                    
                    {/* The Full Page Container */}
                    <div 
                        className="relative w-full max-w-[800px] h-full max-h-[90vh] bg-white shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden rounded-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {hasImage ? (
                            <img src={fullImageUrl} className="w-full h-full object-contain bg-slate-100" alt={title} />
                        ) : (
                            <div className="w-full h-full overflow-y-auto">
                                <CoverContent isFull={true} />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ADMIN COVER UPLOADER */}
            {isAdmin && (
                <div className="flex flex-col items-center">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    <button 
                        onClick={() => fileInputRef.current.click()}
                        disabled={isUploading}
                        className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded text-xs font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                    >
                        {isUploading ? <Loader2 className="animate-spin" size={12} /> : <ImagePlus size={14} />}
                        Update Cover
                    </button>
                </div>
            )}
        </div>
    );
};

export default JournalCover;