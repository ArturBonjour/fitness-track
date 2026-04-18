const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const WorkoutRecommendation = require('../models/WorkoutRecommendation');

const recommendationsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
    message: 'Слишком много запросов к рекомендациям. Попробуйте позже.',
    standardHeaders: true,
    legacyHeaders: false
});

router.use(recommendationsLimiter);

// Получить все рекомендации
router.get('/', async (req, res) => {
    try {
        const recommendations = await WorkoutRecommendation.find();
        res.json(recommendations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

// Получить рекомендацию по цели и уровню
router.get('/:goal/:level', async (req, res) => {
    try {
        const recommendation = await WorkoutRecommendation.findOne({
            goal: req.params.goal,
            level: req.params.level
        });

        if (!recommendation) {
            return res.status(404).json({ message: 'Рекомендация не найдена' });
        }

        res.json(recommendation);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

// Добавить новую рекомендацию
router.post(
    '/',
    [
        check('goal', 'Цель обязательна').isIn(['weightLoss', 'muscleGain', 'endurance']),
        check('level', 'Уровень обязателен').isIn(['beginner', 'intermediate', 'advanced']),
        check('frequency', 'Частота обязательна').not().isEmpty(),
        check('duration', 'Длительность обязательна').not().isEmpty(),
        check('types', 'Типы тренировок обязательны').isArray({ min: 1 }),
        check('tips', 'Советы обязательны').isArray({ min: 1 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const recommendation = new WorkoutRecommendation({
            goal: req.body.goal,
            level: req.body.level,
            frequency: req.body.frequency,
            duration: req.body.duration,
            types: req.body.types,
            tips: req.body.tips
        });

        try {
            const newRecommendation = await recommendation.save();
            res.status(201).json(newRecommendation);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Ошибка сервера');
        }
    }
);

module.exports = router; 