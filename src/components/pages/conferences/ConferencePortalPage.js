// import React, { useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../../../context/AuthContext';
// import { FileText, Shield, Award, ArrowRight, Lock } from 'lucide-react';

// const ConferencePortalPage = () => {
//     const { userRole } = useContext(AuthContext);
//     const navigate = useNavigate();

//     const role = userRole?.toLowerCase().trim();
    
//     // Define explicit access logic for Conference Section
//     const isAdminOrChair = ['admin', 'conference_manager'].includes(role);
//     const isReviewer = ['scientific_committee', 'reviewer', 'admin', 'conference_manager'].includes(role);

//     return (
//         <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
//             <div className="max-w-5xl mx-auto space-y-10">
                
//                 <div className="text-center space-y-3">
//                     <span className="text-xs font-black uppercase tracking-widest text-blue-600">EMPA Conference Management</span>
//                     <h1 className="text-4xl font-black text-slate-900 tracking-tight">Conference Portal</h1>
//                     <p className="text-slate-500 max-w-2xl mx-auto">Select your specialized workspace to manage your conference contributions.</p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
//                     {/* 1. Author Workspace (Public to all logged in users) */}
//                     <div 
//                         onClick={() => navigate('/conferences/author/dashboard')}
//                         className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 transition cursor-pointer group flex flex-col items-center text-center space-y-4"
//                     >
//                         <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
//                             <FileText size={32} />
//                         </div>
//                         <h2 className="text-lg font-bold text-slate-900">Author Hub</h2>
//                         <p className="text-xs text-slate-500">Track your submissions, view referee feedback, and upload final camera-ready drafts.</p>
//                         <span className="text-blue-600 text-xs font-bold flex items-center gap-1 mt-auto pt-4 group-hover:translate-x-1 transition-transform">
//                             Open Hub <ArrowRight size={14} />
//                         </span>
//                     </div>

//                     {/* 2. Reviewer Workspace (Only for Committee members) */}
//                     <div 
//                         onClick={() => isReviewer ? navigate('/conferences/reviewer/dashboard') : null}
//                         className={`bg-white rounded-3xl p-8 border border-slate-200 shadow-sm transition flex flex-col items-center text-center space-y-4 ${isReviewer ? 'hover:shadow-xl hover:border-indigo-400 cursor-pointer group' : 'opacity-50 cursor-not-allowed grayscale'}`}
//                     >
//                         <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition ${isReviewer ? 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white' : 'bg-slate-100 text-slate-400'}`}>
//                             <Award size={32} />
//                         </div>
//                         <h2 className="text-lg font-bold text-slate-900">Reviewer Desk</h2>
//                         <p className="text-xs text-slate-500">Conduct blind peer reviews for conference manuscripts assigned to you.</p>
//                         {!isReviewer && (
//                             <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-auto pt-4 flex items-center gap-1">
//                                 <Lock size={12} /> Restricted Access
//                             </span>
//                         )}
//                     </div>

//                     {/* 3. Chair Workspace (Only for Conference Managers/Admins) */}
//                     <div 
//                         onClick={() => isAdminOrChair ? navigate('/conferences/manager/dashboard') : null}
//                         className={`bg-white rounded-3xl p-8 border border-slate-200 shadow-sm transition flex flex-col items-center text-center space-y-4 ${isAdminOrChair ? 'hover:shadow-xl hover:border-amber-400 cursor-pointer group' : 'opacity-50 cursor-not-allowed grayscale'}`}
//                     >
//                         <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition ${isAdminOrChair ? 'bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white' : 'bg-slate-100 text-slate-400'}`}>
//                             <Shield size={32} />
//                         </div>
//                         <h2 className="text-lg font-bold text-slate-900">Chair Command Hub</h2>
//                         <p className="text-xs text-slate-500">Assign reviewers, manage sessions, and dispatch formal scientific decisions.</p>
//                         {!isAdminOrChair && (
//                             <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-auto pt-4 flex items-center gap-1">
//                                 <Lock size={12} /> Restricted Access
//                             </span>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ConferencePortalPage;


// src/components/pages/conferences/ConferencePortalPage.js
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { API_BASE_URL } from '../../../utils/constants';
import { 
    User, 
    FileText, 
    Shield, 
    Award, 
    ArrowRight, 
    LogOut, 
    Calendar, 
    CheckCircle2, 
    Clock, 
    Sparkles 
} from 'lucide-react';
import ConferencePageHeader from './common/ConferencePageHeader';

