class AppController {
  // ホームページ
  home(req, res) {
    res.json({
      message: 'Hello World from MCP Node.js App with Authentication!',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      authenticated: !!req.user,
      user: req.user ? { 
        id: req.user.id, 
        username: req.user.username, 
        role: req.user.role 
      } : null
    });
  }

  // 保護されたルート
  protected(req, res) {
    res.json({
      message: 'This is a protected route',
      user: req.user,
      timestamp: new Date().toISOString()
    });
  }

  // ヘルスチェック
  health(req, res) {
    res.json({
      status: 'OK',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      features: ['authentication', 'jwt', 'user-management']
    });
  }

  // 404ハンドラー
  notFound(req, res) {
    res.status(404).json({
      error: 'Route not found',
      path: req.originalUrl
    });
  }
}

module.exports = new AppController();