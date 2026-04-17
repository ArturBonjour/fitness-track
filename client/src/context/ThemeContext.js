import React, { createContext, useEffect, useMemo, useState } from 'react';

export const ThemeContext = createContext();

const THEME_STORAGE_KEY = 'fittrack-theme';

const resolveInitialTheme = () => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }

    return 'light';
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(resolveInitialTheme);

    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle('dark', theme === 'dark');
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);

    const value = useMemo(() => ({
        theme,
        isDark: theme === 'dark',
        toggleTheme: () => setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'))
    }), [theme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
