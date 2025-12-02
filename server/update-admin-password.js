import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Admin } from './src/models/Admin.js';
import { env } from './src/config/env.js';
import dotenv from 'dotenv';

dotenv.config();

const updateAdminPassword = async () => {
  try {
    // Se connecter à MongoDB
    await mongoose.connect(env.mongoUri);
    console.log('✅ Connecté à MongoDB');

    // Trouver l'admin par email
    const admin = await Admin.findOne({ email: env.adminEmail });
    
    if (!admin) {
      console.log('ℹ️  Admin non trouvé. Il sera créé automatiquement au prochain démarrage du serveur.');
      await mongoose.connection.close();
      return;
    }

    // Mettre à jour le mot de passe
    const passwordHash = await bcrypt.hash(env.adminPassword, 10);
    admin.passwordHash = passwordHash;
    await admin.save();

    console.log(`\n✅ Mot de passe mis à jour avec succès !`);
    console.log(`📧 Email: ${env.adminEmail}`);
    console.log(`🔐 Nouveau mot de passe: ${env.adminPassword}`);
    console.log(`\n✅ Tu peux maintenant te connecter avec le nouveau mot de passe\n`);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    if (error.message.includes('Invalid scheme')) {
      console.error('   Vérifie que MONGODB_URI est correcte dans ton fichier .env');
    }
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

updateAdminPassword();

