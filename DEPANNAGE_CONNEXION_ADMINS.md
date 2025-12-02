# 🔧 Dépannage : Nouveaux Admins ne Peuvent Pas Se Connecter

## ❌ Problème

Les nouveaux admins créés ne peuvent pas se connecter depuis leur téléphone, mais toi (créateur) tu peux te connecter.

## 🔍 Causes Possibles

### 1. Problème CORS (Le Plus Probable) ⚠️

**Symptôme** : Erreur CORS dans la console du navigateur mobile

**Cause** : L'URL du frontend sur mobile n'est pas dans `CORS_ORIGINS` dans Render

**Solution** :
1. Va sur **Render** → Ton service backend → **Environment**
2. Trouve `CORS_ORIGINS`
3. Vérifie toutes les URLs possibles :
   - URL de production Vercel (ex: `https://site-web.vercel.app`)
   - URLs de preview Vercel (ex: `https://site-o6hm508zb-y1e-56s-projects.vercel.app`)
   - **Ajoute toutes les URLs** séparées par des virgules :
     ```
     https://site-web.vercel.app,https://site-o6hm508zb-y1e-56s-projects.vercel.app,https://site-*.vercel.app
     ```
4. Sauvegarde et redéploie

**Note** : Vercel génère des URLs différentes pour chaque déploiement. Il faut ajouter toutes les URLs possibles.

---

### 2. Problème d'Email (Espaces ou Majuscules)

**Symptôme** : "Identifiants invalides" même avec le bon mot de passe

**Cause** : L'email saisi a des espaces ou des majuscules différentes

**Vérification** :
1. Va sur **MongoDB Atlas** → Collection `admins`
2. Vérifie l'email exact stocké (il devrait être en minuscules)
3. Demande à l'admin de vérifier qu'il n'y a pas d'espaces avant/après l'email

**Solution** :
- Le code convertit automatiquement en minuscules, mais vérifie quand même
- Assure-toi qu'il n'y a pas d'espaces dans l'email

---

### 3. Problème de Mot de Passe

**Symptôme** : "Identifiants invalides"

**Causes possibles** :
- Espaces avant/après le mot de passe
- Caractères spéciaux mal saisis
- Mot de passe différent de celui créé

**Vérification** :
1. Demande à l'admin de **recopier exactement** le mot de passe
2. Vérifie qu'il n'y a pas d'espaces
3. Si le mot de passe contient des caractères spéciaux, vérifie qu'ils sont bien saisis

**Solution** : Réinitialiser le mot de passe de l'admin

---

### 4. Problème d'URL API sur Mobile

**Symptôme** : Erreur réseau ou 404

**Cause** : Le frontend sur mobile utilise une mauvaise URL pour l'API

**Vérification** :
1. Sur le téléphone, ouvre la console du navigateur (si possible)
2. Regarde les requêtes réseau
3. Vérifie que l'URL est : `https://ton-backend.onrender.com/api/admin/login`

**Solution** :
- Vérifie que `VITE_API_URL` est bien configuré dans Vercel
- Vérifie que c'est la bonne URL du backend

---

### 5. Problème de Réseau Mobile

**Symptôme** : Erreur réseau ou timeout

**Cause** : Le téléphone n'arrive pas à accéder au backend

**Vérification** :
1. Demande à l'admin d'essayer depuis un autre réseau (WiFi vs 4G)
2. Vérifie que le backend Render est actif (pas en "sleep")

**Solution** :
- Si le backend Render est en mode "sleep", il faut attendre qu'il se réveille
- Ou upgrade vers un plan payant pour éviter le sleep

---

## 🔍 Diagnostic Étape par Étape

### Étape 1 : Vérifier dans MongoDB

1. Va sur **MongoDB Atlas** → Collection `admins`
2. Trouve l'admin qui ne peut pas se connecter
3. Vérifie :
   - ✅ L'email est bien enregistré (en minuscules)
   - ✅ Le `passwordHash` existe
   - ✅ Le `role` est bien défini (`admin` ou `scanner`)

### Étape 2 : Tester l'Authentification Directement

Crée un script de test pour vérifier si l'authentification fonctionne :

