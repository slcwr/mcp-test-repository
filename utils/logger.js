// 簡単なログ出力ユーティリティ
class Logger {
  static info(message, ...args) {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, ...args);
  }

  static error(message, ...args) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, ...args);
  }

  static warn(message, ...args) {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, ...args);
  }

  static debug(message, ...args) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, ...args);
    }
  }

  static logServerStart(port) {
    console.log('🚀 Server is running on port', port);
    console.log(`📱 Access the app at: http://localhost:${port}`);
    console.log(`🔐 Login page: http://localhost:${port}/login`);
    console.log(`📊 Dashboard: http://localhost:${port}/dashboard`);
    console.log('\n📋 Test credentials:');
    console.log('   Admin: username=admin, password=admin123');
    console.log('   User:  username=user, password=user123');
  }
}

module.exports = Logger;