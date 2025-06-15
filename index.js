const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// インメモリユーザーデータベース（本番環境では実際のデータベースを使用）
const users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    password: '$2a$10$V2KRUkKJD2YJmKVX6VJmH.KJ4uHjPqG8WCxX6F7JfqWZeJKrXQmPi', // password: admin123
    role: 'admin'
  },
  {
    id: 2,
    username: 'user',
    email: 'user@example.com',
    password: '$2a$10$W2KRUkKJD2YJmKVX6VJmH.KJ4uHjPqG8WCxX6F7JfqWZeJKrXQmPj', // password: user123
    role: 'user'
  }
];

// ミドルウェア
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// JWTトークンの検証ミドルウェア
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// オプション認証ミドルウェア（トークンがあれば認証、なくてもOK）
const optionalAuth = (req, res, next) => {
  const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
  
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (!err) {
        req.user = user;
      }
    });
  }
  next();
};

// 基本ルート
app.get('/', optionalAuth, (req, res) => {
  res.json({
    message: 'Hello World from MCP Node.js App with Authentication!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    authenticated: !!req.user,
    user: req.user ? { id: req.user.id, username: req.user.username, role: req.user.role } : null
  });
});

// 認証関連のルート
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // ユーザーを検索
    const user = users.find(u => u.username === username || u.email === username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // パスワードを検証
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // JWTトークンを生成
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Cookieにトークンを設定
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24時間
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token: token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  });
});

// ユーザー登録（簡単な実装）
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // 既存ユーザーのチェック
    const existingUser = users.find(u => u.username === username || u.email === email);
    if (existingUser) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }

    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // 新しいユーザーを追加
    const newUser = {
      id: users.length + 1,
      username,
      email,
      password: hashedPassword,
      role: 'user'
    };
    users.push(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 保護されたルート
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({
    message: 'This is a protected route',
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

// ヘルスチェック
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    features: ['authentication', 'jwt', 'user-management']
  });
});

// ユーザー一覧（管理者のみ）
app.get('/api/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const safeUsers = users.map(user => ({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  }));

  res.json(safeUsers);
});

// ログインページ（静的ファイル）
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// ダッシュボードページ（静的ファイル）
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// 404ハンドラー
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// エラーハンドラー
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📱 Access the app at: http://localhost:${PORT}`);
  console.log(`🔐 Login page: http://localhost:${PORT}/login`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
  console.log(`\n📋 Test credentials:`);
  console.log(`   Admin: username=admin, password=admin123`);
  console.log(`   User:  username=user, password=user123`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully');
  process.exit(0);
});
