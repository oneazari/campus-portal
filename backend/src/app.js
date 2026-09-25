const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { FRONTEND_ORIGIN } = require('./config/env');

const authController = require('./controllers/authController');
const pageController = require('./controllers/pageController');

const authCheck = require('./middleware/authMiddleware');
const roleCheck = require('./middleware/roleMiddleware');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));

// Authentication routes
app.post('/login', authController.login);
app.post('/logout', authController.logout);
app.get('/me', authCheck, authController.getMe);

// Page-access endpoints
app.get('/admin-page', authCheck, roleCheck(['admin']), pageController.getAdminPage);
app.get('/faculty-page', authCheck, roleCheck(['admin', 'faculty']), pageController.getFacultyPage);
app.get('/student-page', authCheck, roleCheck(['admin', 'faculty', 'student']), pageController.getStudentPage);

module.exports = app;