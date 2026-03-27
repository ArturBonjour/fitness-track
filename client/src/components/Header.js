import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
    const { isAuthenticated, user, logout } = useContext(AuthContext);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <header className="bg-primary shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Левая часть с приветствием */}
                    <div className="flex items-center">
                        {isAuthenticated && (
                            <span className="text-white text-sm font-medium">
                                Добро пожаловать, {user?.name}
                            </span>
                        )}
                    </div>

                    {/* Центральная часть с названием */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
                        <Link to="/" className="flex flex-col items-center">
                            <h1 className="text-xl font-bold text-white">Bogdanov</h1>
                            <h2 className="text-lg font-medium text-white">FitTrack</h2>
                        </Link>
                    </div>

                    {/* Правая часть с навигацией */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <Link to="/" className="text-white hover:bg-purple-900 px-3 py-2 rounded-md text-sm font-medium">
                                    Главная
                                </Link>
                                <Link to="/profile" className="text-white hover:bg-purple-900 px-3 py-2 rounded-md text-sm font-medium">
                                    Профиль
                                </Link>
                                <button
                                    onClick={logout}
                                    className="text-white hover:bg-purple-900 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Выйти
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-white hover:bg-purple-900 px-3 py-2 rounded-md text-sm font-medium">
                                    Вход
                                </Link>
                                <Link to="/register" className="text-white hover:bg-purple-900 px-3 py-2 rounded-md text-sm font-medium">
                                    Регистрация
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Мобильное меню */}
            {mobileMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-primary">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/"
                                    className="text-white hover:bg-purple-900 block px-3 py-2 rounded-md text-base font-medium"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Главная
                                </Link>
                                <Link
                                    to="/profile"
                                    className="text-white hover:bg-purple-900 block px-3 py-2 rounded-md text-base font-medium"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Профиль
                                </Link>
                                <button
                                    onClick={() => {
                                        logout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="text-white hover:bg-purple-900 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                                >
                                    Выйти
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-white hover:bg-purple-900 block px-3 py-2 rounded-md text-base font-medium"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Вход
                                </Link>
                                <Link
                                    to="/register"
                                    className="text-white hover:bg-purple-900 block px-3 py-2 rounded-md text-base font-medium"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Регистрация
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header; 