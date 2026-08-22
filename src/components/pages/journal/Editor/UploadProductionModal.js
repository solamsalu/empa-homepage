import React, { useState, useContext } from 'react';
import axios from 'axios';
import { X, Upload, CheckCircle, FileText, Download, Loader2, FileCheck } from 'lucide-react';
import { API_BASE_URL, STATIC_ASSETS_BASE_URL } from '../../../../utils/constants';
import { AuthContext } from '../../../../context/AuthContext';
import LatexRenderer from '../../../common/LatexRenderer';

const UploadProductionModal = ({ paper, onClose, onUploadComplete }) => {
    const { authToken } = useContext(AuthContext);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return alert("Please select the final definitive PDF.");

        setUploading(true);
        const formData = new FormData();
        formData.append('production_file', file);

        try {
            await axios.post(`${API_BASE_URL}/journal-papers/${paper.id}/publish`, formData, {
                headers: { 
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'multipart/form-data' 
                }
            });
            onUploadComplete();
        } catch (err) {
            console.error("Upload failed", err);
            alert(err.response?.data?.message || "Failed to publish paper.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
                
                <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
                    <div>
                        <h3 className="font-black uppercase tracking-widest text-sm">Archival & Publication</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">ID: #JEMPA-{paper.id}</p>
                    </div>
                    <button onClick={onClose} className="hover:text-red-400 transition-colors">
                        <X size={24}/>
                    </button>
                </div>
                
                <div className="p-8 space-y-6">
                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl">
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-2">Author's Submitted Version</span>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <FileText className="text-emerald-600" size={20} />
                                <span className="text-xs font-bold text-slate-700 truncate max-w-[180px]">
                                    {paper.manuscript_file_url?.split('-').pop() || "final-manuscript.pdf"}
                                </span>
                            </div>
                            <a 
                                href={`${STATIC_ASSETS_BASE_URL}/uploads/${(paper.production_file_url || paper.manuscript_file_url || '').replace(/^(\/?uploads\/)/, "")}`}
                                target="_blank" 
                                rel="noreferrer"
                                className="bg-white px-3 py-1.5 rounded-lg border border-emerald-200 text-[10px] font-black text-emerald-700 uppercase hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-1 shadow-sm"
                            >
                                <Download size={12}/> Review File
                            </a>
                        </div>
                    </div>

                    <div className="text-xs text-slate-500 leading-relaxed italic border-l-4 border-slate-200 pl-4">
                        "Review the file above. Once you have added necessary JEMPA branding/headers, upload the final definitive version below to publish it to the Public Archives."
                    </div>

                    <form onSubmit={handleUpload} className="space-y-6">
                        <div className="border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center relative group hover:border-blue-400 transition-colors">
                            <input 
                                type="file" 
                                accept=".pdf"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                            {file ? (
                                <div className="text-blue-600 flex flex-col items-center gap-2">
                                    <FileCheck size={48} />
                                    <span className="font-bold text-sm">{file.name}</span>
                                </div>
                            ) : (
                                <div className="text-slate-400 flex flex-col items-center gap-2 group-hover:text-blue-500 transition-colors">
                                    <Upload size={48} />
                                    <span className="font-black uppercase text-[10px] tracking-widest">Select Definitive PDF</span>
                                </div>
                            )}
                        </div>

                        <button 
                            type="submit" 
                            disabled={uploading || !file}
                            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:bg-slate-200 shadow-xl shadow-blue-100 active:scale-95"
                        >
                            {uploading ? (
                                <><Loader2 className="animate-spin" size={18}/> Finalizing...</>
                            ) : (
                                <><CheckCircle size={18}/> Finalize & Publish</>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UploadProductionModal;