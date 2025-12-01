# 🚀 Guide Complet d'Hébergement - ONE Life

## 📋 Vue d'ensemble

Votre application ONE Life est une application full-stack composée de :
- **Frontend** : React (client/)
- **Backend** : Node.js/Express (server/)
- **Base de données** : MongoDB

Pour que les clients puissent passer des commandes, vous devez héberger ces 3 composants.

## 🏆 Options d'hébergement recommandées

### Option 1 : Hébergement Complet (Recommandé pour débutants)
**Plateforme : Vercel + MongoDB Atlas**
- ✅ Facile à déployer
- ✅ Gratuit pour commencer
- ✅ Évolutif automatiquement

### Option 2 : Hébergement Traditionnel
**Serveur VPS (DigitalOcean, OVH, etc.) + MongoDB Atlas**
- ✅ Contrôle total
- ✅ Plus complexe à gérer

### Option 3 : Cloud Moderne
**Railway, Render, ou Fly.io**
- ✅ Déploiement simplifié
- ✅ Base de données incluse

---

## 📦 Préparation pour la production

### 1. Configuration du Backend

Modifiez le fichier `server/.env` :

```env
# Production
NODE_ENV=production
PORT=5000

# MongoDB Atlas (gratuit)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/onelife?retryWrites=true&w=majority

# Sécurité
JWT_SECRET=votre-super-secret-unique-pour-production

# Admin
ADMIN_EMAIL=admin@votredomaine.com
ADMIN_PASSWORD=votre-mot-de-passe-securise

# CORS - Remplacer par votre domaine
CORS_ORIGINS=https://votredomaine.vercel.app,https://www.votredomaine.com

# Email (optionnel pour les QR)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-app

# WhatsApp (optionnel)
WHATSAPP_TOKEN=votre-token
WHATSAPP_PHONE_ID=votre-phone-id

# Désactiver le sandbox pour envois réels
DELIVERY_SANDBOX=false
```

### 2. Build du Frontend

```bash
cd client
npm run build
```

Cela crée un dossier `dist/` avec les fichiers optimisés.

### 3. Configuration MongoDB Atlas (Base de données)

