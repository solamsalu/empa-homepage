import React, { useState, useRef, useContext } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { API_BASE_URL } from '../../../utils/constants';
import { MapPin, FileText, Image as ImageIcon, Send, Heading, PlusCircle } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext';
import { toast } from 'react-toastify';

const AddConferenceForm = ({ onConferenceAdded }) => {
    const { authToken } = useContext(AuthContext);
    
    const [title, setTitle] = useState('');
    const [eventType, setEventType] = useState('annual_conference');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [registrationLink, setRegistrationLink] = useState('');
    const [conferenceImage, setConferenceImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef(null);

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, false] }], ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }], ['link']
        ]
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!title || !date || !location || !description || description === '<p><br></p>') {
            toast.warn('Please fill in all required fields.');
            setLoading(false); return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('event_type', eventType);
        formData.append('date', date);
        formData.append('location', location);
        formData.append('description', description);
        if (registrationLink) formData.append('registration_link', registrationLink);
        if (conferenceImage) formData.append('conferenceImage', conferenceImage);

        try {
            const response = await axios.post(`${API_BASE_URL}/conferences`, formData, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            toast.success('Event created successfully!');
            setTitle(''); setDate(''); setLocation(''); setDescription(''); setRegistrationLink(''); setConferenceImage(null);
            if (onConferenceAdded) onConferenceAdded(response.data.data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add event.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl font-sans border border-slate-200">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-black uppercase text-slate-500 mb-1">Event Title *</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-2 border rounded-xl text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-black uppercase text-slate-500 mb-1">Event Type *</label>
                        <select value={eventType} onChange={(e) => setEventType(e.target.value)} required className="w-full px-4 py-2 border rounded-xl text-sm font-bold">
                            <option value="annual_conference">Annual Conference (Full Paper Submission)</option>
                            <option value="public_lecture">Public Lecture (Guest Speaker)</option>
                            <option value="seminar">Seminar (Academic Talk)</option>
                            <option value="workshop">Workshop (Training)</option>
                            <option value="symposium">Symposium</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-black uppercase text-slate-500 mb-1">Date & Time *</label>
                        <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full px-4 py-2 border rounded-xl text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-black uppercase text-slate-500 mb-1">Venue Location *</label>
                        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required className="w-full px-4 py-2 border rounded-xl text-sm" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-black uppercase text-slate-500 mb-1">Description *</label>
                    <div className="bg-white rounded-lg"><ReactQuill theme="snow" value={description} onChange={setDescription} modules={quillModules} className="h-40 mb-10" /></div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <input type="file" ref={fileInputRef} onChange={(e) => setConferenceImage(e.target.files[0])} accept="image/*" className="hidden" />
                    <button type="button" onClick={() => fileInputRef.current.click()} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2">
                        <ImageIcon size={16} /> Cover Image (Optional)
                    </button>
                    {conferenceImage && <span className="text-xs text-emerald-600 font-bold">{conferenceImage.name}</span>}
                </div>

                <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50">
                    {loading ? 'Creating Event...' : <><Send size={18} /> Publish Event</>}
                </button>
            </form>
        </div>
    );
};

export default AddConferenceForm;