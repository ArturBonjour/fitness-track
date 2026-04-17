import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Router>
            <ThemeProvider>
                <NotificationProvider>
                    <AuthProvider>
                        <App />
                    </AuthProvider>
                </NotificationProvider>
            </ThemeProvider>
        </Router>
    </React.StrictMode>
);
