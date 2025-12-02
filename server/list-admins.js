import mongoose from 'mongoose';
import { Admin } from './src/models/Admin.js';
import { env } from './src/config/env.js';
import dotenv from 'dotenv';

dotenv.config();

const connectDb = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    console.log('✅ Connecté à MongoDB');
  } catch (err) {
    console.error('❌ Erreur de connexion:', err.message);
    process.exit(1);
  }
};

const listAdmins = async () => {
  await connectDb();
  
  try {
    const admins = await Admin.find().select('-passwordHash').sort({ createdAt: -1 });
    
    console.log('\n📋 Liste des Administrateurs:\n');
    console.log(`Total: ${admins.length} utilisateur(s) admin\n`);
    console.log('─'.repeat(80));
    
    if (admins.length === 0) {
      console.log('Aucun administrateur trouvé.');
    } else {
      admins.forEach((admin, index) => {
        console.log(`\n${index + 1}. ${admin.displayName || admin.email}`);
        console.log(`   📧 Email: ${admin.email}`);
        console.log(`   👤 Rôle: ${admin.role === 'admin' ? '👑 Administrateur' : '🔍 Scanner'}`);
        console.log(`   📅 Créé le: ${new Date(admin.createdAt).toLocaleString('fr-FR')}`);
        console.log(`   🆔 ID: ${admin._id}`);
      });
    }
    
    console.log('\n' + '─'.repeat(80));
    console.log('\n✅ Liste complète affichée\n');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

listAdmins();

