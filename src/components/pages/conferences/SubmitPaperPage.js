
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import axios from 'axios';
import { format } from 'date-fns';
import { AuthContext } from '../../../context/AuthContext';
import { API_BASE_URL } from '../../../utils/constants';
import PrimaryButton from '../../common/PrimaryButton';
import { Send, CheckCircle, UploadCloud, FileText, Users, Tag, BookOpen } from 'lucide-react';
import LatexEditor from '../../common/LatexEditor';
import LatexRenderer from '../../common/LatexRenderer';

const SubmitPaperPage = () => {
    const { authToken, isLoggedIn, userName, userEmail } = useContext(AuthContext);
    const navigate = useNavigate(); // Hook for navigation

    const [conferences, setConferences] = useState([]);
    const [selectedConferenceId, setSelectedConferenceId] = useState('');
    const [loadingConferences, setLoadingConferences] = useState(true);

    const [title, setTitle] = useState('');
    const [abstract, setAbstract] = useState('');
    const [authors, setAuthors] = useState('');
    const [keywords, setKeywords] = useState('');
    const [paperFile, setPaperFile] = useState(null);

    const [guestFullName, setGuestFullName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (isLoggedIn) {
            setAuthors(prev => prev || userName || '');
        }
    }, [isLoggedIn, userName]);

    useEffect(() => {
        const fetchActiveConferences = async () => {
            setLoadingConferences(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/submissions/active`);
                const activeConfs = response.data.data || [];
                setConferences(activeConfs);
                if (activeConfs.length > 0) {
                    setSelectedConferenceId(activeConfs[0].conference_id.toString());
                }
            } catch (err) {
                setError('Could not load the list of available conferences.');
            } finally {
                setLoadingConferences(false);
            }
        };
        fetchActiveConferences();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            setPaperFile(file);
            setError('');
        } else {
            setPaperFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            setError('Invalid file type. Please upload a PDF only.');
        }
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        // 1. Fallback to empty string if context variables are undefined/null
        const finalSubmitterName = (isLoggedIn ? userName : guestFullName) || '';
        const finalSubmitterEmail = (isLoggedIn ? userEmail : guestEmail) || '';

        // 2. Comprehensive Validation Check
        const validationErrors = [];
        if (!selectedConferenceId) validationErrors.push("Conference Selection");
        if (!title) validationErrors.push("Paper Title");
        if (!abstract) validationErrors.push("Abstract");
        if (!authors) validationErrors.push("Authors List");
        if (!finalSubmitterName) validationErrors.push("Submitter Name");
        if (!finalSubmitterEmail) validationErrors.push("Submitter Email");
        if (!paperFile) validationErrors.push("PDF File");

        if (validationErrors.length > 0) {
            // This log tells you EXACTLY what is missing
            console.warn("Submission Blocked. Missing fields:", validationErrors);
            setError(`Please ensure all required fields are filled: ${validationErrors.join(', ')}`);
            setIsSubmitting(false);
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('abstract', abstract);
        formData.append('authors', authors);
        formData.append('keywords', keywords || '');
        formData.append('submitterFullName', finalSubmitterName);
        formData.append('submitterEmail', finalSubmitterEmail);
        formData.append('paperFile', paperFile);
        formData.append('conferenceId', selectedConferenceId);

        try {
            await axios.post(
                `${API_BASE_URL}/papers`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        ...(authToken && { 'Authorization': `Bearer ${authToken}` })
                    }
                }
            );

            setSuccess('Your paper has been submitted successfully!');
            // Reset Logic
            setTitle(''); setAbstract(''); setKeywords(''); setPaperFile(null);
            if (!isLoggedIn) { setGuestFullName(''); setGuestEmail(''); }
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (err) {
            setError(err.response?.data?.message || 'Server error during submission.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <header className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 py-20 px-4 text-white text-center">
                <h2 className="text-4xl sm:text-5xl font-extrabold">Conference Paper Submission</h2>
                <p className="mt-4 text-lg sm:text-xl text-blue-200 max-w-3xl mx-auto">
                    Share your research by contributing to one of our upcoming professional conferences.
                </p>
            </header>

            <div className="max-w-4xl mx-auto py-12 px-4 -mt-24">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-2xl space-y-6">
                    {loadingConferences ? (
                        <p className="text-center text-gray-600">Loading available conferences...</p>
                    ) : conferences.length === 0 ? (
                        <div className="text-center p-4 bg-yellow-100 text-yellow-800 rounded-md">
                            <p className="font-semibold">No conferences are currently open for submission.</p>
                            <p className="text-sm mt-1">Please check back later or view our <Link to="/conferences" className="underline">upcoming events</Link>.</p>
                        </div>
                    ) : (
                        <>
                            <div>
                                <label htmlFor="conference" className="block text-lg font-semibold text-gray-800 mb-1">Select Conference *</label>
                                <select id="conference" value={selectedConferenceId} onChange={(e) => setSelectedConferenceId(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white" required>
                                    <option value="" disabled>-- Choose an open conference --</option>
                                    {conferences.map(conf => <option key={conf.conference_id} value={conf.conference_id}>{conf.title}</option>)}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="title" className="block text-lg font-semibold text-gray-800 mb-1">Paper Title (LaTeX supported) *</label>
                                <LatexEditor value={title} onChange={(val) => setTitle(val)} placeholder="e.g., Investigating $\\nabla \\cdot \\vec{E} = \\frac{\\rho}{\\varepsilon_0}$" required />
                            </div>
                            <div>
                                <label htmlFor="authors" className="block text-lg font-semibold text-gray-800 mb-1">Author(s) * <span className="font-normal text-gray-500 text-sm">(e.g., A. Einstein, M. Curie)</span></label>
                                <input type="text" id="authors" value={authors} onChange={(e) => setAuthors(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md" required />
                            </div>
                            <div>
                                <label htmlFor="abstract" className="block text-lg font-semibold text-gray-800 mb-1">Abstract (LaTeX supported) *</label>
                                <LatexEditor value={abstract} onChange={(val) => setAbstract(val)} placeholder="e.g., We prove that for any integer $n > 2$, the equation $a^n + b^n = c^n$ has no integer solutions..." required />
                            </div>
                            <div>
                                <label htmlFor="keywords" className="block text-lg font-semibold text-gray-800 mb-1">Keywords <span className="font-normal text-gray-500 text-sm">(comma-separated)</span></label>
                                <input type="text" id="keywords" value={keywords} onChange={(e) => setKeywords(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md" />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-md border">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Submitter Full Name *</label>
                                    <input type="text" value={isLoggedIn ? userName : guestFullName || ''} onChange={(e) => !isLoggedIn && setGuestFullName(e.target.value)} className="mt-1 w-full p-2 border rounded-md disabled:bg-gray-200 disabled:text-gray-500" required disabled={isLoggedIn} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Submitter Email *</label>
                                    <input type="email" value={isLoggedIn ? userEmail : guestEmail || ''} onChange={(e) => !isLoggedIn && setGuestEmail(e.target.value)} className="mt-1 w-full p-2 border rounded-md disabled:bg-gray-200 disabled:text-gray-500" required disabled={isLoggedIn} />
                                </div>
                                {isLoggedIn ? (
                                    <p className="text-xs text-green-700 md:col-span-2">Your details are pre-filled from your member account.</p>
                                ) : (
                                    <p className="text-xs text-gray-500 md:col-span-2">You are submitting as a guest. For a better experience, please <Link to="/login" className="font-semibold text-blue-600 hover:underline">log in</Link>.</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="paperFile" className="block text-lg font-semibold text-gray-800 mb-1">Upload Manuscript (PDF only) *</label>
                                <input id="paperFile" ref={fileInputRef} type="file" onChange={handleFileChange} accept="application/pdf" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" required />
                                {paperFile && <p className="text-sm text-green-600 mt-2 flex items-center gap-1"><CheckCircle size={14} /> File selected: {paperFile.name}</p>}
                            </div>
                            <div className="pt-4 border-t">
                                {error && <div className="text-center p-3 mb-4 bg-red-100 text-red-800 rounded-md">{error}</div>}
                                {success && <div className="text-center p-3 mb-4 bg-green-100 text-green-800 rounded-md">{success}</div>}
                                <PrimaryButton type="submit" disabled={isSubmitting || !!success} className="w-full flex justify-center items-center text-lg py-3">
                                    <Send size={20} className="mr-2" />
                                    {isSubmitting ? 'Submitting...' : 'Submit Your Paper'}
                                </PrimaryButton>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default SubmitPaperPage;