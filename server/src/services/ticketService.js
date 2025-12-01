import QRCode from 'qrcode';
import { Ticket } from '../models/Ticket.js';

const buildQrPayload = (ticket) => ({
  ticketId: ticket._id.toString(),
  name: ticket.fullName,
  quantity: ticket.quantity,
  issuedAt: new Date().toISOString()
});

const generateQrImage = async (payload) => {
  try {
    const jsonPayload = JSON.stringify(payload);
    console.log('[QR] Génération du QR code pour:', jsonPayload);
    
    const dataUrl = await QRCode.toDataURL(jsonPayload, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 1,
      width: 300
    });
    
    console.log('[QR] QR code généré avec succès, taille:', dataUrl.length, 'caractères');
    
    return {
      payload: jsonPayload,
      dataUrl
    };
  } catch (error) {
    console.error('[QR] Erreur lors de la génération du QR code:', error);
    throw new Error(`Échec de génération du QR code: ${error.message}`);
  }
};

export const createTicketRequest = async (input) => {
  return Ticket.create({
    ...input,
    status: 'pending'
  });
};

export const confirmTicketRequest = async (ticketId) => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) throw new Error('Ticket introuvable');
  if (ticket.status !== 'pending') {
    console.log('[TICKET] Ticket déjà confirmé:', ticketId);
    return ticket;
  }

  try {
    console.log('[TICKET] Confirmation du ticket:', ticketId);
    const qrPayload = buildQrPayload(ticket);
    const { payload, dataUrl } = await generateQrImage(qrPayload);

    ticket.status = 'confirmed';
    ticket.qrPayload = payload;
    ticket.qrImage = dataUrl;
    ticket.qrSentAt = null;
    await ticket.save();
    
    console.log('[TICKET] Ticket confirmé avec succès:', ticketId);
    return ticket;
  } catch (error) {
    console.error('[TICKET] Erreur lors de la confirmation:', error);
    throw error;
  }
};

export const markTicketSent = async (ticketId) => {
  return Ticket.findByIdAndUpdate(
    ticketId,
    {
      status: 'sent',
      qrSentAt: new Date(),
      lastDeliveryAt: new Date(),
      deliveryLastError: undefined
    },
    { new: true }
  );
};

export const fetchTickets = async (filter = {}) => {
  return Ticket.find(filter).sort({ createdAt: -1 });
};

export const findTicketsByQuery = async (term) => {
  if (!term) return [];
  const regex = new RegExp(term, 'i');
  return Ticket.find({
    $or: [
      { fullName: regex },
      { paymentReference: regex },
      { phoneNumber: regex }
    ]
  })
    .sort({ createdAt: -1 })
    .limit(10);
};

export const verifyScan = async (ticketId) => {
  console.log('[SCAN] Tentative de scan pour ticket:', ticketId);
  
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    console.error('[SCAN] Ticket introuvable:', ticketId);
    throw new Error('Ticket introuvable');
  }
  
  // Vérifier que le ticket est dans un état valide pour être scanné
  if (ticket.status === 'pending') {
    console.warn('[SCAN] Ticket non confirmé:', ticketId);
    return { ticket, status: 'not-confirmed', message: 'Ce ticket n\'a pas encore été confirmé' };
  }
  
  // Vérifier si le ticket a déjà été scanné (usage unique)
  if (ticket.status === 'checked_in') {
    console.warn('[SCAN] Ticket déjà scanné:', ticketId, 'Scanné le:', ticket.lastScanAt);
    return { 
      ticket, 
      status: 'already-scanned', 
      message: `Ce ticket a déjà été utilisé le ${new Date(ticket.lastScanAt).toLocaleString('fr-FR')}` 
    };
  }
  
  // Le ticket est valide, on le marque comme scanné
  console.log('[SCAN] ✅ Ticket valide, marquage comme scanné:', ticketId);
  console.log('[SCAN] Nom:', ticket.fullName, 'Quantité:', ticket.quantity);
  
  ticket.status = 'checked_in';
  ticket.lastScanAt = new Date();
  await ticket.save();
  
  console.log('[SCAN] ✅ Ticket scanné avec succès:', ticketId);
  return { 
    ticket, 
    status: 'ok', 
    message: `Entrée validée pour ${ticket.fullName} (${ticket.quantity} billet${ticket.quantity > 1 ? 's' : ''})` 
  };
};

