import React, { useState, useContext } from 'react';
import axios from 'axios';
import { X, Upload, Send, FileText } from 'lucide-react';
import { API_BASE_URL } from '../../../../utils/constants';
import { AuthContext } from '../../../../context/AuthContext';

const SendProofModal = ({ paper, onClose, onComplete }) => {
    const { authToken } = useContext(AuthContext);
    const [file, setFile] = useState(null);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return alert("Please upload the formatted PDF.");

        setLoading(true);
        const fd = new FormData();
        fd.append('manuscript', file);
        fd.append('notes', notes);

        try {
            await axios.post(`${API_BASE_URL}/journal-papers/${paper.id}/send-proof`, fd, {
                headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'multipart/form-data' }
            });
            onComplete();
        } catch (err) {
            alert("Failed to send proof.");
        } finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
                <div className="bg-orange-600 p-6 flex justify-between items-center text-white">
                    <h3 className="font-black uppercase tracking-widest text-sm">Transmit Galley Proof</h3>
                    <button onClick={onClose}><X size={24}/></button>
                </div>
                <form onSubmit={handleUpload} className="p-8 space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Message to Author</label>
                        <textarea 
                            className="w-full p-4 border-2 border-slate-100 rounded-2xl focus:border-orange-500 outline-none transition-colors text-sm"
                            placeholder="Please check equations on page 4..."
                            rows="4"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                    <div className="border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center relative group">
                        <input type="file" accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files[0])}/>
                        {file ? (
                            <div className="text-orange-600 flex flex-col items-center gap-2"><FileText size={48} /><span className="font-bold">{file.name}</span></div>
                        ) : (
                            <div className="text-slate-400 flex flex-col items-center gap-2"><Upload size={48} /><span className="font-bold">Select Formatted PDF</span></div>
                        )}
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl flex justify-center items-center gap-3 active:scale-95 transition-all">
                        {loading ? "Transmitting..." : <><Send size={18}/> Send to Author</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SendProofModal;