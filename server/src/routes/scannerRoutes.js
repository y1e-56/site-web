import { Router } from 'express';
import { validateTicket } from '../controllers/scannerController.js';
import { requireScanner } from '../middlewares/authMiddleware.js';

const router = Router();

// Scanner accessible aux admins ET aux scanners
router.post('/validate', requireScanner, validateTicket);

export default router;

