import React from 'react';
import { Edit3, BookOpen, ChevronRight } from 'lucide-react';

const DashboardSelector = ({ dashboards, onSelect }) => {
    return (
        <div className="max-w-2xl mx-auto py-20 px-4 animate-in fade-in zoom-in duration-500">
            <h2 className="text-3xl font-black text-slate-800 text-center mb-2 uppercase tracking-tight">Select Workspace</h2>
            <p className="text-slate-500 text-center mb-12">You have multiple active roles in this journal.</p>
            
            <div className="grid gap-6">
                {dashboards.includes('author') && (
                    <button 
                        onClick={() => onSelect('author')}
                        className="group bg-white p-8 rounded-3xl border-2 border-slate-100 hover:border-blue-600 shadow-sm hover:shadow-xl transition-all flex items-center justify-between"
                    >
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <Edit3 size={32} />
                            </div>
                            <div className="text-left">
                                <h3 className="text-xl font-bold text-slate-800">Author Dashboard</h3>
                                <p className="text-sm text-slate-400">Submit manuscripts and track your research.</p>
                            </div>
                        </div>
                        <ChevronRight className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-2 transition-all" />
                    </button>
                )}

                {dashboards.includes('reviewer') && (
                    <button 
                        onClick={() => onSelect('reviewer')}
                        className="group bg-white p-8 rounded-3xl border-2 border-slate-100 hover:border-indigo-600 shadow-sm hover:shadow-xl transition-all flex items-center justify-between"
                    >
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                <BookOpen size={32} />
                            </div>
                            <div className="text-left">
                                <h3 className="text-xl font-bold text-slate-800">Reviewer Dashboard</h3>
                                <p className="text-sm text-slate-400">Evaluate technical quality of math papers.</p>
                            </div>
                        </div>
                        <ChevronRight className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-2 transition-all" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default DashboardSelector;