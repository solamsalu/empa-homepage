import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../../context/AuthContext';
import { API_BASE_URL } from '../../../../utils/constants';
import { X, Upload, FileText, Loader2, Send } from 'lucide-react';
import PrimaryButton from '../../../common/PrimaryButton';
import LatexEditor from '../../../common/LatexEditor';

const SubmitRevisionModal = ({ paper, uploadType, onClose, onRevisionSubmitted }) => {
    const { authToken } = useContext(AuthContext);
    const [file, setFile] = useState(null);
    const [authorNotes, setAuthorNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // ✅ Explicitly define our two distinct upload scenarios
    const isProduction = uploadType === 'production'; // Asked by Production Staff
    const isStandardRevision = uploadType === 'revision'; // Asked by Managing Editor

    const handleUpload = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!file) return setError("Please upload the PDF manuscript.");

        // ✅ REQUIRE NOTES FOR ME REVISIONS, OPTIONAL FOR PRODUCTION STAFF
        if (isStandardRevision && authorNotes.trim().length < 20) {
            return setError("Your summary of changes must be at least 20 characters.");
        }

        setIsSubmitting(true);
        const fd = new FormData();
        fd.append('manuscript', file); 
        fd.append('authorNotes', authorNotes);

        // ✅ ROUTE TO THE CORRECT ENDPOINT BASED ON WHO ASKED FOR IT
        const apiEndpoint = isProduction
            ? `${API_BASE_URL}/journal-papers/${paper.id}/final-production` 
            : `${API_BASE_URL}/journal-papers/${paper.id}/revision`;

        try {
            await axios.post(apiEndpoint, fd, {
                headers: { 
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'multipart/form-data' 
                }
            });
            onRevisionSubmitted();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit file. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-200">
                <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
                    <h3 className="font-black uppercase tracking-widest text-sm">
                        {/* ✅ DYNAMIC TITLE BASED ON SCENARIO */}
                        {isProduction ? 'Upload Final Production File' : 'Submit Manuscript Revision'}
                    </h3>
                    <button onClick={onClose} className="hover:text-red-400 transition-colors"><X size={24}/></button>
                </div>
                
                <form onSubmit={handleUpload} className="p-8 space-y-6">
                    {/* Error Display */}
                    {error && (
                        <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold border border-rose-100">
                            {error}
                        </div>
                    )}
                    
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block text-left">
                            {/* ✅ TARGETED LABELS FOR THE SPECIFIC AUDIENCE */}
                            {isProduction ? 'Notes for Production Staff (Optional)' : 'Summary of Changes for Managing Editor *'}
                        </label>
                        <div className="border-2 border-slate-100 rounded-2xl overflow-hidden focus-within:border-blue-500 transition-colors">
                            <LatexEditor 
                                value={authorNotes} 
                                onChange={setAuthorNotes} 
                                placeholder={
                                    isProduction 
                                    ? "Any final notes regarding formatting, layout, or typesetting..." 
                                    : "Detail how you addressed the reviewers' comments (min 20 chars)..."
                                } 
                            />
                        </div>
                    </div>

                    <div className="border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center relative group hover:border-blue-400 transition-colors bg-slate-50 hover:bg-white">
                        <input 
                            type="file" 
                            accept=".pdf" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                            onChange={(e) => {
                                setFile(e.target.files[0]);
                                setError('');
                            }}
                        />
                        {file ? (
                            <div className="text-emerald-600 flex flex-col items-center gap-2">
                                <FileText size={48} />
                                <span className="font-bold truncate max-w-full px-4">{file.name}</span>
                            </div>
                        ) : (
                            <div className="text-slate-400 flex flex-col items-center gap-2 group-hover:text-blue-500 transition-colors">
                                <Upload size={48} />
                                <span className="font-bold">
                                    {/* ✅ SPECIFIC UPLOAD INSTRUCTIONS */}
                                    {isProduction ? 'Select Camera-Ready PDF' : 'Select Revised PDF Manuscript'}
                                </span>
                            </div>
                        )}
                    </div>

                    <PrimaryButton type="submit" disabled={isSubmitting} className="w-full py-5 rounded-2xl shadow-xl shadow-blue-200 flex justify-center items-center gap-3">
                        {isSubmitting ? (
                            <><Loader2 className="animate-spin" /> Uploading...</>
                        ) : (
                            <>
                                <Send size={18}/> 
                                {/* ✅ CLEAR BUTTON ACTION TEXT */}
                                {isProduction ? 'Submit Final File to Production' : 'Submit Revision to Editor'}
                            </>
                        )}
                    </PrimaryButton>
                </form>
            </div>
        </div>
    );
};

export default SubmitRevisionModal;