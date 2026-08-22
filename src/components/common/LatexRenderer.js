import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// Add a new prop 'as' which defaults to 'div'
const LatexRenderer = ({ content, as = 'div', className = '' }) => {
    const containerRef = useRef(null);
    const Wrapper = as; // Use the 'as' prop to define the component type

    useEffect(() => {
        // ... (the entire useEffect content remains exactly the same)
        const container = containerRef.current;
        if (!container || !content) {
            if (container) container.innerHTML = '';
            return;
        }

        container.innerHTML = content;

        const quillFormulas = container.querySelectorAll('.ql-formula');
        quillFormulas.forEach(span => {
            const formula = span.getAttribute('data-value');
            if (formula) {
                try {
                    katex.render(formula, span, { throwOnError: false, displayMode: false });
                } catch (e) {
                    console.error('KaTeX rendering error (Quill):', e);
                    span.textContent = formula;
                }
            }
        });

        const renderMathInText = (element) => {
            if (element.nodeType === 3) {
                const text = element.textContent;
                const newElements = [];
                let lastIndex = 0;
                const regex = /(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g;
                let match;
                while ((match = regex.exec(text)) !== null) {
                    if (match.index > lastIndex) {
                        newElements.push(document.createTextNode(text.substring(lastIndex, match.index)));
                    }
                    const latex = match[1];
                    const isDisplay = latex.startsWith('$$');
                    const formula = latex.substring(isDisplay ? 2 : 1, latex.length - (isDisplay ? 2 : 1));
                    const span = document.createElement('span');
                    try {
                        katex.render(formula, span, { throwOnError: false, displayMode: isDisplay });
                        if (isDisplay) {
                            span.querySelector('.katex-display')?.classList.add('py-2', 'overflow-x-auto');
                        }
                    } catch (e) {
                        console.error('KaTeX rendering error (Text):', e);
                        span.textContent = latex;
                    }
                    newElements.push(span);
                    lastIndex = regex.lastIndex;
                }
                if (lastIndex < text.length) {
                    newElements.push(document.createTextNode(text.substring(lastIndex)));
                }
                if (newElements.length > 0) {
                    element.replaceWith(...newElements);
                }
                return;
            }
            if (!element.classList?.contains('katex') && !element.classList?.contains('ql-formula')) {
                 Array.from(element.childNodes).forEach(renderMathInText);
            }
        };
        Array.from(container.childNodes).forEach(renderMathInText);

    }, [content]);

    // The wrapper is now dynamic, and we combine the default and passed classNames
    return (
        <Wrapper
            ref={containerRef}
            className={`prose prose-sm md:prose-base max-w-none text-slate-700 leading-relaxed ${className}`}
        />
    );
};

export default LatexRenderer;