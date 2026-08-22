
import React, { useState, useRef, useContext, useMemo } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../../context/AuthContext';
import { API_BASE_URL } from '../../../../utils/constants';
import { BookUp, UploadCloud, FileCheck2, XCircle } from 'lucide-react';
import PrimaryButton from '../../../common/PrimaryButton';
import LatexRenderer from '../../../common/LatexRenderer';

/**
 * A final, professional component for editors to compile a new journal edition.
 * It initiates a background job on the server to merge PDFs and provides immediate user feedback.
 */
const CompileEdition = ({ acceptedPapers = [], onEditionPublished }) => {
    const { authToken } = useContext(AuthContext);

    const [selectedPaperIds, setSelectedPaperIds] = useState([]);
    const [editionDetails, setEditionDetails] = useState({
        title: 'JEMPA',
        volume_number: '',
        issue_number: '',
        publication_date: new Date().toISOString().split('T')[0],
        description: ''
    });
    const [coverImage, setCoverImage] = useState(null);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const coverInputRef = useRef(null);

    const unpublishedAcceptedPapers = useMemo(() =>
        acceptedPapers.filter(p => p.publication_status !== 'Published'),
        [acceptedPapers]
    );

    const handleSelectPaper = (paperId) => {
        setSelectedPaperIds(prev =>
            prev.includes(paperId) ? prev.filter(id => id !== paperId) : [...prev, paperId]
        );
    };

    const handleInputChange = (e) => {
        setEditionDetails({ ...editionDetails, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setCoverImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        if (selectedPaperIds.length === 0) {
            setError('You must select at least one paper.');
            setIsSubmitting(false);
            return;
        }
        if (!editionDetails.volume_number || !editionDetails.issue_number || !coverImage) {
            setError('Please provide all edition details and upload a cover image.');
            setIsSubmitting(false);
            return;
        }

        const formData = new FormData();
        Object.keys(editionDetails).forEach(key => formData.append(key, editionDetails[key]));
        formData.append('paperIds', JSON.stringify(selectedPaperIds));
        formData.append('coverImage', coverImage);

        try {
            // This API call will now be very fast!
            const response = await axios.post(`${API_BASE_URL}/journals/compile`, formData, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });

            // Display the "job started" message from the backend
            setSuccess(response.data.message);

            // Reset the form immediately
            setSelectedPaperIds([]);
            setEditionDetails({ title: 'JEMPA', volume_number: '', issue_number: '', publication_date: new Date().toISOString().split('T')[0], description: '' });
            setCoverImage(null);
            if (coverInputRef.current) coverInputRef.current.value = '';

            // Refresh the main list to show the new "Pending" edition
            if (onEditionPublished) {
                onEditionPublished();
            }

            // Let the success message linger for a bit longer
            setTimeout(() => setSuccess(''), 8000);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to start compilation job.');
        } finally {
            // This will now run almost instantly, un-sticking the button
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-center gap-3">
                <BookUp size={28} className="text-green-700" />
                <div>
                    <h3 className="text-xl font-bold text-green-800">Compile New Journal Edition</h3>
                    <p className="text-sm text-gray-600">Select papers and publish a new edition. The system will auto-generate the final PDF in the background.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-8">
                {error && <div className="flex items-center gap-2 text-red-700 bg-red-100 p-3 rounded-md text-sm font-medium"><XCircle size={18} /><span>{error}</span></div>}
                {success && <div className="flex items-center gap-2 text-green-700 bg-green-100 p-3 rounded-md text-sm font-medium"><FileCheck2 size={18} /><span>{success}</span></div>}

                {/* Step 1: Select Papers */}
                <div className="p-4 bg-white rounded-lg border">
                    <label className="font-semibold text-gray-800 block mb-2">1. Select Accepted & Unpublished Papers *</label>
                    <div className="mt-2 space-y-2 max-h-48 overflow-y-auto p-2 border rounded-md bg-gray-50">
                        {unpublishedAcceptedPapers.length > 0 ?
                            unpublishedAcceptedPapers.map(paper => (
                                <label key={paper.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-green-100 cursor-pointer">
                                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={selectedPaperIds.includes(paper.id)} onChange={() => handleSelectPaper(paper.id)} />
                                    <span> <LatexRenderer content={paper.title} /></span>
                                </label>
                            )) : <p className="text-gray-500 p-2">No unpublished accepted papers available to compile.</p>}
                    </div>
                </div>

                {/* Step 2: Edition Details */}
                <div className="p-4 bg-white rounded-lg border">
                    <label className="font-semibold text-gray-800 block mb-2">2. Edition Details *</label>
                    <div className="grid md:grid-cols-3 gap-4">
                        <input type="number" name="volume_number" placeholder="Volume #" value={editionDetails.volume_number} onChange={handleInputChange} className="p-2 border rounded-md" required />
                        <input type="number" name="issue_number" placeholder="Issue #" value={editionDetails.issue_number} onChange={handleInputChange} className="p-2 border rounded-md" required />
                        <input type="date" name="publication_date" value={editionDetails.publication_date} onChange={handleInputChange} className="p-2 border rounded-md" required />
                    </div>
                    <textarea name="description" placeholder="Brief description of this issue..." value={editionDetails.description} onChange={handleInputChange} className="w-full p-2 border rounded-md mt-4" rows="3"></textarea>
                </div>

                {/* Step 3: Upload Cover */}
                <div className="p-4 bg-white rounded-lg border">
                    <label className="font-semibold text-gray-800 block mb-2">3. Upload Edition Cover *</label>
                    <input type="file" name="coverImage" ref={coverInputRef} accept="image/*" onChange={handleFileChange} className="w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" required />
                    {coverImage && <p className="text-xs text-green-600 mt-1">File selected: {coverImage.name}</p>}
                </div>

                <PrimaryButton type="submit" disabled={isSubmitting} className="w-full flex justify-center bg-green-600 hover:bg-green-700 disabled:bg-gray-400">
                    <UploadCloud size={20} className="mr-2" />
                    {isSubmitting ? 'Starting Compilation...' : 'Compile and Publish Edition'}
                </PrimaryButton>
            </form>
        </div>
    );
};

export default CompileEdition;