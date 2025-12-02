# 🔐 Corriger le Mot de Passe Admin après Modification dans Render

## ❌ Problème

Tu as modifié `ADMIN_PASSWORD` dans Render, mais le frontend ne fonctionne plus car :
- L'admin existe déjà dans MongoDB avec l'**ancien mot de passe**
- Le système ne met pas à jour automatiquement le mot de passe existant
- Tu ne peux plus te connecter avec le nouveau mot de passe

## ✅ Solutions

### Solution 1 : Mettre à Jour le Mot de Passe via l'Interface Admin (Si tu peux encore te connecter)

Si tu as encore accès avec l'ancien mot de passe :

1. **Connecte-toi** avec l'ancien mot de passe
2. Va dans le **Dashboard Admin**
3. Utilise la fonctionnalité **"Changer le mot de passe"** (si disponible)
4. Entre le **nouveau mot de passe** (celui que tu as mis dans Render)

---

### Solution 2 : Supprimer l'Admin Existant dans MongoDB (Recommandé) ⭐

Cette méthode permet au système de recréer automatiquement l'admin avec le nouveau mot de passe.

#### Étape 1 : Aller sur MongoDB Atlas

1. Va sur **https://cloud.mongodb.com**
2. Connecte-toi
3. Clique sur **"Database"** → **"Browse Collections"**
4. Sélectionne ta base de données (probablement `onelife`)
5. Clique sur la collection **`admins`**

#### Étape 2 : Trouver et Supprimer l'Admin

1. Tu verras la liste des admins
2. Trouve l'admin avec l'email correspondant à `ADMIN_EMAIL` dans Render
3. Clique sur l'admin pour l'ouvrir
4. Clique sur **"Delete"** (ou le bouton de suppression)
5. Confirme la suppression

#### Étape 3 : Redémarrer le Service Render

1. Va sur **https://dashboard.render.com**
2. Clique sur ton service backend
3. Va dans l'onglet **"Manual Deploy"** (ou "Events")
4. Clique sur **"Clear build cache & deploy"** (ou simplement redémarre le service)
5. Attends que le service redémarre

#### Étape 4 : Vérifier

Le système va automatiquement recréer l'admin avec :
- **Email** : La valeur de `ADMIN_EMAIL` dans Render
- **Password** : La valeur de `ADMIN_PASSWORD` dans Render (le nouveau)

Tu pourras maintenant te connecter avec le nouveau mot de passe !

---

### Solution 3 : Script pour Mettre à Jour le Mot de Passe

Si tu préfères mettre à jour directement sans supprimer, utilise ce script :

#### Créer le Script

Crée un fichier `server/update-admin-password.js` :

```javascript
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
      console.log('❌ Admin non trouvé. Il sera créé au prochain démarrage.');
      await mongoose.connection.close();
      return;
    }

    // Mettre à jour le mot de passe
    const passwordHash = await bcrypt.hash(env.adminPassword, 10);
    admin.passwordHash = passwordHash;
    await admin.save();

    console.log(`✅ Mot de passe mis à jour pour: ${env.adminEmail}`);
    console.log('✅ Tu peux maintenant te connecter avec le nouveau mot de passe');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

updateAdminPassword();
```

#### Utiliser le Script

1. **Assure-toi d'avoir un fichier `.env`** dans le dossier `server` avec :
   ```
   MONGODB_URI=ton_uri_mongodb
   ADMIN_EMAIL=ton_email@admin.com
   ADMIN_PASSWORD=ton_nouveau_mot_de_passe
   ```

2. **Exécute le script** :
   ```bash
   cd server
   node update-admin-password.js
   ```

3. **Vérifie** : Tu devrais voir un message de succès

---

### Solution 4 : Via MongoDB Shell (Avancé)

Si tu as accès au shell MongoDB :

```javascript
use onelife

// Trouver l'admin
db.admins.findOne({ email: "ton-email@admin.com" })

// Mettre à jour le mot de passe (remplace le hash)
// Note: Tu dois générer un hash bcrypt du nouveau mot de passe
db.admins.updateOne(
  { email: "ton-email@admin.com" },
  { $set: { passwordHash: "NOUVEAU_HASH_BCRYPT" } }
)
```

⚠️ **Note** : Générer un hash bcrypt manuellement est complexe. Utilise plutôt les solutions 2 ou 3.

---

## 🎯 Solution Recommandée : Solution 2

**Pourquoi ?**
- ✅ Simple et rapide
- ✅ Pas besoin de code supplémentaire
- ✅ Le système recrée automatiquement l'admin avec les bonnes valeurs
- ✅ Garantit que l'admin correspond aux variables d'environnement

**Étapes rapides :**
1. MongoDB Atlas → Collection `admins` → Supprimer l'admin
2. Render → Redémarrer le service
3. Se connecter avec le nouveau mot de passe

---

## ✅ Vérification

Après avoir appliqué une solution :

1. **Ouvre ton frontend**
2. **Va sur la page de login** (`/login`)
3. **Connecte-toi avec** :
   - Email : La valeur de `ADMIN_EMAIL` dans Render
   - Password : La valeur de `ADMIN_PASSWORD` dans Render (le nouveau)
4. **Si ça fonctionne** : ✅ Problème résolu !

---

## 🔍 Dépannage

### Le service Render ne redémarre pas

1. Va dans Render → Ton service → "Events"
2. Clique sur "Manual Deploy" → "Deploy latest commit"
3. Attends que le déploiement se termine

### L'admin n'est pas recréé

1. Vérifie les logs Render pour voir s'il y a des erreurs
2. Vérifie que `ADMIN_EMAIL` et `ADMIN_PASSWORD` sont bien définis dans Render
3. Vérifie que MongoDB est accessible depuis Render

### Tu ne te souviens plus de l'email admin

1. Va dans Render → Environment Variables
2. Regarde la valeur de `ADMIN_EMAIL`
3. C'est l'email que tu dois utiliser pour te connecter

---

**💡 Astuce** : Pour éviter ce problème à l'avenir, utilise la fonctionnalité "Changer le mot de passe" dans l'interface admin au lieu de modifier directement dans Render.

