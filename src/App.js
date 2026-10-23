// import React, { useEffect, useContext } from 'react';
// import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // --- Layout & Global Components ---
// import Layout from './components/layout/Layout';

// // --- Page Components ---
// import HomePage from './components/pages/HomePage.js';
// import AboutUsPage from './components/pages/AboutUsPage.js';
// import NewsPage from './components/pages/news/NewsPage.js';
// import NewsDetailPage from './components/pages/news/NewsDetailPage.js';
// import ConferencesPage from './components/pages/conferences/ConferencesPage.js';
// import ConferenceDetailsPage from './components/pages/conferences/ConferenceDetailsPage.js';
// import MembershipPage from './components/pages/membership/MembershipPage.js';
// import ResourcesPage from './components/pages/ResourcesPage.js';
// import ContactPage from './components/pages/ContactPage.js';
// import JournalPage from './components/pages/JournalPage.js';
// import OlympiadPage from './components/pages/olympiad/OlympiadPage.js';

// // --- Auth & User Pages ---
// import RegisterPage from './components/user/SignupPage.js';
// import LoginPage from './components/user/LoginPage.js';
// import ResetPasswordPage from './components/pages/auth/ResetPasswordPage.js';
// import ForgotPasswordPage from './components/pages/auth/ForgotPasswordPage.js';

// // --- Protected Dashboards & Pages ---
// import AdminDashboard from './components/user/AdminDashboard.js';
// import MembersDashboard from './components/user/MembersDashboard.js';
// import SubmitPaperPage from './components/pages/conferences/SubmitPaperPage';
// import JempaPortalPage from './components/pages/journal/JempaPortalPage.js';
// import SubmissionGatewayPage from './components/pages/journal/SubmissionGatewayPage';
// import JournalEditionDetailPage from './components/pages/journal/JournalEditionDetailPage';
// import JournalCompilerPage from './components/pages/journal/Editor/JournalCompilerPage';
// import ManageEditionsPage from './components/pages/journal/Editor/ManageEditionsPage';
// import ArticleDetailPage from './components/pages/journal/ArticleDetailPage';

// // --- Admin Conference Management Pages ---
// import AdminConferenceDashboard from './components/pages/conferences/AdminConferenceDashboard';
// import AdminConferencePapersPage from './components/pages/conferences/AdminConferencePapersPage';

// // --- System Pages ---
// import PrivacyPolicyPage from './components/layout/PrivacyPolicyPage.js';
// import TermsOfServicePage from './components/layout/TermsOfServicePage.js';

// // --- AUTH CONTEXT IMPORT ---
// import { AuthContext } from './context/AuthContext.js';

// // ===================================================================================
// // ROUTING UTILITIES
// // ===================================================================================

// const ProtectedRoute = ({ children }) => {
//     const { isLoggedIn, isAuthReady } = useContext(AuthContext);
//     const location = useLocation();
    
//     if (!isAuthReady) {
//         return (
//             <div className="min-h-screen flex items-center justify-center text-slate-500 font-bold">
//                 Authenticating session...
//             </div>
//         );
//     }
    
//     return isLoggedIn ? children : <Navigate to="/login" state={{ from: location }} replace />;
// };

// const AdminRoute = ({ children }) => {
//     const { isLoggedIn, userRole, isAuthReady } = useContext(AuthContext);
//     const location = useLocation();

//     if (!isAuthReady) {
//         return (
//             <div className="min-h-screen flex items-center justify-center text-slate-500 font-bold">
//                 Authenticating session...
//             </div>
//         );
//     }

//     if (!isLoggedIn) {
//         return <Navigate to="/login" state={{ from: location }} replace />;
//     }

//     const normalizedRole = userRole?.toLowerCase().trim();
//     const authorizedRoles = [
//         'admin', 
//         'editor', 
//         'managing_editor', 
//         'eic', 
//         'editor_in_chief', 
//         'production', 
//         'production_staff',
//         'conference_manager'
//     ];

//     if (authorizedRoles.includes(normalizedRole)) {
//         return children;
//     }

//     return <Navigate to="/unauthorized" replace />;
// };

