import mongoose from 'mongoose';
import { env } from '@null-bot/config';
import { createScopedLogger } from '@null-bot/logger';

const logger = createScopedLogger('Database');

let isConnected = false;

export async function connectDatabase(): Promise<typeof mongoose> {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose;
  }

  try {
    logger.info('Connecting to MongoDB database...', { uri: env.MONGODB_URI });
    const db = await mongoose.connect(env.MONGODB_URI, {
      dbName: env.DATABASE_NAME,
    });
    isConnected = true;
    logger.info('Successfully connected to MongoDB database.');
    return db;
  } catch (error) {
    logger.error('MongoDB connection error:', { error });
    throw error;
  }
}
