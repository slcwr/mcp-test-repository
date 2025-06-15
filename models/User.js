const bcrypt = require('bcryptjs');

class User {
  constructor() {
    // インメモリユーザーデータベース（本番環境では実際のデータベースを使用）
    this.users = [
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
  }

  // ユーザー名またはメールでユーザーを検索
  findByUsernameOrEmail(usernameOrEmail) {
    return this.users.find(u => u.username === usernameOrEmail || u.email === usernameOrEmail);
  }

  // IDでユーザーを検索
  findById(id) {
    return this.users.find(u => u.id === id);
  }

  // 新しいユーザーを作成
  async create(userData) {
    const { username, email, password, role = 'user' } = userData;
    
    // 既存ユーザーのチェック
    const existingUser = this.findByUsernameOrEmail(username) || this.findByUsernameOrEmail(email);
    if (existingUser) {
      throw new Error('Username or email already exists');
    }

    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // 新しいユーザーを作成
    const newUser = {
      id: this.users.length + 1,
      username,
      email,
      password: hashedPassword,
      role
    };

    this.users.push(newUser);
    return newUser;
  }

  // パスワード検証
  async validatePassword(user, password) {
    return await bcrypt.compare(password, user.password);
  }

  // すべてのユーザーを取得（パスワードを除く）
  getAllUsers() {
    return this.users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    }));
  }

  // ユーザー情報を安全な形式で取得
  getSafeUserData(user) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };
  }
}

module.exports = new User();