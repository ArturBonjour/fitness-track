import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center py-16">
            <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
            <p className="text-xl text-gray-700 mb-8">Страница не найдена</p>
            <p className="text-gray-600 mb-8 text-center max-w-md">
                Извините, но страница, которую вы ищете, не существует или была перемещена.
            </p>
            <Link
                to="/"
                className="bg-primary hover:bg-purple-800 text-white py-2 px-6 rounded-md"
            >
                Вернуться на главную
            </Link>
        </div>
    );
};

export default NotFound; 