const ConferencePortalPage = () => {
    const { userRole, userName, handleLogout, authToken } = useContext(AuthContext);
    const [conferenceStats, setConferenceStats] = useState({ activeConfs: 0, myPapers: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const role = userRole?.toLowerCase().trim() || 'member';
    
    // Explicit Role Permissions for Conference Section
    const isAdminOrChair = ['admin', 'conference_manager'].includes(role);
    const isReviewer = ['scientific_committee', 'reviewer', 'admin', 'conference_manager'].includes(role);

    useEffect(() => {
        const fetchPortalStats = async () => {
            if (!authToken) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            try {
                // Fetch active conferences count & user's submitted papers count in parallel
                const [confRes, paperRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/submissions/active`).catch(() => ({ data: { data: [] } })),
                    axios.get(`${API_BASE_URL}/conference-papers/author/my-papers`, { 
                        headers: { Authorization: `Bearer ${authToken}` } 
                    }).catch(() => ({ data: { data: [] } }))
                ]);

                setConferenceStats({
                    activeConfs: confRes.data.data?.length || 0,
                    myPapers: paperRes.data.data?.length || 0
                });
            } catch (error) {
                console.error("Conference Portal Stats Error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPortalStats();
    }, [authToken]);

    return (
        <div className="bg-[#f8fafc] min-h-screen font-sans pb-20">
            
            {/* 🌟 UNIFIED HEADER BAR 🌟 */}
            <ConferencePageHeader 
                title="Conference Management Portal" 
                subtitle={`Welcome back, ${userName || 'Scholar'} • Role: ${role.replace('_', ' ').toUpperCase()}`}
                backUrl="/conferences"
                breadcrumbs={[{ label: 'Conference Portal' }]}
                actions={
                    <div className="flex items-center gap-3">
                        <Link 
                            to="/conferences" 
                            className="text-xs font-black uppercase text-slate-400 hover:text-blue-600 transition"
                        >
                            Public Schedule
                        </Link>
                        <button 
                            onClick={handleLogout} 
                            className="flex items-center gap-1.5 text-xs font-black uppercase text-rose-500 hover:bg-rose-50 px-4 py-2 rounded-xl border border-transparent hover:border-rose-100 transition"
                        >
                            <LogOut size={14} /> <span>Logout</span>
                        </button>
                    </div>
                }
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                
                {/* 🌟 STATS OVERVIEW ROW 🌟 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5">
                        <div className="p-4 rounded-2xl bg-blue-50 text-blue-600">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase text-slate-400 mb-1">Active Submission Windows</p>
                            <p className="text-2xl font-black text-slate-800 tracking-tight">
                                {isLoading ? '...' : conferenceStats.activeConfs}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5">
                        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600">
                            <FileText size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase text-slate-400 mb-1">Your Submitted Papers</p>
                            <p className="text-2xl font-black text-slate-800 tracking-tight">
                                {isLoading ? '...' : conferenceStats.myPapers}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5">
                        <div className="p-4 rounded-2xl bg-amber-50 text-amber-600">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase text-slate-400 mb-1">System Status</p>
                            <p className="text-sm font-black text-emerald-600 mt-1 flex items-center gap-1">
                                <CheckCircle2 size={16} /> Double-Blind Active
                            </p>
                        </div>
                    </div>
                </div>

                {/* 🌟 WORKSPACE SELECTOR CARDS 🌟 */}
                <div className="space-y-4">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block">
                            Operational Hubs
                        </span>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                            Select Your Conference Workspace
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* 1. Author Workspace */}
                        <div 
                            onClick={() => navigate('/conferences/author/dashboard')}
                            className="group bg-white p-8 rounded-[2rem] border-2 border-slate-100 hover:border-blue-600 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between cursor-pointer space-y-6"
                        >
                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors w-fit">
                                    <FileText size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Author Hub</h3>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                        Submit research manuscripts with LaTeX formulas, track double-blind review progression, and upload final camera-ready editions.
                                    </p>
                                </div>
                            </div>
                            <span className="text-blue-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-2 transition-transform pt-2">
                                Enter Author Hub <ArrowRight size={14} />
                            </span>
                        </div>

                        {/* 2. Reviewer Desk */}
                        <div 
                            onClick={() => isReviewer ? navigate('/conferences/reviewer/dashboard') : null}
                            className={`group bg-white p-8 rounded-[2rem] border-2 border-slate-100 transition-all flex flex-col justify-between space-y-6 ${
                                isReviewer 
                                    ? 'hover:border-indigo-600 shadow-sm hover:shadow-xl cursor-pointer' 
                                    : 'opacity-60 grayscale cursor-not-allowed'
                            }`}
                        >
                            <div className="space-y-4">
                                <div className={`p-4 rounded-2xl transition-colors w-fit ${
                                    isReviewer 
                                        ? 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white' 
                                        : 'bg-slate-100 text-slate-400'
                                }`}>
                                    <Award size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Reviewer Desk</h3>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                        Accept review invitations, download blind manuscripts, and submit 5-point rubric evaluations and referee feedback.
                                    </p>
                                </div>
                            </div>
                            {isReviewer ? (
                                <span className="text-indigo-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-2 transition-transform pt-2">
                                    Enter Reviewer Desk <ArrowRight size={14} />
                                </span>
                            ) : (
                                <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider pt-2 block">
                                    Restricted to Scientific Committee
                                </span>
                            )}
                        </div>

                        {/* 3. Chair Command Hub */}
                        <div 
                            onClick={() => isAdminOrChair ? navigate('/conferences/manager/dashboard') : null}
                            className={`group bg-white p-8 rounded-[2rem] border-2 border-slate-100 transition-all flex flex-col justify-between space-y-6 ${
                                isAdminOrChair 
                                    ? 'hover:border-amber-500 shadow-sm hover:shadow-xl cursor-pointer' 
                                    : 'opacity-60 grayscale cursor-not-allowed'
                            }`}
                        >
                            <div className="space-y-4">
                                <div className={`p-4 rounded-2xl transition-colors w-fit ${
                                    isAdminOrChair 
                                        ? 'bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white' 
                                        : 'bg-slate-100 text-slate-400'
                                }`}>
                                    <Shield size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Chair Command Hub</h3>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                        Triage conference submissions, assign reviewers without conflicts of interest, schedule presentation rooms, and dispatch formal decisions.
                                    </p>
                                </div>
                            </div>
                            {isAdminOrChair ? (
                                <span className="text-amber-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-2 transition-transform pt-2">
                                    Enter Chair Command <ArrowRight size={14} />
                                </span>
                            ) : (
                                <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider pt-2 block">
                                    Restricted to Conference Managers & Admins
                                </span>
                            )}
                        </div>

                    </div>
                </div>

            </main>
        </div>
    );
};

export default ConferencePortalPage;