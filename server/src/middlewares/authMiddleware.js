import { verifyToken } from '../utils/jwt.js';
import { Admin } from '../models/Admin.js';

export const requireAuth = (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const [, token] = header.split(' ');
    if (!token) {
      return res.status(401).json({ message: 'Token manquant' });
    }
    const decoded = verifyToken(token);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};

// Middleware pour vérifier que l'utilisateur est admin (pas scanner)
export const requireAdmin = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const [, token] = header.split(' ');
    if (!token) {
      return res.status(401).json({ message: 'Token manquant' });
    }
    const decoded = verifyToken(token);
    
    // Vérifier le rôle dans la base de données
    const admin = await Admin.findById(decoded.sub);
    if (!admin) {
      return res.status(401).json({ message: 'Utilisateur introuvable' });
    }
    
    if (admin.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé - Rôle admin requis' });
    }
    
    req.user = decoded;
    req.user.role = admin.role;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};

// Middleware pour vérifier que l'utilisateur peut scanner (admin ou scanner)
export const requireScanner = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const [, token] = header.split(' ');
    if (!token) {
      return res.status(401).json({ message: 'Token manquant' });
    }
    const decoded = verifyToken(token);
    
    // Vérifier le rôle dans la base de données
    const admin = await Admin.findById(decoded.sub);
    if (!admin) {
      return res.status(401).json({ message: 'Utilisateur introuvable' });
    }
    
    if (admin.role !== 'admin' && admin.role !== 'scanner') {
      return res.status(403).json({ message: 'Accès refusé - Rôle scanner requis' });
    }
    
    req.user = decoded;
    req.user.role = admin.role;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};

