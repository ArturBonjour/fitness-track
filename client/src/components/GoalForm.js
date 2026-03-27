import React, { useState } from 'react';
import dayjs from 'dayjs';

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
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Если текущее значение не указано, используем начальное
        const dataToSubmit = {
            ...formData,
            currentValue: formData.currentValue || formData.startValue
        };
        onSubmit(dataToSubmit);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Название цели *
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Например: Сбросить 5 кг"
                    required
                />
            </div>

            <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Тип цели *
                </label>
                <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    required
                >
                    <option value="вес">Вес</option>
                    <option value="частота">Частота тренировок</option>
                    <option value="дистанция">Дистанция</option>
                    <option value="сила">Сила</option>
                    <option value="другое">Другое</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="startValue" className="block text-sm font-medium text-gray-700 mb-1">
                        Начальное значение *
                    </label>
                    <input
                        type="number"
                        id="startValue"
                        name="startValue"
                        value={formData.startValue}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Например: 80"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="targetValue" className="block text-sm font-medium text-gray-700 mb-1">
                        Целевое значение *
                    </label>
                    <input
                        type="number"
                        id="targetValue"
                        name="targetValue"
                        value={formData.targetValue}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Например: 70"
                        required
                    />
                </div>
            </div>

            <div>
                <label htmlFor="currentValue" className="block text-sm font-medium text-gray-700 mb-1">
                    Текущее значение (необязательно)
                </label>
                <input
                    type="number"
                    id="currentValue"
                    name="currentValue"
                    value={formData.currentValue}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Если не указано, будет равно начальному значению"
                />
            </div>

            <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                    Дедлайн *
                </label>
                <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    required
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Описание (необязательно)
                </label>
                <textarea
                    id="description"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Дополнительная информация о цели"
                />
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md"
                >
                    Сохранить
                </button>
            </div>
        </form>
    );
};

export default GoalForm; 