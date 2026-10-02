import winston from 'winston';

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
  },
  colors: {
    fatal: 'bold red',
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue',
  },
};

winston.addColors(customLevels.colors);

export const logger = winston.createLogger({
  levels: customLevels.levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.printf(({ timestamp, level, message, module, guildId, userId, command, stack }) => {
          let logStr = `[${timestamp}] [${level}]`;
          if (module) logStr += ` [${module}]`;
          if (guildId) logStr += ` [Guild: ${guildId}]`;
          if (userId) logStr += ` [User: ${userId}]`;
          if (command) logStr += ` [Cmd: ${command}]`;
          logStr += `: ${message}`;
          if (stack) logStr += `\n${stack}`;
          return logStr;
        })
      ),
    }),
  ],
});

export const createScopedLogger = (moduleName: string) => {
  return {
    debug: (msg: string, meta: Record<string, unknown> = {}) => logger.debug(msg, { module: moduleName, ...meta }),
    info: (msg: string, meta: Record<string, unknown> = {}) => logger.info(msg, { module: moduleName, ...meta }),
    warn: (msg: string, meta: Record<string, unknown> = {}) => logger.warn(msg, { module: moduleName, ...meta }),
    error: (msg: string, meta: Record<string, unknown> = {}) => logger.error(msg, { module: moduleName, ...meta }),
    fatal: (msg: string, meta: Record<string, unknown> = {}) => logger.log('fatal', msg, { module: moduleName, ...meta }),
  };
};
