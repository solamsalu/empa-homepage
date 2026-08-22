import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../../utils/constants';

/**
 * ResetPasswordPage Component
 * Allows users to reset their password using a token received via email.
 * The token is extracted from the URL parameters.
 */
const ResetPasswordPage = () => {
    // useParams hook to extract the 'token' from the URL (e.g., /reset-password/YOUR_TOKEN_HERE)
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    /**
     * Handles the form submission for password reset.
     * Validates password inputs and sends a request to the backend.
     * @param {Event} e - The form submission event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setError(''); // Clear previous errors
        setSuccess(''); // Clear previous success messages

        // Basic client-side validation for password length
        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }
        // Client-side validation for password match
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            // Send POST request to the backend's reset password endpoint
            const response = await axios.put(`${API_BASE_URL}/members/resetpassword/${token}`, {
    password // Only send the password in the body, the token is in the URL param
});

            // If the backend indicates success
            if (response.data.success) {
                setSuccess(
                    <span className="flex flex-col items-center">
                        Password has been reset successfully! You can now log in with your new password.
                        <Link to="/login" className="text-blue-700 hover:underline mt-2 font-medium">Log in here</Link>.
                    </span>
                );
                setError(''); // Clear any errors
            } else {
                 // If success is false but no explicit error message, provide a generic one
                setError(response.data.message || 'Failed to reset password. Please try again.');
            }
        } catch (err) {
            // Handle API call errors
            console.error('Error resetting password:', err);
            if (err.response && err.response.data) {
                // Use error message from backend if available
                setError(err.response.data.message || 'Failed to reset password. Please try again.');
            } else {
                // Generic error for network issues or unhandled exceptions
                setError('An unexpected error occurred. Please check your network or try again.');
            }
            setSuccess(''); // Clear any success messages on error
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 p-4 sm:p-6">
            <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-md border border-gray-200 transform hover:scale-105 transition-transform duration-300 ease-in-out">
                <h2 className="text-3xl font-extrabold text-center text-indigo-900 mb-4">Reset Your Password</h2>
                <p className="text-center text-gray-600 mb-8">Enter your new password below.</p>

                {/* Success Message Display (Green) */}
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-6 animate-pulse" role="alert">
                        {success}
                    </div>
                )}

                {/* Error Message Display (Red) */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6 animate-pulse" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* New Password Input */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400
                                       focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 outline-none"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {/* Confirm New Password Input */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400
                                       focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 outline-none"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    {/* Reset Password Button */}
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center w-full px-6 py-2.5 border border-transparent text-base font-semibold rounded-md text-white
                                   bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                                   transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
