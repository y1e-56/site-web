import { Router } from 'express';
import { submitTicketRequest } from '../controllers/publicController.js';

const router = Router();

router.post('/tickets', submitTicketRequest);

export default router;

