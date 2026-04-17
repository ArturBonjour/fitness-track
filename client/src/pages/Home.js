import React, { useContext } from 'react';
import Calendar from '../components/Calendar';
import CalorieCalculator from '../components/CalorieCalculator';
import WorkoutRecommendations from '../components/WorkoutRecommendations';
import StatsWidget from '../components/StatsWidget';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const HeroSection = () => (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-light text-white px-6 py-10 mb-8 shadow-card">
        {/* Decoration circles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full pointer-events-none" aria-hidden="true" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full pointer-events-none" aria-hidden="true" />

        <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 rounded-full text-xs font-semibold uppercase tracking-widest mb-4">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Добро пожаловать!
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-2 leading-tight">
                Bogdanov <span className="text-purple-200">FitTrack</span>
            </h1>
            <p className="text-white/70 text-sm max-w-md leading-relaxed">
                Планируй тренировки, отслеживай цели и следи за прогрессом — всё в одном месте.
            </p>
            <div className="flex gap-3 mt-6">
                <Link
                    to="/profile"
                    className="btn-press px-4 py-2 bg-white text-primary rounded-xl text-sm font-semibold hover:bg-white/90 transition-all duration-200 shadow-sm"
                >
                    Мой профиль
                </Link>
            </div>
        </div>
    </div>
);

const Home = () => {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <div className="container mx-auto px-4 py-6">
            {isAuthenticated && <HeroSection />}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="animate-fade-in" style={{ animationDelay: '0ms' }}>
                    <Calendar />
                </div>
                <div className="space-y-6">
                    <div className="animate-fade-in" style={{ animationDelay: '60ms' }}>
                        <StatsWidget />
                    </div>
                    <div className="animate-fade-in" style={{ animationDelay: '120ms' }}>
                        <CalorieCalculator />
                    </div>
                    <div className="animate-fade-in" style={{ animationDelay: '180ms' }}>
                        <WorkoutRecommendations />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
