# Configuration du Serveur ONE Life

## Variables d'environnement

Créez un fichier `.env` dans le dossier `server/` avec les variables suivantes :

### Configuration de base

```env
# MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/onelife

# Serveur
PORT=5000
NODE_ENV=development

# CORS (séparer par des virgules)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# JWT Secret (changez en production)
JWT_SECRET=super-secret-change-me-in-production

# Admin
ADMIN_EMAIL=admin@onelife.local
ADMIN_PASSWORD=Onelife2025!
```

### Configuration Email (SMTP)

Pour activer l'envoi d'emails avec QR codes :

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-app
MAIL_FROM=tickets@onelife.local
```

**Note pour Gmail** : Vous devez utiliser un "Mot de passe d'application" et non votre mot de passe habituel.

### Configuration WhatsApp Business API

Pour activer l'envoi WhatsApp :

1. Créez une application sur [Facebook Developers](https://developers.facebook.com/)
2. Configurez WhatsApp Business API
3. Obtenez votre token d'accès et Phone Number ID

```env
WHATSAPP_TOKEN=votre-token-d-acces
WHATSAPP_PHONE_ID=votre-phone-number-id
```

### Mode Sandbox

Par défaut, le système est en mode sandbox (les envois sont seulement loggés) :

```env
DELIVERY_SANDBOX=true
```

Pour activer les envois réels, mettez à `false` :

```env
DELIVERY_SANDBOX=false
```

## Dépannage

### Le QR code ne se génère pas

1. Vérifiez que le package `qrcode` est installé : `npm install`
2. Vérifiez les logs du serveur pour voir les erreurs
3. Assurez-vous que MongoDB est connecté

### Les envois ne fonctionnent pas

1. **Mode Sandbox** : Vérifiez que `DELIVERY_SANDBOX=false` si vous voulez des envois réels
2. **Email** : Vérifiez la configuration SMTP dans les logs
3. **WhatsApp** : Vérifiez que `WHATSAPP_TOKEN` et `WHATSAPP_PHONE_ID` sont configurés
4. Consultez les logs du serveur pour les erreurs détaillées

### Logs

Le système affiche maintenant des logs détaillés :
- `[QR]` : Génération de QR codes
- `[TICKET]` : Gestion des tickets
- `[DELIVERY]` : Livraison des QR codes
- `[EMAIL]`, `[WHATSAPP]`, `[SMS]` : Envois par canal
- `[ADMIN]` : Actions admin

