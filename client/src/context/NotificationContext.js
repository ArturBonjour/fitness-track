import React, { createContext, useState } from 'react';

export const NotificationContext = createContext();

const ICONS = {
    success: (
        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    ),
    error: (
        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
    info: (
        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
        </svg>
    ),
};

const BG = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-primary',
};

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);
    const [progress, setProgress] = useState(100);

    const showNotification = (message, type = 'info') => {
        setNotification({ message, type });
        setProgress(100);

        const DURATION = 3500;
        const step = 100 / (DURATION / 50);
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev <= 0) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - step;
            });
        }, 50);

        setTimeout(() => {
            clearInterval(interval);
            setNotification(null);
            setProgress(100);
        }, DURATION);
    };

    return (
        <NotificationContext.Provider value={{ notification, showNotification }}>
            {children}
            {notification && (
                <div
                    className={`toast-enter fixed bottom-5 right-5 ${BG[notification.type]} text-white rounded-xl shadow-xl max-w-sm w-full z-50 overflow-hidden`}
                    role="alert"
                    aria-live="assertive"
                >
                    <div className="flex items-start gap-3 p-4 pr-5">
                        {ICONS[notification.type]}
                        <p className="flex-1 text-sm font-medium leading-snug">{notification.message}</p>
                        <button
                            onClick={() => setNotification(null)}
                            className="text-white/70 hover:text-white transition-colors mt-0.5"
                            aria-label="Закрыть уведомление"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    {/* Progress bar */}
                    <div className="h-1 bg-white/20">
                        <div
                            className="h-full bg-white/60 transition-none"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}
        </NotificationContext.Provider>
    );
};