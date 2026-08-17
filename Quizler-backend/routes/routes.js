const router = require('express').Router();

const checkLogin = require('../controller/login.js');
const SignUp = require('../controller/signup.js'); 

const guestLogin = require('../controller/guestLogin.js');

router.get('/guest-login', guestLogin);

router.post('/login', checkLogin);
router.post('/signup', SignUp);
router.post('/logout', (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    return res.json({ message: "Logged out successfully" });
});

module.exports = router;