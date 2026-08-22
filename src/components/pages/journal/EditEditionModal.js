import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

const EditEditionModal = ({ isOpen, onClose, edition, onSave, isSaving }) => {
    const [formData, setFormData] = useState({
        title: '',
        volume_number: '',
        issue_number: '',
        description: '',
        publication_date: ''
    });

    // Synchronize local state when the "edition" prop changes
    useEffect(() => {
        if (edition) {
            setFormData({
                title: edition.title || '',
                volume_number: edition.volume_number || '',
                issue_number: edition.issue_number || '',
                description: edition.description || '',
                // Format date to YYYY-MM-DD for the date input
                publication_date: edition.publication_date ? edition.publication_date.split('T')[0] : ''
            });
        }
    }, [edition]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900">Edit Edition Details</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Journal Title</label>
                        <input 
                            required
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Volume</label>
                            <input 
                                type="number" required
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.volume_number}
                                onChange={(e) => setFormData({...formData, volume_number: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Issue</label>
                            <input 
                                type="number" required
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.issue_number}
                                onChange={(e) => setFormData({...formData, issue_number: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Publication Date</label>
                        <input 
                            type="date" required
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.publication_date}
                            onChange={(e) => setFormData({...formData, publication_date: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                        <textarea 
                            rows="4"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg text-xs">
                        <AlertCircle size={16} />
                        <p>File updates (PDF/Covers) must be handled via the "Add New Edition" panel to ensure file integrity.</p>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={18} /> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEditionModal;