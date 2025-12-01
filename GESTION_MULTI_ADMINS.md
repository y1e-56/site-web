# 👥 Gestion de Plusieurs Administrateurs

## ✅ Système Implémenté

Le système supporte maintenant **plusieurs administrateurs** ! Chaque admin peut :
- Se connecter avec son propre email et mot de passe
- Gérer les tickets
- Scanner les QR codes
- Gérer les autres administrateurs

## 🎯 Comment Ajouter des Administrateurs

### Méthode 1 : Via l'Interface Admin (Recommandé)

1. **Connectez-vous** en tant qu'admin existant
2. Allez sur le **Dashboard Admin** (`/admin`)
3. Cliquez sur l'onglet **"👥 Administrateurs"**
4. Cliquez sur **"+ Ajouter un admin"**
5. Remplissez le formulaire :
   - **Email** : L'email de l'administrateur (ex: `admin2@onelife.local`)
   - **Mot de passe** : Minimum 6 caractères
   - **Nom d'affichage** : Optionnel (ex: "Admin 2")
6. Cliquez sur **"Créer l'administrateur"**

### Méthode 2 : Via la Base de Données (Avancé)

Vous pouvez aussi créer des admins directement dans MongoDB :

```javascript
// Dans MongoDB
db.admins.insertOne({
  email: "admin2@onelife.local",
  passwordHash: "$2a$10$...", // Hash bcrypt du mot de passe
  displayName: "Admin 2",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**Note** : Pour générer le hash du mot de passe, utilisez bcrypt avec un salt de 10 rounds.

## 📋 Fonctionnalités Disponibles

### Pour Tous les Admins

- ✅ **Gérer les tickets** : Confirmer, générer QR, marquer comme envoyé
- ✅ **Scanner les QR codes** : Valider les entrées
- ✅ **Voir tous les tickets** : Accès complet à la liste
- ✅ **Gérer les administrateurs** : Créer, lister, supprimer

### Sécurité

- 🔒 **Mot de passe haché** : Les mots de passe sont stockés avec bcrypt
- 🔒 **Authentification JWT** : Chaque admin a un token unique
- 🔒 **Protection** : Un admin ne peut pas supprimer son propre compte
- 🔒 **Email unique** : Chaque email ne peut être utilisé qu'une fois

## 🎨 Interface Utilisateur

### Onglets dans le Dashboard

Le dashboard a maintenant **2 onglets** :

1. **🎫 Tickets** : Gestion des tickets (comme avant)
2. **👥 Administrateurs** : Gestion des admins

### Page de Gestion des Admins

- **Liste des admins** : Tableau avec email, nom, date de création
- **Formulaire d'ajout** : Créer de nouveaux admins
- **Suppression** : Bouton pour supprimer un admin (avec confirmation)

## 📊 Structure des Données

### Modèle Admin

```javascript
{
  _id: ObjectId("..."),
  email: "admin@onelife.local",  // Unique, en minuscules
  passwordHash: "$2a$10$...",    // Hash bcrypt
  displayName: "ONE Life Admin", // Optionnel
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentification

### Connexion

Chaque admin se connecte avec :
- **Email** : Son email unique
- **Mot de passe** : Son mot de passe personnel

### Token JWT

Après connexion, chaque admin reçoit un token JWT unique qui :
- Contient son ID et email
- Expire après un certain temps (configurable)
- Est utilisé pour toutes les requêtes authentifiées

## 🚀 Exemple d'Utilisation

### Scénario : 5 Administrateurs

1. **Admin Principal** (créé automatiquement)
   - Email : `admin@onelife.local`
   - Créé au démarrage du serveur

2. **Admin 2** (créé via interface)
   - Email : `admin2@onelife.local`
   - Peut gérer les tickets et les autres admins

3. **Admin 3, 4, 5** (créés de la même manière)
   - Chacun avec son propre email et mot de passe
   - Tous avec les mêmes permissions

### Workflow

```
1. Admin Principal se connecte
2. Va dans "👥 Administrateurs"
3. Crée Admin 2, 3, 4, 5
4. Chaque admin peut maintenant se connecter indépendamment
5. Tous peuvent gérer les tickets et scanner les QR
```

## ⚠️ Points Importants

### Permissions

- **Tous les admins ont les mêmes permissions**
- Il n'y a pas de système de rôles (super-admin, admin, etc.)
- Tous peuvent créer/supprimer d'autres admins

### Sécurité

- **Ne partagez pas les mots de passe**
- **Changez les mots de passe par défaut**
- **Supprimez les admins qui ne sont plus nécessaires**

### Limitations

- Un admin ne peut pas supprimer son propre compte
- L'email doit être unique
- Le mot de passe doit faire au moins 6 caractères

## 🔧 API Endpoints

### GET `/api/admin/admins`
Liste tous les administrateurs (sans les mots de passe)

### POST `/api/admin/admins`
Crée un nouvel administrateur
```json
{
  "email": "admin2@onelife.local",
  "password": "motdepasse123",
  "displayName": "Admin 2"
}
```

### DELETE `/api/admin/admins/:id`
Supprime un administrateur (sauf soi-même)

### POST `/api/admin/change-password`
Change le mot de passe de l'admin connecté
```json
{
  "newPassword": "nouveaumotdepasse123"
}
```

## 📝 Checklist pour 5 Admins

- [ ] Admin principal créé (automatique)
- [ ] Admin 2 créé via interface
- [ ] Admin 3 créé via interface
- [ ] Admin 4 créé via interface
- [ ] Admin 5 créé via interface
- [ ] Tous les admins peuvent se connecter
- [ ] Tous les admins peuvent gérer les tickets
- [ ] Tous les admins peuvent scanner les QR

## ✅ Résumé

**Le système supporte maintenant plusieurs administrateurs !**

- ✅ Création via interface
- ✅ Gestion complète (créer, lister, supprimer)
- ✅ Authentification indépendante pour chaque admin
- ✅ Mêmes permissions pour tous
- ✅ Sécurité avec hachage bcrypt et JWT

**Tous les 5 administrateurs peuvent maintenant utiliser le site indépendamment !** 🎉

