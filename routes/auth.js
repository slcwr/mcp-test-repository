const express = require('express');
const authController = require('../controllers/authController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// 認証関連のルート
router.post('/login', authController.login.bind(authController));
router.post('/logout', authController.logout.bind(authController));
router.get('/me', authenticateToken, authController.getMe.bind(authController));
router.post('/register', authController.register.bind(authController));

module.exports = router;