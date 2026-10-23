import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

const DeadlineCountdown = ({ targetDate, label = "Paper Submission Deadline" }) => {
  const calculateTimeLeft = () => {
    const diff = new Date(targetDate) - new Date();
    if (diff <= 0) return null;

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl">
        <AlertTriangle size={15} /> Submission Window Closed
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-4 rounded-2xl shadow-md border border-blue-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
      <div className="flex items-center gap-2.5">
        <div className="p-2 bg-white/10 rounded-xl">
          <Clock size={18} className="text-amber-400 animate-pulse" />
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-200 block">
            {label}
          </span>
          <span className="text-xs font-bold text-white">
            {new Date(targetDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} at 11:59 PM EAT
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-center">
        {[
          { val: timeLeft.days, unit: 'Days' },
          { val: timeLeft.hours, unit: 'Hours' },
          { val: timeLeft.minutes, unit: 'Mins' },
          { val: timeLeft.seconds, unit: 'Secs' }
        ].map(item => (
          <div key={item.unit} className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 min-w-[50px]">
            <span className="text-base font-black text-amber-300 block leading-tight">{item.val}</span>
            <span className="text-[9px] uppercase font-bold text-blue-200">{item.unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeadlineCountdown;