const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const config = require('./config');
const Logger = require('./utils/logger');
const ErrorHandler = require('./utils/errorHandler');

// ルーターをインポート
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();

// ミドルウェア
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// ルーティング
app.use('/', indexRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// 404ハンドラー
app.use('*', ErrorHandler.notFound);

// エラーハンドラー
app.use(ErrorHandler.handle);

// サーバー起動
app.listen(config.port, () => {
  Logger.logServerStart(config.port);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  Logger.info('👋 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  Logger.info('👋 SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;