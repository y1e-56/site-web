# 🚀 Déploiement Rapide sur Render

## ✅ Étape 1 : Votre code est sur GitHub
- Repository : `https://github.com/y1e-56/site-web.git`
- Branche : `main`

## 📋 Étape 2 : Créer un compte Render

1. Allez sur **https://render.com**
2. Cliquez sur **"Get Started for Free"**
3. Connectez-vous avec votre compte **GitHub** (c'est le plus simple)
4. Autorisez Render à accéder à vos repositories GitHub

## 🖥️ Étape 3 : Créer le Web Service

1. Dans le dashboard Render, cliquez sur **"New +"** (en haut à droite)
2. Sélectionnez **"Web Service"**
3. Si votre repo n'est pas connecté :
   - Cliquez sur **"Connect account"** ou **"Configure GitHub"**
   - Autorisez Render à accéder à vos repos
4. Sélectionnez le repository **`y1e-56/site-web`**

## ⚙️ Étape 4 : Configuration du Service

Remplissez les champs suivants :

| Champ | Valeur |
|-------|--------|
| **Name** | `onelife-api` (ou un nom de votre choix) |
| **Region** | Choisissez une région proche (ex: **Frankfurt** pour l'Europe) |
| **Branch** | `main` |
| **Root Directory** | **`server`** ⚠️ **IMPORTANT** : C'est le dossier du backend |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | **Free** (suffisant pour commencer) |

## 🔐 Étape 5 : Variables d'environnement

Dans la section **"Environment Variables"**, cliquez sur **"Add Environment Variable"** et ajoutez :

### Variables obligatoires :
 Key : `NODE_ENV`
   - Value : `production`
1. **NODE_ENV**
   -

2. **MONGODB_URI**
   - Key : `MONGODB_URI`
   - Value : `mongodb+srv://jipnangryan237_db_user:VOTRE_MOT_DE_PASSE@onelifecluster.7oot0wy.mongodb.net/onelife?retryWrites=true&w=majority`
   - ⚠️ Remplacez `VOTRE_MOT_DE_PASSE` par le vrai mot de passe MongoDB

3. **JWT_SECRET**
   - Key : `JWT_SECRET`
   - Value : Générez une chaîne aléatoire (voir ci-dessous)

4. **ADMIN_EMAIL**
   - Key : `ADMIN_EMAIL`
   - Value : `admin@onelife.com` (ou votre email)

5. **ADMIN_PASSWORD**
   - Key : `ADMIN_PASSWORD`
   - Value : Choisissez un mot de passe fort pour l'admin

6. **CORS_ORIGINS**
   - Key : `CORS_ORIGINS`
   - Value : `https://votre-site.vercel.app` (on l'ajoutera après le déploiement du frontend)
   - Pour l'instant, mettez : `*` (autorise tout, on changera après)

### Comment générer JWT_SECRET

**Windows (PowerShell) :**
```powershell
powershell -Command "[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))"
```

**Ou utilisez un générateur en ligne :** https://randomkeygen.com/

## 🚀 Étape 6 : Déployer

1. Vérifiez que toutes les variables sont ajoutées
2. Cliquez sur **"Create Web Service"** (en bas)
3. Render va automatiquement :
   - Cloner votre code
   - Installer les dépendances (`npm install`)
   - Démarrer le serveur (`npm start`)
4. Attendez 2-3 minutes que le déploiement se termine
5. Vous verrez l'URL de votre API (ex: `https://onelife-api.onrender.com`)

## ✅ Étape 7 : Vérifier que ça fonctionne

1. Une fois le déploiement terminé, ouvrez l'URL de votre service
2. Ajoutez `/health` à la fin : `https://onelife-api.onrender.com/health`
3. Vous devriez voir : `{"ok":true}`
4. Si vous voyez une erreur, vérifiez les **Logs** dans Render (onglet "Logs")

## 🔍 Dépannage

### Le déploiement échoue

1. Vérifiez les **Logs** dans Render
2. Vérifiez que :
   - `MONGODB_URI` est correcte (avec le bon mot de passe)
   - Toutes les variables sont définies
   - Le Root Directory est bien `server`

### Erreur de connexion MongoDB

1. Vérifiez que l'URI MongoDB est correcte
2. Vérifiez que l'accès réseau est autorisé dans MongoDB Atlas (0.0.0.0/0)
3. Vérifiez que le nom d'utilisateur et le mot de passe sont corrects

### Le service ne démarre pas

1. Vérifiez les logs
2. Vérifiez que `npm start` fonctionne localement
3. Vérifiez que le port est bien configuré (Render le définit automatiquement)

## 📝 Prochaines étapes

Une fois le backend déployé :
1. Notez l'URL de votre API Render (ex: `https://onelife-api.onrender.com`)
2. Déployez le frontend sur Vercel (voir `GUIDE_DEPLOIEMENT.md`)
3. Mettez à jour `CORS_ORIGINS` dans Render avec l'URL Vercel

---

**🎉 Votre backend sera accessible à distance une fois déployé !**

