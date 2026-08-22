
// src/components/pages/journal/SubmissionGatewayPage.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { API_BASE_URL } from '../../../utils/constants';
import PrimaryButton from '../../common/PrimaryButton';
import { LogIn, UserPlus, CheckCircle2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SubmissionGatewayPage = () => {
    const { handleLogin, isLoggedIn } = useContext(AuthContext);
    const [confirmPassword, setConfirmPassword] = useState('');
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
        return null; // Null means no error, password is strong
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
            const response = await axios.post(`${API_BASE_URL}/external-authors/register-and-login`, {
                full_name: fullName, 
                email, 
                password,
            });

            setIsSuccess(true);

            setTimeout(() => {
                handleLogin(
                    response.data.authToken, 
                    response.data.data.role, 
                    response.data.data.full_name
                );
                navigate('/jempa-portal');
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen py-20">
            <div className="max-w-4xl mx-auto px-4 text-center">
                <h1 className="text-4xl font-extrabold text-blue-900">JEMPA Submission</h1>
                <p className="mt-4 text-lg text-gray-600">Please choose your submission path.</p>
            </div>

            <div className="mt-12 max-w-4xl mx-auto grid md:grid-cols-2 gap-8 px-4">
                
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 flex flex-col items-center text-center h-full">
                    <div className="bg-blue-100 p-4 rounded-full">
                        <LogIn className="h-8 w-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-blue-900 mt-4">JEMPA Portal Login</h2>
                    <p className="mt-2 text-gray-600 flex-grow">
                        For **EMPA Members**, registered authors, and reviewers. Log in to track your 
                        submitted manuscripts, access the peer-review system, or start a new submission 
                        using your existing credentials.
                    </p>
                    <PrimaryButton
                        onClick={() => navigate('/login', {
                            state: {
                                from: { pathname: '/jempa-portal' },
                                message: 'Please log in to access the JEMPA submission portal.'
                            }
                        })}
                        className="mt-6 w-full"
                    >
                        Login to Portal
                    </PrimaryButton>
                </div>

                {/* --- PATH 2: NEW NON-MEMBER AUTHORS --- */}
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 flex flex-col items-center text-center min-h-[500px]">
                    <div className="bg-green-100 p-4 rounded-full">
                        <UserPlus className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-green-800 mt-4">New to JEMPA?</h2>
                    <p className="mt-2 text-gray-600 mb-4 flex-grow">
                        If you are **not a member** of EMPA and have never submitted to JEMPA before, 
                        please create a dedicated author account. This will allow you to submit your 
                        research and follow the review process.
                    </p>

                    <AnimatePresence mode="wait">
                        {isSuccess ? (
                            <motion.div 
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-full bg-green-50 p-6 rounded-lg border border-green-200 flex flex-col items-center"
                            >
                                <CheckCircle2 className="w-12 h-12 text-green-600 mb-2" />
                                <h3 className="text-lg font-bold text-green-900">Registration Successful!</h3>
                                <p className="text-sm text-green-700">Connecting you to the portal...</p>
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
                                    className="mt-6 w-full bg-green-600 hover:bg-green-700"
                                >
                                    Register as an Author
                                </PrimaryButton>
                            </motion.div>
                        ) : (
                            <motion.form
                                key="reg-form"
                                onSubmit={handleRegisterAndLogin}
                                className="mt-6 w-full text-left space-y-3"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                {error && (
                                    <div className="bg-red-50 border border-red-200 p-3 rounded flex items-start gap-2 text-red-700 text-xs">
                                        <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-gray-400">Full Name</label>
                                    <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required className="w-full p-2 border rounded-md mt-1 outline-none focus:border-green-500" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-gray-400">Email</label>
                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-2 border rounded-md mt-1 outline-none focus:border-green-500" />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-gray-400">Password</label>
                                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-2 border rounded-md mt-1 outline-none focus:border-green-500" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-gray-400">Confirm</label>
                                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full p-2 border rounded-md mt-1 outline-none focus:border-green-500" />
                                    </div>
                                </div>
                                <p className="text-[9px] text-gray-400 leading-tight">
                                    Requires 8+ characters, one uppercase letter, and one number.
                                </p>
                                <PrimaryButton type="submit" disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700 !shadow-none">
                                    {isLoading ? "Validating..." : "Register & Continue"}
                                </PrimaryButton>
                                <button type="button" onClick={() => setShowRegisterForm(false)} className="w-full text-center text-xs text-gray-400 mt-2 hover:text-gray-600">
                                    Go Back
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