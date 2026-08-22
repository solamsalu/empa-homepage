import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../../utils/constants'

/**
 * ForgotPasswordPage Component
 * Provides a form for users to request a password reset email.
 * This page sends the user's email to the backend, which then
 * sends a password reset link (containing a token) to that email.
 */
const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    /**
     * Handles the form submission for requesting a password reset.
     * @param {Event} e - The form submission event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            // Send POST request to the backend's forgot-password endpoint
            const response = await axios.post(`${API_BASE_URL}/members/forgotpassword`, { email });

            if (response.data.success) {
                setMessage(response.data.message || 'If an account with that email exists, a password reset link has been sent to your email address.');
            } else {
                // Backend might send success as true even if email not found to prevent user enumeration
                setMessage(response.data.message || 'An unexpected issue occurred. Please try again.');
            }
        } catch (err) {
            console.error('Forgot password error:', err);
            // Provide a generic message to prevent user enumeration if email doesn't exist
            setError('Failed to send reset link. Please check your email or try again later.');
            // More specific error for network issues, but still keep it generic for security
            if (axios.isAxiosError(err) && err.response) {
                console.error('Backend error data:', err.response.data);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-4 sm:p-6">
            <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-md border border-gray-200 transform hover:scale-105 transition-transform duration-300 ease-in-out">
                <h2 className="text-3xl font-extrabold text-center text-indigo-900 mb-4">Forgot Your Password?</h2>
                <p className="text-center text-gray-600 mb-8">
                    Enter your email address below and we'll send you a link to reset your password.
                </p>

                {/* Success Message Display (Green) */}
                {message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-6 animate-pulse" role="alert">
                        <span className="block sm:inline">{message}</span>
                    </div>
                )}

                {/* Error Message Display (Red) */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6 animate-pulse" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400
                                       focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 outline-none"
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center w-full px-6 py-2.5 border border-transparent text-base font-semibold rounded-md text-white
                                   bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                                   transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                        disabled={loading}
                    >
                        {loading ? 'Sending Request...' : 'Send Reset Link'}
                    </button>
                </form>

                {/* Link back to Login Page */}
                <p className="text-center text-gray-600 text-sm mt-8">
                    Remembered your password? {' '}
                    <Link to="/login" className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors duration-200 font-medium">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
