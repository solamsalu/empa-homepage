
// src/components/pages/journal/Editor/ProductionWorkflow.js
import React, { useState } from 'react';
import axios from 'axios';
import { MANUSCRIPT_STATUS } from '../../../../utils/workflowConstants';
import { API_BASE_URL } from '../../../../utils/constants';
import LatexRenderer from '../../../common/LatexRenderer';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';

const stages = [
    { id: MANUSCRIPT_STATUS.ACCEPTED, label: 'Queue' },
    { id: MANUSCRIPT_STATUS.PROD_LANGUAGE_EDITING, label: 'Language Editing' },
    { id: MANUSCRIPT_STATUS.PROD_COPY_LAYOUT, label: 'Copy & Layout' },
    { id: MANUSCRIPT_STATUS.PROD_PROOFREADING, label: 'Proof Reading' },
    { id: MANUSCRIPT_STATUS.PROD_READY_TO_PUBLISH, label: 'Ready' }
];

const ProductionWorkflow = ({ papers, onUpdate, authToken }) => {
    const [uploadingId, setUploadingId] = useState(null);

    const advanceStage = async (paperId, nextStage) => {
        try {
            await axios.put(`${API_BASE_URL}/journal-papers/${paperId}/production-status`, 
                { status: nextStage }, 
                { headers: { 'Authorization': `Bearer ${authToken}` } }
            );
            onUpdate();
        } catch (e) { alert("Failed to update status"); }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-700 border-b pb-2">Production Pipeline</h3>
            <div className="grid gap-4">
                {papers.map(p => {
                    const currentStageIdx = stages.findIndex(s => s.id === p.status);
                    const nextStage = stages[currentStageIdx + 1];

                    return (
                        <div key={p.id} className="bg-gray-50 border p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-gray-800"><LatexRenderer content={p.title}/></h4>
                                <span className="text-xs bg-gray-200 px-2 py-1 rounded">Vol {p.volume || 'TBD'}</span>
                            </div>
                            
                            {/* Linear Tracker */}
                            <div className="flex items-center justify-between text-sm mb-4">
                                {stages.map((stage, idx) => (
                                    <div key={stage.id} className="flex flex-col items-center">
                                        {idx <= currentStageIdx ? 
                                            <CheckCircle2 className="text-green-600 mb-1" size={20}/> : 
                                            <Circle className="text-gray-300 mb-1" size={20}/>
                                        }
                                        <span className={`text-xs ${idx === currentStageIdx ? 'font-bold text-blue-800' : 'text-gray-500'}`}>
                                            {stage.label}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Action Area */}
                            {nextStage && (
                                <div className="flex justify-end bg-white p-2 rounded border">
                                    <button 
                                        onClick={() => advanceStage(p.id, nextStage.id)}
                                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                                    >
                                        Complete {stages[currentStageIdx].label} <ArrowRight size={16}/>
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProductionWorkflow;
