import React, { useState, useRef, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { API_BASE_URL } from '../../../utils/constants';
import PrimaryButton from '../../common/PrimaryButton';

const AddOlympiadResource = ({ onActionComplete }) => {
    const { authToken } = useContext(AuthContext);
    const [newResource, setNewResource] = useState({ title: '', description: '', access_level: 'Free' });
    const [resourceFile, setResourceFile] = useState(null);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!newResource.title || !resourceFile) {
            setError('Title and a file are required.');
            return;
        }

        const formData = new FormData();
        Object.keys(newResource).forEach(key => formData.append(key, newResource[key]));
        formData.append('file', resourceFile);

        try {
            await axios.post(`${API_BASE_URL}/olympiad/resources`, formData, { headers: { 'Authorization': `Bearer ${authToken}` } });
            if (onActionComplete) onActionComplete('Resource added successfully!');
            setNewResource({ title: '', description: '', access_level: 'Free' });
            setResourceFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add resource.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-bold text-green-800 border-b pb-2">Add Preparation Resource</h3>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <input type="text" placeholder="Resource Title" value={newResource.title} onChange={e => setNewResource({ ...newResource, title: e.target.value })} className="w-full p-2 border rounded-md" required />
            <textarea placeholder="Description" value={newResource.description} onChange={e => setNewResource({ ...newResource, description: e.target.value })} className="w-full p-2 border rounded-md"></textarea>
            <select value={newResource.access_level} onChange={e => setNewResource({ ...newResource, access_level: e.target.value })} className="w-full p-2 border rounded-md">
                <option value="Free">Free</option>
                <option value="Members Only">Members Only</option>
            </select>
            <input type="file" ref={fileInputRef} onChange={e => setResourceFile(e.target.files[0])} className="w-full text-sm" required />
            <PrimaryButton type="submit">Add Resource</PrimaryButton>
        </form>
    );
};

export default AddOlympiadResource;