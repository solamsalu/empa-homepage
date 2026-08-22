
import React, { useMemo, useRef } from 'react';
import ReactQuill from 'react-quill';
import katex from 'katex';

// Import CSS for Quill and KaTeX
import 'react-quill/dist/quill.snow.css';
import 'katex/dist/katex.min.css';

// Crucial: Attach KaTeX to the window so Quill's formula module can find it
if (typeof window !== 'undefined') {
    window.katex = katex;
}

/**
 * A professional LaTeX-enabled rich text editor for the Author Portal.
 */
const LatexEditor = ({ value, onChange, placeholder }) => {
    const quillRef = useRef(null);

    // useMemo ensures the toolbar doesn't reset/flicker when state updates
    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'script': 'sub'}, { 'script': 'super' }],
                ['formula', 'link', 'clean'],
            ],
            handlers: {
                formula: function() {
                    const range = this.quill.getSelection();
                    const value = prompt('Enter LaTeX formula:');
                    if (value) {
                        this.quill.insertEmbed(range.index, 'formula', value, 'user');
                    }
                }
            }
        }
    }), []);

    // Define which formats are allowed
    const formats = [
        'header', 'bold', 'italic', 'underline', 'list', 'bullet', 'script', 'formula', 'link'
    ];

    return (
        <div className="latex-editor-wrapper">
            <style>{`
                /* Fix for the formula input tooltip appearing in weird places */
                .ql-tooltip {
                    z-index: 1000 !important;
                    border-radius: 8px !important;
                    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1) !important;
                }
                .ql-formula {
                    cursor: pointer;
                    background-color: #f1f5f9;
                    padding: 2px 4px;
                    border-radius: 4px;
                }
            `}</style>
            <div className="
                border border-slate-200 rounded-xl overflow-hidden transition-all duration-200
                focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500
                [&_.ql-toolbar]:bg-slate-50/50 [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-slate-200
                [&_.ql-container]:border-none [&_.ql-editor]:text-base [&_.ql-editor]:text-slate-700
            ">
                <ReactQuill 
                    ref={quillRef}
                    theme="snow" 
                    value={value} 
                    onChange={onChange}
                    modules={modules}
                    formats={formats}
                    placeholder={placeholder}
                />
            </div>
            
            {/* Subtle User Instructions */}
            <div className="flex justify-between items-center mt-2 px-1">
                <p className="text-[10px] font-medium text-slate-400">
                    Use <span className="font-bold text-slate-600">f(x)</span> for math symbols (e.g., \alpha, \sum)
                </p>
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">KaTeX Ready</span>
                </div>
            </div>
        </div>
    );
};

export default LatexEditor;