import { createTicketRequest } from '../services/ticketService.js';

const REQUIRED_FIELDS = [
  'fullName',
  'phoneNumber',
  'paymentMethod',
  'paymentReference',
  'preferredChannel'
];

export const submitTicketRequest = async (req, res) => {
  try {
    for (const field of REQUIRED_FIELDS) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `Champ manquant: ${field}` });
      }
    }

    const ticket = await createTicketRequest(req.body);
    return res.status(201).json(ticket);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: 'Cette référence de paiement existe déjà' });
    }
    return res.status(500).json({ message: error.message });
  }
};

