# 👥 Comment Voir Tous les Utilisateurs Admin

## Méthode 1 : Via l'Interface Admin (Le Plus Simple) ✅

### Si tu es déjà connecté en admin :

1. **Ouvre ton application** (frontend déployé ou local)
2. **Connecte-toi** avec tes identifiants admin
3. Va sur le **Dashboard Admin** (`/admin`)
4. Clique sur l'onglet **"👥 Administrateurs"**
5. Tu verras la **liste complète** de tous les admins avec :
   - Email
   - Nom d'affichage
   - Rôle (admin ou scanner)
   - Date de création

### Si tu n'es pas encore connecté :

1. Va sur la page de login : `/login`
2. Connecte-toi avec :
   - **Email** : La valeur de `ADMIN_EMAIL` dans Render
   - **Password** : La valeur de `ADMIN_PASSWORD` dans Render

---

## Méthode 2 : Via l'API (Pour les Développeurs)

### Option A : Utiliser l'API directement

1. **Connecte-toi d'abord** pour obtenir un token :
   ```bash
   POST https://ton-backend.onrender.com/api/admin/login
   {
     "email": "ton-email@admin.com",
     "password": "ton-mot-de-passe"
   }
   ```
   
   Tu obtiendras un token dans la réponse.

2. **Liste les admins** avec le token :
   ```bash
   GET https://ton-backend.onrender.com/api/admin/admins
   Headers: {
     "Authorization": "Bearer TON_TOKEN"
   }
   ```

### Option B : Utiliser curl ou Postman

**Exemple avec curl :**
```bash
# 1. Se connecter
curl -X POST https://ton-backend.onrender.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ton-email@admin.com","password":"ton-mot-de-passe"}'

# 2. Utiliser le token pour lister les admins
curl -X GET https://ton-backend.onrender.com/api/admin/admins \
  -H "Authorization: Bearer TON_TOKEN"
```

---

## Méthode 3 : Directement dans MongoDB Atlas 🔍

### Via l'Interface MongoDB Atlas

1. **Va sur MongoDB Atlas** : https://cloud.mongodb.com
2. **Connecte-toi** à ton compte
3. Clique sur **"Database"** dans le menu de gauche
4. Clique sur **"Browse Collections"**
5. Sélectionne ta base de données (probablement `onelife`)
6. Clique sur la collection **`admins`**
7. Tu verras **tous les documents** (admins) avec :
   - `_id` : Identifiant unique
   - `email` : Email de l'admin
   - `displayName` : Nom d'affichage
   - `role` : Rôle (admin ou scanner)
   - `createdAt` : Date de création
   - `updatedAt` : Date de modification
   - `passwordHash` : Hash du mot de passe (ne peut pas être déchiffré)

### Via MongoDB Shell (Avancé)

Si tu as accès au shell MongoDB :

```javascript
use onelife
db.admins.find().pretty()
```

Cela affichera tous les admins de manière formatée.

---

## 📋 Informations Stockées pour Chaque Admin

Chaque admin dans la base de données contient :

| Champ | Description | Exemple |
|-------|-------------|---------|
| `_id` | Identifiant unique MongoDB | `507f1f77bcf86cd799439011` |
| `email` | Email de connexion | `admin@onelife.com` |
| `passwordHash` | Hash bcrypt du mot de passe | `$2a$10$...` (ne peut pas être déchiffré) |
| `displayName` | Nom d'affichage | `ONE Life Admin` |
| `role` | Rôle de l'utilisateur | `admin` ou `scanner` |
| `createdAt` | Date de création | `2024-01-15T10:30:00.000Z` |
| `updatedAt` | Date de dernière modification | `2024-01-15T10:30:00.000Z` |

---

## 🔍 Admin par Défaut

Quand l'application démarre pour la première fois, un **admin par défaut** est automatiquement créé avec :
- **Email** : La valeur de `ADMIN_EMAIL` dans les variables d'environnement Render
- **Password** : La valeur de `ADMIN_PASSWORD` dans les variables d'environnement Render
- **Display Name** : `ONE Life Admin`
- **Role** : `admin`

Cet admin est créé automatiquement s'il n'existe pas déjà.

---

## 🛠️ Méthode 4 : Script Node.js (Local)

Un script est disponible pour lister les admins directement depuis la ligne de commande.

### Utilisation

1. **Ouvre un terminal** dans le dossier `server`
2. **Assure-toi d'avoir un fichier `.env`** avec `MONGODB_URI` configuré
3. **Exécute le script** :

```bash
cd server
npm run list-admins
```

**OU directement :**

```bash
cd server
node list-admins.js
```

### Ce que tu verras

Le script affichera :
- Le nombre total d'admins
- Pour chaque admin :
  - Nom d'affichage
  - Email
  - Rôle (👑 Administrateur ou 🔍 Scanner)
  - Date de création
  - ID MongoDB

**Exemple de sortie :**
```
📋 Liste des Administrateurs:

Total: 2 utilisateur(s) admin

────────────────────────────────────────────────────────────────────────────────
1. ONE Life Admin
   📧 Email: admin@onelife.com
   👤 Rôle: 👑 Administrateur
   📅 Créé le: 15/01/2024 10:30:00
   🆔 ID: 507f1f77bcf86cd799439011

2. Scanner User
   📧 Email: scanner@onelife.com
   👤 Rôle: 🔍 Scanner
   📅 Créé le: 16/01/2024 14:20:00
   🆔 ID: 507f1f77bcf86cd799439012
────────────────────────────────────────────────────────────────────────────────
```

---

## ✅ Résumé Rapide

**Le plus simple** : Va sur ton interface admin → Onglet "👥 Administrateurs"

**Pour voir dans MongoDB** : Atlas → Browse Collections → Collection `admins`

**Pour utiliser l'API** : `GET /api/admin/admins` avec un token d'authentification

---

**💡 Astuce** : Si tu veux voir les admins maintenant, connecte-toi à ton interface admin déployée !

