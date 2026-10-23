// src/components/pages/conferences/common/PresentationCertificateModal.js
import React, { useRef } from 'react';
import { Award, Printer, X, ShieldCheck } from 'lucide-react';

const cleanHtml = (text) => {
  if (!text) return '';
  return text.replace(/<[^>]*>?/gm, '').replace(/\$[^$]*\$/g, '').replace(/\\/g, '').trim();
};

const PresentationCertificateModal = ({ paper, conference, onClose }) => {
  const printRef = useRef(null);

  if (!paper) return null;

  // Clean data
  const rawTitle = paper.title || 'Untitled Research Presentation';
  const cleanTitle = cleanHtml(rawTitle);
  const presenterName = cleanHtml(paper.author_name || paper.authors_list || 'Dr. Presenter');
  
  const presentationTypeDisplay = paper.presentation_type === 'poster' 
    ? 'Interactive Poster Presentation' 
    : 'Oral Lecture Presentation (20 Mins)';

  // Fix Conference Title Grammar (e.g., if title is just "2027")
  const rawConfTitle = conference?.title || paper.conference_title || 'Annual National Conference on Mathematical Sciences';
  const confTitle = /^\d+$/.test(rawConfTitle.trim())
    ? `The ${rawConfTitle} Annual National Conference on Mathematical Sciences`
    : rawConfTitle;

  const hostName = conference?.host_institution || paper.host_institution || 'Wolkite University (WkU)';
  const hostLogo = conference?.host_logo_url || paper.host_logo_url || '/images/wku_logo.png';
  const venueLocation = paper.scheduled_room 
    ? `${paper.scheduled_room}, ${conference?.venue || 'Science Campus'}` 
    : (conference?.venue || 'Wolkite, Ethiopia');
    
  const sponsors = conference?.sponsors_text || paper.sponsors_text || 'Ministry of Innovation & Technology (MInT) • African Mathematical Union (AMU) • ICTP';
  const confYear = conference?.start_date ? new Date(conference.start_date).getFullYear() : new Date().getFullYear();
  const certId = `EMPA-CERT-${confYear}-${String(paper.id).padStart(4, '0')}`;

  const issueDate = paper.certificate_approved_at 
    ? new Date(paper.certificate_approved_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[999] flex items-center justify-center p-2 sm:p-4 font-sans overflow-y-auto">
      
      {/* 🌟 PRECISE A4 LANDSCAPE PRINT CSS: ENFORCES EXACTLY 1 PAGE, FULL COLOR 🌟 */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page {
            size: A4 landscape !important;
            margin: 0 !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body * {
            visibility: hidden !important;
          }
          #empa-certificate-print-area, #empa-certificate-print-area * {
            visibility: visible !important;
          }
          #empa-certificate-print-area {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 297mm !important;
            height: 210mm !important;
            max-width: 297mm !important;
            max-height: 210mm !important;
            box-sizing: border-box !important;
            padding: 8mm 12mm !important;
            margin: 0 !important;
            overflow: hidden !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
            break-after: avoid !important;
          }
        }
      `}} />

      <div className="bg-white rounded-3xl max-w-5xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 my-auto">
        
        {/* On-Screen Modal Top Bar */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
              <Award size={18} />
            </div>
            <div>
              <span className="text-xs font-black uppercase text-slate-800 block">
                Official Credential Verification
              </span>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <ShieldCheck size={12} /> Chairperson Verified & Authorized
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95"
            >
              <Printer size={15} /> Print / Save as PDF
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 font-bold">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 🌟 THE OFFICIAL CERTIFICATE CANVAS (297mm x 210mm A4 LANDSCAPE) 🌟 */}
        <div 
          id="empa-certificate-print-area"
          ref={printRef}
          className="relative bg-[#fffefc] border-[10px] border-double border-[#0d233f] p-6 sm:p-10 text-center my-2 shadow-inner overflow-hidden select-none flex flex-col justify-between"
          style={{ minHeight: '530px' }}
        >
          {/* Outer Gold Accent Fillet */}
          <div className="absolute inset-1.5 border-2 border-amber-600/60 pointer-events-none" />

          {/* Centered Mathematical Watermark (Positioned behind content) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none select-none z-0">
            <span className="text-[260px] font-black font-serif text-[#0d233f]">∑</span>
          </div>

          {/* Gold Frame Corner Ornaments */}
          <div className="absolute top-3 left-3 w-8 h-8 border-t-4 border-l-4 border-amber-500 pointer-events-none" />
          <div className="absolute top-3 right-3 w-8 h-8 border-t-4 border-r-4 border-amber-500 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-4 border-l-4 border-amber-500 pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-b-4 border-r-4 border-amber-500 pointer-events-none" />

          {/* 🌟 1. LOGOS & ASSOCIATION HEADER ROW 🌟 */}
          <div className="relative z-10 grid grid-cols-4 items-center border-b-2 border-amber-600/30 pb-4">
            
            {/* Left: EMPA Official Logo */}
            <div className="flex items-center gap-3 text-left">
              <img 
                src="/images/empa_logo.jpg" 
                alt="EMPA Official Logo" 
                className="h-16 w-16 object-contain shrink-0"
                onError={(e) => {
                  // Fallback SVG Crest if image file is not found
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden h-16 w-16 rounded-full border-2 border-[#0d233f] bg-white items-center justify-center shadow-sm shrink-0">
                <span className="font-serif font-black text-lg text-[#0d233f]">EMPA</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-[9px] font-black uppercase tracking-wider text-[#0d233f] block leading-tight">
                  የኢትዮጵያ ማቲማቲክስ ባለሙያዎች ማህበር
                </span>
                <span className="text-[8px] font-bold text-amber-700 uppercase tracking-widest">
                  Founded 1978
                </span>
              </div>
            </div>

            {/* Center: Bilingual Header */}
            <div className="col-span-2 text-center space-y-0.5">
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#0d233f] block">
                የኢትዮጵያ ማቲማቲክስ ባለሙያዎች ማህበር
              </span>
              <h1 className="text-base sm:text-lg font-black uppercase tracking-widest text-[#0d233f]">
                Ethiopian Mathematical Professionals Association
              </h1>
              <span className="text-[10px] font-bold text-amber-700 block uppercase tracking-wider">
                In Academic Collaboration with {hostName}
              </span>
            </div>

            {/* Right: Host University Logo */}
            <div className="flex items-center justify-end gap-3 text-right">
              <div className="hidden sm:block">
                <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 block">
                  Academic Host
                </span>
                <span className="text-[9px] font-bold text-slate-800 line-clamp-1">{hostName}</span>
              </div>
              <img 
                src={hostLogo} 
                alt={`${hostName} Logo`} 
                className="h-16 w-16 object-contain shrink-0"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden h-16 w-16 rounded-full border-2 border-slate-300 bg-slate-50 items-center justify-center shadow-sm shrink-0">
                <span className="font-serif font-black text-xs text-blue-900">HOST</span>
              </div>
            </div>
          </div>

          {/* 🌟 2. CERTIFICATE BODY 🌟 */}
          <div className="relative z-10 py-2 space-y-2">
            
            <div className="space-y-0.5">
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#0d233f] tracking-[0.15em] uppercase">
                Certificate of Presentation
              </h2>
              <p className="text-[11px] italic text-slate-500 font-serif">
                This academic credential formally certifies that
              </p>
            </div>

            {/* Presenter Name */}
            <div className="py-1">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-blue-950 border-b-2 border-slate-300 inline-block px-10 pb-0.5">
                {presenterName}
              </h3>
            </div>

            {/* Presentation Statement */}
            <p className="text-xs text-slate-700 max-w-2xl mx-auto font-serif">
              has successfully delivered an official <strong>{presentationTypeDisplay}</strong> entitled:
            </p>

            {/* Title Box */}
            <div className="bg-slate-50/80 border border-slate-200 py-2.5 px-6 rounded-xl max-w-2xl mx-auto shadow-sm">
              <p className="text-sm font-serif font-bold text-[#0d233f] leading-snug">
                "{cleanTitle}"
              </p>
            </div>

            {/* Conference & Venue */}
            <p className="text-xs text-slate-600 max-w-xl mx-auto font-serif">
              at <strong>{confTitle}</strong>, convened at {venueLocation} on {issueDate}.
            </p>
          </div>

          {/* 🌟 3. REAL SIGNATURES & GOLD STAMP SECTION 🌟 */}
          <div className="relative z-10 pt-2 grid grid-cols-3 items-end max-w-2xl mx-auto">
            
            {/* Left: President Signature */}
            <div className="text-center space-y-1">
              <div className="h-12 flex items-end justify-center">
                <img 
                  src="/images/signatures/president_signature.jpg" 
                  alt="President Signature" 
                  className="max-h-12 max-w-[130px] object-contain"
                  onError={(e) => {
                    // Cursive fallback if image file not yet uploaded
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <span className="hidden font-serif italic text-lg text-blue-950 font-bold" style={{ fontFamily: 'cursive' }}>
                  B. Guta
                </span>
              </div>
              <div className="border-t border-slate-400 pt-1">
                <p className="font-bold text-slate-800 text-[10px]">Prof. Berhanu Guta</p>
                <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">President, EMPA</p>
              </div>
            </div>

            {/* Center: Official Golden Seal Stamp */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-16 h-16 rounded-full border-2 border-amber-600 bg-gradient-to-br from-amber-100 via-amber-50 to-amber-200 flex flex-col items-center justify-center shadow-md">
                <Award size={20} className="text-amber-700" />
                <span className="text-[6px] font-black uppercase tracking-widest text-amber-900 leading-none mt-0.5">
                  OFFICIAL SEAL
                </span>
              </div>
            </div>

            {/* Right: Program Chair Signature */}
            <div className="text-center space-y-1">
              <div className="h-12 flex items-end justify-center">
                <img 
                  src="/images/signatures/chair_signature.jpg" 
                  alt="Chair Signature" 
                  className="max-h-12 max-w-[130px] object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <span className="hidden font-serif italic text-lg text-blue-950 font-bold" style={{ fontFamily: 'cursive' }}>
                  T. Abebe
                </span>
              </div>
              <div className="border-t border-slate-400 pt-1">
                <p className="font-bold text-slate-800 text-[10px]">Dr. Tilahun Abebe</p>
                <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">Scientific Program Chair</p>
              </div>
            </div>

          </div>

          {/* 🌟 4. SPONSORS FOOTER & AUTHENTICITY CODE 🌟 */}
          <div className="relative z-10 pt-3 border-t border-slate-200 flex justify-between items-center text-[9px] text-slate-500">
            <div className="text-left max-w-md">
              <span className="font-black uppercase tracking-wider text-slate-400 block text-[7px]">
                Supported & Sponsored by:
              </span>
              <span className="font-semibold text-slate-700">{sponsors}</span>
            </div>

            <div className="text-right">
              <span className="font-mono font-bold text-slate-800 flex items-center justify-end gap-1">
                <ShieldCheck size={11} className="text-emerald-600" /> ID: {certId}
              </span>
              <span className="text-[8px] text-slate-400">Permanent Record • Issued at Addis Ababa, Ethiopia</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default PresentationCertificateModal;