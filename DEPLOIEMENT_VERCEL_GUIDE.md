# 🚀 Déploiement ONE Life sur Vercel + MongoDB Atlas

## 📋 Prérequis

- Compte GitHub (pour connecter votre code)
- Compte Vercel (gratuit)
- Compte MongoDB Atlas (gratuit)

---

## 🗄️ Étape 1 : Configuration MongoDB Atlas

### 1.1 Créer un compte MongoDB Atlas

1. Allez sur [mongodb.com/atlas](https://cloud.mongodb.com/)
2. Cliquez "Try Free" (gratuit)
3. Créez votre compte avec email

### 1.2 Créer un cluster gratuit

1. Choisissez "M0 Cluster" (gratuit)
2. Région : Sélectionnez une région proche (ex: Frankfurt pour Europe)
3. Nom du cluster : "onelife-cluster"
4. Cliquez "Create Cluster" (5-10 minutes)

### 1.3 Configuration de sécurité

1. **Créer un utilisateur** :
   - Allez dans "Database Access"
   - "Add New Database User"
   - Username : `onelife-admin`
   - Password : Créez un mot de passe fort (sauvegardez-le !)
   - Rôle : "Read and write to any database"

2. **Autoriser les connexions** :
   - Allez dans "Network Access"
   - "Add IP Address"
   - Choisissez "Allow Access from Anywhere" (0.0.0.0/0)

### 1.4 Obtenir la connection string

1. Allez dans "Clusters"
2. Cliquez "Connect"
3. Choisissez "Connect your application"
4. Copiez la connection string :
   ```
   mongodb+srv://onelife-admin:<password>@onelife-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Remplacez `<password>` par votre vrai mot de passe

---

## 🔧 Étape 2 : Préparation du code

### 2.1 Modifier le fichier .env

Ouvrez `server/.env` et modifiez :

```env
# Base de données MongoDB Atlas
MONGODB_URI=mongodb+srv://onelife-admin:VOTRE_MOT_DE_PASSE@onelife-cluster.xxxxx.mongodb.net/onelife?retryWrites=true&w=majority

# Production
NODE_ENV=production
PORT=5000

# Sécurité (changez !)
JWT_SECRET=une-cle-tres-longue-et-aleatoire-au-moins-64-caracteres-pour-la-securite

# Admin
ADMIN_EMAIL=admin@onelife-event.com
ADMIN_PASSWORD=VotreMotDePasseSecurise123!

# CORS (temporaire pour Vercel)
CORS_ORIGINS=https://onelife-client.vercel.app,https://onelife.vercel.app

# Désactiver sandbox
DELIVERY_SANDBOX=false
```

### 2.2 Créer vercel.json pour le backend

Créez un fichier `server/vercel.json` :

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

### 2.3 Modifier package.json du serveur

Ouvrez `server/package.json` et ajoutez :

```json
{
  "engines": {
    "node": "18.x"
  }
}
```

### 2.4 Commit et push sur GitHub

```bash
git add .
git commit -m "Préparation déploiement production"
git push origin main
```

---

## 🚀 Étape 3 : Déploiement du Backend

### 3.1 Créer un compte Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. "Sign Up" avec votre compte GitHub
3. Autorisez l'accès à vos repos

### 3.2 Déployer le backend

1. Cliquez "New Project"
2. Importez votre repo GitHub
3. **Configure project** :
   - **Project Name** : `onelife-backend`
   - **Root Directory** : `server`
   - **Build Command** : laissez vide
   - **Output Directory** : laissez vide
   - **Install Command** : `npm install`

4. **Environment Variables** : Ajoutez toutes les variables de votre `.env` :
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `CORS_ORIGINS`
   - `NODE_ENV=production`
   - `DELIVERY_SANDBOX=false`

5. Cliquez "Deploy"

**⏱️ Temps** : 2-3 minutes

### 3.3 Vérifier le déploiement

Une fois déployé, vous aurez une URL comme :
`https://onelife-backend-xxxxx.vercel.app`

Testez avec :
```bash
curl https://onelife-backend-xxxxx.vercel.app/health
```

Devrait retourner : `{"ok":true}`

---

## 🌐 Étape 4 : Déploiement du Frontend

### 4.1 Créer un nouveau projet Vercel

1. Dans Vercel, cliquez "New Project"
2. Sélectionnez le même repo GitHub
3. **Configure project** :
   - **Project Name** : `onelife-client`
   - **Root Directory** : `client`
   - **Framework Preset** : `Vite`
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`

4. **Environment Variables** :
   - `VITE_API_URL=https://onelife-backend-xxxxx.vercel.app`

5. Cliquez "Deploy"

**⏱️ Temps** : 1-2 minutes

### 4.2 Vérifier le frontend

URL du frontend : `https://onelife-client-xxxxx.vercel.app`

Testez que la page publique s'affiche.

---

## 🔄 Étape 5 : Configuration Finale

### 5.1 Mettre à jour CORS

Dans les variables d'environnement du backend sur Vercel :
- Changez `CORS_ORIGINS` pour inclure votre vraie URL frontend :
  ```
  CORS_ORIGINS=https://onelife-client-xxxxx.vercel.app
  ```

### 5.2 Redéployer le backend

1. Allez dans votre projet backend sur Vercel
2. Onglet "Deployments"
3. Cliquez les 3 points sur le dernier déploiement
4. "Redeploy" (ou attendez le auto-redeploy)

### 5.3 Test complet

1. **Page publique** : Créez un ticket de test
2. **Admin login** : Connectez-vous avec les identifiants admin
3. **Confirmer ticket** : Générez un QR
4. **Scanner** : Testez le scan (utilisez un téléphone réel)

---

## 🎯 Étape 6 : Domaine personnalisé (Optionnel)

### 6.1 Acheter un domaine

- [OVH.com](https://www.ovh.com) (~10€/an)
- [GoDaddy.com](https://www.godaddy.com)

### 6.2 Configurer sur Vercel

1. Dans votre projet frontend Vercel
2. Settings > Domains
3. Ajoutez votre domaine (ex: `onelife-event.com`)
4. Suivez les instructions DNS

### 6.3 Mettre à jour les variables

Dans le backend Vercel :
```
CORS_ORIGINS=https://onelife-event.com,https://www.onelife-event.com
```

---

## 🧪 Tests de Validation

### Test 1 : Création de ticket
```bash
curl -X POST https://onelife-backend-xxxxx.vercel.app/public/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "phoneNumber": "0123456789",
    "quantity": 1,
    "paymentReference": "TEST123"
  }'
```

### Test 2 : Login admin
```bash
curl -X POST https://onelife-backend-xxxxx.vercel.app/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@onelife-event.com",
    "password": "VotreMotDePasseSecurise123!"
  }'
```

### Test 3 : Vérifier la DB
- Allez dans MongoDB Atlas
- Collections > tickets
- Vérifiez que le ticket de test est là

---

## 🚨 Dépannage

### Erreur "Cannot connect to MongoDB"
- Vérifiez la connection string
- Vérifiez que l'IP 0.0.0.0/0 est autorisée
- Vérifiez les credentials utilisateur

### Erreur CORS
- Vérifiez `CORS_ORIGINS` dans les variables Vercel
- Redéployez le backend

### Build échoue
- Vérifiez que `vercel.json` est dans `server/`
- Vérifiez les `engines` dans `package.json`

### Frontend ne charge pas
- Vérifiez `VITE_API_URL`
- Vérifiez que le backend répond

---

## 💰 Coûts

- **Vercel** : Gratuit (100GB bandwidth/mois)
- **MongoDB Atlas** : Gratuit (512MB)
- **Domaine** : ~10€/an (optionnel)

**Total pour commencer** : 0€ !

---

## 🎉 Félicitations !

Votre application ONE Life est maintenant en ligne ! 🎊

- **Frontend** : `https://onelife-client-xxxxx.vercel.app`
- **Backend** : `https://onelife-backend-xxxxx.vercel.app`
- **Base de données** : MongoDB Atlas

Les clients peuvent maintenant créer des tickets et vous pouvez gérer les événements depuis n'importe où !
