// src/components/user/MembersDashboard.js
import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Added Link
import { AuthContext } from '../../context/AuthContext';
import { 
    Home, Mail, User, Building, Phone, MapPin, 
    CheckCircle, Clock, XCircle, DollarSign, 
    GraduationCap, FileText, Award, Shield, ArrowRight 
} from 'lucide-react';
import { API_BASE_URL } from "../../utils/constants";

const MembersDashboard = () => {
    // Consume authentication state from AuthContext (supports both authToken and token)
    const { authToken, token: legacyToken, handleLogout, isAuthReady, userRole } = useContext(AuthContext);
    const token = authToken || legacyToken;

    const [memberDetails, setMemberDetails] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    // --- Function to Fetch Current Member's Details ---
    const fetchMemberDetails = useCallback(async () => {
        setLoading(true);
        setError('');

        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`${API_BASE_URL}/members/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMemberDetails(response.data.data);
        } catch (fetchError) {
            setError(fetchError.response?.data?.message || "Failed to fetch your membership details.");
            if (fetchError.response?.status === 401 || fetchError.response?.status === 403) {
                handleLogout();
            }
        } finally {
            setLoading(false);
        }
    }, [token, handleLogout]);

    useEffect(() => {
        if (isAuthReady && token) {
            fetchMemberDetails();
        } else if (isAuthReady && !token) {
            setLoading(false);
            setError("You are not logged in. Please log in to view your dashboard.");
        }
    }, [token, fetchMemberDetails, isAuthReady]);

    if (!isAuthReady || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans">
                <div className="flex items-center space-x-3 p-6 rounded-2xl bg-white shadow-lg">
                    <div className="animate-spin h-7 w-7 border-b-2 border-blue-600 rounded-full" />
                    <p className="text-lg font-semibold text-blue-700">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100 font-sans">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center border border-red-300 max-w-md">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-2xl font-bold text-red-800 mb-2">Error Loading Dashboard</p>
                    <p className="text-sm text-red-600 mb-6">{error}</p>
                    <button
                        onClick={handleLogout}
                        className="px-6 py-2 bg-red-600 text-white font-semibold rounded-xl shadow-md hover:bg-red-700 transition"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    if (!memberDetails) return null;

    const role = (memberDetails.role || userRole || '').toLowerCase();
    const isManager = ['conference_manager', 'admin'].includes(role);

    const getApplicationStatusDisplay = (status) => {
        switch (status) {
            case 'approved':
                return <span className="flex items-center text-green-600 font-medium"><CheckCircle className="w-4 h-4 mr-1" /> Approved</span>;
            case 'pending':
                return <span className="flex items-center text-orange-600 font-medium"><Clock className="w-4 h-4 mr-1" /> Pending</span>;
            default:
                return <span className="flex items-center text-gray-600 font-medium"><XCircle className="w-4 h-4 mr-1" /> N/A</span>;
        }
    };

    const getPaymentStatusDisplay = (status) => {
        switch (status) {
            case 'Paid':
                return <span className="flex items-center text-green-600 font-medium"><DollarSign className="w-4 h-4 mr-1" /> Paid</span>;
            case 'Unpaid':
                return <span className="flex items-center text-red-600 font-medium"><DollarSign className="w-4 h-4 mr-1" /> Unpaid</span>;
            default:
                return <span className="flex items-center text-gray-600 font-medium"><DollarSign className="w-4 h-4 mr-1" /> N/A</span>;
        }
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-gray-200 space-y-8">
                
                {/* Header Welcome Banner */}
                <div className="text-center border-b pb-6">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-900 tracking-tight">
                        Welcome, {memberDetails.full_name || 'Member'}!
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        EMPA Digital Portal & Personal Dashboard
                    </p>
                </div>

                {/* --- 🌟 NEW: ACTIVE WORKSPACES & REVIEWER QUEUE 🌟 --- */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <div className="mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 block">
                            Direct Workspaces
                        </span>
                        <h3 className="text-lg font-bold text-slate-800">
                            Your Active Portals
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* 1. Reviewer Queue (THIS IS WHERE THE REVIEWER ACCESSES ASSIGNED PAPERS) */}
                        <Link 
                            to="/conferences/reviewer/dashboard" 
                            className="p-4 rounded-xl bg-white border-2 border-indigo-200 hover:border-indigo-600 hover:shadow-md transition group flex flex-col justify-between"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition">
                                    <Shield size={20} />
                                </div>
                                <ArrowRight size={16} className="text-slate-400 group-hover:translate-x-1 transition text-indigo-600" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900">Reviewer Queue</h4>
                                <p className="text-[11px] text-slate-500 mt-0.5">Evaluate assigned conference manuscripts</p>
                            </div>
                        </Link>

                        {/* 2. Conference Author Submissions */}
                        <Link 
                            to="/conferences/author/dashboard" 
                            className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md transition group flex flex-col justify-between"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">
                                    <FileText size={20} />
                                </div>
                                <ArrowRight size={16} className="text-slate-400 group-hover:translate-x-1 transition" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900">Author Hub</h4>
                                <p className="text-[11px] text-slate-500 mt-0.5">Track your conference papers & camera-ready</p>
                            </div>
                        </Link>

                        {/* 3. JEMPA Journal Portal or Chair Hub */}
                        {isManager ? (
                            <Link 
                                to="/conferences/manager/dashboard" 
                                className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 hover:bg-blue-600 transition group flex flex-col justify-between"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2 bg-white/10 rounded-lg">
                                        <Award size={20} className="text-amber-400" />
                                    </div>
                                    <ArrowRight size={16} className="text-slate-400 group-hover:translate-x-1 transition" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">Chair Command Hub</h4>
                                    <p className="text-[11px] text-slate-300 mt-0.5">Assign reviewers & schedule timetable</p>
                                </div>
                            </Link>
                        ) : (
                            <Link 
                                to="/jempa-portal" 
                                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition group flex flex-col justify-between"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition">
                                        <Award size={20} />
                                    </div>
                                    <ArrowRight size={16} className="text-slate-400 group-hover:translate-x-1 transition" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">JEMPA Journal</h4>
                                    <p className="text-[11px] text-slate-500 mt-0.5">Journal publications and reviews</p>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Personal & Membership Information Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Basic Information Card */}
                    <div className="bg-indigo-50/60 p-6 rounded-2xl shadow-sm border border-indigo-100">
                        <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center">
                            <User className="w-5 h-5 mr-2 text-indigo-600" /> Personal Details
                        </h3>
                        <div className="space-y-3 text-sm text-gray-700">
                            <p className="flex items-center"><GraduationCap className="w-4 h-4 mr-2 text-indigo-500" /> <span className="font-semibold mr-1">Title:</span> {memberDetails.academic_rank || 'N/A'}</p>
                            <p className="flex items-center"><Mail className="w-4 h-4 mr-2 text-indigo-500" /> <span className="font-semibold mr-1">Email:</span> {memberDetails.email}</p>
                            <p className="flex items-center"><User className="w-4 h-4 mr-2 text-indigo-500" /> <span className="font-semibold mr-1">Role:</span> <span className="uppercase font-semibold text-indigo-700">{memberDetails.role?.replace(/_/g, ' ') || 'N/A'}</span></p>
                            <p className="flex items-center"><Building className="w-4 h-4 mr-2 text-indigo-500" /> <span className="font-semibold mr-1">Institution:</span> {memberDetails.institution || 'N/A'}</p>
                            <p className="flex items-center"><Phone className="w-4 h-4 mr-2 text-indigo-500" /> <span className="font-semibold mr-1">Phone:</span> {memberDetails.phone_number || 'N/A'}</p>
                            <p className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-indigo-500" /> <span className="font-semibold mr-1">Address:</span> {memberDetails.address || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Membership Status Card */}
                    <div className="bg-emerald-50/60 p-6 rounded-2xl shadow-sm border border-emerald-100">
                        <h3 className="text-lg font-bold text-emerald-900 mb-4 flex items-center">
                            <Home className="w-5 h-5 mr-2 text-emerald-600" /> Membership Status
                        </h3>
                        <div className="space-y-3 text-sm text-gray-700">
                            <p>
                                <span className="font-semibold">Overall Status:</span>{' '}
                                <span className={`font-bold ml-1 ${memberDetails.membership_status === 'Active' ? 'text-green-700' : 'text-red-700'}`}>
                                    {memberDetails.membership_status || 'N/A'}
                                </span>
                            </p>
                            <p>
                                <span className="font-semibold">Application Status:</span>{' '}
                                {getApplicationStatusDisplay(memberDetails.membership_application_status)}
                            </p>
                            <p>
                                <span className="font-semibold">Annual Payment:</span>{' '}
                                {getPaymentStatusDisplay(memberDetails.annual_payment_status)}
                            </p>
                            {memberDetails.membership_application_status === 'pending' && (
                                <p className="text-xs text-orange-700 mt-2 italic bg-orange-50 p-2 rounded-lg border border-orange-200">
                                    Your membership application is currently pending administrator approval.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MembersDashboard;