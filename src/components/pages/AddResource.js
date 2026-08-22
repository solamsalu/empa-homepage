// src/components/admin/AddResource.js

import React, { useState, useRef, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { API_BASE_URL } from '../../utils/constants';
import PrimaryButton from '../common/PrimaryButton';
import { PlusCircleIcon } from '@heroicons/react/24/solid';

const AddResource = ({ onResourceAdded }) => {
    const { authToken } = useContext(AuthContext);

    const [newResource, setNewResource] = useState({
        title: '',
        description: '',
        access_level: 'Free',
    });
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewResource(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!newResource.title || !newResource.description || !file) {
            setError('Please fill all fields and select a file.');
            return;
        }

        const formData = new FormData();
        formData.append('title', newResource.title);
        formData.append('description', newResource.description);
        formData.append('access_level', newResource.access_level);
        formData.append('file', file);

        try {
            const response = await axios.post(`${API_BASE_URL}/resources`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${authToken}`
                }
            });

            setSuccess('Resource added successfully!');
            // Reset form
            setNewResource({ title: '', description: '', access_level: 'Free' });
            setFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            // Notify parent component
            if (onResourceAdded) {
                onResourceAdded(response.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add resource.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-red-500 text-center">{error}</p>}
            {success && <p className="text-green-500 text-center">{success}</p>}
            
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    value={newResource.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    required
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    name="description"
                    id="description"
                    rows="3"
                    value={newResource.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    required
                ></textarea>
            </div>
            
            <div>
                <label htmlFor="access_level" className="block text-sm font-medium text-gray-700">Access Level</label>
                <select
                    name="access_level"
                    id="access_level"
                    value={newResource.access_level}
                    onChange={handleInputChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"
                >
                    <option>Free</option>
                    <option>Members Only</option>
                </select>
            </div>

            <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700">File</label>
                <input
                    type="file"
                    name="file"
                    id="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    required
                />
            </div>
            
            <PrimaryButton type="submit" className="w-full flex justify-center items-center">
                <PlusCircleIcon className="h-5 w-5 mr-2" />
                Add Resource
            </PrimaryButton>
        </form>
    );
};

export default AddResource;