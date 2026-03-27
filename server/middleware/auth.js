const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Получение токена из заголовка
    let token = req.header('x-auth-token') || req.header('Authorization');

    // Проверка формата Bearer token
    if (token && token.startsWith('Bearer ')) {
        // Извлекаем токен без префикса "Bearer "
        token = token.slice(7);
    }

    // Проверка наличия токена
    if (!token) {
        return res.status(401).json({ message: 'Нет токена, авторизация отклонена' });
    }

    try {
        // Верификация токена
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'turik_fittrack_secret_key_123');

        // Добавление пользователя из payload
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error('Ошибка верификации токена:', err);
        res.status(401).json({ message: 'Токен недействителен' });
    }
}; 