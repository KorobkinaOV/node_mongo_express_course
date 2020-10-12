const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token! Plaese log in', 401);

const handleExpiredError = () =>
  new AppError('Your token has expired! Please log in again', 401);

const fields = (err) => {
  return Object.values(err.keyValue).join(', ');
};

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field value: ${fields(
    err
  )}. Please use another value!`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //Operational, tusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or unknown error: don't send to client
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    console.log('ERROR', err);

    if (err.stack.indexOf('CastError') !== -1) error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.stack.indexOf('ValidationError') !== -1)
      error = handleValidationErrorDB(error);
    if (err.stack.indexOf('JsonWebTokenError') !== -1) error = handleJWTError();
    if (err.stack.indexOf('TokenExpiredError') !== -1)
      error = handleExpiredError();

    sendErrorProd(error, res);
  }
};
