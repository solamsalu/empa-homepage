// src/components/pages/journal/common/RubricScoreDisplay.js
import React from 'react';
import { Award, CheckCircle } from 'lucide-react';

const RubricScoreDisplay = ({ rawScores }) => {
    if (!rawScores) return null;

    let scores = null;
    try {
        scores = typeof rawScores === 'string' ? JSON.parse(rawScores) : rawScores;
    } catch (e) {
        return null;
    }

    if (!scores || typeof scores !== 'object' || Object.keys(scores).length === 0) {
        return null;
    }

    // Standard criteria labels
    const criteriaLabels = {
        originality: 'Originality & Novelty',
        rigor: 'Mathematical Rigor & Proofs',
        methodology: 'Methodology & Soundness',
        clarity: 'Clarity of Presentation',
        significance: 'Significance & Relevance',
        literature: 'Literature & Citations'
    };

    return (
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-indigo-700 tracking-wider">
                <Award size={13} />
                <span>Evaluation Rubric & Scores</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(scores).map(([key, val]) => {
                    const label = criteriaLabels[key] || key.replace(/_/g, ' ');
                    const numericVal = Number(val) || 0;

                    return (
                        <div key={key} className="bg-white p-2 rounded-lg border border-slate-100 flex items-center justify-between shadow-2xs">
                            <span className="text-slate-600 font-medium capitalize truncate pr-2">
                                {label}
                            </span>
                            <div className="flex items-center gap-1.5 shrink-0">
                                <span className={`font-black text-xs px-2 py-0.5 rounded ${
                                    numericVal >= 4 ? 'bg-emerald-100 text-emerald-800' :
                                    numericVal === 3 ? 'bg-amber-100 text-amber-800' :
                                    'bg-rose-100 text-rose-800'
                                }`}>
                                    {numericVal}/5
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RubricScoreDisplay;