// const ScrollToTop = () => {
//     const { pathname } = useLocation();
//     useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
//     return null;
// };

// const UnauthorizedPage = () => (
//     <div className="min-h-screen flex items-center justify-center text-center p-6 bg-slate-50">
//         <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full">
//             <h1 className="text-3xl font-black text-rose-600 uppercase tracking-tight">Access Restricted</h1>
//             <p className="mt-3 text-slate-500 text-sm leading-relaxed">
//                 Your current account role does not have authorization to access this management area.
//             </p>
//             <Link to="/" className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition-all shadow-md">
//                 Return to Homepage
//             </Link>
//         </div>
//     </div>
// );

// // ===================================================================================
// // MAIN APP COMPONENT
// // ===================================================================================

// const App = () => {
//     return (
//         <>
//             <ToastContainer
//                 position="top-right"
//                 autoClose={4000}
//                 hideProgressBar={false}
//                 newestOnTop
//                 closeOnClick
//                 pauseOnHover
//                 theme="colored"
//             />
//             <ScrollToTop />

//             <Routes>
//                 <Route path="/" element={<Layout />}>
//                     {/* --- Public Routes --- */}
//                     <Route index element={<HomePage />} />
//                     <Route path="about" element={<AboutUsPage />} />
//                     <Route path="news" element={<NewsPage />} />
//                     <Route path="news/:newsId" element={<NewsDetailPage />} />
//                     <Route path="conferences" element={<ConferencesPage />} />
//                     <Route path="conferences/:conferenceId" element={<ConferenceDetailsPage />} />
//                     <Route path="membership" element={<MembershipPage />} />
//                     <Route path="resources" element={<ResourcesPage />} />
//                     <Route path="contact" element={<ContactPage />} />
//                     <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
//                     <Route path="terms-of-service" element={<TermsOfServicePage />} />
//                     <Route path="olympiad" element={<OlympiadPage />} />
//                     <Route path="journals" element={<JournalPage />} />
//                     <Route path="journals/articles/:paperId" element={<ArticleDetailPage />} />
//                     <Route path="journals/edition/:editionId" element={<JournalEditionDetailPage />} />

//                     {/* --- Authentication Routes --- */}
//                     <Route path="login" element={<LoginPage />} />
//                     <Route path="register" element={<RegisterPage />} />
//                     <Route path="forgot-password" element={<ForgotPasswordPage />} />
//                     <Route path="reset-password/:token" element={<ResetPasswordPage />} />

//                     {/* --- Member & Author Protected Routes --- */}
//                     <Route path="members-dashboard" element={<ProtectedRoute><MembersDashboard /></ProtectedRoute>} />
//                     <Route path="submit-paper" element={<SubmitPaperPage />} />
//                     <Route path="submit-journal-paper" element={<SubmissionGatewayPage />} />
//                     <Route path="jempa-portal" element={<ProtectedRoute><JempaPortalPage /></ProtectedRoute>} />

//                     {/* --- Editorial & Admin Management Routes --- */}
//                     <Route path="admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
//                     <Route path="admin/conferences" element={<AdminRoute><AdminConferenceDashboard /></AdminRoute>} />
//                     <Route path="admin/conference-papers/:conferenceId" element={<AdminRoute><AdminConferencePapersPage /></AdminRoute>} />
//                     <Route path="admin/journal-compiler" element={<AdminRoute><JournalCompilerPage /></AdminRoute>} />
//                     <Route path="admin/manage-editions" element={<AdminRoute><ManageEditionsPage /></AdminRoute>} />

//                     {/* --- System Routes --- */}
//                     <Route path="unauthorized" element={<UnauthorizedPage />} />
//                     <Route path="*" element={<div className="text-center py-20 text-3xl font-bold text-slate-700">404: Page Not Found</div>} />
//                 </Route>
//             </Routes>
//         </>
//     );
// };

// export default App;











// // import React, { useEffect, useContext } from 'react';
// // import { Routes, Route, useNavigate, Navigate, Link, useLocation } from 'react-router-dom';
// // import { ToastContainer } from 'react-toastify';
// // import 'react-toastify/dist/ReactToastify.css';

