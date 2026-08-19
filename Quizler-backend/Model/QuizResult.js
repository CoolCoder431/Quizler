const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    category: {
        type: String,
        required: true
    },

    difficulty: {
        type: String,
        required: true
    },

    totalQuestions: {
        type: Number,
        required: true
    },

    correctAnswers: {
        type: Number,
        required: true
    },

    score: {
        type: Number,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('QuizResult', quizResultSchema);