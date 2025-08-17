// const jwt = require('jsonwebtoken');

// async function logOut(req, res) {
//     try {
//         const token = req.cookies.token;
        
//         if (!token) {
//             return res.status(401).json({ message: "No token found, user not logged in" });
//         }
        
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const userEmail = decoded.email;
        
//         res.clearCookie('token', {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'strict'
//         });
        
        
//         if (req.headers.accept && req.headers.accept.includes('text/html')) {
//             return res.redirect('/login.html');
//         } else {
//             return res.status(200).json({ 
//                 message: "Logout successful", 
//                 email: userEmail 
//             });
//         }
        
//     } catch (error) {
//         if (error.name === 'JsonWebTokenError') {
//             res.clearCookie('token');
//             return res.status(401).json({ message: "Invalid token" });
//         } else if (error.name === 'TokenExpiredError') {
//             res.clearCookie('token');
//             return res.status(401).json({ message: "Token expired" });
//         } else {
//             console.error('Logout error:', error);
//             return res.status(500).json({ message: "Internal server error during logout" });
//         }
//     }
// }

// module.exports = logOut;