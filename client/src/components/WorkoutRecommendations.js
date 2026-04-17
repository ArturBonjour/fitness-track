import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GOAL_OPTIONS = [
    { value: 'weightLoss', label: '🔥 Похудение' },
    { value: 'muscleGain', label: '💪 Набор мышечной массы' },
    { value: 'endurance', label: '🏃 Выносливость' },
];

const LEVEL_OPTIONS = [
    { value: 'beginner', label: '🌱 Начинающий' },
    { value: 'intermediate', label: '⚡ Средний' },
    { value: 'advanced', label: '🚀 Продвинутый' },
];

const SkeletonLine = ({ width = 'w-full' }) => (
    <div className={`skeleton h-4 rounded ${width} mb-2`} />
);

const WorkoutRecommendations = () => {
    const [selectedGoal, setSelectedGoal] = useState('weightLoss');
    const [selectedLevel, setSelectedLevel] = useState('beginner');
    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        let cancelled = false;
        const fetchRecommendation = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`/api/recommendations/${selectedGoal}/${selectedLevel}`);
                if (!cancelled) setRecommendation(response.data);
            } catch (err) {
                if (!cancelled) setError('Не удалось загрузить рекомендации');
                console.error('Ошибка при загрузке рекомендаций:', err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchRecommendation();
        return () => { cancelled = true; };
    }, [selectedGoal, selectedLevel, retryCount]);

    return (
        <div className="card-hover bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-5 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-base">📋</span>
                Рекомендации
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                        Цель
                    </label>
                    <select
                        value={selectedGoal}
                        onChange={(e) => setSelectedGoal(e.target.value)}
                        className="input-field text-sm"
                    >
                        {GOAL_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                        Уровень
                    </label>
                    <select
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        className="input-field text-sm"
                    >
                        {LEVEL_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading && (
                <div className="space-y-3 animate-pulse">
                    <SkeletonLine width="w-3/4" />
                    <SkeletonLine />
                    <SkeletonLine width="w-5/6" />
                    <SkeletonLine width="w-2/3" />
                </div>
            )}

            {error && !loading && (
                <div className="flex flex-col items-center py-8 text-center">
                    <span className="text-4xl mb-3">⚠️</span>
                    <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
                    <button
                        type="button"
                        onClick={() => setRetryCount((c) => c + 1)}
                        className="mt-3 text-primary dark:text-purple-400 text-sm hover:underline"
                    >
                        Попробовать снова
                    </button>
                </div>
            )}

            {recommendation && !loading && !error && (
                <div className="space-y-4 animate-fade-in">
                    <div className="flex items-start gap-3 p-3 bg-primary/5 dark:bg-primary/10 rounded-xl">
                        <span className="text-xl">🗓️</span>
                        <div>
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Частота</p>
                            <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{recommendation.frequency}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-primary/5 dark:bg-primary/10 rounded-xl">
                        <span className="text-xl">⏱️</span>
                        <div>
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Длительность</p>
                            <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{recommendation.duration}</p>
                        </div>
                    </div>
                    {recommendation.types && recommendation.types.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Типы тренировок</p>
                            <div className="flex flex-wrap gap-2">
                                {recommendation.types.map((type, index) => (
                                    <span key={index} className="px-2.5 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 rounded-full text-xs font-medium">
                                        {type}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    {recommendation.tips && recommendation.tips.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">💡 Советы</p>
                            <ul className="space-y-1.5">
                                {recommendation.tips.map((tip, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                        <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default WorkoutRecommendations;
