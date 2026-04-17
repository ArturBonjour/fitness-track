import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';

const WORKOUT_TYPES = [
    { value: 'силовая', emoji: '💪', label: 'Силовая' },
    { value: 'кардио', emoji: '🏃', label: 'Кардио' },
    { value: 'растяжка', emoji: '🧘', label: 'Растяжка' },
    { value: 'йога', emoji: '🌿', label: 'Йога' },
    { value: 'плавание', emoji: '🏊', label: 'Плавание' },
    { value: 'другое', emoji: '🏋️', label: 'Другое' },
];

const Label = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {children}
    </label>
);

const WorkoutForm = ({ onSubmit, initialDate }) => {
    const [formData, setFormData] = useState({
        type: 'силовая',
        date: '',
        time: '09:00',
        duration: 60,
        comment: '',
    });

    useEffect(() => {
        const d = initialDate ? initialDate : dayjs();
        setFormData(prev => ({ ...prev, date: d.format('YYYY-MM-DD') }));
    }, [initialDate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Тип тренировки */}
            <div>
                <Label htmlFor="type">Тип тренировки *</Label>
                <div className="grid grid-cols-3 gap-2">
                    {WORKOUT_TYPES.map(({ value, emoji, label }) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, type: value }))}
                            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border-2 text-xs font-medium transition-all duration-150 ${
                                formData.type === value
                                    ? 'border-primary bg-primary/10 text-primary dark:text-purple-300'
                                    : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-primary/50'
                            }`}
                        >
                            <span className="text-xl mb-0.5">{emoji}</span>
                            {label}
                        </button>
                    ))}
                </div>
                {/* hidden select for form submission value */}
                <input type="hidden" name="type" value={formData.type} />
            </div>

            {/* Дата и Время */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <Label htmlFor="date">Дата *</Label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="input-field"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="time">Время *</Label>
                    <input
                        type="time"
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="input-field"
                        required
                    />
                </div>
            </div>

            {/* Продолжительность */}
            <div>
                <Label htmlFor="duration">Продолжительность (мин)</Label>
                <div className="flex items-center gap-3">
                    <input
                        type="range"
                        id="duration"
                        name="duration"
                        min="5"
                        max="180"
                        step="5"
                        value={formData.duration}
                        onChange={handleChange}
                        className="flex-1 accent-primary"
                    />
                    <span className="w-16 text-center text-sm font-semibold text-primary dark:text-purple-300 bg-primary/10 rounded-lg py-1">
                        {formData.duration} мин
                    </span>
                </div>
            </div>

            {/* Комментарий */}
            <div>
                <Label htmlFor="comment">Комментарий</Label>
                <textarea
                    id="comment"
                    name="comment"
                    rows="2"
                    value={formData.comment}
                    onChange={handleChange}
                    className="input-field resize-none"
                    placeholder="Заметки о тренировке..."
                />
            </div>

            <div className="flex justify-end pt-1">
                <button
                    type="submit"
                    className="btn-press bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white py-2 px-6 rounded-xl font-medium shadow-md flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Сохранить
                </button>
            </div>
        </form>
    );
};

export default WorkoutForm;