1. Allez sur [MongoDB Atlas](https://cloud.mongodb.com/)
2. Créez un compte gratuit
3. Créez un cluster gratuit (M0)
4. Créez une base de données "onelife"
5. Créez un utilisateur avec mot de passe
6. Autorisez l'accès depuis "0.0.0.0/0" (toutes les IP)
7. Copiez la connection string dans `.env`

---

## 🚀 Déploiement avec Vercel (Recommandé)

### Étape 1 : Préparer le Backend

1. **Modifier package.json du serveur** :
```json
{
  "scripts": {
    "start": "node src/index.js",
    "build": "echo 'No build step required'"
  },
  "engines": {
    "node": "18.x"
  }
}
```

2. **Créer vercel.json** dans `server/` :
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Étape 2 : Déployer le Backend

1. Allez sur [Vercel](https://vercel.com)
2. Connectez votre compte GitHub
3. Importez votre projet
4. Sélectionnez le dossier `server/` comme root
5. Ajoutez les variables d'environnement depuis votre `.env`
6. Déployez

**URL du backend** : `https://votrep-rojet.vercel.app`

### Étape 3 : Déployer le Frontend

1. Dans Vercel, créez un nouveau projet
2. Sélectionnez le dossier `client/`
3. Configurez les variables d'environnement :
   - `VITE_API_URL=https://votrep-rojet.vercel.app`
4. Déployez

**URL du frontend** : `https://votrep-rojet-client.vercel.app`

### Étape 4 : Configuration Finale

1. **Mettre à jour CORS** dans le backend :
```env
CORS_ORIGINS=https://votrep-rojet-client.vercel.app
```

2. **Redéployer** le backend avec la nouvelle configuration

---

## 🔧 Configuration Alternative - Railway

### Backend sur Railway

1. Allez sur [Railway](https://railway.app)
2. Connectez GitHub
3. Créez un projet depuis votre repo
4. Railway détecte automatiquement Node.js
5. Ajoutez les variables d'environnement
6. La base de données est incluse automatiquement

### Frontend sur Vercel

Même procédure que ci-dessus.

---

## 🌐 Acheter un Domaine

### Option 1 : Nom de domaine personnalisé

1. Achetez un domaine chez :
   - [OVH](https://www.ovh.com)
   - [GoDaddy](https://www.godaddy.com)
   - [Namecheap](https://www.namecheap.com)

2. **Prix** : ~10-15€/an

### Option 2 : Sous-domaine gratuit

Utilisez des services comme :
- `votrenom.railway.app`
- `votrenom.vercel.app`

### Configuration du Domaine

1. **Sur Vercel** :
   - Allez dans Settings > Domains
   - Ajoutez votre domaine
   - Suivez les instructions DNS

2. **Mettre à jour les variables** :
```env
CORS_ORIGINS=https://votredomaine.com,https://www.votredomaine.com
```

---

## 📧 Configuration Email (Important pour les QR)

### Avec Gmail

1. Activez la vérification en 2 étapes
2. Générez un "Mot de passe d'application"
3. Configurez dans `.env` :
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-app
```

### Alternatives gratuites

- **SendGrid** : 100 emails/jour gratuit
- **Mailgun** : 5,000 emails/mois gratuit
- **Brevo** (ex-Sendinblue) : 300 emails/jour gratuit

---

## 📱 Configuration WhatsApp (Optionnel)

### WhatsApp Business API

1. Créez une app Facebook Developer
2. Configurez WhatsApp Business API
3. Obtenez Token et Phone Number ID
4. Configurez dans `.env`

**Note** : WhatsApp Business API nécessite une vérification d'entreprise (~100€/mois)

### Alternative : WhatsApp Web (non recommandé pour production)

Utilisez des services comme 360Dialog ou Twilio.

---

## 🔒 Sécurité en Production

### Variables à changer

- `JWT_SECRET` : Utilisez une clé longue et aléatoire
- `ADMIN_PASSWORD` : Mot de passe fort
- `MONGODB_URI` : Utilisez MongoDB Atlas avec authentification

### Bonnes pratiques

1. **HTTPS obligatoire** : Vercel le fournit automatiquement
2. **Variables d'environnement** : Jamais dans le code
3. **Logs** : Surveillez les erreurs
4. **Sauvegardes** : MongoDB Atlas fait des backups automatiques

---

## 🧪 Test de Production

### Vérifications importantes

1. **Page publique accessible** : `https://votredomaine.com`
2. **Création de ticket** : Testez le formulaire
3. **Login admin** : Vérifiez l'accès admin
4. **Génération QR** : Testez la confirmation de ticket
5. **Scan QR** : Testez avec un vrai téléphone

### Commandes de test

```bash
# Test du backend
curl https://votrep-backend.vercel.app/health

# Test de création ticket
curl -X POST https://votrep-backend.vercel.app/public/tickets \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","phoneNumber":"0123456789","quantity":1,"paymentReference":"TEST123"}'
```

---

## 💰 Coûts Estimés

### Gratuit
- **Vercel** : 100GB bandwidth/mois
- **MongoDB Atlas** : 512MB stockage
- **Railway** : 512MB RAM, 1GB stockage

### Payant (si besoin d'échelle)
- **Domaine** : 10€/an
- **MongoDB** : ~10€/mois pour 5GB
- **Email** : 0-20€/mois selon volume
- **WhatsApp** : ~100€/mois

---

## 🚨 Dépannage Hébergement

### Erreur 500 Backend
- Vérifiez les logs Vercel/Railway
- Vérifiez la connexion MongoDB
- Vérifiez les variables d'environnement

### Frontend ne charge pas
- Vérifiez `VITE_API_URL`
- Vérifiez CORS dans le backend
- Vérifiez la construction du build

### Base de données inaccessible
- Vérifiez la whitelist IP (0.0.0.0/0 pour Atlas)
- Vérifiez les credentials MongoDB
- Vérifiez la connection string

### QR ne se génère pas
- Vérifiez que le package `qrcode` est installé
- Vérifiez les permissions d'écriture

---

## 📞 Support

Si vous avez des problèmes :

1. **Vérifiez les logs** de votre plateforme d'hébergement
2. **Testez localement** d'abord
3. **Vérifiez la configuration** étape par étape
4. **Contactez le support** de votre hébergeur

**Votre application sera accessible 24/7 une fois déployée ! 🎉**
