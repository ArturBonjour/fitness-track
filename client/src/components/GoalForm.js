import React, { useState } from 'react';
import dayjs from 'dayjs';

const GOAL_TYPES = [
    { value: 'вес', emoji: '⚖️', label: 'Вес' },
    { value: 'частота', emoji: '📅', label: 'Частота' },
    { value: 'дистанция', emoji: '📏', label: 'Дистанция' },
    { value: 'сила', emoji: '💪', label: 'Сила' },
    { value: 'другое', emoji: '🎯', label: 'Другое' },
];

const Label = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {children}
    </label>
);

const GoalForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        title: '',
        type: 'вес',
        startValue: '',
        currentValue: '',
        targetValue: '',
        deadline: dayjs().add(30, 'day').format('YYYY-MM-DD'),
        description: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSubmit = {
            ...formData,
            currentValue: formData.currentValue || formData.startValue,
        };
        onSubmit(dataToSubmit);
    };

    // Calculate progress preview if values set
    const start = parseFloat(formData.startValue);
    const target = parseFloat(formData.targetValue);
    const current = parseFloat(formData.currentValue || formData.startValue);
    const hasPreview = !isNaN(start) && !isNaN(target) && start !== target;
    const progress = hasPreview
        ? Math.max(0, Math.min(100, Math.round(((current - start) / (target - start)) * 100)))
        : 0;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Название */}
            <div>
                <Label htmlFor="title">Название цели *</Label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Например: Сбросить 5 кг"
                    required
                />
            </div>

            {/* Тип цели */}
            <div>
                <Label>Тип цели *</Label>
                <div className="flex gap-2 flex-wrap">
                    {GOAL_TYPES.map(({ value, emoji, label }) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, type: value }))}
                            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl border-2 text-sm font-medium transition-all duration-150 ${
                                formData.type === value
                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                    : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-green-400'
                            }`}
                        >
                            <span>{emoji}</span>
                            {label}
                        </button>
                    ))}
                </div>
                {/* hidden input for type - not needed since handleSubmit reads formData directly */}
            </div>

            {/* Значения */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <Label htmlFor="startValue">Начальное *</Label>
                    <input
                        type="number"
                        id="startValue"
                        name="startValue"
                        value={formData.startValue}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="80"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="targetValue">Целевое *</Label>
                    <input
                        type="number"
                        id="targetValue"
                        name="targetValue"
                        value={formData.targetValue}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="70"
                        required
                    />
                </div>
            </div>

            {/* Preview progress bar */}
            {hasPreview && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl animate-fade-in">
                    <p className="text-xs text-green-600 dark:text-green-400 font-semibold mb-1.5">Предпросмотр прогресса</p>
                    <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div
                            className="progress-fill h-full bg-green-500 rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{progress}% от цели</p>
                </div>
            )}

            {/* Дедлайн */}
            <div>
                <Label htmlFor="deadline">Дедлайн *</Label>
                <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="input-field"
                    required
                />
            </div>

            {/* Описание */}
            <div>
                <Label htmlFor="description">Описание</Label>
                <textarea
                    id="description"
                    name="description"
                    rows="2"
                    value={formData.description}
                    onChange={handleChange}
                    className="input-field resize-none"
                    placeholder="Дополнительные заметки..."
                />
            </div>

            <div className="flex justify-end pt-1">
                <button
                    type="submit"
                    className="btn-press bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white py-2 px-6 rounded-xl font-medium shadow-md flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Создать цель
                </button>
            </div>
        </form>
    );
};

export default GoalForm;
