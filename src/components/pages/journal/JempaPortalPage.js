import React, { useState, useEffect, useContext, useMemo } from 'react';
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

// --- New Sub-Component: Dashboard Selector ---
const DashboardSelector = ({ dashboards, onSelect }) => (
    <div className="max-w-2xl mx-auto py-20 px-4 animate-in fade-in zoom-in duration-500">
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
                            <h3 className="text-xl font-bold text-slate-800 capitalize">{type} Dashboard</h3>
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

    // --- NEW STATE FOR MULTI-ROLE SYSTEM ---
    const [availableDashboards, setAvailableDashboards] = useState([]);
    const [activeView, setActiveView] = useState(null); 

    useEffect(() => {
        const fetchPortalData = async () => {
            if (!authToken) {
                setIsLoadingStats(false);
                return;
            };
            setIsLoadingStats(true);
            try {
                // 1. Fetch Stats and User Profile (to get available dashboards)
                const [statsRes, userRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/dashboard/stats`, { headers: { 'Authorization': `Bearer ${authToken}` } }),
                    axios.get(`${API_BASE_URL}/members/me`, { headers: { 'Authorization': `Bearer ${authToken}` } })
                ]);

                if (statsRes.data.success) setSummaryStats(statsRes.data.data.stats || []);
                
                // 2. Logic: Determine which dashboards this user can access
                // Note: 'availableDashboards' should be calculated by backend (Step 1 of previous reply)
                const rolesFromDB = userRes.data.data.availableDashboards || [userRole.toLowerCase()];
                setAvailableDashboards(rolesFromDB);

                // 3. Auto-set view if only one is available
                if (rolesFromDB.length === 1) {
                    setActiveView(rolesFromDB[0]);
                }
            } catch (error) {
                console.error("Portal Data Fetch Error:", error);
            } finally {
                setIsLoadingStats(false);
            }
        };

        fetchPortalData();
    }, [authToken, userRole]);

    // --- Role-Based Dashboard Switcher ---
    const renderDashboard = () => {
        // If user has multiple roles and hasn't picked one yet, show selector
        if (!activeView && availableDashboards.length > 1) {
            return <DashboardSelector dashboards={availableDashboards} onSelect={setActiveView} />;
        }

        const view = activeView || userRole?.toLowerCase();

        switch (view) {
            case 'member':
            case 'author':
                return <AuthorDashboard />;

            case 'reviewer':
                return <ReviewerDashboard />;

            case 'associate_editor':
                return <AssociateEditorDashboard />;

            case 'managing_editor':
            case 'editor_in_chief':
            case 'admin':
            case 'production_staff':
                return <ManagingEditorDashboard />;
             
            default:
                return (
                    <div className="max-w-md mx-auto mt-10 text-center bg-white p-10 rounded-3xl shadow-sm border border-slate-200">
                        <User className="text-slate-400 mx-auto mb-6" size={40} />
                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Access Restricted</h2>
                        <p className="mt-2 text-slate-500 text-sm">Please contact support if you believe this is an error.</p>
                    </div>
                );
        }
    };

    const getRoleInfo = () => {
        const view = activeView || userRole?.toLowerCase();
        switch (view) {
            case 'author':
            case 'member':
                return { icon: <Edit className="h-6 w-6" />, label: "Author Workspace" };
            case 'reviewer':
                return { icon: <BookUser className="h-6 w-6" />, label: "Reviewer Workspace" };
            case 'associate_editor':
                return { icon: <Microscope className="h-6 w-6" />, label: "Associate Editor" };
            case 'managing_editor':
            case 'editor_in_chief':
            case 'admin':
                return { icon: <Landmark className="h-6 w-6" />, label: "Managing Editor" };
            case 'production_staff':
                return { icon: <History className="h-6 w-6" />, label: "Production Workspace" };
            default:
                return { icon: <User className="h-6 w-6" />, label: "JEMPA Portal" };
        }
    };

    const roleInfo = getRoleInfo();

    return (
        <div className="bg-[#f8fafc] min-h-screen">
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
                                    Operator: {userName}
                                    {/* --- NEW: SWITCH BUTTON --- */}
                                    {availableDashboards.length > 1 && (
                                        <button 
                                            onClick={() => setActiveView(null)}
                                            className="ml-2 flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
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