// // // --- Layout & Global Components ---
// // import EMPANavbar from './components/common/EMPANavbar.js';
// // import Footer from './components/common/Footer.js';
// // import Layout from './components/layout/Layout';

// // // --- Page Components ---
// // import HomePage from './components/pages/HomePage.js';
// // import AboutUsPage from './components/pages/AboutUsPage.js';
// // import NewsPage from './components/pages/news/NewsPage.js';
// // import NewsDetailPage from './components/pages/news/NewsDetailPage.js';
// // import ConferencesPage from './components/pages/conferences/ConferencesPage.js';
// // import ConferenceDetailsPage from './components/pages/conferences/ConferenceDetailsPage.js';
// // import MembershipPage from './components/pages/membership/MembershipPage.js';
// // import ResourcesPage from './components/pages/ResourcesPage.js';
// // import ContactPage from './components/pages/ContactPage.js';
// // import JournalPage from './components/pages/JournalPage.js';
// // import OlympiadPage from './components/pages/olympiad/OlympiadPage.js';

// // // --- Auth & User Pages ---
// // import RegisterPage from './components/user/SignupPage.js';
// // import LoginPage from './components/user/LoginPage.js';
// // import ResetPasswordPage from './components/pages/auth/ResetPasswordPage.js';
// // import ForgotPasswordPage from './components/pages/auth/ForgotPasswordPage.js';

// // // --- Protected Dashboards & Pages ---
// // import AdminDashboard from './components/user/AdminDashboard.js';
// // import MembersDashboard from './components/user/MembersDashboard.js';
// // import SubmitPaperPage from './components/pages/conferences/SubmitPaperPage';
// // import JempaPortalPage from './components/pages/journal/JempaPortalPage.js';
// // import SubmissionGatewayPage from './components/pages/journal/SubmissionGatewayPage';
// // import JournalEditionDetailPage from './components/pages/journal/JournalEditionDetailPage';
// // import JournalCompilerPage from './components/pages/journal/Editor/JournalCompilerPage';
// // import ManageEditionsPage from './components/pages/journal/Editor/ManageEditionsPage';
// // import ArticleDetailPage from './components/pages/journal/ArticleDetailPage';

// // // --- Admin Conference Management Pages ---
// // import AdminConferenceDashboard from './components/pages/conferences/AdminConferenceDashboard';
// // import AdminConferencePapersPage from './components/pages/conferences/AdminConferencePapersPage';

// // // --- System Pages ---
// // import PrivacyPolicyPage from './components/layout/PrivacyPolicyPage.js';
// // import TermsOfServicePage from './components/layout/TermsOfServicePage.js';

// // // --- AUTH CONTEXT IMPORT ---
// // // We only import it. We do NOT redefine it here.
// // import { AuthContext } from './context/AuthContext.js';

// // // ===================================================================================
// // // ROUTING UTILITIES
// // // ===================================================================================

// // const ProtectedRoute = ({ children }) => {
// //     const { isLoggedIn, isAuthReady } = useContext(AuthContext);
// //     const location = useLocation();
    
// //     if (!isAuthReady) {
// //         return <div className="min-h-screen flex items-center justify-center text-xl">Authenticating...</div>;
// //     }
    
// //     return isLoggedIn ? children : <Navigate to="/login" state={{ from: location }} replace />;
// // };

// // const AdminRoute = ({ children }) => {
// //     const { isLoggedIn, userRole, isAuthReady } = useContext(AuthContext);
// //     const location = useLocation();

// //     if (!isAuthReady) {
// //         return <div className="min-h-screen flex items-center justify-center text-xl">Authenticating...</div>;
// //     }

// //     // DEBUG: Open your browser console (F12) to see what this outputs
// //     console.log("AdminRoute Check:", { isLoggedIn, userRole });

// //     if (!isLoggedIn) {
// //         return <Navigate to="/login" state={{ from: location }} replace />;
// //     }

// //     // Normalize role and check against allowed list
// //     const normalizedRole = userRole?.toLowerCase();
// //     const authorizedRoles = ['admin', 'editor', 'managing_editor', 'eic', 'editor_in_chief', 'production', 'conference_manager'];

