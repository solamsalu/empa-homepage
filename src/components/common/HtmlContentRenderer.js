import React, { useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import katex from 'katex';

const HtmlContentRenderer = ({ htmlContent, className = "" }) => {
    const containerRef = useRef(null);
    const cleanHtml = DOMPurify.sanitize(htmlContent);

    useEffect(() => {
        if (containerRef.current) {
            // Find all Quill formulas and render them with KaTeX
            const formulas = containerRef.current.querySelectorAll('.ql-formula');
            formulas.forEach((el) => {
                const latex = el.getAttribute('data-value');
                try {
                    katex.render(latex, el, { throwOnError: false });
                } catch (e) {
                    console.error("KaTeX error", e);
                }
            });
        }
    }, [htmlContent]); // Re-run if the content changes

    return (
        <div 
            ref={containerRef}
            className={`prose prose-slate max-w-none ${className}`}
            dangerouslySetInnerHTML={{ __html: cleanHtml }} 
        />
    );
};

export default HtmlContentRenderer;
