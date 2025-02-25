const express = require('express');
const router = express.Router();
const { login, forgotPassword } = require('../controllers/authController');

// Login route
router.post('/login', login);

// Forgot password route
router.post('/forgot-password', forgotPassword);

module.exports = router;