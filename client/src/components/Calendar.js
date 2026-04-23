import React, { useState, useEffect, useContext } from 'react';
import dayjs from 'dayjs';
import Modal from './Modal';
import WorkoutForm from './WorkoutForm';
import GoalForm from './GoalForm';
import { NotificationContext } from '../context/NotificationContext';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

const WORKOUT_EMOJIS = {
    'силовая': '💪', 'кардио': '🏃', 'растяжка': '🧘',
    'йога': '🌿', 'плавание': '🏊', 'другое': '🏋️',
};

const Calendar = () => {
    const { showNotification } = useContext(NotificationContext);
    const { isAuthenticated } = useAuth();
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [calendarDays, setCalendarDays] = useState([]);
    const [workouts, setWorkouts] = useState([]);
    const [goals, setGoals] = useState([]);
    const [, setLoadingData] = useState(false);
    const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [isViewWorkoutModalOpen, setIsViewWorkoutModalOpen] = useState(false);
    const [isViewGoalModalOpen, setIsViewGoalModalOpen] = useState(false);
    const [deletingWorkout, setDeletingWorkout] = useState(false);
    const [deletingGoal, setDeletingGoal] = useState(false);

    // Получение данных о тренировках и целях
    useEffect(() => {
        const fetchData = async () => {
            if (!isAuthenticated) return;
            try {
                setLoadingData(true);
                const startOfMonth = currentDate.startOf('month').format('YYYY-MM-DD');
                const endOfMonth = currentDate.endOf('month').format('YYYY-MM-DD');

                const [workoutsRes, goalsRes] = await Promise.all([
                    axios.get('/api/workouts'),
                    axios.get('/api/goals'),
                ]);

                const filteredWorkouts = workoutsRes.data.filter(workout => {
                    const workoutDate = dayjs(workout.date);
                    return workoutDate.isAfter(dayjs(startOfMonth).subtract(1, 'day')) &&
                        workoutDate.isBefore(dayjs(endOfMonth).add(1, 'day'));
                });

                setWorkouts(filteredWorkouts);
                setGoals(goalsRes.data);
            } catch (err) {
                showNotification(`Ошибка при загрузке данных: ${err.response?.data?.message || err.message}`, 'error');
            } finally {
                setLoadingData(false);
            }
        };

        fetchData();
    }, [currentDate, isAuthenticated, showNotification]);

    // Генерация дней календаря
    useEffect(() => {
        const firstDayOfMonth = currentDate.startOf('month');
        const lastDayOfMonth = currentDate.endOf('month');
        const startDay = firstDayOfMonth.day() === 0 ? 6 : firstDayOfMonth.day() - 1; // Понедельник - 0, Воскресенье - 6

        const days = [];

        // Добавление дней предыдущего месяца
        for (let i = startDay - 1; i >= 0; i--) {
            days.push({
                date: firstDayOfMonth.subtract(i + 1, 'day'),
                isCurrentMonth: false
            });
        }

        // Добавление дней текущего месяца
        for (let i = 0; i < lastDayOfMonth.date(); i++) {
            days.push({
                date: firstDayOfMonth.add(i, 'day'),
                isCurrentMonth: true
            });
        }

        // Добавление дней следующего месяца
        const remainingDays = 42 - days.length; // 6 строк по 7 дней
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                date: lastDayOfMonth.add(i, 'day'),
                isCurrentMonth: false
            });
        }

        setCalendarDays(days);
    }, [currentDate]);

    // Переход к предыдущему месяцу
    const goToPreviousMonth = () => {
        setCurrentDate(currentDate.subtract(1, 'month'));
    };

    // Переход к следующему месяцу
    const goToNextMonth = () => {
        setCurrentDate(currentDate.add(1, 'month'));
    };

    // Открытие модального окна для добавления тренировки
    const openWorkoutModal = (date) => {
        setSelectedDate(date || dayjs());
        setIsWorkoutModalOpen(true);
    };

    // Открытие модального окна для добавления цели
    const openGoalModal = () => {
        setIsGoalModalOpen(true);
    };

    // Открытие модального окна для просмотра тренировки
    const openViewWorkoutModal = (workout, e) => {
        e.stopPropagation();
        setSelectedWorkout(workout);
        setIsViewWorkoutModalOpen(true);
    };

    // Открытие модального окна для просмотра цели
    const openViewGoalModal = (goal, e) => {
        e.stopPropagation();
        setSelectedGoal(goal);
        setIsViewGoalModalOpen(true);
    };

    // Добавление новой тренировки
    const handleAddWorkout = async (workoutData) => {
        try {
            console.log('Отправляемые данные тренировки:', workoutData);

            if (!isAuthenticated) {
                showNotification('Необходимо войти в систему', 'error');
                return;
            }

            // Преобразуем duration в число
            const numericWorkoutData = {
                ...workoutData,
                duration: Number(workoutData.duration)
            };

            // Сохраняем тренировку через API
            const response = await axios.post('/api/workouts', numericWorkoutData);
            console.log('Ответ сервера при добавлении тренировки:', response.data);

            const newWorkout = response.data;
            setWorkouts([...workouts, newWorkout]);
            setIsWorkoutModalOpen(false);
            showNotification('Тренировка успешно добавлена', 'success');
        } catch (err) {
            console.error('Ошибка при добавлении тренировки:', err.response?.data || err.message);

            // Показываем детальное сообщение об ошибке
            const errorMessage = err.response?.data?.errors
                ? `Ошибка: ${err.response.data.errors.map(e => e.msg).join(', ')}`
                : err.response?.data?.message || 'Ошибка при добавлении тренировки';

            showNotification(errorMessage, 'error');
        }
    };

    // Добавление новой цели
    const handleAddGoal = async (goalData) => {
        try {
            console.log('Отправляемые данные цели:', goalData);

            if (!isAuthenticated) {
                showNotification('Необходимо войти в систему', 'error');
                return;
            }

            // Преобразуем числовые поля из строк в числа
            const numericGoalData = {
                ...goalData,
                startValue: Number(goalData.startValue),
                currentValue: Number(goalData.currentValue || goalData.startValue),
                targetValue: Number(goalData.targetValue)
            };

            // Сохраняем цель через API
            const response = await axios.post('/api/goals', numericGoalData);
            console.log('Ответ сервера при добавлении цели:', response.data);

            const newGoal = response.data;
            setGoals([...goals, newGoal]);
            setIsGoalModalOpen(false);
            showNotification('Цель успешно добавлена', 'success');
        } catch (err) {
            console.error('Ошибка при добавлении цели:', err.response?.data || err.message);

            // Показываем детальное сообщение об ошибке
            const errorMessage = err.response?.data?.errors
                ? `Ошибка: ${err.response.data.errors.map(e => e.msg).join(', ')}`
                : err.response?.data?.message || 'Ошибка при добавлении цели';

            showNotification(errorMessage, 'error');
        }
    };

    // Получение тренировок для конкретного дня
    const getWorkoutsForDay = (date) => {
        return workouts.filter(workout =>
            dayjs(workout.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
        );
    };

    // Получение целей для конкретного дня
    const getGoalsForDay = (date) => {
        return goals.filter(goal =>
            dayjs(goal.deadline).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
        );
    };

    // Удаление тренировки
    const handleDeleteWorkout = async (workoutId) => {
        try {
            setDeletingWorkout(true);
            await axios.delete(`/api/workouts/${workoutId}`);
            setWorkouts(prev => prev.filter(w => w._id !== workoutId));
            setIsViewWorkoutModalOpen(false);
            showNotification('Тренировка удалена', 'success');
        } catch (err) {
            showNotification(err.response?.data?.message || 'Ошибка при удалении тренировки', 'error');
        } finally {
            setDeletingWorkout(false);
        }
    };

    // Удаление цели
    const handleDeleteGoal = async (goalId) => {
        try {
            setDeletingGoal(true);
            await axios.delete(`/api/goals/${goalId}`);
            setGoals(prev => prev.filter(g => g._id !== goalId));
            setIsViewGoalModalOpen(false);
            showNotification('Цель удалена', 'success');
        } catch (err) {
            showNotification(err.response?.data?.message || 'Ошибка при удалении цели', 'error');
        } finally {
            setDeletingGoal(false);
        }
    };

    // Дни недели
    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-4">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                        {currentDate.format('MMMM YYYY')}
                    </h2>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={goToPreviousMonth}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Предыдущий месяц"
                    >
                        <svg className="h-5 w-5 text-gray-600 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={goToNextMonth}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Следующий месяц"
                    >
                        <svg className="h-5 w-5 text-gray-600 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
                {weekDays.map(day => (
                    <div key={day} className="text-center py-2 font-semibold text-sm text-gray-600 dark:text-gray-400">
                        {day}
                    </div>
                ))}

                {calendarDays.map((day, index) => {
                    const dayWorkouts = getWorkoutsForDay(day.date);
                    const dayGoals = getGoalsForDay(day.date);
                    const isToday = day.date.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD');

                    return (
                        <div
                            key={index}
                            onClick={() => isAuthenticated && openWorkoutModal(day.date)}
                            className={`calendar-day min-h-[100px] p-1 border rounded-lg transition-colors
                                ${isAuthenticated ? 'cursor-pointer' : 'cursor-default'}
                                ${!day.isCurrentMonth ? 'bg-gray-50 dark:bg-gray-700/30 border-gray-100 dark:border-gray-700' : 'border-gray-200 dark:border-gray-600'}
                                ${isToday ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-600' : ''}
                            `}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span
                                    className={`text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center
                                        ${isToday ? 'bg-primary text-white' : 'text-gray-700 dark:text-gray-300'}
                                        ${!day.isCurrentMonth ? 'text-gray-400 dark:text-gray-600' : ''}
                                    `}
                                >
                                    {day.date.date()}
                                </span>
                                {dayWorkouts.length > 0 && (
                                    <span className="bg-primary text-xs text-white px-1.5 py-0.5 rounded-full">
                                        {dayWorkouts.length}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-1">
                                {dayWorkouts.slice(0, 2).map(workout => (
                                    <div
                                        key={workout._id}
                                        onClick={(e) => openViewWorkoutModal(workout, e)}
                                        className="text-xs p-1 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 truncate"
                                    >
                                        {workout.time} - {workout.type}
                                    </div>
                                ))}
                                {dayWorkouts.length > 2 && (
                                    <div className="text-xs text-gray-500">
                                        +{dayWorkouts.length - 2} еще
                                    </div>
                                )}

                                {dayGoals.map(goal => (
                                    <div
                                        key={goal._id}
                                        onClick={(e) => openViewGoalModal(goal, e)}
                                        className="text-xs p-1 rounded bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 truncate"
                                    >
                                        {goal.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={openGoalModal}
                    disabled={!isAuthenticated}
                    className="btn-press bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white py-2 px-4 rounded-xl text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    + Добавить цель
                </button>
                <button
                    onClick={() => openWorkoutModal()}
                    disabled={!isAuthenticated}
                    className="btn-press bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white py-2 px-4 rounded-xl text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    + Добавить тренировку
                </button>
            </div>

            {/* Модальное окно для добавления тренировки */}
            <Modal
                isOpen={isWorkoutModalOpen}
                onClose={() => setIsWorkoutModalOpen(false)}
                title="Добавление тренировки"
            >
                <WorkoutForm
                    onSubmit={handleAddWorkout}
                    initialDate={selectedDate}
                />
            </Modal>

            {/* Модальное окно для добавления цели */}
            <Modal
                isOpen={isGoalModalOpen}
                onClose={() => setIsGoalModalOpen(false)}
                title="Добавление цели"
            >
                <GoalForm onSubmit={handleAddGoal} />
            </Modal>

            {/* Модальное окно для просмотра тренировки */}
            <Modal
                isOpen={isViewWorkoutModalOpen}
                onClose={() => setIsViewWorkoutModalOpen(false)}
                title="Информация о тренировке"
            >
                {selectedWorkout && (
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <span>{WORKOUT_EMOJIS[selectedWorkout.type] || '🏋️'}</span>
                                <span className="capitalize">{selectedWorkout.type}</span>
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {dayjs(selectedWorkout.date).format('DD.MM.YYYY')} в {selectedWorkout.time}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <div className="flex-1 bg-gray-50 dark:bg-gray-700/40 rounded-xl px-3 py-2">
                                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">Длительность</p>
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{selectedWorkout.duration} мин</p>
                            </div>
                            <div className="flex-1 bg-gray-50 dark:bg-gray-700/40 rounded-xl px-3 py-2">
                                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">Дата</p>
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{dayjs(selectedWorkout.date).format('DD.MM.YYYY')}</p>
                            </div>
                        </div>

                        {selectedWorkout.comment && (
                            <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl px-3 py-2">
                                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">Комментарий</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">{selectedWorkout.comment}</p>
                            </div>
                        )}

                        <div className="flex justify-between items-center pt-1">
                            <button
                                onClick={() => handleDeleteWorkout(selectedWorkout._id)}
                                disabled={deletingWorkout}
                                className="btn-press flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                            >
                                {deletingWorkout ? (
                                    <span className="h-4 w-4 rounded-full border-2 border-red-400 border-t-transparent animate-spin" />
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                )}
                                Удалить
                            </button>
                            <button
                                onClick={() => setIsViewWorkoutModalOpen(false)}
                                className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                Закрыть
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Модальное окно для просмотра цели */}
            <Modal
                isOpen={isViewGoalModalOpen}
                onClose={() => setIsViewGoalModalOpen(false)}
                title="Информация о цели"
            >
                {selectedGoal && (
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {selectedGoal.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Дедлайн: {dayjs(selectedGoal.deadline).format('DD.MM.YYYY')}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Прогресс</p>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                                <div
                                    className="bg-primary h-2.5 rounded-full transition-all"
                                    style={{
                                        width: `${Math.min(100, Math.max(0, ((selectedGoal.currentValue - selectedGoal.startValue) / (selectedGoal.targetValue - selectedGoal.startValue)) * 100))}%`
                                    }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                                <span>{selectedGoal.startValue} {selectedGoal.unit}</span>
                                <span className="font-semibold text-primary dark:text-purple-400">{selectedGoal.currentValue} {selectedGoal.unit}</span>
                                <span>{selectedGoal.targetValue} {selectedGoal.unit}</span>
                            </div>
                        </div>

                        {selectedGoal.description && (
                            <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl px-3 py-2">
                                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">Описание</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">{selectedGoal.description}</p>
                            </div>
                        )}

                        <div className="flex justify-between items-center pt-1">
                            <button
                                onClick={() => handleDeleteGoal(selectedGoal._id)}
                                disabled={deletingGoal}
                                className="btn-press flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                            >
                                {deletingGoal ? (
                                    <span className="h-4 w-4 rounded-full border-2 border-red-400 border-t-transparent animate-spin" />
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                )}
                                Удалить
                            </button>
                            <button
                                onClick={() => setIsViewGoalModalOpen(false)}
                                className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                Закрыть
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Calendar; 