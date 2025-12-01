import { Router } from 'express';
import {
  confirmTicket,
  getTickets,
  login,
  markSent,
  getAdmins,
  addAdmin,
  removeAdmin,
  changePassword
} from '../controllers/adminController.js';
import { requireAuth, requireAdmin, requireScanner } from '../middlewares/authMiddleware.js';

const router = Router();

// Authentification
router.post('/login', login);

// Gestion des tickets (admin uniquement)
router.get('/tickets', requireAdmin, getTickets);
router.post('/tickets/:id/confirm', requireAdmin, confirmTicket);
router.post('/tickets/:id/sent', requireAdmin, markSent);

// Gestion des administrateurs (admin uniquement)
router.get('/admins', requireAdmin, getAdmins);
router.post('/admins', requireAdmin, addAdmin);
router.delete('/admins/:id', requireAdmin, removeAdmin);
router.post('/change-password', requireAuth, changePassword);

export default router;

