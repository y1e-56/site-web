import mongoose from 'mongoose';
import { env } from './env.js';

mongoose.set('strictQuery', true);

export const connectDb = async () => {
  try {
    if (!env.mongoUri || !env.mongoUri.startsWith('mongodb://') && !env.mongoUri.startsWith('mongodb+srv://')) {
      console.error('❌ MONGODB_URI invalide ou manquante !');
      console.error('   URI actuelle:', env.mongoUri ? `"${env.mongoUri.substring(0, 20)}..."` : '(non définie)');
      console.error('   Vérifiez que la variable MONGODB_URI est définie dans Render');
      console.error('   Format attendu: mongodb+srv://username:password@cluster.mongodb.net/onelife?retryWrites=true&w=majority');
      process.exit(1);
    }
    
    await mongoose.connect(env.mongoUri, {
      autoIndex: env.nodeEnv !== 'production'
    });
    console.log('🗄️  MongoDB connected');
  } catch (err) {
    console.error('❌ Mongo connection error:', err.message);
    if (err.message.includes('Invalid scheme')) {
      console.error('   Vérifiez que MONGODB_URI commence par "mongodb://" ou "mongodb+srv://"');
    }
    process.exit(1);
  }
};

