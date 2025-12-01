# Guide de Démarrage - ONE Life

## Problèmes résolus ✅

1. **Erreur 401 (Unauthorized)** - Gestion automatique de l'authentification avec redirection
2. **Erreur 409 (Conflict)** - Messages d'erreur clairs pour les tickets dupliqués
3. **ERR_CONNECTION_REFUSED** - Messages d'erreur explicites quand le serveur n'est pas démarré
4. **Gestion d'erreurs** - Amélioration de tous les messages d'erreur dans l'interface

## Démarrage rapide

### 1. Démarrer le serveur backend

```bash
cd server
npm install  # Si ce n'est pas déjà fait
npm run dev  # Mode développement avec nodemon
# ou
npm start    # Mode production
```

Le serveur devrait démarrer sur `http://localhost:5000`

### 2. Démarrer le client frontend

Dans un nouveau terminal :

```bash
cd client
npm install  # Si ce n'est pas déjà fait
npm run dev  # Mode développement
```

Le client devrait démarrer sur `http://localhost:5173`

### 3. Configuration

Assurez-vous d'avoir un fichier `.env` dans le dossier `server/` avec au minimum :

```env
MONGODB_URI=mongodb://127.0.0.1:27017/onelife
PORT=5000
JWT_SECRET=votre-secret-jwt
ADMIN_EMAIL=admin@onelife.local
ADMIN_PASSWORD=Onelife2025!
```

## Vérification

1. **Serveur** : Ouvrez `http://localhost:5000/health` - devrait retourner `{"ok":true}`
2. **Client** : Ouvrez `http://localhost:5173` - devrait afficher la page publique
3. **Admin** : Allez sur `http://localhost:5173/login` et connectez-vous avec les identifiants admin

## Messages d'erreur améliorés

- **401 Unauthorized** : Redirection automatique vers la page de login
- **409 Conflict** : Message clair "Cette référence de paiement existe déjà"
- **ERR_NETWORK** : Message "Le serveur n'est pas accessible. Vérifiez qu'il est démarré sur le port 5000"
- **Autres erreurs** : Messages explicites selon le type d'erreur

## Dépannage

### Le serveur ne démarre pas

1. Vérifiez que MongoDB est installé et démarré
2. Vérifiez le port 5000 n'est pas déjà utilisé
3. Vérifiez les variables d'environnement dans `.env`

### Erreur 401 persistante

1. Vérifiez que vous êtes connecté (token dans localStorage)
2. Essayez de vous déconnecter et reconnecter
3. Vérifiez que le JWT_SECRET est correct

### Erreur 409 (Conflit)

Cela signifie qu'un ticket avec la même référence de paiement existe déjà. C'est normal si vous essayez de créer un ticket avec une référence déjà utilisée.

