# 🔧 Corriger l'URL du Backend dans Vercel

## ❌ Problème Identifié

L'erreur montre que le frontend essaie de se connecter à :
```
POST https://site-web-rhjc.onrender.com/admin/login 404 (Not Found)
```

**Problème** : `site-web-rhjc.onrender.com` semble être l'URL de ton **frontend Vercel**, pas ton backend Render !

## ✅ Solution : Configurer VITE_API_URL dans Vercel

### Étape 1 : Trouver l'URL de ton Backend Render

1. Va sur **https://dashboard.render.com**
2. Clique sur ton service backend (probablement `onelife-api` ou un nom similaire)
3. **Note l'URL** affichée en haut (ex: `https://onelife-api.onrender.com`)

⚠️ **Important** : C'est l'URL de ton **backend**, pas celle de ton frontend !

### Étape 2 : Configurer VITE_API_URL dans Vercel

1. Va sur **https://vercel.com**
2. Clique sur ton projet frontend (`site-web` ou le nom que tu as donné)
3. Va dans **"Settings"** (Paramètres)
4. Clique sur **"Environment Variables"** dans le menu de gauche
5. Cherche la variable `VITE_API_URL`

**Si elle existe :**
- Clique sur **"Edit"**
- Change la valeur pour : `https://TON-BACKEND-RENDER.onrender.com/api`
  - Remplace `TON-BACKEND-RENDER` par le vrai nom de ton service Render
  - **Important** : Ajoute `/api` à la fin !
- Clique sur **"Save"**

**Si elle n'existe pas :**
- Clique sur **"Add New"**
- **Key** : `VITE_API_URL`
- **Value** : `https://TON-BACKEND-RENDER.onrender.com/api`
  - Remplace `TON-BACKEND-RENDER` par le vrai nom de ton service Render
  - **Important** : Ajoute `/api` à la fin !
- Clique sur **"Save"**

### Étape 3 : Format de l'URL

**Format correct :**
```
https://onelife-api.onrender.com/api
```

**Structure :**
- `https://` : Protocole
- `onelife-api.onrender.com` : Nom de ton service Render
- `/api` : Préfixe de toutes les routes API

**Exemples :**
- ✅ `https://onelife-api.onrender.com/api`
- ✅ `https://my-backend.onrender.com/api`
- ❌ `https://site-web-rhjc.onrender.com/api` (c'est ton frontend, pas ton backend !)
- ❌ `https://onelife-api.onrender.com` (manque `/api`)

### Étape 4 : Redéployer le Frontend

Après avoir modifié `VITE_API_URL` :

1. Dans Vercel, va dans l'onglet **"Deployments"**
2. Clique sur les **"..."** (trois points) du dernier déploiement
3. Clique sur **"Redeploy"**
4. OU simplement fais un nouveau commit et push sur GitHub (Vercel redéploiera automatiquement)

### Étape 5 : Vérifier

1. Attends que le redéploiement soit terminé
2. Ouvre ton frontend
3. Essaie de te connecter
4. Ouvre la **console du navigateur** (F12)
5. Vérifie que les requêtes vont maintenant vers la bonne URL :
   - ✅ `https://onelife-api.onrender.com/api/admin/login`
   - ❌ Plus `https://site-web-rhjc.onrender.com/admin/login`

---

## 🔍 Comment Vérifier l'URL Actuelle

### Dans le Code

Le frontend utilise `VITE_API_URL` dans `client/src/lib/api.js` :

```javascript
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

Si `VITE_API_URL` n'est pas défini, il utilise `http://localhost:5000/api` par défaut.

### Dans la Console du Navigateur

1. Ouvre ton frontend
2. Appuie sur **F12** pour ouvrir les outils développeur
3. Va dans l'onglet **"Network"** (Réseau)
4. Essaie de te connecter
5. Regarde la requête `login` ou `admin/login`
6. Vérifie l'URL complète dans l'onglet "Headers"

---

## 📋 Checklist Complète

- [ ] J'ai trouvé l'URL de mon backend Render (ex: `https://onelife-api.onrender.com`)
- [ ] J'ai ajouté/modifié `VITE_API_URL` dans Vercel
- [ ] La valeur est : `https://MON-BACKEND.onrender.com/api` (avec `/api` à la fin)
- [ ] J'ai redéployé le frontend sur Vercel
- [ ] J'ai vérifié dans la console du navigateur que les requêtes vont vers la bonne URL

---

## 🐛 Si ça ne fonctionne toujours pas

### Vérifier que le Backend Fonctionne

1. Ouvre l'URL de ton backend Render directement dans le navigateur
2. Ajoute `/health` à la fin : `https://ton-backend.onrender.com/health`
3. Tu devrais voir : `{"ok":true}`

Si ça ne fonctionne pas, le problème vient du backend, pas du frontend.

### Vérifier CORS

1. Va dans Render → Ton service backend → Environment
2. Vérifie que `CORS_ORIGINS` contient l'URL de ton frontend Vercel
3. Exemple : `https://site-web-rhjc.onrender.com` (sans `/api`)

### Vérifier les Logs

1. Dans Vercel, va dans l'onglet **"Logs"** de ton déploiement
2. Cherche des erreurs liées à `VITE_API_URL`
3. Dans Render, vérifie les logs du backend pour voir si les requêtes arrivent

---

## 💡 Exemple Complet

**Backend Render :**
- URL : `https://onelife-api.onrender.com`
- Health check : `https://onelife-api.onrender.com/health` ✅

**Frontend Vercel :**
- URL : `https://site-web-rhjc.onrender.com`
- Variable `VITE_API_URL` : `https://onelife-api.onrender.com/api`

**Résultat :**
- Le frontend fait des requêtes vers : `https://onelife-api.onrender.com/api/admin/login` ✅

---

**🚀 Une fois corrigé, ton frontend devrait pouvoir se connecter au backend !**

