import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const CalorieCalculator = () => {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        activityLevel: 'moderate',
        goal: 'maintain'
    });
    const [result, setResult] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        if (!user) return;

        // Формула Харриса-Бенедикта
        let bmr;
        if (user.gender === 'male') {
            bmr = 88.362 + (13.397 * user.weight) + (4.799 * user.height) - (5.677 * user.age);
        } else {
            bmr = 447.593 + (9.247 * user.weight) + (3.098 * user.height) - (4.330 * user.age);
        }

        // Коэффициенты активности
        const activityMultipliers = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725,
            veryActive: 1.9
        };

        // Целевые коэффициенты
        const goalMultipliers = {
            lose: 0.85,
            maintain: 1,
            gain: 1.15
        };

        const tdee = bmr * activityMultipliers[formData.activityLevel];
        const targetCalories = Math.round(tdee * goalMultipliers[formData.goal]);

        setResult({
            bmr: Math.round(bmr),
            tdee: Math.round(tdee),
            targetCalories
        });
    }, [user, formData.activityLevel, formData.goal]);

    if (!user) {
        return (
            <div className="card-hover bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-base">🔥</span>
                    Калькулятор калорий
                </h2>
                <div className="flex flex-col items-center py-10 text-center">
                    <span className="text-5xl mb-4 empty-state-icon">🔒</span>
                    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
                        Войдите в систему, чтобы видеть персональный расчёт калорийности
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="card-hover bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-5 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-base">🔥</span>
                Калькулятор калорий
            </h2>

            {/* User data chip */}
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-xs text-gray-600 dark:text-gray-300 flex flex-wrap gap-3">
                <span>⚧ {user.gender === 'male' ? 'Мужской' : 'Женский'}</span>
                <span>🎂 {user.age} лет</span>
                <span>⚖️ {user.weight} кг</span>
                <span>📏 {user.height} см</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                        Активность
                    </label>
                    <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="input-field text-sm">
                        <option value="sedentary">Сидячий образ жизни</option>
                        <option value="light">Лёгкая (1-3 раза/нед.)</option>
                        <option value="moderate">Умеренная (3-5 раз/нед.)</option>
                        <option value="active">Высокая (6-7 раз/нед.)</option>
                        <option value="veryActive">Очень высокая (2 раза/день)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                        Цель
                    </label>
                    <select name="goal" value={formData.goal} onChange={handleChange} className="input-field text-sm">
                        <option value="lose">Похудение</option>
                        <option value="maintain">Поддержание веса</option>
                        <option value="gain">Набор массы</option>
                    </select>
                </div>
            </div>

            {result && (
                <div className="grid grid-cols-3 gap-2 animate-fade-in">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
                        <p className="text-xs text-blue-600 dark:text-blue-300 font-semibold uppercase tracking-wide mb-1">БОВ</p>
                        <p className="text-lg font-bold text-blue-800 dark:text-blue-200">{result.bmr}</p>
                        <p className="text-xs text-blue-500 dark:text-blue-400">ккал</p>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center">
                        <p className="text-xs text-purple-600 dark:text-purple-300 font-semibold uppercase tracking-wide mb-1">СНК</p>
                        <p className="text-lg font-bold text-purple-800 dark:text-purple-200">{result.tdee}</p>
                        <p className="text-xs text-purple-500 dark:text-purple-400">ккал</p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-center border-2 border-green-200 dark:border-green-700">
                        <p className="text-xs text-green-600 dark:text-green-300 font-semibold uppercase tracking-wide mb-1">Цель</p>
                        <p className="text-lg font-bold text-green-800 dark:text-green-200">{result.targetCalories}</p>
                        <p className="text-xs text-green-500 dark:text-green-400">ккал</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalorieCalculator;
