const jwt = require('jsonwebtoken');

async function guestLogin(req, res) {
    try {
        const guestId = `guest_${Date.now()}`;

        const token = jwt.sign(
            {
                id: guestId,
                email: `${guestId}@quizler.com`,
                isGuest: true
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000
        });

        res.redirect('/home');

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Guest login failed"
        });
    }
}

module.exports = guestLogin;