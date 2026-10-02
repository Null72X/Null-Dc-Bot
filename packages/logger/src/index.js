"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScopedLogger = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
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
winston_1.default.addColors(customLevels.colors);
exports.logger = winston_1.default.createLogger({
    levels: customLevels.levels,
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf(({ timestamp, level, message, module, guildId, userId, command, stack }) => {
                let logStr = `[${timestamp}] [${level}]`;
                if (module)
                    logStr += ` [${module}]`;
                if (guildId)
                    logStr += ` [Guild: ${guildId}]`;
                if (userId)
                    logStr += ` [User: ${userId}]`;
                if (command)
                    logStr += ` [Cmd: ${command}]`;
                logStr += `: ${message}`;
                if (stack)
                    logStr += `\n${stack}`;
                return logStr;
            })),
        }),
    ],
});
const createScopedLogger = (moduleName) => {
    return {
        debug: (msg, meta = {}) => exports.logger.debug(msg, { module: moduleName, ...meta }),
        info: (msg, meta = {}) => exports.logger.info(msg, { module: moduleName, ...meta }),
        warn: (msg, meta = {}) => exports.logger.warn(msg, { module: moduleName, ...meta }),
        error: (msg, meta = {}) => exports.logger.error(msg, { module: moduleName, ...meta }),
        fatal: (msg, meta = {}) => exports.logger.log('fatal', msg, { module: moduleName, ...meta }),
    };
};
exports.createScopedLogger = createScopedLogger;
//# sourceMappingURL=index.js.map