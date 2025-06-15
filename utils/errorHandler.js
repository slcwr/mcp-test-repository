// エラーハンドリングユーティリティ
class ErrorHandler {
  // 一般的なエラーハンドラー
  static handle(err, req, res, next) {
    console.error(err.stack);
    
    // 開発環境では詳細なエラー情報を返す
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    res.status(err.status || 500).json({
      error: 'Something went wrong!',
      message: err.message,
      ...(isDevelopment && { stack: err.stack })
    });
  }

  // 非同期エラーをキャッチするラッパー
  static asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  // 404エラーハンドラー
  static notFound(req, res, next) {
    const error = new Error(`Route not found - ${req.originalUrl}`);
    error.status = 404;
    next(error);
  }
}

module.exports = ErrorHandler;