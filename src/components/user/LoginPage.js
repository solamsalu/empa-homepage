
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { API_BASE_URL } from '../../utils/constants';
import { AlertCircle, CheckCircle, Mail, KeyRound } from 'lucide-react'; // For better feedback icons

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // State to control the contextual password reset prompt
    const [showResetPrompt, setShowResetPrompt] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    const { handleLogin, isLoggedIn, isAuthReady } = useContext(AuthContext);


    const from = location.state?.from?.pathname || "/";

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthReady && isLoggedIn) {
            navigate(from, { replace: true });
        }
    }, [isAuthReady, isLoggedIn, navigate, from]);

    // --- Login Form Submission Handler ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Reset states on new submission
        setError('');
        setSuccess('');
        setShowResetPrompt(false);
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/members/login`, { email, password });
            const { token, data: memberData } = response.data;
            handleLogin(token, memberData.role, memberData.full_name, memberData.email);
            // navigate('/'); // Navigate immediately on success
            navigate(from, { replace: true });
        } catch (err) {
            const message = err.response?.data?.message || 'An unknown login error occurred.';
            const status = err.response?.status;
            
            if (status === 401) {
                // For "Invalid Credentials", show the specific error and the reset prompt
                setError('Login failed: Invalid email or password.');
                setShowResetPrompt(true);
            } else {
                // For other errors (pending approval, etc.), just show the message
                setError(message);
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    // --- Handler for the "Send Reset Link" button within the prompt ---
    const handleRequestResetLink = async () => {
        setIsLoading(true);
        setError('');
        setSuccess('');
        try {
            await axios.post(`${API_BASE_URL}/members/forgotpassword`, { email });
            setSuccess('If an account with that email exists, a password reset link has been sent.');
            setShowResetPrompt(false); // Hide the prompt after success
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset link. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthReady) {
        return <div className="flex items-center justify-center min-h-screen">Loading authentication...</div>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
                <h2 className="text-3xl font-extrabold text-center text-indigo-900 mb-2">Welcome Back</h2>
                <p className="text-center text-gray-600 mb-8">Sign in to your EMPA account.</p>

                {/* --- Refined Message Display --- */}
                {success && <div className="flex items-center gap-3 bg-green-100 text-green-800 p-3 rounded-lg mb-6"><CheckCircle size={20} />{success}</div>}
                {error && <div className="flex items-center gap-3 bg-red-100 text-red-700 p-3 rounded-lg mb-6"><AlertCircle size={20} />{error}</div>}

                {/* --- 1. CONTEXTUAL FORGOT PASSWORD PROMPT --- */}
                {showResetPrompt && (
                    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-lg" role="alert">
                        <p className="font-bold text-amber-800">Password Incorrect?</p>
                        <p className="text-sm text-amber-700 mt-1">You can try again or we can send you a password reset link.</p>
                        <button
                            onClick={handleRequestResetLink}
                            disabled={isLoading}
                            className="mt-3 w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-md transition-all disabled:bg-amber-300"
                        >
                            <Mail size={16} />
                            {isLoading ? 'Sending...' : 'Send Reset Link to this Email'}
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input type="email" id="email" className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" id="password" className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white p-3 rounded-md font-semibold hover:bg-indigo-700 disabled:bg-indigo-400" disabled={isLoading}>
                        <KeyRound size={18} />
                        {isLoading ? 'Logging In...' : 'Login'}
                    </button>
                </form>

                <div className="text-center text-sm mt-6">
                    <Link to="/forgot-password" className="text-indigo-600 hover:underline">Forgot password?</Link>
                    <span className="mx-2 text-gray-400">|</span>
                    <Link to="/register" className="text-indigo-600 hover:underline">Create an account</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;













// import React, { useState, useContext, useEffect } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import { AuthContext } from '../../context/AuthContext';
// import { API_BASE_URL } from '../../utils/constants';
// import { AlertCircle, CheckCircle, Mail, KeyRound } from 'lucide-react';

// const LoginPage = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [showResetPrompt, setShowResetPrompt] = useState(false);
    
//     const navigate = useNavigate();
//     const location = useLocation();
    
//     // --- FIX: Extract userRole from context to use in automatic redirection ---
//     const { handleLogin, isLoggedIn, isAuthReady, userRole } = useContext(AuthContext);

//     // Redirect logic for users already logged in
//     useEffect(() => {
//         if (isAuthReady && isLoggedIn) {
//             // 1. If the user was trying to reach a specific protected page (e.g. /submit-paper), take them there.
//             if (location.state?.from) {
//                 navigate(location.state.from.pathname, { replace: true });
//             } else {
//                 // 2. Otherwise, use ROLE-BASED redirection
//                 const role = userRole?.toLowerCase().trim();
                
//                 if (role === 'conference_manager') {
//                     navigate('/admin/conferences', { replace: true });
//                 } else if (role === 'admin') {
//                     navigate('/admin-dashboard', { replace: true });
//                 } else {
//                     navigate('/jempa-portal', { replace: true });
//                 }
//             }
//         }
//     }, [isAuthReady, isLoggedIn, navigate, userRole, location.state]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');
//         setSuccess('');
//         setShowResetPrompt(false);
//         setIsLoading(true);

//         try {
//             const response = await axios.post(`${API_BASE_URL}/members/login`, { email, password });
//             const { token, data: memberData } = response.data;
            
//             // Save session to Context
//             handleLogin(token, memberData.role, memberData.full_name, memberData.email);

//             // --- THE FIX: Role-based navigation on successful login ---
//             const role = memberData.role.toLowerCase().trim();

//             if (role === 'conference_manager') {
//                 navigate('/admin/conferences', { replace: true });
//             } else if (role === 'admin') {
//                 navigate('/admin-dashboard', { replace: true });
//             } else {
//                 // Editorial staff, Authors, and standard Members go to JEMPA Portal
//                 navigate('/jempa-portal', { replace: true });
//             }

//         } catch (err) {
//             const message = err.response?.data?.message || 'An unknown login error occurred.';
//             if (err.response?.status === 401) {
//                 setError('Login failed: Invalid email or password.');
//                 setShowResetPrompt(true);
//             } else {
//                 setError(message);
//             }
//         } finally {
//             setIsLoading(false);
//         }
//     };
    
//     const handleRequestResetLink = async () => {
//         setIsLoading(true);
//         setError('');
//         setSuccess('');
//         try {
//             await axios.post(`${API_BASE_URL}/members/forgotpassword`, { email });
//             setSuccess('If an account with that email exists, a password reset link has been sent.');
//             setShowResetPrompt(false); 
//         } catch (err) {
//             setError(err.response?.data?.message || 'Failed to send reset link.');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     if (!isAuthReady) {
//         return <div className="flex items-center justify-center min-h-screen">Loading authentication...</div>;
//     }

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
//             <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
//                 <h2 className="text-3xl font-extrabold text-center text-indigo-900 mb-2">Welcome Back</h2>
//                 <p className="text-center text-gray-600 mb-8">Sign in to your EMPA account.</p>

//                 {success && <div className="flex items-center gap-3 bg-green-100 text-green-800 p-3 rounded-lg mb-6"><CheckCircle size={20} />{success}</div>}
//                 {error && <div className="flex items-center gap-3 bg-red-100 text-red-700 p-3 rounded-lg mb-6"><AlertCircle size={20} />{error}</div>}

//                 {showResetPrompt && (
//                     <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-lg">
//                         <p className="font-bold text-amber-800">Password Incorrect?</p>
//                         <p className="text-sm text-amber-700 mt-1">You can try again or we can send you a password reset link.</p>
//                         <button
//                             onClick={handleRequestResetLink}
//                             disabled={isLoading}
//                             className="mt-3 w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-md transition-all disabled:bg-amber-300"
//                         >
//                             <Mail size={16} />
//                             {isLoading ? 'Sending...' : 'Send Reset Link'}
//                         </button>
//                     </div>
//                 )}

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     <div>
//                         <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
//                         <input type="email" id="email" className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={email} onChange={(e) => setEmail(e.target.value)} required />
//                     </div>
//                     <div>
//                         <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//                         <input type="password" id="password" className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={password} onChange={(e) => setPassword(e.target.value)} required />
//                     </div>
//                     <button type="submit" className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white p-3 rounded-md font-semibold hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors" disabled={isLoading}>
//                         <KeyRound size={18} />
//                         {isLoading ? 'Logging In...' : 'Login'}
//                     </button>
//                 </form>

//                 <div className="text-center text-sm mt-6">
//                     <Link to="/forgot-password" className="text-indigo-600 hover:underline">Forgot password?</Link>
//                     <span className="mx-2 text-gray-400">|</span>
//                     <Link to="/register" className="text-indigo-600 hover:underline">Create an account</Link>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default LoginPage;