import mongoose from 'mongoose';
import { env } from './env.js';

mongoose.set('strictQuery', true);

export const connectDb = async () => {
  try {
    await mongoose.connect(env.mongoUri, {
      autoIndex: env.nodeEnv !== 'production'
    });
    console.log('🗄️  MongoDB connected');
  } catch (err) {
    console.error('Mongo connection error:', err.message);
    process.exit(1);
  }
};

