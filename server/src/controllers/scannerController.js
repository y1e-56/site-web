import { verifyScan, findTicketsByQuery } from '../services/ticketService.js';

export const validateTicket = async (req, res) => {
  try {
    console.log('[SCAN] Requête reçue, body:', JSON.stringify(req.body));
    const { qrPayload } = req.body;
    
    if (!qrPayload) {
      console.error('[SCAN] QR manquant dans la requête');
      return res.status(400).json({ message: 'QR manquant - Veuillez coller le contenu du QR code' });
    }

    if (typeof qrPayload !== 'string') {
      console.error('[SCAN] QR n\'est pas une chaîne:', typeof qrPayload);
      return res.status(400).json({ message: 'Format invalide - Le QR doit être une chaîne de caractères' });
    }

    console.log('[SCAN] Tentative de parsing JSON, longueur:', qrPayload.length);
    let parsed;
    try {
      parsed = JSON.parse(qrPayload.trim());
      console.log('[SCAN] JSON parsé avec succès:', parsed);
    } catch (error) {
      console.error('[SCAN] Erreur parsing QR:', error.message);
      console.error('[SCAN] Contenu reçu:', qrPayload.substring(0, 200));
      return res.status(400).json({ 
        message: 'Format JSON incorrect - Le QR code doit contenir un JSON valide. Vérifiez que vous avez bien copié tout le contenu.' 
      });
    }

    if (!parsed.ticketId) {
      console.error('[SCAN] ticketId manquant dans le JSON parsé:', parsed);
      return res.status(400).json({ 
        message: 'ID ticket manquant - Le QR code doit contenir un champ "ticketId". Format attendu: {"ticketId":"...","name":"...","quantity":1,"issuedAt":"..."}' 
      });
    }

    console.log('[SCAN] ticketId extrait:', parsed.ticketId);
    const result = await verifyScan(parsed.ticketId);
    return res.json(result);
  } catch (error) {
    console.error('[SCAN] Erreur lors de la validation:', error);
    return res.status(400).json({ message: error.message || 'Erreur lors de la validation du ticket' });
  }
};

export const searchTickets = async (req, res) => {
  try {
    const { query } = req.query;
    const tickets = await findTicketsByQuery(query?.trim());
    return res.json(tickets);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

