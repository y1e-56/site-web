import { 
  authenticateAdmin, 
  ensureDefaultAdmin,
  getAllAdmins,
  createAdmin,
  deleteAdmin,
  updateAdminPassword
} from '../services/adminService.js';
import {
  confirmTicketRequest,
  fetchTickets,
  markTicketSent
} from '../services/ticketService.js';

export const login = async (req, res) => {
  try {
    await ensureDefaultAdmin();
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }
    const result = await authenticateAdmin(email, password);
    if (!result) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }
    return res.json({
      token: result.token,
      admin: {
        id: result.admin._id,
        email: result.admin.email,
        displayName: result.admin.displayName,
        role: result.admin.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTickets = async (req, res) => {
  try {
    const { status, query } = req.query;
    const filter = status ? { status } : {};
    if (query) {
      filter.$or = [
        { fullName: new RegExp(query, 'i') },
        { paymentReference: new RegExp(query, 'i') },
        { phoneNumber: new RegExp(query, 'i') }
      ];
    }
    const tickets = await fetchTickets(filter);
    return res.json(tickets);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const confirmTicket = async (req, res) => {
  try {
    console.log('[ADMIN] Confirmation du ticket:', req.params.id);
    
    // Génération du QR code uniquement - pas d'envoi automatique
    const ticket = await confirmTicketRequest(req.params.id);
    console.log('[ADMIN] ✅ QR code généré pour le ticket:', ticket._id);
    console.log('[ADMIN] QR disponible - Payload:', !!ticket.qrPayload, 'Image:', !!ticket.qrImage);
    console.log('[ADMIN] Le QR code est maintenant disponible dans le dashboard pour téléchargement manuel');
    
    return res.json(ticket);
  } catch (error) {
    console.error('[ADMIN] Erreur lors de la confirmation:', error);
    return res.status(400).json({ message: error.message });
  }
};

export const markSent = async (req, res) => {
  try {
    const ticket = await markTicketSent(req.params.id);
    return res.json(ticket);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Gestion des administrateurs
export const getAdmins = async (req, res) => {
  try {
    const admins = await getAllAdmins();
    return res.json(admins);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const addAdmin = async (req, res) => {
  try {
    const { email, password, displayName, role } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
    }
    
    // Valider le rôle
    const validRole = role === 'scanner' ? 'scanner' : 'admin';
    
    const admin = await createAdmin(email, password, displayName, validRole);
    return res.status(201).json({
      id: admin._id,
      email: admin.email,
      displayName: admin.displayName,
      role: admin.role,
      createdAt: admin.createdAt
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const removeAdmin = async (req, res) => {
  try {
    const currentAdminId = req.user.sub; // ID de l'admin connecté
    const result = await deleteAdmin(req.params.id, currentAdminId);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const adminId = req.user.sub; // ID de l'admin connecté
    
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
    }
    
    await updateAdminPassword(adminId, newPassword);
    return res.json({ message: 'Mot de passe modifié avec succès' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

