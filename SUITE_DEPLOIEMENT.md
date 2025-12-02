# 🎉 Suite du Déploiement - Frontend + Configuration Finale

## ✅ Étape 1 : Vérifier que le Backend fonctionne

### Test rapide

1. Va sur l'URL de ton service Render (ex: `https://onelife-api.onrender.com`)
2. Ajoute `/health` à la fin : `https://onelife-api.onrender.com/health`
3. Tu devrais voir : `{"ok":true}`

✅ **Si ça fonctionne** : Ton backend est opérationnel !

---

## 🎨 Étape 2 : Déployer le Frontend sur Vercel

### 2.1 Créer un compte Vercel

1. Va sur **https://vercel.com**
2. Clique sur **"Sign Up"** (ou "Get Started")
3. Connecte-toi avec ton compte **GitHub** (le plus simple)
4. Autorise Vercel à accéder à tes repositories

### 2.2 Créer un nouveau projet

1. Dans le dashboard Vercel, clique sur **"Add New..."** → **"Project"**
2. Si ton repo n'est pas visible, clique sur **"Import Git Repository"**
3. Sélectionne le repository **`y1e-56/site-web`**

### 2.3 Configurer le projet

Remplis les champs suivants :

| Champ | Valeur |
|-------|--------|
| **Framework Preset** | `Vite` (devrait être détecté automatiquement) |
| **Root Directory** | **`client`** ⚠️ **IMPORTANT** : C'est le dossier du frontend |
| **Build Command** | `npm run build` (devrait être détecté automatiquement) |
| **Output Directory** | `dist` (devrait être détecté automatiquement) |
| **Install Command** | `npm install` (devrait être détecté automatiquement) |

### 2.4 Configurer les variables d'environnement

**AVANT de cliquer sur "Deploy"**, clique sur **"Environment Variables"** et ajoute :

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://onelife-api.onrender.com/api` ⚠️ Remplace par ton URL Render réelle |

**Exemple :**
- Si ton backend Render est : `https://onelife-api.onrender.com`
- Alors `VITE_API_URL` = `https://onelife-api.onrender.com/api`

### 2.5 Déployer

1. Vérifie que toutes les configurations sont correctes
2. Clique sur **"Deploy"**
3. Vercel va automatiquement :
   - Installer les dépendances
   - Builder le projet (`npm run build`)
   - Déployer le site
4. Attends 1-2 minutes
5. Une fois terminé, tu obtiendras une URL (ex: `https://site-web.vercel.app`)

---

## 🔗 Étape 3 : Connecter le Frontend au Backend

### 3.1 Noter l'URL Vercel

Une fois le frontend déployé, note l'URL complète (ex: `https://site-web.vercel.app`)

### 3.2 Mettre à jour CORS dans Render

1. Retourne sur **https://dashboard.render.com**
2. Clique sur ton service backend (`onelife-api`)
3. Va dans **"Environment"** (menu de gauche)
4. Trouve la variable **`CORS_ORIGINS`**
5. Clique sur **"Edit"**
6. Remplace la valeur par l'URL de ton frontend Vercel :

**Exemple :**
```
https://site-web.vercel.app
```

**Si tu as plusieurs URLs** (ex: avec et sans www), sépare-les par des virgules :
```
https://site-web.vercel.app,https://www.site-web.vercel.app
```

7. Clique sur **"Save Changes"**
8. Render va automatiquement redéployer avec la nouvelle configuration CORS

---

## ✅ Étape 4 : Vérification finale

### 4.1 Tester l'application complète

1. **Ouvre l'URL de ton frontend Vercel** (ex: `https://site-web.vercel.app`)
2. **Teste la page publique** :
   - Essaie de créer un ticket
   - Vérifie que ça fonctionne
3. **Teste la connexion admin** :
   - Va sur `/login` (ex: `https://site-web.vercel.app/login`)
   - Connecte-toi avec :
     - Email : La valeur de `ADMIN_EMAIL` dans Render
     - Password : La valeur de `ADMIN_PASSWORD` dans Render
4. **Vérifie que les données sont sauvegardées** :
   - Va sur MongoDB Atlas
   - Clique sur **"Browse Collections"**
   - Tu devrais voir tes collections `tickets`, `admins`, etc.

### 4.2 URLs importantes

Note ces URLs quelque part :

- **Frontend** : `https://site-web.vercel.app` (ton URL Vercel)
- **Backend API** : `https://onelife-api.onrender.com` (ton URL Render)
- **Health Check** : `https://onelife-api.onrender.com/health`
- **Admin Login** : `https://site-web.vercel.app/login`

---

## 🐛 Dépannage

### Le frontend ne peut pas se connecter au backend

1. **Vérifie `VITE_API_URL` dans Vercel** :
   - Va dans Vercel → Ton projet → Settings → Environment Variables
   - Vérifie que `VITE_API_URL` est correcte
   - Elle doit être : `https://ton-backend-render.com/api` (avec `/api` à la fin)

2. **Vérifie CORS dans Render** :
   - Va dans Render → Environment
   - Vérifie que `CORS_ORIGINS` contient exactement l'URL de ton frontend Vercel
   - Pas d'espace, pas de slash à la fin

3. **Ouvre la console du navigateur** (F12) :
   - Regarde les erreurs dans l'onglet "Console"
   - Regarde les requêtes dans l'onglet "Network"
   - Cela t'aidera à identifier le problème

### Erreur CORS

Si tu vois une erreur CORS dans la console :

1. Vérifie que `CORS_ORIGINS` dans Render contient l'URL exacte de ton frontend
2. Vérifie qu'il n'y a pas d'espace ou de slash à la fin
3. Redéploie le backend après avoir modifié CORS

### Le backend ne répond pas

1. Vérifie que le service Render est actif (pas en "sleep")
2. Teste `/health` : `https://ton-backend.onrender.com/health`
3. Vérifie les logs dans Render

---

## 🎊 Félicitations !

Ton application est maintenant **entièrement déployée et accessible à distance** ! 

Les clients peuvent maintenant :
- ✅ Accéder à ton site depuis n'importe où
- ✅ Créer des tickets
- ✅ Recevoir leurs QR codes
- ✅ Les scanners peuvent scanner les QR codes

---

## 📝 Checklist finale

- [ ] Backend déployé sur Render et fonctionne (`/health` répond)
- [ ] Frontend déployé sur Vercel
- [ ] `VITE_API_URL` configuré dans Vercel avec l'URL du backend
- [ ] `CORS_ORIGINS` configuré dans Render avec l'URL du frontend
- [ ] Test de création de ticket depuis le frontend fonctionne
- [ ] Connexion admin fonctionne
- [ ] Les données sont sauvegardées dans MongoDB Atlas

---

**🚀 Ton application est prête pour la production !**

