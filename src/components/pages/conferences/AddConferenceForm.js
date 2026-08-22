import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { API_BASE_URL } from '../../../utils/constants';
import {
    Calendar, MapPin, FileText, Link, Image, CheckCircle, Send, Heading, PlusCircle, Clock
} from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext';

/**
 * AddConferenceForm Component (Admin Only)
 *
 * This component provides a form for administrators to add new conferences,
 * including conference details, a rich text description, and an associated image.
 * The conference status is automatically determined based on the conference date.
 *
 * @param {object} props - The component's props.
 * @param {function} props.onConferenceAdded - Callback function after a conference is successfully added.
 */
const AddConferenceForm = ({ onConferenceAdded }) => {
    const { authToken } = useContext(AuthContext);

    // State for main conference inputs
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [registrationLink, setRegistrationLink] = useState('');
    const [conferenceImage, setConferenceImage] = useState(null);

    // Derived state and UI feedback
    const [derivedStatus, setDerivedStatus] = useState('Upcoming');
    const [loading, setLoading] = useState(false);
    const [submissionError, setSubmissionError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const fileInputRef = useRef(null);

    // ReactQuill configuration
    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, false] }], ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }], [{ 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'], [{ 'color': [] }, { 'background': [] }], [{ 'align': [] }], ['clean']
        ],
    };
    const quillFormats = [
        'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent', 'link', 'image', 'color', 'background', 'align'
    ];

    // Effect to clear messages
    useEffect(() => {
        if (successMessage || submissionError) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
                setSubmissionError('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, submissionError]);

    // Effect to calculate status from date
    useEffect(() => {
        if (date) {
            const conferenceDateTime = new Date(date);
            const currentDateTime = new Date();
            const conferenceDateOnly = new Date(conferenceDateTime.getFullYear(), conferenceDateTime.getMonth(), conferenceDateTime.getDate());
            const currentDateOnly = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate());

            if (conferenceDateOnly < currentDateOnly) {
                // FIX: Use 'Past' to match the database ENUM value
                setDerivedStatus('Past');
            } else if (conferenceDateOnly.getTime() === currentDateOnly.getTime()) {
                setDerivedStatus('Ongoing');
            } else {
                setDerivedStatus('Upcoming');
            }
        } else {
            setDerivedStatus('Upcoming');
        }
    }, [date]);

    const handleImageFileChange = (e) => {
        const file = e.target.files[0];
        setConferenceImage(file);
    };

    const handleTriggerFileInput = () => {
        fileInputRef.current.click();
    };

    /**
     * Handles the form submission to create a new conference.
     * This function correctly uses FormData to handle both text and file uploads,
     * which is required by the backend's Multer middleware.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSubmissionError('');
        setSuccessMessage('');

        if (!title.trim() || !date || !location.trim() || !description.trim() || description === '<p><br></p>') {
            setSubmissionError('Please fill in all required fields (Title, Date, Location, Description).');
            setLoading(false);
            return;
        }

        // Always use FormData because the route expects it (due to file upload capability)
        const formData = new FormData();
        formData.append('title', title);
        formData.append('date', date);
        formData.append('location', location);
        formData.append('description', description);
        formData.append('status', derivedStatus);

        if (registrationLink) {
            formData.append('registration_link', registrationLink);
        }
        if (conferenceImage) {
            // FIX: The field name must match what Multer expects on the backend
            formData.append('conferenceImage', conferenceImage);
        }

        if (!authToken) {
            setSubmissionError('Authentication required. Please log in as an administrator.');
            setLoading(false);
            return;
        }

        try {
            // FIX: Post to the correct, unified '/conferences' endpoint
            const response = await axios.post(`${API_BASE_URL}/conferences`, formData, {
                headers: {
                    // When sending FormData, DO NOT set 'Content-Type'.
                    // The browser will automatically set it to 'multipart/form-data' with the correct boundary.
                    'Authorization': `Bearer ${authToken}`
                },
            });

            if (response.status === 201) {
                setSuccessMessage('Conference added successfully!');
                // Clear the form fields after successful submission
                setTitle('');
                setDate('');
                setLocation('');
                setDescription('');
                setRegistrationLink('');
                setConferenceImage(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                if (onConferenceAdded) {
                    onConferenceAdded(response.data.data);
                }
            } else {
                setSubmissionError(response.data.message || 'Failed to add conference.');
            }
        } catch (err) {
            console.error('Error adding conference:', err);
            setSubmissionError(err.response?.data?.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    // Helper to get status class for styling
    const getStatusClass = (status) => {
        switch (status) {
            case 'Upcoming': return 'text-blue-700 bg-blue-100 border-blue-200';
            case 'Ongoing': return 'text-green-700 bg-green-100 border-green-200';
            case 'Past': return 'text-gray-700 bg-gray-100 border-gray-200'; // Matched to 'Past'
            case 'Cancelled': return 'text-red-700 bg-red-100 border-red-200';
            default: return 'text-gray-700 bg-gray-100 border-gray-200';
        }
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-gray-200 font-sans">
            <h3 className="text-3xl font-bold text-blue-900 mb-8 text-center leading-tight">Create New Conference</h3>

            {successMessage && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6">{successMessage}</div>}
            {submissionError && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">{submissionError}</div>}

            <form onSubmit={handleSubmit} className="space-y-8">
                <section className="p-6 bg-blue-50 rounded-xl shadow-md border border-blue-200">
                    <h4 className="text-2xl font-bold text-blue-800 mb-6 flex items-center"><Heading className="w-7 h-7 mr-3 text-blue-600" /> Conference Details</h4>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="conferenceTitle" className="block text-base font-semibold text-gray-700 mb-1">Conference Title <span className="text-red-500">*</span></label>
                            <input type="text" id="conferenceTitle" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Annual Research Conference" required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="conferenceDate" className="block text-base font-semibold text-gray-700 mb-1">Date and Time <span className="text-red-500">*</span></label>
                                <input type="datetime-local" id="conferenceDate" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" value={date} onChange={(e) => setDate(e.target.value)} required />
                            </div>
                            <div>
                                <label htmlFor="conferenceLocation" className="block text-base font-semibold text-gray-700 mb-1">Location <span className="text-red-500">*</span></label>
                                <input type="text" id="conferenceLocation" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Addis Ababa, Skylight Hotel" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-base font-semibold text-gray-700 mb-1">Calculated Status</label>
                            <div className={`px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-2 font-medium ${getStatusClass(derivedStatus)}`}><Clock className="w-5 h-5" /><span>{derivedStatus}</span></div>
                            <p className="text-sm text-gray-600 mt-1">This status is automatically determined by the conference date.</p>
                        </div>
                        <div>
                            <label htmlFor="registrationLink" className="block text-base font-semibold text-gray-700 mb-1">Registration Link (Optional)</label>
                            <input type="url" id="registrationLink" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" value={registrationLink} onChange={(e) => setRegistrationLink(e.target.value)} placeholder="e.g., https://example.com/register" />
                        </div>
                    </div>
                </section>

                <section className="p-6 bg-green-50 rounded-xl shadow-md border border-green-200">
                    <h4 className="text-2xl font-bold text-green-800 mb-6 flex items-center"><FileText className="w-7 h-7 mr-3 text-green-600" /> Conference Description <span className="text-red-500">*</span></h4>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-300"><ReactQuill theme="snow" value={description} onChange={setDescription} modules={quillModules} formats={quillFormats} placeholder="Provide a detailed description of the conference..." className="h-64 mb-10" /></div>
                </section>

                <section className="p-6 bg-purple-50 rounded-xl shadow-md border border-purple-200">
                    <h4 className="text-2xl font-bold text-purple-800 mb-6 flex items-center"><Image className="w-7 h-7 mr-3 text-purple-600" /> Conference Image (Optional)</h4>
                    <div className="flex flex-col sm:flex-row items-center sm:space-x-4 p-4 border border-purple-300 rounded-lg bg-white">
                        <input type="file" id="conferenceImageFile" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleImageFileChange} ref={fileInputRef} className="hidden" />
                        <button type="button" onClick={handleTriggerFileInput} className="inline-flex items-center justify-center px-5 py-2.5 border-transparent text-base font-semibold rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200"><PlusCircle className="w-5 h-5 mr-2" /> Select Conference Image</button>
                        {conferenceImage && <p className="mt-2 text-sm text-gray-600 flex items-center"><CheckCircle className="w-4 h-4 mr-1 text-green-500" /> Selected: <span className="font-medium ml-1">{conferenceImage.name}</span></p>}
                        {!conferenceImage && <p className="mt-2 text-sm text-gray-500 italic">No image selected.</p>}
                    </div>
                </section>

                <button type="submit" className="w-full inline-flex items-center justify-center px-8 py-3 text-xl font-bold rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:opacity-70 disabled:cursor-not-allowed" disabled={loading}>
                    {loading ? 'Creating...' : <><Send className="w-6 h-6 mr-2" /> Create Conference</>}
                </button>
            </form>
        </div>
    );
};

export default AddConferenceForm;