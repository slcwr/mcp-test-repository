const authService = require('../services/authService');
const config = require('../config');

class AuthController {
  // ログイン
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const result = await authService.login(username, password);

      // Cookieにトークンを設定
      res.cookie('token', result.token, config.cookie);

      res.json({
        message: 'Login successful',
        user: result.user,
        token: result.token
      });
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.message === 'Invalid credentials' || 
          error.message === 'Username and password are required') {
        return res.status(401).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // ログアウト
  logout(req, res) {
    res.clearCookie('token');
    res.json({ message: 'Logout successful' });
  }

  // 現在のユーザー情報取得
  getMe(req, res) {
    try {
      const user = authService.getUserById(req.user.id);
      res.json(user);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(404).json({ error: 'User not found' });
    }
  }

  // ユーザー登録
  async register(req, res) {
    try {
      const { username, email, password } = req.body;
      const user = await authService.register({ username, email, password });

      res.status(201).json({
        message: 'User registered successfully',
        user
      });
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.message === 'Username or email already exists' ||
          error.message === 'Username, email, and password are required') {
        const statusCode = error.message === 'Username or email already exists' ? 409 : 400;
        return res.status(statusCode).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // 管理者用：全ユーザー取得
  getAllUsers(req, res) {
    try {
      const users = authService.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new AuthController();