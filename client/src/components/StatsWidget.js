import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import useAuth from '../hooks/useAuth';
import { AuthContext } from '../context/AuthContext';

dayjs.extend(isoWeek);

const WORKOUT_EMOJIS = {
    'силовая': '💪',
    'кардио': '🏃',
    'растяжка': '🧘',
    'йога': '🌿',
    'плавание': '🏊',
    'другое': '🏋️',
};

const StatCard = ({ emoji, label, value, sub, accent }) => (
    <div className={`flex-1 min-w-0 rounded-xl p-3 flex flex-col gap-0.5 ${accent}`}>
        <span className="text-lg">{emoji}</span>
        <span className="text-xl font-black text-gray-800 dark:text-gray-100 leading-none">{value}</span>
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 leading-tight">{label}</span>
        {sub && <span className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight">{sub}</span>}
    </div>
);

const StatsWidget = () => {
    const { isAuthenticated } = useAuth();
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) { setLoading(false); return; }

        const load = async () => {
            try {
                setLoading(true);
                const res = await axios.get('/api/workouts');
                const all = res.data;

                const now = dayjs();
                const weekStart = now.startOf('isoWeek');
                const monthStart = now.startOf('month');

                const thisWeek = all.filter(w => dayjs(w.date).isAfter(weekStart.subtract(1, 'ms')));
                const thisMonth = all.filter(w => dayjs(w.date).isAfter(monthStart.subtract(1, 'ms')));

                // Streak — consecutive days with at least 1 workout up to today
                const datesSet = new Set(all.map(w => dayjs(w.date).format('YYYY-MM-DD')));
                let streak = 0;
                let d = now;
                while (datesSet.has(d.format('YYYY-MM-DD'))) {
                    streak++;
                    d = d.subtract(1, 'day');
                }

                // Most common type this month
                const typeCounts = {};
                thisMonth.forEach(w => { typeCounts[w.type] = (typeCounts[w.type] || 0) + 1; });
                const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];

                const weekMinutes = thisWeek.reduce((s, w) => s + (w.duration || 0), 0);
                const monthMinutes = thisMonth.reduce((s, w) => s + (w.duration || 0), 0);

                // BMI if user data available
                let bmi = null;
                if (user?.weight && user?.height) {
                    const h = user.height / 100;
                    bmi = (user.weight / (h * h)).toFixed(1);
                }

                setStats({
                    weekCount: thisWeek.length,
                    weekMinutes,
                    monthCount: thisMonth.length,
                    monthMinutes,
                    streak,
                    topType: topType ? topType[0] : null,
                    totalAll: all.length,
                    bmi,
                });
            } catch {
                // silently fail
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [isAuthenticated, user]);

    if (!isAuthenticated) return null;

    const bmiCategory = (bmi) => {
        const b = parseFloat(bmi);
        if (b < 18.5) return { label: 'Дефицит', color: 'text-blue-500' };
        if (b < 25) return { label: 'Норма', color: 'text-green-500' };
        if (b < 30) return { label: 'Избыток', color: 'text-yellow-500' };
        return { label: 'Ожирение', color: 'text-red-500' };
    };

    return (
        <div className="card-hover bg-white dark:bg-gray-800 rounded-2xl shadow-card p-5">
            <h2 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-sm">📊</span>
                Моя статистика
            </h2>

            {loading ? (
                <div className="grid grid-cols-2 gap-2">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="skeleton h-16 rounded-xl" />
                    ))}
                </div>
            ) : !stats ? null : (
                <>
                    {/* Main stats grid */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                        <StatCard
                            emoji="📅"
                            label="Тренировок за неделю"
                            value={stats.weekCount}
                            sub={`${stats.weekMinutes} мин`}
                            accent="bg-blue-50 dark:bg-blue-900/20"
                        />
                        <StatCard
                            emoji="🗓️"
                            label="Тренировок за месяц"
                            value={stats.monthCount}
                            sub={`${stats.monthMinutes} мин`}
                            accent="bg-purple-50 dark:bg-purple-900/20"
                        />
                        <StatCard
                            emoji="🔥"
                            label="Серия дней"
                            value={stats.streak}
                            sub={stats.streak > 0 ? 'дней подряд' : 'начни сегодня!'}
                            accent={stats.streak > 2 ? "bg-orange-50 dark:bg-orange-900/20" : "bg-gray-50 dark:bg-gray-700/30"}
                        />
                        <StatCard
                            emoji="🏆"
                            label="Всего тренировок"
                            value={stats.totalAll}
                            sub="за всё время"
                            accent="bg-green-50 dark:bg-green-900/20"
                        />
                    </div>

                    {/* Top type + BMI row */}
                    <div className="flex gap-2">
                        {stats.topType && (
                            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700/40 rounded-xl">
                                <span className="text-lg">{WORKOUT_EMOJIS[stats.topType] || '🏋️'}</span>
                                <div className="min-w-0">
                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wide leading-none mb-0.5">Любимая</p>
                                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 capitalize truncate">{stats.topType}</p>
                                </div>
                            </div>
                        )}
                        {stats.bmi && (
                            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700/40 rounded-xl">
                                <span className="text-lg">⚖️</span>
                                <div className="min-w-0">
                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wide leading-none mb-0.5">ИМТ</p>
                                    <p className={`text-xs font-semibold ${bmiCategory(stats.bmi).color}`}>
                                        {stats.bmi} · {bmiCategory(stats.bmi).label}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default StatsWidget;
