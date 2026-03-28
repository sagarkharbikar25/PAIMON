const winston = require('winston');
require('winston-daily-rotate-file');

const { combine, timestamp, printf, colorize, errors } = winston.format;
const fmt = printf(({ level, message, timestamp, stack }) =>
  `${timestamp} [${level}]: ${stack || message}`
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), fmt),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), timestamp({ format: 'HH:mm:ss' }), fmt),
      silent: process.env.NODE_ENV === 'test',
    }),
    new winston.transports.DailyRotateFile({
      filename: 'logs/app-%DATE%.log', datePattern: 'YYYY-MM-DD',
      maxSize: '20m', maxFiles: '14d', level: 'info',
    }),
    new winston.transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log', datePattern: 'YYYY-MM-DD',
      maxSize: '20m', maxFiles: '30d', level: 'error',
    }),
  ],
});

module.exports = logger;