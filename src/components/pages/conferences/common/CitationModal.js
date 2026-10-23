import React, { useState } from 'react';
import { Copy, Check, Quote, X, Download } from 'lucide-react';
import { toast } from 'react-toastify';

const CitationModal = ({ paper, conferenceTitle = "EMPA Annual Conference", onClose }) => {
  const [copiedFormat, setCopiedFormat] = useState(null);
  const [activeTab, setActiveTab] = useState('bibtex');

  if (!paper) return null;

  const currentYear = new Date(paper.scheduled_session_time || Date.now()).getFullYear();
  const cleanTitle = paper.title.replace(/\$[^$]*\$/g, '').replace(/\\/g, '');
  const firstAuthorLastName = (paper.authors_list || 'Author').split(' ')[0].replace(/[^a-zA-Z]/g, '').toLowerCase();
  const citationKey = `${firstAuthorLastName}${currentYear}${cleanTitle.split(' ')[0].toLowerCase()}`;

  // Formats
  const bibtexCitation = `@inproceedings{${citationKey},
  title     = {${cleanTitle}},
  author    = {${paper.authors_list}},
  booktitle = {Proceedings of the ${conferenceTitle}},
  year      = {${currentYear}},
  pages     = {1--8},
  publisher = {Ethiopian Mathematical Professionals Association (EMPA)}
}`;

  const apaCitation = `${paper.authors_list} (${currentYear}). ${cleanTitle}. In Proceedings of the ${conferenceTitle}. EMPA Publishing.`;
  const mlaCitation = `${paper.authors_list}. "${cleanTitle}." Proceedings of the ${conferenceTitle}, EMPA, ${currentYear}.`;

  const handleCopy = (text, format) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    toast.success(`${format.toUpperCase()} citation copied to clipboard!`);
    setTimeout(() => setCopiedFormat(null), 2500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-4">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Quote size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Cite this Conference Paper</h3>
              <p className="text-[11px] text-slate-400">Export academic bibliographic entry</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold p-1">
            <X size={18} />
          </button>
        </div>

        {/* Paper Title Display */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <span className="text-[10px] font-black uppercase text-slate-400 block mb-0.5">Paper Reference</span>
          <p className="text-xs font-bold text-slate-800 leading-snug">{cleanTitle}</p>
          <p className="text-[11px] text-slate-500 mt-1">Authors: {paper.authors_list}</p>
        </div>

        {/* Format Selector Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {['bibtex', 'apa', 'mla'].map((fmt) => (
            <button
              key={fmt}
              onClick={() => setActiveTab(fmt)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                activeTab === fmt ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>

        {/* Citation Box */}
        <div className="relative">
          <pre className="p-4 bg-slate-900 text-slate-100 rounded-2xl text-[11px] font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-48 border border-slate-800">
            {activeTab === 'bibtex' && bibtexCitation}
            {activeTab === 'apa' && apaCitation}
            {activeTab === 'mla' && mlaCitation}
          </pre>

          <button
            onClick={() => handleCopy(
              activeTab === 'bibtex' ? bibtexCitation : activeTab === 'apa' ? apaCitation : mlaCitation,
              activeTab
            )}
            className="absolute top-3 right-3 p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 border border-white/20"
            title="Copy to clipboard"
          >
            {copiedFormat === activeTab ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copiedFormat === activeTab ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Footer info */}
        <div className="flex justify-between items-center pt-2 text-[11px] text-slate-400">
          <span>Compatible with Overleaf, Mendeley, and Zotero</span>
          <button onClick={onClose} className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition">
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default CitationModal;