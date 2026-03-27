import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Импортируем axios для работы с API
import axios from 'axios';

// Настройка глобальных параметров axios
const token = localStorage.getItem('token');
if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Добавляем перехватчики запросов для логгирования и отладки
axios.interceptors.request.use(
    config => {
        console.log('Исходящий запрос:', config.url);
        return config;
    },
    error => {
        console.error('Ошибка запроса:', error);
        return Promise.reject(error);
    }
);

// Добавляем перехватчики ответов для обработки ошибок
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        console.error('Ошибка ответа:', error.response?.status, error.response?.data || error.message);
        return Promise.reject(error);
    }
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Router>
            <NotificationProvider>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </NotificationProvider>
        </Router>
    </React.StrictMode>
); 