
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL, STATIC_ASSETS_BASE_URL } from '../../../utils/constants';
import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css'; 
import {
    PlusCircle, Trash2, Heading, FileText, Calendar, User, List, Image, CheckCircle, Send
} from 'lucide-react';

const AddNews = ({ onNewsAdded }) => {
    // State for main news inputs
    const [title, setTitle] = useState('');
    const [content, setContent] = useState(''); // content will now hold HTML from ReactQuill
    const [date, setDate] = useState(''); // Date input for news publication
    const [author, setAuthor] = useState('');
    const [status, setStatus] = useState('Published'); // News status (Published/Draft)

    // State for multiple images, each with its file and an associated alt text/comment
    const [images, setImages] = useState([{ file: null, altText: '' }]);
    const [loading, setLoading] = useState(false);
    const [submissionError, setSubmissionError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Refs for file inputs to allow programmatic clearing
    const fileInputRefs = useRef([]);

    // --- ReactQuill Configurations ---
    // Modules for the toolbar options
    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }], // Headers 1-6
            [{ 'font': [] }], // Font family
            [{ 'size': ['small', false, 'large', 'huge'] }], // Font size options
            ['bold', 'italic', 'underline', 'strike', 'blockquote'], // Text styling
            [{ 'list': 'ordered' }, { 'list': 'bullet' }], // Lists
            [{ 'script': 'sub' }, { 'script': 'super' }], // Sub/super script
            [{ 'indent': '-1' }, { 'indent': '+1' }], // Indentation
            [{ 'direction': 'rtl' }], // Text direction
            [{ 'color': [] }, { 'background': [] }], // Text color & background
            [{ 'align': [] }], // Text alignment
            ['link', 'image', 'video'], // Embeds
            ['clean'] // Remove formatting
        ],
    };

    // Formats for allowed HTML tags/styles
    const quillFormats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent', 'script', 'direction',
        'link', 'image', 'video', 'color', 'background', 'align', 'clean'
    ];
    // --- End ReactQuill Configurations ---

    // Effect to clear success/error messages after 5 seconds
    useEffect(() => {
        if (successMessage || submissionError) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
                setSubmissionError('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, submissionError]);

    /**
     * Handles changes to the file input for a specific image.
     * @param {number} index - The index of the image in the 'images' array.
     * @param {Event} e - The change event from the file input.
     */
    const handleImageFileChange = (index, e) => {
        const file = e.target.files[0];
        const updatedImages = [...images];
        updatedImages[index].file = file;
        setImages(updatedImages);
    };

    /**
     * Handles changes to the alt text input for a specific image.
     * @param {number} index - The index of the image in the 'images' array.
     * @param {Event} e - The change event from the text input.
     */
    const handleImageAltTextChange = (index, e) => {
        const updatedImages = [...images];
        updatedImages[index].altText = e.target.value;
        setImages(updatedImages);
    };

    /**
     * Adds a new empty image field to the form, allowing upload of another image.
     */
    const handleAddImageField = () => {
        setImages([...images, { file: null, altText: '' }]);
    };

    /**
     * Removes an image field from the form.
     * @param {number} index - The index of the image field to remove.
     */
    const handleRemoveImageField = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
        // Clear the corresponding file input if it exists
        if (fileInputRefs.current[index]) {
            fileInputRefs.current[index].value = '';
        }
    };

    /**
     * Handles the form submission to create a new news item.
     * Sends multipart/form-data including text fields and file uploads (including rich text HTML content).
     * @param {Event} e - The form submission event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSubmissionError('');
        setSuccessMessage('');

        // Basic client-side validation
        // Check for empty title, content (including Quill's empty states), date, and author
        if (!title.trim() || !date || !author.trim() || !content.trim() || content === '<p><br></p>' || content === '<p></p>') {
            setSubmissionError('Please fill in all required news details (Title, Content, Date, Author).');
            setLoading(false);
            return;
        }

        // Create FormData object to send text data and files
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content); // This is the HTML content from ReactQuill
        formData.append('date', date);
        formData.append('author', author);
        formData.append('status', status);

        // Append all valid images and their alt texts to the FormData
        images.forEach((image, index) => {
            if (image.file) {
                formData.append(`images`, image.file); // Backend expects 'images' (array of files)
                formData.append(`altTexts`, image.altText || ''); // Backend expects 'altTexts' (array of strings)
            }
        });

        // Get authentication token from localStorage for authorization
        const token = localStorage.getItem('token');
        if (!token) {
            setSubmissionError('Authentication required. Please log in as an administrator.');
            setLoading(false);
            return;
        }

        try {
            // Send POST request to the backend API with multipart/form-data
            const response = await axios.post(`${API_BASE_URL}/news`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Essential for file uploads
                    'Authorization': `Bearer ${token}` // Include JWT token for authentication
                },
            });

            if (response.status === 201) { // Assuming 201 Created for successful news addition
                setSuccessMessage('News added successfully!');
                // Clear the form fields after successful submission
                setTitle('');
                setContent(''); // Clears Quill editor content
                setDate('');
                setAuthor('');
                setStatus('Published');
                setImages([{ file: null, altText: '' }]); // Reset to a single empty image field

                // Clear all file inputs using their refs
                fileInputRefs.current.forEach(ref => {
                    if (ref) ref.value = '';
                });
                fileInputRefs.current = []; // Reset the refs array

                // Call the callback to update the news list in the parent component
                if (onNewsAdded) {
                    onNewsAdded(response.data.newsItem); // Pass newly added news item data if available
                }
            } else {
                // If status is not 201 but response indicates an issue
                setSubmissionError(response.data.message || 'Failed to add news.');
            }
        } catch (err) {
            console.error('Error adding news:', err);
            if (err.response) {
                // Server responded with an error status (e.g., 400, 401, 403, 500)
                setSubmissionError(err.response.data.message || `Error: ${err.response.status} - ${err.response.statusText}`);
            } else if (err.request) {
                // Request was made but no response received (e.g., network error)
                setSubmissionError('No response from server. Check network connection or API URL.');
            } else {
                // Something else happened in setting up the request
                setSubmissionError(`An unexpected error occurred: ${err.message}`);
            }
        } finally {
            setLoading(false); // Always stop loading, regardless of success or failure
        }
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-gray-200 font-sans">
            <h3 className="text-3xl font-bold text-blue-900 mb-8 text-center leading-tight">Create New News Article</h3>

            {/* Success message display */}
            {successMessage && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg relative mb-6 animate-fade-in" role="alert">
                    <span className="block sm:inline">{successMessage}</span>
                </div>
            )}
            {/* Error message display */}
            {submissionError && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg relative mb-6 animate-fade-in" role="alert">
                    <span className="block sm:inline">{submissionError}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* News Details Section */}
                <section className="p-6 bg-blue-50 rounded-xl shadow-md border border-blue-200">
                    <h4 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
                        <Heading className="w-7 h-7 mr-3 text-blue-600" /> News Details
                    </h4>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="newsTitle" className="block text-base font-semibold text-gray-700 mb-1">News Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                id="newsTitle"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400
                                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter news title here..."
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="newsContent" className="block text-base font-semibold text-gray-700 mb-1">Content <span className="text-red-500">*</span></label>
                            <div className="bg-white rounded-lg shadow-sm border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200">
                                <ReactQuill
                                    theme="snow" // "snow" theme for a full toolbar
                                    value={content}
                                    onChange={setContent}
                                    modules={quillModules}
                                    formats={quillFormats}
                                    placeholder="Write your news content here..."
                                    className="h-64 mb-10" // h-64 gives editor height, mb-10 prevents toolbar from being covered by next element
                                />
                            </div>
                            {/* Validation message for content might appear below the Quill editor after its height */}
                            {submissionError.includes('Content') && (
                                <p className="mt-12 text-sm text-red-600">News content is required.</p>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="newsDate" className="block text-base font-semibold text-gray-700 mb-1">Publication Date <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        id="newsDate"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm
                                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none pr-10"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        required
                                    />
                                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="newsAuthor" className="block text-base font-semibold text-gray-700 mb-1">Author Name <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="newsAuthor"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400
                                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none pl-10"
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                        placeholder="Author's name"
                                        required
                                    />
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="newsStatus" className="block text-base font-semibold text-gray-700 mb-1">Status</label>
                            <div className="relative">
                                <select
                                    id="newsStatus"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none appearance-none pr-10"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="Published">Published</option>
                                    <option value="Draft">Draft</option>
                                </select>
                                <List className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Dynamic Image Upload and Alt Text Fields */}
                <section className="p-6 bg-purple-50 rounded-xl shadow-md border border-purple-200">
                    <h4 className="text-2xl font-bold text-purple-800 mb-6 flex items-center">
                        <Image className="w-7 h-7 mr-3 text-purple-600" /> News Images (Optional)
                    </h4>
                    <p className="text-gray-700 text-sm mb-4">
                        Upload images (JPEG, PNG, GIF, WebP). Recommended dimensions: 800x450 pixels (16:9 aspect ratio) for optimal display.
                    </p>
                    <div className="space-y-5">
                        {images.map((image, index) => (
                            <div key={index} className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-4 sm:space-y-0 p-4 border border-purple-300 rounded-lg bg-white shadow-sm">
                                <div className="flex-grow w-full sm:w-auto">
                                    <label htmlFor={`imageFile-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Image File {index + 1}</label>
                                    <input
                                        type="file"
                                        id={`imageFile-${index}`}
                                        accept="image/jpeg,image/png,image/gif,image/webp"
                                        className="w-full text-gray-700 text-sm file:mr-4 file:py-2 file:px-4
                                        file:rounded-md file:border-0 file:text-sm file:font-semibold
                                        file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 cursor-pointer"
                                        onChange={(e) => handleImageFileChange(index, e)}
                                        ref={el => fileInputRefs.current[index] = el} // Assign ref
                                    />
                                    {image.file && (
                                        <p className="mt-2 text-sm text-gray-600 flex items-center">
                                            <CheckCircle className="w-4 h-4 mr-1 text-green-500" /> Selected: <span className="font-medium ml-1">{image.file.name}</span>
                                        </p>
                                    )}
                                </div>
                                <div className="flex-grow w-full sm:w-auto">
                                    <label htmlFor={`imageAltText-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Image Alt Text (for accessibility)</label>
                                    <input
                                        type="text"
                                        id={`imageAltText-${index}`}
                                        placeholder="Descriptive text for the image"
                                        value={image.altText}
                                        onChange={(e) => handleImageAltTextChange(index, e)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400
                                        focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 outline-none"
                                    />
                                </div>
                                {/* Only show remove button if there's more than one image field */}
                                {images.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImageField(index)}
                                        className="p-2 text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md transition-colors duration-200 self-end sm:self-center flex-shrink-0"
                                        aria-label="Remove image"
                                    >
                                        <Trash2 className="w-6 h-6" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddImageField}
                            className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-base font-semibold rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-sm"
                        >
                            <PlusCircle className="w-5 h-5 mr-2" /> Add Another Image
                        </button>
                    </div>
                </section>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center px-8 py-3 border border-transparent
                    text-xl font-bold rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-700
                    hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-3 focus:ring-offset-2 focus:ring-blue-500
                    transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-lg
                    disabled:opacity-70 disabled:cursor-not-allowed shadow-xl"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating News...
                        </>
                    ) : (
                        <>
                            <Send className="w-6 h-6 mr-2" /> Create News
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default AddNews;