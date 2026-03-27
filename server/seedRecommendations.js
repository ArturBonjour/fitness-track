const mongoose = require('mongoose');
const WorkoutRecommendation = require('./models/WorkoutRecommendation');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/fitness-tracker', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB подключена');

        // Удаление существующих рекомендаций
        await WorkoutRecommendation.deleteMany({});
        console.log('Существующие рекомендации удалены');

        // Добавление новых рекомендаций
        const recommendations = [
            {
                goal: 'weightLoss',
                level: 'beginner',
                frequency: '3-4 раза в неделю',
                duration: '30-45 минут',
                types: ['кардио', 'силовая', 'растяжка'],
                tips: [
                    'Начните с низкой интенсивности',
                    'Сосредоточьтесь на правильной технике',
                    'Постепенно увеличивайте нагрузку'
                ]
            },
            {
                goal: 'muscleGain',
                level: 'beginner',
                frequency: '3 раза в неделю',
                duration: '45-60 минут',
                types: ['силовая', 'растяжка'],
                tips: [
                    'Фокусируйтесь на базовых упражнениях',
                    'Давайте мышцам отдых между тренировками',
                    'Увеличивайте вес постепенно'
                ]
            },
            {
                goal: 'endurance',
                level: 'beginner',
                frequency: '2-3 раза в неделю',
                duration: '20-30 минут',
                types: ['кардио'],
                tips: [
                    'Начните с интервальных тренировок',
                    'Постепенно увеличивайте время тренировки',
                    'Следите за пульсом'
                ]
            },
            {
                goal: 'weightLoss',
                level: 'intermediate',
                frequency: '4-5 раз в неделю',
                duration: '45-60 минут',
                types: ['кардио', 'силовая', 'растяжка', 'HIIT'],
                tips: [
                    'Добавьте интервальные тренировки',
                    'Увеличьте интенсивность',
                    'Сочетайте кардио и силовые упражнения'
                ]
            },
            {
                goal: 'muscleGain',
                level: 'intermediate',
                frequency: '4 раза в неделю',
                duration: '60-75 минут',
                types: ['силовая', 'растяжка'],
                tips: [
                    'Разделите тренировки по группам мышц',
                    'Увеличьте вес и уменьшите повторения',
                    'Уделяйте внимание питанию и восстановлению'
                ]
            },
            {
                goal: 'endurance',
                level: 'intermediate',
                frequency: '3-4 раза в неделю',
                duration: '30-45 минут',
                types: ['кардио', 'HIIT'],
                tips: [
                    'Используйте интервальные тренировки',
                    'Варьируйте нагрузку и типы активности',
                    'Постепенно увеличивайте дистанцию'
                ]
            },
            // Добавляем рекомендации для продвинутого уровня
            {
                goal: 'weightLoss',
                level: 'advanced',
                frequency: '5-6 раз в неделю',
                duration: '60-90 минут',
                types: ['кардио', 'силовая', 'HIIT', 'круговая тренировка'],
                tips: [
                    'Включите сложные комплексные упражнения',
                    'Используйте периодизацию тренировок',
                    'Контролируйте питание и восстановление',
                    'Добавьте дополнительные кардио-сессии'
                ]
            },
            {
                goal: 'muscleGain',
                level: 'advanced',
                frequency: '4-6 раз в неделю',
                duration: '60-90 минут',
                types: ['силовая', 'растяжка', 'периодизация'],
                tips: [
                    'Применяйте продвинутые техники (дроп-сеты, супер-сеты)',
                    'Тщательно планируйте циклы нагрузки и восстановления',
                    'Контролируйте макро- и микронутриенты в питании',
                    'Используйте научно обоснованные методики тренировок'
                ]
            },
            {
                goal: 'endurance',
                level: 'advanced',
                frequency: '4-6 раз в неделю',
                duration: '60-120 минут',
                types: ['кардио', 'HIIT', 'интервальное кардио'],
                tips: [
                    'Включите длительные тренировки на выносливость',
                    'Практикуйте специфическую для вашего вида спорта подготовку',
                    'Оптимизируйте технику для экономии энергии',
                    'Контролируйте зоны пульса при тренировках'
                ]
            }
        ];

        await WorkoutRecommendation.insertMany(recommendations);
        console.log('Рекомендации успешно добавлены');

        mongoose.disconnect();
        console.log('MongoDB отключена');
    } catch (err) {
        console.error('Ошибка:', err.message);
        process.exit(1);
    }
};

connectDB(); 