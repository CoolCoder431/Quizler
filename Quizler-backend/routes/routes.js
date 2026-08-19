const router = require('express').Router();
const checkLogin = require('../controller/login.js');
const SignUp = require('../controller/signup.js');
const guestLogin = require('../controller/guestLogin.js');

const authenticateToken = require('../middleware/authentication.js');
const QuizResult = require('../Model/QuizResult.js');


router.get('/guest-login', guestLogin);

router.post('/login', checkLogin);

router.post('/signup', SignUp);


router.post('/quiz-result', authenticateToken, async (req, res) => {

    try {

        const {
            category,
            difficulty,
            totalQuestions,
            correctAnswers
        } = req.body;

        const score = Math.round(
            (correctAnswers / totalQuestions) * 100
        );

        const result = await QuizResult.create({
            userId: req.user.id,
            category,
            difficulty,
            totalQuestions,
            correctAnswers,
            score
        });

        res.status(201).json({
            message: 'Quiz result saved',
            result
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Failed to save quiz result'
        });
    }
});

router.get('/profile-results', authenticateToken, async (req, res) => {

    try {

        const results = await QuizResult.find({
            userId: req.user.id
        }).sort({ createdAt: -1 });

        const quizzesPlayed = results.length;

        let totalScore = 0;

        for (const result of results) {
            totalScore += result.score;
        }

        const averageScore =
            quizzesPlayed === 0
                ? 0
                : Math.round(totalScore / quizzesPlayed);

        const bestScore =
            quizzesPlayed === 0
                ? 0
                : Math.max(...results.map(result => result.score));

        res.json({
            quizzesPlayed,
            averageScore,
            bestScore,
            results
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Failed to fetch profile results'
        });
    }
});


router.post('/logout', (req, res) => {

    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });

    return res.json({
        message: "Logged out successfully"
    });
});


module.exports = router;