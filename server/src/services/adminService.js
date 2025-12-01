import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin.js';
import { env } from '../config/env.js';
import { signToken } from '../utils/jwt.js';

export const ensureDefaultAdmin = async () => {
  const admin = await Admin.findOne({ email: env.adminEmail });
  if (admin) return admin;
  const passwordHash = await bcrypt.hash(env.adminPassword, 10);
  return Admin.create({
    email: env.adminEmail,
    passwordHash,
    displayName: 'ONE Life Admin',
    role: 'admin' // Admin principal a toujours le rôle admin
  });
};

export const authenticateAdmin = async (email, password) => {
  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin) return null;
  const isMatch = await bcrypt.compare(password, admin.passwordHash);
  if (!isMatch) return null;
  const token = signToken({ 
    sub: admin._id.toString(), 
    email: admin.email,
    role: admin.role 
  });
  return { admin, token };
};

// Gestion des admins
export const getAllAdmins = async () => {
  return Admin.find().select('-passwordHash').sort({ createdAt: -1 });
};

export const createAdmin = async (email, password, displayName, role = 'admin') => {
  // Vérifier si l'admin existe déjà
  const existing = await Admin.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new Error('Un administrateur avec cet email existe déjà');
  }
  
  const passwordHash = await bcrypt.hash(password, 10);
  return Admin.create({
    email: email.toLowerCase(),
    passwordHash,
    displayName: displayName || email.split('@')[0],
    role: role || 'admin'
  });
};

export const deleteAdmin = async (adminId, currentAdminId) => {
  // Empêcher de supprimer son propre compte
  if (adminId.toString() === currentAdminId.toString()) {
    throw new Error('Vous ne pouvez pas supprimer votre propre compte');
  }
  
  const admin = await Admin.findById(adminId);
  if (!admin) {
    throw new Error('Administrateur introuvable');
  }
  
  await Admin.findByIdAndDelete(adminId);
  return { message: 'Administrateur supprimé avec succès' };
};

export const updateAdminPassword = async (adminId, newPassword) => {
  const passwordHash = await bcrypt.hash(newPassword, 10);
  return Admin.findByIdAndUpdate(
    adminId,
    { passwordHash },
    { new: true }
  ).select('-passwordHash');
};

