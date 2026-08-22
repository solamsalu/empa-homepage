
import React, { useState, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../../context/AuthContext';
import { API_BASE_URL } from '../../../../utils/constants';
import PrimaryButton from '../../../common/PrimaryButton';
import { Upload, Archive, FileText, Image as ImageIcon } from 'lucide-react';

const AddArchivedEdition = ({ onEditionAdded }) => {
    const { authToken } = useContext(AuthContext);
    const [details, setDetails] = useState({ title: 'JEMPA Archive', volume_number: '', issue_number: '', year: '', description: '' });
    const [files, setFiles] = useState({ coverImage: null, pdfFile: null });
    const [status, setStatus] = useState({ loading: false, msg: '', type: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, msg: '', type: '' });

        const fd = new FormData();
        Object.keys(details).forEach(k => fd.append(k, details[k]));
        fd.append('coverImage', files.coverImage);
        fd.append('pdfFile', files.pdfFile);

        try {
            await axios.post(`${API_BASE_URL}/journals/add-archive`, fd, {
                headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'multipart/form-data' }
            });
            setStatus({ loading: false, msg: 'Old Issue uploaded successfully!', type: 'success' });
            if (onEditionAdded) onEditionAdded();
        } catch (err) {
            setStatus({ loading: false, msg: 'Upload failed.', type: 'error' });
        }
    };

    return (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mb-10 animate-in fade-in slide-in-from-top-4">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2 mb-6 uppercase tracking-tight">
                <Archive className="text-blue-600" size={24}/> Import Historical Issue
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                {status.msg && <p className={`p-4 rounded-xl text-sm font-bold ${status.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{status.msg}</p>}

                <div className="grid md:grid-cols-3 gap-6">
                    <input type="number" placeholder="Volume #" className="p-3 border rounded-xl" onChange={e => setDetails({...details, volume_number: e.target.value})} required />
                    <input type="number" placeholder="Issue #" className="p-3 border rounded-xl" onChange={e => setDetails({...details, issue_number: e.target.value})} required />
                    <input type="number" placeholder="Year (e.g., 2018)" className="p-3 border rounded-xl" onChange={e => setDetails({...details, year: e.target.value})} required />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="border-2 border-dashed p-6 rounded-2xl text-center hover:border-blue-400 transition-colors relative">
                        <ImageIcon className="mx-auto text-slate-300 mb-2" />
                        <span className="text-xs font-bold text-slate-500 uppercase">{files.coverImage ? files.coverImage.name : "Upload Cover Image"}</span>
                        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setFiles({...files, coverImage: e.target.files[0]})} required />
                    </div>
                    <div className="border-2 border-dashed p-6 rounded-2xl text-center hover:border-blue-400 transition-colors relative">
                        <FileText className="mx-auto text-slate-300 mb-2" />
                        <span className="text-xs font-bold text-slate-500 uppercase">{files.pdfFile ? files.pdfFile.name : "Upload Full Issue PDF"}</span>
                        <input type="file" accept="application/pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setFiles({...files, pdfFile: e.target.files[0]})} required />
                    </div>
                </div>

                <PrimaryButton type="submit" disabled={status.loading} className="w-full py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-100">
                    {status.loading ? 'Archiving...' : 'Add to Historical Records'}
                </PrimaryButton>
            </form>
        </div>
    );
};

export default AddArchivedEdition;