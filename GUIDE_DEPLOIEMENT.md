# 🚀 Guide de Déploiement - OneLife

Ce guide vous explique comment héberger votre application OneLife avec MongoDB Atlas et Render.

## 📋 Prérequis

1. Un compte GitHub (gratuit)
2. Un compte MongoDB Atlas (gratuit) : https://www.mongodb.com/cloud/atlas
3. Un compte Render (gratuit) : https://render.com
4. Un compte Vercel (gratuit) : https://vercel.com (pour le frontend)

---

## 🗄️ Étape 1 : Configuration MongoDB Atlas

### 1.1 Créer un compte MongoDB Atlas

1. Allez sur https://www.mongodb.com/cloud/atlas/register
2. Créez un compte gratuit
3. Choisissez "Build a Database" → **M0 Free** (gratuit, suffisant pour commencer)

### 1.2 Créer un cluster

1. Choisissez un **provider** (AWS, Google Cloud, Azure)
2. Sélectionnez une **région** proche de vos utilisateurs (ex: Europe - Paris)
3. Cliquez sur **"Create"** (cela prend 3-5 minutes)

### 1.3 Configurer l'accès réseau

1. Dans le menu de gauche, cliquez sur **"Network Access"**
2. Cliquez sur **"Add IP Address"**
3. Cliquez sur **"Allow Access from Anywhere"** (0.0.0.0/0) pour commencer
   - ⚠️ **Note de sécurité** : Pour la production, limitez aux IPs de Render plus tard
4. Cliquez sur **"Confirm"**

### 1.4 Créer un utilisateur de base de données

1. Dans le menu de gauche, cliquez sur **"Database Access"**
2. Cliquez sur **"Add New Database User"**
3. Choisissez **"Password"** comme méthode d'authentification
4. Entrez un **username** (ex: `onelife_user`)
5. Générez un **mot de passe fort** (cliquez sur "Autogenerate Secure Password" ou créez-en un)
   - ⚠️ **IMPORTANT** : Sauvegardez ce mot de passe, vous en aurez besoin !
6. Pour les **User Privileges**, choisissez **"Atlas Admin"** (ou "Read and write to any database")
7. Cliquez sur **"Add User"**

### 1.5 Obtenir l'URI de connexion

1. Dans le menu de gauche, cliquez sur **"Database"**
2. Cliquez sur **"Connect"** sur votre cluster
3. Choisissez **"Connect your application"**
4. Sélectionnez **"Node.js"** et la version **"5.5 or later"**
5. Copiez l'URI qui ressemble à :
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   
   **Exemple avec votre cluster :**
   ```
   mongodb+srv://jipnangryan237_db_user:<db_password>@onelifecluster.7oot0wy.mongodb.net/?appName=ONElifecluster
   ```

6. **Remplacez** `<db_password>` par le **vrai mot de passe** que vous avez créé pour l'utilisateur `jipnangryan237_db_user`
   
   ⚠️ **Important** : Si votre mot de passe contient des caractères spéciaux (comme `@`, `#`, `%`, etc.), vous devez les encoder en URL :
   - `@` devient `%40`
   - `#` devient `%23`
   - `%` devient `%25`
   - etc.

7. **Ajoutez** le nom de la base de données `/onelife` avant le `?` et gardez les paramètres de connexion
   
   **Format final attendu :**
   ```
   mongodb+srv://jipnangryan237_db_user:VOTRE_MOT_DE_PASSE@onelifecluster.7oot0wy.mongodb.net/onelife?retryWrites=true&w=majority
   ```
   
   **Exemple avec un mot de passe simple :**
   ```
   mongodb+srv://jipnangryan237_db_user:MonMotDePasse123@onelifecluster.7oot0wy.mongodb.net/onelife?retryWrites=true&w=majority
   ```
   
   **Exemple avec un mot de passe contenant @ :**
   ```
   mongodb+srv://jipnangryan237_db_user:MotDePasse%40123@onelifecluster.7oot0wy.mongodb.net/onelife?retryWrites=true&w=majority
   ```

8. ⚠️ **Sauvegardez cette URI complète**, vous en aurez besoin pour Render !

---

## 🖥️ Étape 2 : Déployer le Backend sur Render

### 2.1 Préparer le repository GitHub