```javascript
// test-admin-login.js
import mongoose from 'mongoose';
import { Admin } from './server/src/models/Admin.js';
import bcrypt from 'bcryptjs';
import { env } from './server/src/config/env.js';
import dotenv from 'dotenv';

dotenv.config();

const testLogin = async (email, password) => {
  try {
    await mongoose.connect(env.mongoUri);
    console.log('✅ Connecté à MongoDB');
    
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    
    if (!admin) {
      console.log('❌ Admin non trouvé');
      return;
    }
    
    console.log('✅ Admin trouvé:', admin.email);
    console.log('   Rôle:', admin.role);
    
    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    
    if (isMatch) {
      console.log('✅ Mot de passe correct');
    } else {
      console.log('❌ Mot de passe incorrect');
    }
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
};

// Utilisation : node test-admin-login.js email@example.com password
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.log('Usage: node test-admin-login.js email@example.com password');
  process.exit(1);
}

testLogin(email, password);
```

### Étape 3 : Vérifier les Logs Render

1. Va sur **Render** → Ton service → **Logs**
2. Demande à l'admin d'essayer de se connecter
3. Regarde les logs pour voir :
   - Si la requête arrive
   - Quelle erreur est retournée
   - Si c'est un problème CORS, authentification, etc.

### Étape 4 : Vérifier la Console du Navigateur Mobile

Si possible, demande à l'admin d'ouvrir la console du navigateur sur mobile :
1. Chrome mobile : Menu → Plus d'outils → Outils de développement
2. Regarde les erreurs dans la console
3. Regarde les requêtes réseau dans l'onglet "Network"

---

## ✅ Solutions Rapides

### Solution 1 : Vérifier CORS (Priorité 1)

**Action immédiate** :
1. Render → Environment → `CORS_ORIGINS`
2. Ajoute **TOUTES** les URLs Vercel possibles
3. Format : `url1,url2,url3` (séparées par des virgules)
4. Sauvegarde et redéploie

### Solution 2 : Réinitialiser le Mot de Passe

Si le problème persiste, réinitialise le mot de passe de l'admin :

1. Va dans l'interface admin
2. Onglet "👥 Administrateurs"
3. Supprime l'admin qui a des problèmes
4. Recrée-le avec un nouveau mot de passe simple (sans caractères spéciaux)
5. Teste la connexion

### Solution 3 : Vérifier l'Email Exact

1. Demande à l'admin de **copier-coller** son email (pas de saisie manuelle)
2. Vérifie qu'il n'y a pas d'espaces
3. Vérifie que c'est exactement le même email que celui créé

---

## 🧪 Test de Connexion

Pour tester si un admin peut se connecter :

1. **Depuis un ordinateur** :
   - Ouvre le frontend
   - Essaie de te connecter avec les identifiants de l'admin
   - Si ça fonctionne → Problème spécifique au mobile

2. **Depuis le téléphone** :
   - Ouvre le frontend
   - Essaie de te connecter
   - Regarde les erreurs dans la console (si possible)

---

## 📋 Checklist de Vérification

- [ ] `CORS_ORIGINS` dans Render contient toutes les URLs Vercel possibles
- [ ] L'email de l'admin est correct dans MongoDB (pas d'espaces)
- [ ] Le mot de passe est correct (pas d'espaces, caractères spéciaux bien saisis)
- [ ] Le backend Render est actif (pas en sleep)
- [ ] `VITE_API_URL` est correct dans Vercel
- [ ] Les logs Render montrent les requêtes qui arrivent
- [ ] Pas d'erreur CORS dans la console mobile

---

## 💡 Astuce

**Pour éviter les problèmes CORS avec Vercel** :

Ajoute un wildcard dans CORS (moins sécurisé mais plus pratique pour le développement) :

Dans Render, modifie `CORS_ORIGINS` pour accepter toutes les URLs Vercel :
```
https://*.vercel.app
```

⚠️ **Note de sécurité** : Pour la production, il vaut mieux lister toutes les URLs exactes.

---

**🎯 Commence par vérifier CORS, c'est souvent la cause principale !**

