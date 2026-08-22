
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { API_BASE_URL } from '../../../utils/constants';
import { motion, AnimatePresence } from 'framer-motion';
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
            // This is a new, combined backend endpoint for efficiency.
            // It registers the user and returns a login token immediately.
            const response = await axios.post(`${API_BASE_URL}/external-authors/register-and-login`, {
                full_name: fullName,
                email,
                password,
            });

            // Use the global handleLogin from AuthContext to set the session.
            // Note: The role is 'author'
            handleLogin(response.data.authToken, 'author', response.data.data.full_name);
            // After this, the SubmitPaperPage will re-render and show the submission form.
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Path 1: Existing Member Login */}
            <div className="bg-white p-8 rounded-lg shadow-xl border text-center">
                <LogIn className="mx-auto h-12 w-12 text-blue-600" />
                <h3 className="text-2xl font-bold text-blue-900 mt-4">Already a Member?</h3>
                <p className="mt-2 text-gray-600">Log in to have your submission automatically linked to your EMPA account.</p>
                <Link to="/login">
                    <PrimaryButton className="mt-6 w-full flex justify-center">
                        Member Login
                    </PrimaryButton>
                </Link>
            </div>

            {/* Path 2: Non-Member Author Registration */}
            <div className="bg-white p-8 rounded-lg shadow-xl border text-center">
                <User className="mx-auto h-12 w-12 text-green-600" />
                <h3 className="text-2xl font-bold text-blue-900 mt-4">Not a Member?</h3>
                <p className="mt-2 text-gray-600">Quickly create a free author account to submit and track your paper. No membership required.</p>

                {!isRegistering ? (
                    <PrimaryButton onClick={() => setIsRegistering(true)} className="mt-6 w-full flex justify-center bg-green-600 hover:bg-green-700">
                        Create Free Author Account
                    </PrimaryButton>
                ) : (
                    <motion.form
                        onSubmit={handleRegisterAndLogin}
                        className="mt-6 text-left space-y-4"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-md">{error}</p>}
                        <div>
                            <label className="text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" placeholder="Your Full Name" value={fullName} onChange={e => setFullName(e.target.value)} required className="w-full mt-1 p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <input type="email" placeholder="your.email@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="w-full mt-1 p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <input type="password" placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full mt-1 p-2 border rounded-md" />
                        </div>
                        <PrimaryButton type="submit" disabled={isLoading} className="w-full flex justify-center bg-green-600 hover:bg-green-700">
                            {isLoading ? 'Registering...' : 'Register & Continue to Submission'}
                        </PrimaryButton>
                    </motion.form>
                )}
            </div>
        </div>
    );
};

export default ExternalAuthorFlow;