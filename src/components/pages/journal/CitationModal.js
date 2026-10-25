// src/components/pages/journal/CitationModal.js
import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, BookOpen, Layers } from 'lucide-react';
import { toast } from 'react-toastify';

const CitationModal = ({ paper, doi, onClose }) => {
    const [copiedFormat, setCopiedFormat] = useState(null);
    const pubYear = paper.publication_date ? new Date(paper.publication_date).getFullYear() : new Date().getFullYear();
    const cleanTitle = (paper.title || '').replace(/<[^>]+>/g, '').trim();

    // 1. BibTeX Format (LaTeX)
    const bibtex = `@article{jempa_${paper.id}_${pubYear},
  title = {${cleanTitle}},
  author = {${paper.author_name}},
  journal = {Hissab: Journal of the Ethiopian Mathematics Professionals Association (JEMPA)},
  volume = {${paper.volume_number || 1}},
  number = {${paper.issue_number || 1}},
  year = {${pubYear}},
  doi = {${doi}},
  url = {https://doi.org/${doi}}
}`;

    // 2. RIS Format (Universal for Zotero, Mendeley, EndNote)
    const ris = `TY  - JOUR
TI  - ${cleanTitle}
AU  - ${paper.author_name}
T2  - Hissab: Journal of the Ethiopian Mathematics Professionals Association (JEMPA)
VL  - ${paper.volume_number || 1}
IS  - ${paper.issue_number || 1}
PY  - ${pubYear}
DO  - ${doi}
UR  - https://doi.org/${doi}
ER  - `;

    // 3. APA 7th Edition
    const apa = `${paper.author_name} (${pubYear}). ${cleanTitle}. Hissab (JEMPA), ${paper.volume_number || 1}(${paper.issue_number || 1}). https://doi.org/${doi}`;

    // Helper: Copy to Clipboard
    const handleCopy = (text, format) => {
        navigator.clipboard.writeText(text);
        setCopiedFormat(format);
        toast.success(`Copied ${format} to clipboard!`);
        setTimeout(() => setCopiedFormat(null), 2000);
    };

    // Helper: Trigger Real File Download (.bib or .ris)
    const handleDownloadFile = (content, filename, mimeType) => {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(`Downloaded ${filename}!`);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 space-y-5 animate-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b pb-3">
                    <div className="flex items-center gap-2 text-indigo-900 font-black text-sm uppercase tracking-wide">
                        <BookOpen size={18} /> Export Research Citation
                    </div>
                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* 1. BibTeX (For Mathematicians using LaTeX) */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <FileCode size={13} className="text-indigo-600" /> BibTeX Format (LaTeX)
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleCopy(bibtex, 'BibTeX')}
                                className="px-2.5 py-1 text-xs text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 rounded-lg font-bold flex items-center gap-1 transition-all"
                            >
                                {copiedFormat === 'BibTeX' ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />} Copy
                            </button>
                            <button
                                onClick={() => handleDownloadFile(bibtex, `hissab_${paper.id}.bib`, 'text/plain')}
                                className="px-2.5 py-1 text-xs text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold flex items-center gap-1 shadow-sm transition-all"
                            >
                                <Download size={13} /> Download .bib
                            </button>
                        </div>
                    </div>
                    <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono overflow-x-auto select-all">
                        {bibtex}
                    </pre>
                </div>

                {/* 2. RIS Format (For Zotero, Mendeley, EndNote) */}
                <div className="space-y-2 border-t pt-4">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <Layers size={13} className="text-blue-600" /> RIS Format (EndNote, Zotero, Mendeley)
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleCopy(ris, 'RIS')}
                                className="px-2.5 py-1 text-xs text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 rounded-lg font-bold flex items-center gap-1 transition-all"
                            >
                                {copiedFormat === 'RIS' ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />} Copy
                            </button>
                            <button
                                onClick={() => handleDownloadFile(ris, `hissab_${paper.id}.ris`, 'application/x-research-info-systems')}
                                className="px-2.5 py-1 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-bold flex items-center gap-1 shadow-sm transition-all"
                            >
                                <Download size={13} /> Download .ris
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3. APA 7th Edition */}
                <div className="space-y-2 border-t pt-4">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                            APA 7th Edition
                        </span>
                        <button
                            onClick={() => handleCopy(apa, 'APA')}
                            className="px-2.5 py-1 text-xs text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 rounded-lg font-bold flex items-center gap-1 transition-all"
                        >
                            {copiedFormat === 'APA' ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />} Copy
                        </button>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif text-slate-800 leading-relaxed select-all">
                        {apa}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CitationModal;