1. Assurez-vous que votre code est sur GitHub
2. Si ce n'est pas le cas :
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/VOTRE-USERNAME/site-web.git
   git push -u origin main
   ```

### 2.2 Créer un compte Render

1. Allez sur https://render.com
2. Cliquez sur **"Get Started for Free"**
3. Connectez-vous avec votre compte GitHub

### 2.3 Créer un nouveau Web Service

1. Dans le dashboard Render, cliquez sur **"New +"** → **"Web Service"**
2. Connectez votre repository GitHub si ce n'est pas déjà fait
3. Sélectionnez votre repository `site-web`
4. Configurez le service :
   - **Name** : `onelife-api` (ou un nom de votre choix)
   - **Region** : Choisissez une région proche (ex: Frankfurt)
   - **Branch** : `main` (ou votre branche principale)
   - **Root Directory** : `server` ⚠️ **IMPORTANT** : C'est le dossier du backend
   - **Runtime** : `Node`
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Plan** : **Free** (suffisant pour commencer)

### 2.4 Configurer les variables d'environnement

Dans la section **"Environment Variables"**, ajoutez :

| Clé | Valeur | Description |
|-----|--------|-------------|
| `NODE_ENV` | `production` | Environnement de production |
| `MONGODB_URI` | `mongodb+srv://...` | L'URI MongoDB Atlas que vous avez copiée |
| `JWT_SECRET` | `[générez une chaîne aléatoire]` | Secret pour signer les tokens JWT |
| `ADMIN_EMAIL` | `admin@onelife.com` | Email de l'admin par défaut |
| `ADMIN_PASSWORD` | `[choisissez un mot de passe fort]` | Mot de passe de l'admin |
| `CORS_ORIGINS` | `https://votre-site.vercel.app` | URL de votre frontend (on l'ajoutera après) |

**Pour générer un JWT_SECRET fort :**
- Sur Windows : `powershell -Command "[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))"`
- Sur Mac/Linux : `openssl rand -base64 32`

### 2.5 Déployer

1. Cliquez sur **"Create Web Service"**
2. Render va automatiquement :
   - Cloner votre code
   - Installer les dépendances (`npm install`)
   - Démarrer le serveur (`npm start`)
3. Attendez 2-3 minutes que le déploiement se termine
4. Une fois terminé, vous verrez l'URL de votre API (ex: `https://onelife-api.onrender.com`)

### 2.6 Vérifier que ça fonctionne

1. Ouvrez l'URL de votre API dans le navigateur
2. Ajoutez `/health` à la fin : `https://onelife-api.onrender.com/health`
3. Vous devriez voir : `{"ok":true}`
4. Si vous voyez une erreur, vérifiez les logs dans Render (onglet "Logs")

---

## 🎨 Étape 3 : Déployer le Frontend sur Vercel

### 3.1 Créer un compte Vercel

1. Allez sur https://vercel.com
2. Cliquez sur **"Sign Up"**
3. Connectez-vous avec votre compte GitHub

### 3.2 Créer un nouveau projet

1. Cliquez sur **"Add New..."** → **"Project"**
2. Importez votre repository GitHub `site-web`
3. Configurez le projet :
   - **Framework Preset** : `Vite`
   - **Root Directory** : `client` ⚠️ **IMPORTANT** : C'est le dossier du frontend
   - **Build Command** : `npm run build` (devrait être détecté automatiquement)
   - **Output Directory** : `dist` (devrait être détecté automatiquement)
   - **Install Command** : `npm install` (devrait être détecté automatiquement)

### 3.3 Configurer les variables d'environnement

Dans **"Environment Variables"**, ajoutez :

| Clé | Valeur | Description |
|-----|--------|-------------|
| `VITE_API_URL` | `https://onelife-api.onrender.com/api` | URL de votre API backend (remplacez par votre URL Render) |

### 3.4 Déployer

1. Cliquez sur **"Deploy"**
2. Vercel va automatiquement :
   - Installer les dépendances
   - Builder le projet
   - Déployer le site
3. Une fois terminé, vous obtiendrez une URL (ex: `https://site-web.vercel.app`)

### 3.5 Mettre à jour CORS dans Render

1. Retournez sur Render
2. Allez dans les **"Environment Variables"** de votre service backend
3. Modifiez `CORS_ORIGINS` pour inclure l'URL Vercel :
   ```
   https://site-web.vercel.app
   ```
   (Si vous avez plusieurs URLs, séparez-les par des virgules)
4. Render redéploiera automatiquement avec la nouvelle configuration

---

## ✅ Étape 4 : Vérification finale

### 4.1 Tester l'application

1. Ouvrez l'URL de votre frontend Vercel
2. Essayez de créer un ticket depuis la page publique
3. Connectez-vous en tant qu'admin avec les identifiants que vous avez configurés
4. Vérifiez que les données sont bien sauvegardées dans MongoDB Atlas :
   - Allez sur MongoDB Atlas
   - Cliquez sur **"Browse Collections"**
   - Vous devriez voir vos collections `tickets`, `admins`, etc.

### 4.2 URLs importantes

- **Frontend** : `https://votre-site.vercel.app`
- **Backend API** : `https://onelife-api.onrender.com`
- **Health Check** : `https://onelife-api.onrender.com/health`
- **Admin Login** : `https://votre-site.vercel.app/login`

---

## 🔒 Sécurité (Important !)

### Limiter l'accès MongoDB Atlas

1. Dans MongoDB Atlas, allez dans **"Network Access"**
2. Supprimez l'entrée `0.0.0.0/0`
3. Ajoutez l'IP de Render :
   - Render utilise des IPs dynamiques, mais vous pouvez utiliser leur plage d'IPs
   - Ou gardez `0.0.0.0/0` pour le développement (⚠️ moins sécurisé)

### Changer le mot de passe admin par défaut

1. Connectez-vous à votre application
2. Allez dans les paramètres admin
3. Changez le mot de passe par défaut

---

## 🐛 Dépannage

### Le backend ne démarre pas

- Vérifiez les logs dans Render (onglet "Logs")
- Vérifiez que `MONGODB_URI` est correcte
- Vérifiez que toutes les variables d'environnement sont définies

### Erreur CORS

- Vérifiez que `CORS_ORIGINS` dans Render contient l'URL exacte de votre frontend
- Vérifiez qu'il n'y a pas d'espace ou de slash à la fin

### Le frontend ne peut pas se connecter au backend

- Vérifiez que `VITE_API_URL` dans Vercel est correcte
- Vérifiez que le backend est bien démarré (testez `/health`)
- Ouvrez la console du navigateur (F12) pour voir les erreurs

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans Render et Vercel
2. Vérifiez la console du navigateur (F12)
3. Vérifiez que toutes les variables d'environnement sont correctes

---

**🎉 Félicitations ! Votre application est maintenant en ligne et accessible à distance !**

