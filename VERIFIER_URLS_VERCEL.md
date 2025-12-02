# 🔍 Comment Vérifier Toutes les URLs Vercel

## 📋 Étape 1 : Trouver Toutes les URLs Vercel

### Dans Vercel Dashboard

1. **Va sur https://vercel.com**
2. **Connecte-toi** à ton compte
3. **Clique sur ton projet** (`site-web` ou le nom que tu as donné)
4. **Va dans l'onglet "Deployments"** (Déploiements)

### URLs à Noter

Tu verras une liste de tous les déploiements. Pour chaque déploiement, note :

1. **URL de Production** (si configurée) :
   - Exemple : `https://site-web.vercel.app`
   - C'est l'URL principale de ton site

2. **URLs de Preview** :
   - Format : `https://site-web-XXXXX.vercel.app`
   - Ou : `https://site-XXXXX-y1e-56s-projects.vercel.app`
   - Chaque déploiement a sa propre URL

3. **URLs de Branch** :
   - Si tu as plusieurs branches, chaque branche peut avoir une URL différente

### Exemple de ce que tu pourrais voir :

```
Production:
https://site-web.vercel.app

Preview Deployments:
https://site-web-git-main-y1e-56s-projects.vercel.app
https://site-o6hm508zb-y1e-56s-projects.vercel.app
https://site-web-abc123.vercel.app
```

---

## 📝 Étape 2 : Lister Toutes les URLs

### Méthode 1 : Depuis Vercel Dashboard

1. Dans **Deployments**, clique sur chaque déploiement
2. **Note l'URL** affichée en haut de chaque page
3. **Fais une liste** de toutes les URLs trouvées

### Méthode 2 : Depuis les Domaines

1. Dans Vercel, va dans **Settings** → **Domains**
2. Tu verras tous les domaines configurés
3. Note-les tous

---

## ⚙️ Étape 3 : Configurer CORS dans Render

### Aller dans Render

1. **Va sur https://dashboard.render.com**
2. **Clique sur ton service backend** (`onelife-api` ou le nom que tu as donné)
3. **Clique sur "Environment"** dans le menu de gauche
4. **Trouve la variable `CORS_ORIGINS`**

### Option A : Ajouter Toutes les URLs (Recommandé pour Production)

**Format** : Séparer chaque URL par une virgule (sans espaces)

**Exemple** :
```
https://site-web.vercel.app,https://site-web-git-main-y1e-56s-projects.vercel.app,https://site-o6hm508zb-y1e-56s-projects.vercel.app
```

**Comment faire** :
1. Clique sur **"Edit"** à côté de `CORS_ORIGINS`
2. **Colle toutes les URLs** séparées par des virgules
3. **Pas d'espaces** entre les URLs
4. Clique sur **"Save"**

### Option B : Utiliser un Wildcard (Plus Simple mais Moins Sécurisé)

**Format** :
```
https://*.vercel.app
```

**Comment faire** :
1. Clique sur **"Edit"** à côté de `CORS_ORIGINS`
2. **Entre** : `https://*.vercel.app`
3. Clique sur **"Save"**

⚠️ **Note** : Le wildcard accepte TOUTES les URLs Vercel, ce qui est pratique mais moins sécurisé.

---

## ✅ Étape 4 : Vérifier que ça Fonctionne

### Test Rapide

1. **Ouvre ton frontend** sur une des URLs Vercel
2. **Ouvre la console** (F12)
3. **Essaie de te connecter**
4. **Regarde les erreurs** :
   - Si tu vois une erreur CORS → L'URL n'est pas dans la liste
   - Si pas d'erreur CORS → ✅ Ça fonctionne !

### Vérifier les Logs Render

1. **Va dans Render** → Ton service → **Logs**
2. **Demande à quelqu'un d'essayer de se connecter**
3. **Regarde les logs** :
   - Si tu vois `❌ CORS: Origin non autorisée: https://...` → L'URL n'est pas dans la liste
   - Si tu ne vois pas d'erreur CORS → ✅ Ça fonctionne !

---

## 🔍 Comment Trouver l'URL Exacte Utilisée

### Depuis le Navigateur

1. **Ouvre ton frontend** sur mobile ou ordinateur
2. **Ouvre la console** (F12)
3. **Va dans l'onglet "Network"** (Réseau)
4. **Essaie de te connecter**
5. **Regarde la requête** `login` ou `admin/login`
6. **Dans l'onglet "Headers"**, cherche **"Origin"**
7. **C'est cette URL** qu'il faut ajouter dans CORS !

### Exemple de ce que tu verras :

```
Request URL: https://ton-backend.onrender.com/api/admin/login
Origin: https://site-o6hm508zb-y1e-56s-projects.vercel.app
```

→ L'URL à ajouter est : `https://site-o6hm508zb-y1e-56s-projects.vercel.app`

---

## 📋 Checklist Complète

- [ ] J'ai listé toutes les URLs Vercel depuis le dashboard
- [ ] J'ai noté l'URL de production
- [ ] J'ai noté toutes les URLs de preview
- [ ] J'ai ajouté toutes les URLs dans `CORS_ORIGINS` dans Render (séparées par des virgules)
- [ ] J'ai sauvegardé dans Render
- [ ] J'ai testé la connexion depuis différentes URLs
- [ ] J'ai vérifié les logs Render pour voir s'il y a des erreurs CORS

---

## 💡 Astuce : Utiliser le Wildcard

**Pour éviter de devoir ajouter chaque URL** :

Dans Render, mets simplement :
```
https://*.vercel.app
```

Cela acceptera **toutes** les URLs Vercel automatiquement.

⚠️ **Sécurité** : Pour la production, il vaut mieux lister les URLs exactes. Mais pour le développement, le wildcard est très pratique.

---

## 🎯 Résumé Rapide

1. **Vercel** → Deployments → Note toutes les URLs
2. **Render** → Environment → `CORS_ORIGINS` → Ajoute toutes les URLs (ou `https://*.vercel.app`)
3. **Sauvegarde** et teste !

---

**🚀 Une fois fait, tous les admins pourront se connecter depuis n'importe quelle URL Vercel !**


