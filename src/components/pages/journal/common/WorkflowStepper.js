import React from 'react';
import { Check, Clock, X, AlertCircle } from 'lucide-react';

const WorkflowStepper = ({ currentStatus, role = 'MANAGING_EDITOR' }) => {
    // 1. Define Role-Specific Steps
    const stepsByRole = {
        // ME sees the full lifecycle from submission to publication
        MANAGING_EDITOR: [
            { label: 'Submitted', statuses: ['SUBMITTED'] },
            { label: 'Initial Check', statuses: ['WITH_MANAGING_EDITOR', 'WITH_ASSOCIATE_EDITOR', 'WITH ASSOCIATE EDITOR', 'INITIAL_CHECK'] },
            { label: 'Peer Review', statuses: ['UNDER_REVIEW', 'REVIEW_COMPLETED'] },
            { label: 'Decision', statuses: ['DECISION_PENDING', 'REVISION_REQUIRED'] },
            { label: 'Production', statuses: ['ACCEPTED', 'PRODUCTION', 'IN_PRODUCTION', 'LANGUAGE EDITION', 'COPY LAYOUT EDITION', 'PROOF READING', 'READY TO PUBLISH']  },
            { label: 'Published', statuses: ['PUBLISHED'] }
        ],
        // AE focus is on their specific handling window
        ASSOCIATE_EDITOR: [
            { label: 'Assigned', statuses: ['WITH_ASSOCIATE_EDITOR', 'WITH ASSOCIATE EDITOR'] },
            { label: 'In Review', statuses: ['UNDER_REVIEW'] },
            { label: 'Rec. Pending', statuses: ['REVIEW_COMPLETED'] },
            { label: 'Rec. Submitted', statuses: ['DECISION_PENDING'] },
            { label: 'Finalized', statuses: ['ACCEPTED', 'REJECTED', 'PUBLISHED', 'REVISION_REQUIRED'] }
        ]
    };

    const steps = stepsByRole[role.toUpperCase()] || stepsByRole.MANAGING_EDITOR;

    const getStepState = (stepIndex) => {
        const s = currentStatus ? String(currentStatus).toUpperCase().trim().replace(/\s+/g, '_') : '';
        
        // Determine Current Step Index
        let currentStepIndex = steps.findIndex(step => 
            step.statuses.some(statusString => {
                const normalizedMatch = statusString.toUpperCase().replace(/\s+/g, '_');
                return s === normalizedMatch;
            })
        );

        // Specific overrides for broad statuses
        if (s.includes('REJECTED')) return 'rejected';
        
        // If status is "PUBLISHED" and we are on an earlier step, mark as completed
        if (s === 'PUBLISHED') currentStepIndex = steps.length - 1;

        if (currentStepIndex === -1) return 'pending';
        if (stepIndex < currentStepIndex) return 'completed';
        if (stepIndex === currentStepIndex) return 'current';
        return 'pending';
    };

    return (
        <div className="w-full py-6 px-2 bg-gray-50/80 rounded-xl mt-2 border border-gray-100">
            <div className="flex items-start justify-between w-full">
                {steps.map((step, i) => {
                    const state = getStepState(i);
                    const isRejected = state === 'rejected';

                    return (
                        <div key={i} className="flex flex-col items-center flex-1 relative min-w-[70px]">
                            {/* Connector Line */}
                            {i < steps.length - 1 && (
                                <div className={`absolute top-4 left-[50%] w-full h-0.5 -z-0 transition-colors duration-500
                                    ${(getStepState(i + 1) !== 'pending' && !isRejected) ? 'bg-green-500' : 'bg-gray-200'}`} />
                            )}
                            
                            {/* Circle Node */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 transition-all duration-300
                                ${state === 'completed' ? 'bg-green-600 border-green-600 text-white' : 
                                  state === 'current' ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 animate-pulse' :
                                  isRejected ? 'bg-red-600 border-red-600 text-white' :
                                  'bg-white border-gray-300 text-gray-400'}`}>
                                
                                {isRejected ? <X size={14} strokeWidth={3} /> : 
                                 state === 'completed' ? <Check size={14} strokeWidth={3} /> : 
                                 state === 'current' ? <Clock size={14} /> : (i + 1)}
                            </div>

                            {/* Label */}
                            <div className="mt-3 text-center w-full px-1">
                                <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-tighter leading-tight block
                                    ${state === 'current' ? 'text-blue-700' : 
                                      state === 'completed' ? 'text-green-700' : 
                                      isRejected ? 'text-red-700' : 'text-gray-500'}`}>
                                    {isRejected && state === 'rejected' ? 'Rejected' : step.label}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WorkflowStepper;