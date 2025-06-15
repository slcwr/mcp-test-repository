const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

class AuthService {
  // ログイン処理
  async login(username, password) {
    if (!username || !password) {
      throw new Error('Username and password are required');
    }

    // ユーザーを検索
    const user = User.findByUsernameOrEmail(username);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // パスワードを検証
    const isPasswordValid = await User.validatePassword(user, password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // JWTトークンを生成
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        role: user.role 
      },
      config.jwtSecret,
      { expiresIn: config.jwt.expiresIn }
    );

    return {
      user: User.getSafeUserData(user),
      token
    };
  }

  // ユーザー登録処理
  async register(userData) {
    const { username, email, password } = userData;

    if (!username || !email || !password) {
      throw new Error('Username, email, and password are required');
    }

    try {
      const newUser = await User.create({ username, email, password });
      return User.getSafeUserData(newUser);
    } catch (error) {
      throw error;
    }
  }

  // ユーザー情報取得
  getUserById(id) {
    const user = User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return User.getSafeUserData(user);
  }

  // 全ユーザー取得（管理者のみ）
  getAllUsers() {
    return User.getAllUsers();
  }
}

module.exports = new AuthService();