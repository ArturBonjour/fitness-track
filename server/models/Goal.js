const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    startValue: {
        type: Number,
        required: true
    },
    currentValue: {
        type: Number,
        required: true
    },
    targetValue: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        default: 'кг'
    },
    deadline: {
        type: Date,
        required: true
    },
    description: {
        type: String
    },
    completed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

GoalSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Goal', GoalSchema); 