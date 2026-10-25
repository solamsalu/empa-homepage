import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { API_BASE_URL } from '../../../utils/constants';

// Role-Specific Dashboard Imports
import AuthorDashboard from './AuthorDashboard';
import ReviewerDashboard from './ReviewerDashboard';
import AssociateEditorDashboard from './AssociateEditorDashboard'; 
import ManagingEditorDashboard from './ManagingEditorDashboard'; 

import { 
    User, Edit, BookUser, LogOut, Microscope, 
    Landmark, History, Edit3, BookOpen, ChevronRight, RefreshCw 
} from 'lucide-react';

const HeaderStat = ({ value, label }) => (
    <div className="text-center sm:text-left">
        <p className="text-2xl font-bold text-blue-700">{value}</p>
        <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
    </div>
);

// --- Dashboard Selector Component ---
const DashboardSelector = ({ dashboards, onSelect }) => (
    <div className="max-w-2xl mx-auto py-20 px-4 animate-in fade-in zoom-in duration-500 font-sans">
        <h2 className="text-3xl font-black text-slate-800 text-center mb-2 uppercase tracking-tight">Select Workspace</h2>
        <p className="text-slate-500 text-center mb-12">You have multiple active roles in this journal. Please select a view.</p>
        <div className="grid gap-6">
            {dashboards.map(type => (
                <button 
                    key={type}
                    onClick={() => onSelect(type)}
                    className="group bg-white p-8 rounded-[2rem] border-2 border-slate-100 hover:border-blue-600 shadow-sm hover:shadow-xl transition-all flex items-center justify-between"
                >
                    <div className="flex items-center gap-6">
                        <div className={`p-4 rounded-2xl group-hover:text-white transition-colors ${type === 'author' ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600'}`}>
                            {type === 'author' ? <Edit3 size={32} /> : <BookOpen size={32} />}
                        </div>
                        <div className="text-left">
                            <h3 className="text-xl font-bold text-slate-800 capitalize">{type.replace('_', ' ')} Dashboard</h3>
                            <p className="text-sm text-slate-400">
                                {type === 'author' ? 'Manage your submissions and research.' : 'Review technical quality of assigned papers.'}
                            </p>
                        </div>
                    </div>
                    <ChevronRight className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-2 transition-all" />
                </button>
            ))}
        </div>
    </div>
);

