const mongoose = require('mongoose');

const workoutRecommendationSchema = new mongoose.Schema({
    goal: {
        type: String,
        required: true,
        enum: ['weightLoss', 'muscleGain', 'endurance']
    },
    level: {
        type: String,
        required: true,
        enum: ['beginner', 'intermediate', 'advanced']
    },
    frequency: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    types: [{
        type: String,
        required: true
    }],
    tips: [{
        type: String,
        required: true
    }]
});

module.exports = mongoose.model('WorkoutRecommendation', workoutRecommendationSchema); 