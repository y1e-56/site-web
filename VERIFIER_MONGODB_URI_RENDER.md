# 🔍 Vérifier MONGODB_URI dans Render - Guide Pas à Pas

## ⚠️ Erreur actuelle
```
Mongo connection error: Invalid scheme, expected connection string to start with "mongodb://" or "mongodb+srv://"
```

## 📋 Checklist de vérification

### Étape 1 : Accéder aux variables d'environnement

1. Va sur **https://dashboard.render.com**
2. Connecte-toi à ton compte
3. Clique sur ton service (probablement `onelife-api` ou le nom que tu as donné)
4. Dans le menu de gauche, clique sur **"Environment"** (ou "Environment Variables")

### Étape 2 : Vérifier si MONGODB_URI existe

Tu devrais voir une liste de variables. Cherche `MONGODB_URI` dans la liste.

**Si MONGODB_URI n'existe PAS :**
- Clique sur **"Add Environment Variable"** (bouton bleu)
- Continue à l'étape 3

**Si MONGODB_URI existe :**
- Clique sur le bouton **"Edit"** (icône crayon) à côté de `MONGODB_URI`
- Vérifie la valeur actuelle
- Continue à l'étape 3

### Étape 3 : Configurer la variable

**Key (Clé) :**
```
MONGODB_URI
```
⚠️ **Important** : Pas d'espaces avant/après, exactement comme écrit ci-dessus.

**Value (Valeur) :**
Colle cette URI complète (remplace `TON_MOT_DE_PASSE` par ton vrai mot de passe) :

```
mongodb+srv://jipnangryan237_db_user:TON_MOT_DE_PASSE@onelifecluster.7oot0wy.mongodb.net/onelife?retryWrites=true&w=majority
```

### Étape 4 : Vérifications importantes

✅ **L'URI doit :**
- Commencer par `mongodb+srv://` (pas `mongodb://`, pas d'espaces avant)
- Contenir le nom d'utilisateur : `jipnangryan237_db_user`
- Contenir le mot de passe (remplacé par ton vrai mot de passe)
- Contenir `/onelife` avant le `?`
- Ne pas avoir d'espaces au début ou à la fin
- Ne pas être entre guillemets (`"` ou `'`)

❌ **Erreurs courantes :**
- Espace avant `mongodb+srv://` → ❌
- Guillemets autour de l'URI → ❌
- Mot de passe non remplacé (`TON_MOT_DE_PASSE` encore présent) → ❌
- Oubli du `/onelife` → ❌
- Ligne vide ou valeur vide → ❌

### Étape 5 : Exemple d'URI correcte

**Si ton mot de passe est `MyPassword123` :**
```
mongodb+srv://jipnangryan237_db_user:MyPassword123@onelifecluster.7oot0wy.mongodb.net/onelife?retryWrites=true&w=majority
```

**Si ton mot de passe est `Pass@123` (avec @) :**
```
mongodb+srv://jipnangryan237_db_user:Pass%40123@onelifecluster.7oot0wy.mongodb.net/onelife?retryWrites=true&w=majority
```
(Le `@` devient `%40`)

### Étape 6 : Sauvegarder

1. Clique sur **"Save Changes"** (ou "Update" ou "Save")
2. Render va automatiquement redéployer
3. Attends 2-3 minutes
4. Vérifie les **Logs** (onglet "Logs")

### Étape 7 : Vérifier dans les logs

Dans l'onglet **"Logs"**, tu devrais voir :

✅ **Succès :**
```
🗄️  MongoDB connected
```

❌ **Si tu vois encore une erreur :**
- Copie le message d'erreur exact
- Vérifie que l'URI est bien collée sans espaces
- Vérifie que le mot de passe est correct

## 🔑 Comment obtenir/réinitialiser le mot de passe MongoDB

Si tu n'as pas le mot de passe de `jipnangryan237_db_user` :

1. Va sur **https://cloud.mongodb.com**
2. Connecte-toi
3. Menu de gauche → **"Database Access"**
4. Trouve l'utilisateur `jipnangryan237_db_user`
5. Clique sur **"Edit"** (icône crayon)
6. Clique sur **"Edit Password"**
7. Clique sur **"Autogenerate Secure Password"** OU crée ton propre mot de passe
8. **⚠️ COPIE LE MOT DE PASSE** immédiatement (il ne sera plus visible après)
9. Clique sur **"Update User"**
10. Utilise ce nouveau mot de passe dans l'URI Render

## 🧪 Test rapide

Pour tester si ton URI est correcte, tu peux :

1. Créer un fichier `.env` dans le dossier `server` (localement)
2. Ajouter : `MONGODB_URI=ton_uri_complete`
3. Lancer : `npm start`
4. Si ça fonctionne localement, l'URI est correcte

## 📸 Capture d'écran de référence

Dans Render, la section Environment devrait ressembler à ça :

```
Environment Variables
┌─────────────────────────────────────────────────────────┐
│ Key              │ Value                                │
├──────────────────┼──────────────────────────────────────┤
│ NODE_ENV         │ production                           │
│ MONGODB_URI      │ mongodb+srv://jipnangryan237_db_... │
│ JWT_SECRET       │ [valeur]                             │
│ ADMIN_EMAIL      │ admin@onelife.com                    │
│ ADMIN_PASSWORD   │ [valeur]                             │
│ CORS_ORIGINS     │ *                                    │
└──────────────────┴──────────────────────────────────────┘
```

## 🆘 Si ça ne fonctionne toujours pas

1. **Vérifie l'accès réseau MongoDB Atlas** :
   - Va sur MongoDB Atlas
   - Menu "Network Access"
   - Vérifie que `0.0.0.0/0` est autorisé (ou les IPs de Render)

2. **Vérifie que l'utilisateur existe** :
   - MongoDB Atlas → "Database Access"
   - Vérifie que `jipnangryan237_db_user` existe

3. **Teste avec une nouvelle URI** :
   - MongoDB Atlas → "Database" → "Connect" → "Connect your application"
   - Copie la nouvelle URI
   - Remplace le mot de passe
   - Utilise-la dans Render

---

**💡 Astuce** : Copie-colle directement depuis MongoDB Atlas et remplace seulement le mot de passe dans Render.

