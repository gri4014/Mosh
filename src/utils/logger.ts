import winston from 'winston';
import type { LogMeta } from '../types/logger';

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    })
  );
  logger.add(
    new winston.transports.File({
      filename: 'logs/combined.log',
    })
  );
}

export const error = (message: string, meta?: LogMeta): void => {
  logger.error(message, meta);
};

export const warn = (message: string, meta?: LogMeta): void => {
  logger.warn(message, meta);
};

export const info = (message: string, meta?: LogMeta): void => {
  logger.info(message, meta);
};

export const debug = (message: string, meta?: LogMeta): void => {
  logger.debug(message, meta);
};

export { logger };
