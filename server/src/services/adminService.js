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
  console.log('🔍 Tentative de connexion pour:', email);
  
  const admin = await Admin.findOne({ email: email.toLowerCase() });
  console.log('👤 Admin trouvé:', admin ? 'OUI' : 'NON');
  
  if (!admin) {
    console.log('❌ Aucun admin trouvé avec cet email');
    return null;
  }
  
  console.log('📧 Email dans la DB:', admin.email);
  console.log('🔑 Hash stocké dans la DB:', admin.passwordHash ? 'EXISTE' : 'MANQUANT');
  console.log('🔑 Longueur du hash:', admin.passwordHash ? admin.passwordHash.length : 0);
  console.log('🔑 Password fourni:', password);
  console.log('🔑 Longueur password fourni:', password.length);
  
  const isMatch = await bcrypt.compare(password, admin.passwordHash);
  console.log('✅ Comparaison bcrypt - Match:', isMatch);
  
  if (!isMatch) {
    console.log('❌ Mot de passe incorrect');
    return null;
  }
  
  console.log('✅ Authentification réussie pour:', admin.email);
  
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
  console.log('➕ Création d\'un nouvel admin:', email);
  
  // Vérifier si l'admin existe déjà
  const existing = await Admin.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log('⚠️ Admin déjà existant');
    throw new Error('Un administrateur avec cet email existe déjà');
  }
  
  console.log('🔒 Hashage du mot de passe...');
  const passwordHash = await bcrypt.hash(password, 10);
  console.log('✅ Hash créé, longueur:', passwordHash.length);
  
  const newAdmin = await Admin.create({
    email: email.toLowerCase(),
    passwordHash,
    displayName: displayName || email.split('@')[0],
    role: role || 'admin'
  });
  
  console.log('✅ Nouvel admin créé avec succès:', newAdmin._id);
  
  return newAdmin;
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