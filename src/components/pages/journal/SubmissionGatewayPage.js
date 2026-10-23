
// // src/components/pages/journal/SubmissionGatewayPage.js
// import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { AuthContext } from '../../../context/AuthContext';
// import { API_BASE_URL } from '../../../utils/constants';
// import PrimaryButton from '../../common/PrimaryButton';
// import { LogIn, UserPlus, CheckCircle2, ShieldAlert, Eye, EyeOff } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// const SubmissionGatewayPage = () => {
//     const { handleLogin, isLoggedIn } = useContext(AuthContext);
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const [showRegisterForm, setShowRegisterForm] = useState(false);
//     const navigate = useNavigate();

//     // Form States
//     const [fullName, setFullName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [isSuccess, setIsSuccess] = useState(false);

//     useEffect(() => {
//         if (isLoggedIn) {
//             navigate('/jempa-portal');
//         }
//     }, [isLoggedIn, navigate]);

//     // Password Strength Validator
//     const isPasswordStrong = (pw) => {
//         const minLength = 8;
//         const hasUpperCase = /[A-Z]/.test(pw);
//         const hasNumber = /[0-9]/.test(pw);

//         if (pw.length < minLength) return "Password must be at least 8 characters long.";
//         if (!hasUpperCase) return "Password must contain at least one uppercase letter.";
//         if (!hasNumber) return "Password must contain at least one number.";
//         return null; // Null means no error, password is strong
//     };

//     const handleRegisterAndLogin = async (e) => {
//         e.preventDefault();
//         setError('');
//         setIsSuccess(false);

//         // 1. Check if passwords match
//         if (password !== confirmPassword) {
//             setError('Passwords do not match.');
//             return;
//         }

//         // 2. Check password strength
//         const strengthError = isPasswordStrong(password);
//         if (strengthError) {
//             setError(strengthError);
//             return;
//         }

//         setIsLoading(true);
//         try {
//             const response = await axios.post(`${API_BASE_URL}/external-authors/register-and-login`, {
//                 full_name: fullName,
//                 email,
//                 password,
//             });

//             setIsSuccess(true);

//             setTimeout(() => {
//                 handleLogin(
//                     response.data.authToken,
//                     response.data.data.role,
//                     response.data.data.full_name
//                 );
//                 navigate('/jempa-portal');
//             }, 2000);

//         } catch (err) {
//             setError(err.response?.data?.message || 'Registration failed. Please try again.');
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="bg-gray-100 min-h-screen py-20">
//             <div className="max-w-4xl mx-auto px-4 text-center">
//                 <h1 className="text-4xl font-extrabold text-blue-900">JEMPA Submission</h1>
//                 <p className="mt-4 text-lg text-gray-600">Please choose your submission path.</p>
//             </div>

//             <div className="mt-12 max-w-4xl mx-auto grid md:grid-cols-2 gap-8 px-4">

//                 <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 flex flex-col items-center text-center h-full">
//                     <div className="bg-blue-100 p-4 rounded-full">
//                         <LogIn className="h-8 w-8 text-blue-600" />
//                     </div>
//                     <h2 className="text-2xl font-bold text-blue-900 mt-4">JEMPA Portal Login</h2>
//                     <p className="mt-2 text-gray-600 flex-grow">
//                         For <strong>EMPA Member</strong>, registered authors, and reviewers. Log in to track your
//                         submitted manuscripts, access the peer-review system, or start a new submission
//                         using your existing credentials.
//                     </p>
//                     <PrimaryButton
//                         onClick={() => navigate('/login', {
//                             state: {
//                                 from: { pathname: '/jempa-portal' },
//                                 message: 'Please log in to access the JEMPA submission portal.'
//                             }
//                         })}
//                         className="mt-6 w-full"
//                     >
//                         Login to Portal
//                     </PrimaryButton>
//                 </div>