// //     if (authorizedRoles.includes(normalizedRole)) {
// //         return children;
// //     }

// //     // If logged in but not authorized
// //     return <Navigate to="/unauthorized" replace />;
// // };

// // const ScrollToTop = () => {
// //     const { pathname } = useLocation();
// //     useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
// //     return null;
// // };

// // const UnauthorizedPage = () => (
// //     <div className="min-h-screen flex items-center justify-center text-center p-4">
// //         <div>
// //             <h1 className="text-4xl font-bold text-red-600">Access Denied</h1>
// //             <p className="mt-4 text-lg">You do not have permission to view this page.</p>
// //             <Link to="/" className="mt-6 inline-block bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Go to Homepage</Link>
// //         </div>
// //     </div>
// // );

// // // ===================================================================================
// // // MAIN APP COMPONENT
// // // ===================================================================================

// // const App = () => {
// //     return (
// //         <>
// //             <ToastContainer
// //                 position="top-right"
// //                 autoClose={5000}
// //                 hideProgressBar={false}
// //                 newestOnTop={false}
// //                 closeOnClick
// //                 theme="colored"
// //             />
// //             <ScrollToTop />

// //             <Routes>
// //                 <Route path="/" element={<Layout />}>
// //                     {/* --- Public Routes --- */}
// //                     <Route index element={<HomePage />} />
// //                     <Route path="about" element={<AboutUsPage />} />
// //                     <Route path="news" element={<NewsPage />} />
// //                     <Route path="news/:newsId" element={<NewsDetailPage />} />
// //                     <Route path="conferences" element={<ConferencesPage />} />
// //                     <Route path="conferences/:conferenceId" element={<ConferenceDetailsPage />} />
// //                     <Route path="membership" element={<MembershipPage />} />
// //                     <Route path="resources" element={<ResourcesPage />} />
// //                     <Route path="contact" element={<ContactPage />} />
// //                     <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
// //                     <Route path="terms-of-service" element={<TermsOfServicePage />} />
// //                     <Route path="olympiad" element={<OlympiadPage />} />
// //                     <Route path="journals" element={<JournalPage />} />
// //                     <Route path="journals/articles/:paperId" element={<ArticleDetailPage />} />
// //                     <Route path="journals/edition/:editionId" element={<JournalEditionDetailPage />} />

// //                     {/* --- Authentication Routes --- */}
// //                     <Route path="login" element={<LoginPage />} />
// //                     <Route path="register" element={<RegisterPage />} />
// //                     <Route path="forgot-password" element={<ForgotPasswordPage />} />
// //                     <Route path="reset-password/:token" element={<ResetPasswordPage />} />

// //                     {/* --- Member & Author Protected Routes --- */}
// //                     <Route path="members-dashboard" element={<ProtectedRoute><MembersDashboard /></ProtectedRoute>} />
// //                     <Route path="submit-paper" element={<SubmitPaperPage />} />
// //                     <Route path="submit-journal-paper" element={<SubmissionGatewayPage />} />
// //                     <Route path="jempa-portal" element={<ProtectedRoute><JempaPortalPage /></ProtectedRoute>} />

// //                     {/* --- Admin-Only Protected Routes --- */}
// //                     <Route path="admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
// //                     <Route path="admin/conferences" element={<AdminRoute><AdminConferenceDashboard /></AdminRoute>} />
// //                     <Route path="admin/conference-papers/:conferenceId" element={<AdminRoute><AdminConferencePapersPage /></AdminRoute>} />
// //                     <Route path="admin/journal-compiler" element={<AdminRoute><JournalCompilerPage /></AdminRoute>} />

// //                     <Route path="/admin/manage-editions" element={<AdminRoute><ManageEditionsPage /></AdminRoute>} 
// // />

// //                     {/* --- System Routes --- */}
// //                     <Route path="unauthorized" element={<UnauthorizedPage />} />
// //                     <Route path="*" element={<div className="text-center py-20 text-3xl font-bold">404: Page Not Found</div>} />
// //                 </Route>
// //             </Routes>
// //         </>
// //     );
// // };

