import React, { createContext, useContext, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import '../styles/Toast.css';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 4000);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="toast-container">
                {toasts.map(t => (
                    <div key={t.id} className={`toast-card toast-${t.type}`}>
                        <div className="toast-icon">
                            {t.type === 'success' && <CheckCircle size={20} color="#10b981" />}
                            {t.type === 'error' && <XCircle size={20} color="#ef4444" />}
                            {t.type === 'warning' && <AlertTriangle size={20} color="#f59e0b" />}
                            {t.type === 'info' && <Info size={20} color="#3b82f6" />}
                        </div>
                        <div className="toast-content">{t.message}</div>
                        <button className="toast-close" onClick={() => removeToast(t.id)}>
                            <X size={16} />
                        </button>
                        <div className="toast-progress"></div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);