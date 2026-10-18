import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../../context/AuthContext';
import { API_BASE_URL } from '../../../../utils/constants';
import { X, Send, Mail, User, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import LatexEditor from '../../../common/LatexEditor';
import LatexRenderer from '../../../common/LatexRenderer';

const ContactAuthorModal = ({ paper, onClose, onMessageSent }) => {
    const { authToken } = useContext(AuthContext);
    
    const [subject, setSubject] = useState(`Regarding Manuscript #${paper.id}: ${paper.title.substring(0, 40)}...`);
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ type: null, text: '' });

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim()) {
            setStatusMessage({ type: 'error', text: 'Please write a message before sending.' });
            return;
        }

        setIsSending(true);
        setStatusMessage({ type: null, text: '' });

        try {
            await axios.post(
                `${API_BASE_URL}/journal-papers/${paper.id}/contact-author`,
                { subject, message },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );

            setStatusMessage({ type: 'success', text: `Message successfully sent to ${paper.author_name}!` });
            setTimeout(() => {
                if (onMessageSent) onMessageSent();
                onClose();
            }, 1500);
        } catch (err) {
            setStatusMessage({ 
                type: 'error', 
                text: err.response?.data?.message || 'Failed to deliver message. Please try again.' 
            });
            setIsSending(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-100">
                            <Mail size={20} />
                        </div>
                        <div>
                            <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">
                                Contact Corresponding Author
                            </h3>
                            <p className="text-xs text-slate-500">
                                Direct message with author reply-to capability
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* Recipient Details Banner */}
                <div className="px-6 py-3.5 bg-blue-50/60 border-b border-blue-100 flex flex-wrap items-center justify-between text-xs gap-2">
                    <div className="flex items-center gap-2">
                        <User size={14} className="text-blue-600" />
                        <span className="font-bold text-slate-800">{paper.author_name}</span>
                        <span className="text-blue-700 bg-white border border-blue-200 px-2 py-0.5 rounded-md font-mono">
                            {paper.author_email || 'Email not recorded'}
                        </span>
                    </div>
                    <span className="text-slate-400 font-semibold font-mono">
                        Manuscript #{paper.id}
                    </span>
                </div>

                {/* Body Form */}
                <form onSubmit={handleSend} className="p-6 space-y-4 overflow-y-auto flex-1">
                    {statusMessage.text && (
                        <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                            statusMessage.type === 'success' 
                                ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' 
                                : 'bg-rose-50 border border-rose-200 text-rose-700'
                        }`}>
                            {statusMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                            <span>{statusMessage.text}</span>
                        </div>
                    )}

                    {/* Subject Line */}
                    <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                            Email Subject Line *
                        </label>
                        <input
                            type="text"
                            required
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-600 focus:bg-white transition-all"
                        />
                    </div>

                    {/* Message Body with LaTeX support */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 flex justify-between">
                            <span>Message Content *</span>
                            <span className="text-slate-400 font-normal lowercase">(LaTeX formatting supported)</span>
                        </label>
                        <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:border-blue-600">
                            <LatexEditor
                                value={message}
                                onChange={setMessage}
                                placeholder="Write your inquiry or instructions for the author..."
                            />
                        </div>
                    </div>

                    {/* Live Preview */}
                    {message && (
                        <div className="p-3.5 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-xs text-slate-700 space-y-1">
                            <span className="text-[9px] font-black uppercase text-blue-600 block">Preview:</span>
                            <LatexRenderer content={message} />
                        </div>
                    )}

                    <div className="pt-2 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSending || !message.trim()}
                            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-blue-100 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                            {isSending ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Transmitting...</span>
                                </>
                            ) : (
                                <>
                                    <Send size={15} />
                                    <span>Send Message</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactAuthorModal;