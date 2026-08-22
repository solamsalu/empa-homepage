// src/components/pages/events/GuestSubmissionFlow.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../../utils/constants';

// We can move the form itself into its own component to keep this file clean
const GuestSubmissionForm = () => {
    // This would contain the exact same form as in your original file,
    // including the fields for submitterFullName and submitterEmail.
    // The handleSubmit function would NOT include an Authorization header.
    return (
        <form className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800">Guest Submission</h3>
            {/* ... Full form including conference select, title, abstract, submitter name, email, and file upload ... */}
             <button type="submit" className="w-full bg-green-600 text-white p-3 rounded-md">Submit as Guest</button>
        </form>
    );
};

const GuestSubmissionFlow = () => {
    return (
        <div className="space-y-10">
            {/* Path 1: Guest Submission Form */}
            <div className="bg-white p-8 rounded-lg shadow-xl border">
                <h2 className="text-2xl font-bold text-blue-900">Submit as a Guest</h2>
                <p className="text-gray-600 mb-6">No account required. Please provide your contact details with your submission.</p>
                <GuestSubmissionForm />
            </div>

            {/* Path 2: Existing Member Login */}
            <div className="text-center">
                 <h3 className="text-2xl font-bold text-gray-800">Already a Member?</h3>
                <p className="mt-2 text-gray-600">Log in to have your submission automatically linked to your account.</p>
                <Link to="/login" className="mt-4 inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700">
                    Member Login
                </Link>
            </div>
        </div>
    );
};

export default GuestSubmissionFlow;