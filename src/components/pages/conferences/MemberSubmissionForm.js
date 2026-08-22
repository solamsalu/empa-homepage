import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { API_BASE_URL } from '../../../utils/constants';
import PrimaryButton from '../../common/PrimaryButton';
import { Send } from 'lucide-react';
import LatexEditor from '../../common/LatexEditor';
import LatexRenderer from '../../common/LatexRenderer';


const MemberSubmissionForm = () => {
    const { authToken, userName, userEmail } = useContext(AuthContext);

    // Form state
    const [conferences, setConferences] = useState([]); // Correct state variable
    const [selectedConferenceId, setSelectedConferenceId] = useState('');
    const [title, setTitle] = useState('');
    const [abstract, setAbstract] = useState('');
    const [authors, setAuthors] = useState(userName || '');
    const [keywords, setKeywords] = useState('');
    const [paperFile, setPaperFile] = useState(null);

    // UI state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch active conferences
    useEffect(() => {
        const fetchActiveConferences = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/conferences/active-for-submission`);
                const openConfs = response.data.data || [];
                // --- FIX: Use the correct state setter ---
                setConferences(openConfs);
                if (openConfs.length > 0) {
                    setSelectedConferenceId(openConfs[0].id.toString());
                }
            } catch (err) {
                setError('Failed to load active conferences.');
            }
        };
        fetchActiveConferences();
    }, []);

    // Update authors field if userName from context changes
    useEffect(() => { setAuthors(prev => prev || userName || ''); }, [userName]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!paperFile) { setError('Please select a manuscript file.'); return; }
        setIsLoading(true);
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('abstract', abstract);
        formData.append('authors', authors);
        formData.append('keywords', keywords);
        formData.append('paperFile', paperFile);
        formData.append('submitterFullName', userName);
        formData.append('submitterEmail', userEmail);

        try {
            await axios.post(`${API_BASE_URL}/papers/${selectedConferenceId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${authToken}`
                }
            });
            setSuccess('Your paper has been submitted successfully! You will receive a confirmation email shortly.');
        } catch (err) {
            setError(err.response?.data?.message || 'Submission failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-xl border">
            <h2 className="text-2xl font-bold text-blue-900">New Paper Submission</h2>
            <p className="text-gray-600 mb-6">Welcome, {userName}! Your submission will be linked to your account.</p>

            {success && <div className="p-4 mb-6 bg-green-100 text-green-800 rounded-md">{success}</div>}
            {error && <div className="p-4 mb-6 bg-red-100 text-red-800 rounded-md">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Conference *</label>
                    <select value={selectedConferenceId} onChange={e => setSelectedConferenceId(e.target.value)} required className="w-full mt-1 p-2 border rounded-md">
                        <option value="" disabled>-- Select a Conference --</option>
                        {/* --- FIX: Use the correct state variable --- */}
                        {conferences.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                </div>
                <div><label className="block text-sm font-medium">Paper Title *</label><LatexEditor
                    value={title}
                    onChange={(val) => setTitle(val)}
                    placeholder="e.g., Investigating $\\nabla \\cdot \\vec{E} = \\frac{\\rho}{\\varepsilon_0}$"
                    required
                />

                    <div className="mt-2">
                        <label className="block text-sm font-semibold text-gray-700">Preview Title</label>
                        <div className="mt-1 p-3 bg-gray-50 border rounded-md text-sm text-gray-800">
                            {title.trim() ? <LatexRenderer content={title} /> : <p className="text-gray-500 italic">No preview yet</p>}
                        </div>
                    </div>
                </div>
                <div><label className="block text-sm font-medium">Authors * <span className="font-normal text-gray-500">(comma-separated)</span></label><input type="text" value={authors} onChange={(e) => setAuthors(e.target.value)} className="w-full mt-1 p-2 border rounded-md" required /></div>
                <div><label className="block text-sm font-medium">Abstract *</label><LatexEditor
                    value={abstract}
                    onChange={(val) => setAbstract(val)}
                    placeholder="Use LaTeX for math expressions like $\\int_a^b f(x)dx$..."
                    required
                />

                    <div className="mt-2">
                        <label className="block text-sm font-semibold text-gray-700">Preview Abstract</label>
                        <div className="mt-1 p-3 bg-gray-50 border rounded-md text-sm text-gray-800">
                            {abstract.trim() ? <LatexRenderer content={abstract} /> : <p className="text-gray-500 italic">No preview yet</p>}
                        </div>
                    </div>
                </div>
                <div><label className="block text-sm font-medium">Keywords</label><input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} className="w-full mt-1 p-2 border rounded-md" /></div>
                <div><label className="block text-sm font-medium">Manuscript (PDF) *</label><input type="file" onChange={(e) => setPaperFile(e.target.files[0])} accept="application/pdf" className="w-full mt-1 text-sm" required /></div>

                <PrimaryButton type="submit" disabled={isLoading || success} className="w-full flex justify-center">
                    <Send className="mr-2" size={20} />
                    {isLoading ? 'Submitting...' : 'Submit Paper'}
                </PrimaryButton>
            </form>
        </div>
    );
};

export default MemberSubmissionForm;