// // export default App;



import React, { useEffect, useContext } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- Layout & Global Components ---
import Layout from './components/layout/Layout';

// --- Page Components ---
import HomePage from './components/pages/HomePage.js';
import AboutUsPage from './components/pages/AboutUsPage.js';
import NewsPage from './components/pages/news/NewsPage.js';
import NewsDetailPage from './components/pages/news/NewsDetailPage.js';
import ConferencesPage from './components/pages/conferences/ConferencesPage.js';
import ConferenceDetailsPage from './components/pages/conferences/ConferenceDetailsPage.js';
import MembershipPage from './components/pages/membership/MembershipPage.js';
import ResourcesPage from './components/pages/ResourcesPage.js';
import ContactPage from './components/pages/ContactPage.js';
import JournalPage from './components/pages/JournalPage.js';
import OlympiadPage from './components/pages/olympiad/OlympiadPage.js';

// --- Auth & User Pages ---
import RegisterPage from './components/user/SignupPage.js';
import LoginPage from './components/user/LoginPage.js';
import ResetPasswordPage from './components/pages/auth/ResetPasswordPage.js';
import ForgotPasswordPage from './components/pages/auth/ForgotPasswordPage.js';

// --- Protected Dashboards & Pages ---
import AdminDashboard from './components/user/AdminDashboard.js';
import MembersDashboard from './components/user/MembersDashboard.js';
import SubmitPaperPage from './components/pages/conferences/SubmitPaperPage';
import JempaPortalPage from './components/pages/journal/JempaPortalPage.js';
import SubmissionGatewayPage from './components/pages/journal/SubmissionGatewayPage';
import JournalEditionDetailPage from './components/pages/journal/JournalEditionDetailPage';
import JournalCompilerPage from './components/pages/journal/Editor/JournalCompilerPage';
import ManageEditionsPage from './components/pages/journal/Editor/ManageEditionsPage';
import ArticleDetailPage from './components/pages/journal/ArticleDetailPage';

// --- Conference Management & Workspaces ---
import ConferenceAuthorDashboard from './components/pages/conferences/ConferenceAuthorDashboard';
import ConferenceReviewerDashboard from './components/pages/conferences/ConferenceReviewerDashboard';
import ConferenceManagerDashboard from './components/pages/conferences/ConferenceManagerDashboard';
import AdminConferenceDashboard from './components/pages/conferences/AdminConferenceDashboard';
import AdminConferencePapersPage from './components/pages/conferences/AdminConferencePapersPage';

// --- System Pages ---
import PrivacyPolicyPage from './components/layout/PrivacyPolicyPage.js';
import TermsOfServicePage from './components/layout/TermsOfServicePage.js';

// --- AUTH CONTEXT IMPORT ---
import { AuthContext } from './context/AuthContext.js';

// ===================================================================================
// ROUTING UTILITIES
// ===================================================================================

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isLoggedIn, userRole, isAuthReady } = useContext(AuthContext);
    const location = useLocation();
    
    if (!isAuthReady) {
        return (
            <div className="min-h-screen flex items-center justify-center text-slate-500 font-bold">
                Authenticating session...
            </div>
        );
    }
    
    if (!isLoggedIn) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Role verification (if allowedRoles is supplied)
    if (allowedRoles && allowedRoles.length > 0) {
        const normalizedRole = userRole?.toLowerCase().trim();
        const hasAccess = normalizedRole === 'admin' || allowedRoles.map(r => r.toLowerCase().trim()).includes(normalizedRole);
        if (!hasAccess) {
            return <Navigate to="/unauthorized" replace />;
        }
    }
    
    return children;
};

const AdminRoute = ({ children }) => {
    const { isLoggedIn, userRole, isAuthReady } = useContext(AuthContext);
    const location = useLocation();

    if (!isAuthReady) {
        return (
            <div className="min-h-screen flex items-center justify-center text-slate-500 font-bold">
                Authenticating session...
            </div>
        );
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const normalizedRole = userRole?.toLowerCase().trim();
    const authorizedRoles = [
        'admin', 
        'editor', 
        'managing_editor', 
        'eic', 
        'editor_in_chief', 
        'production', 
        'production_staff',
        'conference_manager'
    ];

    if (authorizedRoles.includes(normalizedRole)) {
        return children;
    }

    return <Navigate to="/unauthorized" replace />;
};

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    return null;
};

