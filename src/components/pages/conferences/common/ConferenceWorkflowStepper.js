import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, XCircle } from 'lucide-react';

const STEPS = [
  { key: 'submitted', label: 'Submitted' },
  { key: 'under_review', label: 'Peer Review' },
  { key: 'decision', label: 'Editorial Decision' },
  { key: 'camera_ready', label: 'Camera-Ready Final' }
];

const ConferenceWorkflowStepper = ({ status, hasCameraReady }) => {
  const getStepState = (stepIndex) => {
    const isRejected = status === 'rejected';
    const isAccepted = ['accepted_oral', 'accepted_poster'].includes(status);
    const isRevisions = status === 'revisions_required';

    if (stepIndex === 0) return 'completed';
    if (stepIndex === 1) {
      if (['under_review', 'reviews_completed'].includes(status)) return 'current';
      if (isAccepted || isRevisions || isRejected) return 'completed';
      return 'upcoming';
    }
    if (stepIndex === 2) {
      if (isRejected) return 'rejected';
      if (isRevisions) return 'warning';
      if (isAccepted) return 'completed';
      return 'upcoming';
    }
    if (stepIndex === 3) {
      if (isRejected) return 'disabled';
      if (hasCameraReady) return 'completed';
      if (isAccepted || isRevisions) return 'current';
      return 'upcoming';
    }
    return 'upcoming';
  };

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 w-full z-0" />
        {STEPS.map((step, idx) => {
          const state = getStepState(idx);
          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 shadow-sm ${
                  state === 'completed' ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' : 
                  state === 'current' ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse' : 
                  state === 'warning' ? 'bg-amber-500 text-white ring-4 ring-amber-100' : 
                  state === 'rejected' ? 'bg-rose-600 text-white ring-4 ring-rose-100' : 
                  'bg-white border-2 border-slate-300 text-slate-400'
                }`}>
                {state === 'completed' && <CheckCircle2 className="w-5 h-5" />}
                {state === 'current' && <Clock className="w-5 h-5" />}
                {state === 'warning' && <AlertTriangle className="w-5 h-5" />}
                {state === 'rejected' && <XCircle className="w-5 h-5" />}
                {state === 'upcoming' && idx + 1}
                {state === 'disabled' && '-'}
              </div>
              <span className={`text-[11px] font-semibold tracking-wide uppercase mt-2.5 text-center max-w-[85px] ${
                  ['completed', 'current'].includes(state) ? 'text-slate-900 font-bold' : 
                  state === 'rejected' ? 'text-rose-600 font-bold' : 'text-slate-400'
                }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConferenceWorkflowStepper;