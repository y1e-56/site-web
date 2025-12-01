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
    if (!env.allowedOrigins.length || env.allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
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

