import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import axios from 'axios';
import dayjs from 'dayjs';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

/* ── Helpers ─────────────────────────────────────────────── */
const FieldLabel = ({ children }) => (
    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">{children}</p>
);
const FieldValue = ({ children }) => (
    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{children}</p>
);

const WORKOUT_EMOJIS = {
    'силовая': '💪', 'кардио': '🏃', 'растяжка': '🧘',
    'йога': '🌿', 'плавание': '🏊', 'другое': '🏋️',
};
const WORKOUT_TYPES = ['все', 'силовая', 'кардио', 'растяжка', 'йога', 'плавание', 'другое'];

const Profile = () => {
    const { user, updateUser } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const [workouts, setWorkouts] = useState([]);
    const [goals, setGoals] = useState([]);
    const [weightHistory, setWeightHistory] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deletingWorkoutId, setDeletingWorkoutId] = useState(null);
    const [deletingGoalId, setDeletingGoalId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', gender: '', age: '', weight: '', height: '',
    });
    const [filter, setFilter] = useState({
        startDate: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
        endDate: dayjs().format('YYYY-MM-DD'),
        type: 'все',
    });

    // Загрузка данных пользователя
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                gender: user.gender || '',
                age: user.age || '',
                weight: user.weight || '',
                height: user.height || '',
            });
        }
    }, [user]);

    // Загрузка тренировок, целей и истории веса
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [workoutsRes, goalsRes, weightHistoryRes] = await Promise.all([
                    axios.get('/api/workouts'),
                    axios.get('/api/goals'),
                    axios.get('/api/users/weight-history'),
                ]);
                setWorkouts(workoutsRes.data);
                setGoals(goalsRes.data);
                setWeightHistory(weightHistoryRes.data);
            } catch (err) {
                console.error('Ошибка при загрузке данных:', err);
            }
        };
        fetchData();
    }, []);

    // Обработка изменения формы
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Обработка отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateUser(formData);
            setEditMode(false);
            showNotification('Профиль успешно обновлён', 'success');
            const weightHistoryRes = await axios.get('/api/users/weight-history');
            setWeightHistory(weightHistoryRes.data);
        } catch (err) {
            showNotification(err.response?.data?.message || 'Ошибка при обновлении профиля', 'error');
        } finally {
            setSaving(false);
        }
    };

    // Обработка изменения фильтра
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter(prev => ({ ...prev, [name]: value }));
    };

    // Удаление тренировки
    const handleDeleteWorkout = async (workoutId) => {
        try {
            setDeletingWorkoutId(workoutId);
            await axios.delete(`/api/workouts/${workoutId}`);
            setWorkouts(prev => prev.filter(w => w._id !== workoutId));
            showNotification('Тренировка удалена', 'success');
        } catch (err) {
            showNotification(err.response?.data?.message || 'Ошибка при удалении тренировки', 'error');
        } finally {
            setDeletingWorkoutId(null);
        }
    };

    // Удаление цели
    const handleDeleteGoal = async (goalId) => {
        try {
            setDeletingGoalId(goalId);
            await axios.delete(`/api/goals/${goalId}`);
            setGoals(prev => prev.filter(g => g._id !== goalId));
            showNotification('Цель удалена', 'success');
        } catch (err) {
            showNotification(err.response?.data?.message || 'Ошибка при удалении цели', 'error');
        } finally {
            setDeletingGoalId(null);
        }
    };

    // Фильтрация тренировок
    const filteredWorkouts = workouts.filter(workout => {
        const workoutDate = dayjs(workout.date);
        const startDate = dayjs(filter.startDate);
        const endDate = dayjs(filter.endDate);
        const dateInRange = workoutDate.isAfter(startDate.subtract(1, 'ms')) && workoutDate.isBefore(endDate.add(1, 'day'));
        const typeMatches = filter.type === 'все' || workout.type === filter.type;
        return dateInRange && typeMatches;
    });

    // Chart: weight history
    const weightChartData = {
        labels: weightHistory.map(item => dayjs(item.date).format('DD.MM')),
        datasets: [{
            label: 'Вес (кг)',
            data: weightHistory.map(item => item.weight),
            borderColor: '#4a148c',
            backgroundColor: 'rgba(74,20,140,0.08)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: '#4a148c',
        }],
    };

    // Chart: weekly activity bar
    const workoutsByWeek = workouts.reduce((acc, workout) => {
        const weekStart = dayjs(workout.date).startOf('isoWeek').format('YYYY-MM-DD');
        acc[weekStart] = (acc[weekStart] || 0) + 1;
        return acc;
    }, {});
    const sortedWeeks = Object.keys(workoutsByWeek).sort();
    const workoutChartData = {
        labels: sortedWeeks.map(d => `${dayjs(d).format('DD.MM')}`),
        datasets: [{
            label: 'Тренировок',
            data: sortedWeeks.map(k => workoutsByWeek[k]),
            backgroundColor: 'rgba(74,20,140,0.75)',
            borderRadius: 6,
            borderSkipped: false,
        }],
    };

    const baseChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { backgroundColor: '#4a148c', titleFont: { size: 12 }, bodyFont: { size: 12 } },
        },
        scales: {
            x: { grid: { display: false }, ticks: { font: { size: 11 } } },
            y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 11 } } },
        },
    };

    // BMI
    const bmi = user?.weight && user?.height
        ? (user.weight / Math.pow(user.height / 100, 2)).toFixed(1)
        : null;
    const bmiInfo = (b) => {
        const v = parseFloat(b);
        if (v < 18.5) return { label: 'Дефицит массы', color: 'text-blue-500', bar: 'bg-blue-400' };
        if (v < 25) return { label: 'Норма', color: 'text-green-500', bar: 'bg-green-500' };
        if (v < 30) return { label: 'Избыток массы', color: 'text-yellow-500', bar: 'bg-yellow-400' };
        return { label: 'Ожирение', color: 'text-red-500', bar: 'bg-red-500' };
    };
    const bmiData = bmi ? bmiInfo(bmi) : null;

    // Goal progress
    const goalProgress = (goal) => {
        const range = goal.targetValue - goal.startValue;
        if (range === 0) return 0;
        return Math.max(0, Math.min(100, Math.round(((goal.currentValue - goal.startValue) / range) * 100)));
    };

    return (
        <div className="max-w-4xl mx-auto px-1 py-2 space-y-6">
            {/* ── Page title ────────────────────────────────────── */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-xl shadow-card">
                    👤
                </div>
                <div>
                    <h1 className="text-2xl font-black text-gray-800 dark:text-gray-100">Профиль</h1>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Личные данные и аналитика</p>
                </div>
            </div>
            {/* ── Personal data card ───────────────────────────── */}
            <div className="card-hover bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-base font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-sm">📋</span>
                        Личные данные
                    </h2>
                    <button
                        onClick={() => setEditMode(!editMode)}
                        className="text-sm font-semibold text-primary dark:text-purple-400 hover:underline"
                    >
                        {editMode ? 'Отмена' : 'Редактировать'}
                    </button>
                </div>

                {editMode ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Имя</label>
                                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange}
                                    className="input-field" required />
                            </div>
                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Пол</label>
                                <select id="gender" name="gender" value={formData.gender} onChange={handleChange}
                                    className="input-field" required>
                                    <option value="">Выберите пол</option>
                                    <option value="male">Мужской</option>
                                    <option value="female">Женский</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Возраст</label>
                                <input type="number" id="age" name="age" min="15" max="100" value={formData.age} onChange={handleChange}
                                    className="input-field" required />
                            </div>
                            <div>
                                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Вес (кг)</label>
                                <input type="number" id="weight" name="weight" min="30" max="200" value={formData.weight} onChange={handleChange}
                                    className="input-field" required />
                            </div>
                            <div>
                                <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Рост (см)</label>
                                <input type="number" id="height" name="height" min="100" max="250" value={formData.height} onChange={handleChange}
                                    className="input-field" required />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" disabled={saving}
                                className="btn-press bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white py-2 px-6 rounded-xl font-medium shadow-md flex items-center gap-2 disabled:opacity-60">
                                {saving ? (
                                    <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                                Сохранить
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                            {[
                                { label: 'Имя', value: user?.name },
                                { label: 'Email', value: user?.email },
                                { label: 'Пол', value: user?.gender === 'male' ? '♂ Мужской' : '♀ Женский' },
                                { label: 'Возраст', value: `${user?.age} лет` },
                                { label: 'Вес', value: `${user?.weight} кг` },
                                { label: 'Рост', value: `${user?.height} см` },
                            ].map(({ label, value }) => (
                                <div key={label} className="bg-gray-50 dark:bg-gray-700/40 rounded-xl px-3 py-2">
                                    <FieldLabel>{label}</FieldLabel>
                                    <FieldValue>{value}</FieldValue>
                                </div>
                            ))}
                        </div>
                        {/* BMI display */}
                        {bmi && (
                            <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30">
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wide mb-0.5">ИМТ</p>
                                    <p className={`text-lg font-black ${bmiData.color}`}>{bmi} <span className="text-sm font-semibold">— {bmiData.label}</span></p>
                                </div>
                                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                    <div className={`h-full ${bmiData.bar} rounded-full transition-all`} style={{ width: `${Math.min(100, ((parseFloat(bmi) - 15) / 25) * 100)}%` }} />
                                </div>
                                <div className="text-xs text-gray-400 whitespace-nowrap">15 — 40+</div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* ── Weight chart ─────────────────────────────────── */}
            <div className="card-hover bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
                <h2 className="text-base font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-4">
                    <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-sm">⚖️</span>
                    Динамика веса
                </h2>
                {weightHistory.length > 0 ? (
                    <div className="h-52">
                        <Line data={weightChartData} options={baseChartOptions} />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400 dark:text-gray-500">
                        <span className="text-4xl mb-2">📉</span>
                        <p className="text-sm">История изменения веса пока отсутствует</p>
                        <p className="text-xs mt-1">Обновите профиль, чтобы начать отслеживание</p>
                    </div>
                )}
            </div>

            {/* ── Workout activity ─────────────────────────────── */}
            <div className="card-hover bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <h2 className="text-base font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center text-sm">📈</span>
                        Активность
                    </h2>
                    <div className="flex flex-wrap items-center gap-2">
                        <select name="type" value={filter.type} onChange={handleFilterChange}
                            className="input-field text-xs py-1.5 px-2 h-auto">
                            {WORKOUT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <input type="date" name="startDate" value={filter.startDate} onChange={handleFilterChange}
                            className="input-field text-xs py-1.5 px-2 h-auto" />
                        <span className="text-gray-400 text-xs">—</span>
                        <input type="date" name="endDate" value={filter.endDate} onChange={handleFilterChange}
                            className="input-field text-xs py-1.5 px-2 h-auto" />
                    </div>
                </div>

                {workouts.length > 0 ? (
                    <>
                        <div className="h-44 mb-6">
                            <Bar data={workoutChartData} options={baseChartOptions} />
                        </div>
                        <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-700/50">
                                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Дата</th>
                                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Тип</th>
                                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Время</th>
                                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Длительность</th>
                                        <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Действия</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {filteredWorkouts.length > 0 ? filteredWorkouts.map(workout => (
                                        <tr key={workout._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                                {dayjs(workout.date).format('DD.MM.YYYY')}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">
                                                <span className="mr-1.5">{WORKOUT_EMOJIS[workout.type] || '🏋️'}</span>{workout.type}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{workout.time}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{workout.duration} мин</td>
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    onClick={() => handleDeleteWorkout(workout._id)}
                                                    disabled={deletingWorkoutId === workout._id}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    title="Удалить тренировку"
                                                >
                                                    {deletingWorkoutId === workout._id ? (
                                                        <span className="h-3.5 w-3.5 rounded-full border-2 border-red-400 border-t-transparent animate-spin" />
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    )}
                                                    Удалить
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="text-center py-6 text-sm text-gray-400 dark:text-gray-500">
                                                Нет тренировок по выбранным фильтрам
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400 dark:text-gray-500">
                        <span className="text-4xl mb-2">🏋️</span>
                        <p className="text-sm">Тренировки ещё не добавлены</p>
                        <p className="text-xs mt-1">Добавьте первую тренировку в календаре</p>
                    </div>
                )}
            </div>

            {/* ── Goals ───────────────────────────────────────── */}
            <div className="card-hover bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
                <h2 className="text-base font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-4">
                    <span className="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-sm">🎯</span>
                    Цели
                </h2>

                {goals.length > 0 ? (
                    <div className="space-y-3">
                        {goals.map(goal => {
                            const pct = goalProgress(goal);
                            return (
                                <div key={goal._id}
                                    className="rounded-xl border border-gray-100 dark:border-gray-700 p-4 hover:border-primary/30 dark:hover:border-purple-500/30 transition-colors">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{goal.title}</h3>
                                            {goal.description && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{goal.description}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-lg ${
                                                goal.completed
                                                    ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400'
                                                    : dayjs(goal.deadline).isBefore(dayjs())
                                                        ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'
                                                        : 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400'
                                            }`}>
                                                {goal.completed ? '✓ Выполнено' : `До ${dayjs(goal.deadline).format('DD.MM.YY')}`}
                                            </span>
                                            <button
                                                onClick={() => handleDeleteGoal(goal._id)}
                                                disabled={deletingGoalId === goal._id}
                                                className="flex items-center justify-center w-7 h-7 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                title="Удалить цель"
                                            >
                                                {deletingGoalId === goal._id ? (
                                                    <span className="h-3.5 w-3.5 rounded-full border-2 border-red-400 border-t-transparent animate-spin" />
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-1">
                                        <div
                                            className={`h-full rounded-full transition-all ${goal.completed ? 'bg-green-500' : 'bg-primary'}`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
                                        <span>{goal.startValue} {goal.unit}</span>
                                        <span className="font-semibold text-primary dark:text-purple-400">{pct}%</span>
                                        <span>{goal.targetValue} {goal.unit}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400 dark:text-gray-500">
                        <span className="text-4xl mb-2">🎯</span>
                        <p className="text-sm">Цели ещё не созданы</p>
                        <p className="text-xs mt-1">Добавьте цель через календарь</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;