const JempaPortalPage = () => {
    const { userRole, userName, handleLogout, authToken } = useContext(AuthContext);
    const [summaryStats, setSummaryStats] = useState([]);
    const [isLoadingStats, setIsLoadingStats] = useState(true);

    const [availableDashboards, setAvailableDashboards] = useState([]);
    const [activeView, setActiveView] = useState(null); 

    useEffect(() => {
        const fetchPortalData = async () => {
            if (!authToken) {
                setIsLoadingStats(false);
                return;
            }
            setIsLoadingStats(true);
            try {
                const [statsRes, userRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/dashboard/stats`, { headers: { 'Authorization': `Bearer ${authToken}` } }).catch(() => ({ data: { success: false } })),
                    axios.get(`${API_BASE_URL}/members/me`, { headers: { 'Authorization': `Bearer ${authToken}` } }).catch(() => ({ data: { success: false } }))
                ]);

                if (statsRes.data.success) {
                    setSummaryStats(statsRes.data.data.stats || []);
                }
                
                // 🌟 SAFE ROLE FALLBACK LOGIC 🌟
                const dbRole = userRes.data?.data?.role || userRole || 'member';
                const normalizedRole = dbRole.toLowerCase().trim();
                
                // Pull dashboards from backend if present, otherwise calculate safely on frontend
                let rolesFromDB = userRes.data?.data?.availableDashboards;
                
                if (!rolesFromDB || rolesFromDB.length === 0) {
                    if (['admin', 'editor_in_chief', 'managing_editor', 'eic'].includes(normalizedRole)) {
                        rolesFromDB = ['managing_editor', 'author'];
                    } else if (normalizedRole === 'associate_editor') {
                        rolesFromDB = ['associate_editor', 'author'];
                    } else if (['reviewer', 'scientific_committee'].includes(normalizedRole)) {
                        rolesFromDB = ['reviewer', 'author'];
                    } else {
                        rolesFromDB = ['author']; // Members and Authors default to Author view
                    }
                }

                setAvailableDashboards(rolesFromDB);

                if (rolesFromDB.length === 1) {
                    setActiveView(rolesFromDB[0]);
                }
            } catch (error) {
                console.error("Portal Data Fetch Error:", error);
                setAvailableDashboards(['author']);
                setActiveView('author');
            } finally {
                setIsLoadingStats(false);
            }
        };

        fetchPortalData();
    }, [authToken, userRole]);

    // --- Role-Based Dashboard Switcher ---
    const renderDashboard = () => {
        if (!activeView && availableDashboards.length > 1) {
            return <DashboardSelector dashboards={availableDashboards} onSelect={setActiveView} />;
        }

        const view = (activeView || userRole || 'author').toLowerCase().trim();

        switch (view) {
            case 'member':
            case 'author':
                return <AuthorDashboard />;

            case 'reviewer':
            case 'scientific_committee':
                return <ReviewerDashboard />;

            case 'associate_editor':
                return <AssociateEditorDashboard />;

            case 'managing_editor':
            case 'editor_in_chief':
            case 'eic':
            case 'admin':
            case 'production_staff':
            case 'production':
                return <ManagingEditorDashboard />;
             
            default:
                // Fallback to Author Dashboard instead of locking out users
                return <AuthorDashboard />;
        }
    };

    const getRoleInfo = () => {
        const view = (activeView || userRole || 'author').toLowerCase().trim();
        switch (view) {
            case 'author':
            case 'member':
                return { icon: <Edit className="h-6 w-6" />, label: "Author Workspace" };
            case 'reviewer':
            case 'scientific_committee':
                return { icon: <BookUser className="h-6 w-6" />, label: "Reviewer Workspace" };
            case 'associate_editor':
                return { icon: <Microscope className="h-6 w-6" />, label: "Associate Editor" };
            case 'managing_editor':
            case 'editor_in_chief':
            case 'eic':
            case 'admin':
                return { icon: <Landmark className="h-6 w-6" />, label: "Managing Editor" };
            case 'production_staff':
            case 'production':
                return { icon: <History className="h-6 w-6" />, label: "Production Workspace" };
            default:
                return { icon: <User className="h-6 w-6" />, label: "JEMPA Portal" };
        }
    };

    const roleInfo = getRoleInfo();

    return (
        <div className="bg-[#f8fafc] min-h-screen font-sans">
            <header className="bg-white shadow-sm border-b border-slate-200 sticky top-[80px] sm:top-[120px] z-20">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                        
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg">
                                {roleInfo.icon}
                            </div>
                            <div>
                                <h1 className="text-xl font-black text-slate-800 tracking-tight uppercase">
                                    {roleInfo.label}
                                </h1>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                    Operator: {userName || 'Scholar'}
                                    {availableDashboards.length > 1 && (
                                        <button 
                                            onClick={() => setActiveView(null)}
                                            className="ml-2 flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors font-black"
                                        >
                                            <RefreshCw size={10} /> [Switch Workspace]
                                        </button>
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-8 p-3 bg-slate-50 rounded-2xl border border-slate-100 px-6">
                            {isLoadingStats ? (
                                <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-lg"></div>
                            ) : summaryStats.length === 0 ? (
                                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">JEMPA Editorial Hub</div>
                            ) : (
                                summaryStats.map(stat => (
                                    <HeaderStat key={stat.label} value={stat.value} label={stat.label} />
                                ))
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <Link to="/journals" className="text-xs font-black uppercase text-slate-400 hover:text-blue-600 transition">Archive</Link>
                            <button onClick={handleLogout} className="flex items-center gap-2 text-xs font-black uppercase text-red-500 hover:bg-red-50 px-5 py-2.5 rounded-xl border border-transparent hover:border-red-100 transition">
                                <LogOut size={14} /> <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {renderDashboard()}
            </main>
        </div>
    );
};

export default JempaPortalPage;


// // src/components/pages/journal/JempaPortalPage.js
// import React, { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from '../../../context/AuthContext';
// import { API_BASE_URL } from "../../../utils/constants";
// import { User, Edit3, BookOpen, LogOut, RefreshCw, ChevronRight } from 'lucide-react';
// import AuthorDashboard from './AuthorDashboard';
// import ReviewerDashboard from './ReviewerDashboard';
// import AssociateEditorDashboard from './AssociateEditorDashboard'; 
// import ManagingEditorDashboard from './ManagingEditorDashboard'; 

// const DashboardSelector = ({ dashboards, onSelect }) => (
//     <div className="max-w-2xl mx-auto py-20 px-4 animate-in fade-in zoom-in duration-500">
//         <h2 className="text-3xl font-black text-slate-800 text-center mb-12 uppercase tracking-tight">Select Journal Workspace</h2>
//         <div className="grid gap-6">
//             {dashboards.map(type => (
//                 <button key={type} onClick={() => onSelect(type)} className="group bg-white p-8 rounded-[2rem] border border-slate-200 hover:border-blue-600 shadow-sm hover:shadow-xl transition-all flex items-center justify-between">
//                     <div className="flex items-center gap-6">
//                         <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
//                             {type === 'author' ? <Edit3 size={32} /> : <BookOpen size={32} />}
//                         </div>
//                         <div className="text-left">
//                             <h3 className="text-xl font-bold text-slate-800 capitalize">{type.replace('_', ' ')} Dashboard</h3>
//                         </div>
//                     </div>
//                     <ChevronRight className="text-slate-300 group-hover:text-blue-600 transition-all" />
//                 </button>
//             ))}
//         </div>
//     </div>
// );

// const JempaPortalPage = () => {
//     const { userRole, userName, handleLogout, authToken } = useContext(AuthContext);
//     const [activeView, setActiveView] = useState(null);

//     // Filter logic specific to Journal Roles
//     const journalRoles = ['admin', 'editor_in_chief', 'managing_editor', 'associate_editor', 'production_staff', 'reviewer', 'author'];
//     const currentRole = userRole?.toLowerCase();
//     const availableDashboards = journalRoles.includes(currentRole) ? [currentRole] : ['author'];

//     const renderDashboard = () => {
//         if (!activeView && availableDashboards.length > 1) {
//             return <DashboardSelector dashboards={availableDashboards} onSelect={setActiveView} />;
//         }
//         const view = activeView || currentRole;

//         switch (view) {
//             case 'author': return <AuthorDashboard />;
//             case 'reviewer': return <ReviewerDashboard />;
//             case 'associate_editor': return <AssociateEditorDashboard />;
//             case 'managing_editor': case 'editor_in_chief': case 'admin': case 'production_staff': return <ManagingEditorDashboard />;
//             default: return <div className="text-center py-20 text-slate-500">Access Restricted.</div>;
//         }
//     };

//     return (
//         <div className="bg-slate-50 min-h-screen">
//             <header className="bg-white border-b border-slate-200">
//                 <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
//                     <h1 className="text-sm font-black uppercase text-slate-800">JEMPA Editorial Portal</h1>
//                     <button onClick={handleLogout} className="text-xs font-bold text-rose-600 uppercase">Logout</button>
//                 </div>
//             </header>
//             <main className="max-w-7xl mx-auto py-8 px-6">{renderDashboard()}</main>
//         </div>
//     );
// };

// export default JempaPortalPage;