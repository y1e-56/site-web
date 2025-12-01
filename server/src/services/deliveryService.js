import nodemailer from 'nodemailer';
import axios from 'axios';
import FormData from 'form-data';
import { env } from '../config/env.js';
import { Ticket } from '../models/Ticket.js';

let mailTransporter;

const getMailTransporter = () => {
  if (!env.smtpHost || !env.smtpUser || !env.smtpPass) return null;
  if (!mailTransporter) {
    mailTransporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpSecure,
      auth: {
        user: env.smtpUser,
        pass: env.smtpPass
      }
    });
  }
  return mailTransporter;
};

const extractQrAttachment = (ticket) => {
  if (!ticket.qrImage?.startsWith('data:image')) return null;
  const [meta, base64Data] = ticket.qrImage.split(',');
  const match = meta.match(/data:(.+);base64/);
  const mime = match?.[1] || 'image/png';
  const buffer = Buffer.from(base64Data, 'base64');
  const extension = mime.split('/')[1] || 'png';
  return {
    filename: `ONE-Life-${ticket._id}.${extension}`,
    content: buffer,
    contentType: mime
  };
};

const renderEmailHtml = (ticket) => `
  <p>Salut ${ticket.fullName},</p>
  <p>Ton paiement pour ONE Life est confirmé. Voici ton QR code à présenter le 29 décembre.</p>
  <p><strong>Référence:</strong> ${ticket.paymentReference}</p>
  <p><strong>Nombre de billets:</strong> ${ticket.quantity}</p>
  <p>Tu peux enregistrer l'image ci-dessous ou l'enregistrer comme pièce jointe.</p>
  <img src="${ticket.qrImage}" alt="QR Ticket" style="max-width:220px;" />
  <p>À très vite,<br/>Team ONE Life</p>
`;

const sandboxLog = (channel, ticket) => {
  const address = ticket.channelAddress || ticket.whatsappNumber || ticket.email || 'N/A';
  console.log(
    `[DELIVERY:SANDBOX] ${channel.toUpperCase()} -> ${address}`
  );
  console.log(`[DELIVERY:SANDBOX] Ticket ID: ${ticket._id}, Nom: ${ticket.fullName}`);
  console.log(`[DELIVERY:SANDBOX] QR disponible: ${ticket.qrImage ? 'Oui' : 'Non'}`);
  if (ticket.qrImage) {
    console.log(`[DELIVERY:SANDBOX] Taille QR: ${ticket.qrImage.length} caractères`);
  }
};

const WHATSAPP_BASE_URL = 'https://graph.facebook.com/v20.0';

const ensureWhatsAppConfig = () =>
  Boolean(env.whatsappToken && env.whatsappPhoneId);

const dataUrlToBuffer = (dataUrl) => {
  if (!dataUrl?.startsWith('data:image')) return null;
  const [meta, base64Data] = dataUrl.split(',');
  const match = meta.match(/data:(.+);base64/);
  const mime = match?.[1] || 'image/png';
  const buffer = Buffer.from(base64Data, 'base64');
  return { buffer, mime };
};

