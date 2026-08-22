import React, { useState, useRef, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { API_BASE_URL } from '../../../utils/constants';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import PrimaryButton from '../../common/PrimaryButton';

const AddOlympiadEvent = ({ onActionComplete }) => {
    const { authToken } = useContext(AuthContext);

    const [newEvent, setNewEvent] = useState({
        title: '',
        event_date: '',
        location: '',
        description: '',
        registrationLink: '',
        resultsLink: ''
    });
    const [eventImageFile, setEventImageFile] = useState(null);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fileInputRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!newEvent.title || !newEvent.event_date || !newEvent.location) {
            setError('Title, Date, and Location are required.');
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        Object.keys(newEvent).forEach(key => formData.append(key, newEvent[key]));
        if (eventImageFile) formData.append('eventImage', eventImageFile);

        try {
            await axios.post(`${API_BASE_URL}/olympiad/events`, formData, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'multipart/form-data' // Explicitly setting for file uploads
                }
            });

            if (onActionComplete) onActionComplete('Event added successfully!');

            // Reset form
            setNewEvent({ title: '', event_date: '', location: '', description: '', registrationLink: '', resultsLink: '' });
            setEventImageFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add event.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <h3 className="text-xl font-bold text-blue-800 border-b pb-2">Add New Olympiad Event</h3>

            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

            <input
                type="text"
                placeholder="Title"
                value={newEvent.title}
                onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                required
            />

            <input
                type="datetime-local"
                value={newEvent.event_date}
                onChange={e => setNewEvent({ ...newEvent, event_date: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                required
            />

            <input
                type="text"
                placeholder="Location"
                value={newEvent.location}
                onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                required
            />

            {/* Added mb-12 to prevent ReactQuill from overlapping the inputs below it */}
            <div className="h-30 mb-12">
                <ReactQuill
                    theme="snow"
                    value={newEvent.description}
                    onChange={val => setNewEvent({ ...newEvent, description: val })}
                    style={{ height: '100%' }}
                    placeholder="Write event description here..."
                />
            </div>

            <input
                type="url"
                placeholder="Registration Link (Optional)"
                value={newEvent.registrationLink}
                onChange={e => setNewEvent({ ...newEvent, registrationLink: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
                type="url"
                placeholder="Results Link (Optional)"
                value={newEvent.resultsLink}
                onChange={e => setNewEvent({ ...newEvent, resultsLink: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Image (Optional)</label>
                <input
                    type="file"
                    accept="image/*" // Restrict file picker to images only
                    ref={fileInputRef}
                    onChange={e => setEventImageFile(e.target.files[0])}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
            </div>

            <PrimaryButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding Event...' : 'Add Event'}
            </PrimaryButton>
        </form>
    );
};

export default AddOlympiadEvent;