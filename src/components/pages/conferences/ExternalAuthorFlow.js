import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { API_BASE_URL } from '../../../utils/constants';
import { motion } from 'framer-motion';
import PrimaryButton from '../../common/PrimaryButton';
import { User, LogIn } from 'lucide-react';

const ExternalAuthorFlow = () => {
    const { handleLogin } = useContext(AuthContext);
    const [isRegistering, setIsRegistering] = useState(false);

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegisterAndLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            // ---> HIT THE NEW UNIFIED ENDPOINT <---
            // This endpoint creates the user directly in the `members` table 
            // with the role 'author' and returns a login token.
            const response = await axios.post(`${API_BASE_URL}/auth/register-external-author`, {
                full_name: fullName,
                email,
                password,
            });

            const { authToken, data } = response.data;

            // Use the global handleLogin from AuthContext to set the session.
            handleLogin(authToken, data.role, data.full_name);
            
            // Note: Once handleLogin fires, the AuthContext updates, and 
            // the parent component will automatically re-render to show the submission form!
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid md:grid-cols-2 gap-8 items-start font-sans">
            {/* Path 1: Existing Member Login */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 text-center">
                <LogIn className="mx-auto h-12 w-12 text-blue-600" />
                <h3 className="text-2xl font-bold text-blue-900 mt-4">Already an EMPA Member?</h3>
                <p className="mt-2 text-slate-600 text-sm">
                    Log in to automatically link this submission to your existing EMPA profile.
                </p>
                <Link to="/login">
                    <PrimaryButton className="mt-6 w-full flex justify-center shadow-md">
                        Member Login
                    </PrimaryButton>
                </Link>
            </div>

            {/* Path 2: Non-Member Author Registration */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 text-center">
                <User className="mx-auto h-12 w-12 text-emerald-600" />
                <h3 className="text-2xl font-bold text-emerald-900 mt-4">Not an EMPA Member?</h3>
                <p className="mt-2 text-slate-600 text-sm">
                    Create a free author account to submit to EMPA conferences and journals. No membership fees required.
                </p>

                {!isRegistering ? (
                    <PrimaryButton 
                        onClick={() => setIsRegistering(true)} 
                        className="mt-6 w-full flex justify-center bg-emerald-600 hover:bg-emerald-700 shadow-md"
                    >
                        Create Free Author Account
                    </PrimaryButton>
                ) : (
                    <motion.form
                        onSubmit={handleRegisterAndLogin}
                        className="mt-6 text-left space-y-4"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {error && (
                            <div className="text-rose-600 text-sm text-center bg-rose-50 p-3 rounded-xl border border-rose-200 font-medium">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">
                                Full Name
                            </label>
                            <input 
                                type="text" 
                                placeholder="Dr. Abebe Bikila" 
                                value={fullName} 
                                onChange={e => setFullName(e.target.value)} 
                                required 
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm font-medium" 
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">
                                Email Address
                            </label>
                            <input 
                                type="email" 
                                placeholder="abebe@university.edu" 
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                required 
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm font-medium" 
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">
                                Password
                            </label>
                            <input 
                                type="password" 
                                placeholder="Create a secure password" 
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                required 
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm font-medium" 
                            />
                        </div>
                        <PrimaryButton 
                            type="submit" 
                            disabled={isLoading} 
                            className="w-full flex justify-center bg-emerald-600 hover:bg-emerald-700 shadow-md mt-2"
                        >
                            {isLoading ? 'Registering...' : 'Register & Continue'}
                        </PrimaryButton>
                    </motion.form>
                )}
            </div>
        </div>
    );
};

export default ExternalAuthorFlow;