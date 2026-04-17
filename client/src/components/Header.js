import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const NavLink = ({ to, children, onClick }) => {
    const { pathname } = useLocation();
    const active = pathname === to;
    return (
        <Link
            to={to}
            onClick={onClick}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${active
                ? 'bg-white/20 text-white shadow-inner'
                : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
        >
            {children}
        </Link>
    );
};

/* User avatar: coloured circle with initial letter */
const UserAvatar = ({ name }) => {
    const initial = name ? name.charAt(0).toUpperCase() : '?';
    return (
        <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold text-white border border-white/30 select-none">
            {initial}
        </span>
    );
};

const Header = () => {
    const { isAuthenticated, user, logout } = useContext(AuthContext);
    const { isDark, toggleTheme } = useContext(ThemeContext);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const closeMobile = () => setMobileMenuOpen(false);

    return (
        <header className="bg-gradient-to-r from-primary to-primary-light shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Left — greeting */}
                    <div className="hidden md:flex items-center min-w-[180px]">
                        {isAuthenticated && (
                            <span className="text-white/80 text-sm flex items-center gap-2">
                                👋 <span className="font-medium text-white">{user?.name}</span>
                            </span>
                        )}
                    </div>

                    {/* Center — logo */}
                    <div className="absolute left-1/2 -translate-x-1/2 text-center">
                        <Link to="/" className="flex flex-col items-center group" aria-label="Bogdanov FitTrack — главная">
                            <span className="text-xl font-black text-white leading-none tracking-tight group-hover:opacity-90 transition-opacity">
                                Bogdanov<span className="text-purple-300 ml-0.5">FitTrack</span>
                            </span>
                            <span className="text-[10px] text-white/50 uppercase tracking-widest mt-0.5">Your fitness journal</span>
                        </Link>
                    </div>

                    {/* Right — nav */}
                    <div className="flex items-center gap-1">
                        {/* Theme toggle */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="text-white/80 hover:text-white hover:bg-white/10 w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 text-base"
                            aria-label="Сменить тему"
                            title={isDark ? 'Светлая тема' : 'Тёмная тема'}
                        >
                            {isDark ? '☀️' : '🌙'}
                        </button>

                        {/* Desktop nav */}
                        <div className="hidden md:flex items-center gap-1">
                            {isAuthenticated ? (
                                <>
                                    <NavLink to="/">Главная</NavLink>
                                    <NavLink to="/profile">Профиль</NavLink>
                                    <div className="flex items-center gap-2 ml-1">
                                        <UserAvatar name={user?.name} />
                                        <button
                                            onClick={logout}
                                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200"
                                            title="Выйти из аккаунта"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Выйти
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <NavLink to="/login">Вход</NavLink>
                                    <Link
                                        to="/register"
                                        className="ml-1 btn-press px-4 py-2 rounded-lg text-sm font-semibold bg-white text-primary hover:bg-white/90 transition-all duration-200 shadow-sm"
                                    >
                                        Регистрация
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile burger */}
                        <button
                            type="button"
                            className="md:hidden text-white/90 hover:text-white hover:bg-white/10 w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200"
                            onClick={() => setMobileMenuOpen((prev) => !prev)}
                            aria-expanded={mobileMenuOpen}
                            aria-label="Открыть меню"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {mobileMenuOpen
                                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                }
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}
                aria-hidden={!mobileMenuOpen}
            >
                <div className="px-4 pb-4 pt-2 space-y-1 bg-primary-dark/40 backdrop-blur-sm">
                    {isAuthenticated ? (
                        <>
                            <div className="flex items-center gap-2 px-3 py-2">
                                <UserAvatar name={user?.name} />
                                <span className="text-white/80 text-sm font-medium">{user?.name}</span>
                            </div>
                            <NavLink to="/" onClick={closeMobile}>Главная</NavLink>
                            <NavLink to="/profile" onClick={closeMobile}>Профиль</NavLink>
                            <button
                                onClick={() => { logout(); closeMobile(); }}
                                className="flex items-center gap-1.5 w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Выйти
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" onClick={closeMobile}>Вход</NavLink>
                            <NavLink to="/register" onClick={closeMobile}>Регистрация</NavLink>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
