const { createLogger, format, transports } = require('winston');

const upperLevel = format((info) => {
  info.level = info.level.toUpperCase();
  return info;
});

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    upperLevel(),
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.printf(
      ({ timestamp, level, message, stack }) =>
        `${timestamp} ${level}: ${stack || message}`,
    ),
  ),
  transports: [new transports.Console()],
});

module.exports = logger;
