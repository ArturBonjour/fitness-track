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
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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
            sedentary: 1.2,      // Сидячий образ жизни
            light: 1.375,        // Легкая активность
            moderate: 1.55,      // Умеренная активность
            active: 1.725,       // Высокая активность
            veryActive: 1.9      // Очень высокая активность
        };

        // Целевые коэффициенты
        const goalMultipliers = {
            lose: 0.85,          // Похудение
            maintain: 1,         // Поддержание веса
            gain: 1.15           // Набор массы
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
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Калькулятор калорий</h2>
                <p className="text-gray-600">Пожалуйста, войдите в систему, чтобы использовать калькулятор</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Калькулятор калорий</h2>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Ваши данные:</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-600">Пол:</p>
                        <p className="font-medium">{user.gender === 'male' ? 'Мужской' : 'Женский'}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Возраст:</p>
                        <p className="font-medium">{user.age} лет</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Вес:</p>
                        <p className="font-medium">{user.weight} кг</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Рост:</p>
                        <p className="font-medium">{user.height} см</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Уровень активности
                    </label>
                    <select
                        name="activityLevel"
                        value={formData.activityLevel}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    >
                        <option value="sedentary">Сидячий образ жизни</option>
                        <option value="light">Легкая активность (1-3 раза в неделю)</option>
                        <option value="moderate">Умеренная активность (3-5 раз в неделю)</option>
                        <option value="active">Высокая активность (6-7 раз в неделю)</option>
                        <option value="veryActive">Очень высокая активность (2 раза в день)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Цель
                    </label>
                    <select
                        name="goal"
                        value={formData.goal}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    >
                        <option value="lose">Похудение</option>
                        <option value="maintain">Поддержание веса</option>
                        <option value="gain">Набор массы</option>
                    </select>
                </div>
            </div>

            {result && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Результаты расчета:</h3>
                    <div className="space-y-2">
                        <p className="text-gray-700">
                            <span className="font-medium">Базовый обмен веществ (БОВ):</span> {result.bmr} ккал/день
                        </p>
                        <p className="text-gray-700">
                            <span className="font-medium">Суточная норма калорий (СНК):</span> {result.tdee} ккал/день
                        </p>
                        <p className="text-gray-700">
                            <span className="font-medium">Рекомендуемая норма калорий:</span> {result.targetCalories} ккал/день
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalorieCalculator; 
