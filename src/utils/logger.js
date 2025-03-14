const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

const currentLogLevel = process.env.LOG_LEVEL || 'INFO';

class Logger {
  constructor(module) {
    this.module = module;
    this.logLevel = LOG_LEVELS[currentLogLevel.toUpperCase()];
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    return {
      timestamp,
      level,
      module: this.module,
      message,
      ...meta,
    };
  }

  error(message, meta = {}) {
    if (this.logLevel >= LOG_LEVELS.ERROR) {
      const logObject = this.formatMessage('ERROR', message, meta);
      console.error(JSON.stringify(logObject));
    }
  }

  warn(message, meta = {}) {
    if (this.logLevel >= LOG_LEVELS.WARN) {
      const logObject = this.formatMessage('WARN', message, meta);
      console.warn(JSON.stringify(logObject));
    }
  }

  info(message, meta = {}) {
    if (this.logLevel >= LOG_LEVELS.INFO) {
      const logObject = this.formatMessage('INFO', message, meta);
      console.info(JSON.stringify(logObject));
    }
  }

  debug(message, meta = {}) {
    if (this.logLevel >= LOG_LEVELS.DEBUG) {
      const logObject = this.formatMessage('DEBUG', message, meta);
      console.info(JSON.stringify(logObject));
    }
  }
}

export const createLogger = (module) => new Logger(module);
