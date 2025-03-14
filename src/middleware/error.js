import { createLogger } from '../utils/logger.js';
import { AppError } from '../utils/errors.js';

const logger = createLogger('ErrorMiddleware');

export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log the error
  logger.error(err.message, {
    stack: err.stack,
    statusCode: err.statusCode,
    path: req.path,
    method: req.method,
    ...(err.isOperational ? {} : { full_error: err }),
  });

  // Operational, trusted error: send message to client
  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Programming or other unknown error: don't leak error details
  // Send generic message for production
  if (process.env.NODE_ENV === 'production') {
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }

  // Send full error details in development
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// Handle unhandled promise rejections
export const setupUnhandledRejectionHandler = (server) => {
  process.on('unhandledRejection', (err) => {
    logger.error('UNHANDLED REJECTION! 💥 Shutting down...', {
      name: err.name,
      message: err.message,
      stack: err.stack,
    });
    // Gracefully shutdown
    server.close(() => {
      process.exit(1);
    });
  });
};

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', {
    name: err.name,
    message: err.message,
    stack: err.stack,
  });
  process.exit(1);
});
