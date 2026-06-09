const express = require('express');
const router = express.Router();
const { signup, login, getMe, logout } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/me', verifyToken, getMe);
router.post('/logout', verifyToken, logout);

module.exports = router;