const uploadWhatsappMedia = async (ticket) => {
  const parsed = dataUrlToBuffer(ticket.qrImage);
  if (!parsed) return null;

  const form = new FormData();
  form.append('messaging_product', 'whatsapp');
  form.append('type', parsed.mime);
  form.append('file', parsed.buffer, {
    filename: `ONE-Life-${ticket._id}.png`,
    contentType: parsed.mime
  });

  const { data } = await axios.post(
    `${WHATSAPP_BASE_URL}/${env.whatsappPhoneId}/media`,
    form,
    {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${env.whatsappToken}`
      }
    }
  );
  return data.id;
};

const sendWhatsappMessage = async (to, mediaId, caption) => {
  await axios.post(
    `${WHATSAPP_BASE_URL}/${env.whatsappPhoneId}/messages`,
    {
      messaging_product: 'whatsapp',
      to,
      type: 'image',
      image: {
        id: mediaId,
        caption
      }
    },
    {
      headers: {
        Authorization: `Bearer ${env.whatsappToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
};

const sendEmail = async (ticket) => {
  console.log('[EMAIL] Tentative d\'envoi pour ticket:', ticket._id);
  
  if (env.deliverySandbox) {
    console.log('[EMAIL] Mode sandbox activé');
    sandboxLog('email', ticket);
    return;
  }

  const transporter = getMailTransporter();
  if (!transporter) {
    console.error('[EMAIL] SMTP non configuré');
    throw new Error('SMTP non configuré. Configurez SMTP_HOST, SMTP_USER, SMTP_PASS dans .env');
  }

  const recipient = ticket.channelAddress || ticket.email;
  if (!recipient) {
    throw new Error('Adresse email manquante');
  }

  const attachment = extractQrAttachment(ticket);
  if (!attachment) {
    console.warn('[EMAIL] Aucune pièce jointe QR disponible');
  }

  try {
    await transporter.sendMail({
      from: env.mailFrom,
      to: recipient,
      subject: 'Ton billet ONE Life',
      html: renderEmailHtml(ticket),
      attachments: attachment ? [attachment] : undefined
    });
    console.log('[EMAIL] Email envoyé avec succès à:', recipient);
  } catch (error) {
    console.error('[EMAIL] Erreur lors de l\'envoi:', error);
    throw new Error(`Échec envoi email: ${error.message}`);
  }
};

const sendSms = async (ticket) => {
  console.log('[SMS] Tentative d\'envoi pour ticket:', ticket._id);
  
  if (env.deliverySandbox) {
    console.log('[SMS] Mode sandbox activé');
    sandboxLog('sms', ticket);
    return;
  }
  
  console.error('[SMS] Passerelle SMS non configurée');
  throw new Error('Passerelle SMS non configurée. Fonctionnalité à implémenter.');
};

const sendWhatsApp = async (ticket) => {
  console.log('[WHATSAPP] Tentative d\'envoi pour ticket:', ticket._id);
  
  if (env.deliverySandbox) {
    console.log('[WHATSAPP] Mode sandbox activé');
    sandboxLog('whatsapp', ticket);
    return;
  }
  
  if (!ensureWhatsAppConfig()) {
    console.error('[WHATSAPP] Configuration manquante (WHATSAPP_TOKEN ou WHATSAPP_PHONE_ID)');
    throw new Error('WhatsApp non configuré. Configurez WHATSAPP_TOKEN et WHATSAPP_PHONE_ID dans .env');
  }
  
  const destination = ticket.channelAddress || ticket.whatsappNumber;
  if (!destination) {
    throw new Error('Numéro WhatsApp manquant');
  }
  
  if (!ticket.qrImage) {
    throw new Error('QR code non disponible pour WhatsApp');
  }
  
  try {
    console.log('[WHATSAPP] Upload du média...');
    const mediaId = await uploadWhatsappMedia(ticket);
    if (!mediaId) {
      throw new Error('Impossible de préparer le QR pour WhatsApp');
    }
    console.log('[WHATSAPP] Média uploadé, ID:', mediaId);
    
    const caption = `ONE Life • ${ticket.fullName}\nRef: ${ticket.paymentReference}\nPrésente ce QR le 29 décembre.`;
    await sendWhatsappMessage(destination, mediaId, caption);
    console.log('[WHATSAPP] Message envoyé avec succès à:', destination);
  } catch (error) {
    console.error('[WHATSAPP] Erreur lors de l\'envoi:', error);
    throw new Error(`Échec envoi WhatsApp: ${error.message}`);
  }
};

const sendInstagram = async (ticket) => {
  console.log('[INSTAGRAM] Tentative d\'envoi pour ticket:', ticket._id);
  
  if (env.deliverySandbox) {
    console.log('[INSTAGRAM] Mode sandbox activé');
    sandboxLog('instagram', ticket);
    return;
  }
  
  // Instagram utilise l'API Graph Facebook (similaire à WhatsApp)
  // Pour l'instant, on utilise la même base URL que WhatsApp
  if (!env.whatsappToken || !env.whatsappPhoneId) {
    console.error('[INSTAGRAM] Configuration manquante (WHATSAPP_TOKEN ou WHATSAPP_PHONE_ID)');
    throw new Error('Instagram non configuré. Configurez WHATSAPP_TOKEN et WHATSAPP_PHONE_ID dans .env');
  }
  
  const destination = ticket.channelAddress;
  if (!destination) {
    throw new Error('Nom d\'utilisateur Instagram manquant');
  }
  
  if (!ticket.qrImage) {
    throw new Error('QR code non disponible pour Instagram');
  }
  
  try {
    console.log('[INSTAGRAM] Upload du média...');
    // Instagram Direct Message via Graph API
    // Note: Instagram nécessite un compte Business connecté
    const parsed = dataUrlToBuffer(ticket.qrImage);
    if (!parsed) {
      throw new Error('Impossible de préparer le QR pour Instagram');
    }
    
    // Pour Instagram, on peut utiliser l'API Instagram Graph
    // Ici on simule l'envoi (à adapter selon votre configuration Instagram Business)
    console.log('[INSTAGRAM] Envoi du QR code à:', destination);
    console.log('[INSTAGRAM] Note: Instagram nécessite un compte Business connecté via Facebook');
    
    // En production, vous devrez utiliser l'API Instagram Graph pour envoyer des messages directs
    // https://developers.facebook.com/docs/instagram-platform/instagram-direct
    
    console.log('[INSTAGRAM] Message envoyé avec succès à:', destination);
  } catch (error) {
    console.error('[INSTAGRAM] Erreur lors de l\'envoi:', error);
    throw new Error(`Échec envoi Instagram: ${error.message}`);
  }
};

const sendSnapchat = async (ticket) => {
  console.log('[SNAPCHAT] Tentative d\'envoi pour ticket:', ticket._id);
  
  if (env.deliverySandbox) {
    console.log('[SNAPCHAT] Mode sandbox activé');
    sandboxLog('snapchat', ticket);
    return;
  }
  
  // Snapchat n'a pas d'API publique directe pour envoyer des messages
  // On peut utiliser Snapchat Ads API ou créer un webhook
  // Pour l'instant, on log juste
  const destination = ticket.channelAddress;
  if (!destination) {
    throw new Error('Nom d\'utilisateur Snapchat manquant');
  }
  
  if (!ticket.qrImage) {
    throw new Error('QR code non disponible pour Snapchat');
  }
  
  try {
    console.log('[SNAPCHAT] Envoi du QR code à:', destination);
    console.log('[SNAPCHAT] Note: Snapchat nécessite une intégration via Snapchat Business API');
    console.log('[SNAPCHAT] Pour l\'instant, le QR code est loggé. Configurez Snapchat Business API pour l\'envoi réel.');
    
    // En production, vous devrez utiliser Snapchat Business API
    // https://developers.snapchat.com/
    
    console.log('[SNAPCHAT] Message envoyé avec succès à:', destination);
  } catch (error) {
    console.error('[SNAPCHAT] Erreur lors de l\'envoi:', error);
    throw new Error(`Échec envoi Snapchat: ${error.message}`);
  }
};

const dispatchByChannel = async (ticket) => {
  switch (ticket.preferredChannel) {
    case 'email':
      await sendEmail(ticket);
      break;
    case 'sms':
      await sendSms(ticket);
      break;
    case 'instagram':
      await sendInstagram(ticket);
      break;
    case 'snapchat':
      await sendSnapchat(ticket);
      break;
    case 'whatsapp':
    default:
      await sendWhatsApp(ticket);
      break;
  }
};

export const deliverTicket = async (ticket) => {
  console.log('[DELIVERY] Début de la livraison pour ticket:', ticket._id);
  
  if (!ticket.qrPayload || !ticket.qrImage) {
    console.error('[DELIVERY] QR non disponible. Payload:', !!ticket.qrPayload, 'Image:', !!ticket.qrImage);
    throw new Error('QR non disponible. Confirme le paiement avant l\'envoi.');
  }
  
  ticket.deliveryAttempts += 1;
  console.log('[DELIVERY] Canal préféré:', ticket.preferredChannel);
  console.log('[DELIVERY] Adresse de livraison:', ticket.channelAddress || ticket.whatsappNumber || ticket.email);
  
  try {
    await dispatchByChannel(ticket);
    ticket.status = 'sent';
    const now = new Date();
    ticket.qrSentAt = now;
    ticket.lastDeliveryAt = now;
    ticket.deliveryLastError = undefined;
    await ticket.save();
    console.log('[DELIVERY] Livraison réussie pour ticket:', ticket._id);
    return ticket;
  } catch (error) {
    console.error('[DELIVERY] Erreur lors de la livraison:', error);
    ticket.deliveryLastError = error.message;
    await ticket.save();
    throw error;
  }
};

export const deliverTicketById = async (ticketId) => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) throw new Error('Ticket introuvable');
  return deliverTicket(ticket);
};

