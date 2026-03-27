import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WorkoutRecommendations = () => {
    const [selectedGoal, setSelectedGoal] = useState('weightLoss');
    const [selectedLevel, setSelectedLevel] = useState('beginner');
    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecommendation = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`/api/recommendations/${selectedGoal}/${selectedLevel}`);
                setRecommendation(response.data);
            } catch (err) {
                setError('Ошибка при загрузке рекомендаций');
                console.error('Ошибка при загрузке рекомендаций:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendation();
    }, [selectedGoal, selectedLevel]);

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Рекомендации по тренировкам</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Цель тренировок
                    </label>
                    <select
                        value={selectedGoal}
                        onChange={(e) => setSelectedGoal(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    >
                        <option value="weightLoss">Похудение</option>
                        <option value="muscleGain">Набор мышечной массы</option>
                        <option value="endurance">Выносливость</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Уровень подготовки
                    </label>
                    <select
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    >
                        <option value="beginner">Начинающий</option>
                        <option value="intermediate">Средний</option>
                        <option value="advanced">Продвинутый</option>
                    </select>
                </div>
            </div>

            {loading && (
                <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
            )}

            {error && (
                <div className="text-red-600 text-center py-4">
                    {error}
                </div>
            )}

            {recommendation && !loading && !error && (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Рекомендуемая частота</h3>
                        <p className="text-gray-700">{recommendation.frequency}</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Длительность тренировки</h3>
                        <p className="text-gray-700">{recommendation.duration}</p>
                    </div>

                    {recommendation.types && recommendation.types.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Типы тренировок</h3>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {recommendation.types.map((type, index) => (
                                    <li key={index}>{type}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {recommendation.tips && recommendation.tips.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Советы</h3>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {recommendation.tips.map((tip, index) => (
                                    <li key={index}>{tip}</li>
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