const express = require('express');
const path = require('path');
const appController = require('../controllers/appController');
const { optionalAuth, authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 基本ルート
router.get('/', optionalAuth, appController.home.bind(appController));

// 保護されたルート
router.get('/api/protected', authenticateToken, appController.protected.bind(appController));

// ヘルスチェック
router.get('/api/health', appController.health.bind(appController));

// 静的ページ
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'login.html'));
});

router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'dashboard.html'));
});

module.exports = router;