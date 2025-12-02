import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import publicRoutes from './routes/publicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import scannerRoutes from './routes/scannerRoutes.js';
import { env } from './config/env.js';

const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    // Si aucune origine n'est configurée, accepter tout (développement)
    if (!env.allowedOrigins.length) {
      console.warn('⚠️  CORS: Aucune origine configurée, acceptation de toutes les origines');
      return callback(null, true);
    }
    
    // Vérifier si l'origine est dans la liste
    if (env.allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Vérifier les patterns wildcard (ex: *.vercel.app)
    const matchesWildcard = env.allowedOrigins.some(allowed => {
      if (allowed.includes('*')) {
        const pattern = allowed.replace(/\*/g, '.*');
        const regex = new RegExp(`^${pattern}$`);
        return regex.test(origin);
      }
      return false;
    });
    
    if (matchesWildcard) {
      return callback(null, true);
    }
    
    console.error(`❌ CORS: Origin non autorisée: ${origin}`);
    console.error(`   Origines autorisées: ${env.allowedOrigins.join(', ')}`);
    return callback(new Error('Origin non autorisée'));
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/scanner', scannerRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Erreur interne' });
});

export default app;

