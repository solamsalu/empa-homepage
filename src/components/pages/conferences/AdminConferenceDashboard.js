import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { format, isValid } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../../utils/constants';
import { AuthContext } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import { Trash2, Plus, Calendar, MapPin, Loader2, X, AlertCircle } from 'lucide-react';

const safeFormatDate = (dateInput, formatString = 'MMM dd, yyyy') => {
    if (!dateInput) return 'N/A';
    const date = new Date(dateInput);
    return isValid(date) ? format(date, formatString) : 'Invalid Date';
};

const AdminConferenceDashboard = () => {
    const [conferences, setConferences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);

    const { authToken, userRole, isAuthReady } = useContext(AuthContext);
    const navigate = useNavigate();

    const [newConference, setNewConference] = useState({
        title: '',
        description: '',
        submissionStartDate: '',
        submissionEndDate: '',
        conferenceDate: '',
        location: ''
    });
    const [createLoading, setCreateLoading] = useState(false);

    // 1. DATA FETCHING
    // 1. Single, reliable fetch function
    const fetchConferences = useCallback(async () => {
        if (!authToken) return;
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/submissions`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            setConferences(response.data.success ? response.data.data : []);
        } catch (err) {
            setError("Failed to load administration data.");
        } finally {
            setLoading(false);
        }
    }, [authToken]);

    // 2. Clear role check
    useEffect(() => {
        const role = userRole?.toLowerCase().trim();
        const hasAccess = ['admin', 'conference_manager'].includes(role);

        if (isAuthReady && hasAccess) {
            fetchConferences();
        } else if (isAuthReady) {
            setError("Access Denied.");
            setLoading(false);
        }
    }, [isAuthReady, userRole, fetchConferences]);

    // 3. UI Permission Variable
    const canCreate = ['admin', 'conference_manager'].includes(userRole?.toLowerCase().trim());

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewConference(prev => ({ ...prev, [name]: value }));
    };

    // 3. CREATE NEW SUBMISSION WINDOW
    const handleCreateConference = async (e) => {
        e.preventDefault();
        if (!authToken) return;

        setCreateLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/submissions`, newConference, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            toast.success('Submission window created!');
            setShowCreateForm(false);
            setNewConference({
                title: '', description: '', submissionStartDate: '',
                submissionEndDate: '', conferenceDate: '', location: ''
            });
            fetchConferences();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error creating window.');
        } finally {
            setCreateLoading(false);
        }
    };

    // 4. DELETE A WINDOW
    const handleDeleteWindow = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure? This will delete this window and all papers inside it.')) return;

        try {
            await axios.delete(`${API_BASE_URL}/submissions/${id}`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            setConferences(prev => prev.filter(c => c.id !== id));
            toast.success('Window removed.');
        } catch (err) {
            toast.error('Failed to delete window.');
        }
    };

    const handleViewPapers = (submissionId) => {
        navigate(`/admin/conference-papers/${submissionId}`);
    };

    if (!isAuthReady || (loading && conferences.length === 0)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center space-y-4">
                    <Loader2 className="animate-spin h-10 w-10 text-blue-600 mx-auto" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing Management Hub...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-slate-50 min-h-screen pt-32">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Submission Windows</h1>
                        <p className="text-slate-500 font-medium italic">Global Conference Call Management</p>
                    </div>
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg active:scale-95 ${showCreateForm ? 'bg-slate-800 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                        {showCreateForm ? <X size={20} /> : <Plus size={20} />}
                        {showCreateForm ? 'Close Form' : 'Add New Window'}
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 p-6 rounded-[2rem] flex items-center gap-4 text-red-600 font-bold">
                        <AlertCircle size={28} /> {error}
                    </div>
                )}

                {/* CREATE FORM */}
                {showCreateForm && (
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl animate-in slide-in-from-top-4 duration-300">
                        <h2 className="text-xl font-black text-slate-800 uppercase mb-6 border-b pb-4">Initialize New Window</h2>
                        <form onSubmit={handleCreateConference} className="grid md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-black uppercase text-slate-400 mb-2">Window Title</label>
                                <input name="title" value={newConference.title} className="w-full p-3 bg-slate-50 border rounded-xl" onChange={handleInputChange} required placeholder="e.g., 2026 Annual Mathematics Conference" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-black uppercase text-slate-400 mb-2">Brief Description</label>
                                <textarea name="description" value={newConference.description} className="w-full p-3 bg-slate-50 border rounded-xl" rows="3" onChange={handleInputChange} />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase text-slate-400 mb-2">Submission Start</label>
                                <input type="datetime-local" name="submissionStartDate" value={newConference.submissionStartDate} className="w-full p-3 bg-slate-50 border rounded-xl" onChange={handleInputChange} required />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase text-slate-400 mb-2">Submission End</label>
                                <input type="datetime-local" name="submissionEndDate" value={newConference.submissionEndDate} className="w-full p-3 bg-slate-50 border rounded-xl" onChange={handleInputChange} required />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase text-slate-400 mb-2">Location</label>
                                <input name="location" value={newConference.location} className="w-full p-3 bg-slate-50 border rounded-xl" onChange={handleInputChange} placeholder="Addis Ababa University" />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase text-slate-400 mb-2">Conference Date</label>
                                <input type="date" name="conferenceDate" value={newConference.conferenceDate} className="w-full p-3 bg-slate-50 border rounded-xl" onChange={handleInputChange} />
                            </div>
                            <button type="submit" disabled={createLoading} className="md:col-span-2 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex justify-center items-center gap-3 shadow-xl shadow-slate-200">
                                {createLoading ? <Loader2 className="animate-spin" /> : 'Launch Submission Window'}
                            </button>
                        </form>
                    </div>
                )}

                {/* WINDOW LIST */}
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Active Windows</h2>
                {conferences.length === 0 && !loading ? (
                    <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed">
                        <p className="text-slate-400 font-medium">No submission windows found. Create one above.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {conferences.map((conf) => (
                            <div key={conf.id} onClick={() => handleViewPapers(conf.id)}
                                className="bg-white p-6 rounded-[2rem] border border-slate-200 flex flex-col justify-between cursor-pointer group hover:shadow-xl hover:border-blue-500 transition-all duration-300">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-xl font-bold mb-2 text-blue-900 pr-2 group-hover:text-blue-600 transition-colors">{conf.title}</h3>
                                        <button onClick={(e) => handleDeleteWindow(e, conf.id)} className="text-slate-300 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                    <p className="text-slate-500 mb-4 text-sm line-clamp-3 h-16">{conf.description || 'No description provided.'}</p>
                                    <div className="text-[10px] space-y-2 text-slate-400 font-black uppercase border-t pt-4 mt-2">
                                        <div className="flex items-center gap-2"><Calendar size={12} className="text-blue-500" /> {safeFormatDate(conf.submission_start_date)} - {safeFormatDate(conf.submission_end_date)}</div>
                                        <div className="flex items-center gap-2"><MapPin size={12} className="text-blue-500" /> {conf.location || 'TBD'}</div>
                                    </div>
                                </div>
                                <div className={`text-center text-[10px] font-black uppercase mt-6 p-2 rounded-xl border-2 ${conf.isSubmissionOpen ? 'bg-green-50 text-green-700 border-green-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                                    {conf.isSubmissionOpen ? 'Open for Submission' : 'Closed'}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminConferenceDashboard;


