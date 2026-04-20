const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Загрузка переменных окружения
dotenv.config();

// Инициализация приложения
const app = express();

// Настройка trust proxy для корректной работы express-rate-limit
app.set('trust proxy', 1);

// Middleware
app.use(express.json());
app.use(cors());

// Маршруты API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
const workoutRoutes = require('./routes/workouts');
const goalRoutes = require('./routes/goals');
const workoutRecommendationRoutes = require('./routes/workoutRecommendations');

app.use('/api/workouts', workoutRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/recommendations', workoutRecommendationRoutes);

// Статические файлы в production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
    });
}

// Подключение к БД с повторными попытками, затем запуск сервера
async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fitness-tracker', {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 5000,
        });
        console.log('MongoDB подключена');
        const PORT = process.env.PORT || 5001;
        app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
    } catch (err) {
        console.error('Ошибка подключения к MongoDB:', err.message, '— повтор через 5 с');
        setTimeout(startServer, 5000);
    }
}

startServer(); 