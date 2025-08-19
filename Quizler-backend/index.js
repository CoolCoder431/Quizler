const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));


const PORT = process.env.PORT || 3000;

const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { dbName: process.env.MONGODB_DBNAME })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

const routes = require('./routes/routes.js');
app.use(routes);

const authenticateToken = require('./middleware/authentication.js');

// Protected API route
app.get('/api/dashboard', authenticateToken, (req, res) => {
    res.json({
        message: `Welcome ${req.user.email}`,
        user: req.user
    });
});

// Protected HTML routes - MAKE SURE THESE ARE HERE
app.get('/home', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../Quizler-frontend/home.html'));
});

app.get('/quiz', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../Quizler-frontend/quiz.html'));
});

app.get('/profile', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../Quizler-frontend/profile.html'));
});

// Middleware to block direct access to HTML files
const protectedFiles = ['home.html', 'quiz.html', 'profile.html'];
app.use((req, res, next) => {
    if (protectedFiles.some(file => req.path.endsWith(file))) {
        return res.status(403).send('Access denied');
    }
    next();
});

// Serve static files
app.use(express.static(path.join(__dirname, '../Quizler-frontend')));

app.listen(PORT, '0.0.0.0', () => console.log('up on', PORT));