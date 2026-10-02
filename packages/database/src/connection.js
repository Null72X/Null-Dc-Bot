"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("@null-bot/config");
const logger_1 = require("@null-bot/logger");
const logger = (0, logger_1.createScopedLogger)('Database');
let isConnected = false;
async function connectDatabase() {
    if (isConnected && mongoose_1.default.connection.readyState === 1) {
        return mongoose_1.default;
    }
    try {
        logger.info('Connecting to MongoDB database...', { uri: config_1.env.MONGODB_URI });
        const db = await mongoose_1.default.connect(config_1.env.MONGODB_URI, {
            dbName: config_1.env.DATABASE_NAME,
        });
        isConnected = true;
        logger.info('Successfully connected to MongoDB database.');
        return db;
    }
    catch (error) {
        logger.error('MongoDB connection error:', { error });
        throw error;
    }
}
//# sourceMappingURL=connection.js.map