//                 {/* --- PATH 2: NEW NON-MEMBER AUTHORS --- */}
//                 <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 flex flex-col items-center text-center min-h-[500px]">
//                     <div className="bg-green-100 p-4 rounded-full">
//                         <UserPlus className="h-8 w-8 text-green-600" />
//                     </div>
//                     <h2 className="text-2xl font-bold text-green-800 mt-4">New to JEMPA?</h2>
//                     <p className="mt-2 text-gray-600 mb-4 flex-grow">
//                         If you are <strong>not a member</strong> of EMPA and have never submitted to JEMPA before,
//                         please create a dedicated author account. This will allow you to submit your
//                         research and follow the review process.
//                     </p>

//                     <AnimatePresence mode="wait">
//                         {isSuccess ? (
//                             <motion.div
//                                 key="success"
//                                 initial={{ opacity: 0, scale: 0.9 }}
//                                 animate={{ opacity: 1, scale: 1 }}
//                                 className="w-full bg-green-50 p-6 rounded-lg border border-green-200 flex flex-col items-center"
//                             >
//                                 <CheckCircle2 className="w-12 h-12 text-green-600 mb-2" />
//                                 <h3 className="text-lg font-bold text-green-900">Registration Successful!</h3>
//                                 <p className="text-sm text-green-700">Connecting you to the portal...</p>
//                             </motion.div>
//                         ) : !showRegisterForm ? (
//                             <motion.div
//                                 key="initial-button"
//                                 initial={{ opacity: 0 }}
//                                 animate={{ opacity: 1 }}
//                                 exit={{ opacity: 0 }}
//                                 className="w-full"
//                             >
//                                 <PrimaryButton
//                                     onClick={() => setShowRegisterForm(true)}
//                                     className="mt-6 w-full bg-green-600 hover:bg-green-700"
//                                 >
//                                     Register as an Author
//                                 </PrimaryButton>
//                             </motion.div>
//                         ) : (
//                             <motion.form
//                                 key="reg-form"
//                                 onSubmit={handleRegisterAndLogin}
//                                 className="mt-6 w-full text-left space-y-3"
//                                 initial={{ opacity: 0, y: 10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 exit={{ opacity: 0, y: -10 }}
//                             >
//                                 {error && (
//                                     <div className="bg-red-50 border border-red-200 p-3 rounded flex items-start gap-2 text-red-700 text-xs">
//                                         <ShieldAlert className="w-4 h-4 flex-shrink-0" />
//                                         <span>{error}</span>
//                                     </div>
//                                 )}
//                                 <div>
//                                     <label className="text-[10px] font-bold uppercase text-gray-400">Full Name</label>
//                                     <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required className="w-full p-2 border rounded-md mt-1 outline-none focus:border-green-500" />
//                                 </div>
//                                 <div>
//                                     <label className="text-[10px] font-bold uppercase text-gray-400">Email</label>
//                                     <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-2 border rounded-md mt-1 outline-none focus:border-green-500" />
//                                 </div>
//                                 {/* <div className="grid grid-cols-2 gap-2">
//                                     <div>
//                                         <label className="text-[10px] font-bold uppercase text-gray-400">Password</label>
//                                         <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-2 border rounded-md mt-1 outline-none focus:border-green-500" />
//                                     </div>
//                                     <div>
//                                         <label className="text-[10px] font-bold uppercase text-gray-400">Confirm</label>
//                                         <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full p-2 border rounded-md mt-1 outline-none focus:border-green-500" />
//                                     </div>
//                                 </div> */}
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                                     {/* Password Field */}
//                                     <div>
//                                         <label className="text-[10px] font-bold uppercase text-slate-500">Password</label>
//                                         <div className="relative mt-1">
//                                             <input
//                                                 type={showPassword ? "text" : "password"}
//                                                 value={password}
//                                                 onChange={e => setPassword(e.target.value)}
//                                                 required
//                                                 placeholder="Enter password"
//                                                 className="w-full pr-10 pl-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
//                                             />
//                                             <button
//                                                 type="button"
//                                                 onClick={() => setShowPassword(!showPassword)}
//                                                 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
//                                                 tabIndex={-1}
//                                             >
//                                                 {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//                                             </button>
//                                         </div>
//                                     </div>