const UnauthorizedPage = () => (
    <div className="min-h-screen flex items-center justify-center text-center p-6 bg-slate-50 font-sans">
        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full">
            <h1 className="text-3xl font-black text-rose-600 uppercase tracking-tight">Access Restricted</h1>
            <p className="mt-3 text-slate-500 text-sm leading-relaxed">
                Your current account role does not have authorization to access this management area.
            </p>
            <Link to="/" className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition-all shadow-md">
                Return to Homepage
            </Link>
        </div>
    </div>
);

// ===================================================================================
// MAIN APP COMPONENT
// ===================================================================================

const App = () => {
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                theme="colored"
            />
            <ScrollToTop />

            <Routes>
                <Route path="/" element={<Layout />}>
                    {/* --- Public Routes --- */}
                    <Route index element={<HomePage />} />
                    <Route path="about" element={<AboutUsPage />} />
                    <Route path="news" element={<NewsPage />} />
                    <Route path="news/:newsId" element={<NewsDetailPage />} />
                    <Route path="conferences" element={<ConferencesPage />} />
                    <Route path="conferences/:conferenceId" element={<ConferenceDetailsPage />} />
                    <Route path="membership" element={<MembershipPage />} />
                    <Route path="resources" element={<ResourcesPage />} />
                    <Route path="contact" element={<ContactPage />} />
                    <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="terms-of-service" element={<TermsOfServicePage />} />
                    <Route path="olympiad" element={<OlympiadPage />} />
                    <Route path="journals" element={<JournalPage />} />
                    <Route path="journals/articles/:paperId" element={<ArticleDetailPage />} />
                    <Route path="journals/edition/:editionId" element={<JournalEditionDetailPage />} />

                    {/* --- Authentication Routes --- */}
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                    <Route path="forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="reset-password/:token" element={<ResetPasswordPage />} />

                    {/* --- Member & Author Protected Routes --- */}
                    <Route path="members-dashboard" element={<ProtectedRoute><MembersDashboard /></ProtectedRoute>} />
                    <Route path="submit-paper" element={<SubmitPaperPage />} />
                    <Route path="submit-journal-paper" element={<SubmissionGatewayPage />} />
                    <Route path="jempa-portal" element={<ProtectedRoute><JempaPortalPage /></ProtectedRoute>} />

                    {/* --- New Conference Workspaces --- */}
                    <Route 
                         path="conferences/author/dashboard" 
                            element={
                                <ProtectedRoute>
                                    <ConferenceAuthorDashboard />
                                </ProtectedRoute>
                            } 
                    />
                    <Route 
                        path="conferences/reviewer/dashboard" 
                        element={
                            <ProtectedRoute>
                                <ConferenceReviewerDashboard />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="conferences/manager/dashboard" 
                        element={
                            <ProtectedRoute allowedRoles={['conference_manager', 'admin']}>
                                <ConferenceManagerDashboard />
                            </ProtectedRoute>
                        } 
                    />

                    {/* --- Editorial & Admin Management Routes --- */}
                    <Route path="admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                    <Route path="admin/conferences" element={<AdminRoute><AdminConferenceDashboard /></AdminRoute>} />
                    <Route path="admin/conference-papers/:conferenceId" element={<AdminRoute><AdminConferencePapersPage /></AdminRoute>} />
                    <Route path="admin/journal-compiler" element={<AdminRoute><JournalCompilerPage /></AdminRoute>} />
                    <Route path="admin/manage-editions" element={<AdminRoute><ManageEditionsPage /></AdminRoute>} />

                    {/* --- System Routes --- */}
                    <Route path="unauthorized" element={<UnauthorizedPage />} />
                    <Route path="*" element={<div className="text-center py-20 text-3xl font-bold text-slate-700">404: Page Not Found</div>} />
                </Route>
            </Routes>
        </>
    );
};

export default App;