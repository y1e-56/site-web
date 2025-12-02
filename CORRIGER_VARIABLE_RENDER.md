# 🔧 Corriger la Variable d'Environnement dans Render

## ❌ Problème Identifié

Tu as créé une variable `PASSWORD = ryanryan237` dans Render, mais le système cherche `ADMIN_PASSWORD`.

## ✅ Solution : Corriger le Nom de la Variable

### Étape 1 : Aller dans Render

1. Va sur **https://dashboard.render.com**
2. Clique sur ton service backend (`onelife-api` ou le nom que tu as donné)
3. Dans le menu de gauche, clique sur **"Environment"**

### Étape 2 : Vérifier les Variables

Tu devrais voir une liste de variables. Cherche :

- ❌ `PASSWORD` (si elle existe, c'est la mauvaise)
- ✅ `ADMIN_PASSWORD` (c'est celle qu'il faut)

### Étape 3 : Corriger

**Si `PASSWORD` existe :**
1. Clique sur **"Edit"** (icône crayon) à côté de `PASSWORD`
2. **Change le nom** de `PASSWORD` en `ADMIN_PASSWORD`
3. **Garde la valeur** : `ryanryan237`
4. Clique sur **"Save"**

**OU si `PASSWORD` n'existe pas :**
1. Clique sur **"Add Environment Variable"**
2. **Key** : `ADMIN_PASSWORD` (exactement comme ça, en majuscules)
3. **Value** : `ryanryan237` (sans espaces)
4. Clique sur **"Save"**

### Étape 4 : Vérifier Toutes les Variables Requises

Assure-toi d'avoir ces variables dans Render :

| Variable | Valeur | Exemple |
|----------|--------|---------|
| `NODE_ENV` | `production` | `production` |
| `MONGODB_URI` | Ton URI MongoDB | `mongodb+srv://...` |
| `JWT_SECRET` | Une chaîne aléatoire | `abc123...` |
| `ADMIN_EMAIL` | L'email de l'admin | `admin@onelife.com` |
| `ADMIN_PASSWORD` | Le mot de passe | `ryanryan237` |
| `CORS_ORIGINS` | URL du frontend | `https://ton-site.vercel.app` |

⚠️ **Important** :
- Le nom doit être **exactement** `ADMIN_PASSWORD` (en majuscules)
- Pas d'espaces avant ou après le `=`
- La valeur doit être `ryanryan237` (sans guillemets, sans espaces)

### Étape 5 : Redémarrer le Service

1. Après avoir modifié les variables, Render redéploie automatiquement
2. Attends 2-3 minutes
3. Vérifie les **Logs** pour voir si tout fonctionne

### Étape 6 : Supprimer l'Admin dans MongoDB

Maintenant que la variable est correcte, il faut mettre à jour l'admin dans MongoDB :

1. Va sur **https://cloud.mongodb.com**
2. **Database** → **Browse Collections**
3. Collection **`admins`**
4. Trouve l'admin avec l'email de `ADMIN_EMAIL`
5. **Supprime** cet admin (bouton Delete)
6. Le système va le recréer avec le nouveau mot de passe au prochain démarrage

### Étape 7 : Tester la Connexion

1. Ouvre ton frontend
2. Va sur `/login`
3. Connecte-toi avec :
   - **Email** : La valeur de `ADMIN_EMAIL` dans Render
   - **Password** : `ryanryan237`

---

## 🔍 Vérification Rapide

Pour vérifier que tout est correct dans Render :

1. Va dans **Environment**
2. Tu devrais voir `ADMIN_PASSWORD` (pas `PASSWORD`)
3. La valeur doit être `ryanryan237` (sans espaces)
4. Tu devrais aussi voir `ADMIN_EMAIL` avec un email

---

## 📝 Exemple de Configuration Correcte dans Render

```
NODE_ENV = production
MONGODB_URI = mongodb+srv://...
JWT_SECRET = abc123def456...
ADMIN_EMAIL = admin@onelife.com
ADMIN_PASSWORD = ryanryan237
CORS_ORIGINS = https://ton-site.vercel.app
```

⚠️ **Note** : Dans Render, tu n'as pas besoin d'espaces autour du `=`, mais si tu en mets, ça fonctionne quand même. L'important c'est le **nom de la variable** : `ADMIN_PASSWORD`.

---

## 🐛 Si ça ne fonctionne toujours pas

1. **Vérifie les logs Render** :
   - Va dans l'onglet "Logs"
   - Cherche des erreurs
   - Vérifie que le service démarre correctement

2. **Vérifie que l'admin est bien supprimé dans MongoDB** :
   - Si l'admin existe toujours avec l'ancien mot de passe, supprime-le
   - Redémarre le service Render

3. **Vérifie l'email** :
   - Assure-toi d'utiliser exactement l'email de `ADMIN_EMAIL` dans Render
   - Pas d'espaces, pas de majuscules/minuscules différentes

4. **Teste avec le script local** (si tu as accès) :
   ```bash
   cd server
   # Crée un .env avec ADMIN_PASSWORD=ryanryan237
   npm run update-admin-password
   ```

---

**💡 Astuce** : Après avoir corrigé `ADMIN_PASSWORD` dans Render et supprimé l'admin dans MongoDB, le système va automatiquement recréer l'admin avec le bon mot de passe au prochain démarrage.

