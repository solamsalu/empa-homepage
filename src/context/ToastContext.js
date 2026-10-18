// src/context/ToastContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type }]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            
            {/* Floating Toast Notification Container */}
            <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-start gap-3 transform transition-all animate-in slide-in-from-top-3 duration-200 ${
                            toast.type === 'success' ? 'bg-white border-emerald-200 text-emerald-900' :
                            toast.type === 'error' ? 'bg-white border-rose-200 text-rose-900' :
                            toast.type === 'warning' ? 'bg-white border-amber-200 text-amber-900' :
                            'bg-white border-blue-200 text-blue-900'
                        }`}
                    >
                        <div className="mt-0.5 shrink-0">
                            {toast.type === 'success' && <CheckCircle2 size={18} className="text-emerald-600" />}
                            {toast.type === 'error' && <AlertCircle size={18} className="text-rose-600" />}
                            {toast.type === 'warning' && <AlertTriangle size={18} className="text-amber-600" />}
                            {toast.type === 'info' && <Info size={18} className="text-blue-600" />}
                        </div>

                        <p className="text-xs font-bold leading-relaxed flex-1">
                            {toast.message}
                        </p>

                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-slate-400 hover:text-slate-600 p-0.5"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
};