//                                     {/* Confirm Password Field */}
//                                     <div>
//                                         <label className="text-[10px] font-bold uppercase text-slate-500">Confirm Password</label>
//                                         <div className="relative mt-1">
//                                             <input
//                                                 type={showConfirmPassword ? "text" : "password"}
//                                                 value={confirmPassword}
//                                                 onChange={e => setConfirmPassword(e.target.value)}
//                                                 required
//                                                 placeholder="Confirm password"
//                                                 className="w-full pr-10 pl-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
//                                             />
//                                             <button
//                                                 type="button"
//                                                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                                                 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
//                                                 tabIndex={-1}
//                                             >
//                                                 {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <p className="text-[9px] text-gray-400 leading-tight">
//                                     Requires 8+ characters, one uppercase letter, and one number.
//                                 </p>
//                                 <PrimaryButton type="submit" disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700 !shadow-none">
//                                     {isLoading ? "Validating..." : "Register & Continue"}
//                                 </PrimaryButton>
//                                 <button type="button" onClick={() => setShowRegisterForm(false)} className="w-full text-center text-xs text-gray-400 mt-2 hover:text-gray-600">
//                                     Go Back
//                                 </button>
//                             </motion.form>
//                         )}
//                     </AnimatePresence>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SubmissionGatewayPage;


// src/components/pages/journal/SubmissionGatewayPage.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { API_BASE_URL } from '../../../utils/constants';
import PrimaryButton from '../../common/PrimaryButton';
import { LogIn, UserPlus, CheckCircle2, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SubmissionGatewayPage = () => {
    const { handleLogin, isLoggedIn } = useContext(AuthContext);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const navigate = useNavigate();

    // Form States
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/jempa-portal');
        }
    }, [isLoggedIn, navigate]);

    // Password Strength Validator
    const isPasswordStrong = (pw) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(pw);
        const hasNumber = /[0-9]/.test(pw);

        if (pw.length < minLength) return "Password must be at least 8 characters long.";
        if (!hasUpperCase) return "Password must contain at least one uppercase letter.";
        if (!hasNumber) return "Password must contain at least one number.";
        return null;
    };

    const handleRegisterAndLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsSuccess(false);

        // 1. Check if passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        // 2. Check password strength
        const strengthError = isPasswordStrong(password);
        if (strengthError) {
            setError(strengthError);
            return;
        }

        setIsLoading(true);
        try {
            // ---> UPDATED TO UNIFIED MEMBERS ENDPOINT <---
            // Saves author into the `members` table with role='author'
            const response = await axios.post(`${API_BASE_URL}/members/register-external-author`, {
                full_name: fullName,
                email,
                password,
            });

            setIsSuccess(true);

            setTimeout(() => {
                handleLogin(
                    response.data.authToken,
                    response.data.data.role,
                    response.data.data.full_name,
                    response.data.data.email
                );
                navigate('/jempa-portal');
            }, 1800);

        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen py-20 font-sans">
            <div className="max-w-4xl mx-auto px-4 text-center">
                <h1 className="text-4xl font-extrabold text-blue-900">JEMPA Submission Gateway</h1>
                <p className="mt-4 text-lg text-gray-600">Please choose your access route to submit or manage manuscripts.</p>
            </div>

            <div className="mt-12 max-w-4xl mx-auto grid md:grid-cols-2 gap-8 px-4">

                {/* PATH 1: EXISTING USERS / MEMBERS */}
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 flex flex-col items-center text-center h-full">
                    <div className="bg-blue-100 p-4 rounded-2xl">
                        <LogIn className="h-8 w-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-blue-900 mt-4">JEMPA Portal Login</h2>
                    <p className="mt-2 text-gray-600 flex-grow text-sm leading-relaxed">
                        For <strong>EMPA Members</strong>, registered authors, and reviewers. Log in to track your
                        submitted manuscripts, access peer reviews, or submit a new paper
                        using your existing credentials.
                    </p>
                    <PrimaryButton
                        onClick={() => navigate('/login', {
                            state: {
                                from: { pathname: '/jempa-portal' },
                                message: 'Please log in to access the JEMPA submission portal.'
                            }
                        })}
                        className="mt-6 w-full justify-center"
                    >
                        Login to Portal
                    </PrimaryButton>
                </div>

                {/* PATH 2: NEW EXTERNAL AUTHORS */}
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 flex flex-col items-center text-center min-h-[500px]">
                    <div className="bg-emerald-100 p-4 rounded-2xl">
                        <UserPlus className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-emerald-900 mt-4">New to JEMPA?</h2>
                    <p className="mt-2 text-gray-600 mb-4 flex-grow text-sm leading-relaxed">
                        If you are <strong>not an EMPA member</strong> and haven't published with us before,
                        create a free author profile in our association directory to submit your
                        manuscripts and track reviews.
                    </p>

                    <AnimatePresence mode="wait">
                        {isSuccess ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-full bg-emerald-50 p-6 rounded-2xl border border-emerald-200 flex flex-col items-center"
                            >
                                <CheckCircle2 className="w-12 h-12 text-emerald-600 mb-2" />
                                <h3 className="text-lg font-bold text-emerald-900">Registration Successful!</h3>
                                <p className="text-xs text-emerald-700 mt-1">Connecting to your author workspace...</p>
                            </motion.div>
                        ) : !showRegisterForm ? (
                            <motion.div
                                key="initial-button"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-full"
                            >
                                <PrimaryButton
                                    onClick={() => setShowRegisterForm(true)}
                                    className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 justify-center"
                                >
                                    Register as an Author
                                </PrimaryButton>
                            </motion.div>
                        ) : (
                            <motion.form
                                key="reg-form"
                                onSubmit={handleRegisterAndLogin}
                                className="mt-6 w-full text-left space-y-4"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                {error && (
                                    <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl flex items-start gap-2 text-rose-700 text-xs font-semibold">
                                        <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                        <span>{error}</span>
                                    </div>
                                )}
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Full Name</label>
                                    <input 
                                        type="text" 
                                        value={fullName} 
                                        onChange={e => setFullName(e.target.value)} 
                                        required 
                                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1 text-xs outline-none focus:ring-2 focus:ring-emerald-500" 
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Email Address</label>
                                    <input 
                                        type="email" 
                                        value={email} 
                                        onChange={e => setEmail(e.target.value)} 
                                        required 
                                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1 text-xs outline-none focus:ring-2 focus:ring-emerald-500" 
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-slate-400">Password</label>
                                        <div className="relative mt-1">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                required
                                                placeholder="••••••••"
                                                className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                                tabIndex={-1}
                                            >
                                                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-slate-400">Confirm Password</label>
                                        <div className="relative mt-1">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={confirmPassword}
                                                onChange={e => setConfirmPassword(e.target.value)}
                                                required
                                                placeholder="••••••••"
                                                className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                                tabIndex={-1}
                                            >
                                                {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-[10px] text-slate-400 leading-tight">
                                    Password must have 8+ characters, one uppercase letter, and one number.
                                </p>

                                <PrimaryButton 
                                    type="submit" 
                                    disabled={isLoading} 
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 justify-center shadow-md shadow-emerald-600/20"
                                >
                                    {isLoading ? "Validating Account..." : "Register & Continue"}
                                </PrimaryButton>

                                <button 
                                    type="button" 
                                    onClick={() => setShowRegisterForm(false)} 
                                    className="w-full text-center text-xs text-slate-400 hover:text-slate-600 mt-2 block"
                                >
                                    Cancel & Return
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default SubmissionGatewayPage; 