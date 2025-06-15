const express = require('express');
const authController = require('../controllers/authController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// ユーザー一覧（管理者のみ）
router.get('/', authenticateToken, requireAdmin, authController.getAllUsers.bind(authController));

module.exports = router;