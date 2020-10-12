class AppError extends Error {
  constructor(message, statusCode) {
    super();

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.message = message;
    console.log('this', this);

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
