// src/components/user/MembersDashboard.js
import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from '../../context/AuthContext'; // Corrected path to App.js
import { Home, Mail, User, Building, Phone, MapPin, CheckCircle, Clock, XCircle, DollarSign, LogOut, GraduationCap } from 'lucide-react'; // Importing icons for a professional look
import { API_BASE_URL } from "../../utils/constants";

const MembersDashboard = () => {
    // Consume authentication state and functions from AuthContext
    const { token, handleLogout, isAuthReady, userRole } = useContext(AuthContext); // Added userRole for display

    const [memberDetails, setMemberDetails] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    // --- Function to Fetch Current Member's Details (Wrapped in useCallback) ---
    const fetchMemberDetails = useCallback(async () => {
        setLoading(true);
        setError('');

        if (!token) {
            console.warn("MembersDashboard: Attempted to fetch data without valid token. Component should not be rendered without authentication.");
            setLoading(false);
            return;
        }

        try {
            console.log('MembersDashboard: Fetching current member details from backend (API: /members/me)...');
            const response = await axios.get(`${API_BASE_URL}/members/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Check this in F12 console:", response.data);

            setMemberDetails(response.data.data);
            console.log('MembersDashboard: Member details fetched successfully:', response.data.data);
        } catch (fetchError) {
            console.error("MembersDashboard: Error fetching member details:", fetchError.response?.data || fetchError.message);
            setError(fetchError.response?.data?.message || "Failed to fetch your membership details.");

            if (fetchError.response?.status === 401 || fetchError.response?.status === 403) {
                console.log('MembersDashboard: API returned Unauthorized/Forbidden. Triggering global logout.');
                handleLogout();
            }
        } finally {
            setLoading(false);
        }
    }, [token, handleLogout, API_BASE_URL]);

    // --- Effect for Initial Data Fetch ---
    useEffect(() => {
        if (isAuthReady && token) {
            fetchMemberDetails();
        } else if (isAuthReady && !token) {
            setLoading(false);
            setError("You are not logged in. Please log in to view your dashboard.");
        }
    }, [token, fetchMemberDetails, isAuthReady]);

    // --- Render Logic ---
    if (!isAuthReady || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="flex items-center space-x-3 p-6 rounded-lg bg-white shadow-lg">
                    <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-xl font-semibold text-blue-700">{!isAuthReady ? "Initializing Authentication..." : "Loading your dashboard..."}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100">
                <div className="bg-white p-8 rounded-lg shadow-xl text-center border border-red-300">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-2xl font-bold text-red-800 mb-2">Error Loading Dashboard</p>
                    <p className="text-lg text-red-600">{error}. Please try again.</p>
                    <button
                        onClick={handleLogout}
                        className="mt-6 px-6 py-2 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 transition-colors duration-200"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    if (!memberDetails) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-xl text-center border border-gray-300">
                    <User className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-2xl font-bold text-gray-800 mb-2">No Member Details Found</p>
                    <p className="text-lg text-gray-600">We could not retrieve your membership profile.</p>
                    <button
                        onClick={handleLogout}
                        className="mt-6 px-6 py-2 bg-gray-600 text-white font-semibold rounded-md shadow-md hover:bg-gray-700 transition-colors duration-200"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    // Determine status display for membership application
    const getApplicationStatusDisplay = (status) => {
        switch (status) {
            case 'approved':
                return <span className="flex items-center text-green-600 font-medium"><CheckCircle className="w-5 h-5 mr-1" /> Approved</span>;
            case 'pending':
                return <span className="flex items-center text-orange-600 font-medium"><Clock className="w-5 h-5 mr-1" /> Pending</span>;
            default:
                return <span className="flex items-center text-gray-600 font-medium"><XCircle className="w-5 h-5 mr-1" /> N/A</span>;
        }
    };

    // Determine status display for annual payment
    const getPaymentStatusDisplay = (status) => {
        switch (status) {
            case 'Paid':
                return <span className="flex items-center text-green-600 font-medium"><DollarSign className="w-5 h-5 mr-1" /> Paid</span>;
            case 'Unpaid':
                return <span className="flex items-center text-red-600 font-medium"><DollarSign className="w-5 h-5 mr-1" /> Unpaid</span>;
            default:
                return <span className="flex items-center text-gray-600 font-medium"><DollarSign className="w-5 h-5 mr-1" /> N/A</span>;
        }
    };


    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto bg-white p-8 sm:p-10 rounded-xl shadow-2xl border border-gray-200">
                <h2 className="text-4xl font-extrabold text-blue-900 text-center mb-8 tracking-tight">
                    Welcome, {memberDetails.full_name || 'Member'}!
                </h2>
                <p className="text-center text-gray-600 text-lg mb-10">
                    Your Personal Membership Dashboard
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    {/* Basic Information Card */}
                    <div className="bg-indigo-50 p-6 rounded-lg shadow-md border border-indigo-200">
                        <h3 className="text-xl font-bold text-indigo-800 mb-4 flex items-center">
                            <User className="w-6 h-6 mr-2 text-indigo-600" /> Personal Details
                        </h3>
                        <div className="space-y-3 text-gray-700">
                            <p className="flex items-center"><GraduationCap className="w-5 h-5 mr-2 text-indigo-500" /> <span className="font-semibold">Title:</span> {memberDetails.academic_rank || 'N/A'}</p> {/* NEW FIELD */}
                            <p className="flex items-center"><Mail className="w-5 h-5 mr-2 text-indigo-500" /> <span className="font-semibold">Email:</span> {memberDetails.email}</p>
                            <p className="flex items-center"><User className="w-5 h-5 mr-2 text-indigo-500" /> <span className="font-semibold">Role:</span> <span className="uppercase font-medium">{memberDetails.role || 'N/A'}</span></p>
                            <p className="flex items-center"><Building className="w-5 h-5 mr-2 text-indigo-500" /> <span className="font-semibold">Institution:</span> {memberDetails.institution || 'N/A'}</p>
                            <p className="flex items-center"><Phone className="w-5 h-5 mr-2 text-indigo-500" /> <span className="font-semibold">Phone:</span> {memberDetails.phone_number || 'N/A'}</p>
                            <p className="flex items-center"><MapPin className="w-5 h-5 mr-2 text-indigo-500" /> <span className="font-semibold">Address:</span> {memberDetails.address || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Membership Status Card */}
                    <div className="bg-green-50 p-6 rounded-lg shadow-md border border-green-200">
                        <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                            <Home className="w-6 h-6 mr-2 text-green-600" /> Membership Status
                        </h3>
                        <div className="space-y-3 text-gray-700">
                            <p>
                                <span className="font-semibold">Overall Status:</span>{' '}
                                <span className={`font-bold ${memberDetails.membership_status === 'Active' ? 'text-green-700' : 'text-red-700'}`}>
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
                                <p className="text-sm text-orange-700 mt-4 italic">
                                    Your membership application is currently pending. Please await approval from an administrator.
                                </p>
                            )}
                            {memberDetails.membership_status === 'Inactive' && memberDetails.membership_application_status === 'approved' && (
                                <p className="text-sm text-red-700 mt-4 italic">
                                    Your membership is approved but currently inactive. Please ensure your annual payment is up to date.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Optional: Add more sections here like recent activities, documents, etc. */}
                {/* For example:
                <div className="mt-10 p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <ListChecks className="w-6 h-6 mr-2 text-gray-600" /> Recent Activities
                    </h3>
                    <p className="text-gray-700">No recent activities to display.</p>
                </div>
                */}

                {/* The logout button div has been removed from here as per your request.
                    It's assumed a logout button is available in the main navigation (EMPANavbar). */}
            </div>
        </div>
    );
};

export default MembersDashboard;
