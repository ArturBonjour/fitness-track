import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import dayjs from 'dayjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Регистрация компонентов Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Profile = () => {
    const { user, updateUser } = useContext(AuthContext);
    const [workouts, setWorkouts] = useState([]);
    const [goals, setGoals] = useState([]);
    const [weightHistory, setWeightHistory] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        age: '',
        weight: '',
        height: '',
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
                // Загрузка тренировок из API
                const workoutsRes = await axios.get('/api/workouts');
                setWorkouts(workoutsRes.data);

                // Загрузка целей из API
                const goalsRes = await axios.get('/api/goals');
                setGoals(goalsRes.data);

                // Загрузка истории веса из API
                const weightHistoryRes = await axios.get('/api/users/weight-history');
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
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Обработка отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await updateUser(formData);
            setEditMode(false);
        } catch (err) {
            console.error('Ошибка при обновлении профиля:', err);
        }
    };

    // Обработка изменения фильтра
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter({
            ...filter,
            [name]: value
        });
    };

    // Фильтрация тренировок
    const filteredWorkouts = workouts.filter(workout => {
        const workoutDate = dayjs(workout.date);
        const startDate = dayjs(filter.startDate);
        const endDate = dayjs(filter.endDate);

        const dateInRange = workoutDate.isAfter(startDate) && workoutDate.isBefore(endDate.add(1, 'day'));
        const typeMatches = filter.type === 'все' || workout.type === filter.type;

        return dateInRange && typeMatches;
    });

    // Подготовка данных для графика веса
    const weightChartData = {
        labels: weightHistory.map(item => dayjs(item.date).format('DD.MM.YYYY')),
        datasets: [
            {
                label: 'Вес (кг)',
                data: weightHistory.map(item => item.weight),
                borderColor: '#4a148c',
                backgroundColor: 'rgba(74, 20, 140, 0.1)',
                tension: 0.3,
            },
        ],
    };

    // Подготовка данных для графика тренировок
    const workoutsByWeek = workouts.reduce((acc, workout) => {
        const weekStart = dayjs(workout.date).startOf('week').format('YYYY-MM-DD');
        if (!acc[weekStart]) {
            acc[weekStart] = 0;
        }
        acc[weekStart]++;
        return acc;
    }, {});

    const workoutChartData = {
        labels: Object.keys(workoutsByWeek).map(date => `Неделя с ${dayjs(date).format('DD.MM')}`),
        datasets: [
            {
                label: 'Количество тренировок',
                data: Object.values(workoutsByWeek),
                borderColor: '#4a148c',
                backgroundColor: 'rgba(74, 20, 140, 0.1)',
                tension: 0.3,
            },
        ],
    };

    // Опции для графиков
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };

    // Типы тренировок для фильтра
    const workoutTypes = ['все', 'силовая', 'кардио', 'растяжка', 'йога', 'плавание', 'другое'];

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Профиль</h1>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Личные данные</h2>
                    <button
                        onClick={() => setEditMode(!editMode)}
                        className="text-primary hover:text-purple-800"
                    >
                        {editMode ? 'Отмена' : 'Редактировать'}
                    </button>
                </div>

                {editMode ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Имя
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                                    Пол
                                </label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                    required
                                >
                                    <option value="">Выберите пол</option>
                                    <option value="male">Мужской</option>
                                    <option value="female">Женский</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                                    Возраст
                                </label>
                                <input
                                    type="number"
                                    id="age"
                                    name="age"
                                    min="15"
                                    max="100"
                                    value={formData.age}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                                    Вес (кг)
                                </label>
                                <input
                                    type="number"
                                    id="weight"
                                    name="weight"
                                    min="30"
                                    max="200"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                                    Рост (см)
                                </label>
                                <input
                                    type="number"
                                    id="height"
                                    name="height"
                                    min="100"
                                    max="250"
                                    value={formData.height}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                    required
                                />
                            </div>
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
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Имя</p>
                            <p className="font-medium">{user?.name}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{user?.email}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Пол</p>
                            <p className="font-medium">{user?.gender === 'male' ? 'Мужской' : 'Женский'}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Возраст</p>
                            <p className="font-medium">{user?.age} лет</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Вес</p>
                            <p className="font-medium">{user?.weight} кг</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Рост</p>
                            <p className="font-medium">{user?.height} см</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Динамика веса</h2>
                {weightHistory.length > 0 ? (
                    <div className="h-64">
                        <Line data={weightChartData} options={chartOptions} />
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">История изменения веса пока отсутствует</p>
                )}
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Активность</h2>
                    <div className="flex items-center space-x-2">
                        <select
                            name="type"
                            value={filter.type}
                            onChange={handleFilterChange}
                            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        >
                            {workoutTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        <input
                            type="date"
                            name="startDate"
                            value={filter.startDate}
                            onChange={handleFilterChange}
                            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        />
                        <span>-</span>
                        <input
                            type="date"
                            name="endDate"
                            value={filter.endDate}
                            onChange={handleFilterChange}
                            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>
                </div>

                {workouts.length > 0 ? (
                    <>
                        <div className="h-64 mb-6">
                            <Line data={workoutChartData} options={chartOptions} />
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Дата
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Тип
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Время
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Длительность
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredWorkouts.map(workout => (
                                        <tr key={workout._id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {dayjs(workout.date).format('DD.MM.YYYY')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {workout.type}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {workout.time}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {workout.duration} мин
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <p className="text-gray-500 text-center py-8">Тренировки еще не добавлены</p>
                )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Цели</h2>

                {goals.length > 0 ? (
                    <div className="space-y-4">
                        {goals.map(goal => (
                            <div key={goal._id} className="border border-gray-200 rounded-md p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{goal.title}</h3>
                                        <p className="text-sm text-gray-500">
                                            {goal.description || `Цель: ${goal.targetValue} ${goal.unit || ''}`}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded ${goal.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {goal.completed ? 'Выполнено' : `До ${dayjs(goal.deadline).format('DD.MM.YYYY')}`}
                                    </span>
                                </div>

                                <div className="mt-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-primary h-2.5 rounded-full"
                                            style={{
                                                width: `${Math.min(100, Math.max(0, ((goal.currentValue - goal.startValue) / (goal.targetValue - goal.startValue)) * 100))}%`
                                            }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>{goal.startValue} {goal.unit || ''}</span>
                                        <span>{goal.currentValue} {goal.unit || ''}</span>
                                        <span>{goal.targetValue} {goal.unit || ''}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">Цели еще не добавлены</p>
                )}
            </div>
        </div>
    );
};

export default Profile; 