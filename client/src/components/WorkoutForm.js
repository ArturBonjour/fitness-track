import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';

const WorkoutForm = ({ onSubmit, initialDate }) => {
    const [formData, setFormData] = useState({
        type: 'силовая',
        date: '',
        time: '09:00',
        duration: 60,
        comment: '',
    });

    // Установка начальной даты, если она передана
    useEffect(() => {
        if (initialDate) {
            setFormData(prev => ({
                ...prev,
                date: initialDate.format('YYYY-MM-DD')
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                date: dayjs().format('YYYY-MM-DD')
            }));
        }
    }, [initialDate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Тип тренировки *
                </label>
                <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    required
                >
                    <option value="силовая">Силовая</option>
                    <option value="кардио">Кардио</option>
                    <option value="растяжка">Растяжка</option>
                    <option value="йога">Йога</option>
                    <option value="плавание">Плавание</option>
                    <option value="другое">Другое</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                        Дата *
                    </label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                        Время *
                    </label>
                    <input
                        type="time"
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        required
                    />
                </div>
            </div>

            <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                    Продолжительность (минут) (необязательно)
                </label>
                <input
                    type="number"
                    id="duration"
                    name="duration"
                    min="5"
                    max="300"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="По умолчанию: 60 минут"
                />
            </div>

            <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                    Комментарий (необязательно)
                </label>
                <textarea
                    id="comment"
                    name="comment"
                    rows="3"
                    value={formData.comment}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Дополнительная информация о тренировке"
                />
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    className="bg-primary hover:bg-purple-800 text-white py-2 px-4 rounded-md"
                >
                    Сохранить
                </button>
            </div>
        </form>
    );
};

export default WorkoutForm; 