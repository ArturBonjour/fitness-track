// Сервис для работы с localStorage вместо MongoDB

// Получение всех тренировок
export const getWorkouts = () => {
    try {
        const workouts = localStorage.getItem('workouts');
        return workouts ? JSON.parse(workouts) : [];
    } catch (error) {
        console.error('Ошибка при получении тренировок из localStorage:', error);
        return [];
    }
};

// Сохранение тренировки
export const saveWorkout = (workout) => {
    try {
        const workouts = getWorkouts();
        const newWorkout = {
            ...workout,
            _id: `workout_${Date.now()}`, // Генерация уникального ID
            createdAt: new Date().toISOString()
        };

        workouts.push(newWorkout);
        localStorage.setItem('workouts', JSON.stringify(workouts));
        return newWorkout;
    } catch (error) {
        console.error('Ошибка при сохранении тренировки в localStorage:', error);
        throw error;
    }
};

// Получение тренировок за определенный период
export const getWorkoutsInRange = (startDate, endDate) => {
    try {
        const workouts = getWorkouts();
        return workouts.filter(workout => {
            const workoutDate = new Date(workout.date);
            return workoutDate >= new Date(startDate) && workoutDate <= new Date(endDate);
        });
    } catch (error) {
        console.error('Ошибка при получении тренировок за период из localStorage:', error);
        return [];
    }
};

// Получение всех целей
export const getGoals = () => {
    try {
        const goals = localStorage.getItem('goals');
        return goals ? JSON.parse(goals) : [];
    } catch (error) {
        console.error('Ошибка при получении целей из localStorage:', error);
        return [];
    }
};

// Сохранение цели
export const saveGoal = (goal) => {
    try {
        const goals = getGoals();
        const newGoal = {
            ...goal,
            _id: `goal_${Date.now()}`, // Генерация уникального ID
            createdAt: new Date().toISOString(),
            completed: false
        };

        goals.push(newGoal);
        localStorage.setItem('goals', JSON.stringify(goals));
        return newGoal;
    } catch (error) {
        console.error('Ошибка при сохранении цели в localStorage:', error);
        throw error;
    }
};

// Обновление цели
export const updateGoal = (goalId, updatedGoal) => {
    try {
        const goals = getGoals();
        const index = goals.findIndex(goal => goal._id === goalId);

        if (index !== -1) {
            goals[index] = { ...goals[index], ...updatedGoal };
            localStorage.setItem('goals', JSON.stringify(goals));
            return goals[index];
        }

        throw new Error('Цель не найдена');
    } catch (error) {
        console.error('Ошибка при обновлении цели в localStorage:', error);
        throw error;
    }
};

// Получение истории веса пользователя
export const getWeightHistory = () => {
    try {
        const weightHistory = localStorage.getItem('weightHistory');
        return weightHistory ? JSON.parse(weightHistory) : [];
    } catch (error) {
        console.error('Ошибка при получении истории веса из localStorage:', error);
        return [];
    }
};

// Добавление записи о весе
export const addWeightRecord = (weight) => {
    try {
        const weightHistory = getWeightHistory();
        const newRecord = {
            _id: `weight_${Date.now()}`,
            weight,
            date: new Date().toISOString()
        };

        weightHistory.push(newRecord);
        localStorage.setItem('weightHistory', JSON.stringify(weightHistory));
        return newRecord;
    } catch (error) {
        console.error('Ошибка при добавлении записи о весе в localStorage:', error);
        throw error;
    }
};

// Получение профиля пользователя
export const getUserProfile = () => {
    try {
        const userProfile = localStorage.getItem('userProfile');
        if (!userProfile) {
            // Создаем профиль по умолчанию, если его нет
            const defaultProfile = {
                name: 'Пользователь',
                email: 'user@example.com',
                gender: 'male',
                age: 30,
                weight: 70,
                height: 175
            };
            localStorage.setItem('userProfile', JSON.stringify(defaultProfile));
            return defaultProfile;
        }
        return JSON.parse(userProfile);
    } catch (error) {
        console.error('Ошибка при получении профиля пользователя из localStorage:', error);
        return null;
    }
};

// Обновление профиля пользователя
export const updateUserProfile = (updatedProfile) => {
    try {
        const currentProfile = getUserProfile();
        const newProfile = { ...currentProfile, ...updatedProfile };

        // Если вес изменился, добавляем запись в историю веса
        if (updatedProfile.weight && currentProfile.weight !== updatedProfile.weight) {
            addWeightRecord(updatedProfile.weight);
        }

        localStorage.setItem('userProfile', JSON.stringify(newProfile));
        return newProfile;
    } catch (error) {
        console.error('Ошибка при обновлении профиля пользователя в localStorage:', error);
        throw error;
    }
}; 