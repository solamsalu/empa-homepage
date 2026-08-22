
// src/components/admin/AddJournalEdition.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/constants';
import { AuthContext } from '../../context/AuthContext';
import PrimaryButton from '../common/PrimaryButton';

const AddJournalEdition = ({ onEditionAdded }) => {
    const { authToken } = useContext(AuthContext);

    // Get today's date in YYYY-MM-DD format for the input default
    const today = new Date().toISOString().split('T')[0];

    // --- THE FIX ---
    // Initialize publication_date with a valid default, like today's date.
    const [formData, setFormData] = useState({
        title: 'JEMPA',
        volume_number: 1,
        issue_number: 1,
        publication_date: today, // Set a default value
        description: ''
    });
    const [files, setFiles] = useState({ coverImage: null, pdfFile: null });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setFiles({ ...files, [e.target.name]: e.target.files[0] });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!files.coverImage || !files.pdfFile) {
            setError('Both cover image and PDF file are required.');
            return;
        }

        const submissionData = new FormData();
        Object.keys(formData).forEach(key => submissionData.append(key, formData[key]));
        submissionData.append('coverImage', files.coverImage);
        submissionData.append('pdfFile', files.pdfFile);

        try {
            await axios.post(`${API_BASE_URL}/journals`, submissionData, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            setSuccess('Edition added successfully!');
            // Refresh the list on the parent page
            if (onEditionAdded) onEditionAdded();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add edition.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 p-2 bg-red-50 rounded-md">{error}</p>}
            {success && <p className="text-green-500 p-2 bg-green-50 rounded-md">{success}</p>}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input type="number" name="volume_number" value={formData.volume_number} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input type="number" name="issue_number" value={formData.issue_number} onChange={handleChange} className="w-full p-2 border rounded" required />
            </div>

            <div>
                <label>Publication Date</label>
                <input type="date" name="publication_date" value={formData.publication_date} onChange={handleChange} className="w-full p-2 border rounded" required />
            </div>

            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" />

            <div>
                <label>Cover Image (JPG, PNG)</label>
                <input type="file" name="coverImage" onChange={handleFileChange} required className="w-full" />
            </div>
            <div>
                <label>Journal PDF</label>
                <input type="file" name="pdfFile" accept="application/pdf" onChange={handleFileChange} required className="w-full" />
            </div>

            <PrimaryButton type="submit">Upload Edition</PrimaryButton>
        </form>
    );
};

export default AddJournalEdition;