import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute -top-32 -left-32 w-80 h-80 bg-primary opacity-10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
            <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-purple-400 opacity-10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

            {/* Floating illustration */}
            <div className="empty-state-icon mb-8" aria-hidden="true">
                <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="80" cy="80" r="76" fill="rgba(74,20,140,0.07)" />
                    <circle cx="80" cy="80" r="60" fill="rgba(74,20,140,0.10)" />
                    <text x="50%" y="56%" textAnchor="middle" dominantBaseline="middle"
                        fontSize="64" fontWeight="bold" fill="#4a148c" opacity="0.85"
                        style={{ fontFamily: 'Roboto, sans-serif' }}>
                        ?
                    </text>
                </svg>
            </div>

            {/* Number */}
            <h1 className="text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400 mb-2 leading-none select-none"
                style={{ fontFamily: 'Roboto, sans-serif' }}>
                404
            </h1>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-2 mb-3">
                Страница не найдена
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8 leading-relaxed">
                Такой страницы не существует или она была перемещена. Вернитесь на главную и продолжайте тренировки!
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
                <Link
                    to="/"
                    className="btn-press inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white py-2.5 px-6 rounded-xl font-medium shadow-md transition-all duration-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    На главную
                </Link>
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="btn-press inline-flex items-center gap-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 py-2.5 px-6 rounded-xl font-medium transition-all duration-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Назад
                </button>
            </div>
        </div>
    );
};

export default NotFound;